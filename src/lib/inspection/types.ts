import type { GrokSuggestion } from "./grok-scan";

export const VISIT_TYPES = [
  { value: "oil-change", label: "Oil-change short check" },
  { value: "15k", label: "15k inspection" },
  { value: "30k", label: "30k powertrain" },
  { value: "baseline-270k", label: "Baseline 270k" },
] as const;

export type ForcedVisit = (typeof VISIT_TYPES)[number]["value"];
export type VisitType = ForcedVisit | "recommended";
export type DriveType = "2WD" | "4WD" | "";
export type ItemStatus = "pass" | "monitor" | "attention" | "asap" | "na" | "unable";
export type OverallResult = "pass" | "pass-notes" | "schedule" | "do-not-drive" | "";
export type PassFail = "pass" | "fail" | "";
export type SeepGrade = "dry" | "film" | "wet" | "drip" | "";
export type YN = "Y" | "N" | "";
export type RepairPriority = "immediate" | "soon" | "monitor";
export type DealerTier = "$" | "$$" | "$$$" | "$$$$" | "";

export const OVERALL_OPTIONS: { value: OverallResult; label: string }[] = [
  { value: "pass", label: "Pass" },
  { value: "pass-notes", label: "Pass with notes" },
  { value: "schedule", label: "Schedule repairs" },
  { value: "do-not-drive", label: "Do not drive" },
];

export interface PlanFlags {
  oilService: boolean;
  multiPoint: boolean;
  powertrain: boolean;
  cooling: boolean;
  highMiles: boolean;
  sparkPlugs: boolean;
  coolantService: boolean;
  brakeFluidService: boolean;
}

export interface RepairPlan {
  priority: RepairPriority | "";
  diyLow: string;
  diyHigh: string;
  indLow: string;
  indHigh: string;
  dealerLow: string;
  dealerHigh: string;
  dealerTier: DealerTier;
}

export interface RecallCampaign {
  id: string;
  component: string;
  summary: string;
}

export interface CheckRow {
  checked: boolean;
  notes: string;
}

export interface VehicleHeader {
  date: string;
  miles: string;
  inspector: string;
  vin: string;
  drive: DriveType;
  towPkg: YN;
  visitType: VisitType | "";
  lastOilMi: string;
  lastAtfMi: string;
  lastRadiatorMi: string;
  lastBrakeMi: string;
  lastDiffMi: string;
  plan: PlanFlags | null;
}

export interface FluidsSection {
  notes: string;
  oilLevel: CheckRow & { colorLevel: string; qtAdded: string };
  oilLeak: CheckRow;
  coolant: CheckRow & { levelColor: string; capSeated: YN; freezeF: string };
  atf: CheckRow & { inRange: YN; color: string; smell: string };
  psf: CheckRow & { level: string; color: string };
  brake: CheckRow & { level: string; color: string; capSealed: YN; moisture: string };
  washer: CheckRow;
  transferSeep: CheckRow & { wetness: YN };
  frontDiffSeep: CheckRow & { seep: YN };
  rearDiffSeep: CheckRow & { seep: YN; pinion: YN };
}

export interface EngineBaySection {
  notes: string;
  timingCover: CheckRow & { noise: string; seconds: string; oilPressure: string };
  manifolds: CheckRow & { noise: string; soot: YN };
  idle: CheckRow & { quality: string; cel: string };
  belt: CheckRow & { condition: string; tensionerPlay: YN };
  radiator: CheckRow & { seeping: YN };
  atfLines: CheckRow & { connected: YN; wetFittings: YN; bypassDone: YN };
  airFilter: CheckRow & { condition: string; cabinDue: YN };
  battery: CheckRow & { restV: string; runningV: string; terminalsClean: YN; loadTest: string };
  grounds: CheckRow & { condition: string };
  pcv: CheckRow & { condition: string };
  scan: CheckRow & { stored: string; pending: string; atfTemp: string };
}

