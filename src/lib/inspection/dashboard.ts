import { formatMiles } from "../utils.ts";
import { isSmodRisk, rowShows, visitLabel, type InspectionDraft, type ItemStatus } from "./types.ts";
import { oilChangeMode, buildPlan } from "./plan.ts";
import { conditionReport, STATUS_ROW_LABELS, type ConditionReport } from "./status.ts";
import { walkQueue, type WalkCard } from "./walk.ts";
import { itemComplete, inspectionProgress, type InspectionProgress } from "./progress.ts";
import { driveGates } from "./drive.ts";
import { missingRequiredPhotos, photosForItem, photoSlotsForItem, PHOTO_SLOTS } from "./photo-slots.ts";
import { walkRowGuideId } from "../guide/catalog.ts";
import { meaningFor } from "../guide/meaning.ts";
import type { MaintRow, MaintFlag } from "./maint.ts";
import type { PhotoShot } from "./photos.ts";
import { repairTable, type RepairRow } from "./repairs.ts";
import { grokReportLine, suggestionForItem } from "./grok-scan.ts";

export type WorryTone = "idle" | "pass" | "watch" | "repairs" | "critical";
export type ResultTone = "incomplete" | "pass" | "watch" | "repairs" | "critical";

export interface Worry {
  tone: WorryTone;
  emoji: string;
  label: string;
  line: string;
}

export interface NextAction {
  text: string;
  walkIndex: number | null;
}

export type HomeFilter = "asap" | "attention" | "monitor" | "pass" | "na";

export interface ResultLine {
  id: string;
  label: string;
  status: ItemStatus | "unset";
  measured: string;
  range: string;
  guideId: string;
  meaning: string;
  photos: { slot: string; shot: PhotoShot }[];
  grokLine: string;
}

export interface HomeModel {
  miles: string;
  date: string;
  inspector: string;
  visit: string;
  vin: string;
  drive: string;
  tow: string;
  worry: Worry;
  score: number | null;
  progress: InspectionProgress;
  counts: { asap: number; attention: number; monitor: number; pass: number; na: number };
  lists: Record<HomeFilter, ResultLine[]>;
  next: NextAction;
  started: boolean;
  submitted: boolean;
  incomplete: boolean;
  repairs: RepairRow[];
  maintFlags: MaintFlag[];
}

const WORRY: Record<WorryTone, Pick<Worry, "emoji" | "label" | "line">> = {
  idle: { emoji: "⚪", label: "Not started", line: "No statuses set yet." },
  pass: { emoji: "🟢", label: "Pass", line: "No Repair ASAP or Needs attention." },
  watch: { emoji: "🟡", label: "Needs attention", line: "Monitor items — no Immediate / Repair ASAP." },
  repairs: { emoji: "🟠", label: "Repairs needed", line: "Needs attention is on the list." },
  critical: { emoji: "🔴", label: "Critical", line: "Repair ASAP, SMOD, or Do not drive." },
};

export const RESULT_CONDITION: Record<ResultTone, { emoji: string; label: string; line: string }> = {
  incomplete: { emoji: "⚪", label: "INCOMPLETE", line: "In-visit items still Not inspected." },
  pass: { emoji: "🟢", label: "PASS", line: "No Repair ASAP or Needs attention." },
  watch: { emoji: "🟡", label: "ATTENTION REQUIRED", line: "Monitor / close to spec." },
  repairs: { emoji: "🟠", label: "REPAIRS RECOMMENDED", line: "Needs attention on this visit." },
  critical: { emoji: "🔴", label: "CRITICAL / DO NOT DRIVE", line: "Repair ASAP, SMOD, or a do-not-drive gate." },
};

export function worryOf(draft: InspectionDraft, report: ConditionReport, done: number): Worry {
  const gates = driveGates(draft);
  if (done === 0) return { tone: "idle", ...WORRY.idle };
  if (report.counts.asap > 0 || gates.length > 0 || isSmodRisk(draft)) return { tone: "critical", ...WORRY.critical };
  if (report.counts.attention > 0) return { tone: "repairs", ...WORRY.repairs };
  if (report.counts.monitor > 0) return { tone: "watch", ...WORRY.watch };
  return { tone: "pass", ...WORRY.pass };
}

function queueOf(draft: InspectionDraft): WalkCard[] {
  const visit = draft.header.visitType;
  if (!visit) return [];
  return walkQueue(visit, draft.header.drive, draft.header.plan, oilChangeMode(draft));
}

