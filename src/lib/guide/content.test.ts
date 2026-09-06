import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { GUIDE_CHAPTERS, findChapter } from "./content.ts";
import { PLAIN, plainFor } from "./plain.ts";
import { checklistGuideIds, visibleGuideIds, walkRowGuideId } from "./catalog.ts";
import { WALK_STEPS, walkRowVisible, walkStepCopy } from "../inspection/walk.ts";
import { CHECK_ROW_IDS, CHECK_TOTAL, checkTotal, driveShows, drivelineShaftLabel, isOilChange, oilChangeRecord, rowShows, smodPlanRecord, type InspectionDraft } from "../inspection/types.ts";
import { flagLine, outOfRangeFlags } from "../inspection/range.ts";
import { isVinComplete, mapNhtsaResults, normalizeVin, recallStamp } from "../inspection/recalls.ts";

describe("guide catalog", () => {
  it("has exactly one how-to per checklist Guide link and nothing extra", () => {
    const checklist = checklistGuideIds();
    const chapters = GUIDE_CHAPTERS.map((c) => c.id);
    assert.deepEqual([...chapters].sort(), [...checklist].sort());
    assert.equal(new Set(chapters).size, chapters.length);
  });

  it("every how-to has a beginner card that spells the shop term in plain English", () => {
    const ids = new Set(PLAIN.map((p) => p.id));
    assert.equal(ids.size, PLAIN.length);
    for (const ch of GUIDE_CHAPTERS) {
      const p = plainFor(ch.id);
      assert.ok(p, `missing beginner card ${ch.id}`);
      assert.ok(p!.what.trim().length > 20, ch.id);
      assert.ok(p!.where.trim().length > 10, ch.id);
      assert.ok(p!.why.trim().length > 20, ch.id);
      assert.ok(p!.tools.includes(",") || p!.tools.length > 8, ch.id);
      assert.ok(p!.specPlain.trim().length > 10, ch.id);
    }
    const atf = plainFor("engine.atfLines")!;
    assert.match(atf.what, /radiator/i);
    assert.match(atf.why, /SMOD/);
    assert.match(atf.why, /strawberry|wreck|mix/i);
    const tcc = plainFor("trans.tcc")!;
    assert.match(tcc.what, /torque converter clutch/i);
    const uca = plainFor("steering.ballJoints")!;
    assert.match(uca.what, /upper control arm/i);
  });

  it("oil-change does not expose hidden how-tos, so no beginner spam for those rows", () => {
    const ids = visibleGuideIds("oil-change", "4WD");
    assert.ok(!ids.includes("result.smodPlan"));
    assert.ok(!ids.includes("steering.ballJoints"));
    assert.ok(plainFor("fluids.atf"));
  });

  it("every how-to has factory spec, requirement, measure, good/fail, and steps", () => {
    for (const ch of GUIDE_CHAPTERS) {
      assert.ok(ch.factory.trim().length > 20, `${ch.id} factory`);
      assert.ok(ch.requires.trim().length > 10, `${ch.id} requires`);
      assert.ok(ch.measure.trim().length > 10, `${ch.id} measure`);
      assert.ok(ch.good.trim().length > 8, `${ch.id} good`);
      assert.ok(ch.fail.trim().length > 8, `${ch.id} fail`);
      assert.ok(ch.steps.length >= 2, `${ch.id} steps`);
    }
  });

  it("walk rows with a Guide jump to a checklist how-to", () => {
    for (const step of WALK_STEPS) {
      for (const row of step.rows) {
        const id = walkRowGuideId(row);
        if (id == null) {
          assert.ok(
            row === "header" || row === "transTable" || row === "baseline" || row === "engine.overview" || row === "cabin.dash",
            `unexpected skip ${row}`,
          );
          continue;
        }
        assert.ok(findChapter(id), `walk ${step.num} row ${row} -> ${id}`);
      }
    }
  });

  it("caliper search lands on the hoses/calipers check", () => {
    assert.equal(findChapter("caliper")?.id, "brakes.hoses");
    const ch = findChapter("brakes.hoses");
    assert.ok(ch);
    assert.match(ch.searchExtra ?? "", /caliper/);
    assert.match(ch.factory.toLowerCase(), /caliper/);
    assert.match(ch.steps.join(" ").toLowerCase(), /slide pin/);
  });

  it("oil-change how-to list is the short always-on set", () => {
    const ids = visibleGuideIds("oil-change", "4WD");
    assert.ok(ids.includes("fluids.atf"));
    assert.ok(ids.includes("fluids.oilLevel"));
    assert.ok(ids.includes("engine.atfLines"));
    assert.ok(ids.includes("brakes.tread"));
    assert.ok(ids.includes("trans.atfReject"));
    assert.ok(ids.includes("result.overall"));
    assert.ok(!ids.includes("brakes.pads"));
    assert.ok(!ids.includes("brakes.tireAge"));
    assert.ok(!ids.includes("engine.battery"));
    assert.ok(!ids.includes("result.smodPlan"));
    assert.ok(!ids.includes("engine.scan"));
    assert.ok(!ids.includes("brakes.rotors"));
    assert.ok(!ids.includes("steering.steeringPlay"));
    assert.ok(!ids.includes("trans.parkReverse"));
    assert.ok(!ids.includes("fluids.transferSeep"));
    assert.ok(!ids.includes("cabin.recalls"));
    assert.ok(!ids.includes("baseline.sparkPlugs"));
  });

  it("2WD how-to list drops transfer case and 4WD engage", () => {
    const ids = visibleGuideIds("15k", "2WD");
    assert.ok(!ids.includes("trans.fourwd"));
    assert.ok(!ids.includes("fluids.transferSeep"));
    assert.ok(!ids.includes("fluids.frontDiffSeep"));
    assert.ok(ids.includes("fluids.rearDiffSeep"));
    assert.ok(ids.includes("trans.parkReverse"));
    assert.ok(ids.includes("engine.scan"));
    assert.ok(!ids.includes("result.smodPlan"));
    assert.ok(!ids.includes("baseline.sparkPlugs"));
  });
});