export const TRANS_ROWS = [
  { key: "parkReverse", label: "Park → Reverse engagement", options: ["Good", "Delay", "Bang"], guideId: "trans.parkReverse" },
  { key: "reverseDrive", label: "Reverse → Drive", options: ["Good", "Delay", "Bang"], guideId: "trans.reverseDrive" },
  { key: "up12", label: "1–2 upshift", options: ["Clean", "Flare", "Harsh"], guideId: "trans.up12" },
  { key: "up23", label: "2–3 upshift", options: ["Clean", "Flare", "Harsh"], guideId: "trans.up23" },
  { key: "up345", label: "3–4 and 4–5", options: ["Clean", "Miss", "Hunt"], guideId: "trans.up345" },
  { key: "tcc", label: "TCC lock ~45–60 mph light throttle", options: ["Smooth", "Shudder", "Slip"], guideId: "trans.tcc" },
  { key: "kickdown", label: "Kickdown 5–4 / 4–3", options: ["Clean", "Late", "Harsh"], guideId: "trans.kickdown" },
  { key: "fourwd", label: "4WD engage / disengage", options: ["Works", "Binds", "No"], guideId: "trans.fourwd", drive: "4WD" as const },
] as const;

export type TransRowKey = (typeof TRANS_ROWS)[number]["key"];

export interface TransRow {
  cold: string;
  hot: string;
  notes: string;
}

export interface TransSection {
  notes: string;
  rows: Record<TransRowKey, TransRow>;
  atfReject: boolean;
}

export const CORNERS = [
  { key: "lf", label: "LF" },
  { key: "rf", label: "RF" },
  { key: "lr", label: "LR" },
  { key: "rr", label: "RR" },
] as const;

export type Corner = (typeof CORNERS)[number]["key"];

export const CORNERS_SPARE = [...CORNERS, { key: "spare", label: "Spare" }] as const;
export type CornerSpare = (typeof CORNERS_SPARE)[number]["key"];

export interface BrakesSection {
  notes: string;
  pads: CheckRow & Record<Corner, string>;
  rotors: CheckRow & { front: string; rear: string };
  hoses: CheckRow & { condition: string; wetCaliper: YN };
  master: CheckRow & { seepage: YN; pedalFirm: YN };
  pedalHeight: CheckRow & { measured: string };
  parking: CheckRow & { clicks: string; holdsGrade: YN };
  absLamps: CheckRow & { state: string };
  tread: CheckRow & Record<CornerSpare, string>;
  tireAge: CheckRow & Record<CornerSpare, string>;
  wear: CheckRow & { pattern: string };
  pressures: CheckRow & Record<CornerSpare, string>;
  lugTorque: CheckRow & { rechecked: YN };
  bearings: CheckRow & Record<Corner, string>;
  alignment: CheckRow & { feel: string };
}

export const STEERING_ITEMS = [
  { key: "steeringPlay", label: "Steering play at idle", guideId: "steering.steeringPlay", minVisit: "15k" as const },
  { key: "tieRods", label: "Inner / outer tie rods", guideId: "steering.tieRods", photo: true, minVisit: "15k" as const },
  { key: "ballJoints", label: "Upper & lower ball joints / UCAs", guideId: "steering.ballJoints", photo: true, minVisit: "15k" as const },
  { key: "sway", label: "Sway-bar bushings & end links", guideId: "steering.sway", photo: true, minVisit: "15k" as const },
  { key: "springs", label: "Spring perches / shackles / body mounts", guideId: "steering.springs", photo: true, minVisit: "15k" as const },
  { key: "shocks", label: "Shock / strut leaks", guideId: "steering.shocks", photo: true, minVisit: "15k" as const },
  { key: "rack", label: "Rack boots / PSF high-pressure hose", guideId: "steering.rack", photo: true, minVisit: "15k" as const },
  { key: "shafts", label: "Front & rear drive shafts / U-joints / slip yoke (4WD)", guideId: "steering.shafts", photo: true, minVisit: "15k" as const },
  { key: "seals", label: "CV / pinion / axle seals", guideId: "steering.seals", photo: true, minVisit: "15k" as const },
  { key: "mounts", label: "Engine and transmission mounts", guideId: "steering.mounts", photo: true, minVisit: "15k" as const },
] as const;

export type SteeringKey = (typeof STEERING_ITEMS)[number]["key"];

export interface SteeringSection {
  notes: string;
  items: Record<SteeringKey, CheckRow>;
}

