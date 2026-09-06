import { createServerFn } from "@tanstack/react-start";
import {
  parseGrokJson,
  privacyPayload,
  sanitizeSuggestion,
  type GrokModelJson,
} from "./grok-scan";

const SCHEMA = {
  type: "json_schema" as const,
  json_schema: {
    name: "yard_scan",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suggestedStatus: {
          type: "string",
          enum: ["PASS", "MONITOR", "SERVICE SOON", "URGENT", "UNABLE"],
        },
        whatItSees: { type: "string" },
        whereOnPhoto: { type: "string" },
        askInspector: { type: "string" },
      },
      required: ["suggestedStatus", "whatItSees", "whereOnPhoto", "askInspector"],
    },
  },
};

function systemPrompt(): string {
  return [
    "You help a field inspector on a 2005 Nissan Armada VK56DE / RE5R05A.",
    "Return JSON only. Prefill a status. The inspector confirms. You do not submit the item.",
    "suggestedStatus must be one of: PASS, MONITOR, SERVICE SOON, URGENT, UNABLE.",
    "whatItSees: one short sentence. Do not invent measurements (no mm, psi, volts, quarts).",
    "whereOnPhoto: what to circle — caption only.",
    "askInspector: one yes/no question.",
    "If the photo is dark, blurry, or you are unsure: UNABLE and whatItSees = Could not verify from this photo — retake in daylight.",
    "If ATF looks milky/pink or cooler fittings look wet: URGENT and whatItSees = Possible coolant/ATF mix — do not treat as PASS.",
    "Never mention VIN, plates, emails, or people.",
  ].join(" ");
}

function userPrompt(stepName: string, slotLabel: string, transcript: string): string {
  const bits = [
    "Vehicle: 2005 Nissan Armada (VK56DE).",
    `Step: ${stepName || "inspection photo"}.`,
    `Photo: ${slotLabel || "yard photo"}.`,
  ];
  if (transcript.trim()) bits.push(`Inspector voice/note (do not treat speech as URGENT by itself): ${transcript.trim()}`);
  bits.push("Suggest a status from the photo/note.");
  return bits.join(" ");
}

type ChatContent = { type: "text"; text: string } | { type: "image_url"; image_url: { url: string; detail: "low" } };

async function callGrok(
  apiKey: string,
  content: ChatContent[],
  withSchema: boolean,
): Promise<{ ok: true; text: string } | { ok: false; status: number; text: string }> {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      messages: [
        { role: "system", content: systemPrompt() },
        { role: "user", content },
      ],
      temperature: 0,
      max_tokens: 280,
      reasoning_effort: "low",
      ...(withSchema ? { response_format: SCHEMA } : { response_format: { type: "json_object" } }),
    }),
    signal: AbortSignal.timeout(18000),
  });
  const text = await res.text();
  if (!res.ok) return { ok: false, status: res.status, text };
  try {
    const body = JSON.parse(text) as { choices?: { message?: { content?: string } }[] };
    return { ok: true, text: body.choices?.[0]?.message?.content ?? "" };
  } catch {
    return { ok: false, status: res.status, text };
  }
}

export type ScanResult =
  | { ok: true; json: GrokModelJson }
  | { ok: false; error: "unavailable" | "timeout" | "bad-image" | "failed"; message: string };

export const scanYardPhoto = createServerFn({ method: "POST" })
  .validator((d: {
    stepId?: string;
    stepName?: string;
    slotLabel?: string;
    imageDataUrl?: string;
    transcript?: string;
  }) =>
    privacyPayload({
      stepId: d.stepId ?? "",
      stepName: d.stepName ?? "",
      slotLabel: d.slotLabel ?? "",
      imageDataUrl: d.imageDataUrl,
      transcript: d.transcript,
    }),
  )
  .handler(async ({ data }): Promise<ScanResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "unavailable", message: "Grok is not available." };
    if (!data.imageDataUrl && !data.transcript.trim()) {
      return { ok: false, error: "bad-image", message: "Nothing to scan." };
    }
    const content: ChatContent[] = [{ type: "text", text: userPrompt(data.stepName, data.slotLabel, data.transcript) }];
    if (data.imageDataUrl) {
      content.push({ type: "image_url", image_url: { url: data.imageDataUrl, detail: "low" } });
    }
    try {
      let result = await callGrok(apiKey, content, true);
      if (!result.ok && result.status === 400) result = await callGrok(apiKey, content, false);
      if (!result.ok) {
        return { ok: false, error: "failed", message: "Grok could not read this photo." };
      }
      const parsed = parseGrokJson(result.text);
      const clean = sanitizeSuggestion(parsed);
      return {
        ok: true,
        json: {
          suggestedStatus: clean.suggestedStatus === "pass"
            ? "PASS"
            : clean.suggestedStatus === "monitor"
              ? "MONITOR"
              : clean.suggestedStatus === "attention"
                ? "SERVICE SOON"
                : clean.suggestedStatus === "asap"
                  ? "URGENT"
                  : "UNABLE",
          whatItSees: clean.whatItSees,
          whereOnPhoto: clean.whereOnPhoto,
          askInspector: clean.askInspector,
        },
      };
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      if (name === "TimeoutError" || name === "AbortError") {
        return { ok: false, error: "timeout", message: "Grok timed out — set the status yourself." };
      }
      return { ok: false, error: "failed", message: "Grok could not read this photo." };
    }
  });

function dataUrlToBlob(dataUrl: string): Blob | null {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return null;
  try {
    const bin = atob(m[2]!);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: m[1] });
  } catch {
    return null;
  }
}

export type TranscribeResult = { ok: true; text: string } | { ok: false; error: string };

export const transcribeYardVoice = createServerFn({ method: "POST" })
  .validator((d: { audioDataUrl?: string }) => ({
    audioDataUrl:
      typeof d.audioDataUrl === "string" && d.audioDataUrl.startsWith("data:audio/")
        ? d.audioDataUrl.slice(0, 2_000_000)
        : "",
  }))
  .handler(async ({ data }): Promise<TranscribeResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "unavailable" };
    const blob = dataUrlToBlob(data.audioDataUrl);
    if (!blob || blob.size < 200) return { ok: false, error: "empty" };
    try {
      const form = new FormData();
      form.append("file", blob, "note.webm");
      form.append("language", "en");
      const res = await fetch("https://api.x.ai/v1/stt", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
        signal: AbortSignal.timeout(18000),
      });
      if (!res.ok) return { ok: false, error: "failed" };
      const body = (await res.json()) as { text?: string };
      const text = String(body.text ?? "").trim();
      if (!text) return { ok: false, error: "empty" };
      return { ok: true, text: text.slice(0, 2000) };
    } catch {
      return { ok: false, error: "failed" };
    }
  });
