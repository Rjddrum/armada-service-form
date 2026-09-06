import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { G as sanitizeSuggestion, L as parseGrokJson, U as privacyPayload } from "./grok-scan-1cGQChnJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/grok-scan-api-BSJamlyo.js
var SCHEMA = {
	type: "json_schema",
	json_schema: {
		name: "yard_scan",
		strict: true,
		schema: {
			type: "object",
			additionalProperties: false,
			properties: {
				suggestedStatus: {
					type: "string",
					enum: [
						"PASS",
						"MONITOR",
						"SERVICE SOON",
						"URGENT",
						"UNABLE"
					]
				},
				whatItSees: { type: "string" },
				whereOnPhoto: { type: "string" },
				askInspector: { type: "string" }
			},
			required: [
				"suggestedStatus",
				"whatItSees",
				"whereOnPhoto",
				"askInspector"
			]
		}
	}
};
function systemPrompt() {
	return [
		"You help a field inspector on a 2005 Nissan Armada VK56DE / RE5R05A.",
		"Return JSON only. Prefill a status. The inspector confirms. You do not submit the item.",
		"suggestedStatus must be one of: PASS, MONITOR, SERVICE SOON, URGENT, UNABLE.",
		"whatItSees: one short sentence. Do not invent measurements (no mm, psi, volts, quarts).",
		"whereOnPhoto: what to circle — caption only.",
		"askInspector: one yes/no question.",
		"If the photo is dark, blurry, or you are unsure: UNABLE and whatItSees = Could not verify from this photo — retake in daylight.",
		"If ATF looks milky/pink or cooler fittings look wet: URGENT and whatItSees = Possible coolant/ATF mix — do not treat as PASS.",
		"Never mention VIN, plates, emails, or people."
	].join(" ");
}
function userPrompt(stepName, slotLabel, transcript) {
	const bits = [
		"Vehicle: 2005 Nissan Armada (VK56DE).",
		`Step: ${stepName || "inspection photo"}.`,
		`Photo: ${slotLabel || "yard photo"}.`
	];
	if (transcript.trim()) bits.push(`Inspector voice/note (do not treat speech as URGENT by itself): ${transcript.trim()}`);
	bits.push("Suggest a status from the photo/note.");
	return bits.join(" ");
}
async function callGrok(apiKey, content, withSchema) {
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages: [{
				role: "system",
				content: systemPrompt()
			}, {
				role: "user",
				content
			}],
			temperature: 0,
			max_tokens: 280,
			reasoning_effort: "low",
			...withSchema ? { response_format: SCHEMA } : { response_format: { type: "json_object" } }
		}),
		signal: AbortSignal.timeout(18e3)
	});
	const text = await res.text();
	if (!res.ok) return {
		ok: false,
		status: res.status,
		text
	};
	try {
		return {
			ok: true,
			text: JSON.parse(text).choices?.[0]?.message?.content ?? ""
		};
	} catch {
		return {
			ok: false,
			status: res.status,
			text
		};
	}
}
var scanYardPhoto_createServerFn_handler = createServerRpc({
	id: "60e56da355178ffd4841481c74b0fc5d7ae6372994af8ee75fb2b4d2ae65bc87",
	name: "scanYardPhoto",
	filename: "src/lib/inspection/grok-scan-api.ts"
}, (opts) => scanYardPhoto.__executeServer(opts));
var scanYardPhoto = createServerFn({ method: "POST" }).validator((d) => privacyPayload({
	stepId: d.stepId ?? "",
	stepName: d.stepName ?? "",
	slotLabel: d.slotLabel ?? "",
	imageDataUrl: d.imageDataUrl,
	transcript: d.transcript
})).handler(scanYardPhoto_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "unavailable",
		message: "Grok is not available."
	};
	if (!data.imageDataUrl && !data.transcript.trim()) return {
		ok: false,
		error: "bad-image",
		message: "Nothing to scan."
	};
	const content = [{
		type: "text",
		text: userPrompt(data.stepName, data.slotLabel, data.transcript)
	}];
	if (data.imageDataUrl) content.push({
		type: "image_url",
		image_url: {
			url: data.imageDataUrl,
			detail: "low"
		}
	});
	try {
		let result = await callGrok(apiKey, content, true);
		if (!result.ok && result.status === 400) result = await callGrok(apiKey, content, false);
		if (!result.ok) return {
			ok: false,
			error: "failed",
			message: "Grok could not read this photo."
		};
		const parsed = parseGrokJson(result.text);
		const clean = sanitizeSuggestion(parsed);
		return {
			ok: true,
			json: {
				suggestedStatus: clean.suggestedStatus === "pass" ? "PASS" : clean.suggestedStatus === "monitor" ? "MONITOR" : clean.suggestedStatus === "attention" ? "SERVICE SOON" : clean.suggestedStatus === "asap" ? "URGENT" : "UNABLE",
				whatItSees: clean.whatItSees,
				whereOnPhoto: clean.whereOnPhoto,
				askInspector: clean.askInspector
			}
		};
	} catch (err) {
		const name = err instanceof Error ? err.name : "";
		if (name === "TimeoutError" || name === "AbortError") return {
			ok: false,
			error: "timeout",
			message: "Grok timed out — set the status yourself."
		};
		return {
			ok: false,
			error: "failed",
			message: "Grok could not read this photo."
		};
	}
});
function dataUrlToBlob(dataUrl) {
	const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
	if (!m) return null;
	try {
		const bin = atob(m[2]);
		const bytes = new Uint8Array(bin.length);
		for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
		return new Blob([bytes], { type: m[1] });
	} catch {
		return null;
	}
}
var transcribeYardVoice_createServerFn_handler = createServerRpc({
	id: "a4b120de4b2e437922a31b9946481af9e27c7d91f9b9fba5dba69d8c77b1282b",
	name: "transcribeYardVoice",
	filename: "src/lib/inspection/grok-scan-api.ts"
}, (opts) => transcribeYardVoice.__executeServer(opts));
var transcribeYardVoice = createServerFn({ method: "POST" }).validator((d) => ({ audioDataUrl: typeof d.audioDataUrl === "string" && d.audioDataUrl.startsWith("data:audio/") ? d.audioDataUrl.slice(0, 2e6) : "" })).handler(transcribeYardVoice_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "unavailable"
	};
	const blob = dataUrlToBlob(data.audioDataUrl);
	if (!blob || blob.size < 200) return {
		ok: false,
		error: "empty"
	};
	try {
		const form = new FormData();
		form.append("file", blob, "note.webm");
		form.append("language", "en");
		const res = await fetch("https://api.x.ai/v1/stt", {
			method: "POST",
			headers: { Authorization: `Bearer ${apiKey}` },
			body: form,
			signal: AbortSignal.timeout(18e3)
		});
		if (!res.ok) return {
			ok: false,
			error: "failed"
		};
		const body = await res.json();
		const text = String(body.text ?? "").trim();
		if (!text) return {
			ok: false,
			error: "empty"
		};
		return {
			ok: true,
			text: text.slice(0, 2e3)
		};
	} catch {
		return {
			ok: false,
			error: "failed"
		};
	}
});
//#endregion
export { scanYardPhoto_createServerFn_handler, transcribeYardVoice_createServerFn_handler };
