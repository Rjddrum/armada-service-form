import { useEffect, useRef, useState, createContext, useContext, type ReactNode } from "react";
import { BookOpen, Camera, Check, Lock, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCountdown } from "@/lib/utils";
import { OIL_WAIT_MS, oilWaitReady } from "@/lib/inspection/types";
import { useInspection } from "@/lib/inspection/store";
import { compressPhoto } from "@/lib/inspection/photos";
import { hasPhoto, isRequiredPhotoSlot, PHOTO_CORNERS, photoSkipReason, photoSlotDef, flagPhotoSlot } from "@/lib/inspection/photo-slots";
import { PhotoMarkup } from "@/components/checklist/photo-markup";
import { RepairBlock } from "@/components/checklist/repair-block";
import { PlainButton } from "@/components/guide/plain-sheet";
import { STATUS_OPTIONS, rowStatus, setManualStatus, statusIdFromGuide } from "@/lib/inspection/status";
import type { ItemStatus } from "@/lib/inspection/types";
import { ScanPhotoButton } from "@/components/checklist/grok-scan-banner";
import { isAutoScanSlot } from "@/lib/inspection/grok-scan";
import { requestGrokScan } from "@/lib/inspection/grok-scan-client";

export const WalkEmbed = createContext(false);

export function ConfirmPair({
  onCancel,
  onConfirm,
  confirmLabel = "Delete",
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button type="button" onClick={onCancel} className="tap-56 rounded border border-border bg-raised font-semibold">
        Cancel
      </button>
      <button type="button" onClick={onConfirm} className="tap-56 rounded bg-fail font-semibold text-foreground">
        {confirmLabel}
      </button>
    </div>
  );
}


export function CheckHit({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      data-on={on ? "true" : "false"}
      className={cn(
        "check-hit grid size-14 shrink-0 place-items-center border-2",
        on ? "border-pass bg-pass text-background" : "border-line bg-inset text-transparent",
        className,
      )}
    >
      <Check className="size-7" strokeWidth={3} />
    </span>
  );
}

export const VERDICT_OPTIONS = [
  { value: "pass", label: "Pass" },
  { value: "fail", label: "Fail" },
];

export function VerdictSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ChipSelect
      label="Grade — Pass or Fail, not a note"
      value={value}
      options={VERDICT_OPTIONS}
      onChange={onChange}
    />
  );
}

