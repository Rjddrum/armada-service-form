import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseMiles,
  priorWearVisit,
  wearCompare,
  wearFlags,
  wearHistory,
  wearLine,
  wearStamp,
} from "./wear.ts";
import type { InspectionDraft } from "./types.ts";

function visit(over: Partial<InspectionDraft> & { id: string; miles: string; pads?: Partial<Record<string, string>>; tread?: Partial<Record<string, string>> }): InspectionDraft {
  return {
    id: over.id,
    header: { date: over.header?.date ?? "2026-03-01", miles: over.miles, inspector: "R", vin: over.header?.vin ?? "", drive: "4WD", towPkg: "", visitType: "15k" },
    brakes: {
      pads: { lf: over.pads?.lf ?? "", rf: over.pads?.rf ?? "", lr: over.pads?.lr ?? "", rr: over.pads?.rr ?? "", checked: false, notes: "" },
      tread: { lf: over.tread?.lf ?? "", rf: over.tread?.rf ?? "", lr: over.tread?.lr ?? "", rr: over.tread?.rr ?? "", spare: over.tread?.spare ?? "", checked: false, notes: "" },
    },
  } as InspectionDraft;
}

describe("wear-rate memory", () => {
  it("parses miles and picks the prior visit with numbers", () => {
    assert.equal(parseMiles("271,400"), 271400);
    const now = visit({ id: "b", miles: "271400", pads: { lf: "3.6" } });
    const old = visit({ id: "a", miles: "259000", pads: { lf: "4.2", rf: "4.1" } });
    const older = visit({ id: "z", miles: "240000", pads: { lf: "6" } });
    const prior = priorWearVisit(now, wearHistory(old, [older]));
    assert.equal(prior?.id, "a");
  });

  it("skips the current id and a different complete VIN", () => {
    const now = visit({ id: "b", miles: "271400", pads: { lf: "3.6" }, header: { date: "2026-09-05", vin: "5N1AA08A25N700001" } as InspectionDraft["header"] });
    now.header.vin = "5N1AA08A25N700001";
    const other = visit({ id: "x", miles: "250000", pads: { lf: "8" } });
    other.header.vin = "JN8AZ08W85W000001";
    assert.equal(priorWearVisit(now, [other]), null);
    const same = visit({ id: "b", miles: "259000", pads: { lf: "4.2" } });
    assert.equal(priorWearVisit(now, [same]), null);
  });

  it("prints pad mm vs last and miles between", () => {
    const last = visit({ id: "a", miles: "259000", pads: { lf: "4.2", rf: "4.1", lr: "5", rr: "5" } });
    last.header.date = "2026-03-01";
    const now = visit({ id: "b", miles: "271400", pads: { lf: "3.6", rf: "2.4", lr: "4.8", rr: "4.8" } });
    const cmp = wearCompare(now, last);
    assert.equal(cmp.milesBetween, 12400);
    assert.match(wearStamp(cmp), /12,400 mi/);
    assert.match(wearLine(cmp.pads[0]!, " mm", cmp.milesBetween), /4\.2 mm → 3\.6 mm/);
    assert.match(wearLine(cmp.pads[1]!, " mm", cmp.milesBetween), /4\.1 mm → 2\.4 mm/);
  });

  it("flags a sticking-caliper pad rate on one side of an axle", () => {
    const last = visit({ id: "a", miles: "259000", pads: { lf: "5.0", rf: "5.0", lr: "6", rr: "6" } });
    const now = visit({ id: "b", miles: "271400", pads: { lf: "3.2", rf: "4.6", lr: "5.8", rr: "5.8" } });
    const flags = wearFlags(wearCompare(now, last));
    assert.ok(flags.some((f) => f.id === "wear.pad.front"));
    assert.match(flags.find((f) => f.id === "wear.pad.front")!.measured, /LF lost 1\.8 mm vs RF 0\.4 mm/);
  });

  it("flags uneven tread as alignment / UCA", () => {
    const last = visit({ id: "a", miles: "259000", tread: { lf: "8", rf: "8", lr: "9", rr: "9" } });
    const now = visit({ id: "b", miles: "271400", tread: { lf: "5", rf: "7", lr: "8", rr: "8" } });
    const flags = wearFlags(wearCompare(now, last));
    assert.ok(flags.some((f) => f.id === "wear.tread.front"));
    assert.ok(!flags.some((f) => f.id === "wear.tread.rear"));
  });

  it("does not flag even wear or a short interval", () => {
    const last = visit({ id: "a", miles: "270800", pads: { lf: "4.2", rf: "4.1" } });
    const now = visit({ id: "b", miles: "271400", pads: { lf: "3.0", rf: "2.0" } });
    assert.equal(wearFlags(wearCompare(now, last)).length, 0);
    const last2 = visit({ id: "a", miles: "259000", pads: { lf: "4.2", rf: "4.1", lr: "5", rr: "5" } });
    const even = visit({ id: "b", miles: "271400", pads: { lf: "3.8", rf: "3.7", lr: "4.6", rr: "4.6" } });
    assert.ok(!wearFlags(wearCompare(even, last2)).some((f) => f.id.startsWith("wear.pad.front") || f.id.startsWith("wear.pad.rear")));
  });
});
