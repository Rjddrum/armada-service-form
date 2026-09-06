import type { ItemStatus } from "./types.ts";
import { photoSlotDef } from "./photo-slots.ts";

export type GrokStatus = "pass" | "monitor" | "attention" | "asap" | "unable";

export interface GrokSuggestion {
  itemId: string;
  slot: string;
  suggestedStatus: GrokStatus;
  whatItSees: string;
  whereOnPhoto: string;
  askInspector: string;
  confirmed: boolean;
  dismissed: boolean;
  editing: boolean;
  source: "photo" | "voice";
  photoHash: string;
  at: number;
}

export interface GrokModelJson {
  suggestedStatus: string;
  whatItSees: string;
  whereOnPhoto: string;
  askInspector: string;
}

export const GROK_STATUS_LABEL: Record<GrokStatus, string> = {
  pass: "PASS",
  monitor: "MONITOR",
  attention: "SERVICE SOON",
  asap: "URGENT",
  unable: "UNABLE",
};

export const UNSURE_LINE = "Could not verify from this photo — retake in daylight.";
export const SMOD_LINE = "Possible coolant/ATF mix — do not treat as PASS.";

/** Required photos that auto-scan. VIN is never sent. */
const AUTO_SCAN_SLOTS = new Set([
  "engine.radiator",
  "engine.atfLines",
  "fluids.atf",
  "brakes.pads.lf",
  "brakes.pads.rf",
  "brakes.pads.lr",
  "brakes.pads.rr",
  "brakes.tread.lf",
  "brakes.tread.rf",
  "brakes.tread.lr",
  "brakes.tread.rr",
  "fluids.oilLeak",
  "engine.overview",
  "cabin.dash",
]);

export function isVinSlot(slot: string): boolean {
  return slot === "header.vin" || /(^|[./])vin($|[./])/i.test(slot);
}

export function isScanAllowedSlot(slot: string): boolean {
  return Boolean(slot) && !isVinSlot(slot);
}

export function isAutoScanSlot(slot: string): boolean {
  return AUTO_SCAN_SLOTS.has(slot) && isScanAllowedSlot(slot);
}

export function photoHash(dataUrl: string): string {
  return `${dataUrl.length}:${dataUrl.slice(16, 48)}:${dataUrl.slice(-24)}`;
}

export function shouldAutoScan(
  existing: GrokSuggestion | undefined,
  slot: string,
  hash: string,
): boolean {
  if (!isAutoScanSlot(slot)) return false;
  if (!existing) return true;
  if (existing.photoHash === hash) return false;
  if (existing.confirmed || existing.dismissed) return false;
  return true;
}

export function parseStatusLabel(raw: string): GrokStatus | null {
  const t = raw.trim().toUpperCase().replace(/[_-]+/g, " ");
  if (t === "PASS") return "pass";
  if (t === "MONITOR") return "monitor";
  if (t === "SERVICE SOON" || t === "ATTENTION" || t === "NEEDS ATTENTION") return "attention";
  if (t === "URGENT" || t === "ASAP" || t === "REPAIR ASAP") return "asap";
  if (t === "UNABLE" || t === "N/A" || t === "NA" || t === "CANT INSPECT" || t === "CAN'T INSPECT") return "unable";
  return null;
}

export function grokStatusToItem(status: GrokStatus): ItemStatus {
  return status;
}

const MEASURE_RE = /\d+(?:\.\d+)?\s*(?:mm|psi|volts?|\bv\b|qt|quarts?|°f|deg)/i;
const SMOD_RE = /\b(milky|pink|sweet|coolant\s*\/\s*atf|atf\s*mix|wet(?:ness)?\s+(?:at\s+)?(?:the\s+)?(?:atf\s+)?(?:cooler\s+)?fittings?)\b/i;

export function looksInventedMeasurement(text: string): boolean {
  return MEASURE_RE.test(text);
}

export function looksSmod(text: string): boolean {
  return SMOD_RE.test(text);
}

