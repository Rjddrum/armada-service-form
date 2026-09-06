//#region node_modules/.nitro/vite/services/ssr/assets/recalls-DRPCTb5u.js
var VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;
function normalizeVin(raw) {
	return raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
function isVinComplete(vin) {
	return VIN_RE.test(normalizeVin(vin));
}
function recallStamp(opts) {
	const date = opts.checkedAt.trim() || "—";
	const vin = opts.vinChecked.trim() || "—";
	const n = opts.campaigns.length;
	const listed = `${n} NHTSA campaign${n === 1 ? "" : "s"} listed`;
	const ymm = opts.ymm?.trim();
	return ymm ? `Checked Nissan campaign list on ${date} for VIN ${vin} — ${listed} for ${ymm}.` : `Checked Nissan campaign list on ${date} for VIN ${vin} — ${listed}.`;
}
function mapNhtsaResults(results) {
	if (!Array.isArray(results)) return [];
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const row of results) {
		if (!row || typeof row !== "object") continue;
		const r = row;
		const id = String(r.NHTSACampaignNumber ?? "").trim();
		if (!id || seen.has(id)) continue;
		seen.add(id);
		const component = String(r.Component ?? "").trim() || "Campaign";
		const summary = String(r.Summary ?? "").replace(/\s+/g, " ").trim().slice(0, 220);
		out.push({
			id,
			component,
			summary
		});
	}
	return out;
}
function ymmLine(make, model, year) {
	return [
		year,
		make,
		model
	].map((s) => s.trim()).filter(Boolean).join(" ");
}
function isThisArmada(make, model, year) {
	return /nissan/i.test(make) && /armada/i.test(model) && year.trim() === "2005";
}
//#endregion
export { recallStamp as a, normalizeVin as i, isVinComplete as n, ymmLine as o, mapNhtsaResults as r, isThisArmada as t };
