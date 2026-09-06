import { isOilChange, rowShows, type DriveType, type PlanFlags, type VisitType } from "./types.ts";
import { BASELINE_ITEMS } from "./types.ts";
import { walkRowGuideId } from "../guide/catalog.ts";
import { STATUS_ROW_LABELS } from "./status.ts";

export interface WalkStep {
  num: number;
  title: string;
  blurb: string;
  rows: string[];
}

export const WALK_STEPS: WalkStep[] = [
  {
    num: 1,
    title: "Outside, engine off, cold",
    blurb: "Tires and lights. Look at the ground for fresh drips. Each row’s Guide opens that part’s how-to.",
    rows: [
      "tread",
      "tireAge",
      "wear",
      "pressures",
      "lugTorque",
      "cabin.jack",
      "cabin.airbag",
      "cabin.seatbelts",
      "cabin.latches",
      "cabin.horn",
      "cabin.lights",
      "cabin.wipers",
      "cabin.hvac",
      "cabin.glass",
      "cabin.recalls",
    ],
  },
  {
    num: 2,
    title: "Under hood, engine off, cold",
    blurb: "Do not start it yet. Coolant reservoir, radiator, brake fluid, PSF, battery, air filter, PCV.",
    rows: [
      "coolant",
      "radiator",
      "engine.overview",
      "brake",
      "psf",
      "battery",
      "grounds",
      "airFilter",
      "pcv",
      "washer",
      "baseline.sparkPlugs",
      "baseline.coolantService",
      "baseline.brakeFluid",
    ],
  },
  {
    num: 3,
    title: "First start, still in the driveway",
    blurb: "You are listening. Do not rev it. Timing cover, manifolds, idle, dash lamps.",
    rows: ["timingCover", "manifolds", "idle", "scan", "absLamps", "cabin.dash", "road.coldStart", "baseline.manifoldBolts"],
  },
  {
    num: 4,
    title: "Engine oil",
    blurb: "Oil-change visit: drain, filter, fill. 15k / 30k: hot dipstick after 10 minutes.",
    rows: ["oilLevel"],
  },
  {
    num: 5,
    title: "Transmission fluid (the important one)",
    blurb: "Idle, shift P-R-N-D, then HOT read. Pink, milky, or sweet is SMOD — stop.",
    rows: ["atf"],
  },
  {
    num: 6,
    title: "Short road loop",
    blurb: "Quiet road. Temp gauge, one clean upshift, a stop. Full trans table is 15k / 30k. Skip this drive if ATF is pink or milky.",
    rows: ["transTable", "road.overheat", "road.brakes", "road.vibration", "road.shifts", "road.lamps"],
  },
  {
    num: 7,
    title: "After the drive (heat makes leaks show)",
    blurb: "Park level. Engine off. Oil leak, belt, pads glance, pan, cooler fittings. Front-end is 15k / 30k.",
    rows: [
      "oilLeak",
      "belt",
      "pads",
      "rotors",
      "hoses",
      "master",
      "pedalHeight",
      "parking",
      "bearings",
      "alignment",
      "steering.steeringPlay",
      "steering.tieRods",
      "steering.ballJoints",
      "steering.sway",
      "steering.springs",
      "steering.shocks",
      "steering.rack",
      "steering.shafts",
      "steering.seals",
      "steering.mounts",
      "underbody.oilPan",
      "underbody.transPan",
      "underbody.fuel",
      "underbody.exhaust",
      "underbody.frame",
      "underbody.lines",
      "baseline.seepage",
      "baseline.ucaJoints",
      "baseline.airShocks",
    ],
  },
  {
    num: 8,
    title: "Radiator / SMOD check",
    blurb: "ATF cooler is built into this radiator. Wet fittings or milky ATF — do not keep driving it. 30k / 270k: prevention, not just detection.",
    rows: ["atfLines", "atfReject", "smodPlan"],
  },
  {
    num: 9,
    title: "Differentials and transfer case",
    blurb: "Not dipstick items. 30k service. Hidden on an oil-change short check.",
    rows: ["transferSeep", "frontDiffSeep", "rearDiffSeep", "baseline.diffFluid"],
  },
  {
    num: 10,
    title: "Result",
    blurb: "Call it. Pink/milky/sweet ATF cannot be a Pass. 30k: write the SMOD prevention plan.",
    rows: ["result"],
  },
];

const SECTION_SHORT: Record<number, string> = {
  1: "Outside",
  2: "Fluids",
  3: "First start",
  4: "Engine oil",
  5: "ATF",
  6: "Road",
  7: "Leaks / chassis",
  8: "SMOD",
  9: "Diffs",
  10: "Result",
};

const PLAIN_TITLE: Record<string, string> = {
  oilLevel: "dipstick",
  oilLeak: "wet spots, not dust",
  coolant: "overflow tank",
  atf: "skinny stick, engine idling",
  radiator: "front tank + cooler fittings",
  atfLines: "in-radiator ATF cooler",
  pads: "inner pad through the window",
  tread: "tread + inner shoulder",
  timingCover: "listen, do not rev",
  engine: "wide bay shot",
  "engine.overview": "wide bay shot",
  "cabin.dash": "key ON, lamps",
  result: "overall call",
};

