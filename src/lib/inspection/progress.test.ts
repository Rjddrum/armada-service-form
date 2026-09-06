import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyWalkChoice } from "./status.ts";
import { formatRemaining, inspectionProgress, itemComplete, itemEstimateSec } from "./progress.ts";
import type { InspectionDraft } from "./types.ts";

function draft(over: Partial<InspectionDraft["header"]> = {}): InspectionDraft {
  return {
    header: {
      date: "2026-09-05",
      miles: "142350",
      inspector: "R",
      vin: "",
      drive: "4WD",
      towPkg: "",
      visitType: "oil-change",
      lastOilMi: "",
      lastAtfMi: "",
      lastRadiatorMi: "",
      lastBrakeMi: "",
      lastDiffMi: "",
      plan: null,
      ...over,
    },
    fluids: { atf: { color: "", smell: "", inRange: "", checked: false, notes: "" } },
    engine: { atfLines: { wetFittings: "", connected: "", bypassDone: "", checked: false, notes: "" } },
    brakes: { tread: { checked: false, notes: "", lf: "", rf: "", lr: "", rr: "", spare: "" } },
    result: { overall: "", smodPlan: { radiatorLast: "", radiatorDate: "", checked: false, notes: "" } },
    itemStatus: {},
  } as InspectionDraft;
}

describe("inspection progress", () => {
  it("oil-change Y is the short visit, not 76", () => {
    const p = inspectionProgress(draft());
    assert.ok(p.total >= 12 && p.total <= 35, `total ${p.total}`);
    assert.ok(p.total !== 76);
    assert.equal(p.done, 0);
    assert.equal(p.percent, 0);
    assert.match(p.remainingLabel, /min/);
  });

  it("2WD 30k is smaller than 4WD 30k", () => {
    const a = inspectionProgress(draft({ visitType: "30k", drive: "4WD", miles: "30000" }));
    const b = inspectionProgress(draft({ visitType: "30k", drive: "2WD", miles: "30000" }));
    assert.ok(b.total < a.total);
  });

  it("notes without a status do not complete an item", () => {
    const d = draft({ visitType: "15k" });
    d.brakes.tread.notes = "looks fine";
    d.brakes.tread.checked = true;
    assert.equal(itemComplete(d, "tread"), false);
    d.itemStatus = { tread: { value: "pass", manual: true } };
    assert.equal(itemComplete(d, "tread"), true);
    const p = inspectionProgress(d);
    assert.equal(p.done, 1);
    assert.match(p.line, /1 \/ \d+ complete/);
  });

  it("Can’t inspect counts as complete", () => {
    const d = draft();
    applyWalkChoice(d, "tread", "na");
    assert.equal(itemComplete(d, "tread"), true);
  });

  it("UNABLE counts as complete like N/A", () => {
    const d = draft();
    applyWalkChoice(d, "tread", "unable");
    assert.equal(itemComplete(d, "tread"), true);
  });


  it("time remaining is — until header is filled; short leftover is Less than 1 min", () => {
    assert.equal(formatRemaining(400, { ready: false, total: 10, done: 0 }), "—");
    assert.equal(formatRemaining(40, { ready: true, total: 10, done: 9 }), "Less than 1 min");
    assert.equal(formatRemaining(18 * 60, { ready: true, total: 10, done: 2 }), "18 min");
    assert.equal(formatRemaining(0, { ready: true, total: 10, done: 10 }), "Done");
    assert.equal(itemEstimateSec("atf"), 90);
    assert.equal(itemEstimateSec("transTable"), 180);
    assert.equal(itemEstimateSec("cabin.lights"), 45);
    const blank = draft({ date: "", miles: "", inspector: "" });
    assert.equal(inspectionProgress(blank).remainingLabel, "—");
  });

  it("report line distinguishes finished vs unfinished", () => {
    const open = inspectionProgress(draft());
    assert.match(open.reportLine, /unfinished items listed as Not inspected/);
    assert.ok(open.done < open.total);
  });
});
