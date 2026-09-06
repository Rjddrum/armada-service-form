import {
  CORNERS,
  CORNERS_SPARE,
  TRANS_ROWS,
  visitShows,
  rowShows,
  type InspectionDraft,
} from "./types.ts";
import { priorWearVisit, wearCompare, wearFlags } from "./wear.ts";

const REVIEW = "Needs another look or a technician review.";

export interface RangeFlag {
  id: string;
  label: string;
  measured: string;
  range: string;
  note: string;
  guideId: string;
}

export function flagLine(f: RangeFlag): string {
  return `${f.label}: ${f.measured} (${f.range})`;
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(",", ".");
  if (!t) return null;
  const m = t.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

function parseInches(raw: string): number | null {
  const t = raw.trim().toLowerCase();
  if (!t) return null;
  const n = parseNum(t);
  if (n == null) return null;
  if (/\bmm\b/.test(t)) return n / 25.4;
  return n;
}

function parseTread32(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const frac = t.match(/(\d+(?:\.\d+)?)\s*\/\s*32/i);
  if (frac) return Number(frac[1]);
  const n = parseNum(t);
  if (n == null) return null;
  if (/\bmm\b/i.test(t)) return (n / 25.4) * 32;
  return n;
}

function parseDotYears(raw: string, asOf: Date): number | null {
  const t = raw.trim();
  if (!t) return null;
  const yrOnly = t.match(/\b((?:19|20)\d{2})\b/);
  const weekYear = t.match(/\b(\d{1,2})\s*[/\- ]\s*(\d{2})\b/);
  const digits = t.replace(/\D/g, "");
  const asYears = t.match(/(\d+(?:\.\d+)?)\s*(?:yr|yrs|year)/i);
  if (asYears) return Number(asYears[1]);
  let week = 1;
  let year: number | null = null;
  if (digits.length === 4 && Number(digits.slice(0, 2)) >= 1 && Number(digits.slice(0, 2)) <= 53) {
    week = Number(digits.slice(0, 2));
    const yy = Number(digits.slice(2, 4));
    year = yy >= 90 ? 1900 + yy : 2000 + yy;
  } else if (weekYear) {
    week = Number(weekYear[1]);
    const yy = Number(weekYear[2]);
    year = yy >= 90 ? 1900 + yy : 2000 + yy;
  } else if (yrOnly) {
    year = Number(yrOnly[1]);
  }
  if (year == null) return null;
  const made = new Date(year, 0, 1 + (week - 1) * 7);
  const years = (asOf.getTime() - made.getTime()) / (365.25 * 24 * 3600 * 1000);
  return Number.isFinite(years) ? years : null;
}

function asOfDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  if (y && m && d) return new Date(y, m - 1, d);
  return new Date();
}

function parseFreezeF(raw: string, bareOk = false): number | null {
  const t = raw.trim();
  if (!t) return null;
  if (!bareOk && !/[fF°]|freeze|protect/.test(t)) return null;
  return parseNum(t);
}

const TRANS_FAIL = new Set(["Delay", "Bang", "Flare", "Harsh", "Miss", "Hunt", "Shudder", "Slip", "Late", "Binds", "No"]);

/**
 * Factory windows from the 2005 Armada how-to + FSM SDS for rear rotors.
 * Entered values and fail picks hit the header even if that row is hidden on this visit.
 */
