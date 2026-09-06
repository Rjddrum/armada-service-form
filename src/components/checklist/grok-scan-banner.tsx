import { ScanSearch } from "lucide-react";
import { GROK_STATUS_LABEL, grokReportLine, suggestionForItem, isScanAllowedSlot } from "@/lib/inspection/grok-scan";
import { acceptGrok, editGrok, ignoreGrok, requestGrokScan } from "@/lib/inspection/grok-scan-client";
import { useInspection } from "@/lib/inspection/store";
import { rowNotes } from "@/lib/inspection/status";
import { photoSlotDef } from "@/lib/inspection/photo-slots";

export function GrokScanBanner({ itemId, slots, stepName }: { itemId: string; slots: string[]; stepName: string }) {
  const scans = useInspection((s) => s.draft.grokScan);
  const busy = useInspection((s) => Boolean(s.grokBusy[itemId] || slots.some((sl) => s.grokBusy[photoSlotDef(sl)?.itemId ?? ""])));
  const error = useInspection((s) => s.grokError[itemId] || slots.map((sl) => s.grokError[photoSlotDef(sl)?.itemId ?? ""]).find(Boolean) || "");
  const photos = useInspection((s) => s.photos);
  const notes = useInspection((s) => rowNotes(s.draft, itemId));
  const g = suggestionForItem(scans, itemId, slots);
  const key = g?.itemId || itemId;

  if (busy) {
    return (
      <div className="hud-card space-y-1">
        <p className="traveler-stamp text-xs text-primary">Grok</p>
        <p className="text-sm text-foreground">Grok is looking at this photo… Walk is not blocked.</p>
      </div>
    );
  }

  if (error && !g) {
    return (
      <div className="hud-card space-y-2">
        <p className="text-sm text-foreground">{error}</p>
        <p className="text-sm text-muted-foreground">Set the status yourself. Photo and autosave still count.</p>
      </div>
    );
  }

  if (g && !g.dismissed && !g.confirmed) {
    return (
      <div className="hud-card space-y-3">
        <p className="traveler-stamp text-xs text-primary">Grok suggestion — not a diagnosis. You confirm.</p>
        <p className="text-lg font-semibold tracking-wide">{GROK_STATUS_LABEL[g.suggestedStatus]}</p>
        <p className="text-base leading-snug text-foreground">{g.whatItSees}</p>
        {g.whereOnPhoto ? <p className="text-sm text-muted-foreground">Circle: {g.whereOnPhoto}</p> : null}
        {g.askInspector ? <p className="text-sm text-foreground">{g.askInspector}</p> : null}
        {g.editing ? (
          <p className="text-sm text-muted-foreground">Edit the note, then tap a status. Grok does not submit the item.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => acceptGrok(key, photos)}
              className="tap-56 rounded bg-primary font-semibold text-primary-foreground"
            >
              Accept
            </button>
            <button type="button" onClick={() => editGrok(key)} className="tap-56 rounded border border-border bg-raised font-semibold">
              Edit
            </button>
            <button type="button" onClick={() => ignoreGrok(key)} className="tap-56 rounded border border-border bg-inset font-semibold">
              Ignore
            </button>
          </div>
        )}
      </div>
    );
  }

  const noteScan = notes.trim();
  if (!g && noteScan) {
    return (
      <button
        type="button"
        onClick={() =>
          void requestGrokScan({
            itemId,
            slot: slots[0] || itemId,
            stepName,
            transcript: noteScan,
            auto: false,
            source: "voice",
          })
        }
        className="tap-56 inline-flex w-full items-center justify-center gap-2 rounded border border-border bg-raised font-semibold"
      >
        <ScanSearch className="size-5" />
        Scan note
      </button>
    );
  }

  if (g?.confirmed) {
    const line = grokReportLine(g);
    return line ? <p className="text-sm text-muted-foreground">{line}</p> : null;
  }
  return null;
}

export function ScanPhotoButton({ slot, itemId, stepName }: { slot: string; itemId: string; stepName?: string }) {
  const shot = useInspection((s) => s.photos[slot]);
  const busy = useInspection((s) => Boolean(s.grokBusy[itemId] || s.grokBusy[photoSlotDef(slot)?.itemId ?? ""]));
  if (!shot?.dataUrl) return null;
  if (!isScanAllowedSlot(slot)) return null;
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() =>
        void requestGrokScan({
          itemId,
          slot,
          stepName,
          imageDataUrl: shot.dataUrl,
          auto: false,
          source: "photo",
        })
      }
      className="tap-56 col-span-2 inline-flex items-center justify-center gap-2 rounded border border-border bg-raised text-sm font-semibold disabled:opacity-40"
    >
      <ScanSearch className="size-5" />
      {busy ? "Scanning…" : "Scan photo"}
    </button>
  );
}