export const UNDERBODY_ITEMS = [
  { key: "oilPan", label: "Oil pan and drain plug", guideId: "underbody.oilPan", photo: true },
  { key: "transPan", label: "Transmission pan and cooler fittings", guideId: "underbody.transPan", photo: true, minVisit: "15k" as const },
  { key: "fuel", label: "Fuel tank, straps, lines, EVAP area", guideId: "underbody.fuel", photo: true, minVisit: "15k" as const },
  { key: "exhaust", label: "Exhaust hangers, cats, muffler, leaks", guideId: "underbody.exhaust", photo: true, minVisit: "15k" as const },
  { key: "frame", label: "Frame rust, spare-tire carrier, running-board mounts", guideId: "underbody.frame", photo: true, minVisit: "15k" as const },
  { key: "lines", label: "Brake and fuel line rust", guideId: "underbody.lines", photo: true, minVisit: "15k" as const },
] as const;

export type UnderbodyKey = (typeof UNDERBODY_ITEMS)[number]["key"];

export interface UnderbodySection {
  notes: string;
  items: Record<UnderbodyKey, CheckRow>;
}

export const CABIN_ITEMS = [
  { key: "airbag", label: "Airbag lamp proves out and goes off", guideId: "cabin.airbag", minVisit: "15k" as const },
  { key: "seatbelts", label: "Seatbelts latch and retract — all rows", guideId: "cabin.seatbelts", minVisit: "15k" as const },
  { key: "latches", label: "Doors / rear hatch / rear glass latch", guideId: "cabin.latches", minVisit: "15k" as const },
  { key: "horn", label: "Horn", guideId: "cabin.horn", minVisit: "15k" as const },
  { key: "lights", label: "Headlights, high beams, fogs, tails, brake, reverse, plate, hazards", guideId: "cabin.lights" },
  { key: "wipers", label: "Wipers / washers front and rear", guideId: "cabin.wipers" },
  { key: "hvac", label: "Defroster and HVAC blower", guideId: "cabin.hvac", minVisit: "15k" as const },
  { key: "glass", label: "Mirrors / glass cracks", guideId: "cabin.glass", photo: true, minVisit: "15k" as const },
  { key: "jack", label: "Jack, lug wrench, spare present and usable", guideId: "cabin.jack", photo: true, minVisit: "15k" as const },
] as const;

export type CabinKey = (typeof CABIN_ITEMS)[number]["key"];

export interface CabinSection {
  notes: string;
  items: Record<CabinKey, CheckRow>;
  airbagLamp: string;
  recalls: CheckRow & {
    checkedAt: string;
    vinChecked: string;
    ymm: string;
    source: string;
    campaigns: RecallCampaign[];
  };
}

export const ROAD_ITEMS = [
  { key: "coldStart", label: "Cold start — chain and manifold noise recorded", guideId: "road.coldStart" },
  { key: "overheat", label: "No overheat after 15 min mixed driving", guideId: "road.overheat" },
  { key: "brakes", label: "Brakes from 30 and from 60 — no pull, no pulse", guideId: "road.brakes" },
  { key: "vibration", label: "No new vibration 45–70 mph", guideId: "road.vibration", minVisit: "15k" as const },
  { key: "shifts", label: "Shift quality matches Section 3", guideId: "road.shifts" },
  { key: "lamps", label: "No new warning lamps", guideId: "road.lamps" },
] as const;

export type RoadKey = (typeof ROAD_ITEMS)[number]["key"];

export interface RoadSection {
  notes: string;
  items: Record<RoadKey, CheckRow>;
  gaugeStable: string;
}

export const BASELINE_ITEMS = [
  { key: "sparkPlugs", label: "Spark plugs (105k iridium — cycle 2 or 3)", guideId: "baseline.sparkPlugs" },
  { key: "coolantService", label: "Coolant service + cap + thermostat + water-pump weep", guideId: "baseline.coolantService" },
  { key: "brakeFluid", label: "Brake fluid (DOT 3, moisture)", guideId: "baseline.brakeFluid" },
  { key: "diffFluid", label: "Diff and transfer-case fluid", guideId: "baseline.diffFluid" },
  { key: "seepage", label: "Valve-cover / timing-cover / oil-pan seepage grade", guideId: "baseline.seepage" },
  { key: "manifoldBolts", label: "Exhaust manifold / heat-shield bolts", guideId: "baseline.manifoldBolts" },
  { key: "ucaJoints", label: "Upper control arms / ball joints", guideId: "baseline.ucaJoints" },
  { key: "airShocks", label: "Rear load-leveling / air shocks", guideId: "baseline.airShocks" },
] as const;