export function outOfRangeFlags(
  draft: InspectionDraft,
  photos: Record<string, unknown> = {},
  history: InspectionDraft[] = [],
): RangeFlag[] {
  const flags: RangeFlag[] = [];
  const push = (f: RangeFlag) => flags.push(f);

  const atf = draft.fluids.atf;
  if (atf.inRange === "N") {
    push({
      id: "atf.inRange",
      label: "ATF HOT level",
      measured: "not in HOT range",
      range: "factory HOT marks at ~149°F",
      note: REVIEW,
      guideId: "fluids.atf",
    });
  }
  if (atf.color === "pink" || atf.color === "milky") {
    push({
      id: "atf.color",
      label: "ATF color",
      measured: atf.color,
      range: "factory red/amber — not pink or milky",
      note: "Coolant in the ATF (SMOD). Do not drive it. Technician review.",
      guideId: "fluids.atf",
    });
  }
  if (atf.smell === "sweet" || atf.smell === "burnt") {
    push({
      id: "atf.smell",
      label: "ATF smell",
      measured: atf.smell,
      range: "factory: smells like ATF, not sweet or burnt",
      note: atf.smell === "sweet" ? "Sweet is SMOD. Do not drive it. Technician review." : REVIEW,
      guideId: "fluids.atf",
    });
  }
  if (draft.trans?.atfReject) {
    push({
      id: "trans.atfReject",
      label: "ATF reject",
      measured: "reject checked",
      range: "factory: red/amber ATF, no coolant mix",
      note: "SMOD reject. Do not drive it. Technician review.",
      guideId: "trans.atfReject",
    });
  }
  if (draft.engine.atfLines?.wetFittings === "Y") {
    push({
      id: "atfLines.wet",
      label: "ATF cooler fittings",
      measured: "wet",
      range: "factory: dry fittings at the radiator",
      note: "Wet cooler fittings are a mix path. Technician review.",
      guideId: "engine.atfLines",
    });
  }

  const cool = draft.fluids.coolant ?? { levelColor: "", capSeated: "", freezeF: "" };
  const freeze = parseFreezeF(cool.freezeF, true) ?? parseFreezeF(cool.levelColor);
  if (freeze != null && freeze > -34) {
    push({
      id: "coolant.freeze",
      label: "Coolant freeze point",
      measured: `${freeze}°F`,
      range: "factory spec −34°F",
      note: REVIEW,
      guideId: "fluids.coolant",
    });
  }
  if (/\b(oily|oil film|milky|rust|rusty|empty|below\s*min|strawberry|red tint)\b/i.test(cool.levelColor)) {
    push({
      id: "coolant.level",
      label: "Coolant level / strength",
      measured: cool.levelColor.trim(),
      range: "factory: MIN–MAX, 50/50 Nissan LL, no oil film",
      note: REVIEW,
      guideId: "fluids.coolant",
    });
  }
  if (cool.capSeated === "N") {
    push({
      id: "coolant.cap",
      label: "Coolant cap",
      measured: "not seated",
      range: "factory: reservoir cap seated",
      note: REVIEW,
      guideId: "fluids.coolant",
    });
  }

  const psfColor = draft.fluids.psf?.color?.trim() ?? "";
  if (/\b(black|burnt|brown|dark|dirty)\b/i.test(psfColor)) {
    push({
      id: "psf.color",
      label: "PSF color",
      measured: psfColor,
      range: "factory red/amber, not black or burnt",
      note: REVIEW,
      guideId: "fluids.psf",
    });
  }

  if (draft.fluids.brake?.color === "dark") {
    push({
      id: "brake.color",
      label: "Brake-fluid color",
      measured: "dark",
      range: "factory light honey / pale yellow (DOT 3)",
      note: REVIEW,
      guideId: "fluids.brake",
    });
  }
  if (draft.fluids.brake?.moisture === "high") {
    push({
      id: "brake.moisture",
      label: "Brake-fluid moisture",
      measured: "high",
      range: "factory: dry DOT 3 from a sealed bottle, flush at 24 months",
      note: REVIEW,
      guideId: "fluids.brake",
    });
  }
  if (draft.fluids.brake?.capSealed === "N") {
    push({
      id: "brake.cap",
      label: "Brake-fluid cap",
      measured: "not sealed",
      range: "factory: cap sealed",
      note: REVIEW,
      guideId: "fluids.brake",
    });
  }

  const sec = parseNum(draft.engine.timingCover.seconds);
  if (draft.engine.timingCover.noise === "ongoing-rattle" || (sec != null && sec > 3)) {
    push({
      id: "timingCover.rattle",
      label: "Timing-cover rattle",
      measured: draft.engine.timingCover.noise === "ongoing-rattle" ? "ongoing rattle" : `${sec} sec`,
      range: "factory: 1–3 sec then gone",
      note: REVIEW,
      guideId: "engine.timingCover",
    });
  }
  if (draft.engine.manifolds?.noise === "tick-l" || draft.engine.manifolds?.noise === "tick-r" || draft.engine.manifolds?.noise === "both") {
    push({
      id: "manifolds.tick",
      label: "Exhaust manifold",
      measured: draft.engine.manifolds.noise,
      range: "factory: quiet, no tick",
      note: REVIEW,
      guideId: "engine.manifolds",
    });
  }
  if (draft.engine.manifolds?.soot === "Y") {
    push({
      id: "manifolds.soot",
      label: "Manifold soot",
      measured: "Y",
      range: "factory: dry flanges, no soot",
      note: REVIEW,
      guideId: "engine.manifolds",
    });
  }
  if (draft.engine.idle?.quality === "rough" || draft.engine.idle?.cel === "on") {
    push({
      id: "idle.fail",
      label: "Idle / CEL",
      measured: [draft.engine.idle?.quality, draft.engine.idle?.cel === "on" ? "CEL on" : ""].filter(Boolean).join(", "),
      range: "factory: smooth idle, CEL off after prove-out",
      note: REVIEW,
      guideId: "engine.idle",
    });
  }
  if (draft.engine.belt?.condition === "cracks" || draft.engine.belt?.condition === "glaze" || draft.engine.belt?.condition === "fray") {
    push({
      id: "belt.condition",
      label: "Serpentine belt",
      measured: draft.engine.belt.condition,
      range: "factory: no cracks, glaze, or fray",
      note: REVIEW,
      guideId: "engine.belt",
    });
  }
  if (draft.engine.radiator?.seeping === "Y") {
    push({
      id: "radiator.seep",
      label: "Radiator",
      measured: "seeping",
      range: "factory: dry tanks and hoses",
      note: REVIEW,
      guideId: "engine.radiator",
    });
  }

  const rest = parseNum(draft.engine.battery.restV);
  if (rest != null && (rest < 12.4 || rest > 12.7)) {
    push({
      id: "battery.restV",
      label: "Battery rest voltage",
      measured: `${rest} V`,
      range: "factory 12.4–12.7 V",
      note: rest < 12.2 ? "Below factory rest range — load test or replace." : REVIEW,
      guideId: "engine.battery",
    });
  }
  const run = parseNum(draft.engine.battery.runningV);
  if (run != null && (run < 13.5 || run > 14.7)) {
    push({
      id: "battery.runningV",
      label: "Battery running voltage",
      measured: `${run} V`,
      range: "factory 13.5–14.7 V",
      note: REVIEW,
      guideId: "engine.battery",
    });
  }
  if (draft.engine.battery.loadTest === "fail") {
    push({
      id: "battery.load",
      label: "Battery load test",
      measured: "fail",
      range: "factory: pass",
      note: REVIEW,
      guideId: "engine.battery",
    });
  }

  const temp = parseNum(draft.engine.scan.atfTemp);
  if (temp != null && (temp < 140 || temp > 160)) {
    push({
      id: "scan.atfTemp",
      label: "ATF scan temp",
      measured: `${temp}°F`,
      range: "factory HOT check ~149°F",
      note: REVIEW,
      guideId: "engine.scan",
    });
  }

  for (const c of CORNERS) {
    const n = parseNum(draft.brakes.pads[c.key]);
    if (n == null) continue;
    if (n < 3) {
      push({
        id: `pads.${c.key}`,
        label: `${c.label} pad thickness`,
        measured: `${n} mm`,
        range: "factory min 3.0 mm",
        note: n <= 1 ? "At or below factory repair limit 1.0 mm — replace." : REVIEW,
        guideId: "brakes.pads",
      });
    }
  }

  const front = parseNum(draft.brakes.rotors.front);
  if (front != null && front <= 26) {
    push({
      id: "rotors.front",
      label: "Front rotor thickness",
      measured: `${front} mm`,
      range: "factory min 26.0 mm (new 28.0 mm)",
      note: "At or below factory min — do not machine. Technician review.",
      guideId: "brakes.rotors",
    });
  }
  const rear = parseNum(draft.brakes.rotors.rear);
  if (rear != null && rear <= 12) {
    push({
      id: "rotors.rear",
      label: "Rear rotor thickness",
      measured: `${rear} mm`,
      range: "factory min 12.0 mm (new 14.0 mm)",
      note: "At or below FSM repair limit — do not machine. Technician review.",
      guideId: "brakes.rotors",
    });
  }

  if (draft.brakes.hoses?.wetCaliper === "Y") {
    push({
      id: "hoses.wet",
      label: "Brake caliper",
      measured: "wet",
      range: "factory: dry caliper, dry pad backing",
      note: "Wet caliper is a leak. Do not drive it. Technician review.",
      guideId: "brakes.hoses",
    });
  }
  if (draft.brakes.master?.seepage === "Y" || draft.brakes.master?.pedalFirm === "N") {
    push({
      id: "master.fail",
      label: "Master / booster",
      measured: draft.brakes.master?.seepage === "Y" ? "seepage" : "pedal not firm",
      range: "factory: dry master, firm pedal",
      note: REVIEW,
      guideId: "brakes.master",
    });
  }

  const inches = parseInches(draft.brakes.pedalHeight.measured);
  if (inches != null && inches < 3.5) {
    push({
      id: "pedalHeight",
      label: "Pedal remaining height",
      measured: draft.brakes.pedalHeight.measured.trim(),
      range: "factory min 3.5 in remaining @ 110 lb",
      note: REVIEW,
      guideId: "brakes.pedalHeight",
    });
  }

  const clicks = parseNum(draft.brakes.parking.clicks);
  if (clicks != null && (clicks < 3 || clicks > 4)) {
    push({
      id: "parking.clicks",
      label: "Parking brake clicks",
      measured: String(clicks),
      range: "factory 3–4 clicks @ 44 lb",
      note: REVIEW,
      guideId: "brakes.parking",
    });
  }
  if (draft.brakes.parking.holdsGrade === "N") {
    push({
      id: "parking.hold",
      label: "Parking brake hold",
      measured: "does not hold on grade",
      range: "factory: holds on a grade",
      note: REVIEW,
      guideId: "brakes.parking",
    });
  }

  if (draft.brakes.absLamps?.state === "stay-on" || draft.brakes.absLamps?.state === "intermittent") {
    push({
      id: "abs.lamps",
      label: "ABS / SLIP / VDC",
      measured: draft.brakes.absLamps.state,
      range: "factory: prove-out then off",
      note: REVIEW,
      guideId: "brakes.absLamps",
    });
  }

  if (draft.cabin?.airbagLamp === "stay-on" || draft.cabin?.airbagLamp === "intermittent") {
    push({
      id: "airbag.lamp",
      label: "Airbag lamp",
      measured: draft.cabin.airbagLamp,
      range: "factory: prove-out then off",
      note: "Do not drive. Pass is blocked.",
      guideId: "cabin.airbag",
    });
  }

  if (draft.engine?.timingCover?.oilPressure === "low") {
    push({
      id: "oil.pressure",
      label: "Oil pressure",
      measured: "low / lamp",
      range: "factory: pressure in the green, lamp off",
      note: draft.engine.timingCover.noise === "ongoing-rattle"
        ? "Ongoing rattle plus low oil pressure — do not drive."
        : REVIEW,
      guideId: "engine.timingCover",
    });
  }

  for (const c of CORNERS_SPARE) {
    const n = parseTread32(draft.brakes.tread[c.key]);
    if (n == null) continue;
    if (n <= 2) {
      push({
        id: `tread.${c.key}`,
        label: `${c.label} tread`,
        measured: `${n}/32 in`,
        range: "legal min 2/32 in — do not run an SUV there",
        note: REVIEW,
        guideId: "brakes.tread",
      });
    }
  }

  const asOf = asOfDate(draft.header.date);
  for (const c of CORNERS_SPARE) {
    const years = parseDotYears(draft.brakes.tireAge[c.key], asOf);
    if (years == null) continue;
    if (years >= 6) {
      const raw = draft.brakes.tireAge[c.key].trim();
      push({
        id: `tireAge.${c.key}`,
        label: `${c.label} tire age`,
        measured: `${raw} (${years.toFixed(1)} yr)`,
        range: "factory replace at 6–7 years",
        note: REVIEW,
        guideId: "brakes.tireAge",
      });
    }
  }

  if (draft.brakes.wear?.pattern && draft.brakes.wear.pattern !== "even") {
    push({
      id: "wear.pattern",
      label: "Tire wear pattern",
      measured: draft.brakes.wear.pattern,
      range: "factory: even wear across the face",
      note: REVIEW,
      guideId: "brakes.wear",
    });
  }

  for (const c of CORNERS) {
    const n = parseNum(draft.brakes.pressures[c.key]);
    if (n == null) continue;
    if (n < 33 || n > 37) {
      push({
        id: `pressures.${c.key}`,
        label: `${c.label} tire pressure`,
        measured: `${n} psi`,
        range: "door sticker 35 psi",
        note: n <= 28 ? "20% low vs sticker — reset cold. Technician review if it will not hold." : REVIEW,
        guideId: "brakes.pressures",
      });
    }
  }

  if (draft.brakes.lugTorque?.rechecked === "N") {
    push({
      id: "lug.recheck",
      label: "Lug torque recheck",
      measured: "not rechecked",
      range: "factory 98 ft-lb, recheck after 50–100 miles",
      note: REVIEW,
      guideId: "brakes.lugTorque",
    });
  }

  if (draft.brakes.alignment?.feel === "pull-l" || draft.brakes.alignment?.feel === "pull-r" || draft.brakes.alignment?.feel === "wander") {
    const feel = draft.brakes.alignment.feel === "pull-l" ? "pull L" : draft.brakes.alignment.feel === "pull-r" ? "pull R" : "wander";
    push({
      id: "alignment.feel",
      label: "Alignment feel",
      measured: feel,
      range: "factory: tracks straight",
      note: REVIEW,
      guideId: "brakes.alignment",
    });
  }

  for (const row of TRANS_ROWS) {
    const v = draft.trans?.rows?.[row.key];
    if (!v) continue;
    for (const side of ["cold", "hot"] as const) {
      const pick = v[side];
      if (TRANS_FAIL.has(pick)) {
        push({
          id: `trans.${row.key}.${side}`,
          label: `${row.label} (${side})`,
          measured: pick,
          range: "factory: clean / good engagement",
          note: REVIEW,
          guideId: row.guideId,
        });
      }
    }
  }

  if (draft.result?.crushWasher === "N") {
    push({
      id: "oil.washer",
      label: "Crush washer",
      measured: "not replaced",
      range: "factory: new crush washer every drain",
      note: REVIEW,
      guideId: "fluids.oilLevel",
    });
  }

  const coolerPhoto = Boolean(
    photos["engine.atfLines"] &&
      typeof photos["engine.atfLines"] === "object" &&
      (photos["engine.atfLines"] as { dataUrl?: string }).dataUrl,
  );
  const prevent = rowShows("smodPlan", draft.header.visitType, draft.header.drive, draft.header.plan);
  const wet = draft.engine.atfLines?.wetFittings === "Y";
  if (!coolerPhoto && (prevent || wet)) {
    push({
      id: "atfLines.photo",
      label: "Cooler fittings photo",
      measured: "missing",
      range: wet ? "photo required when fittings are wet" : "photo required on 30k / 270k",
      note: REVIEW,
      guideId: "engine.atfLines",
    });
  }

  if (prevent) {
    const last = draft.result?.smodPlan?.radiatorLast ?? "";
    const dateRaw = draft.result?.smodPlan?.radiatorDate ?? "";
    const yearHit = dateRaw.match(/(19|20)\d{2}/);
    const years = yearHit ? asOfDate(draft.header.date).getFullYear() - Number(yearHit[0]) : null;
    const bypass = draft.engine.atfLines?.bypassDone === "Y";
    const original = last !== "replaced";
    const oldTank = years != null && years >= 10;
    if (original || oldTank || !bypass) {
      const bits = [
        original ? "radiator original or unknown" : oldTank ? `${years}-year radiator` : "",
        bypass ? "" : "in-radiator ATF cooler still in service",
      ].filter(Boolean);
      push({
        id: "smod.plan",
        label: "SMOD prevention",
        measured: bits.join(", ") || "not written",
        range: "30k: external cooler + radiator replacement — not milky today is not a plan",
        note: "Schedule external stacked-plate cooler and radiator replacement. Red ATF today is not a maintenance plan.",
        guideId: "result.smodPlan",
      });
    }
  }

  const b = draft.baseline;
  const baseVisit = draft.header.visitType === "baseline-270k";
  if (b) {
    const grade = (
      id: string,
      label: string,
      verdict: string | undefined,
      guideId: string,
    ) => {
      if (baseVisit && !verdict) {
        push({
          id,
          label,
          measured: "not graded",
          range: "baseline: Pass or Fail required — notes are not a grade",
          note: REVIEW,
          guideId,
        });
        return false;
      }
      if (verdict === "fail") {
        push({
          id: `${id}.fail`,
          label,
          measured: "Fail",
          range: "baseline Pass required",
          note: REVIEW,
          guideId,
        });
      }
      return true;
    };

    const plugsOk = grade("baseline.sparkPlugs", "Spark plugs", b.sparkPlugs?.verdict, "baseline.sparkPlugs");
    if (plugsOk) {
      const last = parseNum(b.sparkPlugs?.lastMiles ?? "");
      const miles = parseNum(draft.header.miles);
      const overdue =
        b.sparkPlugs?.cycle === "unknown" ||
        last == null ||
        (miles != null && last != null && miles - last >= 105000);
      if (baseVisit && overdue) {
        push({
          id: "baseline.sparkPlugs.interval",
          label: "Spark plugs",
          measured:
            b.sparkPlugs?.cycle === "unknown" || last == null
              ? "last change unknown"
              : `${Math.round((miles ?? 0) - last).toLocaleString("en-US")} miles since last change`,
          range: "factory iridium 105,000 miles — cycle 2 or 3 at 270k",
          note: "Overdue. Notes are not a grade.",
          guideId: "baseline.sparkPlugs",
        });
      }
    }

    grade("baseline.coolantService", "Coolant service", b.coolantService?.verdict, "baseline.coolantService");
    if (b.coolantService?.cap === "fail") {
      push({
        id: "baseline.coolant.cap",
        label: "Radiator cap",
        measured: "Fail",
        range: "factory: cap holds system pressure",
        note: REVIEW,
        guideId: "baseline.coolantService",
      });
    }
    if (b.coolantService?.thermostat === "fail") {
      push({
        id: "baseline.coolant.stat",
        label: "Thermostat",
        measured: "Fail",
        range: "factory: gauge to the normal middle and stays",
        note: REVIEW,
        guideId: "baseline.coolantService",
      });
    }
    if (b.coolantService?.pumpWeep === "Y") {
      push({
        id: "baseline.coolant.weep",
        label: "Water-pump weep",
        measured: "wet",
        range: "factory: weep hole dry",
        note: "Wet weep = pump is done.",
        guideId: "baseline.coolantService",
      });
    }
    if (baseVisit && !(b.coolantService?.lastService ?? "").trim() && b.coolantService?.verdict === "pass") {
      push({
        id: "baseline.coolant.history",
        label: "Coolant service",
        measured: "last service unknown",
        range: "factory ~60,000 miles / 5 years",
        note: "Unknown at 270k is not a Pass.",
        guideId: "baseline.coolantService",
      });
    }

    grade("baseline.brakeFluid", "Brake fluid", b.brakeFluid?.verdict, "baseline.brakeFluid");
    if (baseVisit && !(b.brakeFluid?.lastFlush ?? "").trim() && b.brakeFluid?.verdict === "pass") {
      push({
        id: "baseline.brake.history",
        label: "Brake fluid",
        measured: "last flush unknown",
        range: "factory DOT 3, flush every 24 months",
        note: "Unknown at 270k is not a Pass.",
        guideId: "baseline.brakeFluid",
      });
    }

    grade("baseline.diffFluid", "Diff and transfer-case fluid", b.diffFluid?.verdict, "baseline.diffFluid");
    if (b.diffFluid?.rear === "fail") {
      push({
        id: "baseline.diff.rear",
        label: "Rear diff fill plug",
        measured: "Fail",
        range: "factory: GL-5 to the fill hole, 30k",
        note: REVIEW,
        guideId: "baseline.diffFluid",
      });
    }
    if (draft.header.drive !== "2WD") {
      if (b.diffFluid?.front === "fail") {
        push({
          id: "baseline.diff.front",
          label: "Front diff fill plug",
          measured: "Fail",
          range: "factory: GL-5 to the fill hole, 30k",
          note: REVIEW,
          guideId: "baseline.diffFluid",
        });
      }
      if (b.diffFluid?.transfer === "fail") {
        push({
          id: "baseline.diff.transfer",
          label: "Transfer-case fill plug",
          measured: "Fail",
          range: "factory: Matic D to the fill hole, 30k",
          note: REVIEW,
          guideId: "baseline.diffFluid",
        });
      }
    }

    grade("baseline.seepage", "Oil seepage grade", b.seepage?.verdict, "baseline.seepage");
    for (const [key, label] of [
      ["valveCover", "Valve-cover seepage"],
      ["timingCover", "Timing-cover seepage"],
      ["oilPan", "Oil-pan seepage"],
    ] as const) {
      const g = b.seepage?.[key];
      if (g === "wet" || g === "drip") {
        push({
          id: `baseline.seepage.${key}`,
          label,
          measured: g,
          range: "dry or dusty film only — wet/drip is a Fail",
          note: REVIEW,
          guideId: "baseline.seepage",
        });
      }
    }

    grade("baseline.manifoldBolts", "Manifold / heat-shield bolts", b.manifoldBolts?.verdict, "baseline.manifoldBolts");
    grade("baseline.ucaJoints", "UCAs / ball joints", b.ucaJoints?.verdict, "baseline.ucaJoints");
    if (b.ucaJoints?.innerTaper === "Y") {
      push({
        id: "baseline.uca.taper",
        label: "Inner pad / tire taper",
        measured: "inner taper",
        range: "factory: even wear — inner taper means UCAs / alignment",
        note: REVIEW,
        guideId: "baseline.ucaJoints",
      });
    }

    grade("baseline.airShocks", "Rear load-leveling / air shocks", b.airShocks?.verdict, "baseline.airShocks");
  }

  const prior = priorWearVisit(draft, history);
  if (prior) {
    for (const f of wearFlags(wearCompare(draft, prior))) push(f);
  }

  return flags;
}