describe("drive and visit filters", () => {
  it("2WD hides transfer case and front diff, keeps rear diff", () => {
    assert.equal(walkRowVisible("transferSeep", "15k", "2WD"), false);
    assert.equal(walkRowVisible("frontDiffSeep", "15k", "2WD"), false);
    assert.equal(walkRowVisible("rearDiffSeep", "15k", "2WD"), true);
    assert.equal(walkRowVisible("transferSeep", "15k", "4WD"), true);
  });

  it("oil-change still hides 30k seeps even on 4WD", () => {
    assert.equal(walkRowVisible("transferSeep", "oil-change", "4WD"), false);
    assert.equal(walkRowVisible("rearDiffSeep", "oil-change", "2WD"), false);
    assert.equal(walkRowVisible("underbody.transPan", "oil-change", "4WD"), false);
    assert.equal(walkRowVisible("underbody.transPan", "15k", "2WD"), true);
  });

  it("empty drive keeps the 4WD rows until they pick", () => {
    assert.equal(walkRowVisible("transferSeep", "15k", ""), true);
    assert.equal(driveShows("", "4WD"), true);
    assert.equal(driveShows("2WD", "4WD"), false);
    assert.equal(driveShows("4WD", "4WD"), true);
  });

  it("checked total drops 4WD-only interval rows on 2WD", () => {
    assert.equal(CHECK_ROW_IDS.length, 76);
    assert.equal(checkTotal("15k", "4WD"), CHECK_TOTAL - 9);
    assert.equal(checkTotal("30k", "4WD"), CHECK_TOTAL - 8);
    assert.equal(checkTotal("baseline-270k", "4WD"), CHECK_TOTAL);
    assert.equal(checkTotal("15k", "2WD"), CHECK_TOTAL - 11);
    assert.equal(checkTotal("", ""), 0);
  });

  it("oil-change is the always-on set plus the oil result block", () => {
    assert.equal(checkTotal("oil-change", "2WD"), checkTotal("oil-change", "4WD"));
    assert.ok(checkTotal("oil-change", "4WD") < 25);
    assert.equal(walkRowVisible("scan", "oil-change", "4WD"), false);
    assert.equal(walkRowVisible("transTable", "oil-change", "4WD"), false);
    assert.equal(walkRowVisible("steering.tieRods", "oil-change", "4WD"), false);
    assert.equal(walkRowVisible("cabin.airbag", "oil-change", "4WD"), true);
    assert.equal(walkRowVisible("cabin.recalls", "oil-change", "4WD"), false);
    assert.equal(walkRowVisible("road.vibration", "oil-change", "4WD"), false);
    assert.equal(walkRowVisible("rotors", "oil-change", "4WD"), false);
    assert.equal(walkRowVisible("underbody.exhaust", "oil-change", "4WD"), false);
    assert.equal(walkRowVisible("cabin.lights", "oil-change", "4WD"), true);
    assert.equal(walkRowVisible("cabin.wipers", "oil-change", "4WD"), true);
    assert.equal(walkRowVisible("oilLevel", "oil-change", "4WD"), true);
    assert.equal(walkRowVisible("smodPlan", "oil-change", "4WD"), false);
    assert.equal(walkRowVisible("smodPlan", "15k", "4WD"), false);
    assert.equal(walkRowVisible("smodPlan", "30k", "4WD"), true);
    assert.equal(walkRowVisible("smodPlan", "baseline-270k", "2WD"), true);
    assert.equal(walkRowVisible("atf", "oil-change", "4WD"), true);
    assert.equal(walkRowVisible("oilLeak", "oil-change", "4WD"), true);
    assert.equal(walkRowVisible("pads", "oil-change", "4WD"), false);
    assert.equal(walkRowVisible("underbody.oilPan", "oil-change", "4WD"), true);
    assert.equal(walkRowVisible("road.shifts", "oil-change", "4WD"), false);
    assert.equal(walkRowVisible("scan", "15k", "4WD"), true);
    assert.equal(walkRowVisible("transTable", "30k", "2WD"), true);
    assert.equal(rowShows("steering.mounts", "baseline-270k", "4WD"), true);
    assert.equal(walkRowVisible("baseline.sparkPlugs", "baseline-270k", "4WD"), true);
    assert.equal(walkRowVisible("baseline.sparkPlugs", "15k", "4WD"), false);
    assert.equal(walkRowVisible("baseline.sparkPlugs", "30k", "4WD"), false);
    assert.equal(walkRowVisible("baseline", "oil-change", "4WD"), false);
  });

  it("oil-change record line uses header miles, type, amount, filter, and crush washer", () => {
    const d = {
      header: { miles: "271400" },
      result: {
        oilType: "5W-30 full synthetic",
        oilAmount: "6.5 qt",
        oilFilterPn: "15208-9E01A",
        crushWasher: "Y",
      },
    } as InspectionDraft;
    assert.equal(
      oilChangeRecord(d),
      "Oil change completed at 271,400 miles — 5W-30 full synthetic, 6.5 qt, filter 15208-9E01A, crush washer replaced.",
    );
  });

  it("oil-change walk step 4 is the service, not the dipstick", () => {
    const step = WALK_STEPS.find((s) => s.rows.includes("oilLevel"))!;
    const short = walkStepCopy(step, "4WD", "oil-change");
    const long = walkStepCopy(step, "4WD", "15k");
    assert.equal(short.title, "Oil change");
    assert.match(short.blurb, /Not a dipstick/);
    assert.match(long.title, /After warmup/);
    assert.equal(isOilChange("oil-change"), true);
    assert.equal(isOilChange("15k"), false);
  });

  it("2WD driveline label drops the front shaft", () => {
    assert.match(drivelineShaftLabel("2WD"), /Rear drive shaft/);
    assert.match(drivelineShaftLabel("4WD"), /Front & rear/);
  });
});

