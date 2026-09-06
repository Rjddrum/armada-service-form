import { headerComplete, type InspectionDraft } from "./types.ts";
import { hasPhoto, missingRequiredPhotos, PHOTO_SLOTS, photoSkipReason } from "./photo-slots.ts";
import type { PhotoShot } from "./photos.ts";

export type ShellChrome = {
  headerReady: boolean;
  missingRequiredPhotoCount: number;
};

type PhotoMap = Record<string, PhotoShot | undefined>;

/** Inputs missingRequiredPhotos actually reads — notes and other fields stay out. */
export function photoChromeKey(draft: InspectionDraft, photos: PhotoMap): string {
  const h = draft.header;
  const plan = h.plan
    ? `${+!!h.plan.oilService}${+!!h.plan.multiPoint}${+!!h.plan.powertrain}${+!!h.plan.cooling}${+!!h.plan.highMiles}${+!!h.plan.sparkPlugs}${+!!h.plan.coolantService}${+!!h.plan.brakeFluidService}`
    : "";
  let bits = `${h.visitType}|${h.drive}|${plan}`;
  for (const def of PHOTO_SLOTS) {
    if (!def.required) continue;
    const entry = draft.itemStatus?.[def.itemId];
    const na = entry?.manual && entry.value === "na" ? "1" : "0";
    const skip = photoSkipReason(draft, def.slot) ? "1" : "0";
    const got = hasPhoto(photos, def) ? "1" : "0";
    bits += `|${def.slot}:${na}${skip}${got}`;
  }
  return bits;
}

let lastPhotoKey = "";
let lastPhotoCount = -1;

export function missingRequiredPhotoCountOf(draft: InspectionDraft, photos: PhotoMap): number {
  const key = photoChromeKey(draft, photos);
  if (key === lastPhotoKey && lastPhotoCount >= 0) return lastPhotoCount;
  lastPhotoKey = key;
  lastPhotoCount = missingRequiredPhotos(draft, photos).length;
  return lastPhotoCount;
}

export function shellChrome(draft: InspectionDraft, photos: PhotoMap): ShellChrome {
  return {
    headerReady: headerComplete(draft.header),
    missingRequiredPhotoCount: missingRequiredPhotoCountOf(draft, photos),
  };
}
