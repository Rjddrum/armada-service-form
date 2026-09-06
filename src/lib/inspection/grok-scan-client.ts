import { scanYardPhoto, transcribeYardVoice } from "./grok-scan-api";
import {
  appendNote,
  grokStatusToItem,
  isScanAllowedSlot,
  photoHash,
  privacyPayload,
  sanitizeSuggestion,
  shouldAutoScan,
  type GrokSuggestion,
} from "./grok-scan";
import { photoSlotDef } from "./photo-slots";
import { applyWalkChoice, rowNotes, setRowNotes, STATUS_ROW_LABELS } from "./status";
import { useInspection } from "./store";
import type { PhotoShot } from "./photos";

function itemIdOf(slot: string, fallback: string): string {
  return photoSlotDef(slot)?.itemId || fallback || slot;
}

export async function requestGrokScan(opts: {
  itemId: string;
  slot: string;
  stepName?: string;
  imageDataUrl?: string;
  transcript?: string;
  auto?: boolean;
  source: "photo" | "voice";
}): Promise<void> {
  const itemId = itemIdOf(opts.slot, opts.itemId);
  if (opts.source === "photo" && !isScanAllowedSlot(opts.slot)) return;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return;
  const state = useInspection.getState();
  if (state.grokBusy[itemId]) return;
  const hash = opts.imageDataUrl ? photoHash(opts.imageDataUrl) : `voice:${(opts.transcript || "").slice(0, 40)}`;
  if (opts.auto && opts.imageDataUrl && !shouldAutoScan(state.draft.grokScan?.[itemId], opts.slot, hash)) {
    return;
  }
  useInspection.setState({ grokBusy: { ...state.grokBusy, [itemId]: true }, grokError: { ...state.grokError, [itemId]: "" } });
  try {
    const payload = privacyPayload({
      stepId: itemId,
      stepName: opts.stepName || STATUS_ROW_LABELS[itemId] || itemId,
      slotLabel: photoSlotDef(opts.slot)?.label || opts.slot,
      imageDataUrl: opts.imageDataUrl,
      transcript: opts.transcript,
    });
    const res = await scanYardPhoto({ data: payload });
    if (!res.ok) {
      if (!opts.auto) {
        useInspection.setState((s) => ({ grokError: { ...s.grokError, [itemId]: res.message } }));
      }
      return;
    }
    const clean = sanitizeSuggestion(res.json);
    const suggestion: GrokSuggestion = {
      ...clean,
      itemId,
      slot: opts.slot,
      source: opts.source,
      photoHash: hash,
      at: Date.now(),
    };
    state.patch((d) => {
      if (!d.grokScan) d.grokScan = {};
      d.grokScan[itemId] = suggestion;
    });
  } catch {
    if (!opts.auto) {
      useInspection.setState((s) => ({
        grokError: { ...s.grokError, [itemId]: "Grok could not read this photo." },
      }));
    }
  } finally {
    useInspection.setState((s) => {
      const grokBusy = { ...s.grokBusy };
      delete grokBusy[itemId];
      return { grokBusy };
    });
  }
}

function clearGrokError(itemId: string): void {
  useInspection.setState((s) => {
    if (!s.grokError[itemId]) return s;
    const grokError = { ...s.grokError };
    delete grokError[itemId];
    return { grokError };
  });
}

export function acceptGrok(itemId: string, photos: Record<string, PhotoShot | undefined>): void {
  const g = useInspection.getState().draft.grokScan?.[itemId];
  if (!g || g.dismissed) return;
  const status = grokStatusToItem(g.suggestedStatus);
  useInspection.getState().patch((d) => {
    applyWalkChoice(d, itemId, status, photos);
    setRowNotes(d, itemId, appendNote(rowNotes(d, itemId), g.whatItSees));
    if (!d.grokScan) d.grokScan = {};
    d.grokScan[itemId] = { ...g, confirmed: true, editing: false, dismissed: false };
  });
  clearGrokError(itemId);
  if (g.slot && g.whereOnPhoto) {
    const shot = useInspection.getState().photos[g.slot];
    if (shot && !shot.caption?.trim()) {
      useInspection.getState().setPhoto(g.slot, { ...shot, caption: g.whereOnPhoto });
    }
  }
}

export function editGrok(itemId: string): void {
  const g = useInspection.getState().draft.grokScan?.[itemId];
  if (!g) return;
  useInspection.getState().patch((d) => {
    if (!d.grokScan) d.grokScan = {};
    d.grokScan[itemId] = { ...g, editing: true, confirmed: false, dismissed: false };
    setRowNotes(d, itemId, appendNote(rowNotes(d, itemId), g.whatItSees));
  });
  clearGrokError(itemId);
}

export function ignoreGrok(itemId: string): void {
  const g = useInspection.getState().draft.grokScan?.[itemId];
  if (!g) return;
  useInspection.getState().patch((d) => {
    if (!d.grokScan) d.grokScan = {};
    d.grokScan[itemId] = { ...g, dismissed: true, editing: false };
  });
  clearGrokError(itemId);
}

export function markGrokConfirmedIfEditing(itemId: string): void {
  const g = useInspection.getState().draft.grokScan?.[itemId];
  if (!g || !g.editing || g.dismissed) return;
  useInspection.getState().patch((d) => {
    if (!d.grokScan?.[itemId]) return;
    d.grokScan[itemId] = { ...d.grokScan[itemId]!, confirmed: true, editing: false };
  });
}

export async function transcribeIfNeeded(audioDataUrl: string): Promise<string> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return "";
  try {
    const res = await transcribeYardVoice({ data: { audioDataUrl } });
    if (res.ok) return res.text;
  } catch {
    /* offline / unavailable */
  }
  return "";
}
