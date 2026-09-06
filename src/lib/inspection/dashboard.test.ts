import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { homeModel, nextAction, resultsModel, visitItemStatus, worryOf } from "./dashboard.ts";
import { walkQueue } from "./walk.ts";
import { conditionReport } from "./status.ts";
import type { InspectionDraft } from "./types.ts";

function row() {
  return { checked: false, notes: "" };
}

function draft(over: Partial<InspectionDraft["header"]> = {}): InspectionDraft {
  return {
    header: {
      date: "2026-09-05",
      miles: "142350",
      inspector: "R",
      vin: "",
      drive: "4WD",
      towPkg: "",
      visitType: "recommended",
      lastOilMi: "",
      lastAtfMi: "",
      lastRadiatorMi: "",
      lastBrakeMi: "",
      lastDiffMi: "",
      plan: {
        oilService: true,
        multiPoint: true,
        powertrain: true,
        cooling: true,
        highMiles: false,
        sparkPlugs: false,
        coolantService: false,
        brakeFluidService: false,
      },
      ...over,
    },
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
      radiator: row(),
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
    smodAcknowledged: false,
  } as unknown as InspectionDraft;
}

describe("home dashboard", () => {
  it("not started is idle and next action is a mileage one-liner, not a fluids dump", () => {
    const d = draft();
    const m = homeModel(d);
    assert.equal(m.worry.tone, "idle");
    assert.match(m.next.text, /142,350/);
    assert.match(m.next.text, /recommended/i);
    assert.doesNotMatch(m.next.text, /dipstick|used oil|strawberry|HOT hashes/i);
    assert.equal(m.score, null);
  });

  it("oil-change next action is not dipstick color", () => {
    const d = draft({ visitType: "oil-change", plan: null, miles: "8000" });
    d.itemStatus = { tread: { value: "pass", manual: true } };
    const n = nextAction(d);
    assert.doesNotMatch(n.text, /used oil|dipstick|oil color/i);
  });

  it("ASAP or milky ATF is critical", () => {
    const d = draft();
    d.itemStatus = { pads: { value: "asap", manual: true } };
    const w = worryOf(d, conditionReport(d), 1);
    assert.equal(w.tone, "critical");
    const d2 = draft();
    d2.fluids.atf.color = "milky";
    assert.equal(worryOf(d2, conditionReport(d2), 1).tone, "critical");
  });

  it("Needs attention without ASAP is repairs needed", () => {
    const d = draft();
    d.itemStatus = { pads: { value: "attention", manual: true } };
    const w = worryOf(d, conditionReport(d), 1);
    assert.equal(w.tone, "repairs");
  });

  it("visit denominator is not 76 on oil-change", () => {
    const d = draft({ visitType: "oil-change", plan: null });
    const m = homeModel(d);
    assert.ok(m.progress.total < 40, `got ${m.progress.total}`);
    assert.ok(m.progress.total !== 76);
  });
});

function stampAll(d: InspectionDraft, over: Record<string, { value: "pass" | "monitor" | "attention" | "asap" | "na"; manual: boolean }>) {
  d.itemStatus = {};
  const q = walkQueue(d.header.visitType, d.header.drive, d.header.plan, d.header.visitType === "oil-change");
  for (const c of q) {
    if (c.id === "result") {
      d.result.overall = "pass";
      continue;
    }
    d.itemStatus[c.id] = over[c.id] ?? { value: "pass", manual: true };
  }
}

describe("results dashboard", () => {
  it("incomplete when in-visit items have no status", () => {
    const d = draft({ visitType: "oil-change", plan: null, miles: "8000" });
    const r = resultsModel(d);
    assert.equal(r.tone, "incomplete");
    assert.equal(r.condition.label, "INCOMPLETE");
    assert.match(r.next.text, /Finish Walk/i);
    assert.ok(r.counts.pass < 40);
  });

  it("oil-change passed count is the short list, not 58 of 76", () => {
    const d = draft({ visitType: "oil-change", plan: null, miles: "8000" });
    d.itemStatus = {
      tread: { value: "pass", manual: true },
      pressures: { value: "pass", manual: true },
      "cabin.lights": { value: "pass", manual: true },
    };
    const r = resultsModel(d);
    assert.ok(r.counts.pass <= 5, `pass ${r.counts.pass}`);
    assert.ok(r.counts.pass + r.counts.na < 40);
    assert.ok(r.progress.total !== 76);
  });

  it("milky ATF is CRITICAL and next action says do not keep driving", () => {
    const d = draft({ visitType: "30k", plan: null, miles: "30000" });
    stampAll(d, { atf: { value: "asap", manual: true } });
    d.fluids.atf.color = "milky";
    const r = resultsModel(d);
    assert.equal(r.tone, "critical");
    assert.match(r.condition.label, /CRITICAL/);
    assert.match(r.next.text, /Do not keep driving/);
    assert.match(r.next.text, /SMOD/);
  });

  it("PASS is blocked when a Critical item exists", () => {
    const d = draft({ visitType: "oil-change", plan: null });
    stampAll(d, { atf: { value: "asap", manual: true } });
    const r = resultsModel(d);
    assert.notEqual(r.tone, "pass");
    assert.equal(r.tone, "critical");
  });

  it("visitItemStatus treats unset N/A auto as unset", () => {
    const d = draft();
    assert.equal(visitItemStatus(d, "tread"), "unset");
    d.itemStatus = { tread: { value: "na", manual: true } };
    assert.equal(visitItemStatus(d, "tread"), "na");
  });
});
