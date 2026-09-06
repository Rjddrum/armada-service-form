import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { CheckRowById } from "@/components/checklist/items";
import { PhotoField, NotesField, WalkEmbed } from "@/components/ui/fields";
import { RepairBlock } from "@/components/checklist/repair-block";
import { VoiceNote } from "@/components/checklist/voice-note";
import { GuideDiagram } from "@/lib/guide/diagrams";
import { plainFor } from "@/lib/guide/plain";
import { useInspection } from "@/lib/inspection/store";
import { walkQueue, type WalkCard } from "@/lib/inspection/walk";
import { oilChangeMode } from "@/lib/inspection/plan";
import {
  applyWalkChoice,
  rowNotes,
  rowStatus,
  setRowNotes,
  walkChoiceOf,
  type WalkChoice,
} from "@/lib/inspection/status";
import {
  hasPhoto,
  isRequiredPhotoSlot,
  missingRequiredPhotos,
  photoSkipReason,
  photoSlotDef,
  photoSlotsForItem,
  shotOk,
} from "@/lib/inspection/photo-slots";
import { headerComplete } from "@/lib/inspection/types";
import { cn } from "@/lib/utils";
import { GrokScanBanner } from "@/components/checklist/grok-scan-banner";
import { markGrokConfirmedIfEditing } from "@/lib/inspection/grok-scan-client";

const WALK_CHIPS: { value: WalkChoice; label: string; status: string }[] = [
  { value: "pass", label: "PASS", status: "pass" },
  { value: "monitor", label: "MONITOR", status: "monitor" },
  { value: "attention", label: "SERVICE SOON", status: "attention" },
  { value: "asap", label: "URGENT", status: "asap" },
  { value: "na", label: "N/A", status: "na" },
  { value: "unable", label: "UNABLE", status: "unable" },
];

const NOTE_CHIPS = [
  "seepage",
  "dry",
  "inner pad thin",
  "wet fitting",
  "rattle gone after 2s",
  "original radiator",
  "no glitter",
];

function slotsFor(id: string) {
  return photoSlotsForItem(id).filter((s) => photoSlotDef(s));
}

function requiredSlots(id: string) {
  return slotsFor(id).filter((s) => isRequiredPhotoSlot(s) || photoSlotDef(s)?.required);
}

function stepReady(card: WalkCard, draft: ReturnType<typeof useInspection.getState>["draft"], photos: ReturnType<typeof useInspection.getState>["photos"], reason: string): { ok: boolean; why: string } {
  if (card.id === "result") {
    if (!draft.result.overall) return { ok: false, why: "Set the overall call" };
    const missing = missingRequiredPhotos(draft, photos);
    if (missing.length) return { ok: false, why: `${missing.length} photos still required` };
    return { ok: true, why: "" };
  }
  const choice = walkChoiceOf(draft, card.id);
  if (!choice) return { ok: false, why: "Set a status" };
  const need = requiredSlots(card.id);
  if (choice === "na" || choice === "unable") {
    if (need.length && !reason.trim() && need.some((s) => !photoSkipReason(draft, s))) {
      return { ok: false, why: "Add a reason" };
    }
    return { ok: true, why: "" };
  }
  for (const slot of need) {
    const def = photoSlotDef(slot);
    if (!def) continue;
    if (shotOk(photos[slot]) || (def && hasPhoto(photos, def))) continue;
    if (photoSkipReason(draft, slot)) continue;
    return { ok: false, why: "Take the photo, or mark UNABLE with a reason" };
  }
  return { ok: true, why: "" };
}

function WalkStatus({ id }: { id: string }) {
  const choice = useInspection((s) => walkChoiceOf(s.draft, id));
  const mapped = useInspection((s) => rowStatus(s.draft, id));
  const photos = useInspection((s) => s.photos);
  const patch = useInspection((s) => s.patch);
  return (
    <div className="space-y-2">
      <p className="field-label">Status</p>
      <div className="grid grid-cols-2 gap-2">
        {WALK_CHIPS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => {
              patch((d) => {
                applyWalkChoice(d, id, o.value, photos);
              });
              markGrokConfirmedIfEditing(id);
              useInspection.getState().flushPersist();
            }}
            data-status={o.status}
            data-on={choice === o.value ? "true" : "false"}
            className={cn("chip-status tap-56 rounded border px-2 text-sm font-bold tracking-wide", choice === o.value ? "" : "chip-off")}
          >
            {o.label}
          </button>
        ))}
      </div>
      {mapped === "asap" ? (
        <p className="text-sm leading-snug text-fail">URGENT — factory range or a do-not-drive gate fired.</p>
      ) : mapped === "attention" ? (
        <p className="text-sm leading-snug text-attention">SERVICE SOON — truck can still be driven.</p>
      ) : null}
    </div>
  );
}