export type BaselineKey = (typeof BASELINE_ITEMS)[number]["key"];

export interface BaselineSection {
  notes: string;
  sparkPlugs: CheckRow & { lastMiles: string; cycle: string; verdict: PassFail };
  coolantService: CheckRow & { lastService: string; cap: PassFail; thermostat: PassFail; pumpWeep: YN; verdict: PassFail };
  brakeFluid: CheckRow & { lastFlush: string; verdict: PassFail };
  diffFluid: CheckRow & { transfer: PassFail; front: PassFail; rear: PassFail; verdict: PassFail };
  seepage: CheckRow & { valveCover: SeepGrade; timingCover: SeepGrade; oilPan: SeepGrade; verdict: PassFail };
  manifoldBolts: CheckRow & { verdict: PassFail };
  ucaJoints: CheckRow & { innerTaper: string; verdict: PassFail };
  airShocks: CheckRow & { equipped: YN; verdict: PassFail };
}

export interface ResultSection {
  overall: OverallResult;
  failItems: string;
  oilChangeMi: string;
  oilType: string;
  oilAmount: string;
  oilFilterPn: string;
  crushWasher: YN;
  service15kMi: string;
  service30kMi: string;
  signName: string;
  signDate: string;
  smodPlan: CheckRow & { radiatorLast: string; radiatorDate: string };
}

export interface StatusEntry {
  value: ItemStatus;
  manual: boolean;
}

export interface InspectionDraft {
  id: string;
  createdAt: number;
  updatedAt: number;
  header: VehicleHeader;
  fluids: FluidsSection;
  engine: EngineBaySection;
  trans: TransSection;
  brakes: BrakesSection;
  steering: SteeringSection;
  underbody: UnderbodySection;
  cabin: CabinSection;
  road: RoadSection;
  baseline: BaselineSection;
  result: ResultSection;
  smodAcknowledged: boolean;
  oilWaitStartedAt: number | null;
  atfIdle: boolean;
  atfCycled: boolean;
  atfHot: boolean;
  itemStatus: Record<string, StatusEntry>;
  photoSkip: Record<string, string>;
  repairs: Record<string, RepairPlan>;
  grokScan: Record<string, GrokSuggestion>;
}

export interface SettingsState {
  toEmail: string;
  ccEmail: string;
  lastInspector: string;
  lastVin: string;
}

export const OIL_WAIT_MS = 600_000;

export function oilChangeRecord(draft: InspectionDraft): string {
  const t = draft.header.miles.replace(/[^\d]/g, "");
  return `Oil change completed at ${t ? Number(t).toLocaleString("en-US") : "—"} miles — ${draft.result.oilType.trim() || "—"}, ${draft.result.oilAmount.trim() || "—"}, filter ${draft.result.oilFilterPn.trim() || "—"}, ${draft.result.crushWasher === "Y" ? "crush washer replaced" : draft.result.crushWasher === "N" ? "crush washer not replaced" : "crush washer —"}.`;
}

export const SMOD_INTERVAL =
  "30k powertrain: external stacked-plate cooler and radiator replacement if the radiator is original, unknown, or the in-radiator ATF cooler is still in service. Do not wait for milky ATF.";

export function smodPlanRecord(draft: InspectionDraft): string {
  const t = draft.result.smodPlan;
  return `SMOD prevention — radiator last: ${t.radiatorLast === "original" ? "original" : t.radiatorLast === "replaced" ? t.radiatorDate.trim() || "replaced — date not written" : "unknown"}. ${draft.engine.atfLines?.bypassDone === "Y" ? "external cooler installed" : "external cooler not installed"}. ${SMOD_INTERVAL} Not milky today is not a maintenance plan.`;
}

export const SECTION_DEFS = [
  { id: "header", label: "Vehicle", short: "Hdr" },
  { id: "fluids", label: "1. Fluids", short: "1" },
  { id: "engine", label: "2. Engine bay", short: "2" },
  { id: "trans", label: "3. Transmission", short: "3" },
  { id: "brakes", label: "4. Brakes & rolling", short: "4" },
  { id: "steering", label: "5. Steering / driveline", short: "5" },
  { id: "underbody", label: "6. Underbody", short: "6" },
  { id: "cabin", label: "7. Cabin & safety", short: "7" },
  { id: "road", label: "8. Final road test", short: "8" },
  { id: "baseline", label: "270k due", short: "270" },
  { id: "result", label: "9. Result", short: "9" },
] as const;

