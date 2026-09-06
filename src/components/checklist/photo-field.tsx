import { useContext, useRef, useState } from "react";
import { Camera, Pencil } from "lucide-react";
import { ConfirmPair, NotesField, WalkEmbed } from "@/components/ui/field-inputs";
import { useInspection } from "@/lib/inspection/store";
import { compressPhoto } from "@/lib/inspection/photos";
import { hasPhoto, isRequiredPhotoSlot, PHOTO_CORNERS, photoSkipReason, photoSlotDef } from "@/lib/inspection/photo-slots";
import { PhotoMarkup } from "@/components/checklist/photo-markup";
import { ScanPhotoButton } from "@/components/checklist/grok-scan-banner";
import { isAutoScanSlot } from "@/lib/inspection/grok-scan";
import { requestGrokScan } from "@/lib/inspection/grok-scan-client";

export function PhotoField({ slot, required, label }: { slot: string; required?: boolean; label?: string }) {
  const embed = useContext(WalkEmbed);
  const shot = useInspection((s) => s.photos[slot]);
  const photos = useInspection((s) => s.photos);
  const skip = useInspection((s) => photoSkipReason(s.draft, slot));
  const setPhoto = useInspection((s) => s.setPhoto);
  const clearPhoto = useInspection((s) => s.clearPhoto);
  const setPhotoSkip = useInspection((s) => s.setPhotoSkip);
  const inputRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [marking, setMarking] = useState(false);
  const [skipOpen, setSkipOpen] = useState(false);
  const [skipText, setSkipText] = useState(skip);
  const [confirmClear, setConfirmClear] = useState(false);
  const must = required ?? isRequiredPhotoSlot(slot);
  const title = label || photoSlotDef(slot)?.label || "Photo";
  const def = photoSlotDef(slot);
  const covered = Boolean(shot) || (def ? hasPhoto(photos, def) : false);
  if (embed) return null;

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const compressed = await compressPhoto(file);
      setPhoto(slot, { ...compressed, originalDataUrl: compressed.dataUrl });
      if (isAutoScanSlot(slot) && compressed.dataUrl) {
        void requestGrokScan({
          itemId: def?.itemId || slot,
          slot,
          stepName: title,
          imageDataUrl: compressed.dataUrl,
          auto: true,
          source: "photo",
        });
      }
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
      if (galleryRef.current) galleryRef.current.value = "";
    }
  }

  if (marking && shot) {
    return (
      <PhotoMarkup
        shot={shot}
        onSave={(next) => {
          setPhoto(slot, next);
          setMarking(false);
        }}
        onCancel={() => setMarking(false)}
      />
    );
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
      {shot ? (
        <div className="space-y-2">
          <p className="field-label">{must ? `${title} · required` : title}</p>
          <div className="relative overflow-hidden rounded border border-border">
            <img src={shot.dataUrl} alt={shot.caption || title} className="max-h-40 w-full object-cover outline outline-1 -outline-offset-1 outline-foreground/10" />
          </div>
          {shot.caption ? <p className="text-sm text-foreground">{shot.caption}</p> : null}
          {confirmClear ? (
            <ConfirmPair
              onCancel={() => setConfirmClear(false)}
              onConfirm={() => {
                clearPhoto(slot);
                setConfirmClear(false);
              }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMarking(true)}
                className="tap-56 inline-flex items-center justify-center gap-1 rounded border border-border bg-inset text-sm font-semibold"
              >
                <Pencil className="size-4" />
                Mark up
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="tap-56 rounded border border-fail bg-inset text-sm font-semibold text-fail"
              >
                Delete photo
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
                className="tap-56 col-span-2 rounded border border-border bg-inset text-sm font-semibold"
              >
                Retake
              </button>
              <ScanPhotoButton slot={slot} itemId={def?.itemId || slot} stepName={title} />
            </div>
          )}
        </div>
      ) : skip ? (
        <div className="rounded border border-border bg-inset px-3 py-2 text-sm text-foreground">
          <p className="field-label">{title}</p>
          N/A — {skip}
          <button type="button" className="tap-56 mt-1 block w-full rounded border border-border bg-raised font-semibold text-primary" onClick={() => setPhotoSkip(slot, "")}>
            Clear skip
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="field-label">{must ? `${title} · required` : title}</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="tap-56 flex items-center justify-center gap-2 rounded border border-dashed border-line bg-inset text-sm font-semibold text-foreground"
            >
              <Camera className="size-5" />
              {busy ? "Saving…" : "Camera"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => galleryRef.current?.click()}
              className="tap-56 rounded border border-border bg-raised text-sm font-semibold"
            >
              Gallery
            </button>
          </div>
        </div>
      )}
      {must && !covered && !skip ? (
        <p className="text-sm text-warn">{title}: missing (photo required).</p>
      ) : null}
      {must && !shot && !skip ? (
        skipOpen ? (
          <div className="space-y-2">
            <NotesField value={skipText} onChange={setSkipText} placeholder="Reason this photo is N/A" />
            <button
              type="button"
              onClick={() => {
                if (skipText.trim()) {
                  setPhotoSkip(slot, skipText);
                  setSkipOpen(false);
                }
              }}
              className="tap-56 w-full rounded border border-border bg-inset text-sm font-semibold"
            >
              Save N/A reason
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setSkipOpen(true)} className="tap-56 w-full rounded border border-border bg-raised text-sm font-semibold text-foreground">
            N/A — can’t get this photo
          </button>
        )
      ) : null}
    </div>
  );
}

export function CornerPhotos({ prefix, required }: { prefix: string; required?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {PHOTO_CORNERS.map((c) => (
        <div key={c.key} className="space-y-1">
          <p className="field-label">{c.label}</p>
          <PhotoField slot={`${prefix}.${c.key}`} required={required} label={`${c.label} photo`} />
        </div>
      ))}
    </div>
  );
}
