import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { walkQueue, WALK_STEPS } from "./walk.ts";

describe("walk queue", () => {
  it("oil-change 4WD is a short one-item queue, not 76", () => {
    const q = walkQueue("oil-change", "4WD", null, true);
    assert.ok(q.length >= 12 && q.length <= 35, `got ${q.length}`);
    assert.ok(!q.some((c) => c.id === "pads"));
    assert.ok(!q.some((c) => c.id === "baseline.sparkPlugs"));
    assert.equal(q[0]?.id, "tread");
    assert.equal(q.at(-1)?.id, "result");
    const oil = q.find((c) => c.id === "oilLevel");
    assert.ok(oil);
    assert.equal(oil?.shopTitle, "Record oil change");
    assert.ok(!q.some((c) => c.id === "header"));
  });

  it("2WD drops transfer and front diff", () => {
    const q = walkQueue("30k", "2WD", null, false);
    assert.ok(!q.some((c) => c.id === "transferSeep"));
    assert.ok(q.some((c) => c.id === "rearDiffSeep"));
  });

  it("baseline includes spark plugs as its own step before result", () => {
    const q = walkQueue("baseline-270k", "4WD", null, false);
    const spark = q.findIndex((c) => c.id === "baseline.sparkPlugs");
    const result = q.findIndex((c) => c.id === "result");
    assert.ok(spark >= 0);
    assert.ok(result > spark);
    assert.equal(q.at(-1)?.id, "result");
    assert.ok(q.length > 40);
    assert.ok(!WALK_STEPS.some((s) => s.rows.includes("header")));
  });
});