export type SectionId = (typeof SECTION_DEFS)[number]["id"];
export const ALL_SECTION_IDS: SectionId[] = SECTION_DEFS.map((s) => s.id);

export function isSmodRisk(draft: InspectionDraft): boolean {
  const { color, smell } = draft.fluids.atf;
  return color === "pink" || color === "milky" || smell === "sweet";
}

export function headerComplete(h: VehicleHeader): boolean {
  return Boolean(h.date && h.miles.trim() && h.inspector.trim());
}

export function overallLabel(v: OverallResult | string): string {
  return OVERALL_OPTIONS.find((o) => o.value === v)?.label ?? "—";
}

export function visitLabel(v: VisitType | ""): string {
  if (v === "recommended") return "Mileage-based inspection";
  return VISIT_TYPES.find((o) => o.value === v)?.label ?? "";
}

export function isOilChange(visit: VisitType | ""): boolean {
  return visit === "oil-change";
}

/** minVisit of 15k shows on 15k/30k/270k; 30k on 30k/270k; baseline only on 270k. */
export function visitShows(visit: VisitType | "", min?: string): boolean {
  if (!min) return true;
  if (!visit || visit === "recommended" || visit === "oil-change") return false;
  if (min === "baseline") return visit === "baseline-270k";
  if (min !== "30k") return true;
  return visit === "30k" || visit === "baseline-270k";
}

export function driveShows(drive: DriveType | string, need?: string): boolean {
  return !need || !drive || drive === "4WD";
}

export const BRAKE_INTERVAL_IDS = new Set([
  "rotors",
  "hoses",
  "master",
  "pedalHeight",
  "parking",
  "lugTorque",
  "bearings",
  "alignment",
]);

export function taggedMinVisit(item: unknown): string | undefined {
  if (item && typeof item === "object" && "minVisit" in item) {
    const v = (item as { minVisit?: string }).minVisit;
    return v;
  }
  return undefined;
}

/** Oil-change short set. Pads are not on this visit. */
export const OIL_SHORT = new Set([
  "oilLevel",
  "oilLeak",
  "coolant",
  "atf",
  "atfLines",
  "brake",
  "pressures",
  "tread",
  "cabin.lights",
  "absLamps",
  "cabin.airbag",
  "atfReject",
  "washer",
  "underbody.oilPan",
  "engine.overview",
  "cabin.dash",
  "cabin.wipers",
  "road.lamps",
  "road.overheat",
]);

export const REC_ALWAYS = new Set([
  "oilLeak",
  "coolant",
  "atf",
  "atfLines",
  "brake",
  "pressures",
  "tread",
  "cabin.lights",
  "absLamps",
  "cabin.airbag",
  "atfReject",
  "washer",
  "underbody.oilPan",
  "engine.overview",
  "cabin.dash",
  "cabin.wipers",
]);

const REC_OIL = new Set(["oilLevel"]);
const REC_MULTI = new Set([
  "oilLevel",
  "pads",
  "tireAge",
  "wear",
  "battery",
  "grounds",
  "airFilter",
  "pcv",
  "road.brakes",
  "road.overheat",
  "road.lamps",
  "road.coldStart",
  "idle",
  "underbody.transPan",
]);
const REC_POWER = new Set([
  "transferSeep",
  "frontDiffSeep",
  "rearDiffSeep",
  "radiator",
  "belt",
  "hoses",
  "steering.ballJoints",
  "steering.tieRods",
  "underbody.exhaust",
  "smodPlan",
  "transTable",
  "scan",
  "road.shifts",
]);
const REC_COOL = new Set(["radiator", "atf", "atfLines", "coolant", "smodPlan", "underbody.transPan"]);
const REC_HIGH = new Set(
  "timingCover,manifolds,scan,transTable,rotors,master,pedalHeight,parking,lugTorque,bearings,alignment,cabin.recalls,road.vibration,road.shifts,underbody.frame,underbody.fuel,underbody.lines,baseline,steering.steeringPlay,steering.sway,steering.springs,steering.shocks,steering.rack,steering.shafts,steering.seals,steering.mounts".split(
    ",",
  ),
);