function WalkCardView({ card, index, total }: { card: WalkCard; index: number; total: number }) {
  const draft = useInspection((s) => s.draft);
  const photos = useInspection((s) => s.photos);
  const patch = useInspection((s) => s.patch);
  const setSkip = useInspection((s) => s.setPhotoSkip);
  const jumpToGuide = useInspection((s) => s.jumpToGuide);
  const openPlain = useInspection((s) => s.openPlain);
  const choice = walkChoiceOf(draft, card.id);
  const notes = rowNotes(draft, card.id);
  const plain = card.guideId ? plainFor(card.guideId) : undefined;
  const slots = slotsFor(card.id);
  const required = requiredSlots(card.id);
  const skipText = required.map((s) => photoSkipReason(draft, s)).find(Boolean) ?? "";
  const [reason, setReason] = useState(skipText);

  useEffect(() => {
    setReason(skipText);
  }, [card.id, skipText]);

  function applyReason(v: string) {
    setReason(v);
    for (const slot of required) setSkip(slot, v);
  }

  const isResult = card.id === "result";
  const showFields = card.id !== "engine.overview" && card.id !== "cabin.dash";

  return (
    <div className="space-y-4">
      <div className="hud-card space-y-2">
        <p className="traveler-stamp text-xs text-primary">
          Step {index + 1} of {total} · {card.stageNum}. {card.section}
        </p>
        <h2 className="text-xl font-semibold text-balance text-foreground">{card.shopTitle}</h2>
        {card.plainTitle ? <p className="text-base text-foreground">{card.plainTitle}</p> : null}
        {card.guideId ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => openPlain(card.guideId!)}
              className="tap-56 inline-flex items-center justify-center gap-2 rounded border border-border bg-raised font-semibold"
            >
              <Info className="size-5" />
              Meaning
            </button>
            <button
              type="button"
              onClick={() => jumpToGuide(card.guideId!)}
              className="tap-56 inline-flex items-center justify-center gap-2 rounded border border-border bg-raised font-semibold"
            >
              <BookOpen className="size-5" />
              Guide
            </button>
          </div>
        ) : null}
      </div>

      {plain ? (
        <GuideDiagram kind={plain.diagram} />
      ) : card.id === "engine.overview" ? (
        <GuideDiagram kind="engine" />
      ) : card.id === "cabin.dash" ? (
        <GuideDiagram kind="cabin" />
      ) : card.id === "transTable" ? (
        <GuideDiagram kind="trans" />
      ) : null}

      {slots.length ? (
        <div className="space-y-3">
          {slots.map((slot) => (
            <PhotoField key={slot} slot={slot} required={isRequiredPhotoSlot(slot)} label={photoSlotDef(slot)?.label} />
          ))}
        </div>
      ) : null}

      {card.lookFor.length ? (
        <div className="hud-card space-y-2">
          <p className="field-label">What to look for</p>
          <ul className="space-y-1.5 text-base leading-relaxed text-foreground">
            {card.lookFor.map((b) => (
              <li key={b}>• {b}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {showFields ? (
        <WalkEmbed.Provider value={true}>
          <CheckRowById id={card.id} />
        </WalkEmbed.Provider>
      ) : null}

      {isResult ? null : <WalkStatus id={card.id} />}

      {isResult ? null : <GrokScanBanner itemId={card.id} slots={slots} stepName={card.shopTitle} />}

      {(choice === "na" || choice === "unable") && required.length ? (
        <NotesField value={reason} onChange={applyReason} placeholder="Why you can’t inspect this (required)" />
      ) : null}

      {isResult ? null : (
        <div className="space-y-2">
          <p className="field-label">Quick notes</p>
          <div className="flex flex-wrap gap-2">
            {NOTE_CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() =>
                  patch((d) => {
                    const cur = rowNotes(d, card.id);
                    if (cur.includes(c)) return;
                    setRowNotes(d, card.id, cur ? `${cur} · ${c}` : c);
                  })
                }
                className="tap-56 rounded border border-border bg-inset px-3 text-sm font-medium"
              >
                {c}
              </button>
            ))}
          </div>
          <NotesField
            value={notes}
            onChange={(v) =>
              patch((d) => {
                setRowNotes(d, card.id, v);
              })
            }
            placeholder="Optional note"
          />
          <VoiceNote rowId={card.id} />
        </div>
      )}

      {choice === "attention" || choice === "asap" ? <RepairBlock id={card.id} /> : null}
    </div>
  );
}