export function firstIncompleteIndex(draft: InspectionDraft): number {
  const q = queueOf(draft);
  const i = q.findIndex((c) => !itemComplete(draft, c.id));
  return i < 0 ? Math.max(0, q.length - 1) : i;
}

function stepPhrase(card: WalkCard, oilChange: boolean): string {
  if (card.id === "oilLevel") return oilChange ? "record oil change" : "check engine oil";
  if (card.id === "atf" || card.id === "atfLines" || card.id === "radiator" || card.id === "atfReject") {
    return "inspect transmission cooling system (ATF cooler / radiator)";
  }
  const t = card.shopTitle.trim();
  if (!t) return "continue";
  return t.charAt(0).toLowerCase() + t.slice(1);
}

function startHint(draft: InspectionDraft, log: MaintRow[]): string {
  const miles = formatMiles(draft.header.miles) || draft.header.miles.trim();
  if (!miles) return "Enter miles to recommend the inspection set.";
  const plan = buildPlan(draft, log);
  const due = plan.lines.filter((l) => l.tone === "due" || l.tone === "watch");
  const oil = due.some((l) => l.key === "fluids");
  const brakes = due.some((l) => l.key === "brakes" || l.key === "tires");
  const smod = due.some((l) => l.key === "cooling" || l.key === "trans");
  const bits: string[] = [];
  if (oil) bits.push("Oil");
  if (brakes) bits.push("brakes");
  if (smod) bits.push("SMOD check");
  if (!bits.length) bits.push("A short look-over");
  const head = bits.length === 1 ? bits[0]! : bits.length === 2 ? `${bits[0]} and ${bits[1]}` : `${bits[0]}, ${bits[1]}, and ${bits[2]}`;
  return `${head} recommended at ${miles} miles.`;
}

function jumpForId(draft: InspectionDraft, id: string): number | null {
  const q = queueOf(draft);
  const rid = id.startsWith("trans.") ? "transTable" : id === "header" ? "" : id;
  if (!rid) return 0;
  const i = q.findIndex((c) => c.id === rid || c.id === id);
  return i < 0 ? null : i;
}

export function visitItemStatus(draft: InspectionDraft, id: string): ItemStatus | "unset" {
  if (id === "result") {
    const o = draft.result?.overall;
    if (!o) return "unset";
    if (o === "do-not-drive") return "asap";
    if (o === "schedule") return "attention";
    if (o === "pass-notes") return "monitor";
    return "pass";
  }
  const cur = draft.itemStatus?.[id];
  if (!cur) return "unset";
  if (!cur.manual && cur.value === "na") return "unset";
  return cur.value;
}

function smodDriveNow(draft: InspectionDraft): boolean {
  if (isSmodRisk(draft)) return true;
  return draft.engine?.atfLines?.wetFittings === "Y";
}

export function nextAction(
  draft: InspectionDraft,
  photos: Record<string, PhotoShot | undefined> = {},
  log: MaintRow[] = [],
): NextAction {
  const oilChange = oilChangeMode(draft);
  const q = queueOf(draft);
  const progress = inspectionProgress(draft);
  const gates = driveGates(draft);

  if (isSmodRisk(draft) || gates.some((g) => g.id === "smod" || g.guideId.includes("atf"))) {
    return {
      text: "Inspect transmission cooling system (ATF cooler / radiator)",
      walkIndex: jumpForId(draft, "atf") ?? jumpForId(draft, "atfLines"),
    };
  }
  const stop = gates[0];
  if (stop) {
    const idx = jumpForId(draft, stop.guideId) ?? firstIncompleteIndex(draft);
    const card = q[idx];
    return {
      text: card ? `Continue inspection — Step ${idx + 1}, ${stepPhrase(card, oilChange)}` : stop.label,
      walkIndex: idx,
    };
  }

  const missing = missingRequiredPhotos(draft, photos).filter((m) => m.slot !== "header.vin");
  if (progress.done > 0 && missing[0]) {
    const slot = missing[0].slot;
    const def = PHOTO_SLOTS.find((s) => s.slot === slot);
    const label = missing[0].label.replace(/ photo$/i, "").toLowerCase();
    return {
      text: `Take required photo: ${label}`,
      walkIndex: jumpForId(draft, def?.itemId ?? slot) ?? firstIncompleteIndex(draft),
    };
  }

  const smodOn = rowShows("smodPlan", draft.header.visitType, draft.header.drive, draft.header.plan);
  const rad = draft.result?.smodPlan?.radiatorLast ?? "";
  const radUnknown = smodOn && (rad === "" || rad === "original");

  if (!progress.done) {
    return { text: startHint(draft, log), walkIndex: q.length ? 0 : 0 };
  }

  if (radUnknown) {
    return { text: "Log radiator history — unknown replacement", walkIndex: jumpForId(draft, "smodPlan") };
  }

  const idx = firstIncompleteIndex(draft);
  const card = q[idx];
  if (!card || card.id === "result") {
    return { text: "Finish Result and save report", walkIndex: Math.max(0, q.length - 1) };
  }
  if (card.id === "oilLevel" && oilChange) {
    return { text: `Continue inspection — Step ${idx + 1}, record oil change`, walkIndex: idx };
  }
  return {
    text: `Continue inspection — Step ${idx + 1}, ${stepPhrase(card, oilChange)}`,
    walkIndex: idx,
  };
}

