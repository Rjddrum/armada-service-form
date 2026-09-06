import type { PhotoShot } from "./photos.ts";

function parseMiles(raw: string | undefined): number | null {
  const t = (raw ?? "").replace(/[^\d]/g, "");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export const MAINT_DISCLAIMER = "Ages are from the log the owner entered, not from Nissan records.";

export const MAINT_SERVICES = [
  { key: "oil-change", label: "Oil change" },
  { key: "oil-filter", label: "Oil filter" },
  { key: "atf", label: "ATF service" },
  { key: "radiator", label: "Radiator replaced" },
  { key: "trans-cooler", label: "External trans cooler added" },
  { key: "spark-plugs", label: "Spark plugs" },
  { key: "coolant", label: "Coolant flush" },
  { key: "brake-fluid", label: "Brake fluid" },
  { key: "front-brakes", label: "Front brakes" },
  { key: "rear-brakes", label: "Rear brakes" },
  { key: "diff", label: "Diff fluid" },
  { key: "tcase", label: "Transfer-case fluid" },
  { key: "timing", label: "Timing chain / cover work" },
  { key: "battery", label: "Battery" },
  { key: "tires", label: "Tires" },
  { key: "alignment", label: "Alignment" },
  { key: "other", label: "Other" },
] as const;

export type MaintServiceKey = (typeof MAINT_SERVICES)[number]["key"];

export interface MaintRow {
  id: string;
  service: MaintServiceKey;
  custom: string;
  miles: string;
  date: string;
  notes: string;
  photo?: PhotoShot;
}

export interface MaintState {
  trucks: Record<string, MaintRow[]>;
}

export type MaintFlagTone = "alert" | "watch";

export interface MaintFlag {
  key: string;
  tone: MaintFlagTone;
  text: string;
  guideId?: string;
}

export interface MaintAge {
  miles: number | null;
  label: string;
}

export const NO_VIN_KEY = "no-vin";

export function emptyMaint(): MaintState {
  return { trucks: { [NO_VIN_KEY]: [] } };
}

export function truckKey(vin: string | undefined): string {
  const v = (vin ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return v.length === 17 ? v : NO_VIN_KEY;
}

export function rowsForVin(state: MaintState | undefined, vin: string | undefined): MaintRow[] {
  if (!state?.trucks) return [];
  const key = truckKey(vin);
  return state.trucks[key] ?? (key === NO_VIN_KEY ? [] : state.trucks[NO_VIN_KEY] ?? []);
}

export function emptyMaintRow(over: Partial<MaintRow> = {}): MaintRow {
  return {
    id: over.id ?? (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `m-${Date.now()}`),
    service: over.service ?? "oil-change",
    custom: over.custom ?? "",
    miles: over.miles ?? "",
    date: over.date ?? "",
    notes: over.notes ?? "",
    photo: over.photo,
  };
}

export function serviceLabel(row: MaintRow): string {
  if (row.service === "other" && row.custom.trim()) return row.custom.trim();
  const hit = MAINT_SERVICES.find((s) => s.key === row.service);
  if (row.custom.trim() && row.service !== "other") return `${hit?.label ?? row.service} — ${row.custom.trim()}`;
  return hit?.label ?? row.service;
}

const MONTHS: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

/** Accepts YYYY, YYYY-MM, YYYY-MM-DD, "Aug 2026". Empty → null. */
export function parseMaintDate(raw: string): { y: number; m: number; d: number } | null {
  const t = raw.trim();
  if (!t || t === "—" || /^unknown$/i.test(t)) return null;
  const iso = t.match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/);
  if (iso) {
    const y = Number(iso[1]);
    const m = iso[2] ? Number(iso[2]) : 1;
    const d = iso[3] ? Number(iso[3]) : 1;
    if (y < 1990 || y > 2100 || m < 1 || m > 12) return null;
    return { y, m, d };
  }
  const named = t.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (named) {
    const m = MONTHS[named[1]!.toLowerCase()];
    const y = Number(named[2]);
    if (!m || y < 1990) return null;
    return { y, m, d: 1 };
  }
  return null;
}

export function formatMaintDate(raw: string): string {
  const p = parseMaintDate(raw);
  if (!p) return raw.trim() ? raw.trim() : "—";
  const t = raw.trim();
  if (/^\d{4}$/.test(t)) return t;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (/^\d{4}-\d{1,2}$/.test(t) || /^[A-Za-z]+\s+\d{4}$/.test(t)) return `${months[p.m - 1]} ${p.y}`;
  return `${months[p.m - 1]} ${p.d}, ${p.y}`;
}

export function monthsSince(raw: string, now = new Date()): number | null {
  const p = parseMaintDate(raw);
  if (!p) return null;
  return (now.getFullYear() - p.y) * 12 + (now.getMonth() + 1 - p.m);
}

export function timeAgoLabel(raw: string, now = new Date()): string {
  const months = monthsSince(raw, now);
  if (months == null) return "";
  if (months <= 0) return "this month";
  if (months === 1) return "~1 month ago";
  if (months < 18) return `~${months} months ago`;
  const years = Math.round(months / 12);
  return years === 1 ? "~1 year ago" : `~${years} years ago`;
}

export function ageOf(row: MaintRow, currentMiles: number | null, now = new Date()): MaintAge {
  const svc = parseMiles(row.miles);
  if (svc != null && currentMiles != null) {
    const delta = currentMiles - svc;
    if (delta < 0) return { miles: delta, label: "ahead of current miles" };
    return { miles: delta, label: `${delta.toLocaleString("en-US")} mi ago` };
  }
  if (row.date.trim()) {
    const t = timeAgoLabel(row.date, now);
    if (t) return { miles: null, label: t };
  }
  return { miles: null, label: "Unknown" };
}

function rankRow(a: MaintRow, b: MaintRow): number {
  const am = parseMiles(a.miles) ?? -1;
  const bm = parseMiles(b.miles) ?? -1;
  if (am !== bm) return bm - am;
  const ad = parseMaintDate(a.date);
  const bd = parseMaintDate(b.date);
  const as = ad ? ad.y * 10000 + ad.m * 100 + ad.d : 0;
  const bs = bd ? bd.y * 10000 + bd.m * 100 + bd.d : 0;
  return bs - as;
}

export function lastService(rows: MaintRow[], keys: MaintServiceKey[]): MaintRow | null {
  const hit = rows.filter((r) => keys.includes(r.service)).sort(rankRow);
  return hit[0] ?? null;
}

export function lastServiceMiles(rows: MaintRow[], keys: MaintServiceKey[]): number | null {
  return parseMiles(lastService(rows, keys)?.miles);
}

function hasService(rows: MaintRow[], keys: MaintServiceKey[]): boolean {
  return rows.some((r) => keys.includes(r.service));
}

function unknownOrMissing(rows: MaintRow[], keys: MaintServiceKey[]): boolean {
  if (!hasService(rows, keys)) return true;
  const row = lastService(rows, keys);
  if (!row) return true;
  return parseMiles(row.miles) == null && !row.date.trim();
}

export interface HistoryLasts {
  oil: number | null;
  atf: number | null;
  radiator: number | null;
  cooler: number | null;
  spark: number | null;
  coolant: number | null;
  brakeFluid: number | null;
  diff: number | null;
  radiatorUnknown: boolean;
  coolerUnknown: boolean;
  sparkUnknown: boolean;
  oilUnknown: boolean;
  atfUnknown: boolean;
  coolantUnknown: boolean;
  brakeUnknown: boolean;
}

export function historyLasts(rows: MaintRow[]): HistoryLasts {
  const oilRow = lastService(rows, ["oil-change", "oil-filter"]);
  const atfRow = lastService(rows, ["atf"]);
  const radRow = lastService(rows, ["radiator"]);
  const coolRow = lastService(rows, ["trans-cooler"]);
  const sparkRow = lastService(rows, ["spark-plugs"]);
  const coolantRow = lastService(rows, ["coolant"]);
  const brakeRow = lastService(rows, ["brake-fluid"]);
  const diffRow = lastService(rows, ["diff", "tcase"]);
  return {
    oil: parseMiles(oilRow?.miles),
    atf: parseMiles(atfRow?.miles),
    radiator: parseMiles(radRow?.miles),
    cooler: parseMiles(coolRow?.miles),
    spark: parseMiles(sparkRow?.miles),
    coolant: parseMiles(coolantRow?.miles),
    brakeFluid: parseMiles(brakeRow?.miles),
    diff: parseMiles(diffRow?.miles),
    radiatorUnknown: unknownOrMissing(rows, ["radiator"]),
    coolerUnknown: unknownOrMissing(rows, ["trans-cooler"]),
    sparkUnknown: unknownOrMissing(rows, ["spark-plugs"]) || (Boolean(sparkRow) && parseMiles(sparkRow?.miles) == null),
    oilUnknown: !oilRow || parseMiles(oilRow.miles) == null,
    atfUnknown: unknownOrMissing(rows, ["atf"]) || (Boolean(atfRow) && parseMiles(atfRow?.miles) == null),
    coolantUnknown: unknownOrMissing(rows, ["coolant"]) || (Boolean(coolantRow) && parseMiles(coolantRow?.miles) == null),
    brakeUnknown: unknownOrMissing(rows, ["brake-fluid"]) || (Boolean(brakeRow) && parseMiles(brakeRow?.miles) == null),
  };
}

function milesOverdue(current: number, last: number | null, interval: number): boolean {
  if (last == null || current <= 0) return false;
  if (last > current) return false;
  return current - last >= interval;
}

export function maintFlags(
  rows: MaintRow[],
  currentMiles: number,
  tow: boolean,
  now = new Date(),
  fallback: { oil?: number | null; atf?: number | null; radiator?: number | null } = {},
): MaintFlag[] {
  const h = historyLasts(rows);
  if (fallback.oil != null && !hasService(rows, ["oil-change", "oil-filter"])) {
    h.oil = fallback.oil;
    h.oilUnknown = false;
  }
  if (fallback.atf != null && !hasService(rows, ["atf"])) {
    h.atf = fallback.atf;
    h.atfUnknown = false;
  }
  if (fallback.radiator != null && !hasService(rows, ["radiator"])) {
    h.radiator = fallback.radiator;
    h.radiatorUnknown = false;
  }
  const oilInt = tow ? 3500 : 5000;
  const atfInt = tow ? 15000 : 30000;
  const out: MaintFlag[] = [];

  if (h.radiatorUnknown || h.coolerUnknown) {
    out.push({
      key: "smod-history",
      tone: "alert",
      text: "Radiator replacement history unknown — SMOD inspection recommended.",
      guideId: "result.smodPlan",
    });
  }

  if (currentMiles >= 105000 && (h.sparkUnknown || milesOverdue(currentMiles, h.spark, 105000))) {
    const n = h.spark != null && currentMiles >= h.spark ? currentMiles - h.spark : null;
    out.push({
      key: "spark",
      tone: "watch",
      text: n != null
        ? `Spark plugs are approximately ${n.toLocaleString("en-US")} miles old — inspect / plan replacement.`
        : "Spark plugs are undocumented at this mileage — inspect / plan replacement.",
      guideId: "baseline.sparkPlugs",
    });
  }

  if (currentMiles > 0 && (h.oilUnknown || milesOverdue(currentMiles, h.oil, oilInt))) {
    out.push({
      key: "oil",
      tone: "watch",
      text: h.oilUnknown
        ? `Oil-change history unknown — recommend an oil change (~${oilInt.toLocaleString("en-US")} mi${tow ? ", tow package" : ""}).`
        : `Oil is about ${(currentMiles - (h.oil ?? 0)).toLocaleString("en-US")} miles old — recommend an oil-change visit.`,
      guideId: "fluids.oilLevel",
    });
  }

  if (currentMiles > 0 && (h.atfUnknown || milesOverdue(currentMiles, h.atf, atfInt))) {
    out.push({
      key: "atf",
      tone: "watch",
      text: "ATF service unknown or overdue — transmission service review and HOT ATF check.",
      guideId: "fluids.atf",
    });
  }

  const coolantRow = lastService(rows, ["coolant"]);
  const coolantOldDate = coolantRow ? (monthsSince(coolantRow.date, now) ?? 0) >= 24 : false;
  if (currentMiles > 0 && (h.coolantUnknown || milesOverdue(currentMiles, h.coolant, 30000) || coolantOldDate)) {
    out.push({
      key: "coolant",
      tone: "watch",
      text: "Coolant service unknown or older than 30,000 miles / 2 years — inspect coolant.",
      guideId: "fluids.coolant",
    });
  }

  const brakeRow = lastService(rows, ["brake-fluid"]);
  const brakeOldDate = brakeRow ? (monthsSince(brakeRow.date, now) ?? 0) >= 24 : false;
  if (currentMiles > 0 && (h.brakeUnknown || milesOverdue(currentMiles, h.brakeFluid, 30000) || brakeOldDate)) {
    out.push({
      key: "brake-fluid",
      tone: "watch",
      text: "Brake fluid unknown or older than 30,000 miles / 2 years — inspect / flush.",
      guideId: "fluids.brake",
    });
  }

  return out;
}

export function rekeyMaint(state: MaintState, fromVin: string, toVin: string): MaintState {
  const from = truckKey(fromVin);
  const to = truckKey(toVin);
  if (from === to) return state;
  const trucks = { ...state.trucks };
  const dest = trucks[to] ?? [];
  const src = trucks[from] ?? [];
  if (dest.length === 0 && src.length > 0 && to !== NO_VIN_KEY && from === NO_VIN_KEY) {
    trucks[to] = src.map((r) => ({ ...r }));
  }
  return { trucks };
}

export function patchRows(state: MaintState, vin: string, rows: MaintRow[]): MaintState {
  const key = truckKey(vin);
  return { trucks: { ...state.trucks, [key]: rows } };
}

export function alreadyLogged(rows: MaintRow[], service: MaintServiceKey, miles: string): boolean {
  const m = parseMiles(miles);
  return rows.some((r) => r.service === service && parseMiles(r.miles) === m && m != null);
}
