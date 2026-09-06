import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { missingRequiredPhotos, hasPhoto, photosForItem, flagPhotoSlot } from "./photo-slots.ts";
import type { InspectionDraft } from "./types.ts";
import type { PhotoShot } from "./photos.ts";

function draft(visit: InspectionDraft["header"]["visitType"] = "15k"): InspectionDraft {
  return {
    header: { date: "2026-09-05", miles: "1", inspector: "R", vin: "", drive: "4WD", towPkg: "", visitType: visit },
    itemStatus: {},
    photoSkip: {},
  } as unknown as InspectionDraft;
}

const shot: PhotoShot = { dataUrl: "data:image/jpeg;base64,xx", w: 10, h: 10 };

describe("required photos", () => {
  it("lists VIN, dash, cooler, ATF, overview, leaks, pads, tread on a 15k", () => {
    const missing = missingRequiredPhotos(draft("15k"), {});
    const lines = missing.map((m) => m.line);
    assert.ok(lines.includes("VIN plate: missing (photo required)"));
    assert.ok(lines.includes("Cooler fittings photo: missing (photo required)"));
    assert.ok(lines.some((l) => l.startsWith("LF pad")));
    assert.ok(lines.some((l) => l.includes("inner shoulder")));
    assert.ok(lines.includes("Frame / rust: missing (photo required)"));
  });

  it("oil-change hides frame, pads, and 15k suspension photo", () => {
    const missing = missingRequiredPhotos(draft("oil-change"), {});
    const labels = missing.map((m) => m.label);
    assert.ok(!labels.includes("Frame / rust"));
    assert.ok(!labels.includes("Suspension (UCA / ball joint / perch / shock)"));
    assert.ok(!labels.includes("LF pad"));
    assert.ok(labels.includes("VIN plate"));
  });

  it("skip reason or alias photo clears the requirement", () => {
    const d = draft("15k");
    d.photoSkip = { "header.vin": "plate covered in mud, will retake" };
    const photos = { "engine.atfLines": shot };
    const missing = missingRequiredPhotos(d, photos);
    assert.ok(!missing.some((m) => m.slot === "header.vin"));
    assert.ok(!missing.some((m) => m.slot === "engine.radiator"));
    assert.ok(hasPhoto(photos, { slot: "engine.radiator", label: "x", required: true, itemId: "radiator", aliases: ["engine.atfLines"] }));
  });

  it("timing-cover or oil-pan shot satisfies the leak photo", () => {
    const missing = missingRequiredPhotos(draft("15k"), { "engine.timingCover": shot });
    assert.ok(!missing.some((m) => m.slot === "fluids.oilLeak"));
  });

  it("attaches flag photos to ASAP / attention items", () => {
    const slot = flagPhotoSlot("alignment");
    const found = photosForItem("alignment", { [slot]: shot });
    assert.equal(found.length, 1);
    assert.equal(found[0]!.slot, slot);
  });
});
