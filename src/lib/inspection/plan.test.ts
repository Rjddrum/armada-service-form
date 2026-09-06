import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildPlan, oilChangeMode, recStamp } from "./plan.ts";
import { checkTotal, rowShows, type InspectionDraft } from "./types.ts";

function draft(miles: string, extra?: (d: InspectionDraft) => void) {
  const d = {
    header: {
      date: "2026-09-05",
      miles,
      inspector: "R",
      vin: "",
      drive: "4WD" as const,
      towPkg: "" as const,
      visitType: "" as const,
      lastOilMi: "",
      lastAtfMi: "",
      lastRadiatorMi: "",
      lastBrakeMi: "",
      lastDiffMi: "",
      plan: null,
    },
    fluids: { atf: { color: "", smell: "", inRange: "", checked: false, notes: "" } },
    engine: { atfLines: { wetFittings: "", connected: "", bypassDone: "", checked: false, notes: "" } },
    result: { smodPlan: { radiatorLast: "", radiatorDate: "", checked: false, notes: "" } },
  } as InspectionDraft;
  extra?.(d);
  return d;
}

describe("mileage plan", () => {
  it("142,350 unknown history recommends oil, brakes, tires, watch trans and cooling, skip plugs and baseline", () => {
    const p = buildPlan(draft("142350"));
    assert.equal(p.miles, 142350);
    assert.equal(p.unknownHistory, true);
    assert.equal(p.oilService, true);
    assert.equal(p.multiPoint, true);
    assert.equal(p.powertrain, true);
    assert.equal(p.cooling, true);
    assert.equal(p.highMiles, false);
    const by = Object.fromEntries(p.lines.map((l) => [l.key, l.tone]));
    assert.equal(by.fluids, "due");
    assert.equal(by.brakes, "due");
    assert.equal(by.tires, "due");
    assert.equal(by.trans, "watch");
    assert.equal(by.cooling, "due");
    assert.equal(by.spark, "watch");
    assert.equal(by.high, "skip");
    assert.match(recStamp(p), /142,350/);
  });

  it("does not treat an empty miles field as 270k baseline", () => {
    const p = buildPlan(draft(""));
    assert.equal(p.miles, 0);
    assert.equal(p.highMiles, false);
    assert.equal(p.lines.length, 0);
    assert.equal(rowShows("baseline.sparkPlugs", "recommended", "4WD", {
      oilService: false,
      multiPoint: false,
      powertrain: false,
      cooling: false,
      highMiles: false,
      sparkPlugs: false,
      coolantService: false,
      brakeFluidService: false,
    }), false);
  });

  it("typed 270000 is high-miles, not a silent default", () => {
    const p = buildPlan(draft("270000"));
    assert.equal(p.highMiles, true);
    assert.equal(p.lines.find((l) => l.key === "high")?.tone, "due");
    assert.equal(p.lines.find((l) => l.key === "spark")?.tone, "watch");
  });

  it("known recent oil skip the dipstick-free oil block; 15k still adds pads", () => {
    const d = draft("142350", (x) => {
      x.header.lastOilMi = "140000";
    });
    const p = buildPlan(d);
    assert.equal(p.oilService, false);
    assert.equal(p.multiPoint, true);
  });

  it("tow package shortens oil interval and keeps trans review", () => {
    const d = draft("4000", (x) => {
      x.header.towPkg = "Y";
      x.header.lastOilMi = "0";
    });
    const p = buildPlan(d);
    assert.equal(p.oilService, true);
    assert.equal(p.powertrain, true);
  });

  it("recommended 142k hides 270k baseline rows and 4WD-only on 2WD", () => {
    const flags = {
      oilService: true,
      multiPoint: true,
      powertrain: true,
      cooling: true,
      highMiles: false,
      sparkPlugs: false,
      coolantService: false,
      brakeFluidService: false,
    };
    assert.equal(rowShows("oilLevel", "recommended", "4WD", flags), true);
    assert.equal(rowShows("pads", "recommended", "4WD", flags), true);
    assert.equal(rowShows("steering.ballJoints", "recommended", "4WD", flags), true);
    assert.equal(rowShows("baseline.sparkPlugs", "recommended", "4WD", flags), false);
    assert.equal(rowShows("timingCover", "recommended", "4WD", flags), false);
    assert.equal(rowShows("transferSeep", "recommended", "2WD", flags), false);
    assert.equal(rowShows("transferSeep", "recommended", "4WD", flags), true);
    assert.ok(checkTotal("recommended", "4WD", flags) > 20);
    assert.ok(checkTotal("recommended", "4WD", flags) < 70);
  });

  it("forced oil-change is the always-on set plus the oil result block", () => {
    assert.equal(rowShows("oilLevel", "oil-change", "4WD"), true);
    assert.equal(rowShows("atf", "oil-change", "4WD"), true);
    assert.equal(rowShows("atfLines", "oil-change", "4WD"), true);
    assert.equal(rowShows("pads", "oil-change", "4WD"), false);
    assert.equal(rowShows("battery", "oil-change", "4WD"), false);
    assert.equal(rowShows("smodPlan", "oil-change", "4WD"), false);
    const d = {
      header: {
        date: "",
        miles: "1",
        inspector: "",
        vin: "",
        drive: "4WD" as const,
        towPkg: "" as const,
        visitType: "oil-change" as const,
        lastOilMi: "",
        lastAtfMi: "",
        lastRadiatorMi: "",
        lastBrakeMi: "",
        lastDiffMi: "",
        plan: null,
      },
      fluids: { atf: { color: "", smell: "", inRange: "", checked: false, notes: "" } },
      engine: { atfLines: { wetFittings: "", connected: "", bypassDone: "", checked: false, notes: "" } },
      result: { smodPlan: { radiatorLast: "", radiatorDate: "", checked: false, notes: "" } },
    } as InspectionDraft;
    assert.equal(oilChangeMode(d), true);
  });
});