function draftForRange(over: (d: InspectionDraft) => void): InspectionDraft {
  const d = {
    header: { date: "2026-09-05", miles: "270000", inspector: "R", vin: "", drive: "4WD", towPkg: "", visitType: "15k" },
    fluids: { atf: { inRange: "", color: "", smell: "", checked: false, notes: "" } },
    engine: {
      timingCover: { noise: "", seconds: "", checked: false, notes: "" },
      battery: { restV: "", runningV: "", loadTest: "", terminalsClean: "", checked: false, notes: "" },
      scan: { stored: "", pending: "", atfTemp: "", checked: false, notes: "" },
    },
    brakes: {
      pads: { lf: "", rf: "", lr: "", rr: "", checked: false, notes: "" },
      rotors: { front: "", rear: "", checked: false, notes: "" },
      pedalHeight: { measured: "", checked: false, notes: "" },
      parking: { clicks: "", holdsGrade: "", checked: false, notes: "" },
      tread: { lf: "", rf: "", lr: "", rr: "", spare: "", checked: false, notes: "" },
      tireAge: { lf: "", rf: "", lr: "", rr: "", spare: "", checked: false, notes: "" },
      pressures: { lf: "", rf: "", lr: "", rr: "", spare: "", checked: false, notes: "" },
    },
  } as InspectionDraft;
  over(d);
  return d;
}

