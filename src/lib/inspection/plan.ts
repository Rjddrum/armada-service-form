import { rowShows, type InspectionDraft, type VisitType } from "./types.ts";
import {
  historyLasts,
  maintFlags,
  type MaintFlag,
  type MaintRow,
} from "./maint.ts";

export type RecTone = "due" | "watch" | "skip";

export interface RecLine {
  key: string;
  label: string;
  tone: RecTone;
  note?: string;
  guideId?: string;
}

export interface InspectionPlan {
  miles: number;
  unknownHistory: boolean;
  oilService: boolean;
  multiPoint: boolean;
  powertrain: boolean;
  cooling: boolean;
  highMiles: boolean;
  sparkPlugs: boolean;
  coolantService: boolean;
  brakeFluidService: boolean;
  atfHot: boolean;
  lines: RecLine[];
  flags: MaintFlag[];
}

const OIL_INTERVAL = 5000;
const OIL_TOW = 3500;
const MULTI_INTERVAL = 15000;
const POWER_INTERVAL = 30000;
const SPARK_INTERVAL = 105000;
const HIGH_MILES = 200000;

export function parseMiles(raw: string | undefined): number | null {
  const t = (raw ?? "").replace(/[^\d]/g, "");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Last service known: miles since last. Unknown: current miles vs the interval (safer). */
function intervalTone(
  current: number,
  last: number | null,
  interval: number,
  unknownFallback: RecTone,
): RecTone {
  if (current <= 0) return "skip";
  if (last != null && last > current) return "skip";
  if (last != null && last >= 0) {
    const delta = current - last;
    if (delta >= interval) return "due";
    if (delta >= interval * 0.85) return "watch";
    return "skip";
  }
  if (current >= interval) return unknownFallback === "watch" ? "watch" : "due";
  if (current >= interval * 0.85) return "watch";
  return unknownFallback;
}

export function isForcedVisit(visit: VisitType | ""): visit is Exclude<VisitType, "recommended" | ""> {
  return visit === "oil-change" || visit === "15k" || visit === "30k" || visit === "baseline-270k";
}

export function flagsFromPlan(p: InspectionPlan): {
  oilService: boolean;
  multiPoint: boolean;
  powertrain: boolean;
  cooling: boolean;
  highMiles: boolean;
  sparkPlugs: boolean;
  coolantService: boolean;
  brakeFluidService: boolean;
} {
  return {
    oilService: p.oilService,
    multiPoint: p.multiPoint,
    powertrain: p.powertrain,
    cooling: p.cooling,
    highMiles: p.highMiles,
    sparkPlugs: p.sparkPlugs,
    coolantService: p.coolantService,
    brakeFluidService: p.brakeFluidService,
  };
}

function pickLast(logMiles: number | null, headerMiles: string): number | null {
  if (logMiles != null) return logMiles;
  return parseMiles(headerMiles);
}

export function buildPlan(draft: InspectionDraft, log: MaintRow[] = []): InspectionPlan {
  const miles = parseMiles(draft.header.miles) ?? 0;
  const hist = historyLasts(log);
  const lastOil = pickLast(hist.oil, draft.header.lastOilMi);
  const lastAtf = pickLast(hist.atf, draft.header.lastAtfMi);
  const lastRad = pickLast(hist.radiator, draft.header.lastRadiatorMi);
  const lastBrake = pickLast(hist.brakeFluid, draft.header.lastBrakeMi);
  const lastDiff = pickLast(hist.diff, draft.header.lastDiffMi);
  const logEmpty = log.length === 0;
  const unknownHistory =
    lastOil == null && lastAtf == null && lastRad == null && lastBrake == null && lastDiff == null;
  const tow = draft.header.towPkg === "Y";
  const oilInt = tow ? OIL_TOW : OIL_INTERVAL;
  const flags = miles > 0
    ? maintFlags(log, miles, tow, undefined, { oil: lastOil, atf: lastAtf, radiator: lastRad })
    : [];
  const flagKeys = new Set(flags.map((f) => f.key));

  // History first. Header last-service miles fill gaps. Generic bands last.
  const oilTone = flagKeys.has("oil")
    ? "due"
    : lastOil != null
      ? intervalTone(miles, lastOil, oilInt, "due")
      : logEmpty
        ? miles > 0
          ? "due"
          : "skip"
        : miles > 0
          ? "due"
          : "skip";

  const multiTone = intervalTone(
    miles,
    lastBrake,
    MULTI_INTERVAL,
    miles >= MULTI_INTERVAL ? "due" : "skip",
  );

  let powerTone: RecTone = flagKeys.has("atf")
    ? "watch"
    : intervalTone(miles, lastAtf ?? lastDiff, POWER_INTERVAL, miles >= POWER_INTERVAL ? "watch" : "skip");
  if (tow && miles > 0 && powerTone === "skip") powerTone = "watch";

  const atfColor = draft.fluids.atf.color;
  const atfNotRed = atfColor === "brown" || atfColor === "pink" || atfColor === "milky";
  const atfBad = atfColor === "pink" || atfColor === "milky" || draft.fluids.atf.smell === "sweet";
  const wetFit = draft.engine.atfLines.wetFittings === "Y";
  const radUnknown =
    hist.radiatorUnknown &&
    lastRad == null &&
    (draft.result.smodPlan.radiatorLast === "" || draft.result.smodPlan.radiatorLast === "original");
  let coolTone: RecTone = "skip";
  if (flagKeys.has("smod-history") || atfBad || wetFit || atfNotRed) coolTone = "due";
  else if (flagKeys.has("coolant")) coolTone = "watch";
  else if (radUnknown && miles >= POWER_INTERVAL) coolTone = "watch";
  else if (lastRad != null) coolTone = intervalTone(miles, lastRad, POWER_INTERVAL, "watch");

  const highMiles = miles >= HIGH_MILES;
  const sparkFromLog = flagKeys.has("spark");
  const sparkPlugs = sparkFromLog || (highMiles && hist.sparkUnknown);
  const coolantService = flagKeys.has("coolant") || highMiles;
  const brakeFluidService = flagKeys.has("brake-fluid") || highMiles;
  const sparkTone: RecTone = sparkPlugs ? "watch" : "skip";

  const oilService = oilTone === "due" || oilTone === "watch";
  const multiPoint = multiTone === "due" || multiTone === "watch";
  const powertrain = powerTone === "due" || powerTone === "watch";
  const cooling = coolTone === "due" || coolTone === "watch" || atfBad || wetFit || flagKeys.has("smod-history");
  const atfHot = powertrain || highMiles || flagKeys.has("atf");

  const lines: RecLine[] = [
    {
      key: "fluids",
      label: "Oil and fluids inspection",
      tone: miles > 0 ? "due" : "skip",
      note: oilService
        ? `Oil change is due (~${oilInt.toLocaleString("en-US")} mi${tow ? ", tow package" : ""}). Record type, amount, filter — not a dipstick after the drain.`
        : "Coolant, brake fluid, ATF color/smell, cooler fittings, leaks.",
      guideId: "fluids.oilLevel",
    },
    {
      key: "brakes",
      label: "Brakes",
      tone: multiPoint ? (multiTone === "watch" ? "watch" : "due") : "skip",
      note: "Pads, inner shoulder, a real stop.",
      guideId: "brakes.pads",
    },
    {
      key: "tires",
      label: "Tires / suspension glance",
      tone: miles > 0 ? "due" : "skip",
      note: "Pressures, tread, a look at the inner shoulder.",
      guideId: "brakes.tread",
    },
    {
      key: "trans",
      label: "Transmission service review (RE5R05A + in-radiator cooler)",
      tone: powertrain ? (powerTone === "due" ? "due" : "watch") : "skip",
      note: "ATF (automatic transmission fluid) HOT read and cooler fittings. This gearbox shares a cooler inside the radiator.",
      guideId: "engine.atfLines",
    },
    {
      key: "cooling",
      label: "Cooling system / SMOD check",
      tone: cooling ? (coolTone === "due" ? "due" : "watch") : "skip",
      note: "SMOD is strawberry milkshake of death — coolant mixed into the transmission. Pink, milky, or sweet ATF is an emergency.",
      guideId: "result.smodPlan",
    },
    {
      key: "spark",
      label: "105k spark-plug interval",
      tone: sparkTone,
      note: sparkTone === "skip"
        ? "Not due this visit unless never documented."
        : sparkFromLog
          ? flags.find((f) => f.key === "spark")?.text
          : "Iridium interval is 105,000 miles. At this mileage they are undocumented — treat as unknown.",
      guideId: "baseline.sparkPlugs",
    },
  ];

  if (highMiles) {
    lines.push({
      key: "high",
      label: "High-miles powertrain listen and rust",
      tone: "due",
      note: "Timing-cover rattle window, manifolds, frame/rust, coolant age, brake-fluid service, full shift table.",
      guideId: "engine.timingCover",
    });
  } else if (miles > 0) {
    lines.push({
      key: "high",
      label: "Timing-cover / 270k baseline set",
      tone: "skip",
      note: "Not the 270k baseline. That set starts at 200k or when you force Baseline.",
    });
  }

  return {
    miles,
    unknownHistory,
    oilService,
    multiPoint,
    powertrain,
    cooling,
    highMiles,
    sparkPlugs,
    coolantService,
    brakeFluidService,
    atfHot,
    flags,
    lines: miles > 0 ? lines : [],
  };
}

export function atfHotRequired(draft: InspectionDraft, log: MaintRow[] = []): boolean {
  const v = draft.header.visitType;
  if (v === "oil-change") return false;
  if (v === "15k" || v === "30k" || v === "baseline-270k") return true;
  if (v === "recommended") {
    if (draft.header.plan) return draft.header.plan.powertrain || draft.header.plan.highMiles;
    return buildPlan(draft, log).atfHot;
  }
  return false;
}

export function oilChangeMode(draft: InspectionDraft, log: MaintRow[] = []): boolean {
  if (draft.header.visitType === "oil-change") return true;
  if (draft.header.visitType === "recommended") {
    if (draft.header.plan) return draft.header.plan.oilService;
    return buildPlan(draft, log).oilService;
  }
  return false;
}

export function recStamp(plan: InspectionPlan): string {
  if (!plan.miles) return "";
  return `Inspection set from mileage ${plan.miles.toLocaleString("en-US")}`;
}

export function planForShows(draft: InspectionDraft, log: MaintRow[] = []): InspectionPlan | null {
  return draft.header.visitType === "recommended" ? buildPlan(draft, log) : null;
}

export function rowShowsDraft(id: string, draft: InspectionDraft, log: MaintRow[] = []): boolean {
  return rowShows(id, draft.header.visitType, draft.header.drive, planForShows(draft, log));
}