const LOOK_FOR: Record<string, string[]> = {
  oilLevel: [
    "Level between the marks after the 10-minute wait",
    "No metallic glitter",
    "Not milky / coffee-colored (coolant in oil)",
    "No strong fuel smell",
  ],
  "oilLevel.service": [
    "Record oil type, amount, filter PN, crush washer",
    "Miles come from the header",
    "Do not read the dipstick after a fresh fill",
  ],
  atf: [
    "Idle, then shift P-R-N-D, then HOT read",
    "Color is red/amber, not pink or milky",
    "Smell is ATF, not sweet (SMOD)",
    "Level in the HOT hashes with the engine running",
  ],
  pads: [
    "Inner pad through the caliper window, flashlight",
    "Factory min 3.0 mm; replace at 1.0 mm",
    "Inner vs outer taper can mean a sticky caliper or UCA",
  ],
  radiator: [
    "Stand at the front bumper, hood open",
    "End tanks dry — no wet ATF cooler fittings",
    "Unknown original radiator at high miles is an SMOD risk even if ATF looks red",
  ],
  atfLines: [
    "Two small fittings on the passenger-side end tank",
    "Dry fittings = good. Wet = photo and do not ignore",
    "Pink/milky ATF plus wet fittings — do not drive",
  ],
  coolant: [
    "Overflow tank between MIN and MAX, engine cold",
    "No oil sheen, no strawberry tint",
    "Factory freeze around −34°F on a 50/50 mix",
  ],
  tread: [
    "Depth in 32nds, all four plus spare if you have it",
    "Inner shoulder — that is where this truck wears first",
    "2/32 is legal minimum; even wear is the spec",
  ],
  timingCover: [
    "One start, no rev. Listen at the front cover",
    "1–3 seconds then gone can be a watch",
    "Ongoing rattle plus low oil — do not drive",
  ],
  result: [
    "Overall is Pass, schedule repairs, or Do not drive",
    "Pink/milky/sweet ATF cannot be a Pass",
    "Save, print, PDF, share, or email from the report",
  ],
};

export interface WalkCard {
  id: string;
  stageNum: number;
  stageTitle: string;
  section: string;
  shopTitle: string;
  plainTitle: string;
  lookFor: string[];
  guideId: string | null;
}

/** 2WD drops transfer/front diff. Oil-change is Step 12 short set. */
export function walkRowVisible(
  id: string,
  visit: VisitType | "",
  drive: DriveType | "",
  plan: PlanFlags | null = null,
): boolean {
  return rowShows(id, visit, drive, plan);
}

export function walkStepCopy(
  step: WalkStep,
  drive: DriveType | "",
  visit: VisitType | "" = "",
  oilChange = isOilChange(visit),
): { title: string; blurb: string } {
  if (step.num === 4) {
    if (oilChange) {
      return {
        title: "Oil change",
        blurb: "Drain, filter, fill. Record type, quarts, filter PN, crush washer. Not a dipstick read — no color, no level.",
      };
    }
    return {
      title: "After warmup — engine oil for real",
      blurb: "Engine off. Wait more than 10 minutes so oil drains back. Then the dipstick.",
    };
  }
  if (oilChange) {
    if (step.num === 1) {
      return { title: "Tires and lights", blurb: "Tread, age, wear, pressures, lamps, wipers. Ground for drips." };
    }
    if (step.num === 3) {
      return { title: "Listen", blurb: "Do not rev it. Timing cover, manifolds, idle, dash lamps. Scan is 15k." };
    }
    if (step.num === 6) {
      return {
        title: "Short road loop",
        blurb: "Temp gauge, one clean upshift, a stop. Not the 15–20 min trans table.",
      };
    }
    if (step.num === 7) {
      return {
        title: "Leak look",
        blurb: "Heat makes leaks show. Oil leak, belt, visual pads, pan, ATF cooler fittings.",
      };
    }
  }
  if (step.num === 9 && drive === "2WD") {
    return {
      title: "Rear differential",
      blurb: "2WD has no transfer case or front axle. Rear diff is a 30k service item.",
    };
  }
  return { title: step.title, blurb: step.blurb };
}

function shopTitle(id: string): string {
  if (id === "engine.overview") return "Engine bay overview";
  if (id === "cabin.dash") return "Dash warning lights (key ON)";
  if (id === "result") return "Overall result";
  if (id === "transTable") return "Transmission shift table";
  return STATUS_ROW_LABELS[id] ?? id;
}

function lookForOf(id: string, oilChange: boolean): string[] {
  if (id === "oilLevel" && oilChange) return LOOK_FOR["oilLevel.service"] ?? [];
  return LOOK_FOR[id] ?? [];
}

function expandRow(id: string): string[] {
  if (id === "baseline") return BASELINE_ITEMS.map((i) => `baseline.${i.key}`);
  return [id];
}

/** One card per visible checklist row, in the 10-stage yard order. Result is last. */
export function walkQueue(
  visit: VisitType | "",
  drive: DriveType | "",
  plan: PlanFlags | null = null,
  oilChange = isOilChange(visit),
): WalkCard[] {
  const out: WalkCard[] = [];
  for (const step of WALK_STEPS) {
    const copy = walkStepCopy(step, drive, visit, oilChange);
    for (const raw of step.rows) {
      for (const id of expandRow(raw)) {
        if (id === "header") continue;
        if (!walkRowVisible(id, visit, drive, plan)) continue;
        const guideId = walkRowGuideId(id);
        out.push({
          id,
          stageNum: step.num,
          stageTitle: copy.title,
          section: SECTION_SHORT[step.num] ?? copy.title,
          shopTitle: id === "oilLevel" && oilChange ? "Record oil change" : shopTitle(id),
          plainTitle: id === "oilLevel" && oilChange ? "type, amount, filter, miles" : PLAIN_TITLE[id] ?? "",
          lookFor: lookForOf(id, oilChange),
          guideId,
        });
      }
    }
  }
  return out;
}