describe("out of range flags", () => {
  it("lists measured vs factory range and skips in-range values", () => {
    const d = draftForRange((x) => {
      x.brakes.pads.lf = "2.1";
      x.brakes.pads.rf = "8";
      x.brakes.rotors.front = "25.5";
      x.engine.battery.restV = "12.5";
      x.brakes.pressures.lf = "35";
      x.brakes.pressures.rf = "22";
    });
    const flags = outOfRangeFlags(d);
    const lines = flags.map(flagLine);
    assert.ok(lines.includes("LF pad thickness: 2.1 mm (factory min 3.0 mm)"));
    assert.ok(!lines.some((l) => l.startsWith("RF pad")));
    assert.ok(lines.some((l) => l.startsWith("Front rotor thickness: 25.5 mm")));
    assert.ok(!lines.some((l) => l.includes("Battery rest")));
    assert.ok(lines.includes("RF tire pressure: 22 psi (door sticker 35 psi)"));
    assert.ok(!lines.some((l) => l.startsWith("LF tire pressure")));
    assert.ok(flags.every((f) => /technician|replace|review/i.test(f.note)));
  });

  it("flags leftover pad mm and rest voltage even on an oil-change visit", () => {
    const d = draftForRange((x) => {
      x.header.visitType = "oil-change";
      x.brakes.pads.lf = "2.1";
      x.engine.battery.restV = "12.0";
    });
    const lines = outOfRangeFlags(d).map(flagLine);
    assert.ok(lines.includes("LF pad thickness: 2.1 mm (factory min 3.0 mm)"));
    assert.ok(lines.some((l) => l.startsWith("Battery rest voltage: 12 V")));
  });

  it("flags old DOT dates and short remaining pedal", () => {
    const d = draftForRange((x) => {
      x.brakes.tireAge.lf = "2319";
      x.brakes.pedalHeight.measured = "2.0 in";
      x.brakes.tread.lf = "2/32";
    });
    const lines = outOfRangeFlags(d).map(flagLine);
    assert.ok(lines.some((l) => l.includes("LF tire age") && l.includes("factory replace at 6–7 years")));
    assert.ok(lines.some((l) => l.includes("Pedal remaining height: 2.0 in")));
    assert.ok(lines.includes("LF tread: 2/32 in (legal min 2/32 in — do not run an SUV there)"));
  });

  it("flags qualitative fails and missing numeric windows", () => {
    const d = draftForRange((x) => {
      x.fluids.atf.color = "milky";
      x.engine.atfLines = { checked: false, notes: "", connected: "", wetFittings: "Y", bypassDone: "" };
      x.fluids.coolant = { checked: false, notes: "", levelColor: "oily", capSeated: "", freezeF: "18" };
      x.fluids.psf = { checked: false, notes: "", level: "", color: "black" };
      x.fluids.brake = { checked: false, notes: "", level: "", color: "dark", capSealed: "", moisture: "high" };
      x.brakes.rotors.rear = "11.5";
      x.brakes.alignment = { checked: false, notes: "", feel: "pull-l" };
      x.brakes.lugTorque = { checked: false, notes: "", rechecked: "N" };
      x.brakes.tireAge.rf = "2019";
    });
    const lines = outOfRangeFlags(d).map(flagLine);
    assert.ok(lines.some((l) => l.startsWith("ATF color: milky")));
    assert.ok(lines.some((l) => l.startsWith("ATF cooler fittings: wet")));
    assert.ok(lines.includes("Coolant freeze point: 18°F (factory spec −34°F)"));
    assert.ok(lines.some((l) => l.startsWith("Coolant level / strength: oily")));
    assert.ok(lines.some((l) => l.startsWith("PSF color: black")));
    assert.ok(lines.some((l) => l.startsWith("Brake-fluid color: dark")));
    assert.ok(lines.some((l) => l.startsWith("Brake-fluid moisture: high")));
    assert.ok(lines.some((l) => l.startsWith("Rear rotor thickness: 11.5 mm")));
    assert.ok(lines.some((l) => l.startsWith("Alignment feel: pull L")));
    assert.ok(lines.some((l) => l.startsWith("Lug torque recheck: not rechecked")));
    assert.ok(lines.some((l) => l.includes("RF tire age") && l.includes("2019")));
    for (const f of outOfRangeFlags(d)) {
      assert.ok(findChapter(f.guideId), f.guideId);
    }
  });
});

