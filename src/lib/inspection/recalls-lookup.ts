import { createServerFn } from "@tanstack/react-start";
import {
  isThisArmada,
  isVinComplete,
  mapNhtsaResults,
  normalizeVin,
  ymmLine,
} from "./recalls";
import type { RecallCampaign } from "./types";

export type CampaignLookup =
  | {
      status: "ok";
      vin: string;
      ymm: string;
      checkedAt: string;
      source: string;
      campaigns: RecallCampaign[];
      mismatch: boolean;
    }
  | { status: "error"; error: string };

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "2005-Armada-Inspection/1.0" },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
  return res.json();
}

export const lookupNissanCampaigns = createServerFn({ method: "POST" })
  .validator((d: { vin: string }) => d)
  .handler(async ({ data }): Promise<CampaignLookup> => {
    const vin = normalizeVin(data.vin);
    if (!isVinComplete(vin)) {
      return { status: "error", error: "Enter the 17-character VIN in the header first." };
    }
    try {
      const decoded = (await fetchJson(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`,
      )) as { Results?: Array<Record<string, string>> };
      const row = decoded.Results?.[0];
      const make = (row?.Make ?? "").trim();
      const model = (row?.Model ?? "").trim();
      const year = (row?.ModelYear ?? "").trim();
      if (!make || !model || !year) {
        return { status: "error", error: "NHTSA could not decode that VIN. Check the digits." };
      }
      const ymm = ymmLine(make, model, year);
      let payload = (await fetchJson(
        `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`,
      )) as { results?: unknown; Count?: number };
      let campaigns = mapNhtsaResults(payload.results);
      if (!campaigns.length && /armada/i.test(model) && !/pathfinder/i.test(model)) {
        payload = (await fetchJson(
          `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent("pathfinder armada")}&modelYear=${encodeURIComponent(year)}`,
        )) as { results?: unknown };
        campaigns = mapNhtsaResults(payload.results);
      }
      const today = new Date();
      const checkedAt = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      return {
        status: "ok",
        vin,
        ymm,
        checkedAt,
        source: "NHTSA recallsByVehicle",
        campaigns,
        mismatch: !isThisArmada(make, model, year),
      };
    } catch {
      return { status: "error", error: "Could not reach the NHTSA campaign list. Try again." };
    }
  });