export function parseGrokJson(raw: string): GrokModelJson | null {
  const trimmed = raw.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fence ? fence[1]!.trim() : trimmed;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const obj = JSON.parse(body.slice(start, end + 1)) as Record<string, unknown>;
    return {
      suggestedStatus: String(obj.suggestedStatus ?? obj.status ?? ""),
      whatItSees: String(obj.whatItSees ?? obj.sees ?? ""),
      whereOnPhoto: String(obj.whereOnPhoto ?? obj.circle ?? ""),
      askInspector: String(obj.askInspector ?? obj.ask ?? ""),
    };
  } catch {
    return null;
  }
}

function clip(s: string, n: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  return t.slice(0, n - 1).trimEnd() + "…";
}

export function sanitizeSuggestion(raw: GrokModelJson | null): Omit<GrokSuggestion, "itemId" | "slot" | "source" | "photoHash" | "at"> {
  const unsure = {
    suggestedStatus: "unable" as const,
    whatItSees: UNSURE_LINE,
    whereOnPhoto: "Retake in daylight, fill the frame with the part.",
    askInspector: "Is the photo sharp enough to judge this?",
    confirmed: false,
    dismissed: false,
    editing: false,
  };
  if (!raw) return unsure;
  let status = parseStatusLabel(raw.suggestedStatus);
  let sees = clip(raw.whatItSees, 160);
  let where = clip(raw.whereOnPhoto, 120);
  let ask = clip(raw.askInspector, 120);
  if (!status || !sees) return unsure;
  if (looksInventedMeasurement(sees) || looksInventedMeasurement(where)) return unsure;
  if (looksSmod(sees) || looksSmod(where) || looksSmod(ask)) {
    status = "asap";
    sees = SMOD_LINE;
    if (!ask) ask = "Is the ATF milky or just backlit?";
  }
  if (!where) where = "Circle the problem area.";
  if (!ask) ask = "Does this match what you see on the truck?";
  return {
    suggestedStatus: status,
    whatItSees: sees,
    whereOnPhoto: where,
    askInspector: ask,
    confirmed: false,
    dismissed: false,
    editing: false,
  };
}

export function grokReportLine(g: GrokSuggestion | undefined | null): string {
  if (!g || g.dismissed || !g.whatItSees.trim()) return "";
  const tag = g.confirmed ? "Inspector-confirmed" : "Grok suggestion (not confirmed)";
  return `${g.whatItSees} · ${tag}`;
}

export function suggestionForItem(
  scans: Record<string, GrokSuggestion> | undefined,
  itemId: string,
  slots: string[] = [],
): GrokSuggestion | undefined {
  if (!scans) return undefined;
  if (scans[itemId] && !scans[itemId]!.dismissed) return scans[itemId];
  for (const slot of slots) {
    const id = photoSlotDef(slot)?.itemId;
    if (id && scans[id] && !scans[id]!.dismissed) return scans[id];
  }
  return undefined;
}

export function privacyPayload(input: {
  stepId: string;
  stepName: string;
  slotLabel: string;
  imageDataUrl?: string;
  transcript?: string;
}): { stepId: string; stepName: string; slotLabel: string; imageDataUrl: string; transcript: string } {
  const image = typeof input.imageDataUrl === "string" && input.imageDataUrl.startsWith("data:image/")
    ? input.imageDataUrl.slice(0, 1_400_000)
    : "";
  return {
    stepId: String(input.stepId || "").slice(0, 80),
    stepName: String(input.stepName || "").slice(0, 120),
    slotLabel: String(input.slotLabel || "").slice(0, 120),
    imageDataUrl: image,
    transcript: String(input.transcript || "").slice(0, 2000),
  };
}

export function appendNote(cur: string, add: string): string {
  const a = add.trim();
  if (!a) return cur;
  if (cur.includes(a)) return cur;
  return cur.trim() ? `${cur.trim()} · ${a}` : a;
}