describe("SMOD prevention", () => {
  it("30k flags original radiator and missing fittings photo even when ATF is red", () => {
    const d = draftForRange((x) => {
      x.header.visitType = "30k";
      x.header.miles = "270000";
      x.fluids.atf.color = "red-amber";
      x.engine.atfLines = { checked: false, notes: "", connected: "Y", wetFittings: "N", bypassDone: "N" };
      x.result = { smodPlan: { checked: false, notes: "", radiatorLast: "original", radiatorDate: "" } } as InspectionDraft["result"];
    });
    const flags = outOfRangeFlags(d, {});
    const lines = flags.map(flagLine);
    assert.ok(lines.some((l) => l.startsWith("Cooler fittings photo: missing")));
    assert.ok(lines.some((l) => l.startsWith("SMOD prevention:")));
    assert.ok(lines.some((l) => /not milky today is not a plan/i.test(l)));
  });

  it("15k does not demand the 30k prevention block", () => {
    const d = draftForRange((x) => {
      x.header.visitType = "15k";
      x.result = { smodPlan: { checked: false, notes: "", radiatorLast: "original", radiatorDate: "" } } as InspectionDraft["result"];
    });
    const ids = outOfRangeFlags(d, {}).map((f) => f.id);
    assert.ok(!ids.includes("smod.plan"));
    assert.ok(!ids.includes("atfLines.photo"));
  });

  it("wet fittings without a photo flags on any visit", () => {
    const d = draftForRange((x) => {
      x.header.visitType = "oil-change";
      x.engine.atfLines = { checked: false, notes: "", connected: "Y", wetFittings: "Y", bypassDone: "N" };
    });
    assert.ok(outOfRangeFlags(d, {}).some((f) => f.id === "atfLines.photo"));
    assert.ok(!outOfRangeFlags(d, { "engine.atfLines": { dataUrl: "data:image/jpeg;base64,xx" } }).some((f) => f.id === "atfLines.photo"));
  });

  it("prints a prevention line for the paper form", () => {
    const d = draftForRange((x) => {
      x.engine.atfLines = { checked: false, notes: "", connected: "Y", wetFittings: "N", bypassDone: "N" };
      x.result = { smodPlan: { checked: true, notes: "", radiatorLast: "original", radiatorDate: "" } } as InspectionDraft["result"];
    });
    const line = smodPlanRecord(d);
    assert.match(line, /radiator last: original/);
    assert.match(line, /Not milky today is not a maintenance plan/);
    assert.match(line, /external stacked-plate cooler/);
  });
});

function blankBaseline(): InspectionDraft["baseline"] {
  const r = { checked: false, notes: "", verdict: "" as const };
  return {
    notes: "",
    sparkPlugs: { ...r, lastMiles: "", cycle: "" },
    coolantService: { ...r, lastService: "", cap: "", thermostat: "", pumpWeep: "" },
    brakeFluid: { ...r, lastFlush: "" },
    diffFluid: { ...r, transfer: "", front: "", rear: "" },
    seepage: { ...r, valveCover: "", timingCover: "", oilPan: "" },
    manifoldBolts: { ...r },
    ucaJoints: { ...r, innerTaper: "" },
    airShocks: { ...r, equipped: "" },
  };
}

