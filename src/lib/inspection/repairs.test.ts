import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyAutoStatuses } from "./status.ts";
import { buildSummary } from "./report.ts";
import { printRange, repairTable, repairTotals, resolvedRepair, suggestedPriority } from "./repairs.ts";
import type { InspectionDraft } from "./types.ts";

function row() {
  return { checked: false, notes: "" };
}

function draft(visit: InspectionDraft["header"]["visitType"] = "30k"): InspectionDraft {
  return {
    header: { date: "2026-09-05", miles: "271400", inspector: "Ryan", vin: "", drive: "4WD", towPkg: "", visitType: visit },
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
      radiator: { ...row(), seeping: "" },
      atfLines: { ...row(), connected: "", wetFittings: "", bypassDone: "" },
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
    photoSkip: {},
    repairs: {},
  } as unknown as InspectionDraft;
}

describe("repair priority and estimates", () => {
  it("does not invent a repair for Pass", () => {
    assert.equal(suggestedPriority("pass"), null);
    assert.equal(suggestedPriority("na"), null);
    const d = draft();
    d.fluids.atf.checked = true;
    d.fluids.atf.color = "red-amber";
    d.fluids.atf.smell = "atf";
    applyAutoStatuses(d);
    assert.equal(resolvedRepair(d, "atf"), null);
  });

  it("prefills Immediate + SMOD cooler defaults for milky ATF", () => {
    const d = draft();
    d.fluids.atf.checked = true;
    d.fluids.atf.color = "milky";
    d.fluids.atf.smell = "sweet";
    applyAutoStatuses(d);
    const row = resolvedRepair(d, "atf");
    assert.ok(row);
    assert.equal(row!.priority, "immediate");
    assert.equal(row!.title, "Transmission cooler upgrade");
    assert.equal(printRange(row!.diy), "$250–$500");
    assert.equal(printRange(row!.independent), "$600–$1,000");
    assert.equal(printRange(row!.dealer), "$1,200–$2,000");
  });

  it("prefills Soon for original radiator and pads under 3 mm", () => {
    const d = draft();
    d.result.smodPlan.checked = true;
    d.result.smodPlan.radiatorLast = "original";
    d.brakes.pads.checked = true;
    d.brakes.pads.lf = "2.1";
    d.brakes.pads.rf = "8";
    d.brakes.pads.lr = "8";
    d.brakes.pads.rr = "8";
    applyAutoStatuses(d);
    const rad = resolvedRepair(d, "smodPlan");
    assert.equal(rad?.priority, "soon");
    assert.equal(rad?.title, "Transmission cooler upgrade");
    const pads = resolvedRepair(d, "pads");
    assert.equal(pads?.priority, "soon");
    assert.equal(pads?.title, "Front pads and rotors");
    assert.equal(printRange(pads!.diy), "$80–$200");
  });

  it("sorts Immediate first and totals filled columns", () => {
    const d = draft();
    d.fluids.atf.checked = true;
    d.fluids.atf.color = "milky";
    d.fluids.atf.smell = "sweet";
    d.brakes.pads.checked = true;
    d.brakes.pads.lf = "2.1";
    d.brakes.pads.rf = "8";
    d.brakes.pads.lr = "8";
    d.brakes.pads.rr = "8";
    applyAutoStatuses(d);
    const table = repairTable(d);
    assert.equal(table[0]!.priority, "immediate");
    assert.ok(table.some((r) => r.priority === "soon"));
    const t = repairTotals(table);
    assert.equal(printRange(t.diy), "$330–$700");
    const summary = buildSummary(d);
    assert.ok(summary.repairs.length >= 2);
  });

  it("oil-change only attaches repairs to the short-list flags", () => {
    const d = draft("oil-change");
    d.fluids.atf.checked = true;
    d.fluids.atf.color = "brown";
    d.brakes.pads.checked = true;
    d.brakes.pads.lf = "1.0";
    d.result.smodPlan.checked = true;
    d.result.smodPlan.radiatorLast = "original";
    applyAutoStatuses(d);
    assert.ok(resolvedRepair(d, "atf"));
    assert.equal(resolvedRepair(d, "smodPlan"), null);
    assert.equal(resolvedRepair(d, "pads"), null);
  });

  it("blank columns print as em dash", () => {
    const d = draft();
    d.itemStatus = { coolant: { value: "attention", manual: true } };
    const row = resolvedRepair(d, "coolant");
    assert.ok(row);
    assert.equal(row!.hasDefault, false);
    assert.equal(printRange(row!.diy), "—");
  });
});
