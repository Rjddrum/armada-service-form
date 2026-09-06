import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PLAIN, plainFor } from "./plain.ts";
import { meaningFor } from "./meaning.ts";

describe("meaning index", () => {
  it("matches the first sentence of plain why/what for every card", () => {
    for (const card of PLAIN) {
      const src = (card.why || card.what || "").trim();
      const expected = src.split(/(?<=\.)\s/)[0] ?? "";
      assert.equal(meaningFor(card.id, "FALLBACK"), expected, card.id);
    }
    const overview = plainFor("engine.overview")!;
    assert.equal(
      meaningFor("engine.overview", "x"),
      (overview.why || overview.what).split(/(?<=\.)\s/)[0],
    );
    assert.equal(meaningFor("", "label"), "label");
    assert.equal(meaningFor("not-a-card", "label"), "label");
  });
});