function meaningOf(guideId: string, fallback: string): string {
  return meaningFor(guideId, fallback);
}

function lineFromCard(
  draft: InspectionDraft,
  card: WalkCard,
  photos: Record<string, PhotoShot | undefined>,
  report: ConditionReport,
): ResultLine {
  const st = visitItemStatus(draft, card.id);
  const all = [...report.asap, ...report.attention, ...report.monitor, ...report.passed, ...report.na];
  const flag = all.find((f) => f.id === card.id);
  const guideId = flag?.guideId || walkRowGuideId(card.id) || "";
  const label = card.shopTitle || STATUS_ROW_LABELS[card.id] || card.id;
  return {
    id: card.id,
    label,
    status: st,
    measured: flag?.measured && flag.measured !== "see checklist" ? flag.measured : "",
    range: flag?.range && !/on the Guide/i.test(flag.range) ? flag.range : "",
    guideId,
    meaning: meaningOf(guideId, label),
    photos: photosForItem(card.id, photos),
    grokLine: grokReportLine(suggestionForItem(draft.grokScan, card.id, photoSlotsForItem(card.id))),
  };
}

function visitLists(
  draft: InspectionDraft,
  photos: Record<string, PhotoShot | undefined>,
  report: ConditionReport,
): Record<HomeFilter, ResultLine[]> {
  const lists: Record<HomeFilter, ResultLine[]> = { asap: [], attention: [], monitor: [], pass: [], na: [] };
  for (const card of queueOf(draft)) {
    if (card.id === "result") continue;
    const st = visitItemStatus(draft, card.id);
    const line = lineFromCard(draft, card, photos, report);
    if (st === "unset" || st === "na" || st === "unable") lists.na.push(line);
    else if (st === "asap") lists.asap.push(line);
    else if (st === "attention") lists.attention.push(line);
    else if (st === "monitor") lists.monitor.push(line);
    else lists.pass.push(line);
  }
  if (isSmodRisk(draft) && !lists.asap.some((l) => l.id === "atf" || l.id === "atfLines" || l.id === "smodPlan")) {
    const atf = queueOf(draft).find((c) => c.id === "atf" || c.id === "atfLines" || c.id === "smodPlan");
    if (atf && !lists.asap.some((l) => l.id === atf.id)) {
      lists.asap.push(lineFromCard(draft, atf, photos, report));
      lists.pass = lists.pass.filter((l) => l.id !== atf.id);
      lists.na = lists.na.filter((l) => l.id !== atf.id);
      lists.attention = lists.attention.filter((l) => l.id !== atf.id);
      lists.monitor = lists.monitor.filter((l) => l.id !== atf.id);
    }
  }
  return lists;
}

export function resultToneOf(lists: Record<HomeFilter, ResultLine[]>, draft: InspectionDraft): ResultTone {
  if (lists.na.some((l) => l.status === "unset")) return "incomplete";
  if (lists.asap.length || driveGates(draft).length || isSmodRisk(draft)) return "critical";
  if (lists.attention.length) return "repairs";
  if (lists.monitor.length) return "watch";
  return "pass";
}