export function ChipSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label?: string;
  value: string;
  options: { value: string; label: string; disabled?: boolean }[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      {label ? <p className="field-label">{label}</p> : null}
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = value === o.value;
          const locked = disabled || o.disabled;
          return (
            <button
              key={o.value}
              type="button"
              disabled={locked}
              onClick={() => onChange(active ? "" : o.value)}
              className={cn(
                "tap-56 rounded border px-3 text-sm font-semibold",
                active ? "chip-on" : "chip-off",
                locked && "opacity-40",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  disabled,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal";
  disabled?: boolean;
  id?: string;
}) {
  const numeric = inputMode === "numeric" || inputMode === "decimal";
  function bump(dir: number) {
    const n = Number(String(value).replace(/[^\d.-]/g, ""));
    const step = inputMode === "decimal" ? 0.1 : 1;
    const next = (Number.isFinite(n) ? n : 0) + dir * step;
    const rounded = inputMode === "decimal" ? Math.round(next * 10) / 10 : Math.round(next);
    onChange(String(rounded));
  }
  return (
    <label className="block space-y-1.5">
      <span className="field-label">{label}</span>
      {numeric ? (
        <div className="flex gap-2">
          <button type="button" disabled={disabled} onClick={() => bump(-1)} className="tap-56 shrink-0 rounded border border-border bg-raised text-xl font-bold" aria-label="Decrease">
            −
          </button>
          <input
            id={id}
            value={value}
            disabled={disabled}
            inputMode={inputMode}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="field-input min-w-0 flex-1 text-center text-lg placeholder:text-muted-foreground"
          />
          <button type="button" disabled={disabled} onClick={() => bump(1)} className="tap-56 shrink-0 rounded border border-border bg-raised text-xl font-bold" aria-label="Increase">
            +
          </button>
        </div>
      ) : (
        <input
          id={id}
          value={value}
          disabled={disabled}
          inputMode={inputMode}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="field-input placeholder:text-muted-foreground"
        />
      )}
    </label>
  );
}

export function NotesField({
  value,
  onChange,
  placeholder = "Notes",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="field-input min-h-14 py-2 placeholder:text-faint"
    />
  );
}

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

export function StatusSelect({ id }: { id: string }) {
  const value = useInspection((s) => rowStatus(s.draft, id));
  const patch = useInspection((s) => s.patch);
  return (
    <div className="space-y-1.5">
      <p className="field-label">Status</p>
      <div className="grid grid-cols-2 gap-2">
        {STATUS_OPTIONS.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() =>
                patch((d) => {
                  setManualStatus(d, id, o.value as ItemStatus);
                })
              }
              data-status={o.value}
              data-on={active ? "true" : "false"}
              className={cn("chip-status tap-56 rounded border px-2 text-sm font-bold tracking-wide", active ? "" : "chip-off")}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function GuideLink({ id, label }: { id: string; label: string }) {
  const jumpToGuide = useInspection((s) => s.jumpToGuide);
  return (
    <button
      type="button"
      onClick={() => jumpToGuide(id)}
      className="tap-56 inline-flex shrink-0 items-center gap-1 rounded border border-border bg-raised px-3 font-semibold text-foreground"
      aria-label={`Open How-To for ${label}`}
    >
      <BookOpen className="size-5" />
      Guide
    </button>
  );
}

export function ItemBlock({
  title,
  hint,
  guideId,
  checked,
  onChecked,
  notes,
  onNotes,
  photoSlot,
  photoRequired,
  locked,
  children,
}: {
  title: string;
  hint?: string;
  guideId?: string;
  checked: boolean;
  onChecked: (v: boolean) => void;
  notes: string;
  onNotes: (v: string) => void;
  photoSlot?: string;
  photoRequired?: boolean;
  locked?: boolean;
  children?: ReactNode;
}) {
  const embed = useContext(WalkEmbed);
  const jumpToGuide = useInspection((s) => s.jumpToGuide);
  const statusId = guideId ? statusIdFromGuide(guideId) : "";
  const grade = useInspection((s) => (statusId ? rowStatus(s.draft, statusId) : "na"));
  const extraSlot =
    !photoSlot && (grade === "attention" || grade === "asap") && statusId
      ? flagPhotoSlot(statusId)
      : undefined;
  const slot = photoSlot || extraSlot;
  if (embed) {
    return (
      <div className="space-y-3">
        {locked ? (
          <p className="flex items-center gap-1 text-xs text-warn">
            <Lock className="size-3.5" /> Locked until the factory method finishes
          </p>
        ) : null}
        {children}
      </div>
    );
  }
  return (
    <div className="hud-card space-y-3">
      <div className="flex items-start gap-3">
        <button
          type="button"
          disabled={locked}
          onClick={() => onChecked(!checked)}
          className="tap-56 shrink-0"
          aria-pressed={checked}
          aria-label={title}
        >
          <CheckHit on={checked} className={locked ? "opacity-40" : undefined} />
        </button>
        <div className="min-w-0 flex-1 pt-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-snug text-foreground">{title}</h3>
            {guideId ? (
              <button
                type="button"
                onClick={() => jumpToGuide(guideId)}
                className="tap-56 inline-flex shrink-0 items-center gap-1 rounded border border-border bg-raised px-3 font-semibold"
                aria-label={`Open How-To for ${title}`}
              >
                <BookOpen className="size-5" />
                Guide
              </button>
            ) : null}
          </div>
          {guideId ? <PlainButton id={guideId} title={title} /> : null}
          {hint ? <p className="mt-1 text-sm leading-snug text-muted-foreground">{hint}</p> : null}
          {locked ? (
            <p className="mt-1 flex items-center gap-1 text-xs text-warn">
              <Lock className="size-3.5" /> Locked until the factory method finishes
            </p>
          ) : null}
        </div>
      </div>
      {guideId && statusIdFromGuide(guideId) ? <StatusSelect id={statusIdFromGuide(guideId)} /> : null}
      {children}
      {slot ? <PhotoField slot={slot} required={photoRequired} label={photoSlotDef(slot)?.label} /> : null}
      {statusId ? <RepairBlock id={statusId} /> : null}
      <NotesField value={notes} onChange={onNotes} />
    </div>
  );
}

function useTickingNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [active]);
  return now;
}

export function useOilWaitReady() {
  const startedAt = useInspection((s) => s.draft.oilWaitStartedAt);
  const now = useTickingNow(startedAt != null && !oilWaitReady(startedAt));
  return oilWaitReady(startedAt, now);
}

export function OilWaitGate({ children }: { children: ReactNode }) {
  const startedAt = useInspection((s) => s.draft.oilWaitStartedAt);
  const patch = useInspection((s) => s.patch);
  const now = useTickingNow(startedAt != null && !oilWaitReady(startedAt));
  const ready = oilWaitReady(startedAt, now);
  const remaining = startedAt == null ? OIL_WAIT_MS : Math.max(0, OIL_WAIT_MS - (now - startedAt));

  if (startedAt == null) {
    return (
      <div className="hud-card space-y-3 border-warn bg-warn-dim">
        <p className="traveler-stamp text-xs text-warn">Engine off — wait 10+ minutes</p>
        <p className="text-sm leading-relaxed text-foreground">
          Key OFF. Wait MORE THAN 10 MINUTES so oil drains back to the pan. Then the dipstick. Do not cheat
          this.
        </p>
        <button
          type="button"
          onClick={() =>
            patch((d) => {
              d.oilWaitStartedAt = Date.now();
            })
          }
          className="tap-56 w-full rounded bg-primary px-3 text-sm font-semibold text-primary-foreground"
        >
          Engine is off — start 10 min wait
        </button>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="hud-card space-y-3 border-warn bg-warn-dim">
        <p className="traveler-stamp text-xs text-warn">Engine off — wait 10+ minutes</p>
        <p className="reading text-center text-4xl text-primary" aria-live="polite">
          {formatCountdown(remaining)}
        </p>
        <p className="text-center text-sm text-muted-foreground">Oil is draining back. Dipstick stays locked.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="traveler-stamp text-xs text-pass">Oil drained back · dipstick unlocked</p>
      {children}
    </div>
  );
}

const ATF_STEPS = [
  {
    key: "atfIdle" as const,
    label: "Engine idling in Park",
    hint: "Level pavement. Idle only. Never check ATF with the engine off.",
  },
  {
    key: "atfCycled" as const,
    label: "Shifted P → R → N → D → P",
    hint: "Foot on the brake. Pause one second in each. Back to Park.",
  },
  {
    key: "atfHot" as const,
    label: "Engine still idling, HOT read",
    hint: "After a drive. HOT marks. Stick inserted reversed.",
  },
];

export function AtfRitualGate({ children }: { children: ReactNode }) {
  const idle = useInspection((s) => s.draft.atfIdle);
  const cycled = useInspection((s) => s.draft.atfCycled);
  const hot = useInspection((s) => s.draft.atfHot);
  const patch = useInspection((s) => s.patch);
  const flags = { atfIdle: idle, atfCycled: cycled, atfHot: hot };
  const ready = idle && cycled && hot;

  return (
    <div className="space-y-3">
      <p className="traveler-stamp text-xs text-primary">Idle, shift P-R-N-D, then HOT read</p>
      {ATF_STEPS.map((step, i) => {
        const prevOk = i === 0 ? true : flags[ATF_STEPS[i - 1]!.key];
        const on = flags[step.key];
        return (
          <button
            key={step.key}
            type="button"
            disabled={!prevOk}
            onClick={() =>
              patch((d) => {
                d[step.key] = !d[step.key];
                if (step.key === "atfIdle" && !d.atfIdle) {
                  d.atfCycled = false;
                  d.atfHot = false;
                }
                if (step.key === "atfCycled" && !d.atfCycled) d.atfHot = false;
              })
            }
            className={cn(
              "flex w-full items-start gap-3 rounded border p-3 text-left",
              on ? "border-pass bg-pass-dim" : "border-border bg-inset",
              !prevOk && "opacity-40",
            )}
          >
            <CheckHit on={on} />
            <span className="min-w-0 pt-1">
              <span className="block font-medium leading-snug text-foreground">{step.label}</span>
              <span className="mt-1 block text-sm leading-snug text-muted-foreground">{step.hint}</span>
            </span>
          </button>
        );
      })}
      {ready ? (
        children
      ) : (
        <p className="text-sm text-muted-foreground">ATF dipstick stays locked until all three are marked.</p>
      )}
    </div>
  );
}
