import {
  BASELINE_ITEMS,
  CABIN_ITEMS,
  CHECK_ROW_IDS,
  CORNERS,
  CORNERS_SPARE,
  ROAD_ITEMS,
  STEERING_ITEMS,
  TRANS_ROWS,
  UNDERBODY_ITEMS,
  rowShows,
  type CheckRow,
  type InspectionDraft,
  type ItemStatus,
  type TransRowKey,
} from "./types.ts";
import { oilChangeMode } from "./plan.ts";
import { driveGates } from "./drive.ts";
import { outOfRangeFlags, type RangeFlag } from "./range.ts";
import { parsePadMm, parseTread32 } from "./wear.ts";

export const STATUS_OPTIONS: { value: ItemStatus; label: string }[] = [
  { value: "pass", label: "PASS" },
  { value: "monitor", label: "MONITOR" },
  { value: "attention", label: "SERVICE SOON" },
  { value: "asap", label: "URGENT" },
  { value: "na", label: "N/A" },
  { value: "unable", label: "UNABLE" },
];

const RANK: Record<ItemStatus, number> = {
  na: 0,
  unable: 0,
  pass: 1,
  monitor: 2,
  attention: 3,
  asap: 4,
};

export const STATUS_ROW_IDS: string[] = [
  ...CHECK_ROW_IDS,
  ...TRANS_ROWS.map((r) => `trans.${r.key}`),
  "atfReject",
];

export const STATUS_ROW_LABELS: Record<string, string> = {
  oilLevel: "Engine oil",
  oilLeak: "Engine oil leak check",
  coolant: "Coolant",
  atf: "ATF",
  psf: "Power steering fluid",
  brake: "Brake fluid",
  washer: "Washer fluid",
  transferSeep: "Transfer-case seep",
  frontDiffSeep: "Front diff seep",
  rearDiffSeep: "Rear diff seep",
  timingCover: "Timing-cover noise",
  manifolds: "Exhaust manifolds",
  idle: "Idle / CEL",
  belt: "Serpentine belt",
  radiator: "Radiator",
  atfLines: "ATF cooler lines",
  airFilter: "Air filter",
  battery: "Battery",
  grounds: "Grounds",
  pcv: "PCV",
  scan: "Scan",
  pads: "Pad thickness",
  rotors: "Rotors",
  hoses: "Brake hoses / calipers",
  master: "Master / booster",
  pedalHeight: "Pedal height",
  parking: "Parking brake",
  absLamps: "ABS / SLIP / VDC",
  tread: "Tires tread",
  tireAge: "Tire age",
  wear: "Wear pattern",
  pressures: "Tire pressures",
  lugTorque: "Lug torque",
  bearings: "Wheel bearings",
  alignment: "Alignment feel",
  "cabin.recalls": "Nissan campaigns",
  smodPlan: "SMOD prevention",
  atfReject: "ATF reject condition",
};

for (const r of TRANS_ROWS) STATUS_ROW_LABELS[`trans.${r.key}`] = r.label;
for (const r of STEERING_ITEMS) STATUS_ROW_LABELS[`steering.${r.key}`] = r.label;
for (const r of UNDERBODY_ITEMS) STATUS_ROW_LABELS[`underbody.${r.key}`] = r.label;
for (const r of CABIN_ITEMS) STATUS_ROW_LABELS[`cabin.${r.key}`] = r.label;
for (const r of ROAD_ITEMS) STATUS_ROW_LABELS[`road.${r.key}`] = r.label;
for (const r of BASELINE_ITEMS) STATUS_ROW_LABELS[`baseline.${r.key}`] = r.label;

export function statusIdFromGuide(guideId: string): string {
  if (guideId === "trans.atfReject") return "atfReject";
  if (guideId === "result.smodPlan") return "smodPlan";
  if (guideId === "result.overall") return "";
  if (guideId.startsWith("trans.")) return guideId;
  const dot = guideId.indexOf(".");
  if (dot < 0) return guideId;
  const prefix = guideId.slice(0, dot);
  const rest = guideId.slice(dot + 1);
  if (prefix === "steering" || prefix === "underbody" || prefix === "cabin" || prefix === "road" || prefix === "baseline") {
    return guideId;
  }
  return rest;
}

function worse(a: ItemStatus, b: ItemStatus): ItemStatus {
  return RANK[b] > RANK[a] ? b : a;
}