export function resultsNextAction(
  draft: InspectionDraft,
  lists: Record<HomeFilter, ResultLine[]>,
  photos: Record<string, PhotoShot | undefined>,
  log: MaintRow[],
  tone: ResultTone,
): NextAction {
  const oilChange = oilChangeMode(draft);
  const q = queueOf(draft);
  if (tone === "incomplete") {
    const idx = firstIncompleteIndex(draft);
    const card = q[idx];
    const phrase = card ? stepPhrase(card, oilChange) : "the next item";
    return { text: `Finish Walk — ${phrase}`, walkIndex: idx };
  }
  if (smodDriveNow(draft) || lists.asap.some((l) => l.id === "atf" || l.id === "atfLines" || l.id === "smodPlan" || l.id === "radiator")) {
    const text = smodDriveNow(draft)
      ? "Do not keep driving until a shop confirms SMOD. Transmission cooling system protection should be addressed first."
      : "Transmission cooling system protection should be addressed first.";
    return { text, walkIndex: jumpForId(draft, "atf") ?? jumpForId(draft, "atfLines") };
  }
  if (lists.asap[0]) {
    return { text: `${lists.asap[0].label} should be addressed first.`, walkIndex: jumpForId(draft, lists.asap[0].id) };
  }
  if (lists.attention[0]) {
    return {
      text: `${lists.attention[0].label} should be repaired at the next service.`,
      walkIndex: jumpForId(draft, lists.attention[0].id),
    };
  }
  const missing = missingRequiredPhotos(draft, photos).filter((m) => m.slot !== "header.vin");
  if (missing[0]) {
    const def = PHOTO_SLOTS.find((s) => s.slot === missing[0]!.slot);
    return {
      text: `Take required photo: ${missing[0].label.replace(/ photo$/i, "").toLowerCase()}`,
      walkIndex: jumpForId(draft, def?.itemId ?? missing[0].slot),
    };
  }
  const plan = buildPlan(draft, log);
  const rad = plan.flags.find((f) => f.key === "smod-history");
  if (rad) return { text: "Log radiator history — unknown replacement", walkIndex: jumpForId(draft, "smodPlan") };
  const spark = plan.flags.find((f) => f.key === "spark");
  if (spark) return { text: spark.text, walkIndex: jumpForId(draft, "baseline.sparkPlugs") };
  return { text: "No open items. Save and share the report.", walkIndex: null };
}

export function walkIndexForFlag(draft: InspectionDraft, id: string): number {
  return jumpForId(draft, id) ?? firstIncompleteIndex(draft);
}

function visitScore(lists: Record<HomeFilter, ResultLine[]>): number {
  return Math.max(0, Math.min(100, 100 - 15 * lists.asap.length - 6 * lists.attention.length - 2 * lists.monitor.length));
}

export function homeModel(
  draft: InspectionDraft,
  photos: Record<string, PhotoShot | undefined> = {},
  log: MaintRow[] = [],
  submitted = false,
): HomeModel {
  const progress = inspectionProgress(draft);
  const report = conditionReport(draft, photos);
  const lists = visitLists(draft, photos, report);
  const h = draft.header;
  const tone = resultToneOf(lists, draft);
  const incomplete = tone === "incomplete";
  return {
    miles: formatMiles(h.miles) || h.miles.trim(),
    date: h.date,
    inspector: h.inspector.trim(),
    visit: visitLabel(h.visitType) || (h.miles.trim() ? "Recommended from mileage" : ""),
    vin: h.vin.trim(),
    drive: h.drive,
    tow: h.towPkg === "Y" ? "Tow package" : h.towPkg === "N" ? "No tow" : "",
    worry: worryOf(draft, report, progress.done),
    score: progress.done ? visitScore(lists) : null,
    progress,
    counts: {
      asap: lists.asap.length,
      attention: lists.attention.length,
      monitor: lists.monitor.length,
      pass: lists.pass.length,
      na: lists.na.length,
    },
    lists,
    next: nextAction(draft, photos, log),
    started: progress.done > 0,
    submitted,
    incomplete,
    repairs: repairTable(draft),
    maintFlags: buildPlan(draft, log).flags,
  };
}

export function resultsModel(
  draft: InspectionDraft,
  photos: Record<string, PhotoShot | undefined> = {},
  log: MaintRow[] = [],
  submitted = false,
): HomeModel & { tone: ResultTone; condition: (typeof RESULT_CONDITION)[ResultTone] } {
  const base = homeModel(draft, photos, log, submitted);
  const tone = resultToneOf(base.lists, draft);
  return {
    ...base,
    tone,
    condition: RESULT_CONDITION[tone],
    score: visitScore(base.lists),
    next: resultsNextAction(draft, base.lists, photos, log, tone),
  };
}

export function allVisitItemsStatused(draft: InspectionDraft): boolean {
  const q = queueOf(draft);
  if (!q.length) return false;
  return q.every((c) => visitItemStatus(draft, c.id) !== "unset");
}
