import {
  rowShows,
  type DealerTier,
  type InspectionDraft,
  type ItemStatus,
  type RepairPlan,
  type RepairPriority,
} from "./types.ts";
import { rowStatus, STATUS_ROW_IDS, STATUS_ROW_LABELS } from "./status.ts";

export type { DealerTier, RepairPlan, RepairPriority } from "./types.ts";

export interface MoneyRange {
  low: number | null;
  high: number | null;
}

export interface RepairRow {
  id: string;
  title: string;
  priority: RepairPriority;
  diy: MoneyRange;
  independent: MoneyRange;
  dealer: MoneyRange;
  dealerTier: DealerTier;
  note: string;
  hasDefault: boolean;
}

export const PRIORITY_OPTIONS: { value: RepairPriority; label: string }[] = [
  { value: "immediate", label: "Immediate" },
  { value: "soon", label: "Soon" },
  { value: "monitor", label: "Monitor" },
];

const PRIORITY_RANK: Record<RepairPriority, number> = {
  immediate: 0,
  soon: 1,
  monitor: 2,
};

interface RepairCatalog {
  id: string;
  title: string;
  itemIds: string[];
  diy: [number, number] | null;
  independent: [number, number] | null;
  dealer: [number, number] | null;
  note?: string;
}

export const REPAIR_CATALOG: RepairCatalog[] = [
  {
    id: "cooler",
    title: "Transmission cooler upgrade",
    itemIds: ["atf", "atfLines", "atfReject", "smodPlan"],
    diy: [250, 500],
    independent: [600, 1000],
    dealer: [1200, 2000],
  },
  {
    id: "radiator",
    title: "Radiator replacement",
    itemIds: ["radiator"],
    diy: [200, 450],
    independent: [700, 1200],
    dealer: [1400, 2200],
  },
  {
    id: "front-brakes",
    title: "Front pads and rotors",
    itemIds: ["pads", "rotors"],
    diy: [80, 200],
    independent: [350, 650],
    dealer: [700, 1200],
  },
  {
    id: "timing",
    title: "Timing-cover / chain diagnosis",
    itemIds: ["timingCover"],
    diy: [0, 50],
    independent: [150, 400],
    dealer: [250, 600],
    note: "Diagnosis only — parts extra",
  },
  {
    id: "uca",
    title: "UCA / ball joint (each side)",
    itemIds: ["steering.ballJoints", "baseline.ucaJoints"],
    diy: [80, 200],
    independent: [300, 600],
    dealer: [550, 900],
  },
];

const BY_ITEM = new Map<string, RepairCatalog>();
for (const cat of REPAIR_CATALOG) {
  for (const id of cat.itemIds) BY_ITEM.set(id, cat);
}

export function catalogFor(itemId: string): RepairCatalog | undefined {
  return BY_ITEM.get(itemId);
}

export function emptyRepair(): RepairPlan {
  return {
    priority: "",
    diyLow: "",
    diyHigh: "",
    indLow: "",
    indHigh: "",
    dealerLow: "",
    dealerHigh: "",
    dealerTier: "",
  };
}

export function suggestedPriority(status: ItemStatus): RepairPriority | null {
  if (status === "asap") return "immediate";
  if (status === "attention") return "soon";
  if (status === "monitor") return "monitor";
  return null;
}

export function showsRepairBlock(status: ItemStatus): boolean {
  return status === "asap" || status === "attention" || status === "monitor";
}