function useWakeLock(on: boolean) {
  useEffect(() => {
    if (!on || typeof navigator === "undefined" || !("wakeLock" in navigator)) return;
    let sent: WakeLockSentinel | null = null;
    let dead = false;
    async function grab() {
      try {
        sent = await navigator.wakeLock.request("screen");
      } catch {
        sent = null;
      }
    }
    void grab();
    const vis = () => {
      if (document.visibilityState === "visible" && !dead) void grab();
    };
    document.addEventListener("visibilitychange", vis);
    return () => {
      dead = true;
      document.removeEventListener("visibilitychange", vis);
      void sent?.release();
    };
  }, [on]);
}

export function WalkView() {
  const walkIndex = useInspection((s) => s.walkIndex);
  const setWalkIndex = useInspection((s) => s.setWalkIndex);
  const visit = useInspection((s) => s.draft.header.visitType);
  const drive = useInspection((s) => s.draft.header.drive);
  const plan = useInspection((s) => s.draft.header.plan);
  const oilChange = useInspection((s) => oilChangeMode(s.draft));
  const draft = useInspection((s) => s.draft);
  const photos = useInspection((s) => s.photos);
  const markSubmitted = useInspection((s) => s.markSubmitted);
  const goHome = useInspection((s) => s.goHome);
  const openResults = useInspection((s) => s.openResults);
  const saveError = useInspection((s) => s.saveError);
  const queue = walkQueue(visit, drive, plan, oilChange);
  const idx = Math.min(Math.max(0, walkIndex), Math.max(0, queue.length - 1));
  const card = queue[idx];
  useWakeLock(true);

  useEffect(() => {
    if (queue.length && walkIndex !== idx) setWalkIndex(idx);
  }, [queue.length, walkIndex, idx, setWalkIndex]);

  const touch = useRef<{ x: number; y: number } | null>(null);

  if (!card) {
    return <p className="text-base text-foreground">Pick a visit type to start the walk.</p>;
  }

  const skipReason = requiredSlots(card.id).map((s) => photoSkipReason(draft, s)).find(Boolean) ?? "";
  const ready = stepReady(card, draft, photos, skipReason);
  const last = idx >= queue.length - 1;
  const first = idx <= 0;
  const blocked = Boolean(saveError) || !ready.ok;

  function go(next: number) {
    setWalkIndex(Math.max(0, Math.min(queue.length - 1, next)));
    useInspection.getState().flushPersist();
  }

  function finish() {
    if (headerComplete(draft.header)) markSubmitted("idle");
    else openResults();
    useInspection.getState().flushPersist();
  }

  return (
    <div
      className="space-y-4 pb-32"
      onTouchStart={(e) => {
        const t = e.changedTouches[0];
        if (t) touch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const t = e.changedTouches[0];
        const start = touch.current;
        touch.current = null;
        if (!t || !start) return;
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0 && !blocked && !last) go(idx + 1);
        if (dx > 0 && first) goHome();
        if (dx > 0 && !first) go(idx - 1);
      }}
    >
      <WalkCardView card={card} index={idx} total={queue.length} />

      <div className="sticky bottom-0 z-20 -mx-4 border-t border-border bg-background px-4 py-3">
        {saveError ? <p className="mb-2 text-sm font-medium text-fail">{saveError}</p> : null}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => (first ? goHome() : go(idx - 1))}
            className="tap-56 flex flex-1 items-center justify-center gap-1 rounded border border-border bg-raised font-semibold"
          >
            <ChevronLeft className="size-5" />
            {first ? "Home" : "Previous"}
          </button>
          {last ? (
            <button
              type="button"
              disabled={blocked}
              onClick={finish}
              className="tap-56 flex flex-[1.4] items-center justify-center gap-1 rounded bg-primary font-semibold text-primary-foreground disabled:opacity-40"
            >
              {saveError ? "Fix save" : ready.ok ? "See results" : ready.why || "See results"}
            </button>
          ) : (
            <button
              type="button"
              disabled={blocked}
              onClick={() => go(idx + 1)}
              className="tap-56 flex flex-[1.4] items-center justify-center gap-1 rounded bg-primary font-semibold text-primary-foreground disabled:opacity-40"
            >
              {saveError ? "Fix save" : ready.ok ? "Next" : ready.why || "Next"}
              <ChevronRight className="size-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
