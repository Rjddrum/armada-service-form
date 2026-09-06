import type { RecallCampaign } from "./types.ts";

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

export function normalizeVin(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isVinComplete(vin: string): boolean {
  return VIN_RE.test(normalizeVin(vin));
}

export function recallStamp(opts: {
  checkedAt: string;
  vinChecked: string;
  ymm?: string;
  campaigns: RecallCampaign[];
}): string {
  const date = opts.checkedAt.trim() || "—";
  const vin = opts.vinChecked.trim() || "—";
  const n = opts.campaigns.length;
  const listed = `${n} NHTSA campaign${n === 1 ? "" : "s"} listed`;
  const ymm = opts.ymm?.trim();
  return ymm
    ? `Checked Nissan campaign list on ${date} for VIN ${vin} — ${listed} for ${ymm}.`
    : `Checked Nissan campaign list on ${date} for VIN ${vin} — ${listed}.`;
}

export function mapNhtsaResults(results: unknown): RecallCampaign[] {
  if (!Array.isArray(results)) return [];
  const out: RecallCampaign[] = [];
  const seen = new Set<string>();
  for (const row of results) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const id = String(r.NHTSACampaignNumber ?? "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const component = String(r.Component ?? "").trim() || "Campaign";
    const summary = String(r.Summary ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 220);
    out.push({ id, component, summary });
  }
  return out;
}

export function ymmLine(make: string, model: string, year: string): string {
  return [year, make, model].map((s) => s.trim()).filter(Boolean).join(" ");
}

export function isThisArmada(make: string, model: string, year: string): boolean {
  return /nissan/i.test(make) && /armada/i.test(model) && year.trim() === "2005";
}