export function parseMoney(raw: string | undefined): number | null {
  const t = (raw ?? "").replace(/[^\d.]/g, "");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function rangeFromPair(pair: [number, number] | null | undefined): MoneyRange {
  if (!pair) return { low: null, high: null };
  return { low: pair[0], high: pair[1] };
}

function storedRange(low: string, high: string, fallback: MoneyRange, stored: boolean): MoneyRange {
  if (!stored) return fallback;
  return { low: parseMoney(low), high: parseMoney(high) };
}

export function formatMoney(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function formatRange(range: MoneyRange): string {
  if (range.low == null && range.high == null) return "";
  if (range.low != null && range.high != null) {
    if (range.low === range.high) return formatMoney(range.low);
    return `${formatMoney(range.low)}–${formatMoney(range.high)}`;
  }
  return formatMoney((range.low ?? range.high)!);
}

export function printRange(range: MoneyRange, fallback = "—"): string {
  return formatRange(range) || fallback;
}

export function printDealer(row: Pick<RepairRow, "dealer" | "dealerTier">): string {
  const dollars = formatRange(row.dealer);
  if (dollars) return dollars;
  return row.dealerTier || "—";
}

export function resolvedRepair(draft: InspectionDraft, id: string): RepairRow | null {
  if (!rowShows(id, draft.header.visitType, draft.header.drive, draft.header.plan)) return null;
  const status = rowStatus(draft, id);
  const suggested = suggestedPriority(status);
  if (!suggested) return null;
  const cat = catalogFor(id);
  const stored = draft.repairs?.[id];
  const hasStored = Boolean(stored);
  const priority =
    stored?.priority === "immediate" || stored?.priority === "soon" || stored?.priority === "monitor"
      ? stored.priority
      : suggested;
  return {
    id,
    title: cat?.title ?? STATUS_ROW_LABELS[id] ?? id,
    priority,
    diy: storedRange(stored?.diyLow ?? "", stored?.diyHigh ?? "", rangeFromPair(cat?.diy), hasStored),
    independent: storedRange(stored?.indLow ?? "", stored?.indHigh ?? "", rangeFromPair(cat?.independent), hasStored),
    dealer: storedRange(stored?.dealerLow ?? "", stored?.dealerHigh ?? "", rangeFromPair(cat?.dealer), hasStored),
    dealerTier: hasStored ? (stored?.dealerTier ?? "") : "",
    note: cat?.note ?? "",
    hasDefault: Boolean(cat),
  };
}

export function snapshotPlan(row: RepairRow): RepairPlan {
  const money = (n: number | null) => (n == null ? "" : String(n));
  return {
    priority: row.priority,
    diyLow: money(row.diy.low),
    diyHigh: money(row.diy.high),
    indLow: money(row.independent.low),
    indHigh: money(row.independent.high),
    dealerLow: money(row.dealer.low),
    dealerHigh: money(row.dealer.high),
    dealerTier: row.dealer.low != null || row.dealer.high != null ? "" : row.dealerTier,
  };
}

export function writeRepair(draft: InspectionDraft, id: string, patch: Partial<RepairPlan>): void {
  const row = resolvedRepair(draft, id);
  if (!row) return;
  if (!draft.repairs) draft.repairs = {};
  draft.repairs[id] = { ...snapshotPlan(row), ...patch };
}

function worsePriority(a: RepairPriority, b: RepairPriority): RepairPriority {
  return PRIORITY_RANK[b] < PRIORITY_RANK[a] ? b : a;
}

export function repairTable(draft: InspectionDraft): RepairRow[] {
  const merged = new Map<string, RepairRow>();
  for (const id of STATUS_ROW_IDS) {
    const row = resolvedRepair(draft, id);
    if (!row) continue;
    const cat = catalogFor(id);
    const key = cat?.id ?? id;
    const prev = merged.get(key);
    if (!prev) {
      merged.set(key, row);
      continue;
    }
    prev.priority = worsePriority(prev.priority, row.priority);
  }
  return [...merged.values()].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.title.localeCompare(b.title));
}

function sumRange(rows: RepairRow[], pick: (r: RepairRow) => MoneyRange): MoneyRange {
  let low = 0;
  let high = 0;
  let n = 0;
  for (const r of rows) {
    const range = pick(r);
    if (range.low == null && range.high == null) continue;
    n += 1;
    const lo = range.low ?? range.high ?? 0;
    const hi = range.high ?? range.low ?? 0;
    low += lo;
    high += hi;
  }
  if (!n) return { low: null, high: null };
  return { low, high };
}

export function repairTotals(rows: RepairRow[]): { diy: MoneyRange; independent: MoneyRange; dealer: MoneyRange } {
  return {
    diy: sumRange(rows, (r) => r.diy),
    independent: sumRange(rows, (r) => r.independent),
    dealer: sumRange(rows, (r) => r.dealer),
  };
}

export function priorityLabel(p: RepairPriority): string {
  if (p === "immediate") return "Immediate";
  if (p === "soon") return "Soon";
  return "Monitor";
}

export const ESTIMATE_DISCLAIMER = "Costs are planning estimates, not invoices.";