function parseNum(raw: string | undefined): number | null {
  const t = (raw ?? "").trim().replace(",", ".");
  if (!t) return null;
  const m = t.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

function filled(v: unknown): boolean {
  if (typeof v === "string") return v.trim().length > 0;
  if (typeof v === "boolean") return v;
  return false;
}

function extrasFilled(row: object | undefined): boolean {
  if (!row) return false;
  for (const [k, v] of Object.entries(row)) {
    if (k === "checked" || k === "notes" || k === "campaigns") continue;
    if (filled(v)) return true;
    if (v && typeof v === "object" && extrasFilled(v as object)) return true;
  }
  return false;
}

function checkish(draft: InspectionDraft, id: string): CheckRow | undefined {
  const f = draft.fluids as unknown as Record<string, CheckRow>;
  const e = draft.engine as unknown as Record<string, CheckRow>;
  const b = draft.brakes as unknown as Record<string, CheckRow>;
  if (id in (f ?? {}) && typeof f[id] === "object") return f[id];
  if (id in (e ?? {}) && typeof e[id] === "object") return e[id];
  if (id in (b ?? {}) && typeof b[id] === "object") return b[id];
  if (id.startsWith("steering.")) return draft.steering?.items?.[id.slice(9) as keyof typeof draft.steering.items];
  if (id.startsWith("underbody.")) return draft.underbody?.items?.[id.slice(10) as keyof typeof draft.underbody.items];
  if (id.startsWith("cabin.") && id !== "cabin.recalls") {
    return draft.cabin?.items?.[id.slice(6) as keyof typeof draft.cabin.items];
  }
  if (id === "cabin.recalls") return draft.cabin?.recalls;
  if (id.startsWith("road.")) return draft.road?.items?.[id.slice(5) as keyof typeof draft.road.items];
  if (id.startsWith("baseline.")) return draft.baseline?.[id.slice(9) as keyof typeof draft.baseline] as CheckRow | undefined;
  if (id === "smodPlan") return draft.result?.smodPlan;
  return undefined;
}

export function rowInspected(draft: InspectionDraft, id: string): boolean {
  if (id === "atfReject") return Boolean(draft.trans?.atfReject) || rowInspected(draft, "atf");
  if (id.startsWith("trans.")) {
    const key = id.slice(6) as TransRowKey;
    const row = draft.trans?.rows?.[key];
    return Boolean(row && (row.cold || row.hot || row.notes.trim()));
  }
  if (id === "oilLevel" && oilChangeMode(draft)) {
    const r = draft.result;
    return Boolean(
      r?.oilType?.trim() ||
        r?.oilAmount?.trim() ||
        r?.oilFilterPn?.trim() ||
        r?.crushWasher ||
        draft.fluids.oilLevel.checked ||
        draft.fluids.oilLevel.notes.trim(),
    );
  }
  const row = checkish(draft, id);
  if (!row) return false;
  if (row.checked || row.notes.trim()) return true;
  return extrasFilled(row);
}

const TRANS_FAIL = new Set(["Delay", "Bang", "Flare", "Harsh", "Miss", "Hunt", "Shudder", "Slip", "Late", "Binds", "No"]);

function watchStatus(draft: InspectionDraft, id: string): ItemStatus {
  let st: ItemStatus = "pass";
  if (id === "pads") {
    for (const c of CORNERS) {
      const n = parsePadMm(draft.brakes?.pads?.[c.key] ?? "");
      if (n == null) continue;
      if (n <= 1) st = worse(st, "asap");
      else if (n < 3) st = worse(st, "attention");
      else if (n <= 4) st = worse(st, "monitor");
    }
  }
  if (id === "rotors") {
    const front = parseNum(draft.brakes?.rotors?.front);
    const rear = parseNum(draft.brakes?.rotors?.rear);
    if (front != null) {
      if (front <= 26) st = worse(st, "asap");
      else if (front <= 27) st = worse(st, "monitor");
    }
    if (rear != null) {
      if (rear <= 12) st = worse(st, "asap");
      else if (rear <= 13) st = worse(st, "monitor");
    }
  }
  if (id === "timingCover") {
    const n = draft.engine?.timingCover?.noise;
    const sec = parseNum(draft.engine?.timingCover?.seconds);
    const low = draft.engine?.timingCover?.oilPressure === "low";
    if (n === "ongoing-rattle" && low) st = worse(st, "asap");
    else if (n === "ongoing-rattle" || (sec != null && sec > 3)) st = worse(st, "attention");
    else if (n === "short-rattle" || (sec != null && sec >= 1 && sec <= 3)) st = worse(st, "monitor");
  }
  if (id === "atf" || id === "atfReject") {
    if (draft.fluids?.atf?.color === "pink" || draft.fluids?.atf?.color === "milky" || draft.fluids?.atf?.smell === "sweet") {
      st = worse(st, "asap");
    } else if (draft.fluids?.atf?.color === "brown" || draft.fluids?.atf?.smell === "burnt") {
      st = worse(st, "monitor");
    }
    if (id === "atfReject" && draft.trans?.atfReject) st = worse(st, "asap");
  }
  if (id === "battery") {
    const rest = parseNum(draft.engine?.battery?.restV);
    if (rest != null && rest < 12.2) st = worse(st, "asap");
  }
  if (id === "pedalHeight") {
    const t = (draft.brakes?.pedalHeight?.measured ?? "").trim().toLowerCase();
    const n = parseNum(t);
    if (n != null) {
      const inches = /\bmm\b/.test(t) ? n / 25.4 : n;
      if (inches < 3.5) st = worse(st, "asap");
    }
  }
  if (id === "hoses" && draft.brakes?.hoses?.wetCaliper === "Y") st = worse(st, "asap");
  if (id === "master" && (draft.brakes?.master?.seepage === "Y" || draft.brakes?.master?.pedalFirm === "N")) {
    st = worse(st, "asap");
  }
  if (id === "absLamps" && (draft.brakes?.absLamps?.state === "stay-on" || draft.brakes?.absLamps?.state === "intermittent")) {
    st = worse(st, "asap");
  }
  if (id === "cabin.airbag" && (draft.cabin?.airbagLamp === "stay-on" || draft.cabin?.airbagLamp === "intermittent")) {
    st = worse(st, "asap");
  }
  if (id === "wear" && draft.brakes?.wear?.pattern && draft.brakes.wear.pattern !== "even") {
    st = worse(st, "attention");
  }
  if (id === "tread") {
    const vals = CORNERS.map((c) => parseTread32(draft.brakes?.tread?.[c.key] ?? "")).filter((n): n is number => n != null);
    if (vals.length >= 2) {
      const max = Math.max(...vals);
      const min = Math.min(...vals);
      if (max - min >= 2) st = worse(st, "attention");
    }
  }
  if (id.startsWith("baseline.")) {
    const row = checkish(draft, id) as (CheckRow & { verdict?: string; pumpWeep?: string }) | undefined;
    if (row?.verdict === "fail") st = worse(st, "attention");
    if (id === "baseline.coolantService" && row && "pumpWeep" in row && row.pumpWeep === "Y") st = worse(st, "attention");
    const seep = draft.baseline?.seepage;
    if (id === "baseline.seepage" && seep) {
      for (const g of [seep.valveCover, seep.timingCover, seep.oilPan]) {
        if (g === "film") st = worse(st, "monitor");
        if (g === "wet" || g === "drip") st = worse(st, "attention");
      }
    }
  }
  if (id.startsWith("trans.")) {
    const key = id.slice(6) as TransRowKey;
    const row = draft.trans?.rows?.[key];
    if (row && (TRANS_FAIL.has(row.cold) || TRANS_FAIL.has(row.hot))) st = worse(st, "attention");
  }
  if (id === "oilLeak" && /drip|wet|puddle/i.test(draft.fluids?.oilLeak?.notes ?? "")) st = worse(st, "attention");
  if (id === "oilLevel" && draft.result?.crushWasher === "N") st = worse(st, "attention");
  return st;
}

export function suggestedStatus(
  draft: InspectionDraft,
  id: string,
  flags: RangeFlag[],
  gates: ReturnType<typeof driveGates>,
): ItemStatus {
  if (!rowShows(id, draft.header.visitType, draft.header.drive, draft.header.plan)) return "na";
  if (!rowInspected(draft, id)) return "na";
  let st: ItemStatus = "pass";
  st = worse(st, watchStatus(draft, id));
  for (const g of gates) {
    if (gateRow(g.id, g.guideId) === id) st = worse(st, "asap");
  }
  for (const f of flags) {
    if (gateRow(f.id, f.guideId) === id) st = worse(st, "attention");
  }
  return st;
}

function gateRow(flagId: string, guideId: string): string {
  if (flagId === "smod" || flagId.startsWith("atf.")) return flagId === "atfReject" ? "atfReject" : "atf";
  if (flagId.startsWith("pads.") || flagId.startsWith("wear.pad")) return "pads";
  if (flagId.startsWith("tread.") || flagId.startsWith("wear.tread")) return "tread";
  if (flagId.startsWith("tireAge.")) return "tireAge";
  if (flagId.startsWith("pressures.")) return "pressures";
  if (flagId.startsWith("trans.")) {
    const parts = flagId.split(".");
    return `trans.${parts[1]}`;
  }
  if (flagId === "timing.oil" || flagId === "timingCover.rattle" || flagId === "oil.pressure") return "timingCover";
  if (flagId === "airbag.lamp") return "cabin.airbag";
  if (flagId === "abs.lamps") return "absLamps";
  if (flagId === "oil.washer") return "oilLevel";
  return statusIdFromGuide(guideId);
}

export function applyAutoStatuses(draft: InspectionDraft, photos: Record<string, unknown> = {}): void {
  if (!draft.itemStatus) draft.itemStatus = {};
  const flags = outOfRangeFlags(draft, photos);
  const gates = driveGates(draft);
  for (const id of STATUS_ROW_IDS) {
    const shown = rowShows(id, draft.header.visitType, draft.header.drive, draft.header.plan);
    const cur = draft.itemStatus[id];
    if (!shown) {
      draft.itemStatus[id] = { value: "na", manual: false };
      continue;
    }
    if (cur?.manual) {
      if (cur.value === "attention" || cur.value === "asap") {
        const sug = suggestedStatus(draft, id, flags, gates);
        if (RANK[sug] > RANK[cur.value]) draft.itemStatus[id] = { value: sug, manual: true };
      }
      continue;
    }
    draft.itemStatus[id] = { value: suggestedStatus(draft, id, flags, gates), manual: false };
  }
}

export function setManualStatus(draft: InspectionDraft, id: string, value: ItemStatus): void {
  if (!draft.itemStatus) draft.itemStatus = {};
  draft.itemStatus[id] = { value, manual: true };
}

export function markRowInspected(draft: InspectionDraft, id: string): void {
  const row = checkish(draft, id);
  if (row && typeof row === "object" && "checked" in row) row.checked = true;
}

export type WalkChoice = "pass" | "monitor" | "attention" | "asap" | "na" | "unable";

export function walkChoiceOf(draft: InspectionDraft, id: string): WalkChoice | "" {
  const cur = draft.itemStatus?.[id];
  if (!cur?.manual) return "";
  return cur.value;
}

export function applyWalkChoice(
  draft: InspectionDraft,
  id: string,
  choice: WalkChoice,
  photos: Record<string, unknown> = {},
): void {
  markRowInspected(draft, id);
  if (choice === "na" || choice === "unable") {
    setManualStatus(draft, id, choice);
    return;
  }
  const flags = outOfRangeFlags(draft, photos);
  const gates = driveGates(draft);
  const sug = suggestedStatus(draft, id, flags, gates);
  if (choice === "asap") {
    setManualStatus(draft, id, "asap");
    return;
  }
  if (choice === "attention") {
    setManualStatus(draft, id, sug === "asap" ? "asap" : "attention");
    return;
  }
  if (RANK[sug] >= RANK.attention) {
    setManualStatus(draft, id, sug === "asap" ? "asap" : "attention");
    return;
  }
  setManualStatus(draft, id, choice);
}

export function rowNotes(draft: InspectionDraft, id: string): string {
  return checkish(draft, id)?.notes ?? "";
}

export function setRowNotes(draft: InspectionDraft, id: string, notes: string): void {
  const row = checkish(draft, id);
  if (row) row.notes = notes;
}

export function rowStatus(draft: InspectionDraft, id: string): ItemStatus {
  return draft.itemStatus?.[id]?.value ?? "na";
}

export interface StatusFlag {
  id: string;
  label: string;
  status: ItemStatus;
  measured: string;
  range: string;
  guideId: string;
}

export interface ConditionReport {
  score: number;
  counts: { asap: number; attention: number; monitor: number; pass: number; na: number };
  scored: number;
  asap: StatusFlag[];
  attention: StatusFlag[];
  monitor: StatusFlag[];
  passed: StatusFlag[];
  na: StatusFlag[];
}

function evidence(
  id: string,
  draft: InspectionDraft,
  flags: RangeFlag[],
  gates: ReturnType<typeof driveGates>,
): { measured: string; range: string; guideId: string } {
  const g = gates.find((x) => gateRow(x.id, x.guideId) === id);
  if (g) return { measured: g.measured, range: g.range, guideId: g.guideId };
  const f = flags.find((x) => gateRow(x.id, x.guideId) === id);
  if (f) return { measured: f.measured, range: f.range, guideId: f.guideId };
  const guideId = id.startsWith("trans.")
    ? id
    : id === "atfReject"
      ? "trans.atfReject"
      : id === "smodPlan"
        ? "result.smodPlan"
        : id.includes(".")
          ? id
          : statusGuide(id);
  return { measured: "see checklist", range: "factory reference on the Guide", guideId };
}

function statusGuide(id: string): string {
  const prefix: Record<string, string> = {
    oilLevel: "fluids",
    oilLeak: "fluids",
    coolant: "fluids",
    atf: "fluids",
    psf: "fluids",
    brake: "fluids",
    washer: "fluids",
    transferSeep: "fluids",
    frontDiffSeep: "fluids",
    rearDiffSeep: "fluids",
    timingCover: "engine",
    manifolds: "engine",
    idle: "engine",
    belt: "engine",
    radiator: "engine",
    atfLines: "engine",
    airFilter: "engine",
    battery: "engine",
    grounds: "engine",
    pcv: "engine",
    scan: "engine",
    pads: "brakes",
    rotors: "brakes",
    hoses: "brakes",
    master: "brakes",
    pedalHeight: "brakes",
    parking: "brakes",
    absLamps: "brakes",
    tread: "brakes",
    tireAge: "brakes",
    wear: "brakes",
    pressures: "brakes",
    lugTorque: "brakes",
    bearings: "brakes",
    alignment: "brakes",
  };
  return prefix[id] ? `${prefix[id]}.${id}` : id;
}

export function conditionReport(
  draft: InspectionDraft,
  photos: Record<string, unknown> = {},
  history: InspectionDraft[] = [],
): ConditionReport {
  const flags = outOfRangeFlags(draft, photos, history);
  const gates = driveGates(draft);
  const counts = { asap: 0, attention: 0, monitor: 0, pass: 0, na: 0 };
  const asap: StatusFlag[] = [];
  const attention: StatusFlag[] = [];
  const monitor: StatusFlag[] = [];
  const passed: StatusFlag[] = [];
  const na: StatusFlag[] = [];
  const visit = draft.header.visitType;
  const drive = draft.header.drive;
  for (const id of STATUS_ROW_IDS) {
    const label = STATUS_ROW_LABELS[id] ?? id;
    if (!rowShows(id, visit, drive, draft.header.plan)) {
      counts.na += 1;
      na.push({ id, label, status: "na", measured: "not on this visit", range: "", guideId: "" });
      continue;
    }
    const st = rowStatus(draft, id);
    const bucket: "pass" | "monitor" | "attention" | "asap" | "na" = st === "unable" ? "na" : st;
    counts[bucket] += 1;
    const ev = st === "na" || st === "unable" || st === "pass"
      ? { measured: "", range: "", guideId: "" }
      : evidence(id, draft, flags, gates);
    const item: StatusFlag = {
      id,
      label,
      status: st === "unable" ? "na" : st,
      measured: ev.measured,
      range: ev.range,
      guideId: ev.guideId,
    };
    if (st === "asap") asap.push(item);
    else if (st === "attention") attention.push(item);
    else if (st === "monitor") monitor.push(item);
    else if (st === "pass") passed.push(item);
    else na.push(item);
  }
  const scored = counts.pass + counts.monitor + counts.attention + counts.asap;
  const score = Math.max(0, Math.min(100, 100 - 15 * counts.asap - 6 * counts.attention - 2 * counts.monitor));
  return { score, counts, scored, asap, attention, monitor, passed, na };
}

export function overallBlocked(draft: InspectionDraft): boolean {
  if (driveGates(draft).length) return true;
  return STATUS_ROW_IDS.some((id) => rowShows(id, draft.header.visitType, draft.header.drive, draft.header.plan) && rowStatus(draft, id) === "asap");
}

export function statusLine(f: StatusFlag): string {
  return `${f.label}: ${f.measured} (${f.range})`;
}
