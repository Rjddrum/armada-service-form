import { formatMiles, formatShortDate } from "../utils.ts";
import { driveGates, type DriveGate } from "./drive.ts";
import {
  applyAutoStatuses,
  conditionReport,
  type ConditionReport,
} from "./status.ts";
import { visitLabel, type InspectionDraft } from "./types.ts";
import { buildPlan, parseMiles, recStamp, type RecLine } from "./plan.ts";
import {
  MAINT_DISCLAIMER,
  ageOf,
  formatMaintDate,
  serviceLabel,
  type MaintFlag,
  type MaintRow,
} from "./maint.ts";
import { missingRequiredPhotos, photosForItem, photoSlotsForItem, type MissingPhoto } from "./photo-slots.ts";
import type { PhotoShot } from "./photos.ts";
import { repairTable, type RepairRow } from "./repairs.ts";
import { inspectionProgress } from "./progress.ts";
import { plainFor } from "../guide/plain.ts";
import { grokReportLine, suggestionForItem } from "./grok-scan.ts";

export const REPORT_TITLE = "2005 Nissan Armada Inspection Report";

export interface SummaryLine {
  id: string;
  line: string;
  guideId: string;
  photos: { slot: string; shot: PhotoShot }[];
  meaning?: string;
  grokLine?: string;
}

export interface InspectionSummary {
  title: string;
  miles: string;
  date: string;
  inspector: string;
  vin: string;
  drive: string;
  tow: string;
  visit: string;
  planStamp: string;
  recLines: RecLine[];
  maintRows: { service: string; miles: string; date: string; age: string; photo?: PhotoShot }[];
  maintFlags: MaintFlag[];
  maintDisclaimer: string;
  progressLine: string;
  score: number;
  counts: ConditionReport["counts"];
  critical: SummaryLine[];
  attention: SummaryLine[];
  monitor: SummaryLine[];
  passed: SummaryLine[];
  na: SummaryLine[];
  missingPhotos: MissingPhoto[];
  repairs: RepairRow[];
}

function hasNumber(s: string): boolean {
  return /\d/.test(s);
}

export function plainLine(f: { id: string; label: string; measured: string; range: string }): string {
  const measured = (f.measured || "").trim();
  const range = (f.range || "").trim();
  if (f.id === "smod" || ((f.id === "atf" || f.id === "atfReject") && /pink|milky|sweet/.test(measured))) {
    return `Transmission cooling system requires attention (${measured || "ATF milky / sweet"} — SMOD risk)`;
  }
  if (f.id === "smod.plan" || f.id === "smodPlan") {
    if (!measured || /original|unknown/.test(measured)) return "Original or unknown radiator — SMOD risk";
    return `${measured} — SMOD risk`;
  }
  if (hasNumber(measured) && range) return `${f.label}: ${measured} (${range})`;
  if (measured && measured !== "see checklist") return `${f.label} — ${measured}`;
  return f.label;
}

function gateLine(g: DriveGate): string {
  return plainLine({ id: g.id, label: g.label, measured: g.measured, range: g.range });
}

function isSmodish(id: string): boolean {
  return id === "smod" || id === "smod.plan" || id === "smodPlan" || id === "atf" || id === "atfReject";
}

function critKey(id: string): string {
  if (id === "smod") return "atf";
  if (id === "smod.plan") return "smodPlan";
  if (id.startsWith("pads.")) return "pads";
  if (id.startsWith("rotors.")) return "rotors";
  if (id === "battery.restV") return "battery";
  if (id === "timing.oil") return "timingCover";
  if (id === "airbag.lamp") return "cabin.airbag";
  if (id === "abs.lamps") return "absLamps";
  if (id === "pedalHeight") return "pedalHeight";
  return id;
}

export function buildSummary(
  draft: InspectionDraft,
  photos: Record<string, unknown> = {},
  history: InspectionDraft[] = [],
  log: MaintRow[] = [],
): InspectionSummary {
  const snap = structuredClone(draft);
  applyAutoStatuses(snap, photos);
  const report = conditionReport(snap, photos, history);
  const gates = driveGates(snap);
  const h = snap.header;
  const seen = new Set<string>();
  const critical: SummaryLine[] = [];

  const photoMap = photos as Record<string, PhotoShot | undefined>;
  const withPhotos = (id: string, line: string, guideId: string): SummaryLine => {
    const p = plainFor(guideId);
    const meaning = p
      ? `${p.why} Good: ${p.good} Bad: ${p.bad}`
      : undefined;
    const grokLine = grokReportLine(suggestionForItem(snap.grokScan, id, photoSlotsForItem(id)));
    return {
      id,
      line,
      guideId,
      photos: photosForItem(id, photoMap),
      meaning,
      grokLine: grokLine || undefined,
    };
  };

  const push = (id: string, line: string, guideId: string) => {
    const key = critKey(id);
    if (seen.has(key)) return;
    seen.add(key);
    critical.push(withPhotos(key, line, guideId));
  };

  for (const g of gates) push(g.id, gateLine(g), g.guideId);
  for (const f of report.asap) push(f.id, plainLine(f), f.guideId);
  for (const f of report.attention) {
    if (isSmodish(f.id)) push(f.id, plainLine(f), f.guideId);
  }

  const attention = report.attention
    .filter((f) => !seen.has(critKey(f.id)) && !isSmodish(f.id))
    .map((f) => withPhotos(f.id, plainLine(f), f.guideId));
  const monitor = report.monitor.map((f) => withPhotos(f.id, plainLine(f), f.guideId));
  const passed = report.passed.map((f) => withPhotos(f.id, f.label, f.guideId));
  const na = report.na.map((f) => withPhotos(f.id, f.label, f.guideId));

  const rec = buildPlan(snap, log);
  const current = parseMiles(h.miles);
  const maintRows = log.map((r) => ({
    service: serviceLabel(r),
    miles: r.miles.trim() ? formatMiles(r.miles) : "Unknown",
    date: r.date.trim() ? formatMaintDate(r.date) : "—",
    age: ageOf(r, current).label,
    photo: r.photo,
  }));
  return {
    title: REPORT_TITLE,
    miles: formatMiles(h.miles),
    date: h.date,
    inspector: h.inspector.trim(),
    vin: h.vin.trim(),
    drive: h.drive,
    tow: h.towPkg === "Y" ? "Tow package" : h.towPkg === "N" ? "No tow package" : "",
    visit: visitLabel(h.visitType),
    planStamp: recStamp(rec),
    recLines: rec.lines,
    maintRows,
    maintFlags: rec.flags,
    maintDisclaimer: MAINT_DISCLAIMER,
    progressLine: inspectionProgress(snap).reportLine,
    score: report.score,
    counts: report.counts,
    critical,
    attention,
    monitor,
    passed,
    na,
    missingPhotos: missingRequiredPhotos(snap, photoMap),
    repairs: repairTable(snap),
  };
}

export function dateLabel(iso: string): string {
  return formatShortDate(iso) || iso;
}
