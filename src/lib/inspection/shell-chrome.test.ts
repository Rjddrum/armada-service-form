import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { missingRequiredPhotos } from "./photo-slots.ts";
import { photoChromeKey, shellChrome } from "./shell-chrome.ts";
import type { InspectionDraft } from "./types.ts";
import type { PhotoShot } from "./photos.ts";

function draft(visit: InspectionDraft["header"]["visitType"] = "15k"): InspectionDraft {
  return {
    header: { date: "2026-09-05", miles: "", inspector: "", vin: "", drive: "4WD", towPkg: "", visitType: visit },
    itemStatus: {},
    photoSkip: {},
    fluids: { notes: "" },
    engine: { timingCover: { notes: "" } },
  } as unknown as InspectionDraft;
}

const shot: PhotoShot = { dataUrl: "data:image/jpeg;base64,xx", w: 10, h: 10 };

describe("shell chrome", () => {
  it("notes do not change the photo key or missing-photo count", () => {
    const d = draft();
    const photos = {};
    const before = photoChromeKey(d, photos);
    const chromeBefore = shellChrome(d, photos);
    d.fluids.notes = "typed a long note about oil";
    d.engine.timingCover.notes = "rattle?";
    assert.equal(photoChromeKey(d, photos), before);
    const chromeAfter = shellChrome(d, photos);
    assert.equal(chromeAfter.missingRequiredPhotoCount, chromeBefore.missingRequiredPhotoCount);
    assert.equal(chromeAfter.headerReady, false);
    assert.deepEqual(chromeAfter, chromeBefore);
  });

  it("header ready flips on date + miles + inspector, not on notes", () => {
    const d = draft();
    assert.equal(shellChrome(d, {}).headerReady, false);
    d.header.miles = "270123";
    d.header.inspector = "Ryan";
    assert.equal(shellChrome(d, {}).headerReady, true);
    d.fluids.notes = "still just notes";
    assert.equal(shellChrome(d, {}).headerReady, true);
    assert.equal(photoChromeKey(d, {}), photoChromeKey({ ...d, fluids: { notes: "other" } } as InspectionDraft, {}));
  });

  it("count matches missingRequiredPhotos and drops on photo or N/A", () => {
    const d = draft();
    const empty = shellChrome(d, {});
    assert.equal(empty.missingRequiredPhotoCount, missingRequiredPhotos(d, {}).length);
    assert.ok(empty.missingRequiredPhotoCount > 0);
    const withVin = shellChrome(d, { "header.vin": shot });
    assert.equal(withVin.missingRequiredPhotoCount, empty.missingRequiredPhotoCount - 1);
    d.itemStatus = { pads: { value: "na", manual: true } };
    const naPads = shellChrome(d, { "header.vin": shot });
    assert.ok(naPads.missingRequiredPhotoCount < withVin.missingRequiredPhotoCount);
  });
});