describe("270k due Pass/Fail", () => {
  it("baseline flags ungraded lines; 15k does not", () => {
    const d = draftForRange((x) => {
      x.header.visitType = "baseline-270k";
      x.result = { smodPlan: { checked: false, notes: "", radiatorLast: "replaced", radiatorDate: "2024" } } as InspectionDraft["result"];
      x.baseline = blankBaseline();
    });
    assert.ok(outOfRangeFlags(d, {}).some((f) => f.measured === "not graded"));
    const fifteen = draftForRange((x) => {
      x.header.visitType = "15k";
      x.baseline = blankBaseline();
    });
    assert.ok(!outOfRangeFlags(fifteen, {}).some((f) => f.measured === "not graded"));
  });

  it("flags wet weep and overdue plugs even if they tried to Pass", () => {
    const d = draftForRange((x) => {
      x.header.visitType = "baseline-270k";
      x.header.miles = "271400";
      x.result = { smodPlan: { checked: false, notes: "", radiatorLast: "replaced", radiatorDate: "2024" } } as InspectionDraft["result"];
      x.baseline = blankBaseline();
      x.baseline.sparkPlugs = { checked: true, notes: "", lastMiles: "90000", cycle: "2", verdict: "pass" };
      x.baseline.coolantService = { checked: true, notes: "", lastService: "2020", cap: "pass", thermostat: "pass", pumpWeep: "Y", verdict: "pass" };
      x.baseline.brakeFluid = { checked: true, notes: "", lastFlush: "2025-01", verdict: "pass" };
      x.baseline.diffFluid = { checked: true, notes: "", transfer: "pass", front: "pass", rear: "pass", verdict: "pass" };
      x.baseline.seepage = { checked: true, notes: "", valveCover: "film", timingCover: "dry", oilPan: "dry", verdict: "pass" };
      x.baseline.manifoldBolts = { checked: true, notes: "", verdict: "pass" };
      x.baseline.ucaJoints = { checked: true, notes: "", innerTaper: "N", verdict: "pass" };
      x.baseline.airShocks = { checked: true, notes: "", equipped: "N", verdict: "pass" };
    });
    const lines = outOfRangeFlags(d, {}).map(flagLine);
    assert.ok(lines.some((l) => l.startsWith("Water-pump weep: wet")));
    assert.ok(lines.some((l) => l.startsWith("Spark plugs:") && /105,000/.test(l)));
  });
});


describe("Nissan campaign stamp", () => {
  it("normalizes VIN and rejects short or I/O/Q", () => {
    assert.equal(normalizeVin("5n1-aa08a 25n700001"), "5N1AA08A25N700001");
    assert.equal(isVinComplete("5N1AA08A25N700001"), true);
    assert.equal(isVinComplete("5N1AA08A25"), false);
    assert.equal(isVinComplete("5N1AA08A25N70000I"), false);
  });

  it("prints a dated campaign-list line for the paper form", () => {
    const line = recallStamp({
      checkedAt: "2026-09-05",
      vinChecked: "5N1AA08A25N700001",
      ymm: "2005 NISSAN Armada",
      campaigns: [
        { id: "10V074000", component: "FUEL SYSTEM", summary: "" },
        { id: "10V517000", component: "ENGINE", summary: "" },
      ],
    });
    assert.equal(
      line,
      "Checked Nissan campaign list on 2026-09-05 for VIN 5N1AA08A25N700001 — 2 NHTSA campaigns listed for 2005 NISSAN Armada.",
    );
  });

  it("maps NHTSA rows to campaign numbers", () => {
    const rows = mapNhtsaResults([
      { NHTSACampaignNumber: "10V074000", Component: "FUEL SYSTEM, OTHER:STORAGE:FUEL GAUGE SYSTEM", Summary: "Fuel gauge may read high." },
      { NHTSACampaignNumber: "10V074000", Component: "dup", Summary: "skip" },
      { NHTSACampaignNumber: "", Component: "x", Summary: "skip" },
    ]);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].id, "10V074000");
  });
});
