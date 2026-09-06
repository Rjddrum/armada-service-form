import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PARTS_STRIP, partsStripText } from "./parts.ts";

describe("factory parts strip", () => {
  it("pins oil, ATF, pads/rotors, DOT 3, lugs, and the crush washer", () => {
    const t = partsStripText();
    assert.match(t, /5W-30/);
    assert.match(t, /6\.5 qt/);
    assert.match(t, /crush washer/);
    assert.match(t, /Matic J/);
    assert.match(t, /RE5R05A/);
    assert.match(t, /DOT 3/);
    assert.match(t, /98 ft-lb/);
    assert.match(t, /26\.0/);
    assert.match(t, /12\.0 mm/);
    assert.equal(PARTS_STRIP.lines.length, 4);
    assert.ok(!/6-7 qt/i.test(t));
    assert.ok(!/Dexron|Mercon/i.test(t));
  });
});
