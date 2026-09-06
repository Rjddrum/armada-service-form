import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { i as normalizeVin, n as isVinComplete, o as ymmLine, r as mapNhtsaResults, t as isThisArmada } from "./recalls-DRPCTb5u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recalls-lookup-DrLQoWgZ.js
async function fetchJson(url) {
	const res = await fetch(url, {
		headers: {
			Accept: "application/json",
			"User-Agent": "2005-Armada-Inspection/1.0"
		},
		signal: AbortSignal.timeout(12e3)
	});
	if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
	return res.json();
}
var lookupNissanCampaigns_createServerFn_handler = createServerRpc({
	id: "4fb516f613006ae63fb247b0983f0894c543dc1503195a262a64d47f72f58e24",
	name: "lookupNissanCampaigns",
	filename: "src/lib/inspection/recalls-lookup.ts"
}, (opts) => lookupNissanCampaigns.__executeServer(opts));
var lookupNissanCampaigns = createServerFn({ method: "POST" }).validator((d) => d).handler(lookupNissanCampaigns_createServerFn_handler, async ({ data }) => {
	const vin = normalizeVin(data.vin);
	if (!isVinComplete(vin)) return {
		status: "error",
		error: "Enter the 17-character VIN in the header first."
	};
	try {
		const row = (await fetchJson(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`)).Results?.[0];
		const make = (row?.Make ?? "").trim();
		const model = (row?.Model ?? "").trim();
		const year = (row?.ModelYear ?? "").trim();
		if (!make || !model || !year) return {
			status: "error",
			error: "NHTSA could not decode that VIN. Check the digits."
		};
		const ymm = ymmLine(make, model, year);
		let payload = await fetchJson(`https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`);
		let campaigns = mapNhtsaResults(payload.results);
		if (!campaigns.length && /armada/i.test(model) && !/pathfinder/i.test(model)) {
			payload = await fetchJson(`https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent("pathfinder armada")}&modelYear=${encodeURIComponent(year)}`);
			campaigns = mapNhtsaResults(payload.results);
		}
		const today = /* @__PURE__ */ new Date();
		return {
			status: "ok",
			vin,
			ymm,
			checkedAt: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
			source: "NHTSA recallsByVehicle",
			campaigns,
			mismatch: !isThisArmada(make, model, year)
		};
	} catch {
		return {
			status: "error",
			error: "Could not reach the NHTSA campaign list. Try again."
		};
	}
});
//#endregion
export { lookupNissanCampaigns_createServerFn_handler };
