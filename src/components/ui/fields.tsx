import { useEffect, useState, useContext, type ReactNode } from "react";
import { BookOpen, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCountdown } from "@/lib/utils";
import { OIL_WAIT_MS, oilWaitReady } from "@/lib/inspection/types";
import { useInspection } from "@/lib/inspection/store";
import { photoSlotDef, flagPhotoSlot } from "@/lib/inspection/photo-slots";
import { RepairBlock } from "@/components/checklist/repair-block";
import { PhotoField } from "@/components/checklist/photo-field";
import { PlainButton } from "@/components/guide/plain-sheet";
import { STATUS_OPTIONS, rowStatus, setManualStatus, statusIdFromGuide } from "@/lib/inspection/status";
import type { ItemStatus } from "@/lib/inspection/types";
import {
  WalkEmbed,
  ConfirmPair,
  CheckHit,
  VERDICT_OPTIONS,
  VerdictSelect,
  ChipSelect,
  TextField,
  NotesField,
} from "@/components/ui/field-inputs";

export {
  WalkEmbed,
  ConfirmPair,
  CheckHit,
  VERDICT_OPTIONS,
  VerdictSelect,
  ChipSelect,
  TextField,
  NotesField,
};
export { PhotoField, CornerPhotos } from "@/components/checklist/photo-field";

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
