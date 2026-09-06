import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ageOf, emptyMaintRow, formatMaintDate, historyLasts, maintFlags, parseMaintDate } from "./maint.ts";
import { buildPlan } from "./plan.ts";
import type { InspectionDraft } from "./types.ts";

function draft(miles: string): InspectionDraft {
  return {
    header: {
      date: "2026-09-05",
      miles,
      inspector: "R",
      vin: "",
      drive: "4WD",
      towPkg: "",
      visitType: "",
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
}

const example = [
  emptyMaintRow({ id: "1", service: "oil-change", miles: "268000", date: "2026-08" }),
  emptyMaintRow({ id: "2", service: "atf", miles: "240000", date: "2024" }),
  emptyMaintRow({ id: "3", service: "radiator", miles: "", date: "" }),
  emptyMaintRow({ id: "4", service: "spark-plugs", miles: "210000", date: "2023" }),
];

describe("maintenance log", () => {
  it("parses month/year and year-only dates", () => {
    assert.deepEqual(parseMaintDate("2024"), { y: 2024, m: 1, d: 1 });
    assert.equal(formatMaintDate("2026-08"), "Aug 2026");
    assert.equal(formatMaintDate("Aug 2026"), "Aug 2026");
  });

  it("ages known miles and date-only without inventing miles", () => {
    const oil = emptyMaintRow({ service: "oil-change", miles: "268000", date: "2026-08" });
    const age = ageOf(oil, 270000);
    assert.equal(age.miles, 2000);
    assert.match(age.label, /2,000 mi ago/);
    const atf = emptyMaintRow({ service: "atf", miles: "", date: "2024" });
    const t = ageOf(atf, 270000, new Date(2026, 8, 5));
    assert.equal(t.miles, null);
    assert.match(t.label, /year/);
  });

  it("flags unknown radiator as SMOD, in-window oil/spark stay off the list at 270k", () => {
    const flags = maintFlags(example, 270000, false, new Date(2026, 8, 5));
    assert.ok(flags.some((f) => f.key === "smod-history" && f.tone === "alert"));
    assert.ok(flags.some((f) => f.key === "atf"));
    assert.ok(!flags.some((f) => f.key === "oil"));
    assert.ok(!flags.some((f) => f.key === "spark"));
    const h = historyLasts(example);
    assert.equal(h.oil, 268000);
    assert.equal(h.radiatorUnknown, true);
  });

  it("unknown spark at ≥105k flags inspect, recent oil does not", () => {
    const rows = [emptyMaintRow({ service: "oil-change", miles: "140000", date: "2026-08" })];
    const flags = maintFlags(rows, 142350, false);
    assert.ok(flags.some((f) => f.key === "spark"));
    assert.ok(!flags.some((f) => f.key === "oil"));
    assert.ok(flags.some((f) => f.key === "smod-history"));
  });

  it("feeds the recommendation card: history first", () => {
    const p = buildPlan(draft("270000"), example);
    assert.equal(p.oilService, false);
    assert.equal(p.cooling, true);
    assert.equal(p.powertrain, true);
    assert.ok(p.flags.some((f) => f.key === "smod-history"));
    assert.equal(p.sparkPlugs, false);
  });
});
