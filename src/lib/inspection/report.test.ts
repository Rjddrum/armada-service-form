import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildSummary, plainLine, REPORT_TITLE } from "./report.ts";
import { applyAutoStatuses } from "./status.ts";
import type { InspectionDraft } from "./types.ts";

function row() {
  return { checked: false, notes: "" };
}

function draft(): InspectionDraft {
  return {
    header: { date: "2026-09-05", miles: "271400", inspector: "Ryan", vin: "5N1AA08A15N700001", drive: "4WD", towPkg: "Y", visitType: "30k" },
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
      atfLines: { ...row(), connected: "", wetFittings: "", bypassDone: "" },
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
    result: { overall: "", crushWasher: "", oilType: "", oilAmount: "", oilFilterPn: "", smodPlan: { ...row(), radiatorLast: "", radiatorDate: "" } },
    itemStatus: {},
  } as unknown as InspectionDraft;
}

describe("inspection summary report", () => {
  it("builds the title block and score, not a 76-line dump", () => {
    const d = draft();
    d.fluids.atf.checked = true;
    d.fluids.atf.color = "red-amber";
    d.fluids.atf.smell = "atf";
    applyAutoStatuses(d);
    const s = buildSummary(d);
    assert.equal(s.title, REPORT_TITLE);
    assert.equal(s.miles, "271,400");
    assert.equal(s.date, "2026-09-05");
    assert.equal(s.inspector, "Ryan");
    assert.equal(s.vin, "5N1AA08A15N700001");
    assert.equal(s.drive, "4WD");
    assert.match(s.visit, /30k/);
    assert.ok(s.score <= 100);
    assert.equal(s.critical.length, 0);
  });

  it("puts SMOD and pad repair-limit in critical, 2.1 mm pads in recommended", () => {
    const d = draft();
    d.fluids.atf.checked = true;
    d.fluids.atf.color = "milky";
    d.fluids.atf.smell = "sweet";
    d.result.smodPlan.checked = true;
    d.result.smodPlan.radiatorLast = "original";
    d.brakes.pads.checked = true;
    d.brakes.pads.lf = "1.0";
    d.brakes.pads.rf = "2.1";
    d.brakes.pads.lr = "8";
    d.brakes.pads.rr = "8";
    applyAutoStatuses(d);
    const s = buildSummary(d);
    const crit = s.critical.map((c) => c.line).join(" | ");
    assert.match(crit, /Transmission cooling system requires attention/);
    assert.match(crit, /SMOD/);
    assert.match(crit, /1(\.0)? mm/);
    assert.ok(s.critical.some((c) => /radiator/i.test(c.line)));
    assert.equal(s.critical.filter((c) => /cooling system/.test(c.line)).length, 1);
    const rec = s.attention.map((c) => c.line).join(" | ");
    assert.ok(!/2\.1/.test(rec) || s.critical.some((c) => /pad/i.test(c.line)));
  });

  it("plain line includes measured value and factory range when there is a number", () => {
    const line = plainLine({
      id: "pads",
      label: "Pad thickness",
      measured: "2.1 mm",
      range: "factory min 3.0 mm",
    });
    assert.equal(line, "Pad thickness: 2.1 mm (factory min 3.0 mm)");
  });

  it("passed items are a count, N/A is collected but not required on the summary", () => {
    const d = draft();
    d.header.visitType = "oil-change";
    d.fluids.oilLeak.checked = true;
    applyAutoStatuses(d);
    const s = buildSummary(d);
    assert.ok(s.counts.pass >= 1);
    assert.ok(s.na.length > 0);
    assert.ok(s.passed.length === s.counts.pass);
  });
});
