import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { coerceOverall, driveGates, passBlocked } from "./drive.ts";
import type { InspectionDraft } from "./types.ts";

function draft(over: (d: InspectionDraft) => void): InspectionDraft {
  const d = {
    header: { date: "2026-09-05", miles: "270000", inspector: "R", vin: "", drive: "4WD", towPkg: "", visitType: "15k" },
    fluids: { atf: { color: "", smell: "", inRange: "", checked: false, notes: "" } },
    engine: {
      notes: "",
      timingCover: { noise: "", seconds: "", oilPressure: "", checked: false, notes: "" },
      battery: { restV: "", runningV: "", loadTest: "", terminalsClean: "", checked: false, notes: "" },
      scan: { stored: "", pending: "", atfTemp: "", checked: false, notes: "" },
    },
    brakes: {
      pads: { lf: "", rf: "", lr: "", rr: "", checked: false, notes: "" },
      rotors: { front: "", rear: "", checked: false, notes: "" },
      pedalHeight: { measured: "", checked: false, notes: "" },
      absLamps: { state: "", checked: false, notes: "" },
    },
    cabin: { airbagLamp: "", items: {}, notes: "" },
    result: { overall: "pass" },
  } as InspectionDraft;
  over(d);
  return d;
}

describe("do-not-drive hard gates", () => {
  it("SMOD still blocks Pass", () => {
    const d = draft((x) => { x.fluids.atf.color = "milky"; });
    assert.ok(driveGates(d).some((g) => g.id === "smod"));
    assert.equal(passBlocked(d), true);
  });

  it("blocks Pass at pad repair limit, rotor min, collapsed rest V, ABS, airbag, short pedal", () => {
    assert.ok(passBlocked(draft((x) => { x.brakes.pads.lf = "1.0"; })));
    assert.ok(!passBlocked(draft((x) => { x.brakes.pads.lf = "2.1"; })));
    assert.ok(passBlocked(draft((x) => { x.brakes.rotors.front = "26.0"; })));
    assert.ok(!passBlocked(draft((x) => { x.brakes.rotors.front = "27.0"; })));
    assert.ok(passBlocked(draft((x) => { x.engine.battery.restV = "12.0"; })));
    assert.ok(!passBlocked(draft((x) => { x.engine.battery.restV = "12.5"; })));
    assert.ok(passBlocked(draft((x) => { x.brakes.absLamps.state = "stay-on"; })));
    assert.ok(passBlocked(draft((x) => { x.cabin.airbagLamp = "intermittent"; })));
    assert.ok(passBlocked(draft((x) => { x.brakes.pedalHeight.measured = "2.0 in"; })));
  });

  it("blocks Pass only when ongoing timing rattle sits with low oil pressure", () => {
    assert.ok(!passBlocked(draft((x) => { x.engine.timingCover.noise = "ongoing-rattle"; })));
    assert.ok(!passBlocked(draft((x) => { x.engine.timingCover.oilPressure = "low"; })));
    assert.ok(passBlocked(draft((x) => {
      x.engine.timingCover.noise = "ongoing-rattle";
      x.engine.timingCover.oilPressure = "low";
    })));
    assert.ok(passBlocked(draft((x) => {
      x.engine.timingCover.noise = "ongoing-rattle";
      x.engine.timingCover.notes = "low oil pressure lamp on";
    })));
  });

  it("flips Pass to Do not drive when a gate is open", () => {
    const d = draft((x) => { x.brakes.pads.rf = "0.8"; x.result.overall = "pass-notes"; });
    coerceOverall(d);
    assert.equal(d.result.overall, "do-not-drive");
  });
});
