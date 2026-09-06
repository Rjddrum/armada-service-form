import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyAutoStatuses, conditionReport, rowStatus, setManualStatus, suggestedStatus } from "./status.ts";
import { outOfRangeFlags } from "./range.ts";
import { driveGates } from "./drive.ts";
import type { InspectionDraft } from "./types.ts";

function row() {
  return { checked: false, notes: "" };
}

function draft(): InspectionDraft {
  return {
    header: { date: "2026-09-05", miles: "270000", inspector: "R", vin: "", drive: "4WD", towPkg: "", visitType: "15k" },
    fluids: {
      notes: "",
      oilLevel: { ...row(), colorLevel: "", qtAdded: "" },
      oilLeak: row(),
      coolant: { ...row(), levelColor: "", capSeated: "", freezeF: "" },
      atf: { ...row(), inRange: "", color: "", smell: "" },
      psf: { ...row(), level: "", color: "" },
      brake: { ...row(), level: "", color: "", capSealed: "", moisture: "" },
      washer: row(),
      transferSeep: { ...row(), wetness: "" },
      frontDiffSeep: { ...row(), seep: "" },
      rearDiffSeep: { ...row(), seep: "", pinion: "" },
    },
    engine: {
      notes: "",
      timingCover: { ...row(), noise: "", seconds: "", oilPressure: "" },
      battery: { ...row(), restV: "", runningV: "", terminalsClean: "", loadTest: "" },
      scan: { ...row(), stored: "", pending: "", atfTemp: "" },
    },
    trans: { notes: "", rows: {}, atfReject: false },
    brakes: {
      notes: "",
      pads: { ...row(), lf: "", rf: "", lr: "", rr: "" },
      rotors: { ...row(), front: "", rear: "" },
      hoses: { ...row(), condition: "", wetCaliper: "" },
      master: { ...row(), seepage: "", pedalFirm: "" },
      pedalHeight: { ...row(), measured: "" },
      parking: { ...row(), clicks: "", holdsGrade: "" },
      absLamps: { ...row(), state: "" },
      tread: { ...row(), lf: "", rf: "", lr: "", rr: "", spare: "" },
      tireAge: { ...row(), lf: "", rf: "", lr: "", rr: "", spare: "" },
      wear: { ...row(), pattern: "" },
      pressures: { ...row(), lf: "", rf: "", lr: "", rr: "", spare: "" },
    },
    cabin: { notes: "", items: {}, airbagLamp: "", recalls: { ...row(), checkedAt: "", vinChecked: "", ymm: "", source: "", campaigns: [] } },
    baseline: {},
    result: { overall: "", crushWasher: "", oilType: "", oilAmount: "", oilFilterPn: "", smodPlan: { ...row(), radiatorLast: "", radiatorDate: "" } },
    itemStatus: {},
  } as unknown as InspectionDraft;
}

describe("5-state status and condition score", () => {
  it("auto-sets pad statuses from factory ranges", () => {
    const d = draft();
    d.brakes.pads.checked = true;
    d.brakes.pads.lf = "5.0";
    d.brakes.pads.rf = "3.5";
    d.brakes.pads.lr = "2.1";
    d.brakes.pads.rr = "1.0";
    applyAutoStatuses(d);
    assert.equal(rowStatus(d, "pads"), "asap");
  });

  it("monitor for pads close to limit and short timing rattle", () => {
    const d = draft();
    d.brakes.pads.checked = true;
    d.brakes.pads.lf = "3.5";
    d.brakes.pads.rf = "3.6";
    d.brakes.pads.lr = "4.0";
    d.brakes.pads.rr = "3.8";
    d.engine.timingCover.checked = true;
    d.engine.timingCover.noise = "short-rattle";
    d.engine.timingCover.seconds = "2";
    applyAutoStatuses(d);
    assert.equal(rowStatus(d, "pads"), "monitor");
    assert.equal(rowStatus(d, "timingCover"), "monitor");
  });

  it("needs attention for drivable out-of-range pads and uneven tread", () => {
    const d = draft();
    d.brakes.pads.checked = true;
    d.brakes.pads.lf = "2.1";
    d.brakes.pads.rf = "2.4";
    d.brakes.pads.lr = "8";
    d.brakes.pads.rr = "8";
    d.brakes.tread.checked = true;
    d.brakes.tread.lf = "5";
    d.brakes.tread.rf = "8";
    d.brakes.tread.lr = "8";
    d.brakes.tread.rr = "8";
    applyAutoStatuses(d);
    assert.equal(rowStatus(d, "pads"), "attention");
    assert.equal(rowStatus(d, "tread"), "attention");
  });

  it("hides oil-change interval rows as N/A and does not require dipstick for oil service", () => {
    const d = draft();
    d.header.visitType = "oil-change";
    d.result.oilType = "5W-30";
    d.result.oilAmount = "6.5 qt";
    d.fluids.oilLevel.checked = true;
    applyAutoStatuses(d);
    assert.equal(rowStatus(d, "oilLevel"), "pass");
    assert.equal(rowStatus(d, "rotors"), "na");
    assert.equal(rowStatus(d, "trans.parkReverse"), "na");
    assert.equal(rowStatus(d, "transferSeep"), "na");
  });

  it("2WD skips transfer as N/A", () => {
    const d = draft();
    d.header.drive = "2WD";
    applyAutoStatuses(d);
    assert.equal(rowStatus(d, "transferSeep"), "na");
    assert.equal(rowStatus(d, "trans.fourwd"), "na");
  });

  it("scores 100 minus 15/6/2 and ignores N/A", () => {
    const d = draft();
    d.brakes.pads.checked = true;
    d.brakes.pads.lf = "1.0";
    d.brakes.pads.rf = "8";
    d.brakes.pads.lr = "8";
    d.brakes.pads.rr = "8";
    d.brakes.tread.checked = true;
    d.brakes.tread.lf = "2.1";
    d.brakes.tread.rf = "8";
    d.brakes.tread.lr = "8";
    d.brakes.tread.rr = "8";
    d.engine.timingCover.checked = true;
    d.engine.timingCover.noise = "short-rattle";
    applyAutoStatuses(d);
    const r = conditionReport(d);
    assert.equal(r.counts.asap, 1);
    assert.ok(r.counts.attention >= 1);
    assert.ok(r.counts.monitor >= 1);
    const expected = Math.max(0, 100 - 15 * r.counts.asap - 6 * r.counts.attention - 2 * r.counts.monitor);
    assert.equal(r.score, expected);
    assert.ok(r.score <= 100 && r.score >= 0);
  });

  it("manual override sticks", () => {
    const d = draft();
    d.brakes.pads.checked = true;
    d.brakes.pads.lf = "2.1";
    applyAutoStatuses(d);
    assert.equal(rowStatus(d, "pads"), "attention");
    setManualStatus(d, "pads", "monitor");
    applyAutoStatuses(d);
    assert.equal(rowStatus(d, "pads"), "monitor");
  });

  it("SMOD is Repair ASAP", () => {
    const d = draft();
    d.fluids.atf.checked = true;
    d.fluids.atf.color = "milky";
    applyAutoStatuses(d);
    assert.equal(rowStatus(d, "atf"), "asap");
    assert.ok(driveGates(d).some((g) => g.id === "smod"));
    assert.ok(outOfRangeFlags(d).length >= 1);
    assert.equal(suggestedStatus(d, "atf", outOfRangeFlags(d), driveGates(d)), "asap");
  });
});
