import { rowShows, type InspectionDraft } from "./types.ts";
import type { PhotoShot } from "./photos.ts";

export const PHOTO_CORNERS = [
  { key: "lf", label: "LF" },
  { key: "rf", label: "RF" },
  { key: "lr", label: "LR" },
  { key: "rr", label: "RR" },
] as const;

export interface PhotoSlotDef {
  slot: string;
  label: string;
  required: boolean;
  itemId: string;
  aliases?: string[];
}

export const PHOTO_SLOTS: PhotoSlotDef[] = [
  { slot: "header.vin", label: "VIN plate", required: true, itemId: "header" },
  { slot: "cabin.dash", label: "Dash warning lights (key on)", required: true, itemId: "absLamps" },
  {
    slot: "engine.radiator",
    label: "Cooler fittings photo",
    required: true,
    itemId: "radiator",
    aliases: ["engine.atfLines"],
  },
  { slot: "fluids.atf", label: "ATF on the stick at HOT", required: true, itemId: "atf" },
  { slot: "engine.overview", label: "Engine bay overview", required: true, itemId: "engine.overview" },
  { slot: "fluids.oilLeak", label: "Oil leaks / timing cover / oil pan", required: true, itemId: "oilLeak", aliases: ["engine.timingCover", "underbody.oilPan"] },
  ...PHOTO_CORNERS.map((c) => ({
    slot: `brakes.pads.${c.key}`,
    label: `${c.label} pad`,
    required: true,
    itemId: "pads",
  })),
  ...PHOTO_CORNERS.map((c) => ({
    slot: `brakes.tread.${c.key}`,
    label: `${c.label} tread + inner shoulder`,
    required: true,
    itemId: "tread",
  })),
  { slot: "underbody.frame", label: "Frame / rust", required: true, itemId: "underbody.frame" },
  {
    slot: "steering.ballJoints",
    label: "Suspension (UCA / ball joint / perch / shock)",
    required: true,
    itemId: "steering.ballJoints",
  },
  { slot: "fluids.coolant", label: "Coolant reservoir", required: false, itemId: "coolant" },
  { slot: "fluids.psf", label: "Power steering fluid", required: false, itemId: "psf" },
  { slot: "fluids.brake", label: "Brake fluid", required: false, itemId: "brake" },
  { slot: "engine.battery", label: "Battery / grounds", required: false, itemId: "battery" },
  { slot: "engine.grounds", label: "Grounds", required: false, itemId: "grounds" },
  { slot: "underbody.exhaust", label: "Exhaust / heat shields", required: false, itemId: "underbody.exhaust" },
  { slot: "cabin.jack", label: "Spare / jack", required: false, itemId: "cabin.jack" },
];

const BY_SLOT = new Map(PHOTO_SLOTS.map((s) => [s.slot, s]));

export function photoSlotDef(slot: string): PhotoSlotDef | undefined {
  return BY_SLOT.get(slot);
}

export function isRequiredPhotoSlot(slot: string): boolean {
  return BY_SLOT.get(slot)?.required === true;
}

export function shotOk(shot: PhotoShot | undefined | null): boolean {
  return Boolean(shot && typeof shot === "object" && shot.dataUrl);
}

export function hasPhoto(
  photos: Record<string, PhotoShot | undefined>,
  def: PhotoSlotDef,
): boolean {
  if (shotOk(photos[def.slot])) return true;
  return (def.aliases ?? []).some((a) => shotOk(photos[a]));
}

export function photoSkipReason(draft: InspectionDraft, slot: string): string {
  return (draft.photoSkip?.[slot] ?? "").trim();
}

export interface MissingPhoto {
  slot: string;
  label: string;
  line: string;
}

export function missingRequiredPhotos(
  draft: InspectionDraft,
  photos: Record<string, PhotoShot | undefined> = {},
): MissingPhoto[] {
  const visit = draft.header.visitType;
  const drive = draft.header.drive;
  const out: MissingPhoto[] = [];
  for (const def of PHOTO_SLOTS) {
    if (!def.required) continue;
    if (!rowShows(def.itemId, visit, drive, draft.header.plan)) continue;
    const entry = draft.itemStatus?.[def.itemId];
    if (entry?.manual && entry.value === "na") continue;
    if (photoSkipReason(draft, def.slot)) continue;
    if (hasPhoto(photos, def)) continue;
    out.push({ slot: def.slot, label: def.label, line: `${def.label}: missing (photo required)` });
  }
  return out;
}

const ITEM_SLOTS: Record<string, string[]> = {};
for (const def of PHOTO_SLOTS) {
  (ITEM_SLOTS[def.itemId] ??= []).push(def.slot);
}

export function photoSlotsForItem(itemId: string): string[] {
  if (ITEM_SLOTS[itemId]) return ITEM_SLOTS[itemId];
  if (itemId === "atfLines") return ["engine.radiator", "engine.atfLines"];
  if (itemId === "smodPlan") return ["engine.radiator", "engine.atfLines"];
  if (itemId === "timingCover") return ["fluids.oilLeak", "engine.timingCover"];
  return ITEM_SLOTS[itemId] ?? [];
}

export function flagPhotoSlot(itemId: string): string {
  return `item.${itemId}`;
}

export function photosForItem(
  itemId: string,
  photos: Record<string, PhotoShot | undefined>,
): { slot: string; shot: PhotoShot }[] {
  const slots = new Set(photoSlotsForItem(itemId));
  slots.add(flagPhotoSlot(itemId));
  if (itemId === "atf" || itemId === "smod" || itemId === "atfReject") {
    slots.add("fluids.atf");
    slots.add("engine.radiator");
    slots.add("engine.atfLines");
  }
  const out: { slot: string; shot: PhotoShot }[] = [];
  const seen = new Set<string>();
  for (const slot of slots) {
    const shot = photos[slot];
    if (!shotOk(shot) || seen.has(shot!.dataUrl)) continue;
    seen.add(shot!.dataUrl);
    out.push({ slot, shot: shot! });
  }
  return out;
}
