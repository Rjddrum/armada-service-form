import { CORNERS, CORNERS_SPARE, type Corner, type InspectionDraft } from "./types.ts";

const REVIEW = "Needs another look or a technician review.";

export function parseMiles(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

export function parsePadMm(raw: string): number | null {
  const t = raw.trim().replace(",", ".");
  if (!t) return null;
  const m = t.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

export function parseTread32(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const frac = t.match(/(\d+(?:\.\d+)?)\s*\/\s*32/i);
  if (frac) return Number(frac[1]);
  const n = parsePadMm(t);
  if (n == null) return null;
  if (/\bmm\b/i.test(t)) return (n / 25.4) * 32;
  return n;
}

function vinOk(a: string, b: string): boolean {
  const x = a.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const y = b.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (x.length === 17 && y.length === 17) return x === y;
  return true;
}

function hasWearNumbers(d: InspectionDraft): boolean {
  const pads = d.brakes?.pads;
  const tread = d.brakes?.tread;
  if (pads && CORNERS.some((c) => parsePadMm(pads[c.key] ?? "") != null)) return true;
  if (tread && CORNERS.some((c) => parseTread32(tread[c.key] ?? "") != null)) return true;
  return false;
}

export function wearHistory(
  lastSubmitted: InspectionDraft | null,
  archive: InspectionDraft[],
): InspectionDraft[] {
  const out: InspectionDraft[] = [];
  const seen = new Set<string>();
  for (const d of [lastSubmitted, ...archive]) {
    if (!d?.id || seen.has(d.id)) continue;
    seen.add(d.id);
    out.push(d);
  }
  return out;
}

/** Most recent earlier visit with pad or tread numbers. Same VIN when both are complete. */
export function priorWearVisit(
  current: InspectionDraft,
  history: InspectionDraft[],
): InspectionDraft | null {
  const curMiles = parseMiles(current.header.miles);
  const candidates = history.filter(
    (h) => h.id !== current.id && vinOk(current.header.vin, h.header.vin) && hasWearNumbers(h),
  );
  if (curMiles != null) {
    const earlier = candidates
      .map((h) => ({ h, miles: parseMiles(h.header.miles) }))
      .filter((x) => x.miles != null && x.miles! < curMiles)
      .sort((a, b) => b.miles! - a.miles!);
    if (earlier[0]) return earlier[0].h;
  }
  const byDate = [...candidates].sort((a, b) => {
    const da = a.header.date || "";
    const db = b.header.date || "";
    if (da !== db) return db.localeCompare(da);
    return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
  });
  return byDate[0] ?? null;
}

export interface WearCorner {
  key: string;
  label: string;
  last: number | null;
  now: number | null;
  lost: number | null;
  lastRaw: string;
  nowRaw: string;
}

export interface WearCompare {
  priorDate: string;
  priorMiles: string;
  milesBetween: number | null;
  pads: WearCorner[];
  tread: WearCorner[];
}

function corners(
  keys: readonly { key: string; label: string }[],
  lastRaw: (k: string) => string,
  nowRaw: (k: string) => string,
  parse: (raw: string) => number | null,
): WearCorner[] {
  return keys.map((c) => {
    const lr = lastRaw(c.key);
    const nr = nowRaw(c.key);
    const last = parse(lr);
    const now = parse(nr);
    const lost = last != null && now != null ? round1(last - now) : null;
    return { key: c.key, label: c.label, last, now, lost, lastRaw: lr.trim(), nowRaw: nr.trim() };
  });
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function wearCompare(current: InspectionDraft, prior: InspectionDraft): WearCompare {
  const nowMi = parseMiles(current.header.miles);
  const lastMi = parseMiles(prior.header.miles);
  const milesBetween = nowMi != null && lastMi != null ? nowMi - lastMi : null;
  return {
    priorDate: prior.header.date,
    priorMiles: prior.header.miles,
    milesBetween,
    pads: corners(
      CORNERS,
      (k) => prior.brakes?.pads?.[k as Corner] ?? "",
      (k) => current.brakes?.pads?.[k as Corner] ?? "",
      parsePadMm,
    ),
    tread: corners(
      CORNERS_SPARE,
      (k) => prior.brakes?.tread?.[k as Corner] ?? (k === "spare" ? prior.brakes?.tread?.spare ?? "" : ""),
      (k) => current.brakes?.tread?.[k as Corner] ?? (k === "spare" ? current.brakes?.tread?.spare ?? "" : ""),
      parseTread32,
    ),
  };
}

export function wearLine(c: WearCorner, unit: string, milesBetween: number | null): string {
  if (c.last == null && c.now == null) return `${c.label}: —`;
  const last = c.last == null ? "—" : `${c.last}${unit}`;
  const now = c.now == null ? "—" : `${c.now}${unit}`;
  if (c.lost == null) return `${c.label}: ${last} → ${now}`;
  const sign = c.lost > 0 ? "−" : c.lost < 0 ? "+" : "";
  const mag = Math.abs(c.lost);
  let rate = "";
  if (c.lost > 0 && milesBetween != null && milesBetween >= 500) {
    const perK = (c.lost / milesBetween) * 1000;
    rate = ` · ${perK.toFixed(2)}${unit}/1k mi`;
  }
  return `${c.label}: ${last} → ${now} (${sign}${mag}${unit})${rate}`;
}

const AXLES: { name: string; left: string; right: string }[] = [
  { name: "front", left: "lf", right: "rf" },
  { name: "rear", left: "lr", right: "rr" },
];

export function wearFlags(compare: WearCompare): {
  id: string;
  label: string;
  measured: string;
  range: string;
  note: string;
  guideId: string;
}[] {
  const flags: {
    id: string;
    label: string;
    measured: string;
    range: string;
    note: string;
    guideId: string;
  }[] = [];
  const miles = compare.milesBetween;
  if (miles == null || miles < 1000) return flags;
  const mi = miles.toLocaleString("en-US");

  for (const axle of AXLES) {
    const L = compare.pads.find((c) => c.key === axle.left);
    const R = compare.pads.find((c) => c.key === axle.right);
    if (!L || !R || L.lost == null || R.lost == null) continue;
    if (L.lost < 0 || R.lost < 0) continue;
    const lLost = L.lost;
    const rLost = R.lost;
    const fast = lLost >= rLost ? L : R;
    const slow = lLost >= rLost ? R : L;
    const fastLost = lLost >= rLost ? lLost : rLost;
    const slowLost = lLost >= rLost ? rLost : lLost;
    const diff = round1(fastLost - slowLost);
    const ratio = slowLost >= 0.4 ? fastLost / slowLost : Infinity;
    if (diff >= 1.0 || (slowLost >= 0.4 && ratio >= 2)) {
      flags.push({
        id: `wear.pad.${axle.name}`,
        label: `${axle.name[0]!.toUpperCase()}${axle.name.slice(1)} pad wear`,
        measured: `${fast.label} lost ${fastLost} mm vs ${slow.label} ${slowLost} mm in ${mi} mi`,
        range: "axle pair should wear together",
        note: "Sticking caliper / slide pin until proven otherwise. Catch it before the rotor is scrap.",
        guideId: "brakes.pads",
      });
    }
  }

  for (const c of compare.pads) {
    if (c.lost == null || c.lost <= 0 || c.now == null || c.now <= 3) continue;
    const rate = c.lost / miles;
    const to3 = (c.now - 3) / rate;
    if (to3 < 15000) {
      flags.push({
        id: `wear.pad.life.${c.key}`,
        label: `${c.label} pad remaining`,
        measured: `${c.now} mm, ~${Math.round(to3).toLocaleString("en-US")} mi to 3.0 mm`,
        range: "schedule before the next 15k",
        note: REVIEW,
        guideId: "brakes.pads",
      });
    }
  }

  for (const axle of AXLES) {
    const L = compare.tread.find((c) => c.key === axle.left);
    const R = compare.tread.find((c) => c.key === axle.right);
    if (!L || !R || L.lost == null || R.lost == null) continue;
    if (L.lost < 0 || R.lost < 0) continue;
    const lLost = L.lost;
    const rLost = R.lost;
    const diff = Math.abs(lLost - rLost);
    if (diff >= 2) {
      const fast = lLost >= rLost ? L : R;
      const slow = lLost >= rLost ? R : L;
      const fastLost = lLost >= rLost ? lLost : rLost;
      const slowLost = lLost >= rLost ? rLost : lLost;
      flags.push({
        id: `wear.tread.${axle.name}`,
        label: `${axle.name[0]!.toUpperCase()}${axle.name.slice(1)} tread wear`,
        measured: `${fast.label} lost ${fastLost}/32 vs ${slow.label} ${slowLost}/32 in ${mi} mi`,
        range: "axle pair should wear together",
        note: "Alignment or UCA until proven otherwise. Catch it before the inner shoulder is gone.",
        guideId: "brakes.tread",
      });
    }
  }

  return flags;
}

export function wearStamp(compare: WearCompare): string {
  const mi =
    compare.milesBetween != null ? `${compare.milesBetween.toLocaleString("en-US")} mi` : "miles unknown";
  const date = compare.priorDate || "prior visit";
  const miles = compare.priorMiles.replace(/[^\d]/g, "");
  const lastMi = miles ? Number(miles).toLocaleString("en-US") : "—";
  return `vs last · ${mi} ago (${date} @ ${lastMi} mi)`;
}
