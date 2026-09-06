import { headerComplete, type InspectionDraft } from "./types.ts";
import { oilChangeMode } from "./plan.ts";
import { walkChoiceOf } from "./status.ts";
import { walkQueue } from "./walk.ts";

const VISUAL_SEC = 45;
const MEASURE_SEC = 90;
const ROAD_LOOP_SEC = 180;

/** Measure / photo rows take longer than a glance. */
const MEASURE = new Set([
  "pads",
  "rotors",
  "atf",
  "radiator",
  "atfLines",
  "oilLevel",
  "battery",
  "tread",
  "tireAge",
  "pressures",
  "pedalHeight",
  "coolant",
  "brake",
  "scan",
  "lugTorque",
  "engine.overview",
  "cabin.dash",
  "hoses",
  "master",
  "road.brakes",
  "baseline.sparkPlugs",
  "baseline.coolantService",
  "baseline.brakeFluid",
  "baseline.diffFluid",
  "baseline.seepage",
  "baseline.ucaJoints",
]);

export interface InspectionProgress {
  done: number;
  total: number;
  percent: number;
  remainingSec: number;
  remainingLabel: string;
  line: string;
  reportLine: string;
  ready: boolean;
}

export function itemEstimateSec(id: string): number {
  if (id === "transTable") return ROAD_LOOP_SEC;
  if (MEASURE.has(id)) return MEASURE_SEC;
  return VISUAL_SEC;
}

/** Inspector set a status (including Can’t inspect). Notes/photo alone do not count. */
export function itemComplete(draft: InspectionDraft, id: string): boolean {
  if (id === "result") return Boolean(draft.result.overall);
  return walkChoiceOf(draft, id) !== "";
}

export function formatRemaining(sec: number, opts: { ready: boolean; total: number; done: number }): string {
  if (!opts.ready) return "—";
  if (opts.total <= 0) return "—";
  if (opts.done >= opts.total) return "Done";
  if (sec < 60) return "Less than 1 min";
  const min = Math.round(sec / 60);
  return min === 1 ? "1 min" : `${min} min`;
}

export function inspectionProgress(draft: InspectionDraft): InspectionProgress {
  const ready = headerComplete(draft.header);
  const visit = draft.header.visitType;
  const queue = visit
    ? walkQueue(visit, draft.header.drive, draft.header.plan, oilChangeMode(draft))
    : [];
  const total = queue.length;
  let done = 0;
  let remainingSec = 0;
  for (const card of queue) {
    if (itemComplete(draft, card.id)) done += 1;
    else remainingSec += itemEstimateSec(card.id);
  }
  const percent = total ? Math.round((done / total) * 100) : 0;
  const remainingLabel = formatRemaining(remainingSec, { ready, total, done });
  const line = total ? `${done} / ${total} complete — ${percent}%` : ready ? "0 / 0 complete" : "";
  const reportLine = !total
    ? ""
    : done >= total
      ? `Inspection ${done}/${total} complete`
      : `Inspection ${done}/${total} — unfinished items listed as Not inspected`;
  return { done, total, percent, remainingSec, remainingLabel, line, reportLine, ready };
}
