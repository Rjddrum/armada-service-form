import {
  CABIN_ITEMS,
  ROAD_ITEMS,
  STEERING_ITEMS,
  TRANS_ROWS,
  UNDERBODY_ITEMS,
  BASELINE_ITEMS,
  driveShows,
  rowShows,
  type DriveType,
  type PlanFlags,
  type VisitType,
} from "../inspection/types.ts";

/** Every checklist / walk-through row that has a Guide control. */
export function checklistGuideIds(): string[] {
  return [
    "fluids.oilLevel",
    "fluids.oilLeak",
    "fluids.coolant",
    "fluids.atf",
    "fluids.psf",
    "fluids.brake",
    "fluids.washer",
    "fluids.transferSeep",
    "fluids.frontDiffSeep",
    "fluids.rearDiffSeep",
    "engine.timingCover",
    "engine.manifolds",
    "engine.idle",
    "engine.belt",
    "engine.radiator",
    "engine.atfLines",
    "engine.airFilter",
    "engine.battery",
    "engine.grounds",
    "engine.pcv",
    "engine.scan",
    ...TRANS_ROWS.map((r) => r.guideId),
    "trans.atfReject",
    "brakes.pads",
    "brakes.rotors",
    "brakes.hoses",
    "brakes.master",
    "brakes.pedalHeight",
    "brakes.parking",
    "brakes.absLamps",
    "brakes.tread",
    "brakes.tireAge",
    "brakes.wear",
    "brakes.pressures",
    "brakes.lugTorque",
    "brakes.bearings",
    "brakes.alignment",
    ...STEERING_ITEMS.map((i) => i.guideId),
    ...UNDERBODY_ITEMS.map((i) => i.guideId),
    ...CABIN_ITEMS.map((i) => i.guideId),
    "cabin.recalls",
    ...ROAD_ITEMS.map((i) => i.guideId),
    "result.smodPlan",
    "result.overall",
    ...BASELINE_ITEMS.map((i) => i.guideId),
  ];
}

const BARE_PREFIX: Record<string, string> = {
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
  atfReject: "trans",
  smodPlan: "result",
};

/** Walk rows that are forms, not a single how-to. */
const WALK_NO_GUIDE = new Set(["header", "transTable", "baseline", "engine.overview", "cabin.dash"]);

/** Map a Walk-the-truck row id to its Guide chapter, or null if that row has no Guide. */
export function walkRowGuideId(row: string): string | null {
  if (WALK_NO_GUIDE.has(row)) return null;
  if (row === "result") return "result.overall";
  if (row.includes(".")) return row;
  const prefix = BARE_PREFIX[row];
  return prefix ? `${prefix}.${row}` : null;
}

/** Checklist row id for a Guide chapter. Trans shift rows share the 15k table. */
export function guideRowId(guideId: string): string {
  if (guideId === "result.overall") return "result";
  if (guideId === "trans.atfReject") return "atfReject";
  if (guideId === "trans.fourwd") return "trans.fourwd";
  if (guideId.startsWith("trans.")) return "transTable";
  const dot = guideId.indexOf(".");
  if (dot < 0) return guideId;
  const prefix = guideId.slice(0, dot);
  const rest = guideId.slice(dot + 1);
  if (prefix === "steering" || prefix === "underbody" || prefix === "cabin" || prefix === "road" || prefix === "baseline") return guideId;
  return rest;
}

/** Guide chapters that belong to a visible checklist row for this visit / drive. */
export function guideShows(
  guideId: string,
  visit: VisitType | "",
  drive: DriveType | "",
  plan: PlanFlags | null = null,
): boolean {
  if (guideId === "result.overall") return true;
  if (guideId === "trans.fourwd") return rowShows("transTable", visit, drive, plan) && driveShows(drive, "4WD");
  return rowShows(guideRowId(guideId), visit, drive, plan);
}

export function visibleGuideIds(
  visit: VisitType | "",
  drive: DriveType | "",
  plan: PlanFlags | null = null,
): string[] {
  return checklistGuideIds().filter((id) => guideShows(id, visit, drive, plan));
}