export function recommendedRowShows(id: string, plan: PlanFlags | null, drive: DriveType | string): boolean {
  const p = plan ?? {
    oilService: false,
    multiPoint: false,
    powertrain: false,
    cooling: false,
    highMiles: false,
    sparkPlugs: false,
    coolantService: false,
    brakeFluidService: false,
  };
  if (id === "header" || id === "result") return true;
  if (id === "trans.fourwd") return p.powertrain && driveShows(drive, "4WD");
  if (id.startsWith("trans.")) return p.powertrain || p.highMiles;
  if ((id === "transferSeep" || id === "frontDiffSeep") && !driveShows(drive, "4WD")) return false;
  let on = REC_ALWAYS.has(id);
  if (p.oilService && REC_OIL.has(id)) on = true;
  if (p.multiPoint && REC_MULTI.has(id)) on = true;
  if (p.powertrain && REC_POWER.has(id)) on = true;
  if (p.cooling && REC_COOL.has(id)) on = true;
  if (p.sparkPlugs && (id === "baseline.sparkPlugs" || id === "baseline")) on = true;
  if (p.coolantService && (id === "baseline.coolantService" || id === "baseline" || id === "coolant")) on = true;
  if (p.brakeFluidService && (id === "baseline.brakeFluid" || id === "baseline" || id === "brake")) on = true;
  if (p.highMiles && (REC_HIGH.has(id) || id.startsWith("baseline."))) on = true;
  if (id === "transTable" && (p.powertrain || p.highMiles)) on = true;
  return on;
}

export function rowShows(
  id: string,
  visit: VisitType | "",
  drive: DriveType | string = "",
  plan: PlanFlags | null = null,
): boolean {
  if (!visit) return id === "header" || id === "result";
  if (visit === "recommended") return recommendedRowShows(id, plan, drive);
  if (visit === "oil-change") {
    if (id === "header" || id === "result") return true;
    if ((id === "transferSeep" || id === "frontDiffSeep" || id === "trans.fourwd") && !driveShows(drive, "4WD")) {
      return false;
    }
    return OIL_SHORT.has(id);
  }
  if (id === "atfReject") return true;
  if (id.startsWith("trans.")) {
    if (id === "trans.fourwd") return visitShows(visit, "15k") && driveShows(drive, "4WD");
    return visitShows(visit, "15k");
  }
  if (id === "transferSeep" || id === "frontDiffSeep") return visitShows(visit, "15k") && driveShows(drive, "4WD");
  if (id === "rearDiffSeep" || id === "scan" || id === "transTable" || BRAKE_INTERVAL_IDS.has(id) || id.startsWith("steering.")) {
    return visitShows(visit, "15k");
  }
  if (id.startsWith("underbody.")) {
    return visitShows(visit, taggedMinVisit(UNDERBODY_ITEMS.find((it) => it.key === id.slice(10))));
  }
  if (id === "cabin.recalls") return visitShows(visit, "15k");
  if (id.startsWith("cabin.")) {
    return visitShows(visit, taggedMinVisit(CABIN_ITEMS.find((it) => it.key === id.slice(6))));
  }
  if (id === "smodPlan") return visitShows(visit, "30k");
  if (id === "baseline" || id.startsWith("baseline.")) return visitShows(visit, "baseline");
  if (id.startsWith("road.")) {
    return visitShows(visit, taggedMinVisit(ROAD_ITEMS.find((it) => it.key === id.slice(5))));
  }
  return true;
}

export const CHECK_ROW_IDS: string[] = [
  "oilLevel",
  "oilLeak",
  "coolant",
  "atf",
  "psf",
  "brake",
  "washer",
  "transferSeep",
  "frontDiffSeep",
  "rearDiffSeep",
  "timingCover",
  "manifolds",
  "idle",
  "belt",
  "radiator",
  "atfLines",
  "airFilter",
  "battery",
  "grounds",
  "pcv",
  "scan",
  "pads",
  "rotors",
  "hoses",
  "master",
  "pedalHeight",
  "parking",
  "absLamps",
  "tread",
  "tireAge",
  "wear",
  "pressures",
  "lugTorque",
  "bearings",
  "alignment",
  ...STEERING_ITEMS.map((i) => `steering.${i.key}`),
  ...UNDERBODY_ITEMS.map((i) => `underbody.${i.key}`),
  ...CABIN_ITEMS.map((i) => `cabin.${i.key}`),
  "cabin.recalls",
  ...ROAD_ITEMS.map((i) => `road.${i.key}`),
  "smodPlan",
  ...BASELINE_ITEMS.map((i) => `baseline.${i.key}`),
];

export const CHECK_TOTAL = CHECK_ROW_IDS.length;

export function checkTotal(
  visit: VisitType | "",
  drive: DriveType | string = "",
  plan: PlanFlags | null = null,
): number {
  return CHECK_ROW_IDS.filter((id) => rowShows(id, visit, drive, plan)).length;
}

export function drivelineShaftLabel(drive: DriveType | string): string {
  return drive === "2WD"
    ? "Rear drive shaft / U-joints / slip yoke"
    : "Front & rear drive shafts / U-joints / slip yoke (4WD)";
}

export function oilWaitReady(startedAt: number | null | undefined, now = Date.now()): boolean {
  return startedAt != null && now - startedAt >= OIL_WAIT_MS;
}

function checkedCount(draft: InspectionDraft): number {
  const visit = draft.header.visitType;
  const drive = draft.header.drive;
  const plan = visit === "recommended" ? draft.header.plan : null;
  let n = 0;
  const bump = (id: string, row: CheckRow | undefined) => {
    if (rowShows(id, visit, drive, plan) && row?.checked) n += 1;
  };
  bump("oilLevel", draft.fluids.oilLevel);
  bump("oilLeak", draft.fluids.oilLeak);
  bump("coolant", draft.fluids.coolant);
  bump("atf", draft.fluids.atf);
  bump("psf", draft.fluids.psf);
  bump("brake", draft.fluids.brake);
  bump("washer", draft.fluids.washer);
  bump("transferSeep", draft.fluids.transferSeep);
  bump("frontDiffSeep", draft.fluids.frontDiffSeep);
  bump("rearDiffSeep", draft.fluids.rearDiffSeep);
  bump("timingCover", draft.engine.timingCover);
  bump("manifolds", draft.engine.manifolds);
  bump("idle", draft.engine.idle);
  bump("belt", draft.engine.belt);
  bump("radiator", draft.engine.radiator);
  bump("atfLines", draft.engine.atfLines);
  bump("airFilter", draft.engine.airFilter);
  bump("battery", draft.engine.battery);
  bump("grounds", draft.engine.grounds);
  bump("pcv", draft.engine.pcv);
  bump("scan", draft.engine.scan);
  bump("pads", draft.brakes.pads);
  bump("rotors", draft.brakes.rotors);
  bump("hoses", draft.brakes.hoses);
  bump("master", draft.brakes.master);
  bump("pedalHeight", draft.brakes.pedalHeight);
  bump("parking", draft.brakes.parking);
  bump("absLamps", draft.brakes.absLamps);
  bump("tread", draft.brakes.tread);
  bump("tireAge", draft.brakes.tireAge);
  bump("wear", draft.brakes.wear);
  bump("pressures", draft.brakes.pressures);
  bump("lugTorque", draft.brakes.lugTorque);
  bump("bearings", draft.brakes.bearings);
  bump("alignment", draft.brakes.alignment);
  for (const it of STEERING_ITEMS) bump(`steering.${it.key}`, draft.steering.items[it.key]);
  for (const it of UNDERBODY_ITEMS) bump(`underbody.${it.key}`, draft.underbody.items[it.key]);
  for (const it of CABIN_ITEMS) bump(`cabin.${it.key}`, draft.cabin.items[it.key]);
  bump("cabin.recalls", draft.cabin.recalls);
  for (const it of ROAD_ITEMS) bump(`road.${it.key}`, draft.road.items[it.key]);
  bump("smodPlan", draft.result.smodPlan);
  const baseline = draft.baseline as unknown as Record<string, CheckRow>;
  for (const it of BASELINE_ITEMS) bump(`baseline.${it.key}`, baseline[it.key]);
  return n;
}

export function isDraftStarted(draft: InspectionDraft): boolean {
  if (draft.header.miles.trim() || draft.header.inspector.trim() || draft.header.vin.trim() || draft.result.overall) {
    return true;
  }
  return checkedCount(draft) > 0;
}
