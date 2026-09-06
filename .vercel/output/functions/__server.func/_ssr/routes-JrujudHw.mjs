import { o as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { A as isRequiredPhotoSlot, B as photoSlotDef, C as grokReportLine, D as isAutoScanSlot, E as headerComplete, F as oilWaitReady, G as sanitizeSuggestion, H as photosForItem, I as overallLabel, J as smodPlanRecord, K as shotOk, M as isSmodRisk, N as missingRequiredPhotos, O as isDraftStarted, P as oilChangeRecord, R as photoHash, S as flagPhotoSlot, T as hasPhoto, U as privacyPayload, V as photoSlotsForItem, W as rowShows, X as visitLabel, Y as suggestionForItem, Z as visitShows, _ as UNDERBODY_ITEMS, a as CORNERS, b as driveShows, c as OIL_WAIT_MS, d as PHOTO_SLOTS, f as ROAD_ITEMS, g as TRANS_ROWS, h as STEERING_ITEMS, i as CHECK_ROW_IDS, j as isScanAllowedSlot, k as isOilChange, l as OVERALL_OPTIONS, m as SMOD_INTERVAL, n as BASELINE_ITEMS, o as CORNERS_SPARE, p as SECTION_DEFS, q as shouldAutoScan, r as CABIN_ITEMS, s as GROK_STATUS_LABEL, t as ALL_SECTION_IDS, u as PHOTO_CORNERS, v as VISIT_TYPES, w as grokStatusToItem, x as drivelineShaftLabel, y as appendNote, z as photoSkipReason } from "./grok-scan-1cGQChnJ.mjs";
import { a as recallStamp, i as normalizeVin, n as isVinComplete } from "./recalls-DRPCTb5u.mjs";
import { S as ArrowLeft, _ as ChevronDown, a as Square, b as BookOpen, c as ScanSearch, d as Mic, f as Lock, g as ChevronLeft, h as ChevronRight, i as Trash2, l as Plus, m as Circle, n as Undo2, o as Settings, p as Info, s as Search, t as X, u as Pencil, v as Check, x as ArrowUpRight, y as Camera } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-JrujudHw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = require_jspdf_node_min();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function todayISO() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function formatMiles(n) {
	const digits = n.replace(/[^\d]/g, "");
	if (!digits) return "";
	return Number(digits).toLocaleString("en-US");
}
function formatShortDate(iso) {
	if (!iso) return "";
	const [y, m, d] = iso.split("-");
	if (!y || !m || !d) return iso;
	return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
function formatStamp(ms) {
	return new Date(ms).toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
function formatCountdown(ms) {
	const total = Math.max(0, Math.ceil(ms / 1e3));
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function formatSaved(ms, now = Date.now()) {
	if (!ms) return "Not saved";
	if (now - ms < 2e4) return "Saved · just now";
	return `Saved · ${new Date(ms).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit"
	})}`;
}
function row() {
	return {
		checked: false,
		notes: ""
	};
}
function remembered() {
	if (typeof window === "undefined") return {
		inspector: "",
		vin: ""
	};
	try {
		return {
			inspector: localStorage.getItem("armada-last-inspector-v1") || "",
			vin: localStorage.getItem("armada-last-vin-v1") || ""
		};
	} catch {
		return {
			inspector: "",
			vin: ""
		};
	}
}
function rememberPeople(inspector, vin) {
	if (typeof window === "undefined") return;
	try {
		if (inspector.trim()) localStorage.setItem("armada-last-inspector-v1", inspector.trim());
		if (vin.trim()) localStorage.setItem("armada-last-vin-v1", vin.trim());
	} catch {}
}
function emptyDraft() {
	const now = Date.now();
	const who = remembered();
	const transRows = {};
	for (const r of TRANS_ROWS) transRows[r.key] = {
		cold: "",
		hot: "",
		notes: ""
	};
	const mapItems = (items) => {
		const out = {};
		for (const i of items) out[i.key] = row();
		return out;
	};
	const fluids = () => ({
		notes: "",
		oilLevel: {
			...row(),
			colorLevel: "",
			qtAdded: ""
		},
		oilLeak: row(),
		coolant: {
			...row(),
			levelColor: "",
			capSeated: "",
			freezeF: ""
		},
		atf: {
			...row(),
			inRange: "",
			color: "",
			smell: ""
		},
		psf: {
			...row(),
			level: "",
			color: ""
		},
		brake: {
			...row(),
			level: "",
			color: "",
			capSealed: "",
			moisture: ""
		},
		washer: row(),
		transferSeep: {
			...row(),
			wetness: ""
		},
		frontDiffSeep: {
			...row(),
			seep: ""
		},
		rearDiffSeep: {
			...row(),
			seep: "",
			pinion: ""
		}
	});
	const engine = () => ({
		notes: "",
		timingCover: {
			...row(),
			noise: "",
			seconds: "",
			oilPressure: ""
		},
		manifolds: {
			...row(),
			noise: "",
			soot: ""
		},
		idle: {
			...row(),
			quality: "",
			cel: ""
		},
		belt: {
			...row(),
			condition: "",
			tensionerPlay: ""
		},
		radiator: {
			...row(),
			seeping: ""
		},
		atfLines: {
			...row(),
			connected: "",
			wetFittings: "",
			bypassDone: ""
		},
		airFilter: {
			...row(),
			condition: "",
			cabinDue: ""
		},
		battery: {
			...row(),
			restV: "",
			runningV: "",
			terminalsClean: "",
			loadTest: ""
		},
		grounds: {
			...row(),
			condition: ""
		},
		pcv: {
			...row(),
			condition: ""
		},
		scan: {
			...row(),
			stored: "",
			pending: "",
			atfTemp: ""
		}
	});
	const brakes = () => ({
		notes: "",
		pads: {
			...row(),
			lf: "",
			rf: "",
			lr: "",
			rr: ""
		},
		rotors: {
			...row(),
			front: "",
			rear: ""
		},
		hoses: {
			...row(),
			condition: "",
			wetCaliper: ""
		},
		master: {
			...row(),
			seepage: "",
			pedalFirm: ""
		},
		pedalHeight: {
			...row(),
			measured: ""
		},
		parking: {
			...row(),
			clicks: "",
			holdsGrade: ""
		},
		absLamps: {
			...row(),
			state: ""
		},
		tread: {
			...row(),
			lf: "",
			rf: "",
			lr: "",
			rr: "",
			spare: ""
		},
		tireAge: {
			...row(),
			lf: "",
			rf: "",
			lr: "",
			rr: "",
			spare: ""
		},
		wear: {
			...row(),
			pattern: ""
		},
		pressures: {
			...row(),
			lf: "",
			rf: "",
			lr: "",
			rr: "",
			spare: ""
		},
		lugTorque: {
			...row(),
			rechecked: ""
		},
		bearings: {
			...row(),
			lf: "",
			rf: "",
			lr: "",
			rr: ""
		},
		alignment: {
			...row(),
			feel: ""
		}
	});
	return {
		id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `d-${now}`,
		createdAt: now,
		updatedAt: now,
		header: {
			date: todayISO(),
			miles: "",
			inspector: who.inspector,
			vin: who.vin,
			drive: "",
			towPkg: "",
			visitType: "",
			lastOilMi: "",
			lastAtfMi: "",
			lastRadiatorMi: "",
			lastBrakeMi: "",
			lastDiffMi: "",
			plan: null
		},
		fluids: fluids(),
		engine: engine(),
		trans: {
			notes: "",
			rows: transRows,
			atfReject: false
		},
		brakes: brakes(),
		steering: {
			notes: "",
			items: mapItems(STEERING_ITEMS)
		},
		underbody: {
			notes: "",
			items: mapItems(UNDERBODY_ITEMS)
		},
		cabin: {
			notes: "",
			items: mapItems(CABIN_ITEMS),
			airbagLamp: "",
			recalls: {
				...row(),
				checkedAt: "",
				vinChecked: "",
				ymm: "",
				source: "",
				campaigns: []
			}
		},
		road: {
			notes: "",
			items: mapItems(ROAD_ITEMS),
			gaugeStable: ""
		},
		baseline: {
			notes: "",
			sparkPlugs: {
				...row(),
				lastMiles: "",
				cycle: "",
				verdict: ""
			},
			coolantService: {
				...row(),
				lastService: "",
				cap: "",
				thermostat: "",
				pumpWeep: "",
				verdict: ""
			},
			brakeFluid: {
				...row(),
				lastFlush: "",
				verdict: ""
			},
			diffFluid: {
				...row(),
				transfer: "",
				front: "",
				rear: "",
				verdict: ""
			},
			seepage: {
				...row(),
				valveCover: "",
				timingCover: "",
				oilPan: "",
				verdict: ""
			},
			manifoldBolts: {
				...row(),
				verdict: ""
			},
			ucaJoints: {
				...row(),
				innerTaper: "",
				verdict: ""
			},
			airShocks: {
				...row(),
				equipped: "",
				verdict: ""
			}
		},
		result: {
			overall: "",
			failItems: "",
			oilChangeMi: "",
			oilType: "",
			oilAmount: "",
			oilFilterPn: "",
			crushWasher: "",
			service15kMi: "",
			service30kMi: "",
			signName: "",
			signDate: todayISO(),
			smodPlan: {
				...row(),
				radiatorLast: "",
				radiatorDate: ""
			}
		},
		smodAcknowledged: false,
		oilWaitStartedAt: null,
		atfIdle: false,
		atfCycled: false,
		atfHot: false,
		itemStatus: {},
		photoSkip: {},
		repairs: {},
		grokScan: {}
	};
}
function emptySettings() {
	const who = remembered();
	return {
		toEmail: "",
		ccEmail: "",
		lastInspector: who.inspector,
		lastVin: who.vin
	};
}
var STOP = "Do not drive. Pass is blocked.";
function parseNum$2(raw) {
	const t = (raw ?? "").trim().replace(",", ".");
	if (!t) return null;
	const m = t.match(/-?\d+(?:\.\d+)?/);
	if (!m) return null;
	const n = Number(m[0]);
	return Number.isFinite(n) ? n : null;
}
function parseInches$1(raw) {
	const t = (raw ?? "").trim().toLowerCase();
	if (!t) return null;
	const n = parseNum$2(t);
	if (n == null) return null;
	if (/\bmm\b/.test(t)) return n / 25.4;
	return n;
}
function lowOilPressure(draft) {
	if (draft.engine?.timingCover?.oilPressure === "low") return true;
	const text = [
		draft.engine?.timingCover?.notes,
		draft.engine?.scan?.stored,
		draft.engine?.scan?.pending,
		draft.engine?.notes
	].filter(Boolean).join("\n");
	return /\blow\s+oil(\s+press)?|\boil\s+press(ure)?\s*(low|drop|lamp|light|warning)|oil\s+(pressure\s+)?(lamp|light|warning)/i.test(text);
}
/** Hard park-it gates. SMOD plus the safety items that cannot be a Pass. */
function driveGates(draft) {
	const gates = [];
	const push = (g) => gates.push(g);
	if (isSmodRisk(draft)) push({
		id: "smod",
		label: "SMOD — coolant in the ATF",
		measured: [draft.fluids.atf.color, draft.fluids.atf.smell].filter(Boolean).join(", "),
		range: "factory: red-amber ATF, smells like ATF",
		note: STOP,
		guideId: "fluids.atf"
	});
	for (const c of CORNERS) {
		const n = parseNum$2(draft.brakes?.pads?.[c.key]);
		if (n != null && n <= 1) push({
			id: `pads.${c.key}`,
			label: `${c.label} pad at repair limit`,
			measured: `${n} mm`,
			range: "factory repair limit 1.0 mm",
			note: STOP,
			guideId: "brakes.pads"
		});
	}
	const front = parseNum$2(draft.brakes?.rotors?.front);
	if (front != null && front <= 26) push({
		id: "rotors.front",
		label: "Front rotor at or below min",
		measured: `${front} mm`,
		range: "factory min 26.0 mm (new 28.0 mm)",
		note: STOP,
		guideId: "brakes.rotors"
	});
	const rear = parseNum$2(draft.brakes?.rotors?.rear);
	if (rear != null && rear <= 12) push({
		id: "rotors.rear",
		label: "Rear rotor at or below min",
		measured: `${rear} mm`,
		range: "factory min 12.0 mm (new 14.0 mm)",
		note: STOP,
		guideId: "brakes.rotors"
	});
	const rest = parseNum$2(draft.engine?.battery?.restV);
	if (rest != null && rest < 12.2) push({
		id: "battery.restV",
		label: "Battery rest voltage collapsed",
		measured: `${rest} V`,
		range: "factory rest 12.4–12.7 V — collapse is below 12.2 V",
		note: STOP,
		guideId: "engine.battery"
	});
	const abs = draft.brakes?.absLamps?.state;
	if (abs === "stay-on" || abs === "intermittent") push({
		id: "abs.lamps",
		label: "ABS / SLIP / VDC lamp",
		measured: abs,
		range: "factory: prove-out then off",
		note: STOP,
		guideId: "brakes.absLamps"
	});
	const airbag = draft.cabin?.airbagLamp;
	if (airbag === "stay-on" || airbag === "intermittent") push({
		id: "airbag.lamp",
		label: "Airbag lamp",
		measured: airbag,
		range: "factory: prove-out then off",
		note: STOP,
		guideId: "cabin.airbag"
	});
	const inches = parseInches$1(draft.brakes?.pedalHeight?.measured);
	if (inches != null && inches < 3.5) push({
		id: "pedalHeight",
		label: "Brake pedal below spec",
		measured: draft.brakes.pedalHeight.measured.trim(),
		range: "factory min 3.5 in remaining @ 110 lb",
		note: STOP,
		guideId: "brakes.pedalHeight"
	});
	if (draft.engine?.timingCover?.noise === "ongoing-rattle" && lowOilPressure(draft)) push({
		id: "timing.oil",
		label: "Ongoing timing-cover rattle + low oil pressure",
		measured: "ongoing rattle with low oil pressure",
		range: "factory: 1–3 sec then gone, oil pressure in the green",
		note: STOP,
		guideId: "engine.timingCover"
	});
	return gates;
}
function passBlocked(draft) {
	return driveGates(draft).length > 0;
}
function coerceOverall(draft) {
	if (!passBlocked(draft)) return;
	if (draft.result.overall === "pass" || draft.result.overall === "pass-notes") draft.result.overall = "do-not-drive";
}
function isPassValue(v) {
	return v === "pass" || v === "pass-notes";
}
function parseMiles$2(raw) {
	const t = (raw ?? "").replace(/[^\d]/g, "");
	if (!t) return null;
	const n = Number(t);
	return Number.isFinite(n) && n > 0 ? n : null;
}
var MAINT_DISCLAIMER = "Ages are from the log the owner entered, not from Nissan records.";
var MAINT_SERVICES = [
	{
		key: "oil-change",
		label: "Oil change"
	},
	{
		key: "oil-filter",
		label: "Oil filter"
	},
	{
		key: "atf",
		label: "ATF service"
	},
	{
		key: "radiator",
		label: "Radiator replaced"
	},
	{
		key: "trans-cooler",
		label: "External trans cooler added"
	},
	{
		key: "spark-plugs",
		label: "Spark plugs"
	},
	{
		key: "coolant",
		label: "Coolant flush"
	},
	{
		key: "brake-fluid",
		label: "Brake fluid"
	},
	{
		key: "front-brakes",
		label: "Front brakes"
	},
	{
		key: "rear-brakes",
		label: "Rear brakes"
	},
	{
		key: "diff",
		label: "Diff fluid"
	},
	{
		key: "tcase",
		label: "Transfer-case fluid"
	},
	{
		key: "timing",
		label: "Timing chain / cover work"
	},
	{
		key: "battery",
		label: "Battery"
	},
	{
		key: "tires",
		label: "Tires"
	},
	{
		key: "alignment",
		label: "Alignment"
	},
	{
		key: "other",
		label: "Other"
	}
];
var NO_VIN_KEY = "no-vin";
function emptyMaint() {
	return { trucks: { [NO_VIN_KEY]: [] } };
}
function truckKey(vin) {
	const v = (vin ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
	return v.length === 17 ? v : NO_VIN_KEY;
}
function rowsForVin(state, vin) {
	if (!state?.trucks) return [];
	const key = truckKey(vin);
	return state.trucks[key] ?? (key === "no-vin" ? [] : state.trucks["no-vin"] ?? []);
}
function emptyMaintRow(over = {}) {
	return {
		id: over.id ?? (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `m-${Date.now()}`),
		service: over.service ?? "oil-change",
		custom: over.custom ?? "",
		miles: over.miles ?? "",
		date: over.date ?? "",
		notes: over.notes ?? "",
		photo: over.photo
	};
}
function serviceLabel(row) {
	if (row.service === "other" && row.custom.trim()) return row.custom.trim();
	const hit = MAINT_SERVICES.find((s) => s.key === row.service);
	if (row.custom.trim() && row.service !== "other") return `${hit?.label ?? row.service} — ${row.custom.trim()}`;
	return hit?.label ?? row.service;
}
var MONTHS = {
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
	december: 12
};
/** Accepts YYYY, YYYY-MM, YYYY-MM-DD, "Aug 2026". Empty → null. */
function parseMaintDate(raw) {
	const t = raw.trim();
	if (!t || t === "—" || /^unknown$/i.test(t)) return null;
	const iso = t.match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/);
	if (iso) {
		const y = Number(iso[1]);
		const m = iso[2] ? Number(iso[2]) : 1;
		const d = iso[3] ? Number(iso[3]) : 1;
		if (y < 1990 || y > 2100 || m < 1 || m > 12) return null;
		return {
			y,
			m,
			d
		};
	}
	const named = t.match(/^([A-Za-z]+)\s+(\d{4})$/);
	if (named) {
		const m = MONTHS[named[1].toLowerCase()];
		const y = Number(named[2]);
		if (!m || y < 1990) return null;
		return {
			y,
			m,
			d: 1
		};
	}
	return null;
}
function formatMaintDate(raw) {
	const p = parseMaintDate(raw);
	if (!p) return raw.trim() ? raw.trim() : "—";
	const t = raw.trim();
	if (/^\d{4}$/.test(t)) return t;
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];
	if (/^\d{4}-\d{1,2}$/.test(t) || /^[A-Za-z]+\s+\d{4}$/.test(t)) return `${months[p.m - 1]} ${p.y}`;
	return `${months[p.m - 1]} ${p.d}, ${p.y}`;
}
function monthsSince(raw, now = /* @__PURE__ */ new Date()) {
	const p = parseMaintDate(raw);
	if (!p) return null;
	return (now.getFullYear() - p.y) * 12 + (now.getMonth() + 1 - p.m);
}
function timeAgoLabel(raw, now = /* @__PURE__ */ new Date()) {
	const months = monthsSince(raw, now);
	if (months == null) return "";
	if (months <= 0) return "this month";
	if (months === 1) return "~1 month ago";
	if (months < 18) return `~${months} months ago`;
	const years = Math.round(months / 12);
	return years === 1 ? "~1 year ago" : `~${years} years ago`;
}
function ageOf(row, currentMiles, now = /* @__PURE__ */ new Date()) {
	const svc = parseMiles$2(row.miles);
	if (svc != null && currentMiles != null) {
		const delta = currentMiles - svc;
		if (delta < 0) return {
			miles: delta,
			label: "ahead of current miles"
		};
		return {
			miles: delta,
			label: `${delta.toLocaleString("en-US")} mi ago`
		};
	}
	if (row.date.trim()) {
		const t = timeAgoLabel(row.date, now);
		if (t) return {
			miles: null,
			label: t
		};
	}
	return {
		miles: null,
		label: "Unknown"
	};
}
function rankRow(a, b) {
	const am = parseMiles$2(a.miles) ?? -1;
	const bm = parseMiles$2(b.miles) ?? -1;
	if (am !== bm) return bm - am;
	const ad = parseMaintDate(a.date);
	const bd = parseMaintDate(b.date);
	const as = ad ? ad.y * 1e4 + ad.m * 100 + ad.d : 0;
	return (bd ? bd.y * 1e4 + bd.m * 100 + bd.d : 0) - as;
}
function lastService(rows, keys) {
	return rows.filter((r) => keys.includes(r.service)).sort(rankRow)[0] ?? null;
}
function hasService(rows, keys) {
	return rows.some((r) => keys.includes(r.service));
}
function unknownOrMissing(rows, keys) {
	if (!hasService(rows, keys)) return true;
	const row = lastService(rows, keys);
	if (!row) return true;
	return parseMiles$2(row.miles) == null && !row.date.trim();
}
function historyLasts(rows) {
	const oilRow = lastService(rows, ["oil-change", "oil-filter"]);
	const atfRow = lastService(rows, ["atf"]);
	const radRow = lastService(rows, ["radiator"]);
	const coolRow = lastService(rows, ["trans-cooler"]);
	const sparkRow = lastService(rows, ["spark-plugs"]);
	const coolantRow = lastService(rows, ["coolant"]);
	const brakeRow = lastService(rows, ["brake-fluid"]);
	const diffRow = lastService(rows, ["diff", "tcase"]);
	return {
		oil: parseMiles$2(oilRow?.miles),
		atf: parseMiles$2(atfRow?.miles),
		radiator: parseMiles$2(radRow?.miles),
		cooler: parseMiles$2(coolRow?.miles),
		spark: parseMiles$2(sparkRow?.miles),
		coolant: parseMiles$2(coolantRow?.miles),
		brakeFluid: parseMiles$2(brakeRow?.miles),
		diff: parseMiles$2(diffRow?.miles),
		radiatorUnknown: unknownOrMissing(rows, ["radiator"]),
		coolerUnknown: unknownOrMissing(rows, ["trans-cooler"]),
		sparkUnknown: unknownOrMissing(rows, ["spark-plugs"]) || Boolean(sparkRow) && parseMiles$2(sparkRow?.miles) == null,
		oilUnknown: !oilRow || parseMiles$2(oilRow.miles) == null,
		atfUnknown: unknownOrMissing(rows, ["atf"]) || Boolean(atfRow) && parseMiles$2(atfRow?.miles) == null,
		coolantUnknown: unknownOrMissing(rows, ["coolant"]) || Boolean(coolantRow) && parseMiles$2(coolantRow?.miles) == null,
		brakeUnknown: unknownOrMissing(rows, ["brake-fluid"]) || Boolean(brakeRow) && parseMiles$2(brakeRow?.miles) == null
	};
}
function milesOverdue(current, last, interval) {
	if (last == null || current <= 0) return false;
	if (last > current) return false;
	return current - last >= interval;
}
function maintFlags(rows, currentMiles, tow, now = /* @__PURE__ */ new Date(), fallback = {}) {
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
	const oilInt = tow ? 3500 : 5e3;
	const atfInt = tow ? 15e3 : 3e4;
	const out = [];
	if (h.radiatorUnknown || h.coolerUnknown) out.push({
		key: "smod-history",
		tone: "alert",
		text: "Radiator replacement history unknown — SMOD inspection recommended.",
		guideId: "result.smodPlan"
	});
	if (currentMiles >= 105e3 && (h.sparkUnknown || milesOverdue(currentMiles, h.spark, 105e3))) {
		const n = h.spark != null && currentMiles >= h.spark ? currentMiles - h.spark : null;
		out.push({
			key: "spark",
			tone: "watch",
			text: n != null ? `Spark plugs are approximately ${n.toLocaleString("en-US")} miles old — inspect / plan replacement.` : "Spark plugs are undocumented at this mileage — inspect / plan replacement.",
			guideId: "baseline.sparkPlugs"
		});
	}
	if (currentMiles > 0 && (h.oilUnknown || milesOverdue(currentMiles, h.oil, oilInt))) out.push({
		key: "oil",
		tone: "watch",
		text: h.oilUnknown ? `Oil-change history unknown — recommend an oil change (~${oilInt.toLocaleString("en-US")} mi${tow ? ", tow package" : ""}).` : `Oil is about ${(currentMiles - (h.oil ?? 0)).toLocaleString("en-US")} miles old — recommend an oil-change visit.`,
		guideId: "fluids.oilLevel"
	});
	if (currentMiles > 0 && (h.atfUnknown || milesOverdue(currentMiles, h.atf, atfInt))) out.push({
		key: "atf",
		tone: "watch",
		text: "ATF service unknown or overdue — transmission service review and HOT ATF check.",
		guideId: "fluids.atf"
	});
	const coolantRow = lastService(rows, ["coolant"]);
	const coolantOldDate = coolantRow ? (monthsSince(coolantRow.date, now) ?? 0) >= 24 : false;
	if (currentMiles > 0 && (h.coolantUnknown || milesOverdue(currentMiles, h.coolant, 3e4) || coolantOldDate)) out.push({
		key: "coolant",
		tone: "watch",
		text: "Coolant service unknown or older than 30,000 miles / 2 years — inspect coolant.",
		guideId: "fluids.coolant"
	});
	const brakeRow = lastService(rows, ["brake-fluid"]);
	const brakeOldDate = brakeRow ? (monthsSince(brakeRow.date, now) ?? 0) >= 24 : false;
	if (currentMiles > 0 && (h.brakeUnknown || milesOverdue(currentMiles, h.brakeFluid, 3e4) || brakeOldDate)) out.push({
		key: "brake-fluid",
		tone: "watch",
		text: "Brake fluid unknown or older than 30,000 miles / 2 years — inspect / flush.",
		guideId: "fluids.brake"
	});
	return out;
}
function rekeyMaint(state, fromVin, toVin) {
	const from = truckKey(fromVin);
	const to = truckKey(toVin);
	if (from === to) return state;
	const trucks = { ...state.trucks };
	const dest = trucks[to] ?? [];
	const src = trucks[from] ?? [];
	if (dest.length === 0 && src.length > 0 && to !== "no-vin" && from === "no-vin") trucks[to] = src.map((r) => ({ ...r }));
	return { trucks };
}
function patchRows(state, vin, rows) {
	const key = truckKey(vin);
	return { trucks: {
		...state.trucks,
		[key]: rows
	} };
}
function alreadyLogged(rows, service, miles) {
	const m = parseMiles$2(miles);
	return rows.some((r) => r.service === service && parseMiles$2(r.miles) === m && m != null);
}
var OIL_INTERVAL = 5e3;
var OIL_TOW = 3500;
var MULTI_INTERVAL = 15e3;
var POWER_INTERVAL = 3e4;
var HIGH_MILES = 2e5;
function parseMiles$1(raw) {
	const t = (raw ?? "").replace(/[^\d]/g, "");
	if (!t) return null;
	const n = Number(t);
	return Number.isFinite(n) && n > 0 ? n : null;
}
/** Last service known: miles since last. Unknown: current miles vs the interval (safer). */
function intervalTone(current, last, interval, unknownFallback) {
	if (current <= 0) return "skip";
	if (last != null && last > current) return "skip";
	if (last != null && last >= 0) {
		const delta = current - last;
		if (delta >= interval) return "due";
		if (delta >= interval * .85) return "watch";
		return "skip";
	}
	if (current >= interval) return unknownFallback === "watch" ? "watch" : "due";
	if (current >= interval * .85) return "watch";
	return unknownFallback;
}
function flagsFromPlan(p) {
	return {
		oilService: p.oilService,
		multiPoint: p.multiPoint,
		powertrain: p.powertrain,
		cooling: p.cooling,
		highMiles: p.highMiles,
		sparkPlugs: p.sparkPlugs,
		coolantService: p.coolantService,
		brakeFluidService: p.brakeFluidService
	};
}
function pickLast(logMiles, headerMiles) {
	if (logMiles != null) return logMiles;
	return parseMiles$1(headerMiles);
}
function buildPlan(draft, log = []) {
	const miles = parseMiles$1(draft.header.miles) ?? 0;
	const hist = historyLasts(log);
	const lastOil = pickLast(hist.oil, draft.header.lastOilMi);
	const lastAtf = pickLast(hist.atf, draft.header.lastAtfMi);
	const lastRad = pickLast(hist.radiator, draft.header.lastRadiatorMi);
	const lastBrake = pickLast(hist.brakeFluid, draft.header.lastBrakeMi);
	const lastDiff = pickLast(hist.diff, draft.header.lastDiffMi);
	const logEmpty = log.length === 0;
	const unknownHistory = lastOil == null && lastAtf == null && lastRad == null && lastBrake == null && lastDiff == null;
	const tow = draft.header.towPkg === "Y";
	const oilInt = tow ? OIL_TOW : OIL_INTERVAL;
	const flags = miles > 0 ? maintFlags(log, miles, tow, void 0, {
		oil: lastOil,
		atf: lastAtf,
		radiator: lastRad
	}) : [];
	const flagKeys = new Set(flags.map((f) => f.key));
	const oilTone = flagKeys.has("oil") ? "due" : lastOil != null ? intervalTone(miles, lastOil, oilInt, "due") : logEmpty ? miles > 0 ? "due" : "skip" : miles > 0 ? "due" : "skip";
	const multiTone = intervalTone(miles, lastBrake, MULTI_INTERVAL, miles >= MULTI_INTERVAL ? "due" : "skip");
	let powerTone = flagKeys.has("atf") ? "watch" : intervalTone(miles, lastAtf ?? lastDiff, POWER_INTERVAL, miles >= POWER_INTERVAL ? "watch" : "skip");
	if (tow && miles > 0 && powerTone === "skip") powerTone = "watch";
	const atfColor = draft.fluids.atf.color;
	const atfNotRed = atfColor === "brown" || atfColor === "pink" || atfColor === "milky";
	const atfBad = atfColor === "pink" || atfColor === "milky" || draft.fluids.atf.smell === "sweet";
	const wetFit = draft.engine.atfLines.wetFittings === "Y";
	const radUnknown = hist.radiatorUnknown && lastRad == null && (draft.result.smodPlan.radiatorLast === "" || draft.result.smodPlan.radiatorLast === "original");
	let coolTone = "skip";
	if (flagKeys.has("smod-history") || atfBad || wetFit || atfNotRed) coolTone = "due";
	else if (flagKeys.has("coolant")) coolTone = "watch";
	else if (radUnknown && miles >= POWER_INTERVAL) coolTone = "watch";
	else if (lastRad != null) coolTone = intervalTone(miles, lastRad, POWER_INTERVAL, "watch");
	const highMiles = miles >= HIGH_MILES;
	const sparkFromLog = flagKeys.has("spark");
	const sparkPlugs = sparkFromLog || highMiles && hist.sparkUnknown;
	const coolantService = flagKeys.has("coolant") || highMiles;
	const brakeFluidService = flagKeys.has("brake-fluid") || highMiles;
	const sparkTone = sparkPlugs ? "watch" : "skip";
	const oilService = oilTone === "due" || oilTone === "watch";
	const multiPoint = multiTone === "due" || multiTone === "watch";
	const powertrain = powerTone === "due" || powerTone === "watch";
	const cooling = coolTone === "due" || coolTone === "watch" || atfBad || wetFit || flagKeys.has("smod-history");
	const atfHot = powertrain || highMiles || flagKeys.has("atf");
	const lines = [
		{
			key: "fluids",
			label: "Oil and fluids inspection",
			tone: miles > 0 ? "due" : "skip",
			note: oilService ? `Oil change is due (~${oilInt.toLocaleString("en-US")} mi${tow ? ", tow package" : ""}). Record type, amount, filter — not a dipstick after the drain.` : "Coolant, brake fluid, ATF color/smell, cooler fittings, leaks.",
			guideId: "fluids.oilLevel"
		},
		{
			key: "brakes",
			label: "Brakes",
			tone: multiPoint ? multiTone === "watch" ? "watch" : "due" : "skip",
			note: "Pads, inner shoulder, a real stop.",
			guideId: "brakes.pads"
		},
		{
			key: "tires",
			label: "Tires / suspension glance",
			tone: miles > 0 ? "due" : "skip",
			note: "Pressures, tread, a look at the inner shoulder.",
			guideId: "brakes.tread"
		},
		{
			key: "trans",
			label: "Transmission service review (RE5R05A + in-radiator cooler)",
			tone: powertrain ? powerTone === "due" ? "due" : "watch" : "skip",
			note: "ATF (automatic transmission fluid) HOT read and cooler fittings. This gearbox shares a cooler inside the radiator.",
			guideId: "engine.atfLines"
		},
		{
			key: "cooling",
			label: "Cooling system / SMOD check",
			tone: cooling ? coolTone === "due" ? "due" : "watch" : "skip",
			note: "SMOD is strawberry milkshake of death — coolant mixed into the transmission. Pink, milky, or sweet ATF is an emergency.",
			guideId: "result.smodPlan"
		},
		{
			key: "spark",
			label: "105k spark-plug interval",
			tone: sparkTone,
			note: sparkTone === "skip" ? "Not due this visit unless never documented." : sparkFromLog ? flags.find((f) => f.key === "spark")?.text : "Iridium interval is 105,000 miles. At this mileage they are undocumented — treat as unknown.",
			guideId: "baseline.sparkPlugs"
		}
	];
	if (highMiles) lines.push({
		key: "high",
		label: "High-miles powertrain listen and rust",
		tone: "due",
		note: "Timing-cover rattle window, manifolds, frame/rust, coolant age, brake-fluid service, full shift table.",
		guideId: "engine.timingCover"
	});
	else if (miles > 0) lines.push({
		key: "high",
		label: "Timing-cover / 270k baseline set",
		tone: "skip",
		note: "Not the 270k baseline. That set starts at 200k or when you force Baseline."
	});
	return {
		miles,
		unknownHistory,
		oilService,
		multiPoint,
		powertrain,
		cooling,
		highMiles,
		sparkPlugs,
		coolantService,
		brakeFluidService,
		atfHot,
		flags,
		lines: miles > 0 ? lines : []
	};
}
function atfHotRequired(draft, log = []) {
	const v = draft.header.visitType;
	if (v === "oil-change") return false;
	if (v === "15k" || v === "30k" || v === "baseline-270k") return true;
	if (v === "recommended") {
		if (draft.header.plan) return draft.header.plan.powertrain || draft.header.plan.highMiles;
		return buildPlan(draft, log).atfHot;
	}
	return false;
}
function oilChangeMode(draft, log = []) {
	if (draft.header.visitType === "oil-change") return true;
	if (draft.header.visitType === "recommended") {
		if (draft.header.plan) return draft.header.plan.oilService;
		return buildPlan(draft, log).oilService;
	}
	return false;
}
function recStamp(plan) {
	if (!plan.miles) return "";
	return `Inspection set from mileage ${plan.miles.toLocaleString("en-US")}`;
}
var REVIEW$1 = "Needs another look or a technician review.";
function parseMiles(raw) {
	const digits = raw.replace(/[^\d]/g, "");
	if (!digits) return null;
	const n = Number(digits);
	return Number.isFinite(n) ? n : null;
}
function parsePadMm(raw) {
	const t = raw.trim().replace(",", ".");
	if (!t) return null;
	const m = t.match(/-?\d+(?:\.\d+)?/);
	if (!m) return null;
	const n = Number(m[0]);
	return Number.isFinite(n) ? n : null;
}
function parseTread32$1(raw) {
	const t = raw.trim();
	if (!t) return null;
	const frac = t.match(/(\d+(?:\.\d+)?)\s*\/\s*32/i);
	if (frac) return Number(frac[1]);
	const n = parsePadMm(t);
	if (n == null) return null;
	if (/\bmm\b/i.test(t)) return n / 25.4 * 32;
	return n;
}
function vinOk(a, b) {
	const x = a.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
	const y = b.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
	if (x.length === 17 && y.length === 17) return x === y;
	return true;
}
function hasWearNumbers(d) {
	const pads = d.brakes?.pads;
	const tread = d.brakes?.tread;
	if (pads && CORNERS.some((c) => parsePadMm(pads[c.key] ?? "") != null)) return true;
	if (tread && CORNERS.some((c) => parseTread32$1(tread[c.key] ?? "") != null)) return true;
	return false;
}
function wearHistory(lastSubmitted, archive) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const d of [lastSubmitted, ...archive]) {
		if (!d?.id || seen.has(d.id)) continue;
		seen.add(d.id);
		out.push(d);
	}
	return out;
}
/** Most recent earlier visit with pad or tread numbers. Same VIN when both are complete. */
function priorWearVisit(current, history) {
	const curMiles = parseMiles(current.header.miles);
	const candidates = history.filter((h) => h.id !== current.id && vinOk(current.header.vin, h.header.vin) && hasWearNumbers(h));
	if (curMiles != null) {
		const earlier = candidates.map((h) => ({
			h,
			miles: parseMiles(h.header.miles)
		})).filter((x) => x.miles != null && x.miles < curMiles).sort((a, b) => b.miles - a.miles);
		if (earlier[0]) return earlier[0].h;
	}
	return [...candidates].sort((a, b) => {
		const da = a.header.date || "";
		const db = b.header.date || "";
		if (da !== db) return db.localeCompare(da);
		return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
	})[0] ?? null;
}
function corners(keys, lastRaw, nowRaw, parse) {
	return keys.map((c) => {
		const lr = lastRaw(c.key);
		const nr = nowRaw(c.key);
		const last = parse(lr);
		const now = parse(nr);
		const lost = last != null && now != null ? round1(last - now) : null;
		return {
			key: c.key,
			label: c.label,
			last,
			now,
			lost,
			lastRaw: lr.trim(),
			nowRaw: nr.trim()
		};
	});
}
function round1(n) {
	return Math.round(n * 10) / 10;
}
function wearCompare(current, prior) {
	const nowMi = parseMiles(current.header.miles);
	const lastMi = parseMiles(prior.header.miles);
	const milesBetween = nowMi != null && lastMi != null ? nowMi - lastMi : null;
	return {
		priorDate: prior.header.date,
		priorMiles: prior.header.miles,
		milesBetween,
		pads: corners(CORNERS, (k) => prior.brakes?.pads?.[k] ?? "", (k) => current.brakes?.pads?.[k] ?? "", parsePadMm),
		tread: corners(CORNERS_SPARE, (k) => prior.brakes?.tread?.[k] ?? (k === "spare" ? prior.brakes?.tread?.spare ?? "" : ""), (k) => current.brakes?.tread?.[k] ?? (k === "spare" ? current.brakes?.tread?.spare ?? "" : ""), parseTread32$1)
	};
}
function wearLine(c, unit, milesBetween) {
	if (c.last == null && c.now == null) return `${c.label}: —`;
	const last = c.last == null ? "—" : `${c.last}${unit}`;
	const now = c.now == null ? "—" : `${c.now}${unit}`;
	if (c.lost == null) return `${c.label}: ${last} → ${now}`;
	const sign = c.lost > 0 ? "−" : c.lost < 0 ? "+" : "";
	const mag = Math.abs(c.lost);
	let rate = "";
	if (c.lost > 0 && milesBetween != null && milesBetween >= 500) rate = ` · ${(c.lost / milesBetween * 1e3).toFixed(2)}${unit}/1k mi`;
	return `${c.label}: ${last} → ${now} (${sign}${mag}${unit})${rate}`;
}
var AXLES = [{
	name: "front",
	left: "lf",
	right: "rf"
}, {
	name: "rear",
	left: "lr",
	right: "rr"
}];
function wearFlags(compare) {
	const flags = [];
	const miles = compare.milesBetween;
	if (miles == null || miles < 1e3) return flags;
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
		const ratio = slowLost >= .4 ? fastLost / slowLost : Infinity;
		if (diff >= 1 || slowLost >= .4 && ratio >= 2) flags.push({
			id: `wear.pad.${axle.name}`,
			label: `${axle.name[0].toUpperCase()}${axle.name.slice(1)} pad wear`,
			measured: `${fast.label} lost ${fastLost} mm vs ${slow.label} ${slowLost} mm in ${mi} mi`,
			range: "axle pair should wear together",
			note: "Sticking caliper / slide pin until proven otherwise. Catch it before the rotor is scrap.",
			guideId: "brakes.pads"
		});
	}
	for (const c of compare.pads) {
		if (c.lost == null || c.lost <= 0 || c.now == null || c.now <= 3) continue;
		const rate = c.lost / miles;
		const to3 = (c.now - 3) / rate;
		if (to3 < 15e3) flags.push({
			id: `wear.pad.life.${c.key}`,
			label: `${c.label} pad remaining`,
			measured: `${c.now} mm, ~${Math.round(to3).toLocaleString("en-US")} mi to 3.0 mm`,
			range: "schedule before the next 15k",
			note: REVIEW$1,
			guideId: "brakes.pads"
		});
	}
	for (const axle of AXLES) {
		const L = compare.tread.find((c) => c.key === axle.left);
		const R = compare.tread.find((c) => c.key === axle.right);
		if (!L || !R || L.lost == null || R.lost == null) continue;
		if (L.lost < 0 || R.lost < 0) continue;
		const lLost = L.lost;
		const rLost = R.lost;
		if (Math.abs(lLost - rLost) >= 2) {
			const fast = lLost >= rLost ? L : R;
			const slow = lLost >= rLost ? R : L;
			const fastLost = lLost >= rLost ? lLost : rLost;
			const slowLost = lLost >= rLost ? rLost : lLost;
			flags.push({
				id: `wear.tread.${axle.name}`,
				label: `${axle.name[0].toUpperCase()}${axle.name.slice(1)} tread wear`,
				measured: `${fast.label} lost ${fastLost}/32 vs ${slow.label} ${slowLost}/32 in ${mi} mi`,
				range: "axle pair should wear together",
				note: "Alignment or UCA until proven otherwise. Catch it before the inner shoulder is gone.",
				guideId: "brakes.tread"
			});
		}
	}
	return flags;
}
function wearStamp(compare) {
	const mi = compare.milesBetween != null ? `${compare.milesBetween.toLocaleString("en-US")} mi` : "miles unknown";
	const date = compare.priorDate || "prior visit";
	const miles = compare.priorMiles.replace(/[^\d]/g, "");
	return `vs last · ${mi} ago (${date} @ ${miles ? Number(miles).toLocaleString("en-US") : "—"} mi)`;
}
var REVIEW = "Needs another look or a technician review.";
function parseNum$1(raw) {
	const t = raw.trim().replace(",", ".");
	if (!t) return null;
	const m = t.match(/-?\d+(?:\.\d+)?/);
	if (!m) return null;
	const n = Number(m[0]);
	return Number.isFinite(n) ? n : null;
}
function parseInches(raw) {
	const t = raw.trim().toLowerCase();
	if (!t) return null;
	const n = parseNum$1(t);
	if (n == null) return null;
	if (/\bmm\b/.test(t)) return n / 25.4;
	return n;
}
function parseTread32(raw) {
	const t = raw.trim();
	if (!t) return null;
	const frac = t.match(/(\d+(?:\.\d+)?)\s*\/\s*32/i);
	if (frac) return Number(frac[1]);
	const n = parseNum$1(t);
	if (n == null) return null;
	if (/\bmm\b/i.test(t)) return n / 25.4 * 32;
	return n;
}
function parseDotYears(raw, asOf) {
	const t = raw.trim();
	if (!t) return null;
	const yrOnly = t.match(/\b((?:19|20)\d{2})\b/);
	const weekYear = t.match(/\b(\d{1,2})\s*[/\- ]\s*(\d{2})\b/);
	const digits = t.replace(/\D/g, "");
	const asYears = t.match(/(\d+(?:\.\d+)?)\s*(?:yr|yrs|year)/i);
	if (asYears) return Number(asYears[1]);
	let week = 1;
	let year = null;
	if (digits.length === 4 && Number(digits.slice(0, 2)) >= 1 && Number(digits.slice(0, 2)) <= 53) {
		week = Number(digits.slice(0, 2));
		const yy = Number(digits.slice(2, 4));
		year = yy >= 90 ? 1900 + yy : 2e3 + yy;
	} else if (weekYear) {
		week = Number(weekYear[1]);
		const yy = Number(weekYear[2]);
		year = yy >= 90 ? 1900 + yy : 2e3 + yy;
	} else if (yrOnly) year = Number(yrOnly[1]);
	if (year == null) return null;
	const made = new Date(year, 0, 1 + (week - 1) * 7);
	const years = (asOf.getTime() - made.getTime()) / 315576e5;
	return Number.isFinite(years) ? years : null;
}
function asOfDate(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	if (y && m && d) return new Date(y, m - 1, d);
	return /* @__PURE__ */ new Date();
}
function parseFreezeF(raw, bareOk = false) {
	const t = raw.trim();
	if (!t) return null;
	if (!bareOk && !/[fF°]|freeze|protect/.test(t)) return null;
	return parseNum$1(t);
}
var TRANS_FAIL$1 = /* @__PURE__ */ new Set([
	"Delay",
	"Bang",
	"Flare",
	"Harsh",
	"Miss",
	"Hunt",
	"Shudder",
	"Slip",
	"Late",
	"Binds",
	"No"
]);
/**
* Factory windows from the 2005 Armada how-to + FSM SDS for rear rotors.
* Entered values and fail picks hit the header even if that row is hidden on this visit.
*/
function outOfRangeFlags(draft, photos = {}, history = []) {
	const flags = [];
	const push = (f) => flags.push(f);
	const atf = draft.fluids.atf;
	if (atf.inRange === "N") push({
		id: "atf.inRange",
		label: "ATF HOT level",
		measured: "not in HOT range",
		range: "factory HOT marks at ~149°F",
		note: REVIEW,
		guideId: "fluids.atf"
	});
	if (atf.color === "pink" || atf.color === "milky") push({
		id: "atf.color",
		label: "ATF color",
		measured: atf.color,
		range: "factory red/amber — not pink or milky",
		note: "Coolant in the ATF (SMOD). Do not drive it. Technician review.",
		guideId: "fluids.atf"
	});
	if (atf.smell === "sweet" || atf.smell === "burnt") push({
		id: "atf.smell",
		label: "ATF smell",
		measured: atf.smell,
		range: "factory: smells like ATF, not sweet or burnt",
		note: atf.smell === "sweet" ? "Sweet is SMOD. Do not drive it. Technician review." : REVIEW,
		guideId: "fluids.atf"
	});
	if (draft.trans?.atfReject) push({
		id: "trans.atfReject",
		label: "ATF reject",
		measured: "reject checked",
		range: "factory: red/amber ATF, no coolant mix",
		note: "SMOD reject. Do not drive it. Technician review.",
		guideId: "trans.atfReject"
	});
	if (draft.engine.atfLines?.wetFittings === "Y") push({
		id: "atfLines.wet",
		label: "ATF cooler fittings",
		measured: "wet",
		range: "factory: dry fittings at the radiator",
		note: "Wet cooler fittings are a mix path. Technician review.",
		guideId: "engine.atfLines"
	});
	const cool = draft.fluids.coolant ?? {
		levelColor: "",
		capSeated: "",
		freezeF: ""
	};
	const freeze = parseFreezeF(cool.freezeF, true) ?? parseFreezeF(cool.levelColor);
	if (freeze != null && freeze > -34) push({
		id: "coolant.freeze",
		label: "Coolant freeze point",
		measured: `${freeze}°F`,
		range: "factory spec −34°F",
		note: REVIEW,
		guideId: "fluids.coolant"
	});
	if (/\b(oily|oil film|milky|rust|rusty|empty|below\s*min|strawberry|red tint)\b/i.test(cool.levelColor)) push({
		id: "coolant.level",
		label: "Coolant level / strength",
		measured: cool.levelColor.trim(),
		range: "factory: MIN–MAX, 50/50 Nissan LL, no oil film",
		note: REVIEW,
		guideId: "fluids.coolant"
	});
	if (cool.capSeated === "N") push({
		id: "coolant.cap",
		label: "Coolant cap",
		measured: "not seated",
		range: "factory: reservoir cap seated",
		note: REVIEW,
		guideId: "fluids.coolant"
	});
	const psfColor = draft.fluids.psf?.color?.trim() ?? "";
	if (/\b(black|burnt|brown|dark|dirty)\b/i.test(psfColor)) push({
		id: "psf.color",
		label: "PSF color",
		measured: psfColor,
		range: "factory red/amber, not black or burnt",
		note: REVIEW,
		guideId: "fluids.psf"
	});
	if (draft.fluids.brake?.color === "dark") push({
		id: "brake.color",
		label: "Brake-fluid color",
		measured: "dark",
		range: "factory light honey / pale yellow (DOT 3)",
		note: REVIEW,
		guideId: "fluids.brake"
	});
	if (draft.fluids.brake?.moisture === "high") push({
		id: "brake.moisture",
		label: "Brake-fluid moisture",
		measured: "high",
		range: "factory: dry DOT 3 from a sealed bottle, flush at 24 months",
		note: REVIEW,
		guideId: "fluids.brake"
	});
	if (draft.fluids.brake?.capSealed === "N") push({
		id: "brake.cap",
		label: "Brake-fluid cap",
		measured: "not sealed",
		range: "factory: cap sealed",
		note: REVIEW,
		guideId: "fluids.brake"
	});
	const sec = parseNum$1(draft.engine.timingCover.seconds);
	if (draft.engine.timingCover.noise === "ongoing-rattle" || sec != null && sec > 3) push({
		id: "timingCover.rattle",
		label: "Timing-cover rattle",
		measured: draft.engine.timingCover.noise === "ongoing-rattle" ? "ongoing rattle" : `${sec} sec`,
		range: "factory: 1–3 sec then gone",
		note: REVIEW,
		guideId: "engine.timingCover"
	});
	if (draft.engine.manifolds?.noise === "tick-l" || draft.engine.manifolds?.noise === "tick-r" || draft.engine.manifolds?.noise === "both") push({
		id: "manifolds.tick",
		label: "Exhaust manifold",
		measured: draft.engine.manifolds.noise,
		range: "factory: quiet, no tick",
		note: REVIEW,
		guideId: "engine.manifolds"
	});
	if (draft.engine.manifolds?.soot === "Y") push({
		id: "manifolds.soot",
		label: "Manifold soot",
		measured: "Y",
		range: "factory: dry flanges, no soot",
		note: REVIEW,
		guideId: "engine.manifolds"
	});
	if (draft.engine.idle?.quality === "rough" || draft.engine.idle?.cel === "on") push({
		id: "idle.fail",
		label: "Idle / CEL",
		measured: [draft.engine.idle?.quality, draft.engine.idle?.cel === "on" ? "CEL on" : ""].filter(Boolean).join(", "),
		range: "factory: smooth idle, CEL off after prove-out",
		note: REVIEW,
		guideId: "engine.idle"
	});
	if (draft.engine.belt?.condition === "cracks" || draft.engine.belt?.condition === "glaze" || draft.engine.belt?.condition === "fray") push({
		id: "belt.condition",
		label: "Serpentine belt",
		measured: draft.engine.belt.condition,
		range: "factory: no cracks, glaze, or fray",
		note: REVIEW,
		guideId: "engine.belt"
	});
	if (draft.engine.radiator?.seeping === "Y") push({
		id: "radiator.seep",
		label: "Radiator",
		measured: "seeping",
		range: "factory: dry tanks and hoses",
		note: REVIEW,
		guideId: "engine.radiator"
	});
	const rest = parseNum$1(draft.engine.battery.restV);
	if (rest != null && (rest < 12.4 || rest > 12.7)) push({
		id: "battery.restV",
		label: "Battery rest voltage",
		measured: `${rest} V`,
		range: "factory 12.4–12.7 V",
		note: rest < 12.2 ? "Below factory rest range — load test or replace." : REVIEW,
		guideId: "engine.battery"
	});
	const run = parseNum$1(draft.engine.battery.runningV);
	if (run != null && (run < 13.5 || run > 14.7)) push({
		id: "battery.runningV",
		label: "Battery running voltage",
		measured: `${run} V`,
		range: "factory 13.5–14.7 V",
		note: REVIEW,
		guideId: "engine.battery"
	});
	if (draft.engine.battery.loadTest === "fail") push({
		id: "battery.load",
		label: "Battery load test",
		measured: "fail",
		range: "factory: pass",
		note: REVIEW,
		guideId: "engine.battery"
	});
	const temp = parseNum$1(draft.engine.scan.atfTemp);
	if (temp != null && (temp < 140 || temp > 160)) push({
		id: "scan.atfTemp",
		label: "ATF scan temp",
		measured: `${temp}°F`,
		range: "factory HOT check ~149°F",
		note: REVIEW,
		guideId: "engine.scan"
	});
	for (const c of CORNERS) {
		const n = parseNum$1(draft.brakes.pads[c.key]);
		if (n == null) continue;
		if (n < 3) push({
			id: `pads.${c.key}`,
			label: `${c.label} pad thickness`,
			measured: `${n} mm`,
			range: "factory min 3.0 mm",
			note: n <= 1 ? "At or below factory repair limit 1.0 mm — replace." : REVIEW,
			guideId: "brakes.pads"
		});
	}
	const front = parseNum$1(draft.brakes.rotors.front);
	if (front != null && front <= 26) push({
		id: "rotors.front",
		label: "Front rotor thickness",
		measured: `${front} mm`,
		range: "factory min 26.0 mm (new 28.0 mm)",
		note: "At or below factory min — do not machine. Technician review.",
		guideId: "brakes.rotors"
	});
	const rear = parseNum$1(draft.brakes.rotors.rear);
	if (rear != null && rear <= 12) push({
		id: "rotors.rear",
		label: "Rear rotor thickness",
		measured: `${rear} mm`,
		range: "factory min 12.0 mm (new 14.0 mm)",
		note: "At or below FSM repair limit — do not machine. Technician review.",
		guideId: "brakes.rotors"
	});
	if (draft.brakes.hoses?.wetCaliper === "Y") push({
		id: "hoses.wet",
		label: "Brake caliper",
		measured: "wet",
		range: "factory: dry caliper, dry pad backing",
		note: "Wet caliper is a leak. Do not drive it. Technician review.",
		guideId: "brakes.hoses"
	});
	if (draft.brakes.master?.seepage === "Y" || draft.brakes.master?.pedalFirm === "N") push({
		id: "master.fail",
		label: "Master / booster",
		measured: draft.brakes.master?.seepage === "Y" ? "seepage" : "pedal not firm",
		range: "factory: dry master, firm pedal",
		note: REVIEW,
		guideId: "brakes.master"
	});
	const inches = parseInches(draft.brakes.pedalHeight.measured);
	if (inches != null && inches < 3.5) push({
		id: "pedalHeight",
		label: "Pedal remaining height",
		measured: draft.brakes.pedalHeight.measured.trim(),
		range: "factory min 3.5 in remaining @ 110 lb",
		note: REVIEW,
		guideId: "brakes.pedalHeight"
	});
	const clicks = parseNum$1(draft.brakes.parking.clicks);
	if (clicks != null && (clicks < 3 || clicks > 4)) push({
		id: "parking.clicks",
		label: "Parking brake clicks",
		measured: String(clicks),
		range: "factory 3–4 clicks @ 44 lb",
		note: REVIEW,
		guideId: "brakes.parking"
	});
	if (draft.brakes.parking.holdsGrade === "N") push({
		id: "parking.hold",
		label: "Parking brake hold",
		measured: "does not hold on grade",
		range: "factory: holds on a grade",
		note: REVIEW,
		guideId: "brakes.parking"
	});
	if (draft.brakes.absLamps?.state === "stay-on" || draft.brakes.absLamps?.state === "intermittent") push({
		id: "abs.lamps",
		label: "ABS / SLIP / VDC",
		measured: draft.brakes.absLamps.state,
		range: "factory: prove-out then off",
		note: REVIEW,
		guideId: "brakes.absLamps"
	});
	if (draft.cabin?.airbagLamp === "stay-on" || draft.cabin?.airbagLamp === "intermittent") push({
		id: "airbag.lamp",
		label: "Airbag lamp",
		measured: draft.cabin.airbagLamp,
		range: "factory: prove-out then off",
		note: "Do not drive. Pass is blocked.",
		guideId: "cabin.airbag"
	});
	if (draft.engine?.timingCover?.oilPressure === "low") push({
		id: "oil.pressure",
		label: "Oil pressure",
		measured: "low / lamp",
		range: "factory: pressure in the green, lamp off",
		note: draft.engine.timingCover.noise === "ongoing-rattle" ? "Ongoing rattle plus low oil pressure — do not drive." : REVIEW,
		guideId: "engine.timingCover"
	});
	for (const c of CORNERS_SPARE) {
		const n = parseTread32(draft.brakes.tread[c.key]);
		if (n == null) continue;
		if (n <= 2) push({
			id: `tread.${c.key}`,
			label: `${c.label} tread`,
			measured: `${n}/32 in`,
			range: "legal min 2/32 in — do not run an SUV there",
			note: REVIEW,
			guideId: "brakes.tread"
		});
	}
	const asOf = asOfDate(draft.header.date);
	for (const c of CORNERS_SPARE) {
		const years = parseDotYears(draft.brakes.tireAge[c.key], asOf);
		if (years == null) continue;
		if (years >= 6) {
			const raw = draft.brakes.tireAge[c.key].trim();
			push({
				id: `tireAge.${c.key}`,
				label: `${c.label} tire age`,
				measured: `${raw} (${years.toFixed(1)} yr)`,
				range: "factory replace at 6–7 years",
				note: REVIEW,
				guideId: "brakes.tireAge"
			});
		}
	}
	if (draft.brakes.wear?.pattern && draft.brakes.wear.pattern !== "even") push({
		id: "wear.pattern",
		label: "Tire wear pattern",
		measured: draft.brakes.wear.pattern,
		range: "factory: even wear across the face",
		note: REVIEW,
		guideId: "brakes.wear"
	});
	for (const c of CORNERS) {
		const n = parseNum$1(draft.brakes.pressures[c.key]);
		if (n == null) continue;
		if (n < 33 || n > 37) push({
			id: `pressures.${c.key}`,
			label: `${c.label} tire pressure`,
			measured: `${n} psi`,
			range: "door sticker 35 psi",
			note: n <= 28 ? "20% low vs sticker — reset cold. Technician review if it will not hold." : REVIEW,
			guideId: "brakes.pressures"
		});
	}
	if (draft.brakes.lugTorque?.rechecked === "N") push({
		id: "lug.recheck",
		label: "Lug torque recheck",
		measured: "not rechecked",
		range: "factory 98 ft-lb, recheck after 50–100 miles",
		note: REVIEW,
		guideId: "brakes.lugTorque"
	});
	if (draft.brakes.alignment?.feel === "pull-l" || draft.brakes.alignment?.feel === "pull-r" || draft.brakes.alignment?.feel === "wander") push({
		id: "alignment.feel",
		label: "Alignment feel",
		measured: draft.brakes.alignment.feel === "pull-l" ? "pull L" : draft.brakes.alignment.feel === "pull-r" ? "pull R" : "wander",
		range: "factory: tracks straight",
		note: REVIEW,
		guideId: "brakes.alignment"
	});
	for (const row of TRANS_ROWS) {
		const v = draft.trans?.rows?.[row.key];
		if (!v) continue;
		for (const side of ["cold", "hot"]) {
			const pick = v[side];
			if (TRANS_FAIL$1.has(pick)) push({
				id: `trans.${row.key}.${side}`,
				label: `${row.label} (${side})`,
				measured: pick,
				range: "factory: clean / good engagement",
				note: REVIEW,
				guideId: row.guideId
			});
		}
	}
	if (draft.result?.crushWasher === "N") push({
		id: "oil.washer",
		label: "Crush washer",
		measured: "not replaced",
		range: "factory: new crush washer every drain",
		note: REVIEW,
		guideId: "fluids.oilLevel"
	});
	const coolerPhoto = Boolean(photos["engine.atfLines"] && typeof photos["engine.atfLines"] === "object" && photos["engine.atfLines"].dataUrl);
	const prevent = rowShows("smodPlan", draft.header.visitType, draft.header.drive, draft.header.plan);
	const wet = draft.engine.atfLines?.wetFittings === "Y";
	if (!coolerPhoto && (prevent || wet)) push({
		id: "atfLines.photo",
		label: "Cooler fittings photo",
		measured: "missing",
		range: wet ? "photo required when fittings are wet" : "photo required on 30k / 270k",
		note: REVIEW,
		guideId: "engine.atfLines"
	});
	if (prevent) {
		const last = draft.result?.smodPlan?.radiatorLast ?? "";
		const yearHit = (draft.result?.smodPlan?.radiatorDate ?? "").match(/(19|20)\d{2}/);
		const years = yearHit ? asOfDate(draft.header.date).getFullYear() - Number(yearHit[0]) : null;
		const bypass = draft.engine.atfLines?.bypassDone === "Y";
		const original = last !== "replaced";
		const oldTank = years != null && years >= 10;
		if (original || oldTank || !bypass) push({
			id: "smod.plan",
			label: "SMOD prevention",
			measured: [original ? "radiator original or unknown" : oldTank ? `${years}-year radiator` : "", bypass ? "" : "in-radiator ATF cooler still in service"].filter(Boolean).join(", ") || "not written",
			range: "30k: external cooler + radiator replacement — not milky today is not a plan",
			note: "Schedule external stacked-plate cooler and radiator replacement. Red ATF today is not a maintenance plan.",
			guideId: "result.smodPlan"
		});
	}
	const b = draft.baseline;
	const baseVisit = draft.header.visitType === "baseline-270k";
	if (b) {
		const grade = (id, label, verdict, guideId) => {
			if (baseVisit && !verdict) {
				push({
					id,
					label,
					measured: "not graded",
					range: "baseline: Pass or Fail required — notes are not a grade",
					note: REVIEW,
					guideId
				});
				return false;
			}
			if (verdict === "fail") push({
				id: `${id}.fail`,
				label,
				measured: "Fail",
				range: "baseline Pass required",
				note: REVIEW,
				guideId
			});
			return true;
		};
		if (grade("baseline.sparkPlugs", "Spark plugs", b.sparkPlugs?.verdict, "baseline.sparkPlugs")) {
			const last = parseNum$1(b.sparkPlugs?.lastMiles ?? "");
			const miles = parseNum$1(draft.header.miles);
			const overdue = b.sparkPlugs?.cycle === "unknown" || last == null || miles != null && last != null && miles - last >= 105e3;
			if (baseVisit && overdue) push({
				id: "baseline.sparkPlugs.interval",
				label: "Spark plugs",
				measured: b.sparkPlugs?.cycle === "unknown" || last == null ? "last change unknown" : `${Math.round((miles ?? 0) - last).toLocaleString("en-US")} miles since last change`,
				range: "factory iridium 105,000 miles — cycle 2 or 3 at 270k",
				note: "Overdue. Notes are not a grade.",
				guideId: "baseline.sparkPlugs"
			});
		}
		grade("baseline.coolantService", "Coolant service", b.coolantService?.verdict, "baseline.coolantService");
		if (b.coolantService?.cap === "fail") push({
			id: "baseline.coolant.cap",
			label: "Radiator cap",
			measured: "Fail",
			range: "factory: cap holds system pressure",
			note: REVIEW,
			guideId: "baseline.coolantService"
		});
		if (b.coolantService?.thermostat === "fail") push({
			id: "baseline.coolant.stat",
			label: "Thermostat",
			measured: "Fail",
			range: "factory: gauge to the normal middle and stays",
			note: REVIEW,
			guideId: "baseline.coolantService"
		});
		if (b.coolantService?.pumpWeep === "Y") push({
			id: "baseline.coolant.weep",
			label: "Water-pump weep",
			measured: "wet",
			range: "factory: weep hole dry",
			note: "Wet weep = pump is done.",
			guideId: "baseline.coolantService"
		});
		if (baseVisit && !(b.coolantService?.lastService ?? "").trim() && b.coolantService?.verdict === "pass") push({
			id: "baseline.coolant.history",
			label: "Coolant service",
			measured: "last service unknown",
			range: "factory ~60,000 miles / 5 years",
			note: "Unknown at 270k is not a Pass.",
			guideId: "baseline.coolantService"
		});
		grade("baseline.brakeFluid", "Brake fluid", b.brakeFluid?.verdict, "baseline.brakeFluid");
		if (baseVisit && !(b.brakeFluid?.lastFlush ?? "").trim() && b.brakeFluid?.verdict === "pass") push({
			id: "baseline.brake.history",
			label: "Brake fluid",
			measured: "last flush unknown",
			range: "factory DOT 3, flush every 24 months",
			note: "Unknown at 270k is not a Pass.",
			guideId: "baseline.brakeFluid"
		});
		grade("baseline.diffFluid", "Diff and transfer-case fluid", b.diffFluid?.verdict, "baseline.diffFluid");
		if (b.diffFluid?.rear === "fail") push({
			id: "baseline.diff.rear",
			label: "Rear diff fill plug",
			measured: "Fail",
			range: "factory: GL-5 to the fill hole, 30k",
			note: REVIEW,
			guideId: "baseline.diffFluid"
		});
		if (draft.header.drive !== "2WD") {
			if (b.diffFluid?.front === "fail") push({
				id: "baseline.diff.front",
				label: "Front diff fill plug",
				measured: "Fail",
				range: "factory: GL-5 to the fill hole, 30k",
				note: REVIEW,
				guideId: "baseline.diffFluid"
			});
			if (b.diffFluid?.transfer === "fail") push({
				id: "baseline.diff.transfer",
				label: "Transfer-case fill plug",
				measured: "Fail",
				range: "factory: Matic D to the fill hole, 30k",
				note: REVIEW,
				guideId: "baseline.diffFluid"
			});
		}
		grade("baseline.seepage", "Oil seepage grade", b.seepage?.verdict, "baseline.seepage");
		for (const [key, label] of [
			["valveCover", "Valve-cover seepage"],
			["timingCover", "Timing-cover seepage"],
			["oilPan", "Oil-pan seepage"]
		]) {
			const g = b.seepage?.[key];
			if (g === "wet" || g === "drip") push({
				id: `baseline.seepage.${key}`,
				label,
				measured: g,
				range: "dry or dusty film only — wet/drip is a Fail",
				note: REVIEW,
				guideId: "baseline.seepage"
			});
		}
		grade("baseline.manifoldBolts", "Manifold / heat-shield bolts", b.manifoldBolts?.verdict, "baseline.manifoldBolts");
		grade("baseline.ucaJoints", "UCAs / ball joints", b.ucaJoints?.verdict, "baseline.ucaJoints");
		if (b.ucaJoints?.innerTaper === "Y") push({
			id: "baseline.uca.taper",
			label: "Inner pad / tire taper",
			measured: "inner taper",
			range: "factory: even wear — inner taper means UCAs / alignment",
			note: REVIEW,
			guideId: "baseline.ucaJoints"
		});
		grade("baseline.airShocks", "Rear load-leveling / air shocks", b.airShocks?.verdict, "baseline.airShocks");
	}
	const prior = priorWearVisit(draft, history);
	if (prior) for (const f of wearFlags(wearCompare(draft, prior))) push(f);
	return flags;
}
var STATUS_OPTIONS = [
	{
		value: "pass",
		label: "PASS"
	},
	{
		value: "monitor",
		label: "MONITOR"
	},
	{
		value: "attention",
		label: "SERVICE SOON"
	},
	{
		value: "asap",
		label: "URGENT"
	},
	{
		value: "na",
		label: "N/A"
	},
	{
		value: "unable",
		label: "UNABLE"
	}
];
var RANK = {
	na: 0,
	unable: 0,
	pass: 1,
	monitor: 2,
	attention: 3,
	asap: 4
};
var STATUS_ROW_IDS = [
	...CHECK_ROW_IDS,
	...TRANS_ROWS.map((r) => `trans.${r.key}`),
	"atfReject"
];
var STATUS_ROW_LABELS = {
	oilLevel: "Engine oil",
	oilLeak: "Engine oil leak check",
	coolant: "Coolant",
	atf: "ATF",
	psf: "Power steering fluid",
	brake: "Brake fluid",
	washer: "Washer fluid",
	transferSeep: "Transfer-case seep",
	frontDiffSeep: "Front diff seep",
	rearDiffSeep: "Rear diff seep",
	timingCover: "Timing-cover noise",
	manifolds: "Exhaust manifolds",
	idle: "Idle / CEL",
	belt: "Serpentine belt",
	radiator: "Radiator",
	atfLines: "ATF cooler lines",
	airFilter: "Air filter",
	battery: "Battery",
	grounds: "Grounds",
	pcv: "PCV",
	scan: "Scan",
	pads: "Pad thickness",
	rotors: "Rotors",
	hoses: "Brake hoses / calipers",
	master: "Master / booster",
	pedalHeight: "Pedal height",
	parking: "Parking brake",
	absLamps: "ABS / SLIP / VDC",
	tread: "Tires tread",
	tireAge: "Tire age",
	wear: "Wear pattern",
	pressures: "Tire pressures",
	lugTorque: "Lug torque",
	bearings: "Wheel bearings",
	alignment: "Alignment feel",
	"cabin.recalls": "Nissan campaigns",
	smodPlan: "SMOD prevention",
	atfReject: "ATF reject condition"
};
for (const r of TRANS_ROWS) STATUS_ROW_LABELS[`trans.${r.key}`] = r.label;
for (const r of STEERING_ITEMS) STATUS_ROW_LABELS[`steering.${r.key}`] = r.label;
for (const r of UNDERBODY_ITEMS) STATUS_ROW_LABELS[`underbody.${r.key}`] = r.label;
for (const r of CABIN_ITEMS) STATUS_ROW_LABELS[`cabin.${r.key}`] = r.label;
for (const r of ROAD_ITEMS) STATUS_ROW_LABELS[`road.${r.key}`] = r.label;
for (const r of BASELINE_ITEMS) STATUS_ROW_LABELS[`baseline.${r.key}`] = r.label;
function statusIdFromGuide(guideId) {
	if (guideId === "trans.atfReject") return "atfReject";
	if (guideId === "result.smodPlan") return "smodPlan";
	if (guideId === "result.overall") return "";
	if (guideId.startsWith("trans.")) return guideId;
	const dot = guideId.indexOf(".");
	if (dot < 0) return guideId;
	const prefix = guideId.slice(0, dot);
	const rest = guideId.slice(dot + 1);
	if (prefix === "steering" || prefix === "underbody" || prefix === "cabin" || prefix === "road" || prefix === "baseline") return guideId;
	return rest;
}
function worse(a, b) {
	return RANK[b] > RANK[a] ? b : a;
}
function parseNum(raw) {
	const t = (raw ?? "").trim().replace(",", ".");
	if (!t) return null;
	const m = t.match(/-?\d+(?:\.\d+)?/);
	if (!m) return null;
	const n = Number(m[0]);
	return Number.isFinite(n) ? n : null;
}
function filled(v) {
	if (typeof v === "string") return v.trim().length > 0;
	if (typeof v === "boolean") return v;
	return false;
}
function extrasFilled(row) {
	if (!row) return false;
	for (const [k, v] of Object.entries(row)) {
		if (k === "checked" || k === "notes" || k === "campaigns") continue;
		if (filled(v)) return true;
		if (v && typeof v === "object" && extrasFilled(v)) return true;
	}
	return false;
}
function checkish(draft, id) {
	const f = draft.fluids;
	const e = draft.engine;
	const b = draft.brakes;
	if (id in (f ?? {}) && typeof f[id] === "object") return f[id];
	if (id in (e ?? {}) && typeof e[id] === "object") return e[id];
	if (id in (b ?? {}) && typeof b[id] === "object") return b[id];
	if (id.startsWith("steering.")) return draft.steering?.items?.[id.slice(9)];
	if (id.startsWith("underbody.")) return draft.underbody?.items?.[id.slice(10)];
	if (id.startsWith("cabin.") && id !== "cabin.recalls") return draft.cabin?.items?.[id.slice(6)];
	if (id === "cabin.recalls") return draft.cabin?.recalls;
	if (id.startsWith("road.")) return draft.road?.items?.[id.slice(5)];
	if (id.startsWith("baseline.")) return draft.baseline?.[id.slice(9)];
	if (id === "smodPlan") return draft.result?.smodPlan;
}
function rowInspected(draft, id) {
	if (id === "atfReject") return Boolean(draft.trans?.atfReject) || rowInspected(draft, "atf");
	if (id.startsWith("trans.")) {
		const key = id.slice(6);
		const row = draft.trans?.rows?.[key];
		return Boolean(row && (row.cold || row.hot || row.notes.trim()));
	}
	if (id === "oilLevel" && oilChangeMode(draft)) {
		const r = draft.result;
		return Boolean(r?.oilType?.trim() || r?.oilAmount?.trim() || r?.oilFilterPn?.trim() || r?.crushWasher || draft.fluids.oilLevel.checked || draft.fluids.oilLevel.notes.trim());
	}
	const row = checkish(draft, id);
	if (!row) return false;
	if (row.checked || row.notes.trim()) return true;
	return extrasFilled(row);
}
var TRANS_FAIL = /* @__PURE__ */ new Set([
	"Delay",
	"Bang",
	"Flare",
	"Harsh",
	"Miss",
	"Hunt",
	"Shudder",
	"Slip",
	"Late",
	"Binds",
	"No"
]);
function watchStatus(draft, id) {
	let st = "pass";
	if (id === "pads") for (const c of CORNERS) {
		const n = parsePadMm(draft.brakes?.pads?.[c.key] ?? "");
		if (n == null) continue;
		if (n <= 1) st = worse(st, "asap");
		else if (n < 3) st = worse(st, "attention");
		else if (n <= 4) st = worse(st, "monitor");
	}
	if (id === "rotors") {
		const front = parseNum(draft.brakes?.rotors?.front);
		const rear = parseNum(draft.brakes?.rotors?.rear);
		if (front != null) {
			if (front <= 26) st = worse(st, "asap");
			else if (front <= 27) st = worse(st, "monitor");
		}
		if (rear != null) {
			if (rear <= 12) st = worse(st, "asap");
			else if (rear <= 13) st = worse(st, "monitor");
		}
	}
	if (id === "timingCover") {
		const n = draft.engine?.timingCover?.noise;
		const sec = parseNum(draft.engine?.timingCover?.seconds);
		const low = draft.engine?.timingCover?.oilPressure === "low";
		if (n === "ongoing-rattle" && low) st = worse(st, "asap");
		else if (n === "ongoing-rattle" || sec != null && sec > 3) st = worse(st, "attention");
		else if (n === "short-rattle" || sec != null && sec >= 1 && sec <= 3) st = worse(st, "monitor");
	}
	if (id === "atf" || id === "atfReject") {
		if (draft.fluids?.atf?.color === "pink" || draft.fluids?.atf?.color === "milky" || draft.fluids?.atf?.smell === "sweet") st = worse(st, "asap");
		else if (draft.fluids?.atf?.color === "brown" || draft.fluids?.atf?.smell === "burnt") st = worse(st, "monitor");
		if (id === "atfReject" && draft.trans?.atfReject) st = worse(st, "asap");
	}
	if (id === "battery") {
		const rest = parseNum(draft.engine?.battery?.restV);
		if (rest != null && rest < 12.2) st = worse(st, "asap");
	}
	if (id === "pedalHeight") {
		const t = (draft.brakes?.pedalHeight?.measured ?? "").trim().toLowerCase();
		const n = parseNum(t);
		if (n != null) {
			if ((/\bmm\b/.test(t) ? n / 25.4 : n) < 3.5) st = worse(st, "asap");
		}
	}
	if (id === "hoses" && draft.brakes?.hoses?.wetCaliper === "Y") st = worse(st, "asap");
	if (id === "master" && (draft.brakes?.master?.seepage === "Y" || draft.brakes?.master?.pedalFirm === "N")) st = worse(st, "asap");
	if (id === "absLamps" && (draft.brakes?.absLamps?.state === "stay-on" || draft.brakes?.absLamps?.state === "intermittent")) st = worse(st, "asap");
	if (id === "cabin.airbag" && (draft.cabin?.airbagLamp === "stay-on" || draft.cabin?.airbagLamp === "intermittent")) st = worse(st, "asap");
	if (id === "wear" && draft.brakes?.wear?.pattern && draft.brakes.wear.pattern !== "even") st = worse(st, "attention");
	if (id === "tread") {
		const vals = CORNERS.map((c) => parseTread32$1(draft.brakes?.tread?.[c.key] ?? "")).filter((n) => n != null);
		if (vals.length >= 2) {
			if (Math.max(...vals) - Math.min(...vals) >= 2) st = worse(st, "attention");
		}
	}
	if (id.startsWith("baseline.")) {
		const row = checkish(draft, id);
		if (row?.verdict === "fail") st = worse(st, "attention");
		if (id === "baseline.coolantService" && row && "pumpWeep" in row && row.pumpWeep === "Y") st = worse(st, "attention");
		const seep = draft.baseline?.seepage;
		if (id === "baseline.seepage" && seep) for (const g of [
			seep.valveCover,
			seep.timingCover,
			seep.oilPan
		]) {
			if (g === "film") st = worse(st, "monitor");
			if (g === "wet" || g === "drip") st = worse(st, "attention");
		}
	}
	if (id.startsWith("trans.")) {
		const key = id.slice(6);
		const row = draft.trans?.rows?.[key];
		if (row && (TRANS_FAIL.has(row.cold) || TRANS_FAIL.has(row.hot))) st = worse(st, "attention");
	}
	if (id === "oilLeak" && /drip|wet|puddle/i.test(draft.fluids?.oilLeak?.notes ?? "")) st = worse(st, "attention");
	if (id === "oilLevel" && draft.result?.crushWasher === "N") st = worse(st, "attention");
	return st;
}
function suggestedStatus(draft, id, flags, gates) {
	if (!rowShows(id, draft.header.visitType, draft.header.drive, draft.header.plan)) return "na";
	if (!rowInspected(draft, id)) return "na";
	let st = "pass";
	st = worse(st, watchStatus(draft, id));
	for (const g of gates) if (gateRow(g.id, g.guideId) === id) st = worse(st, "asap");
	for (const f of flags) if (gateRow(f.id, f.guideId) === id) st = worse(st, "attention");
	return st;
}
function gateRow(flagId, guideId) {
	if (flagId === "smod" || flagId.startsWith("atf.")) return flagId === "atfReject" ? "atfReject" : "atf";
	if (flagId.startsWith("pads.") || flagId.startsWith("wear.pad")) return "pads";
	if (flagId.startsWith("tread.") || flagId.startsWith("wear.tread")) return "tread";
	if (flagId.startsWith("tireAge.")) return "tireAge";
	if (flagId.startsWith("pressures.")) return "pressures";
	if (flagId.startsWith("trans.")) return `trans.${flagId.split(".")[1]}`;
	if (flagId === "timing.oil" || flagId === "timingCover.rattle" || flagId === "oil.pressure") return "timingCover";
	if (flagId === "airbag.lamp") return "cabin.airbag";
	if (flagId === "abs.lamps") return "absLamps";
	if (flagId === "oil.washer") return "oilLevel";
	return statusIdFromGuide(guideId);
}
function applyAutoStatuses(draft, photos = {}) {
	if (!draft.itemStatus) draft.itemStatus = {};
	const flags = outOfRangeFlags(draft, photos);
	const gates = driveGates(draft);
	for (const id of STATUS_ROW_IDS) {
		const shown = rowShows(id, draft.header.visitType, draft.header.drive, draft.header.plan);
		const cur = draft.itemStatus[id];
		if (!shown) {
			draft.itemStatus[id] = {
				value: "na",
				manual: false
			};
			continue;
		}
		if (cur?.manual) {
			if (cur.value === "attention" || cur.value === "asap") {
				const sug = suggestedStatus(draft, id, flags, gates);
				if (RANK[sug] > RANK[cur.value]) draft.itemStatus[id] = {
					value: sug,
					manual: true
				};
			}
			continue;
		}
		draft.itemStatus[id] = {
			value: suggestedStatus(draft, id, flags, gates),
			manual: false
		};
	}
}
function setManualStatus(draft, id, value) {
	if (!draft.itemStatus) draft.itemStatus = {};
	draft.itemStatus[id] = {
		value,
		manual: true
	};
}
function markRowInspected(draft, id) {
	const row = checkish(draft, id);
	if (row && typeof row === "object" && "checked" in row) row.checked = true;
}
function walkChoiceOf(draft, id) {
	const cur = draft.itemStatus?.[id];
	if (!cur?.manual) return "";
	return cur.value;
}
function applyWalkChoice(draft, id, choice, photos = {}) {
	markRowInspected(draft, id);
	if (choice === "na" || choice === "unable") {
		setManualStatus(draft, id, choice);
		return;
	}
	const sug = suggestedStatus(draft, id, outOfRangeFlags(draft, photos), driveGates(draft));
	if (choice === "asap") {
		setManualStatus(draft, id, "asap");
		return;
	}
	if (choice === "attention") {
		setManualStatus(draft, id, sug === "asap" ? "asap" : "attention");
		return;
	}
	if (RANK[sug] >= RANK.attention) {
		setManualStatus(draft, id, sug === "asap" ? "asap" : "attention");
		return;
	}
	setManualStatus(draft, id, choice);
}
function rowNotes(draft, id) {
	return checkish(draft, id)?.notes ?? "";
}
function setRowNotes(draft, id, notes) {
	const row = checkish(draft, id);
	if (row) row.notes = notes;
}
function rowStatus(draft, id) {
	return draft.itemStatus?.[id]?.value ?? "na";
}
function evidence(id, draft, flags, gates) {
	const g = gates.find((x) => gateRow(x.id, x.guideId) === id);
	if (g) return {
		measured: g.measured,
		range: g.range,
		guideId: g.guideId
	};
	const f = flags.find((x) => gateRow(x.id, x.guideId) === id);
	if (f) return {
		measured: f.measured,
		range: f.range,
		guideId: f.guideId
	};
	return {
		measured: "see checklist",
		range: "factory reference on the Guide",
		guideId: id.startsWith("trans.") ? id : id === "atfReject" ? "trans.atfReject" : id === "smodPlan" ? "result.smodPlan" : id.includes(".") ? id : statusGuide(id)
	};
}
function statusGuide(id) {
	const prefix = {
		oilLevel: "fluids",
		oilLeak: "fluids",
		coolant: "fluids",
		atf: "fluids",
		psf: "fluids",
		brake: "fluids",
		washer: "fluids",
		transferSeep: "fluids",
		frontDiffSeep: "fluids",
		rearDiffSeep: "fluids",
		timingCover: "engine",
		manifolds: "engine",
		idle: "engine",
		belt: "engine",
		radiator: "engine",
		atfLines: "engine",
		airFilter: "engine",
		battery: "engine",
		grounds: "engine",
		pcv: "engine",
		scan: "engine",
		pads: "brakes",
		rotors: "brakes",
		hoses: "brakes",
		master: "brakes",
		pedalHeight: "brakes",
		parking: "brakes",
		absLamps: "brakes",
		tread: "brakes",
		tireAge: "brakes",
		wear: "brakes",
		pressures: "brakes",
		lugTorque: "brakes",
		bearings: "brakes",
		alignment: "brakes"
	};
	return prefix[id] ? `${prefix[id]}.${id}` : id;
}
function conditionReport(draft, photos = {}, history = []) {
	const flags = outOfRangeFlags(draft, photos, history);
	const gates = driveGates(draft);
	const counts = {
		asap: 0,
		attention: 0,
		monitor: 0,
		pass: 0,
		na: 0
	};
	const asap = [];
	const attention = [];
	const monitor = [];
	const passed = [];
	const na = [];
	const visit = draft.header.visitType;
	const drive = draft.header.drive;
	for (const id of STATUS_ROW_IDS) {
		const label = STATUS_ROW_LABELS[id] ?? id;
		if (!rowShows(id, visit, drive, draft.header.plan)) {
			counts.na += 1;
			na.push({
				id,
				label,
				status: "na",
				measured: "not on this visit",
				range: "",
				guideId: ""
			});
			continue;
		}
		const st = rowStatus(draft, id);
		const bucket = st === "unable" ? "na" : st;
		counts[bucket] += 1;
		const ev = st === "na" || st === "unable" || st === "pass" ? {
			measured: "",
			range: "",
			guideId: ""
		} : evidence(id, draft, flags, gates);
		const item = {
			id,
			label,
			status: st === "unable" ? "na" : st,
			measured: ev.measured,
			range: ev.range,
			guideId: ev.guideId
		};
		if (st === "asap") asap.push(item);
		else if (st === "attention") attention.push(item);
		else if (st === "monitor") monitor.push(item);
		else if (st === "pass") passed.push(item);
		else na.push(item);
	}
	const scored = counts.pass + counts.monitor + counts.attention + counts.asap;
	return {
		score: Math.max(0, Math.min(100, 100 - 15 * counts.asap - 6 * counts.attention - 2 * counts.monitor)),
		counts,
		scored,
		asap,
		attention,
		monitor,
		passed,
		na
	};
}
function overallBlocked(draft) {
	if (driveGates(draft).length) return true;
	return STATUS_ROW_IDS.some((id) => rowShows(id, draft.header.visitType, draft.header.drive, draft.header.plan) && rowStatus(draft, id) === "asap");
}
function statusLine(f) {
	return `${f.label}: ${f.measured} (${f.range})`;
}
var DB_NAME$1 = "armada-inspection-photos-v1";
var STORE$1 = "photos";
var MAX_EDGE = 960;
var QUALITY = .62;
function openDb$1() {
	return new Promise((resolve, reject) => {
		if (typeof indexedDB === "undefined") {
			reject(/* @__PURE__ */ new Error("no indexedDB"));
			return;
		}
		const req = indexedDB.open(DB_NAME$1, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE$1)) db.createObjectStore(STORE$1);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
function idbKey(draftId, slot) {
	return `${draftId}:${slot}`;
}
async function compressPhoto(file) {
	let bmp;
	try {
		bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
	} catch {
		bmp = await createImageBitmap(file);
	}
	const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
	const w = Math.max(1, Math.round(bmp.width * scale));
	const h = Math.max(1, Math.round(bmp.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		bmp.close();
		throw new Error("no canvas");
	}
	ctx.drawImage(bmp, 0, 0, w, h);
	bmp.close();
	return {
		dataUrl: canvas.toDataURL("image/jpeg", QUALITY),
		w,
		h
	};
}
async function loadPhotos(draftId) {
	const out = {};
	if (!draftId) return out;
	try {
		const db = await openDb$1();
		await new Promise((resolve, reject) => {
			const req = db.transaction(STORE$1, "readonly").objectStore(STORE$1).openCursor();
			req.onsuccess = () => {
				const cursor = req.result;
				if (!cursor) {
					resolve();
					return;
				}
				const key = String(cursor.key);
				const prefix = `${draftId}:`;
				if (key.startsWith(prefix)) {
					const value = cursor.value;
					if (Array.isArray(value)) {
						const first = value[0];
						if (first?.dataUrl) out[key.slice(prefix.length)] = first;
					} else if (value?.dataUrl) out[key.slice(prefix.length)] = value;
				}
				cursor.continue();
			};
			req.onerror = () => reject(req.error);
		});
	} catch {}
	return out;
}
async function putPhoto(draftId, slot, shot) {
	try {
		const db = await openDb$1();
		await new Promise((resolve, reject) => {
			const req = db.transaction(STORE$1, "readwrite").objectStore(STORE$1).put(shot, idbKey(draftId, slot));
			req.onsuccess = () => resolve();
			req.onerror = () => reject(req.error);
		});
	} catch {}
}
async function deletePhoto(draftId, slot) {
	try {
		const db = await openDb$1();
		await new Promise((resolve, reject) => {
			const req = db.transaction(STORE$1, "readwrite").objectStore(STORE$1).delete(idbKey(draftId, slot));
			req.onsuccess = () => resolve();
			req.onerror = () => reject(req.error);
		});
	} catch {}
}
async function prunePhotos(keepDraftIds) {
	const keep = new Set(keepDraftIds.filter(Boolean));
	try {
		const db = await openDb$1();
		await new Promise((resolve, reject) => {
			const req = db.transaction(STORE$1, "readwrite").objectStore(STORE$1).openCursor();
			req.onsuccess = () => {
				const cursor = req.result;
				if (!cursor) {
					resolve();
					return;
				}
				const draftId = String(cursor.key).split(":")[0] ?? "";
				if (!keep.has(draftId)) cursor.delete();
				cursor.continue();
			};
			req.onerror = () => reject(req.error);
		});
	} catch {}
}
async function clearAllPhotos() {
	try {
		const db = await openDb$1();
		await new Promise((resolve, reject) => {
			const req = db.transaction(STORE$1, "readwrite").objectStore(STORE$1).clear();
			req.onsuccess = () => resolve();
			req.onerror = () => reject(req.error);
		});
	} catch {}
}
var DRAFT_KEY = "armada-inspection-draft-v1";
var ARCHIVE_KEY = "armada-inspection-archive-v1";
var SETTINGS_KEY = "armada-inspection-settings-v1";
var LAST_KEY = "armada-inspection-last-v1";
var LAST_SAVED_KEY = "armada-last-saved-at-v1";
var TAB_IDS = [
	"home",
	"checklist",
	"guide",
	"history",
	"reports",
	"results"
];
function readJson(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
function writeJson(key, value) {
	if (typeof window === "undefined") return false;
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch {
		return false;
	}
}
function markSaved() {
	const t = Date.now();
	if (typeof window !== "undefined") try {
		localStorage.setItem(LAST_SAVED_KEY, String(t));
	} catch {}
	return t;
}
function readSavedAt() {
	if (typeof window === "undefined") return 0;
	try {
		const n = Number(localStorage.getItem(LAST_SAVED_KEY) || "0");
		return Number.isFinite(n) && n > 0 ? n : 0;
	} catch {
		return 0;
	}
}
function persistSlice(s) {
	return {
		draft: s.draft,
		openSections: s.openSections,
		checklistMode: s.checklistMode,
		walkIndex: s.walkIndex,
		maint: s.maint,
		tab: s.tab
	};
}
function persistStorage() {
	return createJSONStorage(() => ({
		getItem: (name) => {
			try {
				return localStorage.getItem(name);
			} catch {
				return null;
			}
		},
		setItem: (name, value) => {
			try {
				localStorage.setItem(name, value);
				markSaved();
			} catch {
				const msg = "Could not save — free space or export PDF now.";
				queueMicrotask(() => {
					if (useInspection.getState().saveError !== msg) useInspection.setState({ saveError: msg });
				});
			}
		},
		removeItem: (name) => {
			try {
				localStorage.removeItem(name);
			} catch {}
		}
	}));
}
function pushArchive(current, archive) {
	if (!isDraftStarted(current)) return archive;
	return [{
		...structuredClone(current),
		updatedAt: Date.now()
	}, ...archive.filter((a) => a.id !== current.id)].slice(0, 10);
}
function hydrateDraft(raw) {
	const base = emptyDraft();
	const draft = {
		...base,
		...raw,
		header: {
			...base.header,
			...raw.header
		},
		fluids: {
			...base.fluids,
			...raw.fluids,
			coolant: {
				...base.fluids.coolant,
				...raw.fluids?.coolant
			},
			brake: {
				...base.fluids.brake,
				...raw.fluids?.brake
			}
		},
		engine: {
			...base.engine,
			...raw.engine,
			timingCover: {
				...base.engine.timingCover,
				...raw.engine?.timingCover
			},
			battery: {
				...base.engine.battery,
				...raw.engine?.battery
			}
		},
		trans: {
			...base.trans,
			...raw.trans,
			rows: {
				...base.trans.rows,
				...raw.trans?.rows
			}
		},
		brakes: {
			...base.brakes,
			...raw.brakes,
			lugTorque: {
				...base.brakes.lugTorque,
				...raw.brakes?.lugTorque
			}
		},
		steering: {
			...base.steering,
			...raw.steering,
			items: {
				...base.steering.items,
				...raw.steering?.items
			}
		},
		underbody: {
			...base.underbody,
			...raw.underbody,
			items: {
				...base.underbody.items,
				...raw.underbody?.items
			}
		},
		cabin: {
			...base.cabin,
			...raw.cabin,
			items: {
				...base.cabin.items,
				...raw.cabin?.items
			},
			airbagLamp: raw.cabin?.airbagLamp ?? base.cabin.airbagLamp,
			recalls: {
				...base.cabin.recalls,
				...raw.cabin?.recalls,
				campaigns: raw.cabin?.recalls?.campaigns ?? base.cabin.recalls.campaigns
			}
		},
		road: {
			...base.road,
			...raw.road,
			items: {
				...base.road.items,
				...raw.road?.items
			}
		},
		baseline: {
			...base.baseline,
			...raw.baseline,
			sparkPlugs: {
				...base.baseline.sparkPlugs,
				...raw.baseline?.sparkPlugs
			},
			coolantService: {
				...base.baseline.coolantService,
				...raw.baseline?.coolantService
			},
			brakeFluid: {
				...base.baseline.brakeFluid,
				...raw.baseline?.brakeFluid
			},
			diffFluid: {
				...base.baseline.diffFluid,
				...raw.baseline?.diffFluid
			},
			seepage: {
				...base.baseline.seepage,
				...raw.baseline?.seepage
			},
			manifoldBolts: {
				...base.baseline.manifoldBolts,
				...raw.baseline?.manifoldBolts
			},
			ucaJoints: {
				...base.baseline.ucaJoints,
				...raw.baseline?.ucaJoints
			},
			airShocks: {
				...base.baseline.airShocks,
				...raw.baseline?.airShocks
			}
		},
		result: {
			...base.result,
			...raw.result,
			smodPlan: {
				...base.result.smodPlan,
				...raw.result?.smodPlan
			}
		},
		oilWaitStartedAt: raw.oilWaitStartedAt ?? null,
		atfIdle: Boolean(raw.atfIdle),
		atfCycled: Boolean(raw.atfCycled),
		atfHot: Boolean(raw.atfHot),
		smodAcknowledged: Boolean(raw.smodAcknowledged),
		itemStatus: raw.itemStatus && typeof raw.itemStatus === "object" ? raw.itemStatus : {},
		photoSkip: raw.photoSkip && typeof raw.photoSkip === "object" ? raw.photoSkip : {},
		repairs: raw.repairs && typeof raw.repairs === "object" ? raw.repairs : {},
		grokScan: raw.grokScan && typeof raw.grokScan === "object" ? raw.grokScan : {}
	};
	if (draft.header.visitType === "recommended") draft.header.plan = flagsFromPlan(buildPlan(draft, []));
	return draft;
}
function applyPlan(draft, maint) {
	if (draft.header.visitType === "recommended") draft.header.plan = flagsFromPlan(buildPlan(draft, rowsForVin(maint, draft.header.vin)));
}
var useInspection = create()(persist((set, get) => ({
	hydrated: false,
	draft: emptyDraft(),
	settings: emptySettings(),
	archive: [],
	lastSubmitted: null,
	tab: "home",
	checklistMode: "walk",
	walkIndex: 0,
	homeFilter: null,
	guideTarget: null,
	guideFocus: null,
	openSections: ["header"],
	successOpen: false,
	lastEmailStatus: "idle",
	lastEmailError: "",
	headerHighlight: false,
	photoHighlight: false,
	photos: {},
	maint: emptyMaint(),
	plainId: null,
	lastSavedAt: 0,
	saveError: "",
	grokBusy: {},
	grokError: {},
	setHydrated: () => {
		const who = {
			inspector: "",
			vin: ""
		};
		if (typeof window !== "undefined") try {
			who.inspector = localStorage.getItem("armada-last-inspector-v1") || "";
			who.vin = localStorage.getItem("armada-last-vin-v1") || "";
		} catch {}
		const settingsRaw = readJson(SETTINGS_KEY, get().settings);
		const settings = {
			...settingsRaw,
			lastInspector: settingsRaw.lastInspector || who.inspector,
			lastVin: settingsRaw.lastVin || who.vin
		};
		const archive = readJson(ARCHIVE_KEY, get().archive);
		const lastSubmitted = readJson(LAST_KEY, null);
		const draftId = get().draft.id;
		const draft = structuredClone(get().draft);
		applyPlan(draft, get().maint);
		applyAutoStatuses(draft);
		const tab = get().tab;
		set({
			hydrated: true,
			settings,
			archive,
			lastSubmitted,
			draft,
			tab,
			lastSavedAt: readSavedAt()
		});
		loadPhotos(draftId).then((photos) => {
			if (get().draft.id === draftId) set({ photos });
		});
	},
	setTab: (tab) => set({ tab }),
	setChecklistMode: (mode) => set({
		checklistMode: mode,
		tab: "checklist"
	}),
	setWalkIndex: (i) => set({
		walkIndex: Math.max(0, Math.round(i)),
		lastSavedAt: markSaved()
	}),
	goHome: () => set({
		tab: "home",
		homeFilter: null,
		successOpen: false
	}),
	openWalk: (index) => set((s) => ({
		tab: "checklist",
		checklistMode: "walk",
		walkIndex: Math.max(0, Math.round(index ?? s.walkIndex)),
		homeFilter: null
	})),
	openFull: () => set({
		tab: "checklist",
		checklistMode: "full",
		homeFilter: null
	}),
	setHomeFilter: (filter) => set({ homeFilter: filter }),
	openReport: () => set({ successOpen: true }),
	openResults: () => set({
		tab: "results",
		homeFilter: null,
		successOpen: false
	}),
	jumpToGuide: (stepId) => set({
		tab: "guide",
		guideTarget: stepId,
		guideFocus: stepId,
		plainId: null
	}),
	openPlain: (id) => set({ plainId: id }),
	closePlain: () => set({ plainId: null }),
	clearGuideTarget: () => set({ guideTarget: null }),
	clearGuideFocus: () => set({
		guideFocus: null,
		guideTarget: null
	}),
	toggleSection: (id) => set((s) => ({ openSections: s.openSections.includes(id) ? s.openSections.filter((x) => x !== id) : [...s.openSections, id] })),
	ensureSectionOpen: (id) => set((s) => s.openSections.includes(id) ? s : { openSections: [...s.openSections, id] }),
	expandAll: () => set({ openSections: [...ALL_SECTION_IDS] }),
	collapseAll: () => set({ openSections: [] }),
	patch: (fn) => {
		const prevVin = get().draft.header.vin;
		const next = structuredClone(get().draft);
		fn(next);
		let maint = get().maint;
		if (next.header.vin !== prevVin) maint = rekeyMaint(maint, prevVin, next.header.vin);
		applyPlan(next, maint);
		next.updatedAt = Date.now();
		if (!isSmodRisk(next)) next.smodAcknowledged = false;
		applyAutoStatuses(next, get().photos);
		coerceOverall(next);
		if (overallBlocked(next) && isPassValue(next.result.overall)) next.result.overall = driveGates(next).length ? "do-not-drive" : "schedule";
		rememberPeople(next.header.inspector, next.header.vin);
		set({
			draft: next,
			maint,
			headerHighlight: false,
			lastSavedAt: markSaved(),
			saveError: ""
		});
	},
	setSettings: (patch) => {
		const settings = {
			...get().settings,
			...patch
		};
		writeJson(SETTINGS_KEY, settings);
		rememberPeople(settings.lastInspector, settings.lastVin);
		set({ settings });
	},
	resetDraft: () => set({
		draft: emptyDraft(),
		successOpen: false,
		photos: {},
		grokBusy: {},
		grokError: {}
	}),
	startNew: () => {
		const { draft, archive, lastSubmitted } = get();
		const nextArchive = pushArchive(draft, archive);
		writeJson(ARCHIVE_KEY, nextArchive);
		const nextDraft = emptyDraft();
		set({
			draft: nextDraft,
			archive: nextArchive,
			successOpen: false,
			openSections: ["header"],
			tab: "home",
			walkIndex: 0,
			lastEmailStatus: "idle",
			lastEmailError: "",
			photos: {},
			grokBusy: {},
			grokError: {}
		});
		prunePhotos([
			nextDraft.id,
			...nextArchive.map((a) => a.id),
			lastSubmitted?.id ?? ""
		]);
	},
	restoreArchive: (id) => {
		const found = get().archive.find((a) => a.id === id);
		if (!found) return;
		const { draft, archive } = get();
		const nextArchive = pushArchive(draft, archive.filter((a) => a.id !== id));
		writeJson(ARCHIVE_KEY, nextArchive);
		set({
			draft: hydrateDraft(found),
			archive: nextArchive,
			tab: "home",
			successOpen: false,
			photos: {}
		});
		loadPhotos(found.id).then((photos) => {
			if (get().draft.id === found.id) set({ photos });
		});
	},
	clearArchives: () => {
		writeJson(ARCHIVE_KEY, []);
		writeJson(LAST_KEY, null);
		writeJson(DRAFT_KEY, emptyDraft());
		clearAllPhotos();
		set({
			archive: [],
			lastSubmitted: null,
			draft: emptyDraft(),
			photos: {}
		});
	},
	markSubmitted: (emailStatus, err) => {
		const draft = structuredClone(get().draft);
		writeJson(LAST_KEY, draft);
		const archive = pushArchive(draft, get().archive);
		writeJson(ARCHIVE_KEY, archive);
		set({
			successOpen: false,
			tab: "results",
			lastSubmitted: draft,
			lastEmailStatus: emailStatus,
			lastEmailError: err ?? "",
			archive
		});
	},
	saveToHistory: () => {
		const draft = structuredClone(get().draft);
		writeJson(LAST_KEY, draft);
		const archive = pushArchive(draft, get().archive);
		writeJson(ARCHIVE_KEY, archive);
		set({
			lastSubmitted: draft,
			archive
		});
	},
	closeSuccess: () => set({ successOpen: false }),
	keepEditing: () => set({
		successOpen: false,
		tab: "results"
	}),
	requestSubmit: () => {
		if (!headerComplete(get().draft.header)) {
			set((s) => ({
				headerHighlight: true,
				tab: "home",
				walkIndex: s.checklistMode === "walk" ? 0 : s.walkIndex,
				openSections: s.openSections.includes("header") ? s.openSections : [...s.openSections, "header"]
			}));
			return false;
		}
		if (missingRequiredPhotos(get().draft, get().photos).length) {
			set({
				photoHighlight: true,
				tab: "checklist"
			});
			return false;
		}
		set({ photoHighlight: false });
		return true;
	},
	setPhoto: (slot, shot) => {
		const draft = structuredClone(get().draft);
		if (draft.photoSkip?.[slot]) delete draft.photoSkip[slot];
		draft.updatedAt = Date.now();
		set({
			photos: {
				...get().photos,
				[slot]: shot
			},
			draft,
			photoHighlight: false,
			lastSavedAt: markSaved(),
			saveError: ""
		});
		putPhoto(draft.id, slot, shot).then(() => {
			get().touchSave();
		}).catch(() => {
			get().setSaveError("Could not save — free space or export PDF now.");
		});
	},
	clearPhoto: (slot) => {
		const draft = get().draft;
		const photos = { ...get().photos };
		delete photos[slot];
		set({
			photos,
			draft: {
				...draft,
				updatedAt: Date.now()
			},
			lastSavedAt: markSaved()
		});
		deletePhoto(draft.id, slot);
	},
	setPhotoSkip: (slot, reason) => {
		const draft = structuredClone(get().draft);
		if (!draft.photoSkip) draft.photoSkip = {};
		if (reason.trim()) draft.photoSkip[slot] = reason.trim();
		else delete draft.photoSkip[slot];
		draft.updatedAt = Date.now();
		set({
			draft,
			photoHighlight: false,
			lastSavedAt: markSaved()
		});
	},
	patchMaint: (fn) => {
		const vin = get().draft.header.vin;
		const rows = fn(rowsForVin(get().maint, vin).map((r) => ({ ...r })));
		const maint = patchRows(get().maint, vin, rows);
		const draft = structuredClone(get().draft);
		applyPlan(draft, maint);
		applyAutoStatuses(draft, get().photos);
		coerceOverall(draft);
		set({
			maint,
			draft,
			lastSavedAt: markSaved()
		});
	},
	addMaintRow: (over) => {
		get().patchMaint((rows) => [...rows, emptyMaintRow(over)]);
	},
	removeMaintRow: (id) => {
		get().patchMaint((rows) => rows.filter((r) => r.id !== id));
	},
	logOilChange: () => {
		const draft = get().draft;
		const miles = draft.header.miles;
		if (!miles.trim()) return false;
		if (alreadyLogged(rowsForVin(get().maint, draft.header.vin), "oil-change", miles)) return false;
		const notes = [
			draft.result.oilType,
			draft.result.oilAmount,
			draft.result.oilFilterPn
		].map((s) => s.trim()).filter(Boolean).join(" · ");
		get().addMaintRow({
			service: "oil-change",
			miles: miles.replace(/[^\d]/g, ""),
			date: draft.header.date || draft.result.signDate,
			notes
		});
		return true;
	},
	clearMaint: () => {
		const maint = emptyMaint();
		const draft = structuredClone(get().draft);
		applyPlan(draft, maint);
		set({
			maint,
			draft
		});
	},
	touchSave: () => set({
		lastSavedAt: markSaved(),
		saveError: ""
	}),
	setSaveError: (msg) => set({ saveError: msg }),
	flushPersist: () => {
		if (!writeJson(DRAFT_KEY, {
			state: persistSlice(get()),
			version: 0
		})) {
			set({ saveError: "Could not save — free space or export PDF now." });
			return;
		}
		set({
			lastSavedAt: markSaved(),
			saveError: ""
		});
	}
}), {
	name: DRAFT_KEY,
	storage: persistStorage(),
	partialize: (s) => persistSlice(s),
	skipHydration: true,
	merge: (persisted, current) => {
		const p = persisted ?? {};
		const openSections = Array.isArray(p.openSections) ? p.openSections.filter((id) => ALL_SECTION_IDS.includes(id)) : current.openSections;
		const checklistMode = p.checklistMode === "walk" || p.checklistMode === "full" ? p.checklistMode : current.checklistMode;
		const walkIndex = typeof p.walkIndex === "number" && Number.isFinite(p.walkIndex) ? Math.max(0, Math.round(p.walkIndex)) : current.walkIndex;
		const tab = TAB_IDS.includes(p.tab) ? p.tab : current.tab;
		const draft = p.draft ? hydrateDraft(p.draft) : current.draft;
		const maint = p.maint && p.maint.trucks && typeof p.maint.trucks === "object" ? p.maint : current.maint;
		applyPlan(draft, maint);
		return {
			...current,
			...p,
			openSections,
			checklistMode,
			walkIndex,
			tab,
			draft,
			maint
		};
	}
}));
var STROKE = "#5ad4c6";
function drawArrow(ctx, a, b) {
	ctx.beginPath();
	ctx.moveTo(a.x, a.y);
	ctx.lineTo(b.x, b.y);
	ctx.stroke();
	const ang = Math.atan2(b.y - a.y, b.x - a.x);
	const len = 18;
	ctx.beginPath();
	ctx.moveTo(b.x, b.y);
	ctx.lineTo(b.x - len * Math.cos(ang - .4), b.y - len * Math.sin(ang - .4));
	ctx.lineTo(b.x - len * Math.cos(ang + .4), b.y - len * Math.sin(ang + .4));
	ctx.closePath();
	ctx.fill();
}
function paintStrokes(ctx, strokes, w, h) {
	ctx.lineWidth = Math.max(3, Math.round(Math.min(w, h) / 90));
	ctx.strokeStyle = STROKE;
	ctx.fillStyle = STROKE;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	for (const s of strokes) {
		const pts = s.points.map((p) => ({
			x: p.x * w,
			y: p.y * h
		}));
		if (pts.length < 2) continue;
		if (s.tool === "circle") {
			const a = pts[0];
			const b = pts[pts.length - 1];
			ctx.beginPath();
			ctx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2, 0, 0, Math.PI * 2);
			ctx.stroke();
		} else if (s.tool === "arrow") drawArrow(ctx, pts[0], pts[pts.length - 1]);
		else {
			ctx.beginPath();
			ctx.moveTo(pts[0].x, pts[0].y);
			for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x, pts[i].y);
			ctx.stroke();
		}
	}
}
function PhotoMarkup({ shot, onSave, onCancel }) {
	const src = shot.originalDataUrl || shot.dataUrl;
	const canvasRef = (0, import_react.useRef)(null);
	const imgRef = (0, import_react.useRef)(null);
	const [tool, setTool] = (0, import_react.useState)("circle");
	const [strokes, setStrokes] = (0, import_react.useState)([]);
	const [caption, setCaption] = (0, import_react.useState)(shot.caption ?? "");
	const drawing = (0, import_react.useRef)(null);
	function redraw() {
		const canvas = canvasRef.current;
		const img = imgRef.current;
		if (!canvas || !img || !img.naturalWidth) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		canvas.width = img.naturalWidth;
		canvas.height = img.naturalHeight;
		ctx.drawImage(img, 0, 0);
		paintStrokes(ctx, drawing.current ? [...strokes, drawing.current] : strokes, canvas.width, canvas.height);
	}
	(0, import_react.useEffect)(() => {
		const img = new Image();
		img.onload = () => {
			imgRef.current = img;
			redraw();
		};
		img.src = src;
	}, [src]);
	(0, import_react.useEffect)(() => {
		redraw();
	}, [strokes, tool]);
	function pos(e) {
		const r = canvasRef.current.getBoundingClientRect();
		return {
			x: (e.clientX - r.left) / r.width,
			y: (e.clientY - r.top) / r.height
		};
	}
	function onDown(e) {
		e.currentTarget.setPointerCapture(e.pointerId);
		drawing.current = {
			tool,
			points: [pos(e)]
		};
	}
	function onMove(e) {
		if (!drawing.current) return;
		drawing.current.points.push(pos(e));
		redraw();
	}
	function onUp() {
		if (drawing.current && drawing.current.points.length >= 2) setStrokes((s) => [...s, drawing.current]);
		drawing.current = null;
		redraw();
	}
	function save() {
		const canvas = canvasRef.current;
		if (!canvas) return;
		onSave({
			dataUrl: canvas.toDataURL("image/jpeg", .72),
			originalDataUrl: src,
			w: canvas.width,
			h: canvas.height,
			caption: caption.trim()
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overlay-frame z-[60] flex flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 px-3 pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "traveler-stamp text-xs text-primary",
					children: "Mark the problem"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "tap-56 grid place-items-center",
					onClick: onCancel,
					"aria-label": "Close markup",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-6" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-auto px-3 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "mx-auto block max-h-full w-full touch-none rounded border border-border",
					onPointerDown: onDown,
					onPointerMove: onMove,
					onPointerUp: onUp,
					onPointerCancel: onUp
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border-t border-border px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [[
							{
								id: "circle",
								label: "Circle",
								Icon: Circle
							},
							{
								id: "freehand",
								label: "Draw",
								Icon: Pencil
							},
							{
								id: "arrow",
								label: "Arrow",
								Icon: ArrowUpRight
							}
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTool(t.id),
							className: cn("tap-56 inline-flex items-center gap-1 rounded border px-3 text-sm font-semibold", tool === t.id ? "chip-on" : "chip-off"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.Icon, { className: "size-4" }), t.label]
						}, t.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setStrokes((s) => s.slice(0, -1)),
							className: "tap-56 inline-flex items-center gap-1 rounded border border-border px-3 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-4" }), "Undo"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: caption,
						onChange: (e) => setCaption(e.target.value),
						placeholder: "One-line caption — what to look at",
						className: "field-input"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: save,
						className: "tap-56 w-full rounded bg-primary font-semibold text-primary-foreground",
						children: "Save marked photo"
					})
				]
			})
		]
	});
}
var PRIORITY_OPTIONS = [
	{
		value: "immediate",
		label: "Immediate"
	},
	{
		value: "soon",
		label: "Soon"
	},
	{
		value: "monitor",
		label: "Monitor"
	}
];
var PRIORITY_RANK = {
	immediate: 0,
	soon: 1,
	monitor: 2
};
var REPAIR_CATALOG = [
	{
		id: "cooler",
		title: "Transmission cooler upgrade",
		itemIds: [
			"atf",
			"atfLines",
			"atfReject",
			"smodPlan"
		],
		diy: [250, 500],
		independent: [600, 1e3],
		dealer: [1200, 2e3]
	},
	{
		id: "radiator",
		title: "Radiator replacement",
		itemIds: ["radiator"],
		diy: [200, 450],
		independent: [700, 1200],
		dealer: [1400, 2200]
	},
	{
		id: "front-brakes",
		title: "Front pads and rotors",
		itemIds: ["pads", "rotors"],
		diy: [80, 200],
		independent: [350, 650],
		dealer: [700, 1200]
	},
	{
		id: "timing",
		title: "Timing-cover / chain diagnosis",
		itemIds: ["timingCover"],
		diy: [0, 50],
		independent: [150, 400],
		dealer: [250, 600],
		note: "Diagnosis only — parts extra"
	},
	{
		id: "uca",
		title: "UCA / ball joint (each side)",
		itemIds: ["steering.ballJoints", "baseline.ucaJoints"],
		diy: [80, 200],
		independent: [300, 600],
		dealer: [550, 900]
	}
];
var BY_ITEM = /* @__PURE__ */ new Map();
for (const cat of REPAIR_CATALOG) for (const id of cat.itemIds) BY_ITEM.set(id, cat);
function catalogFor(itemId) {
	return BY_ITEM.get(itemId);
}
function suggestedPriority(status) {
	if (status === "asap") return "immediate";
	if (status === "attention") return "soon";
	if (status === "monitor") return "monitor";
	return null;
}
function showsRepairBlock(status) {
	return status === "asap" || status === "attention" || status === "monitor";
}
function parseMoney(raw) {
	const t = (raw ?? "").replace(/[^\d.]/g, "");
	if (!t) return null;
	const n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function rangeFromPair(pair) {
	if (!pair) return {
		low: null,
		high: null
	};
	return {
		low: pair[0],
		high: pair[1]
	};
}
function storedRange(low, high, fallback, stored) {
	if (!stored) return fallback;
	return {
		low: parseMoney(low),
		high: parseMoney(high)
	};
}
function formatMoney(n) {
	return `$${Math.round(n).toLocaleString("en-US")}`;
}
function formatRange(range) {
	if (range.low == null && range.high == null) return "";
	if (range.low != null && range.high != null) {
		if (range.low === range.high) return formatMoney(range.low);
		return `${formatMoney(range.low)}–${formatMoney(range.high)}`;
	}
	return formatMoney(range.low ?? range.high);
}
function printRange(range, fallback = "—") {
	return formatRange(range) || fallback;
}
function printDealer(row) {
	const dollars = formatRange(row.dealer);
	if (dollars) return dollars;
	return row.dealerTier || "—";
}
function resolvedRepair(draft, id) {
	if (!rowShows(id, draft.header.visitType, draft.header.drive, draft.header.plan)) return null;
	const suggested = suggestedPriority(rowStatus(draft, id));
	if (!suggested) return null;
	const cat = catalogFor(id);
	const stored = draft.repairs?.[id];
	const hasStored = Boolean(stored);
	const priority = stored?.priority === "immediate" || stored?.priority === "soon" || stored?.priority === "monitor" ? stored.priority : suggested;
	return {
		id,
		title: cat?.title ?? STATUS_ROW_LABELS[id] ?? id,
		priority,
		diy: storedRange(stored?.diyLow ?? "", stored?.diyHigh ?? "", rangeFromPair(cat?.diy), hasStored),
		independent: storedRange(stored?.indLow ?? "", stored?.indHigh ?? "", rangeFromPair(cat?.independent), hasStored),
		dealer: storedRange(stored?.dealerLow ?? "", stored?.dealerHigh ?? "", rangeFromPair(cat?.dealer), hasStored),
		dealerTier: hasStored ? stored?.dealerTier ?? "" : "",
		note: cat?.note ?? "",
		hasDefault: Boolean(cat)
	};
}
function snapshotPlan(row) {
	const money = (n) => n == null ? "" : String(n);
	return {
		priority: row.priority,
		diyLow: money(row.diy.low),
		diyHigh: money(row.diy.high),
		indLow: money(row.independent.low),
		indHigh: money(row.independent.high),
		dealerLow: money(row.dealer.low),
		dealerHigh: money(row.dealer.high),
		dealerTier: row.dealer.low != null || row.dealer.high != null ? "" : row.dealerTier
	};
}
function writeRepair(draft, id, patch) {
	const row = resolvedRepair(draft, id);
	if (!row) return;
	if (!draft.repairs) draft.repairs = {};
	draft.repairs[id] = {
		...snapshotPlan(row),
		...patch
	};
}
function worsePriority(a, b) {
	return PRIORITY_RANK[b] < PRIORITY_RANK[a] ? b : a;
}
function repairTable(draft) {
	const merged = /* @__PURE__ */ new Map();
	for (const id of STATUS_ROW_IDS) {
		const row = resolvedRepair(draft, id);
		if (!row) continue;
		const key = catalogFor(id)?.id ?? id;
		const prev = merged.get(key);
		if (!prev) {
			merged.set(key, row);
			continue;
		}
		prev.priority = worsePriority(prev.priority, row.priority);
	}
	return [...merged.values()].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.title.localeCompare(b.title));
}
function sumRange(rows, pick) {
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
	if (!n) return {
		low: null,
		high: null
	};
	return {
		low,
		high
	};
}
function repairTotals(rows) {
	return {
		diy: sumRange(rows, (r) => r.diy),
		independent: sumRange(rows, (r) => r.independent),
		dealer: sumRange(rows, (r) => r.dealer)
	};
}
function priorityLabel(p) {
	if (p === "immediate") return "Immediate";
	if (p === "soon") return "Soon";
	return "Monitor";
}
var ESTIMATE_DISCLAIMER = "Costs are planning estimates, not invoices.";
var TIERS = [
	"$",
	"$$",
	"$$$",
	"$$$$"
];
function money(v) {
	return v.replace(/[^\d]/g, "");
}
function RangeInputs({ label, low, high, onLow, onHigh, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "field-label",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[1fr_auto_1fr] items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					inputMode: "numeric",
					value: low,
					placeholder: placeholder ? placeholder.split("–")[0] : "",
					onChange: (e) => onLow(money(e.target.value)),
					className: "field-input placeholder:text-faint",
					"aria-label": `${label} low`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "–"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					inputMode: "numeric",
					value: high,
					placeholder: placeholder ? placeholder.split("–")[1] : "",
					onChange: (e) => onHigh(money(e.target.value)),
					className: "field-input placeholder:text-faint",
					"aria-label": `${label} high`
				})
			]
		})]
	});
}
function RepairBlock({ id }) {
	const draft = useInspection((s) => s.draft);
	const patch = useInspection((s) => s.patch);
	const grade = rowStatus(draft, id);
	const row = resolvedRepair(draft, id);
	if (!showsRepairBlock(grade) || !row) return null;
	const cat = catalogFor(id);
	const diyPh = cat?.diy ? `${cat.diy[0]}–${cat.diy[1]}` : void 0;
	const indPh = cat?.independent ? `${cat.independent[0]}–${cat.independent[1]}` : void 0;
	const dealerPh = cat?.dealer ? `${cat.dealer[0]}–${cat.dealer[1]}` : void 0;
	const empty = !row.hasDefault && !printRange(row.diy, "") && !printRange(row.independent, "") && !printRange(row.dealer, "");
	function set(partial) {
		patch((d) => writeRepair(d, id, partial));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 rounded border border-line bg-inset p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "field-label",
				children: "Repair priority & estimate"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-foreground",
				children: row.title
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: PRIORITY_OPTIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => set({ priority: o.value }),
					className: cn("tap-56 rounded border px-3 text-sm font-semibold", row.priority === o.value ? "chip-on" : "chip-off"),
					children: o.label
				}, o.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeInputs, {
				label: "DIY",
				low: row.diy.low == null ? "" : String(row.diy.low),
				high: row.diy.high == null ? "" : String(row.diy.high),
				onLow: (v) => set({ diyLow: v }),
				onHigh: (v) => set({ diyHigh: v }),
				placeholder: diyPh
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeInputs, {
				label: "Independent shop",
				low: row.independent.low == null ? "" : String(row.independent.low),
				high: row.independent.high == null ? "" : String(row.independent.high),
				onLow: (v) => set({ indLow: v }),
				onHigh: (v) => set({ indHigh: v }),
				placeholder: indPh
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeInputs, {
				label: "Dealership",
				low: row.dealer.low == null ? "" : String(row.dealer.low),
				high: row.dealer.high == null ? "" : String(row.dealer.high),
				onLow: (v) => set({
					dealerLow: v,
					dealerTier: ""
				}),
				onHigh: (v) => set({
					dealerHigh: v,
					dealerTier: ""
				}),
				placeholder: dealerPh
			}),
			row.dealer.low == null && row.dealer.high == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "field-label",
					children: "Dealer $–$$$$ (if no dollar range)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					children: TIERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => set({
							dealerTier: row.dealerTier === t ? "" : t,
							dealerLow: "",
							dealerHigh: ""
						}),
						className: cn("tap-56 rounded border px-3 text-sm font-semibold", row.dealerTier === t ? "chip-on" : "chip-off"),
						children: t
					}, t))
				})]
			}) : null,
			empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Enter estimate."
			}) : null,
			row.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: row.note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-faint",
				children: ESTIMATE_DISCLAIMER
			})
		]
	});
}
function Frame({ caption, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "overflow-hidden rounded border border-border bg-inset",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 320 168",
			className: "w-full",
			role: "img",
			"aria-label": caption,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "320",
				height: "168",
				fill: "#0d1418"
			}), children]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
			className: "px-3 py-2 text-xs leading-snug text-muted-foreground",
			children: caption
		})]
	});
}
function label(x, y, text) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
		x,
		y,
		fill: "#5ad4c6",
		fontSize: "9",
		fontFamily: "ui-monospace, monospace",
		children: text
	});
}
function GuideDiagram({ kind }) {
	switch (kind) {
		case "radiator": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "Stand at the front bumper, hood open. Radiator is the wide tank across the front. Two small fittings on the passenger-side end tank are the in-radiator ATF cooler.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "40",
					y: "36",
					width: "240",
					height: "70",
					rx: "6",
					fill: "none",
					stroke: "#5ad4c6",
					strokeWidth: "2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "90",
					y: "76",
					fill: "#e8eef2",
					fontSize: "12",
					children: "Radiator"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "250",
					cy: "50",
					r: "7",
					fill: "none",
					stroke: "#f0b429",
					strokeWidth: "2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "250",
					cy: "92",
					r: "7",
					fill: "none",
					stroke: "#f0b429",
					strokeWidth: "2"
				}),
				label(198, 28, "ATF cooler fittings"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M257 50 H300",
					stroke: "#f0b429",
					strokeWidth: "2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M257 92 H300",
					stroke: "#f0b429",
					strokeWidth: "2"
				}),
				label(40, 128, "You stand here")
			]
		});
		case "atf": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "Passenger-side firewall, engine running. The trans stick is the skinny tube with a small bolt through the handle. Not the engine oil stick.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "24",
					y: "28",
					width: "180",
					height: "110",
					rx: "4",
					fill: "none",
					stroke: "#3d4d56"
				}),
				label(30, 22, "Firewall (passenger)"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "160",
					y: "44",
					width: "10",
					height: "90",
					fill: "#5ad4c6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "148",
					y: "36",
					width: "34",
					height: "12",
					rx: "2",
					fill: "#e8eef2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "182",
					cy: "42",
					r: "3",
					fill: "#f0b429"
				}),
				label(198, 46, "Bolt in handle"),
				label(198, 88, "ATF stick"),
				label(30, 154, "Engine stays idling")
			]
		});
		case "oil": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "Driver-side front of the engine. Long yellow (or marked) handle is engine oil. Wait 10+ minutes after shutdown on a 15k visit.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "50",
					y: "30",
					width: "140",
					height: "100",
					rx: "8",
					fill: "none",
					stroke: "#3d4d56"
				}),
				label(50, 24, "VK56 engine"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "168",
					y: "40",
					width: "8",
					height: "80",
					fill: "#f0b429"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "158",
					y: "32",
					width: "28",
					height: "10",
					fill: "#f0b429"
				}),
				label(200, 40, "Oil stick"),
				label(50, 150, "Not the trans stick")
			]
		});
		case "coolant": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "Front of the bay, engine cold. Read the translucent overflow tank — MIN/MAX molded in the plastic. Do not open the radiator cap hot.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "40",
					y: "40",
					width: "90",
					height: "90",
					rx: "4",
					fill: "none",
					stroke: "#5ad4c6"
				}),
				label(40, 34, "Overflow tank"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "50",
					y1: "70",
					x2: "120",
					y2: "70",
					stroke: "#8aa0ad"
				}),
				label(126, 74, "MAX"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "50",
					y1: "110",
					x2: "120",
					y2: "110",
					stroke: "#8aa0ad"
				}),
				label(126, 114, "MIN"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "170",
					y: "50",
					width: "110",
					height: "50",
					rx: "4",
					fill: "none",
					stroke: "#3d4d56"
				}),
				label(178, 78, "Radiator — leave cap")
			]
		});
		case "battery": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "Driver-side of the engine bay. Big black box. Red cable is +, black is −. Ground straps run to the body and engine.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "50",
					y: "40",
					width: "120",
					height: "80",
					rx: "4",
					fill: "none",
					stroke: "#e8eef2",
					strokeWidth: "2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "78",
					y: "86",
					fill: "#e8eef2",
					fontSize: "16",
					children: "+"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "130",
					y: "86",
					fill: "#8aa0ad",
					fontSize: "16",
					children: "−"
				}),
				label(50, 34, "Battery"),
				label(184, 70, "Ground strap → body")
			]
		});
		case "pads": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "Look through the wheel at the caliper. The pad is the friction material, not the steel backing. Measure remaining meat in mm.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "110",
					cy: "84",
					r: "58",
					fill: "none",
					stroke: "#8aa0ad",
					strokeWidth: "6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "88",
					y: "50",
					width: "18",
					height: "68",
					fill: "#5ad4c6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "108",
					y: "50",
					width: "10",
					height: "68",
					fill: "#3d4d56"
				}),
				label(184, 60, "Pad (measure this)"),
				label(184, 78, "Rotor"),
				label(184, 120, "Caliper body")
			]
		});
		case "tire": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "All four corners plus the spare. Check the tread face and the inner shoulder — the edge you cannot see without a crouch or a mirror.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "90",
					cy: "84",
					r: "50",
					fill: "none",
					stroke: "#e8eef2",
					strokeWidth: "8"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M90 40 C 70 84 70 84 90 128",
					fill: "none",
					stroke: "#f0b429",
					strokeWidth: "4"
				}),
				label(160, 64, "Inner shoulder"),
				label(160, 84, "(yellow)"),
				label(160, 120, "Tread face")
			]
		});
		case "engine": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "Stand at the front, hood open. Timing cover is the front of the engine. Valve covers are the two long lids on top.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "60",
					y: "36",
					width: "200",
					height: "90",
					rx: "6",
					fill: "none",
					stroke: "#5ad4c6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "70",
					y: "44",
					width: "80",
					height: "20",
					fill: "#3d4d56"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "170",
					y: "44",
					width: "80",
					height: "20",
					fill: "#3d4d56"
				}),
				label(70, 30, "Valve covers"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "60",
					y: "110",
					width: "200",
					height: "16",
					fill: "#f0b429",
					opacity: "0.4"
				}),
				label(60, 148, "Front / timing cover")
			]
		});
		case "trans": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "You feel this from the driver seat. TCC is the lock-up clutch in the torque converter — it should go quiet and smooth around 45–60 mph, light throttle.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "40",
					y: "50",
					width: "240",
					height: "50",
					rx: "8",
					fill: "none",
					stroke: "#5ad4c6"
				}),
				label(50, 44, "RE5R05A — 5-speed auto"),
				label(50, 80, "P  R  N  D   2  1"),
				label(50, 128, "Listen / feel. Do not guess from Park.")
			]
		});
		case "under": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "On stands at the frame, or a lift. Never a cheap scissor jack. Look along the frame rails, pans, and lines from front to back.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "30",
					y: "70",
					width: "260",
					height: "14",
					fill: "#5ad4c6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "70",
					y: "50",
					width: "80",
					height: "20",
					fill: "none",
					stroke: "#e8eef2"
				}),
				label(70, 44, "Oil pan"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "170",
					y: "90",
					width: "80",
					height: "20",
					fill: "none",
					stroke: "#f0b429"
				}),
				label(170, 126, "Trans pan")
			]
		});
		case "cabin": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "Key ON, engine may be off. Watch the dash cluster: lamps should light, then go out. Photograph the cluster if anything stays on.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "40",
					y: "40",
					width: "240",
					height: "80",
					rx: "10",
					fill: "none",
					stroke: "#e8eef2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "90",
					cy: "80",
					r: "18",
					fill: "none",
					stroke: "#5ad4c6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "160",
					cy: "80",
					r: "18",
					fill: "none",
					stroke: "#5ad4c6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "230",
					cy: "80",
					r: "18",
					fill: "none",
					stroke: "#f0b429"
				}),
				label(40, 148, "Prove-out then off. Yellow = still on.")
			]
		});
		case "steering": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "Front wheel off or turned out. Upper control arm (UCA) is the top A-shaped arm. Ball joint is the pivot at the knuckle.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M60 40 L160 40 L130 90 L90 90 Z",
					fill: "none",
					stroke: "#5ad4c6",
					strokeWidth: "2"
				}),
				label(60, 32, "UCA"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "110",
					cy: "96",
					r: "10",
					fill: "none",
					stroke: "#f0b429",
					strokeWidth: "2"
				}),
				label(128, 100, "Ball joint"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "96",
					y: "108",
					width: "28",
					height: "36",
					fill: "none",
					stroke: "#8aa0ad"
				})
			]
		});
		case "brake": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "Driver footwell: pedal height from the floor. Master cylinder is the reservoir on the firewall, driver side, under the hood.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M80 40 L80 110 L140 130",
					fill: "none",
					stroke: "#5ad4c6",
					strokeWidth: "3"
				}),
				label(150, 80, "Pedal"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "200",
					y: "40",
					width: "70",
					height: "40",
					rx: "4",
					fill: "none",
					stroke: "#e8eef2"
				}),
				label(200, 34, "Master cyl")
			]
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Frame, {
			caption: "After a drive, heat makes leaks show. Look at pans, covers, and the ground where it sat.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
					cx: "160",
					cy: "120",
					rx: "70",
					ry: "16",
					fill: "none",
					stroke: "#f0b429"
				}),
				label(110, 124, "Fresh drip"),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "80",
					y: "40",
					width: "160",
					height: "50",
					rx: "6",
					fill: "none",
					stroke: "#5ad4c6"
				}),
				label(90, 70, "Pan / cover")
			]
		});
	}
}
function p(id, diagram, fields) {
	return {
		id,
		diagram,
		...fields,
		looksGood: fields.looksGood ?? fields.good,
		secondLook: fields.secondLook ?? `Needs a second look: ${fields.bad}`,
		stopShop: fields.stopShop ?? fields.next
	};
}
var SHIFT = (id, name, feel) => p(id, "trans", {
	what: `This is one gear change in the automatic. You are feeling whether it happens cleanly.`,
	where: `Driver seat. Do this on a quiet road after the truck is warm. Cold and hot each get a mark.`,
	why: `The RE5R05A (this truck’s 5-speed) often warns you with a flare, bang, or miss before it fails. Catch it early.`,
	good: `${name} feels ${feel}. No bang, no long pause, no engine RPM flare.`,
	bad: `Delay, bang, flare, hunt, or a miss. Repeat once to be sure it was not your foot.`,
	next: `Pass if both cold and hot feel clean. Monitor a one-time odd shift. Shop if it repeats or bangs.`,
	tools: `Quiet road, a passenger to write, working brakes.`,
	specPlain: `No published “ms of delay.” Clean engagement is the spec. Bang or flare is not.`,
	looksGood: `Clean, one motion.`,
	secondLook: `One odd shift — try again warm.`,
	stopShop: `Repeated bang, flare, or miss — shop. Do not keep driving a harsh reverse engagement.`
});
var PLAIN = [
	p("fluids.oilLevel", "oil", {
		what: `Engine oil is the slippery film that keeps the 5.6 from grinding itself.`,
		where: `Under the hood, driver-side front. Long yellow or marked handle. Not the skinny trans stick.`,
		why: `This engine is hard on timing chains if it runs low. An oil-change visit records what you poured — not a dipstick after you dumped the pan.`,
		good: `Oil change: 5W-30 in, about 6.5 quarts, filter written, new crush washer. 15k: film between L and H, not milky.`,
		bad: `Below L, milky chocolate milk, fuel smell, or unknown oil dumped in.`,
		next: `Pass if the change is recorded or the stick is in range. Shop if it is milky. Add 5W-30 only if it is truly low on a 15k.`,
		tools: `Funnel, 5W-30, filter, crush washer, lint-free rag, drain pan.`,
		specPlain: `Genuine Nissan 5W-30. Capacity with filter is 6.2 L / 6½ qt. Change about every 3,500–5,000 miles at this age.`
	}),
	p("fluids.oilLeak", "leak", {
		what: `This is a look for oil that has escaped the engine — wet spots, not just old dust.`,
		where: `Valve covers on top, oil-cooler adapter at the block, filter, pan, and the front timing cover. Also the ground where it sat.`,
		why: `A slow seep is common at 270k. A drip that empties the stick is how this engine eats a chain.`,
		good: `No fresh wet finger. No puddle. Old dusty stain can be a watch.`,
		bad: `Active drip, soaked timing cover, wet oil-cooler O-ring, or a puddle overnight.`,
		next: `Pass if dry or only dusty film. Monitor a stain. Shop for a drip. Photograph the wet spot.`,
		tools: `Flashlight, paper towel, camera.`,
		specPlain: `No allowed drip rate. Wet on a finger is a leak. Dusty film is a note.`
	}),
	p("fluids.coolant", "coolant", {
		what: `Coolant is the mix that keeps the engine from boiling or freezing. You read the plastic overflow tank, not the radiator.`,
		where: `Front of the bay, next to the radiator. MIN and MAX are molded in the tank.`,
		why: `Oil film or a red tint in here can mean coolant is mixing with oil or ATF (automatic transmission fluid). That is an emergency on this Nissan.`,
		good: `Between MIN and MAX. Uniform color. No oil sheen. Cap seated. Engine cold.`,
		bad: `Empty, rusty mud, oil film, or strawberry/red tint.`,
		next: `Pass if the tank is in range and clean. Do not drive if it is empty or milky. Do not open the radiator cap hot.`,
		tools: `Flashlight, camera. Freeze-point tester if you have one.`,
		specPlain: `50/50 Nissan Long Life and distilled water. System about 14.4 L / 3¾ gal. Service about 60k miles / 5 years if history is unknown. Factory freeze around −34°F.`
	}),
	p("fluids.atf", "atf", {
		what: `ATF is automatic transmission fluid — the oil the gearbox lives in.`,
		where: `Passenger-side firewall. Skinny stick with a small bolt through the handle. Engine must be idling.`,
		why: `On this truck the cooler lives inside the radiator. If they mix, you get SMOD — strawberry milkshake of death — and the transmission can die.`,
		good: `HOT range, engine idling. Transparent red or amber. Smells like ATF, not sweet.`,
		bad: `Pink, milky, strawberry, or sweet. That is coolant in the ATF.`,
		next: `Pass only if it is red/amber in the HOT range. Do not keep driving if it is milky or sweet. Shop the same day.`,
		tools: `Lint-free paper, 10 mm for the handle bolt, level pavement.`,
		specPlain: `Only Nissan Matic J (or Matic S). Read HOT marks after a drive, stick inserted reversed, about 149°F / 65°C. Never check with the engine off.`,
		looksGood: `Red/amber, HOT hashes, not sweet.`,
		secondLook: `Brown or burnt smell — schedule a drain/fill.`,
		stopShop: `Pink, milky, or sweet — park it. That is SMOD.`
	}),
	p("fluids.psf", "coolant", {
		what: `Power steering fluid is what lets you turn the wheel without wrestling it.`,
		where: `Engine bay reservoir marked PSF. COLD marks after a sit. HOT marks after the drive.`,
		why: `The high-pressure hose on this chassis likes to leak. Low fluid is a leak, not a lifestyle.`,
		good: `Near COLD MAX when cold. Red or amber. Dry hose.`,
		bad: `Below MIN, foamy, black/burnt, or a wet hose to the rack.`,
		next: `Pass if in range and dry. Monitor a dusty weep. Shop a wet hose. Nissan PSF only.`,
		tools: `Flashlight, paper towel, Nissan PSF if topping.`,
		specPlain: `Nissan PSF. Do not overfill above the top mark. Do not use ATF unless the cap says so — this truck wants PSF.`
	}),
	p("fluids.brake", "brake", {
		what: `Brake fluid is what pushes the pads when you press the pedal. It soaks up water over time.`,
		where: `Firewall, driver side, under the hood. Translucent reservoir with MIN/MAX.`,
		why: `A slow drop follows pad wear. A sudden drop is a leak. Dark fluid is old and can boil.`,
		good: `Between MIN and MAX. Light honey color. Cap sealed.`,
		bad: `Below MIN, dark brown/black, or a wet master.`,
		next: `Pass if level and color are fine. Find the leak if it dropped fast. Flush DOT 3 about every 24 months.`,
		tools: `Flashlight, sealed DOT 3 only if topping, moisture tester if you have one.`,
		specPlain: `DOT 3. Flush every 24 months. Never DOT 5 silicone. Never an old open bottle.`
	}),
	p("fluids.washer", "coolant", {
		what: `Washer fluid is just glass cleaner in a tank so you can see.`,
		where: `Blue or clear tank in the engine bay, usually a blue cap.`,
		why: `Empty washers are a ticket and a safety problem, not an engine problem.`,
		good: `Tank has fluid. Both front and rear washers squirt.`,
		bad: `Empty, or a cracked tank dumping on the ground.`,
		next: `Pass if it squirts. Fill if empty. That is not a shop visit.`,
		tools: `Washer fluid, funnel.`,
		specPlain: `Any washer fluid rated for your climate. Not coolant. Not water in a freeze.`
	}),
	p("fluids.transferSeep", "under", {
		what: `The transfer case is the box behind the transmission that sends power to both axles on 4WD.`,
		where: `Under the truck, just behind the transmission pan. 4WD only.`,
		why: `A seep here is gear oil, not engine oil. Low fluid lets the chain in that box rattle.`,
		good: `Dry, or a dusty film that does not drip.`,
		bad: `Wet housing, drip, or a puddle of brown gear oil.`,
		next: `Pass if dry. Monitor film. Shop a drip. Skip this on 2WD.`,
		tools: `Flashlight, stands or a lift, paper towel.`,
		specPlain: `No allowed drip. Fill to the plug if you service it — Nissan ATF or the transfer-case spec on the plug tag.`
	}),
	p("fluids.frontDiffSeep", "under", {
		what: `The front differential is the pumpkin in the front axle that lets the wheels turn different speeds.`,
		where: `Under the front, 4WD only. Look at the cover and the pinion.`,
		why: `Gear oil on the ground is this, not engine oil. A dry diff still needs fluid on a 30k.`,
		good: `Dry cover. No wet pinion seal.`,
		bad: `Wet cover, dripping pinion, or a puddle.`,
		next: `Pass if dry. Shop a wet pinion. Skip on 2WD.`,
		tools: `Flashlight, paper towel, stands.`,
		specPlain: `Hypoid gear oil as tagged on the cover. Seep that wets a finger is a leak.`
	}),
	p("fluids.rearDiffSeep", "under", {
		what: `The rear differential is the pumpkin in the rear axle.`,
		where: `Under the rear. Cover bolts and the front of the pumpkin (pinion).`,
		why: `Same as the front: gear oil leak vs dusty stain. This one is on 2WD and 4WD.`,
		good: `Dry, or dusty film only.`,
		bad: `Wet cover or wet pinion.`,
		next: `Pass if dry. Monitor film. Shop a drip.`,
		tools: `Flashlight, paper towel, stands.`,
		specPlain: `Hypoid gear oil as tagged. Wet finger = leak.`
	}),
	p("engine.timingCover", "engine", {
		what: `The timing cover is the front face of the engine. Behind it, a chain keeps the valves in time with the pistons.`,
		where: `Stand in front of the engine. The wide cover low in front. Listen at a cold start — do not rev it.`,
		why: `VK56 chains rattle when oil is slow to get there. A 1–3 second rattle that dies is common. An ongoing rattle with low oil pressure is not.`,
		good: `Quiet, or a short rattle 1–3 seconds then gone, oil pressure in the green.`,
		bad: `Rattle that stays, or rattle plus a low oil-pressure lamp.`,
		next: `Pass if quiet. Monitor a short cold rattle. Do not drive if it keeps rattling and oil pressure is low.`,
		tools: `Ears, a phone timer, oil-pressure gauge in the cluster.`,
		specPlain: `No factory “allowed rattle seconds.” Shop rule: 1–3 sec then gone = watch. Ongoing + low oil = stop.`
	}),
	p("engine.manifolds", "engine", {
		what: `Exhaust manifolds are the iron pipes bolted to each side of the engine that dump burned gas into the rest of the exhaust.`,
		where: `Each side of the engine, under heat shields. Listen at cold start. Look for soot streaks.`,
		why: `VK56 manifold and heat-shield bolts like to break. A tick that quiets when warm is often a leak at the flange.`,
		good: `Quiet, shields tight, no soot.`,
		bad: `Tick on one side that stays, soot at the flange, loose or missing shield bolts.`,
		next: `Pass if quiet. Monitor a faint warm-up tick. Shop a loud tick or broken bolts.`,
		tools: `Ears, flashlight, a gloved hand only on a cold engine.`,
		specPlain: `No published tick spec. Broken heat-shield bolts are a known 2005 Armada job.`
	}),
	p("engine.idle", "engine", {
		what: `Idle is how the engine runs in Park, doing nothing. CEL is the check-engine light.`,
		where: `Driver seat, after start. Watch the tach and the dash lamp.`,
		why: `A rough idle or a CEL that stays on means a sensor, vacuum leak, or misfire. Do not ignore it on a 270k VK56.`,
		good: `Smooth idle. CEL proves out then goes off.`,
		bad: `Hunt, shake, or CEL staying on.`,
		next: `Pass if smooth and the lamp is off. Scan it if the CEL stays. Shop a misfire.`,
		tools: `Dash, optional scan tool.`,
		specPlain: `CEL must prove out then off. Idle should sit steady, not hunt.`
	}),
	p("engine.belt", "engine", {
		what: `The serpentine belt is the long rubber belt that spins the alternator, water pump, and A/C.`,
		where: `Passenger side of the engine. One wide belt on pulleys.`,
		why: `A cracked belt can leave you with no charge and a hot engine. Tensioner play is the squeal you hear.`,
		good: `Quiet, no cracks to the cords, tensioner not flopping.`,
		bad: `Cracks, glaze, fray, or a tensioner that wobbles.`,
		next: `Pass if it looks even and quiet. Monitor light cracks. Shop glaze/fray or a noisy tensioner.`,
		tools: `Flashlight, engine off, a glove to twist the belt slightly.`,
		specPlain: `Replace if cracks reach cords, or if it glazes/squeals. No mile spec that beats a look.`
	}),
	p("engine.radiator", "radiator", {
		what: `The radiator dumps engine heat. On this Nissan a small ATF cooler is built into an end tank.`,
		where: `Front of the bay, the wide tank behind the grille. Look at plastic end tanks and the two small ATF fittings.`,
		why: `If that cooler fails inside, coolant and transmission fluid mix. That mix can wreck the transmission (SMOD).`,
		good: `Tanks dry, hoses dry, no sweet smell, fittings dry.`,
		bad: `Weeping tanks, wet fittings, crusted seams, or an original radiator at 270k.`,
		next: `Pass if dry and not original-unknown at 270k. Shop wet tanks. Plan a radiator + external cooler if it is still the in-radiator cooler.`,
		tools: `Flashlight, camera, paper towel.`,
		specPlain: `No Nissan “replace by year” line. This shop treats original / 10+ year tanks as due. End-tank cracks are the failure.`
	}),
	p("engine.atfLines", "radiator", {
		what: `The transmission cooler is built into the radiator. Two small fittings on the end tank carry ATF (automatic transmission fluid) through that tank.`,
		where: `Front of the engine. Passenger-side radiator end tank. Two small lines — not the big upper hose.`,
		why: `If the radiator fails internally, coolant and transmission fluid can mix. On this Nissan that mix can wreck the transmission (SMOD).`,
		good: `ATF is red/clear, not sweet; cooler fittings are dry.`,
		bad: `Milky/pink ATF, wet fittings, unknown original radiator at high miles.`,
		next: `Pink, milky, or sweet-smelling transmission fluid is an emergency — do not keep driving. Pass only if fluid is red and fittings are dry.`,
		tools: `Flashlight, camera, paper towel.`,
		specPlain: `In-radiator cooler still in service at 270k is a plan, not a pass. Wet fittings = shop now even if ATF still looks red.`,
		looksGood: `Dry fittings, red ATF, external cooler already fitted.`,
		secondLook: `Dry today but original radiator — schedule the bypass.`,
		stopShop: `Wet fittings or milky ATF — stop. That is SMOD risk.`
	}),
	p("engine.airFilter", "engine", {
		what: `The air filter is the paper (or foam) that keeps dirt out of the engine. The cabin filter is the one for the vents inside.`,
		where: `Big black box on the driver side of the bay. Clips or screws on the lid.`,
		why: `A packed filter starves a 5.6 and throws dust into the MAF sensor.`,
		good: `Paper still has color, not mud-packed.`,
		bad: `Caked dirt, wet oil, or missing.`,
		next: `Pass if reasonably clean. Replace if you cannot see light through it. Cabin filter is a 15k item.`,
		tools: `Screwdriver or just the clips, flashlight.`,
		specPlain: `Inspect every 15k. Replace when loaded. No magic mile if you drive dirt roads.`
	}),
	p("engine.battery", "battery", {
		what: `The battery is the box that starts the truck and feeds the computers.`,
		where: `Driver-side engine bay. Red is +, black is −.`,
		why: `A weak battery on this truck makes lamps and the TCM act possessed. Rest voltage is the number after it sits.`,
		good: `Rest about 12.4–12.8 V. Running about 13.5–14.7 V. Tight clean terminals.`,
		bad: `Rest under 12.2 V, running under 13.2 V, or a failed load test.`,
		next: `Pass if numbers are in range. Monitor 12.3-ish rest. Shop a collapsed rest or a fail load test. Do not drive a no-charge running V.`,
		tools: `Voltmeter, wire brush, flashlight.`,
		specPlain: `Rest under 12.2 V after a sit is a fail. Running should be mid-13s to mid-14s. Load test if you have the tool.`
	}),
	p("engine.grounds", "battery", {
		what: `Ground straps are the fat black cables that bolt the engine and body to battery negative.`,
		where: `Battery negative to body. Engine block to body. Often a strap at the fender.`,
		why: `A rusty ground on an Armada makes random electrical ghosts — gauges, 4WD, TCM.`,
		good: `Tight, clean metal, not green and crunchy.`,
		bad: `Corroded, loose, or missing.`,
		next: `Pass if tight and clean. Shop a green crust. This is a cheap fix.`,
		tools: `Flashlight, wrench, wire brush.`,
		specPlain: `Metal-to-metal, tight. No factory ohm number you need in the driveway.`
	}),
	p("engine.pcv", "engine", {
		what: `The PCV hose is the tube that lets crankcase fumes back into the intake so they burn instead of leaking.`,
		where: `Valve cover to intake. Soft hose on top of the engine.`,
		why: `A cracked PCV hose is a vacuum leak — rough idle, whistle, oil breath.`,
		good: `Hose firm, not mush, not wet-oily and split.`,
		bad: `Cracked, collapsed, or soaked and split.`,
		next: `Pass if it looks whole. Replace a split hose. Cheap.`,
		tools: `Eyes, a squeeze with the engine off.`,
		specPlain: `No mile spec that beats a cracked hose. Replace if split.`
	}),
	p("engine.scan", "cabin", {
		what: `A scan tool talks to the computers. Stored codes are old. Pending are new. ATF temp is the transmission fluid temperature.`,
		where: `OBD plug under the dash, driver side, above your right knee.`,
		why: `This gearbox wants a HOT ATF read near 149°F. The scan confirms you were actually hot. Codes explain a CEL.`,
		good: `No stored/pending that you cannot explain. ATF temp in the HOT window when you read the stick.`,
		bad: `Unexplained CEL codes, or you read ATF cold and called it good.`,
		next: `Pass if clean or known-old. Shop new misfire/TCM codes. 15k item — hidden on oil-change.`,
		tools: `Any ELM/OBD reader that shows ATF temp on Nissan.`,
		specPlain: `HOT check is ATF near 149°F (65°C). Do not treat a 90°F scan as a HOT stick read.`
	}),
	SHIFT("trans.parkReverse", "Park → Reverse", "a soft clunk, not a bang"),
	SHIFT("trans.reverseDrive", "Reverse → Drive", "a clean take-up, not a slam"),
	SHIFT("trans.up12", "1–2 upshift", "one clean step"),
	SHIFT("trans.up23", "2–3 upshift", "one clean step"),
	SHIFT("trans.up345", "3–4 and 4–5", "clean, no hunt"),
	p("trans.tcc", "trans", {
		what: `TCC is the torque converter clutch — a lock-up that stops the “slip” at cruise so you save fuel and heat.`,
		where: `Driver seat, 45–60 mph, light throttle on a flat road.`,
		why: `A shudder here is a classic RE5R05A complaint. It feels like driving over rumble strips.`,
		good: `Smooth lock, RPM drops a little, no shake.`,
		bad: `Shudder, slip (RPM climbs at the same pedal), or a bang in and out.`,
		next: `Pass if smooth. Monitor a hint of shudder once. Shop a repeatable rumble-strip feel.`,
		tools: `Quiet highway, a passenger to write.`,
		specPlain: `Lock around 45–60 mph light throttle. Shudder is not a spec — it is a fail feel.`
	}),
	SHIFT("trans.kickdown", "Kickdown 5–4 / 4–3", "a prompt downshift, not a late slam"),
	p("trans.fourwd", "trans", {
		what: `This is the switch that sends power to both axles. 4WD high for slick roads. 4WD low for crawl.`,
		where: `Dash switch. Do this on dirt or a loose surface — not a dry parking lot at speed.`,
		why: `A bind on dry pavement is normal in 4HI if you turn sharp. A “no” when you asked for 4HI is a transfer-case or switch problem.`,
		good: `It engages, light comes on, it disengages.`,
		bad: `No light, no pull, or it stays stuck.`,
		next: `Pass if it works. Shop a no-engage. Skip on 2WD.`,
		tools: `Dirt lot, dash switch.`,
		specPlain: `4HI on loose ground. Do not force 4LO at 30 mph.`
	}),
	p("trans.atfReject", "atf", {
		what: `This is the stop rule for mixed fluids. ATF (automatic transmission fluid) that looks like a strawberry milkshake is coolant in the gearbox.`,
		where: `Same trans stick. Color and smell on the paper towel.`,
		why: `That mix is SMOD. Keep driving and you can grenade the RE5R05A.`,
		good: `Not this row — you only mark it if the fluid failed.`,
		bad: `Pink, milky, or sweet.`,
		next: `Do not continue the drive. Do not “see if it shifts.” Tow it.`,
		tools: `Paper towel, your nose.`,
		specPlain: `Any pink/milky/sweet ATF is a reject. No “a little pink is OK.”`,
		looksGood: `You did not need this row.`,
		secondLook: `Slight haze — still treat as reject and get a second pair of eyes.`,
		stopShop: `Park it. That is SMOD.`
	}),
	p("brakes.pads", "pads", {
		what: `Brake pads are the wear blocks that squeeze the shiny rotor to stop you.`,
		where: `Look through each wheel. Inner pad is often thinner — that is the one that lies.`,
		why: `Uneven inner vs outer on this truck often means a sticky caliper or a worn UCA (upper control arm) that lets the wheel lean.`,
		good: `About 6 mm or more remaining, even inner/outer.`,
		bad: `Under 3 mm is thin. 1.0 mm or less is stop. A big inner/outer gap is a caliper or alignment problem.`,
		next: `Pass if even and well above 3 mm. Monitor 3–4 mm. Shop under 3 mm. Do not drive at 1 mm.`,
		tools: `Flashlight, ruler or pad gauge, camera.`,
		specPlain: `Factory min remaining friction is 2 mm on many Nissan pads; this shop treats under 3 mm as due and 1.0 mm as do-not-drive.`,
		looksGood: `Even pads, 5 mm+ meat.`,
		secondLook: `3–4 mm or a little taper.`,
		stopShop: `≤ 1.0 mm — do not drive.`
	}),
	p("brakes.rotors", "pads", {
		what: `Rotors are the shiny discs the pads grab.`,
		where: `Same wheel opening. Feel the outer edge for a rust lip. Thickness with a micrometer if you have one.`,
		why: `A pulse in the pedal is often a rotor. Too thin and they crack.`,
		good: `Smooth stops, thickness above min, no deep grooves.`,
		bad: `Pulse, cracks, or at/under min thickness.`,
		next: `Pass if smooth and above min. Shop a pulse. Do not drive at min.`,
		tools: `Micrometer or a good caliper, flashlight.`,
		specPlain: `Front min about 26.0 mm, rear about 14.0 mm on this chassis — confirm the stamp on the rotor hat if present.`
	}),
	p("brakes.hoses", "pads", {
		what: `The caliper is the clamp at each wheel. Hoses are the flexible rubber that feed it fluid.`,
		where: `Behind each wheel. Slide pins are the greasy bolts the caliper slides on.`,
		why: `A wet caliper is a fail. A frozen slide pin eats the inner pad — that is the taper you measured.`,
		good: `Dry caliper, pins move, hoses not cracked to cords.`,
		bad: `Wet, pinned solid, hose cracked or bulging.`,
		next: `Pass if dry and sliding. Shop wet or frozen. Guide has the pin check.`,
		tools: `Flashlight, glove, camera.`,
		specPlain: `No wet caliper. Pins must slide. That is the caliper inspection.`
	}),
	p("brakes.master", "brake", {
		what: `The master cylinder is the pump your pedal pushes. The booster is the round can behind it that uses engine vacuum to help.`,
		where: `Firewall, driver side, under the hood. Pedal in the cab.`,
		why: `Seepage at the back of the master drips on the booster and then the carpet. A soft pedal is air or a fail master.`,
		good: `Dry, pedal firm after a few pumps.`,
		bad: `Wet at the master, or a pedal that sinks.`,
		next: `Pass if dry and firm. Shop a sink or a wet tail.`,
		tools: `Flashlight, paper towel.`,
		specPlain: `Pedal must hold. Any seepage at the master is a fail.`
	}),
	p("brakes.pedalHeight", "brake", {
		what: `Pedal height is how far the brake pedal sits off the floor at rest.`,
		where: `Driver footwell. Measure from the floor to the pedal pad.`,
		why: `A low pedal means worn pads, air, or a master that is bypassing. On this truck below spec is a stop.`,
		good: `At or above spec, firm.`,
		bad: `Below 3.5 in at rest, or it sinks while you hold it.`,
		next: `Pass if at spec and firm. Do not drive below spec.`,
		tools: `Tape measure.`,
		specPlain: `Shop rule: under 3.5 in at rest is below spec — do not drive.`
	}),
	p("brakes.parking", "brake", {
		what: `The parking brake is the pedal or handle that holds the truck on a hill with the transmission in Park as backup.`,
		where: `Left foot pedal on this Armada. Count the clicks. Then try a mild grade.`,
		why: `A parking brake that needs 10 clicks is stretched or seized. One that does not hold is not a parking brake.`,
		good: `About 4–6 clicks, holds a grade.`,
		bad: `Very few clicks (seized) or too many (cable stretch), or it rolls.`,
		next: `Pass if it holds and click count is normal. Shop a roll.`,
		tools: `A mild driveway grade.`,
		specPlain: `Holds the truck. Click count in the middle of the pedal travel — not slammed to the floor.`
	}),
	p("brakes.absLamps", "cabin", {
		what: `ABS / SLIP / VDC lamps are the anti-lock and stability lights. They must light at key-on, then go out.`,
		where: `Instrument cluster. Key ON. Photograph the cluster.`,
		why: `A lamp that stays on means you may not have anti-lock next time you panic-stop.`,
		good: `Prove-out then off.`,
		bad: `Stays on or comes and goes.`,
		next: `Pass if they go out. Do not drive if ABS stays on and you already have a brake issue. Shop a stay-on lamp.`,
		tools: `Key, camera.`,
		specPlain: `Lamps must prove out then off. Stay-on is a fail and a hard gate with other brake problems.`
	}),
	p("brakes.tread", "tire", {
		what: `Tread is the rubber grooves that hold the road and the rain.`,
		where: `All four tires plus the spare. Face and the inner shoulder — squat or use a mirror.`,
		why: `Inner-shoulder wipe on this truck is often alignment or a tired UCA, not “I need new tires only.”`,
		good: `Even, well above 4/32, inner shoulder not bald.`,
		bad: `At 2/32, inner bald, or one tire much lower than its pair.`,
		next: `Pass if even and healthy. Monitor inner wear. Shop 2/32 or a bald inner.`,
		tools: `Tread gauge, flashlight, camera.`,
		specPlain: `Legal often 2/32. This shop treats 4/32 as “plan it” and a bald inner as alignment, not just rubber.`
	}),
	p("brakes.tireAge", "tire", {
		what: `DOT week/year is the four-digit date on the sidewall. 2318 means week 23 of 2018.`,
		where: `Sidewall of each tire including the spare. You may need to roll the tire or crawl.`,
		why: `Old rubber cracks even with tread. Six to seven years is old for a daily.`,
		good: `Date in the last 5–6 years.`,
		bad: `7+ years, or a spare from the Bush administration.`,
		next: `Pass if dates are sane. Monitor 6–7 years. Shop older, even with tread.`,
		tools: `Flashlight, a wipe for the sidewall.`,
		specPlain: `No Nissan “expire at 6 years” line. Industry practice: replace around 6–10 years. This shop flags 7+.`
	}),
	p("brakes.wear", "tire", {
		what: `Wear pattern is the shape of the remaining rubber — even, inner, outer, cup, or center.`,
		where: `Same as tread. Compare left vs right.`,
		why: `Inner wear + a pull is alignment or UCA play. Catch it before the rotor is scrap.`,
		good: `Even across the face.`,
		bad: `Inner wipe, feathering, cupping.`,
		next: `Pass if even. Monitor a hint of inner. Shop a wipe plus a pull.`,
		tools: `Eyes, camera, the alignment-feel row.`,
		specPlain: `Uneven wear is a diagnosis, not a tire brand problem until the alignment is proven.`
	}),
	p("brakes.pressures", "tire", {
		what: `Air in the tires. Cold numbers, before you drive.`,
		where: `Door sticker is the spec. All four plus spare.`,
		why: `Low inner heat cooks a tire. High center wear. The spare is often at 20 psi from 2005.`,
		good: `At the door-sticker psi, spare usable.`,
		bad: `Grossly low, or spare flat.`,
		next: `Pass if set. Fill the spare. That is not a shop visit unless it will not hold.`,
		tools: `Gauge, compressor.`,
		specPlain: `Use the door sticker, not the sidewall max. Typical Armada is in the mid-30s psi — read the sticker.`
	}),
	p("brakes.lugTorque", "tire", {
		what: `Lug nuts hold the wheels on. Torque is how tight, in foot-pounds.`,
		where: `Each wheel. Recheck after a recent tire or brake job.`,
		why: `Too loose = wheel walks. Too tight = broken studs. 98 ft-lb is this truck.`,
		good: `Rechecked to 98 ft-lb in a star pattern.`,
		bad: `Never rechecked after a wheel-off, or a spinning stud.`,
		next: `Pass if you rechecked. Do not skip after pads. 15k item.`,
		tools: `Torque wrench, 21 mm socket typical.`,
		specPlain: `98 ft-lb. Star pattern. Recheck after 50–100 miles if you just installed wheels.`
	}),
	p("brakes.bearings", "tire", {
		what: `Wheel bearings let the wheel spin. A bad one growls or has play.`,
		where: `Grab 12 and 6 on each wheel (truck in air or with a helper). Road noise that follows a corner.`,
		why: `A growl that changes in a turn is a bearing, not a tire. Play at the rim is not OK.`,
		good: `No growl, no play.`,
		bad: `Growl in a turn, or clunk play.`,
		next: `Pass if quiet and tight. Shop a growl. Do not wait for it to roar.`,
		tools: `Quiet road, hands on the tire at 12 and 6.`,
		specPlain: `No perceptible play. Growl that follows a side is that side’s bearing.`
	}),
	p("brakes.alignment", "steering", {
		what: `Alignment is whether the truck goes straight with your hands light on the wheel.`,
		where: `A straight, flat road. Note pull, wander, or a wheel that is not centered.`,
		why: `A pull plus inner pad taper is a UCA or inner-tie-rod story on this chassis.`,
		good: `Tracks straight, wheel centered.`,
		bad: `Pull L/R, wander, or a crooked wheel.`,
		next: `Pass if it tracks. Monitor a hint. Shop a pull, especially with inner tire wear.`,
		tools: `Straight road, hands light.`,
		specPlain: `No factory “degrees of pull” in the driveway. Pull that you can feel is a shop alignment after you fix worn parts.`
	}),
	p("steering.steeringPlay", "steering", {
		what: `Steering play is dead motion in the wheel before the tires move.`,
		where: `Engine idling, wheels on the ground. Watch a tire while you wiggle the wheel.`,
		why: `Play here is the box, the column, or the joints you check next.`,
		good: `Small, tight motion.`,
		bad: `You can rock the wheel a lot before the tire moves.`,
		next: `Pass if tight. Shop obvious play. 15k item.`,
		tools: `A helper to watch the tire, or a mirror.`,
		specPlain: `Minimal free play. If the tire does not move when the wheel does, keep looking at joints.`
	}),
	p("steering.tieRods", "steering", {
		what: `Tie rods are the links from the steering rack to the wheels. Inner and outer.`,
		where: `Behind the front wheels, along the rack. Jacked, wheels hanging or on stands.`,
		why: `A loose tie rod is clunk + inner tire wear + a death wobble risk.`,
		good: `No clunk, boots intact, joints tight.`,
		bad: `Clunk, torn boot, or a joint that clicks.`,
		next: `Pass if tight. Shop play. 15k.`,
		tools: `Hands, flashlight, stands.`,
		specPlain: `No perceptible play at the joint. Torn boot means the joint is next.`
	}),
	p("steering.ballJoints", "steering", {
		what: `Ball joints are the pivots that let the wheel steer and move up and down. UCA is the upper control arm — the top A-arm that holds those joints.`,
		where: `Front, top and bottom of the knuckle. Wheel off or turned out helps.`,
		why: `Tired UCAs on this truck eat inner pads and ruin alignments. That is why pad taper and a pull travel together.`,
		good: `No play, boots intact.`,
		bad: `Clunk, torn boot, or visible play at the UCA.`,
		next: `Pass if tight. Shop play. Photograph it. 15k / baseline.`,
		tools: `Pry bar gently, flashlight, camera, stands.`,
		specPlain: `No perceptible play. Replace as a pair if one UCA is gone.`,
		looksGood: `Tight, dry boots.`,
		secondLook: `Dry but dusty boot — watch.`,
		stopShop: `Play you can see — shop before the next highway trip.`
	}),
	p("steering.sway", "steering", {
		what: `The sway bar is the bar that keeps the body from leaning in a turn. Bushings and end links connect it.`,
		where: `Front (and rear) bar, links up to the control arms.`,
		why: `A clunk over driveways is often these, not the transmission.`,
		good: `Quiet, bushings not torn out.`,
		bad: `Clunk, missing link, torn bushing.`,
		next: `Pass if quiet. Shop a clunk. Cheap compared to UCAs.`,
		tools: `Hands, flashlight.`,
		specPlain: `No torn bushings, no broken links.`
	}),
	p("steering.springs", "steering", {
		what: `Springs hold the truck up. Perches and shackles are the mounts. Body mounts sit between frame and body.`,
		where: `Front coils / rear springs, shackles at the rear, body mounts along the frame.`,
		why: `A collapsed perch or a rotten body mount changes alignment and pad wear.`,
		good: `Even ride height, no cracked perches, mounts not mush.`,
		bad: `Sag, cracked perch, rotting mount.`,
		next: `Pass if even and solid. Shop sag or rot.`,
		tools: `Eyes, tape for ride height L vs R.`,
		specPlain: `Even side to side. Cracked perch is a fail.`
	}),
	p("steering.shocks", "steering", {
		what: `Shocks control bounce. Struts are the front combo units. A wet shock is a leak.`,
		where: `Each corner, on the body of the shock.`,
		why: `A wet shock plus inner tire cupping is a replace, not an alignment first.`,
		good: `Dry, bounce settles in one or two motions.`,
		bad: `Wet streak, bounce that will not die.`,
		next: `Pass if dry. Shop wet. Replace as a pair.`,
		tools: `Paper towel, bounce test.`,
		specPlain: `Wet body = leak. No factory cc of oil allowed.`
	}),
	p("steering.rack", "steering", {
		what: `The steering rack is the bar that turns both front wheels. Boots cover the inner joints. The high-pressure hose feeds it PSF.`,
		where: `Front, low, behind the engine. Boots at each end. Hose from the pump.`,
		why: `A torn boot dumps grease and then play. A wet hose is a tow-home leak.`,
		good: `Dry hose, intact boots.`,
		bad: `Torn boot, wet PSF hose.`,
		next: `Pass if dry and intact. Shop wet. Do not keep topping.`,
		tools: `Flashlight, paper towel.`,
		specPlain: `Boots whole. Hose dry. Nissan PSF only.`
	}),
	p("steering.shafts", "steering", {
		what: `Drive shafts take power to the axles. U-joints are the crosses. The slip yoke slides at the transfer case.`,
		where: `Under the truck, front and rear shafts. 4WD has both.`,
		why: `A vibration 45–70 that you did not have last year is often a U-joint, not “tires.”`,
		good: `No clunk, no rusted-solid U-joint, boot on a CV intact.`,
		bad: `Clunk on take-off, seized U-joint, torn CV boot.`,
		next: `Pass if smooth. Shop a clunk. 4WD skip front shaft on 2WD.`,
		tools: `Hands on the joint (truck in Park, stands), flashlight.`,
		specPlain: `U-joints must flex without notch. Torn CV boot is a shop.`
	}),
	p("steering.seals", "steering", {
		what: `These are the rubber seals where axles leave the diffs and where CVs meet the joint.`,
		where: `Front and rear pumpkin edges, CV inners.`,
		why: `A wet seal is gear oil or grease leaving. Low fluid follows.`,
		good: `Dry.`,
		bad: `Wet ring, flung oil.`,
		next: `Pass if dry. Shop wet.`,
		tools: `Flashlight, paper towel.`,
		specPlain: `Wet = leak. No allowed seepage once it flings.`
	}),
	p("steering.mounts", "steering", {
		what: `Engine and transmission mounts are the rubber blocks that hold the powertrain to the frame.`,
		where: `Sides of the engine, rear of the transmission. Have a helper blip Drive and Reverse with the brake on.`,
		why: `A torn mount lets the engine jump and can look like a slam shift.`,
		good: `Little rock, rubber not separated.`,
		bad: `Big clunk, rubber torn through.`,
		next: `Pass if tight. Shop a torn mount.`,
		tools: `Helper, brake on, eyes on the mount.`,
		specPlain: `No separated rubber. Excess rock in gear is a fail.`
	}),
	p("underbody.oilPan", "under", {
		what: `The oil pan is the steel bathtub under the engine. The drain plug is the bolt you pull on an oil change.`,
		where: `Dead center front under the engine.`,
		why: `A leaking pan rail or a reused crush washer drips the oil you just paid for.`,
		good: `Dry rail, new washer, no drip.`,
		bad: `Wet rail, dripping plug.`,
		next: `Pass if dry. Shop a drip. New washer every drain.`,
		tools: `Flashlight, paper towel.`,
		specPlain: `New crush washer every oil change. Confirm plug torque in the FSM — do not guess.`
	}),
	p("underbody.transPan", "under", {
		what: `The transmission pan is the wide pan under the gearbox. Cooler fittings are those two small lines at the radiator — also check them from below.`,
		where: `Mid truck, under the transmission. Fittings also at the radiator tank.`,
		why: `Wet fittings from below are the same SMOD story. Pan seepage is fluid you will be adding.`,
		good: `Dry pan, dry fittings.`,
		bad: `Wet pan or wet cooler lines.`,
		next: `Pass if dry. Shop wet. Photograph fittings.`,
		tools: `Flashlight, camera, paper towel.`,
		specPlain: `Wet cooler fittings = SMOD risk even if ATF still looks red.`
	}),
	p("underbody.fuel", "under", {
		what: `Fuel tank, straps, lines, and the EVAP (vapor) bits. EVAP is the system that keeps gas vapor in the can, not in the air.`,
		where: `Under the rear. Tank held by straps. Lines along the frame.`,
		why: `A fuel smell or a wet line is a fire problem, not a “next oil change” problem.`,
		good: `Dry, straps intact, no raw-fuel smell.`,
		bad: `Wet line, rusted-through strap, strong fuel smell.`,
		next: `Pass if dry. Do not drive a wet fuel line.`,
		tools: `Flashlight, nose, camera.`,
		specPlain: `Any wet fuel is a stop. Straps must be whole.`
	}),
	p("underbody.exhaust", "under", {
		what: `Exhaust is the pipe from the manifolds back: cats, muffler, hangers, heat shields.`,
		where: `Full length underside. Heat shields over cats and near the cab.`,
		why: `Broken hangers drag. Shield bolts on this truck rattle and then fall on the highway.`,
		good: `Hung, no blow, shields present.`,
		bad: `Blow at a flange, hanging shield, broken hanger.`,
		next: `Pass if quiet and hung. Shop a blow or a dragging shield.`,
		tools: `Ears (cold), flashlight, a glove on a cold pipe only.`,
		specPlain: `No leaks, hangers intact, shields present. VK56 heat-shield bolts are a known miss.`
	}),
	p("underbody.frame", "under", {
		what: `The frame is the steel ladder the body sits on. Spare-tire carrier hangs under the rear.`,
		where: `Rails from bumper to bumper. Spare winch under the rear.`,
		why: `Rust at running-board mounts and the spare carrier is how these trucks get dangerous, not just ugly.`,
		good: `Surface rust only, carrier works, mounts solid.`,
		bad: `Scale you can poke through, frozen spare winch, rotten board mounts.`,
		next: `Pass if solid. Shop rot you can poke. Photograph it.`,
		tools: `Flashlight, a screwdriver to probe (gently), camera.`,
		specPlain: `No perforation in load paths. Spare must come down.`
	}),
	p("underbody.lines", "under", {
		what: `Steel brake and fuel lines run along the frame.`,
		where: `Inside the frame rails, front to back.`,
		why: `Rusty brake line is a blowout later. Fuel line rust is a fire.`,
		good: `Surface film, still round, no flakes.`,
		bad: `Flaking rust, wet, crimped.`,
		next: `Pass if solid. Shop flaking brake lines before a long trip.`,
		tools: `Flashlight, camera.`,
		specPlain: `Brake lines must be round and dry. Flake-off rust is a replace.`
	}),
	p("cabin.airbag", "cabin", {
		what: `The airbag lamp is the light that says the bags are ready. It must come on at key-on, then go out.`,
		where: `Cluster. Key ON.`,
		why: `A bag lamp that stays on means the bag may not fire — or may fire for no reason. That is a stop with other faults.`,
		good: `Prove-out then off.`,
		bad: `Stays on or blinks.`,
		next: `Pass if it goes out. Shop a stay-on. Do not drive if it stays on and you already have brake/electrical chaos.`,
		tools: `Key, camera.`,
		specPlain: `Must prove out then off. Stay-on is a hard gate.`
	}),
	p("cabin.seatbelts", "cabin", {
		what: `Seatbelts latch and pull back in. All rows, including the third.`,
		where: `Every seating position.`,
		why: `A belt that will not latch is not a “later” item.`,
		good: `Latches, retracts, no cuts.`,
		bad: `Will not click, stuck, or sliced webbing.`,
		next: `Pass if all work. Shop a dead latch. Do not drive kids on a dead belt.`,
		tools: `Your hands.`,
		specPlain: `Every position latches and retracts. Cuts in webbing are a replace.`
	}),
	p("cabin.latches", "cabin", {
		what: `Doors, rear hatch, and the flip-up rear glass must latch.`,
		where: `All four doors, hatch, glass.`,
		why: `A hatch that pops on the highway is a wreck, not an annoyance.`,
		good: `All click shut, no dash “door ajar” lie.`,
		bad: `Will not latch, or glass that pops.`,
		next: `Pass if they click. Shop a hatch that will not die.`,
		tools: `Your hands. Open and shut each one.`,
		specPlain: `Must stay shut. Ajar lamp with a shut door is still a fail of the switch or latch.`
	}),
	p("cabin.horn", "cabin", {
		what: `The horn is the button in the wheel that makes noise so people look up.`,
		where: `Steering-wheel pad.`,
		why: `A dead horn is a safety fail and a ticket in some places.`,
		good: `Loud, both tones if it has two.`,
		bad: `Dead or a weak chirp.`,
		next: `Pass if it honks. Shop a dead one.`,
		tools: `Your palm.`,
		specPlain: `Must sound. Clock-spring issues can kill the horn and the bag lamp together.`
	}),
	p("cabin.lights", "cabin", {
		what: `Lights: headlights, high beams, fogs, tails, brake, reverse, plate, hazards.`,
		where: `Walk around. A helper on the brake and the shifter in Reverse (brake on).`,
		why: `A dark brake light is how someone finds your bumper.`,
		good: `All work, lenses not opaque white.`,
		bad: `Out bulb, water in a lamp, no reverse lights.`,
		next: `Pass if the walk-around is complete. Replace bulbs. Shop a wet housing.`,
		tools: `Helper, dark-ish spot.`,
		specPlain: `Every required lamp works. Hazards too.`
	}),
	p("cabin.wipers", "cabin", {
		what: `Wipers and washers, front and rear.`,
		where: `In the seat. Rear wiper on the hatch.`,
		why: `You cannot inspect what you cannot see in a Ventura County marine layer.`,
		good: `Clears the glass, washers squirt front and rear.`,
		bad: `Streaks to the bone, rear dead, no squirt.`,
		next: `Pass if they clear. Blades are DIY. Shop a dead motor.`,
		tools: `Washer fluid, the stalk.`,
		specPlain: `Front and rear wipe. Washers wet the glass.`
	}),
	p("cabin.hvac", "cabin", {
		what: `Defroster and the blower are how you see and breathe. HVAC is heating, vent, air conditioning.`,
		where: `Dash. Defrost at the windshield. Blower speed 1–4.`,
		why: `No defrost in a rain is a safety fail.`,
		good: `Air at the windshield, blower on all speeds, A/C blows cold if equipped.`,
		bad: `Dead blower, no defrost, A/C warm in summer.`,
		next: `Pass if defrost and blower work. Shop a dead blower. A/C can wait if it is not safety.`,
		tools: `The knobs, a minute of run time.`,
		specPlain: `Defrost must hit the glass. Blower must run.`
	}),
	p("cabin.glass", "cabin", {
		what: `Mirrors and glass. Cracks in the view are a problem.`,
		where: `Windshield, all side glass, both mirrors, rear glass.`,
		why: `A crack in the driver’s view is a ticket and a blow risk.`,
		good: `No crack in the wiper sweep. Mirrors intact.`,
		bad: `Star in the sweep, missing mirror glass.`,
		next: `Pass if clear. Shop a sweep crack.`,
		tools: `Eyes, camera.`,
		specPlain: `No damage in the driver’s essential view. Mirror glass present.`
	}),
	p("cabin.jack", "cabin", {
		what: `Jack, lug wrench, and the spare — so a flat is a delay, not a tow.`,
		where: `Spare under the rear. Jack often in a side bin or under a seat. Try the spare winch.`,
		why: `A frozen spare carrier is a 2005 Armada classic. You find out on the shoulder.`,
		good: `Spare holds air, wrench fits, jack present, carrier works.`,
		bad: `No jack, frozen winch, spare at 10 psi.`,
		next: `Pass if the kit works. Fix a frozen winch before a trip.`,
		tools: `Gauge, the factory wrench, a minute with the winch.`,
		specPlain: `Spare present and usable. Carrier must lower. Lug wrench matches the lugs.`
	}),
	p("cabin.recalls", "cabin", {
		what: `A recall is a free factory fix Nissan (or NHTSA) still owes this VIN.`,
		where: `You look it up from the VIN plate — dash, driver side, visible through the glass.`,
		why: `Airbag and sensor campaigns on this era are real. A dated check is what makes the paper form defensible later.`,
		good: `VIN checked today, stamp on the form, open campaigns listed or “none.”`,
		bad: `Skipped, or a VIN that is not 17 characters.`,
		next: `Run the check. Pass if none open. Shop/dealer if an open campaign is a safety one.`,
		tools: `VIN, phone, the in-app Nissan campaign button.`,
		specPlain: `Dated “checked Nissan campaign list on [date]” with this VIN. Not a checkbox from memory.`
	}),
	p("road.coldStart", "engine", {
		what: `A cold start is the first start of the visit, before the engine is warm.`,
		where: `Driveway. Listen. Do not rev.`,
		why: `Timing-cover rattle and manifold tick show up here, then hide when hot.`,
		good: `Fires, idle settles, rattle gone in 1–3 sec or never there.`,
		bad: `Ongoing rattle, no-start, or a CEL that stays.`,
		next: `Pass if it settles. Pair this with the timing-cover and manifold rows.`,
		tools: `Ears, a timer.`,
		specPlain: `Same as the timing-cover row. Do not rev a cold VK56 to “clear it.”`
	}),
	p("road.overheat", "coolant", {
		what: `The temp gauge is the needle that says the engine is not boiling.`,
		where: `Cluster, during a 15-minute mixed drive.`,
		why: `A climb past the middle on this truck is a radiator, cap, or fan story — and it can become SMOD if the tanks are original.`,
		good: `Needle stays in the normal middle.`,
		bad: `Climb, hot warning, or steam.`,
		next: `Pass if stable. Stop if it climbs. Do not keep driving hot.`,
		tools: `A mixed loop, eyes on the gauge.`,
		specPlain: `Gauge stable in the normal range. Any climb after 15 min mixed driving is a fail.`
	}),
	p("road.brakes", "pads", {
		what: `A real stop from 30 and from 60, not a parking-lot poke.`,
		where: `Quiet road. No one behind you.`,
		why: `Pull and pulse show up at speed. That is pads, rotors, or a caliper.`,
		good: `Straight, no pulse, no pull.`,
		bad: `Pull, pulse, grind, or a long pedal.`,
		next: `Pass if straight and quiet. Shop a pulse/pull. Stop if it grinds metal.`,
		tools: `Safe road.`,
		specPlain: `No pull, no pulse from 30 and from 60.`
	}),
	p("road.vibration", "tire", {
		what: `A shake in the wheel or seat between 45 and 70 that you did not have last year.`,
		where: `Highway, light hands.`,
		why: `Tires, a U-joint, or a bent wheel. New vibration is a find-it, not “the freeway is rough.”`,
		good: `Smooth.`,
		bad: `New shake in that band.`,
		next: `Pass if smooth. Shop a new vibration. 15k item.`,
		tools: `A highway loop.`,
		specPlain: `No new vibration 45–70 mph.`
	}),
	p("road.shifts", "trans", {
		what: `This is a check that the road still matches the shift table you already filled.`,
		where: `The same loop.`,
		why: `A flare that only happens hot will show here, not in the driveway.`,
		good: `Matches the table. No new bang.`,
		bad: `New flare or bang that the table missed.`,
		next: `Pass if it matches. Shop a new harsh shift. Skip the loop if ATF is milky.`,
		tools: `The filled shift table.`,
		specPlain: `Shift quality matches Section 3. No new faults.`
	}),
	p("road.lamps", "cabin", {
		what: `Warning lamps that were off should stay off after the drive.`,
		where: `Cluster, after the loop.`,
		why: `A lamp that appears hot is a real fault, not a prove-out.`,
		good: `No new lamp.`,
		bad: `CEL, ABS, bag, or SLIP that was not there.`,
		next: `Pass if the cluster is as you left it. Shop a new stay-on lamp.`,
		tools: `Eyes, camera.`,
		specPlain: `No new warning lamps.`
	}),
	p("baseline.sparkPlugs", "engine", {
		what: `Spark plugs are the igniters in each cylinder. This engine uses long-life iridium plugs.`,
		where: `Under coils on top of each bank. 8 of them.`,
		why: `The interval is 105k. At 270k you are on cycle 2 or 3 — they are due unless you have a dated receipt.`,
		good: `Dated service within 105k, or you just did them.`,
		bad: `Unknown, or way past 105k since last.`,
		next: `Pass with a receipt. Fail unknown at 270k. This is a baseline grade, not a note.`,
		tools: `Records, or a shop to pull one plug.`,
		specPlain: `Iridium interval 105,000 miles. Cycle 2 or 3 at 270k.`
	}),
	p("baseline.coolantService", "coolant", {
		what: `A coolant service is drain, flush, new cap, and a look at the thermostat and the water-pump weep hole.`,
		where: `Radiator, cap, thermostat housing, weep at the pump (small hole on the pump body).`,
		why: `Unknown coolant at 270k is rust and a popped tank waiting. A wet weep is a pump about to go.`,
		good: `Dated service, dry weep, cap in date.`,
		bad: `Unknown, wet weep, rusty sludge.`,
		next: `Pass with a dated service and a dry weep. Fail unknown. Baseline grade.`,
		tools: `Records, flashlight on the weep.`,
		specPlain: `About 60k / 5 years if unknown. Weep hole must be dry.`
	}),
	p("baseline.brakeFluid", "brake", {
		what: `Brake fluid service is a DOT 3 flush and a moisture check.`,
		where: `Same master cylinder. Moisture tester if you have one.`,
		why: `Old DOT 3 eats internals and boils on a long grade.`,
		good: `Flushed inside 24 months, light color, dry moisture.`,
		bad: `Black fluid, high moisture, unknown at 270k.`,
		next: `Pass with a dated flush. Fail unknown or wet. Baseline grade.`,
		tools: `Moisture tester, sealed DOT 3.`,
		specPlain: `DOT 3. Flush every 24 months. High moisture is a fail.`
	}),
	p("baseline.diffFluid", "under", {
		what: `Diff and transfer-case fluid is the oil in the pumpkins and the 4WD box — not just a look for seep.`,
		where: `Fill plugs on front diff (4WD), rear diff, transfer case.`,
		why: `At 270k “it isn’t dripping” is not a fluid change. Metal in the oil is a warning.`,
		good: `Dated service, clean-ish oil on the plug.`,
		bad: `Unknown, glitter, burnt.`,
		next: `Pass with a dated service. Fail unknown. Baseline grade.`,
		tools: `Records, 10 mm / square plug as fitted.`,
		specPlain: `Service at 30k cadence. Baseline at 270k wants a dated change, not a dry housing.`
	}),
	p("baseline.seepage", "leak", {
		what: `Seepage grade is how wet the gaskets are: dry, film, wet, or drip.`,
		where: `Valve covers, timing cover, oil pan.`,
		why: `A drip is a leak. A film is a watch. Calling a drip “high miles” is how the stick goes empty.`,
		good: `Dry or light film.`,
		bad: `Wet or drip.`,
		next: `Pass dry/film. Fail wet/drip. Photograph. Baseline grade.`,
		tools: `Flashlight, paper towel, camera.`,
		specPlain: `Dry / film / wet / drip. Wet and drip are Fail.`
	}),
	p("baseline.manifoldBolts", "engine", {
		what: `Exhaust manifold and heat-shield bolts on this VK56 like to snap and rattle.`,
		where: `Each bank, shields over the manifolds.`,
		why: `A ticking heat shield is annoying. A broken manifold bolt is a leak and a repair.`,
		good: `Bolts present, shields quiet.`,
		bad: `Missing bolts, rattle, soot.`,
		next: `Pass if present and quiet. Fail missing/broken. Baseline grade.`,
		tools: `Flashlight, ears, cold engine.`,
		specPlain: `All shield and manifold fasteners present. VK56 classic.`
	}),
	p("baseline.ucaJoints", "steering", {
		what: `Upper control arms and ball joints — same parts as the steering row, graded Pass/Fail at 270k.`,
		where: `Front, top A-arms.`,
		why: `Play here is inner pad taper and a pull. At 270k this is due or proven tight.`,
		good: `Tight, boots intact.`,
		bad: `Play, torn boot.`,
		next: `Pass if tight. Fail play. Baseline grade.`,
		tools: `Pry bar, flashlight, camera.`,
		specPlain: `No play. Replace as a pair. Ties to alignment and inner pad taper.`
	}),
	p("baseline.airShocks", "steering", {
		what: `Some Armadas have rear load-leveling / air shocks instead of plain shocks.`,
		where: `Rear shocks. Air lines and a compressor mean equipped.`,
		why: `A sagging rear with a compressor that never sleeps is a leak, not “it is old.”`,
		good: `Not equipped (Pass), or equipped, level, dry, compressor quiet.`,
		bad: `Sag, wet air shock, compressor short-cycling.`,
		next: `Pass if not equipped or if equipped and healthy. Fail sag/leak. Baseline grade.`,
		tools: `Eyes, bounce, listen after a door slam.`,
		specPlain: `Equipped Y/N. If Y: level, dry, compressor not constant.`
	}),
	p("result.smodPlan", "radiator", {
		what: `The transmission cooler is built into the radiator. Prevention means an external cooler and a new radiator before they mix.`,
		where: `Radiator end-tank fittings, plus a date on the radiator if it was replaced.`,
		why: `At 270k, “not milky today” is not a maintenance plan. Detection is SMOD. This row is prevention.`,
		good: `External cooler in, radiator dated, fittings photo on file, ATF still red.`,
		bad: `Original or unknown radiator, in-radiator cooler still in service, no fittings photo.`,
		next: `Do not Pass because it is not milky today. Schedule the cooler + radiator. If ATF is already milky, stop — prevention is too late.`,
		tools: `Camera, the radiator date, a shop that will cap the old ports.`,
		specPlain: `This shop’s 30k / 270k action: external stacked-plate cooler, cap the in-radiator ports, replace an original/unknown radiator.`,
		looksGood: `Bypass done, radiator dated, photo on file.`,
		secondLook: `Still red ATF, original radiator — schedule it.`,
		stopShop: `Already milky — do not bypass-and-drive.`
	}),
	p("result.overall", "cabin", {
		what: `This is the one-line verdict for the whole visit.`,
		where: `End of the form. Score and flags already sat at the top.`,
		why: `Pass is blocked if a hard gate is open: SMOD, pad at 1 mm, rotor at min, dead rest voltage, ABS/airbag lamp staying on, low pedal, ongoing timing rattle plus low oil.`,
		good: `No hard gates. Pass or Pass with notes for watch items.`,
		bad: `Any Repair ASAP / do-not-drive gate.`,
		next: `Do not circle Pass to be nice. Schedule repairs or Do not drive when the gates say so.`,
		tools: `The score header, the fail-item list, a pen.`,
		specPlain: `Hard gates auto-block Pass. Score starts at 100, minus 15 / 6 / 2 for ASAP / attention / monitor.`
	}),
	p("engine.overview", "engine", {
		what: `One wide photo of the whole bay so a shop or a spouse can see tanks, belt, battery, and leaks in context.`,
		where: `Stand at the front bumper, hood open, before you start moving things.`,
		why: `A close-up of a fitting without this shot is hard to trust later.`,
		good: `Level, lit, tanks and battery in frame.`,
		bad: `Dark, cropped, or taken after you already cleaned the evidence.`,
		next: `Required photo. Take it first.`,
		tools: `Phone camera.`,
		specPlain: `Required on this visit. One wide shot.`
	}),
	p("cabin.dash", "cabin", {
		what: `A photo of the dash with the key on, so the prove-out (or a lamp that stayed) is on the paper.`,
		where: `Driver seat, cluster in frame.`,
		why: `“I think the ABS went out” is not a photo. This is.`,
		good: `Cluster readable, key on.`,
		bad: `Glare, engine already running and you missed prove-out.`,
		next: `Required photo. Take it at key-on.`,
		tools: `Phone camera.`,
		specPlain: `Required. Key on.`
	})
];
var BY_ID = new Map(PLAIN.map((x) => [x.id, x]));
function plainFor(id) {
	return BY_ID.get(id);
}
function PlainButton({ id, title }) {
	const openPlain = useInspection((s) => s.openPlain);
	if (!plainFor(id)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => openPlain(id),
		className: "tap-44 inline-flex items-center gap-1 px-1 text-sm font-medium text-primary",
		"aria-label": `What does ${title} mean?`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4" }), "What does this mean?"]
	});
}
function PlainSheet() {
	const id = useInspection((s) => s.plainId);
	const close = useInspection((s) => s.closePlain);
	const jumpToGuide = useInspection((s) => s.jumpToGuide);
	const card = id ? plainFor(id) : void 0;
	if (!id || !card) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overlay-frame z-[55] flex flex-col bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-2 px-4 pt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "traveler-stamp text-xs text-primary",
				children: "What does this mean?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold text-balance text-foreground",
				children: "Beginner card"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "tap-44 grid place-items-center",
				onClick: close,
				"aria-label": "Close",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-6" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "app-scroll space-y-4 px-4 pt-3 pb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideDiagram, { kind: card.diagram }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-pretty text-foreground",
					children: card.what
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-pretty text-foreground",
					children: card.where
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-card space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "field-label",
						children: "Why this matters"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-pretty text-foreground",
						children: card.why
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm leading-relaxed text-pretty text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-pass",
						children: "Good: "
					}), card.good]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm leading-relaxed text-pretty text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-fail",
						children: "Bad: "
					}), card.bad]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-pretty text-foreground",
					children: card.next
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						close();
						jumpToGuide(id);
					},
					className: "tap-44 inline-flex w-full items-center justify-center gap-2 rounded bg-primary font-medium text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), "Open the how-to Guide"]
				})
			]
		})]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var scanYardPhoto = createServerFn({ method: "POST" }).validator((d) => privacyPayload({
	stepId: d.stepId ?? "",
	stepName: d.stepName ?? "",
	slotLabel: d.slotLabel ?? "",
	imageDataUrl: d.imageDataUrl,
	transcript: d.transcript
})).handler(createSsrRpc("60e56da355178ffd4841481c74b0fc5d7ae6372994af8ee75fb2b4d2ae65bc87"));
var transcribeYardVoice = createServerFn({ method: "POST" }).validator((d) => ({ audioDataUrl: typeof d.audioDataUrl === "string" && d.audioDataUrl.startsWith("data:audio/") ? d.audioDataUrl.slice(0, 2e6) : "" })).handler(createSsrRpc("a4b120de4b2e437922a31b9946481af9e27c7d91f9b9fba5dba69d8c77b1282b"));
function itemIdOf(slot, fallback) {
	return photoSlotDef(slot)?.itemId || fallback || slot;
}
async function requestGrokScan(opts) {
	const itemId = itemIdOf(opts.slot, opts.itemId);
	if (opts.source === "photo" && !isScanAllowedSlot(opts.slot)) return;
	if (typeof navigator !== "undefined" && navigator.onLine === false) return;
	const state = useInspection.getState();
	if (state.grokBusy[itemId]) return;
	const hash = opts.imageDataUrl ? photoHash(opts.imageDataUrl) : `voice:${(opts.transcript || "").slice(0, 40)}`;
	if (opts.auto && opts.imageDataUrl && !shouldAutoScan(state.draft.grokScan?.[itemId], opts.slot, hash)) return;
	useInspection.setState({
		grokBusy: {
			...state.grokBusy,
			[itemId]: true
		},
		grokError: {
			...state.grokError,
			[itemId]: ""
		}
	});
	try {
		const res = await scanYardPhoto({ data: privacyPayload({
			stepId: itemId,
			stepName: opts.stepName || STATUS_ROW_LABELS[itemId] || itemId,
			slotLabel: photoSlotDef(opts.slot)?.label || opts.slot,
			imageDataUrl: opts.imageDataUrl,
			transcript: opts.transcript
		}) });
		if (!res.ok) {
			if (!opts.auto) useInspection.setState((s) => ({ grokError: {
				...s.grokError,
				[itemId]: res.message
			} }));
			return;
		}
		const suggestion = {
			...sanitizeSuggestion(res.json),
			itemId,
			slot: opts.slot,
			source: opts.source,
			photoHash: hash,
			at: Date.now()
		};
		state.patch((d) => {
			if (!d.grokScan) d.grokScan = {};
			d.grokScan[itemId] = suggestion;
		});
	} catch {
		if (!opts.auto) useInspection.setState((s) => ({ grokError: {
			...s.grokError,
			[itemId]: "Grok could not read this photo."
		} }));
	} finally {
		useInspection.setState((s) => {
			const grokBusy = { ...s.grokBusy };
			delete grokBusy[itemId];
			return { grokBusy };
		});
	}
}
function clearGrokError(itemId) {
	useInspection.setState((s) => {
		if (!s.grokError[itemId]) return s;
		const grokError = { ...s.grokError };
		delete grokError[itemId];
		return { grokError };
	});
}
function acceptGrok(itemId, photos) {
	const g = useInspection.getState().draft.grokScan?.[itemId];
	if (!g || g.dismissed) return;
	const status = grokStatusToItem(g.suggestedStatus);
	useInspection.getState().patch((d) => {
		applyWalkChoice(d, itemId, status, photos);
		setRowNotes(d, itemId, appendNote(rowNotes(d, itemId), g.whatItSees));
		if (!d.grokScan) d.grokScan = {};
		d.grokScan[itemId] = {
			...g,
			confirmed: true,
			editing: false,
			dismissed: false
		};
	});
	clearGrokError(itemId);
	if (g.slot && g.whereOnPhoto) {
		const shot = useInspection.getState().photos[g.slot];
		if (shot && !shot.caption?.trim()) useInspection.getState().setPhoto(g.slot, {
			...shot,
			caption: g.whereOnPhoto
		});
	}
}
function editGrok(itemId) {
	const g = useInspection.getState().draft.grokScan?.[itemId];
	if (!g) return;
	useInspection.getState().patch((d) => {
		if (!d.grokScan) d.grokScan = {};
		d.grokScan[itemId] = {
			...g,
			editing: true,
			confirmed: false,
			dismissed: false
		};
		setRowNotes(d, itemId, appendNote(rowNotes(d, itemId), g.whatItSees));
	});
	clearGrokError(itemId);
}
function ignoreGrok(itemId) {
	const g = useInspection.getState().draft.grokScan?.[itemId];
	if (!g) return;
	useInspection.getState().patch((d) => {
		if (!d.grokScan) d.grokScan = {};
		d.grokScan[itemId] = {
			...g,
			dismissed: true,
			editing: false
		};
	});
	clearGrokError(itemId);
}
function markGrokConfirmedIfEditing(itemId) {
	const g = useInspection.getState().draft.grokScan?.[itemId];
	if (!g || !g.editing || g.dismissed) return;
	useInspection.getState().patch((d) => {
		if (!d.grokScan?.[itemId]) return;
		d.grokScan[itemId] = {
			...d.grokScan[itemId],
			confirmed: true,
			editing: false
		};
	});
}
async function transcribeIfNeeded(audioDataUrl) {
	if (typeof navigator !== "undefined" && navigator.onLine === false) return "";
	try {
		const res = await transcribeYardVoice({ data: { audioDataUrl } });
		if (res.ok) return res.text;
	} catch {}
	return "";
}
function GrokScanBanner({ itemId, slots, stepName }) {
	const scans = useInspection((s) => s.draft.grokScan);
	const busy = useInspection((s) => Boolean(s.grokBusy[itemId] || slots.some((sl) => s.grokBusy[photoSlotDef(sl)?.itemId ?? ""])));
	const error = useInspection((s) => s.grokError[itemId] || slots.map((sl) => s.grokError[photoSlotDef(sl)?.itemId ?? ""]).find(Boolean) || "");
	const photos = useInspection((s) => s.photos);
	const notes = useInspection((s) => rowNotes(s.draft, itemId));
	const g = suggestionForItem(scans, itemId, slots);
	const key = g?.itemId || itemId;
	if (busy) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-card space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "traveler-stamp text-xs text-primary",
			children: "Grok"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-foreground",
			children: "Grok is looking at this photo… Walk is not blocked."
		})]
	});
	if (error && !g) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-card space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-foreground",
			children: error
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Set the status yourself. Photo and autosave still count."
		})]
	});
	if (g && !g.dismissed && !g.confirmed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-card space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "traveler-stamp text-xs text-primary",
				children: "Grok suggestion — not a diagnosis. You confirm."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg font-semibold tracking-wide",
				children: GROK_STATUS_LABEL[g.suggestedStatus]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base leading-snug text-foreground",
				children: g.whatItSees
			}),
			g.whereOnPhoto ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: ["Circle: ", g.whereOnPhoto]
			}) : null,
			g.askInspector ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-foreground",
				children: g.askInspector
			}) : null,
			g.editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Edit the note, then tap a status. Grok does not submit the item."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => acceptGrok(key, photos),
						className: "tap-56 rounded bg-primary font-semibold text-primary-foreground",
						children: "Accept"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => editGrok(key),
						className: "tap-56 rounded border border-border bg-raised font-semibold",
						children: "Edit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => ignoreGrok(key),
						className: "tap-56 rounded border border-border bg-inset font-semibold",
						children: "Ignore"
					})
				]
			})
		]
	});
	const noteScan = notes.trim();
	if (!g && noteScan) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => void requestGrokScan({
			itemId,
			slot: slots[0] || itemId,
			stepName,
			transcript: noteScan,
			auto: false,
			source: "voice"
		}),
		className: "tap-56 inline-flex w-full items-center justify-center gap-2 rounded border border-border bg-raised font-semibold",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { className: "size-5" }), "Scan note"]
	});
	if (g?.confirmed) {
		const line = grokReportLine(g);
		return line ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: line
		}) : null;
	}
	return null;
}
function ScanPhotoButton({ slot, itemId, stepName }) {
	const shot = useInspection((s) => s.photos[slot]);
	const busy = useInspection((s) => Boolean(s.grokBusy[itemId] || s.grokBusy[photoSlotDef(slot)?.itemId ?? ""]));
	if (!shot?.dataUrl) return null;
	if (!isScanAllowedSlot(slot)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		disabled: busy,
		onClick: () => void requestGrokScan({
			itemId,
			slot,
			stepName,
			imageDataUrl: shot.dataUrl,
			auto: false,
			source: "photo"
		}),
		className: "tap-56 col-span-2 inline-flex items-center justify-center gap-2 rounded border border-border bg-raised text-sm font-semibold disabled:opacity-40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { className: "size-5" }), busy ? "Scanning…" : "Scan photo"]
	});
}
var WalkEmbed = (0, import_react.createContext)(false);
function ConfirmPair({ onCancel, onConfirm, confirmLabel = "Delete" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2 gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onCancel,
			className: "tap-56 rounded border border-border bg-raised font-semibold",
			children: "Cancel"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onConfirm,
			className: "tap-56 rounded bg-fail font-semibold text-foreground",
			children: confirmLabel
		})]
	});
}
function CheckHit({ on, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": true,
		"data-on": on ? "true" : "false",
		className: cn("check-hit grid size-14 shrink-0 place-items-center border-2", on ? "border-pass bg-pass text-background" : "border-line bg-inset text-transparent", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-7",
			strokeWidth: 3
		})
	});
}
var VERDICT_OPTIONS = [{
	value: "pass",
	label: "Pass"
}, {
	value: "fail",
	label: "Fail"
}];
function VerdictSelect({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
		label: "Grade — Pass or Fail, not a note",
		value,
		options: VERDICT_OPTIONS,
		onChange
	});
}
function ChipSelect({ label, value, options, onChange, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "field-label",
			children: label
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-1.5",
			children: options.map((o) => {
				const active = value === o.value;
				const locked = disabled || o.disabled;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: locked,
					onClick: () => onChange(active ? "" : o.value),
					className: cn("tap-56 rounded border px-3 text-sm font-semibold", active ? "chip-on" : "chip-off", locked && "opacity-40"),
					children: o.label
				}, o.value);
			})
		})]
	});
}
function TextField({ label, value, onChange, placeholder, inputMode, disabled, id }) {
	const numeric = inputMode === "numeric" || inputMode === "decimal";
	function bump(dir) {
		const n = Number(String(value).replace(/[^\d.-]/g, ""));
		const step = inputMode === "decimal" ? .1 : 1;
		const next = (Number.isFinite(n) ? n : 0) + dir * step;
		const rounded = inputMode === "decimal" ? Math.round(next * 10) / 10 : Math.round(next);
		onChange(String(rounded));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "field-label",
			children: label
		}), numeric ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled,
					onClick: () => bump(-1),
					className: "tap-56 shrink-0 rounded border border-border bg-raised text-xl font-bold",
					"aria-label": "Decrease",
					children: "−"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id,
					value,
					disabled,
					inputMode,
					placeholder,
					onChange: (e) => onChange(e.target.value),
					className: "field-input min-w-0 flex-1 text-center text-lg placeholder:text-muted-foreground"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled,
					onClick: () => bump(1),
					className: "tap-56 shrink-0 rounded border border-border bg-raised text-xl font-bold",
					"aria-label": "Increase",
					children: "+"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			value,
			disabled,
			inputMode,
			placeholder,
			onChange: (e) => onChange(e.target.value),
			className: "field-input placeholder:text-muted-foreground"
		})]
	});
}
function NotesField({ value, onChange, placeholder = "Notes" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		value,
		onChange: (e) => onChange(e.target.value),
		placeholder,
		rows: 2,
		className: "field-input min-h-14 py-2 placeholder:text-faint"
	});
}
function PhotoField({ slot, required, label }) {
	const embed = (0, import_react.useContext)(WalkEmbed);
	const shot = useInspection((s) => s.photos[slot]);
	const photos = useInspection((s) => s.photos);
	const skip = useInspection((s) => photoSkipReason(s.draft, slot));
	const setPhoto = useInspection((s) => s.setPhoto);
	const clearPhoto = useInspection((s) => s.clearPhoto);
	const setPhotoSkip = useInspection((s) => s.setPhotoSkip);
	const inputRef = (0, import_react.useRef)(null);
	const galleryRef = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [marking, setMarking] = (0, import_react.useState)(false);
	const [skipOpen, setSkipOpen] = (0, import_react.useState)(false);
	const [skipText, setSkipText] = (0, import_react.useState)(skip);
	const [confirmClear, setConfirmClear] = (0, import_react.useState)(false);
	const must = required ?? isRequiredPhotoSlot(slot);
	const title = label || photoSlotDef(slot)?.label || "Photo";
	const def = photoSlotDef(slot);
	const covered = Boolean(shot) || (def ? hasPhoto(photos, def) : false);
	if (embed) return null;
	async function onFile(file) {
		if (!file) return;
		setBusy(true);
		try {
			const compressed = await compressPhoto(file);
			setPhoto(slot, {
				...compressed,
				originalDataUrl: compressed.dataUrl
			});
			if (isAutoScanSlot(slot) && compressed.dataUrl) requestGrokScan({
				itemId: def?.itemId || slot,
				slot,
				stepName: title,
				imageDataUrl: compressed.dataUrl,
				auto: true,
				source: "photo"
			});
		} catch {} finally {
			setBusy(false);
			if (inputRef.current) inputRef.current.value = "";
			if (galleryRef.current) galleryRef.current.value = "";
		}
	}
	if (marking && shot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoMarkup, {
		shot,
		onSave: (next) => {
			setPhoto(slot, next);
			setMarking(false);
		},
		onCancel: () => setMarking(false)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept: "image/*",
				capture: "environment",
				className: "hidden",
				onChange: (e) => void onFile(e.target.files?.[0])
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: galleryRef,
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: (e) => void onFile(e.target.files?.[0])
			}),
			shot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "field-label",
						children: must ? `${title} · required` : title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative overflow-hidden rounded border border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: shot.dataUrl,
							alt: shot.caption || title,
							className: "max-h-40 w-full object-cover outline outline-1 -outline-offset-1 outline-foreground/10"
						})
					}),
					shot.caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-foreground",
						children: shot.caption
					}) : null,
					confirmClear ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmPair, {
						onCancel: () => setConfirmClear(false),
						onConfirm: () => {
							clearPhoto(slot);
							setConfirmClear(false);
						}
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setMarking(true),
								className: "tap-56 inline-flex items-center justify-center gap-1 rounded border border-border bg-inset text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Mark up"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setConfirmClear(true),
								className: "tap-56 rounded border border-fail bg-inset text-sm font-semibold text-fail",
								children: "Delete photo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy,
								onClick: () => inputRef.current?.click(),
								className: "tap-56 col-span-2 rounded border border-border bg-inset text-sm font-semibold",
								children: "Retake"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanPhotoButton, {
								slot,
								itemId: def?.itemId || slot,
								stepName: title
							})
						]
					})
				]
			}) : skip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded border border-border bg-inset px-3 py-2 text-sm text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "field-label",
						children: title
					}),
					"N/A — ",
					skip,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "tap-56 mt-1 block w-full rounded border border-border bg-raised font-semibold text-primary",
						onClick: () => setPhotoSkip(slot, ""),
						children: "Clear skip"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "field-label",
					children: must ? `${title} · required` : title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy,
						onClick: () => inputRef.current?.click(),
						className: "tap-56 flex items-center justify-center gap-2 rounded border border-dashed border-line bg-inset text-sm font-semibold text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-5" }), busy ? "Saving…" : "Camera"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: busy,
						onClick: () => galleryRef.current?.click(),
						className: "tap-56 rounded border border-border bg-raised text-sm font-semibold",
						children: "Gallery"
					})]
				})]
			}),
			must && !covered && !skip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-warn",
				children: [title, ": missing (photo required)."]
			}) : null,
			must && !shot && !skip ? skipOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
					value: skipText,
					onChange: setSkipText,
					placeholder: "Reason this photo is N/A"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						if (skipText.trim()) {
							setPhotoSkip(slot, skipText);
							setSkipOpen(false);
						}
					},
					className: "tap-56 w-full rounded border border-border bg-inset text-sm font-semibold",
					children: "Save N/A reason"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setSkipOpen(true),
				className: "tap-56 w-full rounded border border-border bg-raised text-sm font-semibold text-foreground",
				children: "N/A — can’t get this photo"
			}) : null
		]
	});
}
function CornerPhotos({ prefix, required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-2",
		children: PHOTO_CORNERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "field-label",
				children: c.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoField, {
				slot: `${prefix}.${c.key}`,
				required,
				label: `${c.label} photo`
			})]
		}, c.key))
	});
}
function StatusSelect({ id }) {
	const value = useInspection((s) => rowStatus(s.draft, id));
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "field-label",
			children: "Status"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2",
			children: STATUS_OPTIONS.map((o) => {
				const active = value === o.value;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => patch((d) => {
						setManualStatus(d, id, o.value);
					}),
					"data-status": o.value,
					"data-on": active ? "true" : "false",
					className: cn("chip-status tap-56 rounded border px-2 text-sm font-bold tracking-wide", active ? "" : "chip-off"),
					children: o.label
				}, o.value);
			})
		})]
	});
}
function GuideLink({ id, label }) {
	const jumpToGuide = useInspection((s) => s.jumpToGuide);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => jumpToGuide(id),
		className: "tap-56 inline-flex shrink-0 items-center gap-1 rounded border border-border bg-raised px-3 font-semibold text-foreground",
		"aria-label": `Open How-To for ${label}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" }), "Guide"]
	});
}
function ItemBlock({ title, hint, guideId, checked, onChecked, notes, onNotes, photoSlot, photoRequired, locked, children }) {
	const embed = (0, import_react.useContext)(WalkEmbed);
	const jumpToGuide = useInspection((s) => s.jumpToGuide);
	const statusId = guideId ? statusIdFromGuide(guideId) : "";
	const grade = useInspection((s) => statusId ? rowStatus(s.draft, statusId) : "na");
	const extraSlot = !photoSlot && (grade === "attention" || grade === "asap") && statusId ? flagPhotoSlot(statusId) : void 0;
	const slot = photoSlot || extraSlot;
	if (embed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-1 text-xs text-warn",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }), " Locked until the factory method finishes"]
		}) : null, children]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-card space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: locked,
					onClick: () => onChecked(!checked),
					className: "tap-56 shrink-0",
					"aria-pressed": checked,
					"aria-label": title,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckHit, {
						on: checked,
						className: locked ? "opacity-40" : void 0
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 pt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold leading-snug text-foreground",
								children: title
							}), guideId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => jumpToGuide(guideId),
								className: "tap-56 inline-flex shrink-0 items-center gap-1 rounded border border-border bg-raised px-3 font-semibold",
								"aria-label": `Open How-To for ${title}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" }), "Guide"]
							}) : null]
						}),
						guideId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlainButton, {
							id: guideId,
							title
						}) : null,
						hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-snug text-muted-foreground",
							children: hint
						}) : null,
						locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 flex items-center gap-1 text-xs text-warn",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }), " Locked until the factory method finishes"]
						}) : null
					]
				})]
			}),
			guideId && statusIdFromGuide(guideId) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusSelect, { id: statusIdFromGuide(guideId) }) : null,
			children,
			slot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoField, {
				slot,
				required: photoRequired,
				label: photoSlotDef(slot)?.label
			}) : null,
			statusId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepairBlock, { id: statusId }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
				value: notes,
				onChange: onNotes
			})
		]
	});
}
function useTickingNow(active) {
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		if (!active) return;
		const id = window.setInterval(() => setNow(Date.now()), 250);
		return () => window.clearInterval(id);
	}, [active]);
	return now;
}
function useOilWaitReady() {
	const startedAt = useInspection((s) => s.draft.oilWaitStartedAt);
	const now = useTickingNow(startedAt != null && !oilWaitReady(startedAt));
	return oilWaitReady(startedAt, now);
}
function OilWaitGate({ children }) {
	const startedAt = useInspection((s) => s.draft.oilWaitStartedAt);
	const patch = useInspection((s) => s.patch);
	const now = useTickingNow(startedAt != null && !oilWaitReady(startedAt));
	const ready = oilWaitReady(startedAt, now);
	const remaining = startedAt == null ? OIL_WAIT_MS : Math.max(0, OIL_WAIT_MS - (now - startedAt));
	if (startedAt == null) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-card space-y-3 border-warn bg-warn-dim",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "traveler-stamp text-xs text-warn",
				children: "Engine off — wait 10+ minutes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-foreground",
				children: "Key OFF. Wait MORE THAN 10 MINUTES so oil drains back to the pan. Then the dipstick. Do not cheat this."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => patch((d) => {
					d.oilWaitStartedAt = Date.now();
				}),
				className: "tap-56 w-full rounded bg-primary px-3 text-sm font-semibold text-primary-foreground",
				children: "Engine is off — start 10 min wait"
			})
		]
	});
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-card space-y-3 border-warn bg-warn-dim",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "traveler-stamp text-xs text-warn",
				children: "Engine off — wait 10+ minutes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "reading text-center text-4xl text-primary",
				"aria-live": "polite",
				children: formatCountdown(remaining)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm text-muted-foreground",
				children: "Oil is draining back. Dipstick stays locked."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "traveler-stamp text-xs text-pass",
			children: "Oil drained back · dipstick unlocked"
		}), children]
	});
}
var ATF_STEPS = [
	{
		key: "atfIdle",
		label: "Engine idling in Park",
		hint: "Level pavement. Idle only. Never check ATF with the engine off."
	},
	{
		key: "atfCycled",
		label: "Shifted P → R → N → D → P",
		hint: "Foot on the brake. Pause one second in each. Back to Park."
	},
	{
		key: "atfHot",
		label: "Engine still idling, HOT read",
		hint: "After a drive. HOT marks. Stick inserted reversed."
	}
];
function AtfRitualGate({ children }) {
	const idle = useInspection((s) => s.draft.atfIdle);
	const cycled = useInspection((s) => s.draft.atfCycled);
	const hot = useInspection((s) => s.draft.atfHot);
	const patch = useInspection((s) => s.patch);
	const flags = {
		atfIdle: idle,
		atfCycled: cycled,
		atfHot: hot
	};
	const ready = idle && cycled && hot;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "traveler-stamp text-xs text-primary",
				children: "Idle, shift P-R-N-D, then HOT read"
			}),
			ATF_STEPS.map((step, i) => {
				const prevOk = i === 0 ? true : flags[ATF_STEPS[i - 1].key];
				const on = flags[step.key];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: !prevOk,
					onClick: () => patch((d) => {
						d[step.key] = !d[step.key];
						if (step.key === "atfIdle" && !d.atfIdle) {
							d.atfCycled = false;
							d.atfHot = false;
						}
						if (step.key === "atfCycled" && !d.atfCycled) d.atfHot = false;
					}),
					className: cn("flex w-full items-start gap-3 rounded border p-3 text-left", on ? "border-pass bg-pass-dim" : "border-border bg-inset", !prevOk && "opacity-40"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckHit, { on }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-medium leading-snug text-foreground",
							children: step.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm leading-snug text-muted-foreground",
							children: step.hint
						})]
					})]
				}, step.key);
			}),
			ready ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "ATF dipstick stays locked until all three are marked."
			})
		]
	});
}
function ProofPhoto({ row }) {
	const patchMaint = useInspection((s) => s.patchMaint);
	const inputRef = (0, import_react.useRef)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onFile(file) {
		if (!file) return;
		setBusy(true);
		try {
			const shot = await compressPhoto(file);
			patchMaint((rows) => rows.map((r) => r.id === row.id ? {
				...r,
				photo: {
					...shot,
					originalDataUrl: shot.dataUrl
				}
			} : r));
		} finally {
			setBusy(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: inputRef,
			type: "file",
			accept: "image/*",
			capture: "environment",
			className: "hidden",
			onChange: (e) => void onFile(e.target.files?.[0])
		}), row.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded border border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: row.photo.dataUrl,
				alt: row.photo.caption || "Proof",
				className: "max-h-32 w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => patchMaint((rows) => rows.map((r) => r.id === row.id ? {
					...r,
					photo: void 0
				} : r)),
				className: "tap-44 absolute top-1 right-1 grid place-items-center rounded bg-fail text-foreground",
				"aria-label": "Remove proof photo",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			disabled: busy,
			onClick: () => inputRef.current?.click(),
			className: "tap-44 inline-flex w-full items-center justify-center gap-2 rounded border border-dashed border-border bg-inset text-sm font-medium text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4" }), busy ? "Saving…" : "Proof photo (optional)"]
		})]
	});
}
function RowEditor({ row, currentMiles }) {
	const patchMaint = useInspection((s) => s.patchMaint);
	const remove = useInspection((s) => s.removeMaintRow);
	const age = ageOf(row, currentMiles);
	function set(over) {
		patchMaint((rows) => rows.map((r) => r.id === row.id ? {
			...r,
			...over
		} : r));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-card space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block min-w-0 flex-1 space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "field-label",
						children: "Service"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: row.service,
						onChange: (e) => set({ service: e.target.value }),
						className: "field-input",
						children: MAINT_SERVICES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.key,
							children: s.label
						}, s.key))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => remove(row.id),
					className: "tap-44 mt-6 grid place-items-center rounded border border-border text-fail",
					"aria-label": "Remove service",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-5" })
				})]
			}),
			row.service === "other" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "What was done",
				value: row.custom,
				onChange: (v) => set({ custom: v })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Miles",
					value: row.miles,
					inputMode: "numeric",
					placeholder: "Unknown",
					onChange: (v) => set({ miles: v.replace(/[^\d]/g, "") })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Date",
					value: row.date,
					placeholder: "Aug 2026 or 2024",
					onChange: (v) => set({ date: v })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Notes",
				value: row.notes,
				onChange: (v) => set({ notes: v }),
				placeholder: "optional"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProofPhoto, { row }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs leading-snug text-muted-foreground",
				children: [
					"Age: ",
					age.label,
					row.miles ? ` · logged ${formatMiles(row.miles)} mi` : " · miles unknown",
					row.date.trim() ? ` · ${formatMaintDate(row.date)}` : " · date unknown"
				]
			})
		]
	});
}
function MaintLog() {
	const maint = useInspection((s) => s.maint);
	const vin = useInspection((s) => s.draft.header.vin);
	const milesRaw = useInspection((s) => s.draft.header.miles);
	const add = useInspection((s) => s.addMaintRow);
	const rows = rowsForVin(maint, vin);
	const current = parseMiles$1(milesRaw);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-card space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "traveler-stamp text-xs text-primary",
				children: "Maintenance history"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed text-muted-foreground",
				children: [
					"Not the checklist. This log stays with the truck",
					vin.trim().length === 17 ? " (this VIN)" : "",
					" when you start a new inspection. Miles or date can be Unknown — do not invent numbers."
				]
			})] }),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No services logged yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RowEditor, {
					row,
					currentMiles: current
				}) }, row.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => add(),
				className: cn("tap-44 inline-flex w-full items-center justify-center gap-2 rounded border border-border bg-inset font-medium"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add service"]
			})
		]
	});
}
function LogOilButton() {
	const logOil = useInspection((s) => s.logOilChange);
	const maint = useInspection((s) => s.maint);
	const draft = useInspection((s) => s.draft);
	const [msg, setMsg] = (0, import_react.useState)("");
	const logged = alreadyShown(rowsForVin(maint, draft.header.vin), draft.header.miles);
	function onClick() {
		const ok = logOil();
		setMsg(ok ? "Logged this oil change." : logged ? "Already in the log at this mileage." : "Enter current miles first.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick,
			className: "tap-44 inline-flex w-full items-center justify-center gap-2 rounded border border-border bg-inset text-sm font-medium",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" }), "Log this oil change"]
		}), msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: msg
		}) : null]
	});
}
function alreadyShown(rows, miles) {
	const m = parseMiles$1(miles);
	return rows.some((r) => r.service === "oil-change" && parseMiles$1(r.miles) === m && m != null);
}
var lookupNissanCampaigns = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("4fb516f613006ae63fb247b0983f0894c543dc1503195a262a64d47f72f58e24"));
function useWear() {
	const draft = useInspection((s) => s.draft);
	const prior = priorWearVisit(draft, wearHistory(useInspection((s) => s.lastSubmitted), useInspection((s) => s.archive)));
	if (!prior) return null;
	return wearCompare(draft, prior);
}
function WearVsLast({ kind }) {
	const compare = useWear();
	if (!compare) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm leading-relaxed text-muted-foreground",
		children: "No prior pad/tread numbers stored yet. Next inspection will compare against this one."
	});
	const rows = kind === "pads" ? compare.pads : compare.tread;
	const unit = kind === "pads" ? " mm" : "/32";
	const useful = rows.filter((c) => c.last != null || c.now != null);
	if (!useful.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5 rounded border border-line bg-inset p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "traveler-stamp text-xs text-primary",
			children: wearStamp(compare)
		}), useful.map((c) => {
			const warn = kind === "pads" && c.lost != null && c.lost >= 1 ? true : kind === "tread" && c.lost != null && c.lost >= 2;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("text-sm leading-snug", warn ? "text-warn" : "text-foreground"),
				children: wearLine(c, unit, compare.milesBetween)
			}, c.key);
		})]
	});
}
function useShows() {
	const visit = useInspection((s) => s.draft.header.visitType);
	const drive = useInspection((s) => s.draft.header.drive);
	const plan = useInspection((s) => s.draft.header.plan);
	return (id) => rowShows(id, visit, drive, plan);
}
function Shown({ id, children }) {
	if (!useShows()(id)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function HeaderFields({ highlight }) {
	const h = useInspection((s) => s.draft.header);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("hud-card space-y-3", highlight ? "border-warn" : ""),
		children: [
			highlight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-warn",
				children: "Date, miles, and inspector are required to submit."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "field-label",
					children: "Date"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "date",
					value: h.date,
					onChange: (e) => patch((d) => {
						d.header.date = e.target.value;
					}),
					className: "field-input"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Miles",
				value: h.miles,
				inputMode: "numeric",
				placeholder: "Type current miles",
				onChange: (v) => patch((d) => {
					d.header.miles = v.replace(/[^\d]/g, "");
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Inspector",
				value: h.inspector,
				onChange: (v) => patch((d) => {
					d.header.inspector = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "VIN",
				value: h.vin,
				placeholder: "17 characters",
				onChange: (v) => patch((d) => {
					d.header.vin = normalizeVin(v).slice(0, 17);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "field-label",
				children: "VIN plate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoField, {
				slot: "header.vin",
				required: true,
				label: "VIN plate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Drive",
				value: h.drive,
				options: [{
					value: "2WD",
					label: "2WD"
				}, {
					value: "4WD",
					label: "4WD"
				}],
				onChange: (v) => patch((d) => {
					d.header.drive = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Tow pkg",
				value: h.towPkg,
				options: [{
					value: "Y",
					label: "Y"
				}, {
					value: "N",
					label: "N"
				}],
				onChange: (v) => patch((d) => {
					d.header.towPkg = v;
				})
			})
		]
	});
}
function CornerGrid({ keys, values, onChange, suffix }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-2",
		children: keys.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
			label: suffix ? `${c.label} ${suffix}` : c.label,
			value: values[c.key] ?? "",
			inputMode: "decimal",
			onChange: (v) => onChange(c.key, v)
		}, c.key))
	});
}
function OilLevelItem() {
	if (useInspection((s) => oilChangeMode(s.draft))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OilChangePerformedItem, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OilDipstickItem, {});
}
function OilChangePerformedItem() {
	const row = useInspection((s) => s.draft.fluids.oilLevel);
	const oilType = useInspection((s) => s.draft.result.oilType);
	const oilAmount = useInspection((s) => s.draft.result.oilAmount);
	const oilFilterPn = useInspection((s) => s.draft.result.oilFilterPn);
	const crushWasher = useInspection((s) => s.draft.result.crushWasher);
	const line = useInspection((s) => oilChangeRecord(s.draft));
	const miles = useInspection((s) => s.draft.header.miles);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ItemBlock, {
		title: "Oil change performed",
		hint: "Not a dipstick read. Factory 5W-30 full synthetic. About 6.5 qt with filter. New crush washer every time.",
		guideId: "fluids.oilLevel",
		checked: row.checked,
		onChecked: (v) => patch((d) => {
			d.fluids.oilLevel.checked = v;
		}),
		notes: row.notes,
		onNotes: (v) => patch((d) => {
			d.fluids.oilLevel.notes = v;
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Oil type",
				value: oilType,
				placeholder: "5W-30 full synthetic",
				onChange: (v) => patch((d) => {
					d.result.oilType = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Amount used",
				value: oilAmount,
				placeholder: "6.5 qt",
				inputMode: "decimal",
				onChange: (v) => patch((d) => {
					d.result.oilAmount = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Filter PN",
				value: oilFilterPn,
				placeholder: "Nissan filter PN",
				onChange: (v) => patch((d) => {
					d.result.oilFilterPn = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Crush washer replaced",
				value: crushWasher,
				options: [{
					value: "Y",
					label: "Y"
				}, {
					value: "N",
					label: "N"
				}],
				onChange: (v) => patch((d) => {
					d.result.crushWasher = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted-foreground",
				children: miles.trim() ? line : "Mileage comes from the Vehicle header."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOilButton, {})
		]
	});
}
function OilDipstickItem() {
	const row = useInspection((s) => s.draft.fluids.oilLevel);
	const patch = useInspection((s) => s.patch);
	const ready = useOilWaitReady();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemBlock, {
		title: "Engine oil level & condition",
		hint: "After warmup. Engine off. Wait more than 10 minutes. 5W-30.",
		guideId: "fluids.oilLevel",
		checked: row.checked,
		onChecked: (v) => patch((d) => {
			d.fluids.oilLevel.checked = v;
		}),
		notes: row.notes,
		onNotes: (v) => patch((d) => {
			d.fluids.oilLevel.notes = v;
		}),
		locked: !ready,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(OilWaitGate, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
			label: "Color / level",
			value: row.colorLevel,
			placeholder: "Between L and H",
			onChange: (v) => patch((d) => {
				d.fluids.oilLevel.colorLevel = v;
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
			label: "qt added",
			value: row.qtAdded,
			inputMode: "decimal",
			onChange: (v) => patch((d) => {
				d.fluids.oilLevel.qtAdded = v;
			})
		})] })
	});
}
function AtfItem() {
	const row = useInspection((s) => s.draft.fluids.atf);
	const idle = useInspection((s) => s.draft.atfIdle);
	const cycled = useInspection((s) => s.draft.atfCycled);
	const hot = useInspection((s) => s.draft.atfHot);
	const patch = useInspection((s) => s.patch);
	const hotProc = useInspection((s) => atfHotRequired(s.draft));
	const ready = !hotProc || idle && cycled && hot;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemBlock, {
		title: hotProc ? "ATF — dipstick HOT" : "ATF color / smell",
		hint: hotProc ? "Nissan Matic J (Matic S OK). Idle, shift P-R-N-D, then HOT read. Pink, milky, or sweet is SMOD — stop." : "Look at color and smell. Nissan Matic J. Pink, milky, or sweet is SMOD — stop. HOT procedure is a 30k item.",
		guideId: "fluids.atf",
		checked: row.checked,
		onChecked: (v) => patch((d) => {
			d.fluids.atf.checked = v;
		}),
		notes: row.notes,
		onNotes: (v) => patch((d) => {
			d.fluids.atf.notes = v;
		}),
		locked: !ready,
		photoSlot: "fluids.atf",
		photoRequired: true,
		children: hotProc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtfRitualGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtfFields, { row }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtfFields, { row })
	});
}
function AtfFields({ row }) {
	const patch = useInspection((s) => s.patch);
	const hotProc = useInspection((s) => atfHotRequired(s.draft));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		hotProc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Level in range",
			value: row.inRange,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.fluids.atf.inRange = v;
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Color",
			value: row.color,
			options: [
				{
					value: "red-amber",
					label: "Red-amber"
				},
				{
					value: "brown",
					label: "Brown"
				},
				{
					value: "pink",
					label: "Pink"
				},
				{
					value: "milky",
					label: "Milky"
				}
			],
			onChange: (v) => patch((d) => {
				d.fluids.atf.color = v;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Smell",
			value: row.smell,
			options: [
				{
					value: "atf",
					label: "ATF"
				},
				{
					value: "burnt",
					label: "Burnt"
				},
				{
					value: "sweet",
					label: "Sweet"
				}
			],
			onChange: (v) => patch((d) => {
				d.fluids.atf.smell = v;
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs leading-snug text-fail",
			children: "One-line SMOD warning: if ATF is pink, milky, or sweet — coolant is in the transmission. Do not keep driving."
		})
	] });
}
function SimpleCheck({ title, hint, guideId, checked, notes, onChecked, onNotes, photoSlot, photoRequired, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemBlock, {
		title,
		hint,
		guideId,
		checked,
		onChecked,
		notes,
		onNotes,
		photoSlot,
		photoRequired,
		children
	});
}
function FluidsRest() {
	const f = useInspection((s) => s.draft.fluids);
	const drive = useInspection((s) => s.draft.header.drive);
	const patch = useInspection((s) => s.patch);
	const shows = useShows();
	const interval = shows("rearDiffSeep") || shows("transferSeep");
	const fourwd = driveShows(drive, "4WD");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "oilLeak",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
				title: "Engine oil leak check",
				hint: "Valve covers / oil cooler O-ring / pan / front cover",
				guideId: "fluids.oilLeak",
				checked: f.oilLeak.checked,
				notes: f.oilLeak.notes,
				onChecked: (v) => patch((d) => {
					d.fluids.oilLeak.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.fluids.oilLeak.notes = v;
				}),
				photoSlot: "fluids.oilLeak"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "coolant",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Coolant reservoir level & color",
				hint: "Engine cold. Do not open the radiator cap hot.",
				guideId: "fluids.coolant",
				checked: f.coolant.checked,
				notes: f.coolant.notes,
				onChecked: (v) => patch((d) => {
					d.fluids.coolant.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.fluids.coolant.notes = v;
				}),
				photoSlot: "fluids.coolant",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "Level & color",
						value: f.coolant.levelColor,
						onChange: (v) => patch((d) => {
							d.fluids.coolant.levelColor = v;
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "Freeze point",
						value: f.coolant.freezeF,
						placeholder: "-34°F",
						inputMode: "decimal",
						onChange: (v) => patch((d) => {
							d.fluids.coolant.freezeF = v;
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
						label: "Cap seated",
						value: f.coolant.capSeated,
						options: [{
							value: "Y",
							label: "Y"
						}, {
							value: "N",
							label: "N"
						}],
						onChange: (v) => patch((d) => {
							d.fluids.coolant.capSeated = v;
						})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "atf",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtfItem, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "psf",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Power steering fluid",
				hint: "COLD marks when cold, HOT marks after a drive. Nissan PSF.",
				guideId: "fluids.psf",
				checked: f.psf.checked,
				notes: f.psf.notes,
				onChecked: (v) => patch((d) => {
					d.fluids.psf.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.fluids.psf.notes = v;
				}),
				photoSlot: "fluids.psf",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Level",
					value: f.psf.level,
					onChange: (v) => patch((d) => {
						d.fluids.psf.level = v;
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Color",
					value: f.psf.color,
					onChange: (v) => patch((d) => {
						d.fluids.psf.color = v;
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "brake",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Brake fluid",
				hint: "DOT 3 from a sealed bottle. Flush every 24 months.",
				guideId: "fluids.brake",
				checked: f.brake.checked,
				notes: f.brake.notes,
				onChecked: (v) => patch((d) => {
					d.fluids.brake.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.fluids.brake.notes = v;
				}),
				photoSlot: "fluids.brake",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "Level",
						value: f.brake.level,
						onChange: (v) => patch((d) => {
							d.fluids.brake.level = v;
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
						label: "Color",
						value: f.brake.color,
						options: [{
							value: "clear-amber",
							label: "Clear-amber"
						}, {
							value: "dark",
							label: "Dark"
						}],
						onChange: (v) => patch((d) => {
							d.fluids.brake.color = v;
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
						label: "Moisture",
						value: f.brake.moisture,
						options: [{
							value: "dry",
							label: "Dry"
						}, {
							value: "high",
							label: "High"
						}],
						onChange: (v) => patch((d) => {
							d.fluids.brake.moisture = v;
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
						label: "Cap sealed",
						value: f.brake.capSealed,
						options: [{
							value: "Y",
							label: "Y"
						}, {
							value: "N",
							label: "N"
						}],
						onChange: (v) => patch((d) => {
							d.fluids.brake.capSealed = v;
						})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "washer",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WasherItem, {})
		}),
		interval && fourwd ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransferSeepItem, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrontDiffSeepItem, {})] }) : null,
		interval ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RearDiffSeepItem, {}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
			value: f.notes,
			onChange: (v) => patch((d) => {
				d.fluids.notes = v;
			}),
			placeholder: "Section notes"
		})
	] });
}
function WasherItem() {
	const row = useInspection((s) => s.draft.fluids.washer);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Washer fluid",
		guideId: "fluids.washer",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.fluids.washer.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.fluids.washer.notes = v;
		})
	});
}
function TransferSeepItem() {
	const row = useInspection((s) => s.draft.fluids.transferSeep);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Transfer case seep (4WD)",
		hint: "30k service item. Not a dipstick.",
		guideId: "fluids.transferSeep",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.fluids.transferSeep.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.fluids.transferSeep.notes = v;
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Wetness at seals",
			value: row.wetness,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.fluids.transferSeep.wetness = v;
			})
		})
	});
}
function FrontDiffSeepItem() {
	const row = useInspection((s) => s.draft.fluids.frontDiffSeep);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Front differential seep (4WD)",
		hint: "30k service item.",
		guideId: "fluids.frontDiffSeep",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.fluids.frontDiffSeep.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.fluids.frontDiffSeep.notes = v;
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Seep",
			value: row.seep,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.fluids.frontDiffSeep.seep = v;
			})
		})
	});
}
function RearDiffSeepItem() {
	const row = useInspection((s) => s.draft.fluids.rearDiffSeep);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Rear differential seep",
		hint: "30k service item. Pinion seal.",
		guideId: "fluids.rearDiffSeep",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.fluids.rearDiffSeep.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.fluids.rearDiffSeep.notes = v;
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Seep",
			value: row.seep,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.fluids.rearDiffSeep.seep = v;
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Pinion seal",
			value: row.pinion,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.fluids.rearDiffSeep.pinion = v;
			})
		})]
	});
}
function EngineItems() {
	const e = useInspection((s) => s.draft.engine);
	const patch = useInspection((s) => s.patch);
	const shows = useShows();
	const interval = shows("battery") || shows("scan") || shows("airFilter");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "engine.overview",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hud-card space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold text-foreground",
						children: "Engine bay overview"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "One wide shot — tanks, belt, battery, leaks."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlainButton, {
						id: "engine.overview",
						title: "Engine bay overview"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoField, {
						slot: "engine.overview",
						required: true,
						label: "Engine bay overview"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "timingCover",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Cold-start noise — timing cover",
				hint: "Short rattle 1–3 sec then gone is common. Ongoing rattle is not.",
				guideId: "engine.timingCover",
				checked: e.timingCover.checked,
				notes: e.timingCover.notes,
				onChecked: (v) => patch((d) => {
					d.engine.timingCover.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.engine.timingCover.notes = v;
				}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
						label: "Noise",
						value: e.timingCover.noise,
						options: [
							{
								value: "quiet",
								label: "Quiet"
							},
							{
								value: "short-rattle",
								label: "Short rattle"
							},
							{
								value: "ongoing-rattle",
								label: "Ongoing rattle"
							}
						],
						onChange: (v) => patch((d) => {
							d.engine.timingCover.noise = v;
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "Seconds",
						value: e.timingCover.seconds,
						inputMode: "numeric",
						onChange: (v) => patch((d) => {
							d.engine.timingCover.seconds = v;
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
						label: "Oil pressure",
						value: e.timingCover.oilPressure,
						options: [{
							value: "ok",
							label: "In the green"
						}, {
							value: "low",
							label: "Low / lamp"
						}],
						onChange: (v) => patch((d) => {
							d.engine.timingCover.oilPressure = v;
						})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "manifolds",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Cold-start noise — exhaust manifolds",
				hint: "Tick plus soot at the flange gets scheduled.",
				guideId: "engine.manifolds",
				checked: e.manifolds.checked,
				notes: e.manifolds.notes,
				onChecked: (v) => patch((d) => {
					d.engine.manifolds.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.engine.manifolds.notes = v;
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Noise",
					value: e.manifolds.noise,
					options: [
						{
							value: "quiet",
							label: "Quiet"
						},
						{
							value: "tick-l",
							label: "Tick L"
						},
						{
							value: "tick-r",
							label: "Tick R"
						},
						{
							value: "both",
							label: "Both"
						}
					],
					onChange: (v) => patch((d) => {
						d.engine.manifolds.noise = v;
					})
				}), interval ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Soot at flange",
					value: e.manifolds.soot,
					options: [{
						value: "Y",
						label: "Y"
					}, {
						value: "N",
						label: "N"
					}],
					onChange: (v) => patch((d) => {
						d.engine.manifolds.soot = v;
					})
				}) : null]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "idle",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Idle quality",
				guideId: "engine.idle",
				checked: e.idle.checked,
				notes: e.idle.notes,
				onChecked: (v) => patch((d) => {
					d.engine.idle.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.engine.idle.notes = v;
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Quality",
					value: e.idle.quality,
					options: [{
						value: "smooth",
						label: "Smooth"
					}, {
						value: "rough",
						label: "Rough"
					}],
					onChange: (v) => patch((d) => {
						d.engine.idle.quality = v;
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "CEL",
					value: e.idle.cel,
					options: [{
						value: "off",
						label: "Off"
					}, {
						value: "on",
						label: "On"
					}],
					onChange: (v) => patch((d) => {
						d.engine.idle.cel = v;
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "belt",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Serpentine belt",
				guideId: "engine.belt",
				checked: e.belt.checked,
				notes: e.belt.notes,
				onChecked: (v) => patch((d) => {
					d.engine.belt.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.engine.belt.notes = v;
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Condition",
					value: e.belt.condition,
					options: [
						{
							value: "ok",
							label: "OK"
						},
						{
							value: "cracks",
							label: "Cracks"
						},
						{
							value: "glaze",
							label: "Glaze"
						},
						{
							value: "fray",
							label: "Fray"
						}
					],
					onChange: (v) => patch((d) => {
						d.engine.belt.condition = v;
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Tensioner play",
					value: e.belt.tensionerPlay,
					options: [{
						value: "Y",
						label: "Y"
					}, {
						value: "N",
						label: "N"
					}],
					onChange: (v) => patch((d) => {
						d.engine.belt.tensionerPlay = v;
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "radiator",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadiatorItem, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "atfLines",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtfLinesItem, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "airFilter",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Air filter",
				hint: "Cabin filter is a 15k item, behind the glove box.",
				guideId: "engine.airFilter",
				checked: e.airFilter.checked,
				notes: e.airFilter.notes,
				onChecked: (v) => patch((d) => {
					d.engine.airFilter.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.engine.airFilter.notes = v;
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Condition",
					value: e.airFilter.condition,
					options: [
						{
							value: "clean",
							label: "Clean"
						},
						{
							value: "dirty",
							label: "Dirty"
						},
						{
							value: "replace",
							label: "Replace"
						}
					],
					onChange: (v) => patch((d) => {
						d.engine.airFilter.condition = v;
					})
				}), interval ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Cabin filter due",
					value: e.airFilter.cabinDue,
					options: [{
						value: "Y",
						label: "Y"
					}, {
						value: "N",
						label: "N"
					}],
					onChange: (v) => patch((d) => {
						d.engine.airFilter.cabinDue = v;
					})
				}) : null]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "battery",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Battery",
				hint: interval ? "Rest ~12.4–12.7 V. Running ~13.5–14.7 V." : "Glance the terminals. Load test unhides at 15k / 30k.",
				guideId: "engine.battery",
				checked: e.battery.checked,
				notes: e.battery.notes,
				onChecked: (v) => patch((d) => {
					d.engine.battery.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.engine.battery.notes = v;
				}),
				photoSlot: "engine.battery",
				children: [
					interval ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "Rest V",
						value: e.battery.restV,
						inputMode: "decimal",
						onChange: (v) => patch((d) => {
							d.engine.battery.restV = v;
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "Running V",
						value: e.battery.runningV,
						inputMode: "decimal",
						onChange: (v) => patch((d) => {
							d.engine.battery.runningV = v;
						})
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
						label: "Terminals clean",
						value: e.battery.terminalsClean,
						options: [{
							value: "Y",
							label: "Y"
						}, {
							value: "N",
							label: "N"
						}],
						onChange: (v) => patch((d) => {
							d.engine.battery.terminalsClean = v;
						})
					}),
					interval ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
						label: "Load test",
						value: e.battery.loadTest,
						options: [{
							value: "pass",
							label: "Pass"
						}, {
							value: "fail",
							label: "Fail"
						}],
						onChange: (v) => patch((d) => {
							d.engine.battery.loadTest = v;
						})
					}) : null
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "grounds",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
				title: "Ground straps",
				hint: "Block-to-chassis and body.",
				guideId: "engine.grounds",
				checked: e.grounds.checked,
				notes: e.grounds.notes,
				onChecked: (v) => patch((d) => {
					d.engine.grounds.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.engine.grounds.notes = v;
				}),
				photoSlot: "engine.grounds",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Condition",
					value: e.grounds.condition,
					options: [{
						value: "tight",
						label: "Tight"
					}, {
						value: "corroded",
						label: "Corroded"
					}],
					onChange: (v) => patch((d) => {
						d.engine.grounds.condition = v;
					})
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "pcv",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
				title: "PCV hose / vacuum lines",
				guideId: "engine.pcv",
				checked: e.pcv.checked,
				notes: e.pcv.notes,
				onChecked: (v) => patch((d) => {
					d.engine.pcv.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.engine.pcv.notes = v;
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Condition",
					value: e.pcv.condition,
					options: [
						{
							value: "ok",
							label: "OK"
						},
						{
							value: "cracked",
							label: "Cracked"
						},
						{
							value: "oily",
							label: "Oily"
						}
					],
					onChange: (v) => patch((d) => {
						d.engine.pcv.condition = v;
					})
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "scan",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Scan tool",
				hint: "Write codes before you clear them.",
				guideId: "engine.scan",
				checked: e.scan.checked,
				notes: e.scan.notes,
				onChecked: (v) => patch((d) => {
					d.engine.scan.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.engine.scan.notes = v;
				}),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "Stored codes",
						value: e.scan.stored,
						onChange: (v) => patch((d) => {
							d.engine.scan.stored = v;
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "Pending",
						value: e.scan.pending,
						onChange: (v) => patch((d) => {
							d.engine.scan.pending = v;
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "ATF temp",
						value: e.scan.atfTemp,
						onChange: (v) => patch((d) => {
							d.engine.scan.atfTemp = v;
						})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
			value: e.notes,
			onChange: (v) => patch((d) => {
				d.engine.notes = v;
			}),
			placeholder: "Section notes"
		})
	] });
}
function RadiatorItem() {
	const row = useInspection((s) => s.draft.engine.radiator);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Radiator tanks, seams, hoses",
		hint: "Engine cold for the first look.",
		guideId: "engine.radiator",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.engine.radiator.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.engine.radiator.notes = v;
		}),
		photoSlot: "engine.radiator",
		photoRequired: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Seeping",
			value: row.seeping,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.engine.radiator.seeping = v;
			})
		})
	});
}
function AtfLinesItem() {
	const row = useInspection((s) => s.draft.engine.atfLines);
	const visit = useInspection((s) => s.draft.header.visitType);
	const plan = useInspection((s) => s.draft.header.plan);
	const patch = useInspection((s) => s.patch);
	const requirePhoto = visitShows(visit, "30k") || Boolean(plan?.cooling) || row.wetFittings === "Y";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "ATF cooler lines at radiator",
		hint: "Wet fittings or pink residue = SMOD risk. 30k / 270k: fittings photo required even if dry.",
		guideId: "engine.atfLines",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.engine.atfLines.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.engine.atfLines.notes = v;
		}),
		photoSlot: "engine.atfLines",
		photoRequired: requirePhoto,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Still connected to radiator",
				value: row.connected,
				options: [{
					value: "Y",
					label: "Y"
				}, {
					value: "N",
					label: "N"
				}],
				onChange: (v) => patch((d) => {
					d.engine.atfLines.connected = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Wet fittings",
				value: row.wetFittings,
				options: [{
					value: "Y",
					label: "Y"
				}, {
					value: "N",
					label: "N"
				}],
				onChange: (v) => patch((d) => {
					d.engine.atfLines.wetFittings = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Bypass already done",
				value: row.bypassDone,
				options: [{
					value: "Y",
					label: "Y"
				}, {
					value: "N",
					label: "N"
				}],
				onChange: (v) => patch((d) => {
					d.engine.atfLines.bypassDone = v;
				})
			})
		]
	});
}
function TransTable() {
	const rows = useInspection((s) => s.draft.trans.rows);
	const notes = useInspection((s) => s.draft.trans.notes);
	const drive = useInspection((s) => s.draft.header.drive);
	useInspection((s) => s.draft.header.visitType);
	const patch = useInspection((s) => s.patch);
	const smod = useInspection((s) => isSmodRisk(s.draft) && !s.draft.smodAcknowledged);
	const showTable = useShows()("transTable");
	if (smod) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hud-alert text-sm leading-relaxed text-foreground",
		children: "Section 3 is locked. ATF is pink, milky, or sweet — coolant in the transmission. Do not continue the drive. Acknowledge the STOP banner first."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			showTable ? TRANS_ROWS.filter((r) => r.key !== "fourwd" || driveShows(drive, "4WD")).map((r) => {
				const v = rows[r.key];
				const opts = r.options.map((o) => ({
					value: o,
					label: o
				}));
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hud-card space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "pt-2.5 font-semibold text-foreground",
								children: r.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideLink, {
								id: r.guideId,
								label: r.label
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlainButton, {
							id: r.guideId,
							title: r.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
							label: "Cold",
							value: v.cold,
							options: opts,
							onChange: (val) => patch((d) => {
								d.trans.rows[r.key].cold = val;
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
							label: "Hot",
							value: v.hot,
							options: opts,
							onChange: (val) => patch((d) => {
								d.trans.rows[r.key].hot = val;
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
							value: v.notes,
							onChange: (val) => patch((d) => {
								d.trans.rows[r.key].notes = val;
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusSelect, { id: `trans.${r.key}` })
					]
				}, r.key);
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted-foreground",
				children: "Full cold/hot shift table is 15k / 30k. This visit is a short loop — temp gauge, one upshift, a stop."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtfRejectItem, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
				value: notes,
				onChange: (v) => patch((d) => {
					d.trans.notes = v;
				}),
				placeholder: "Section notes"
			})
		]
	});
}
function AtfRejectItem() {
	const checked = useInspection((s) => s.draft.trans.atfReject);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "ATF reject condition",
		hint: "STOP if pink, milky, or sweet-smelling. Do not continue the drive.",
		guideId: "trans.atfReject",
		checked,
		notes: "",
		onChecked: (v) => patch((d) => {
			d.trans.atfReject = v;
		}),
		onNotes: () => void 0
	});
}
function BrakeItems() {
	const b = useInspection((s) => s.draft.brakes);
	const patch = useInspection((s) => s.patch);
	const showPads = useShows()("pads");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shown, {
			id: "pads",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Pad thickness",
				hint: "Measure remaining friction material, not the steel backing.",
				guideId: "brakes.pads",
				checked: b.pads.checked,
				notes: b.pads.notes,
				onChecked: (v) => patch((d) => {
					d.brakes.pads.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.brakes.pads.notes = v;
				}),
				children: [
					showPads ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerGrid, {
						keys: CORNERS,
						values: b.pads,
						suffix: "mm",
						onChange: (k, v) => patch((d) => {
							d.brakes.pads[k] = v;
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WearVsLast, { kind: "pads" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerPhotos, {
						prefix: "brakes.pads",
						required: true
					})
				]
			})
		}),
		showPads ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Rotors",
				hint: "Thickness / rust lip / pulse on stop",
				guideId: "brakes.rotors",
				checked: b.rotors.checked,
				notes: b.rotors.notes,
				onChecked: (v) => patch((d) => {
					d.brakes.rotors.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.brakes.rotors.notes = v;
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Front",
					value: b.rotors.front,
					onChange: (v) => patch((d) => {
						d.brakes.rotors.front = v;
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Rear",
					value: b.rotors.rear,
					onChange: (v) => patch((d) => {
						d.brakes.rotors.rear = v;
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Brake hoses & lines",
				hint: "Calipers, hoses, and steel lines. Wet caliper is a fail — open Guide for how to inspect them.",
				guideId: "brakes.hoses",
				checked: b.hoses.checked,
				notes: b.hoses.notes,
				onChecked: (v) => patch((d) => {
					d.brakes.hoses.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.brakes.hoses.notes = v;
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Condition",
					value: b.hoses.condition,
					onChange: (v) => patch((d) => {
						d.brakes.hoses.condition = v;
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Wet caliper",
					value: b.hoses.wetCaliper,
					options: [{
						value: "Y",
						label: "Y"
					}, {
						value: "N",
						label: "N"
					}],
					onChange: (v) => patch((d) => {
						d.brakes.hoses.wetCaliper = v;
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Master cylinder / booster",
				guideId: "brakes.master",
				checked: b.master.checked,
				notes: b.master.notes,
				onChecked: (v) => patch((d) => {
					d.brakes.master.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.brakes.master.notes = v;
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Seepage",
					value: b.master.seepage,
					options: [{
						value: "Y",
						label: "Y"
					}, {
						value: "N",
						label: "N"
					}],
					onChange: (v) => patch((d) => {
						d.brakes.master.seepage = v;
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Pedal firm",
					value: b.master.pedalFirm,
					options: [{
						value: "Y",
						label: "Y"
					}, {
						value: "N",
						label: "N"
					}],
					onChange: (v) => patch((d) => {
						d.brakes.master.pedalFirm = v;
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
				title: "Pedal height engine running",
				hint: "Spec ≥ 3.5 in @ 110 lb",
				guideId: "brakes.pedalHeight",
				checked: b.pedalHeight.checked,
				notes: b.pedalHeight.notes,
				onChecked: (v) => patch((d) => {
					d.brakes.pedalHeight.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.brakes.pedalHeight.notes = v;
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Measured",
					value: b.pedalHeight.measured,
					onChange: (v) => patch((d) => {
						d.brakes.pedalHeight.measured = v;
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
				title: "Parking brake",
				hint: "Spec 3–4 clicks @ 44 lb",
				guideId: "brakes.parking",
				checked: b.parking.checked,
				notes: b.parking.notes,
				onChecked: (v) => patch((d) => {
					d.brakes.parking.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.brakes.parking.notes = v;
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Clicks",
					value: b.parking.clicks,
					inputMode: "numeric",
					onChange: (v) => patch((d) => {
						d.brakes.parking.clicks = v;
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Holds on grade",
					value: b.parking.holdsGrade,
					options: [{
						value: "Y",
						label: "Y"
					}, {
						value: "N",
						label: "N"
					}],
					onChange: (v) => patch((d) => {
						d.brakes.parking.holdsGrade = v;
					})
				})]
			})
		] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AbsLampsItem, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreadItem, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TireAgeItem, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WearItem, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PressuresItem, {}),
		showPads ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
				title: "Lug torque after rotation",
				hint: "98 ft-lb star. Recheck after the road test.",
				guideId: "brakes.lugTorque",
				checked: b.lugTorque.checked,
				notes: b.lugTorque.notes,
				onChecked: (v) => patch((d) => {
					d.brakes.lugTorque.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.brakes.lugTorque.notes = v;
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Rechecked after drive",
					value: b.lugTorque.rechecked,
					options: [{
						value: "Y",
						label: "Y"
					}, {
						value: "N",
						label: "N"
					}],
					onChange: (v) => patch((d) => {
						d.brakes.lugTorque.rechecked = v;
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
				title: "Wheel bearings / hubs",
				guideId: "brakes.bearings",
				checked: b.bearings.checked,
				notes: b.bearings.notes,
				onChecked: (v) => patch((d) => {
					d.brakes.bearings.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.brakes.bearings.notes = v;
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerGrid, {
					keys: CORNERS,
					values: b.bearings,
					onChange: (k, v) => patch((d) => {
						d.brakes.bearings[k] = v;
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
				title: "Alignment feel",
				guideId: "brakes.alignment",
				checked: b.alignment.checked,
				notes: b.alignment.notes,
				onChecked: (v) => patch((d) => {
					d.brakes.alignment.checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.brakes.alignment.notes = v;
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Feel",
					value: b.alignment.feel,
					options: [
						{
							value: "straight",
							label: "Straight"
						},
						{
							value: "pull-l",
							label: "Pull L"
						},
						{
							value: "pull-r",
							label: "Pull R"
						},
						{
							value: "wander",
							label: "Wander"
						}
					],
					onChange: (v) => patch((d) => {
						d.brakes.alignment.feel = v;
					})
				})
			})
		] }) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
			value: b.notes,
			onChange: (v) => patch((d) => {
				d.brakes.notes = v;
			}),
			placeholder: "Section notes"
		})
	] });
}
function AbsLampsItem() {
	const row = useInspection((s) => s.draft.brakes.absLamps);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "ABS / SLIP / VDC lamps",
		guideId: "brakes.absLamps",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.absLamps.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.absLamps.notes = v;
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoField, {
			slot: "cabin.dash",
			required: true,
			label: "Dash warning lights (key on)"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "State",
			value: row.state,
			options: [
				{
					value: "prove-out",
					label: "Prove-out then off"
				},
				{
					value: "stay-on",
					label: "Stay on"
				},
				{
					value: "intermittent",
					label: "Intermittent"
				}
			],
			onChange: (v) => patch((d) => {
				d.brakes.absLamps.state = v;
			})
		})]
	});
}
function TreadItem() {
	const row = useInspection((s) => s.draft.brakes.tread);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Tires tread",
		guideId: "brakes.tread",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.tread.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.tread.notes = v;
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerGrid, {
				keys: CORNERS_SPARE,
				values: row,
				onChange: (k, v) => patch((d) => {
					d.brakes.tread[k] = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WearVsLast, { kind: "tread" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerPhotos, {
				prefix: "brakes.tread",
				required: true
			})
		]
	});
}
function TireAgeItem() {
	const row = useInspection((s) => s.draft.brakes.tireAge);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Tire age (DOT week/year)",
		hint: "Older than 6–7 years gets replaced even with tread.",
		guideId: "brakes.tireAge",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.tireAge.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.tireAge.notes = v;
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerGrid, {
			keys: CORNERS_SPARE,
			values: row,
			onChange: (k, v) => patch((d) => {
				d.brakes.tireAge[k] = v;
			})
		})
	});
}
function WearItem() {
	const row = useInspection((s) => s.draft.brakes.wear);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Tire wear pattern",
		hint: "Inner-shoulder wear on the fronts means alignment or UCAs.",
		guideId: "brakes.wear",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.wear.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.wear.notes = v;
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Pattern",
			value: row.pattern,
			options: [
				{
					value: "even",
					label: "Even"
				},
				{
					value: "inner",
					label: "Inner shoulder"
				},
				{
					value: "outer",
					label: "Outer"
				},
				{
					value: "cupping",
					label: "Cupping"
				},
				{
					value: "center",
					label: "Center"
				}
			],
			onChange: (v) => patch((d) => {
				d.brakes.wear.pattern = v;
			})
		})
	});
}
function PressuresItem() {
	const row = useInspection((s) => s.draft.brakes.pressures);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Pressures including spare",
		hint: "Match the driver’s-door sticker, not the number on the tire.",
		guideId: "brakes.pressures",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.pressures.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.pressures.notes = v;
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerGrid, {
			keys: CORNERS_SPARE,
			values: row,
			onChange: (k, v) => patch((d) => {
				d.brakes.pressures[k] = v;
			})
		})
	});
}
function SteeringItems() {
	const items = useInspection((s) => s.draft.steering.items);
	const notes = useInspection((s) => s.draft.steering.notes);
	const drive = useInspection((s) => s.draft.header.drive);
	const patch = useInspection((s) => s.patch);
	const shows = useShows();
	const visible = STEERING_ITEMS.filter((it) => shows(`steering.${it.key}`));
	if (visible.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [visible.map((it) => {
		const row = items[it.key];
		const title = it.key === "shafts" ? drivelineShaftLabel(drive) : it.label;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
			title,
			guideId: it.guideId,
			checked: row.checked,
			notes: row.notes,
			onChecked: (v) => patch((d) => {
				d.steering.items[it.key].checked = v;
			}),
			onNotes: (v) => patch((d) => {
				d.steering.items[it.key].notes = v;
			}),
			photoSlot: photoSlotDef(`steering.${it.key}`)?.slot
		}, it.key);
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
		value: notes,
		onChange: (v) => patch((d) => {
			d.steering.notes = v;
		}),
		placeholder: "Section notes"
	})] });
}
function UnderbodyItems() {
	const items = useInspection((s) => s.draft.underbody.items);
	const notes = useInspection((s) => s.draft.underbody.notes);
	const patch = useInspection((s) => s.patch);
	const shows = useShows();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [UNDERBODY_ITEMS.filter((it) => shows(`underbody.${it.key}`)).map((it) => {
		const row = items[it.key];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
			title: it.label,
			guideId: it.guideId,
			checked: row.checked,
			notes: row.notes,
			onChecked: (v) => patch((d) => {
				d.underbody.items[it.key].checked = v;
			}),
			onNotes: (v) => patch((d) => {
				d.underbody.items[it.key].notes = v;
			}),
			photoSlot: photoSlotDef(`underbody.${it.key}`)?.slot
		}, it.key);
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
		value: notes,
		onChange: (v) => patch((d) => {
			d.underbody.notes = v;
		}),
		placeholder: "Section notes"
	})] });
}
function AirbagLampSelect() {
	const value = useInspection((s) => s.draft.cabin.airbagLamp);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
		label: "Lamp",
		value,
		options: [
			{
				value: "prove-out",
				label: "Prove-out then off"
			},
			{
				value: "stay-on",
				label: "Stay on"
			},
			{
				value: "intermittent",
				label: "Intermittent"
			}
		],
		onChange: (v) => patch((d) => {
			d.cabin.airbagLamp = v;
		})
	});
}
function CabinItems() {
	const items = useInspection((s) => s.draft.cabin.items);
	const notes = useInspection((s) => s.draft.cabin.notes);
	const patch = useInspection((s) => s.patch);
	const shows = useShows();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		CABIN_ITEMS.filter((it) => shows(`cabin.${it.key}`)).map((it) => {
			const row = items[it.key];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
				title: it.label,
				guideId: it.guideId,
				checked: row.checked,
				notes: row.notes,
				onChecked: (v) => patch((d) => {
					d.cabin.items[it.key].checked = v;
				}),
				onNotes: (v) => patch((d) => {
					d.cabin.items[it.key].notes = v;
				}),
				photoSlot: photoSlotDef(`cabin.${it.key}`)?.slot,
				children: it.key === "airbag" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AirbagLampSelect, {}) : null
			}, it.key);
		}),
		shows("cabin.recalls") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecallsCheck, {}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
			value: notes,
			onChange: (v) => patch((d) => {
				d.cabin.notes = v;
			}),
			placeholder: "Section notes"
		})
	] });
}
function RoadItems() {
	const items = useInspection((s) => s.draft.road.items);
	const gauge = useInspection((s) => s.draft.road.gaugeStable);
	const notes = useInspection((s) => s.draft.road.notes);
	const visit = useInspection((s) => s.draft.header.visitType);
	const patch = useInspection((s) => s.patch);
	const smod = useInspection((s) => isSmodRisk(s.draft) && !s.draft.smodAcknowledged);
	const shows = useShows();
	const short = visit === "oil-change" || visit === "recommended" && !shows("transTable");
	if (smod) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hud-alert text-sm leading-relaxed text-foreground",
		children: "Road test is locked. ATF is pink, milky, or sweet. Do not drive it."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [ROAD_ITEMS.filter((it) => shows(`road.${it.key}`)).map((it) => {
		const row = items[it.key];
		const title = short && it.key === "overheat" ? "No overheat on the short loop" : short && it.key === "shifts" ? "One clean upshift" : short && it.key === "brakes" ? "One firm stop — no pull, no pulse" : it.label;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
			title,
			guideId: it.guideId,
			checked: row.checked,
			notes: row.notes,
			onChecked: (v) => patch((d) => {
				d.road.items[it.key].checked = v;
			}),
			onNotes: (v) => patch((d) => {
				d.road.items[it.key].notes = v;
			}),
			children: it.key === "overheat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Gauge stable",
				value: gauge,
				options: [{
					value: "Y",
					label: "Y"
				}, {
					value: "N",
					label: "N"
				}],
				onChange: (v) => patch((d) => {
					d.road.gaugeStable = v;
				})
			}) : null
		}, it.key);
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
		value: notes,
		onChange: (v) => patch((d) => {
			d.road.notes = v;
		}),
		placeholder: "Section notes"
	})] });
}
var SEEP_GRADES = [
	{
		value: "dry",
		label: "Dry"
	},
	{
		value: "film",
		label: "Film"
	},
	{
		value: "wet",
		label: "Wet"
	},
	{
		value: "drip",
		label: "Drip"
	}
];
function grade(row, v) {
	row.verdict = v;
	row.checked = v !== "";
}
function BaselineItems({ only }) {
	const b = useInspection((s) => s.draft.baseline);
	const drive = useInspection((s) => s.draft.header.drive);
	const patch = useInspection((s) => s.patch);
	const fourwd = driveShows(drive, "4WD");
	const show = (k) => !only || only === k;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		only ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-relaxed text-muted-foreground",
			children: "Baseline 270k — Pass or Fail on each line. Notes are not a grade."
		}),
		show("sparkPlugs") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
			title: "Spark plugs (105k iridium — cycle 2 or 3)",
			hint: "At 270k you are on replacement cycle 2 or 3. Unknown last change is a Fail.",
			guideId: "baseline.sparkPlugs",
			checked: b.sparkPlugs.checked,
			notes: b.sparkPlugs.notes,
			onChecked: (v) => patch((d) => {
				d.baseline.sparkPlugs.checked = v;
			}),
			onNotes: (v) => patch((d) => {
				d.baseline.sparkPlugs.notes = v;
			}),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Last replaced at miles",
					value: b.sparkPlugs.lastMiles,
					inputMode: "numeric",
					placeholder: "unknown",
					onChange: (v) => patch((d) => {
						d.baseline.sparkPlugs.lastMiles = v.replace(/[^\d]/g, "");
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Cycle",
					value: b.sparkPlugs.cycle,
					options: [
						{
							value: "2",
							label: "2 (210k)"
						},
						{
							value: "3",
							label: "3 (315k)"
						},
						{
							value: "unknown",
							label: "Unknown"
						}
					],
					onChange: (v) => patch((d) => {
						d.baseline.sparkPlugs.cycle = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictSelect, {
					value: b.sparkPlugs.verdict,
					onChange: (v) => patch((d) => grade(d.baseline.sparkPlugs, v))
				})
			]
		}) : null,
		show("coolantService") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
			title: "Coolant service + cap + thermostat + water-pump weep",
			hint: "60k / 5 years if history unknown. Weep hole wet is a Fail.",
			guideId: "baseline.coolantService",
			checked: b.coolantService.checked,
			notes: b.coolantService.notes,
			onChecked: (v) => patch((d) => {
				d.baseline.coolantService.checked = v;
			}),
			onNotes: (v) => patch((d) => {
				d.baseline.coolantService.notes = v;
			}),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Last coolant service",
					value: b.coolantService.lastService,
					placeholder: "miles or year",
					onChange: (v) => patch((d) => {
						d.baseline.coolantService.lastService = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Radiator cap",
					value: b.coolantService.cap,
					options: [{
						value: "pass",
						label: "Pass"
					}, {
						value: "fail",
						label: "Fail"
					}],
					onChange: (v) => patch((d) => {
						d.baseline.coolantService.cap = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Thermostat",
					value: b.coolantService.thermostat,
					options: [{
						value: "pass",
						label: "Pass"
					}, {
						value: "fail",
						label: "Fail"
					}],
					onChange: (v) => patch((d) => {
						d.baseline.coolantService.thermostat = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Water-pump weep",
					value: b.coolantService.pumpWeep,
					options: [{
						value: "N",
						label: "Dry"
					}, {
						value: "Y",
						label: "Wet"
					}],
					onChange: (v) => patch((d) => {
						d.baseline.coolantService.pumpWeep = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictSelect, {
					value: b.coolantService.verdict,
					onChange: (v) => patch((d) => grade(d.baseline.coolantService, v))
				})
			]
		}) : null,
		show("brakeFluid") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
			title: "Brake fluid (DOT 3, moisture)",
			hint: "Flush every 24 months. Dark or high moisture is a Fail.",
			guideId: "baseline.brakeFluid",
			checked: b.brakeFluid.checked,
			notes: b.brakeFluid.notes,
			onChecked: (v) => patch((d) => {
				d.baseline.brakeFluid.checked = v;
			}),
			onNotes: (v) => patch((d) => {
				d.baseline.brakeFluid.notes = v;
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Last flush",
				value: b.brakeFluid.lastFlush,
				placeholder: "miles or date",
				onChange: (v) => patch((d) => {
					d.baseline.brakeFluid.lastFlush = v;
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictSelect, {
				value: b.brakeFluid.verdict,
				onChange: (v) => patch((d) => grade(d.baseline.brakeFluid, v))
			})]
		}) : null,
		show("diffFluid") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
			title: "Diff and transfer-case fluid",
			hint: "Fill-plug level, not just a seep look. 30k fluid. 2WD is rear only.",
			guideId: "baseline.diffFluid",
			checked: b.diffFluid.checked,
			notes: b.diffFluid.notes,
			onChecked: (v) => patch((d) => {
				d.baseline.diffFluid.checked = v;
			}),
			onNotes: (v) => patch((d) => {
				d.baseline.diffFluid.notes = v;
			}),
			children: [
				fourwd ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Transfer fill plug",
					value: b.diffFluid.transfer,
					options: [{
						value: "pass",
						label: "Pass"
					}, {
						value: "fail",
						label: "Fail"
					}],
					onChange: (v) => patch((d) => {
						d.baseline.diffFluid.transfer = v;
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Front diff fill plug",
					value: b.diffFluid.front,
					options: [{
						value: "pass",
						label: "Pass"
					}, {
						value: "fail",
						label: "Fail"
					}],
					onChange: (v) => patch((d) => {
						d.baseline.diffFluid.front = v;
					})
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Rear diff fill plug",
					value: b.diffFluid.rear,
					options: [{
						value: "pass",
						label: "Pass"
					}, {
						value: "fail",
						label: "Fail"
					}],
					onChange: (v) => patch((d) => {
						d.baseline.diffFluid.rear = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictSelect, {
					value: b.diffFluid.verdict,
					onChange: (v) => patch((d) => grade(d.baseline.diffFluid, v))
				})
			]
		}) : null,
		show("seepage") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
			title: "Valve-cover / timing-cover / oil-pan seepage grade",
			hint: "Grade each. Wet or drip is a Fail — not a watch note.",
			guideId: "baseline.seepage",
			checked: b.seepage.checked,
			notes: b.seepage.notes,
			onChecked: (v) => patch((d) => {
				d.baseline.seepage.checked = v;
			}),
			onNotes: (v) => patch((d) => {
				d.baseline.seepage.notes = v;
			}),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Valve covers",
					value: b.seepage.valveCover,
					options: SEEP_GRADES,
					onChange: (v) => patch((d) => {
						d.baseline.seepage.valveCover = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Timing cover",
					value: b.seepage.timingCover,
					options: SEEP_GRADES,
					onChange: (v) => patch((d) => {
						d.baseline.seepage.timingCover = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					label: "Oil pan",
					value: b.seepage.oilPan,
					options: SEEP_GRADES,
					onChange: (v) => patch((d) => {
						d.baseline.seepage.oilPan = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictSelect, {
					value: b.seepage.verdict,
					onChange: (v) => patch((d) => grade(d.baseline.seepage, v))
				})
			]
		}) : null,
		show("manifoldBolts") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
			title: "Exhaust manifold / heat-shield bolts",
			hint: "VK56 classic. Loose or missing heat-shield bolts are a Fail.",
			guideId: "baseline.manifoldBolts",
			checked: b.manifoldBolts.checked,
			notes: b.manifoldBolts.notes,
			onChecked: (v) => patch((d) => {
				d.baseline.manifoldBolts.checked = v;
			}),
			onNotes: (v) => patch((d) => {
				d.baseline.manifoldBolts.notes = v;
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictSelect, {
				value: b.manifoldBolts.verdict,
				onChange: (v) => patch((d) => grade(d.baseline.manifoldBolts, v))
			})
		}) : null,
		show("ucaJoints") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
			title: "Upper control arms / ball joints",
			hint: "Pair with inner pad/tire taper. Loose UCA or joint is a Fail.",
			guideId: "baseline.ucaJoints",
			checked: b.ucaJoints.checked,
			notes: b.ucaJoints.notes,
			onChecked: (v) => patch((d) => {
				d.baseline.ucaJoints.checked = v;
			}),
			onNotes: (v) => patch((d) => {
				d.baseline.ucaJoints.notes = v;
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Inner pad / tire taper",
				value: b.ucaJoints.innerTaper,
				options: [{
					value: "N",
					label: "Even"
				}, {
					value: "Y",
					label: "Inner taper"
				}],
				onChange: (v) => patch((d) => {
					d.baseline.ucaJoints.innerTaper = v;
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictSelect, {
				value: b.ucaJoints.verdict,
				onChange: (v) => patch((d) => grade(d.baseline.ucaJoints, v))
			})]
		}) : null,
		show("airShocks") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
			title: "Rear load-leveling / air shocks",
			hint: "If not equipped, Pass. If equipped, leaks or sag are a Fail.",
			guideId: "baseline.airShocks",
			checked: b.airShocks.checked,
			notes: b.airShocks.notes,
			onChecked: (v) => patch((d) => {
				d.baseline.airShocks.checked = v;
			}),
			onNotes: (v) => patch((d) => {
				d.baseline.airShocks.notes = v;
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Equipped",
				value: b.airShocks.equipped,
				options: [{
					value: "N",
					label: "Not equipped"
				}, {
					value: "Y",
					label: "Equipped"
				}],
				onChange: (v) => patch((d) => {
					d.baseline.airShocks.equipped = v;
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerdictSelect, {
				value: b.airShocks.verdict,
				onChange: (v) => patch((d) => grade(d.baseline.airShocks, v))
			})]
		}) : null,
		only ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
			value: b.notes,
			onChange: (v) => patch((d) => {
				d.baseline.notes = v;
			}),
			placeholder: "270k due notes"
		})
	] });
}
function ResultItem() {
	const r = useInspection((s) => s.draft.result);
	const line = useInspection((s) => oilChangeRecord(s.draft));
	const patch = useInspection((s) => s.patch);
	const oilChangeVisit = useInspection((s) => oilChangeMode(s.draft));
	const showPlan = useInspection((s) => rowShows("smodPlan", s.draft.header.visitType, s.draft.header.drive, s.draft.header.plan));
	const blocked = useInspection((s) => overallBlocked(s.draft));
	const embed = (0, import_react.useContext)(WalkEmbed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [showPlan && !embed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmodPlanItem, {}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hud-card space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "pt-2.5 font-semibold text-foreground",
						children: "Overall"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideLink, {
						id: "result.overall",
						label: "Overall result"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlainButton, {
					id: "result.overall",
					title: "Overall result"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
					value: r.overall,
					options: OVERALL_OPTIONS.map((o) => ({
						value: o.value,
						label: o.label,
						disabled: blocked && (o.value === "pass" || o.value === "pass-notes")
					})),
					onChange: (v) => patch((d) => {
						d.result.overall = blocked && (v === "pass" || v === "pass-notes") ? "do-not-drive" : v;
					})
				}),
				blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-fail",
					children: "Pass is blocked. A hard gate is open — overall is Do not drive."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
					value: r.failItems,
					onChange: (v) => patch((d) => {
						d.result.failItems = v;
					}),
					placeholder: "Fail items"
				}),
				oilChangeVisit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-foreground",
					children: line
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Oil change @",
					value: r.oilChangeMi,
					inputMode: "numeric",
					placeholder: "miles",
					onChange: (v) => patch((d) => {
						d.result.oilChangeMi = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOilButton, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "15k @",
					value: r.service15kMi,
					inputMode: "numeric",
					onChange: (v) => patch((d) => {
						d.result.service15kMi = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "30k powertrain @",
					value: r.service30kMi,
					inputMode: "numeric",
					onChange: (v) => patch((d) => {
						d.result.service30kMi = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
					label: "Sign-off name",
					value: r.signName,
					onChange: (v) => patch((d) => {
						d.result.signName = v;
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "field-label",
						children: "Sign date"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: r.signDate,
						onChange: (e) => patch((d) => {
							d.result.signDate = e.target.value;
						}),
						className: "field-input"
					})]
				})
			]
		})]
	});
}
function SmodPlanItem() {
	const plan = useInspection((s) => s.draft.result.smodPlan);
	const bypass = useInspection((s) => s.draft.engine.atfLines.bypassDone);
	const line = useInspection((s) => smodPlanRecord(s.draft));
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "SMOD prevention — 30k / 270k",
		hint: "Not milky today is not a maintenance plan. Photo the cooler fittings.",
		guideId: "result.smodPlan",
		checked: plan.checked,
		notes: plan.notes,
		onChecked: (v) => patch((d) => {
			d.result.smodPlan.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.result.smodPlan.notes = v;
		}),
		photoSlot: "engine.radiator",
		photoRequired: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Radiator last replacement",
				value: plan.radiatorLast,
				options: [{
					value: "original",
					label: "Original / unknown"
				}, {
					value: "replaced",
					label: "Replaced"
				}],
				onChange: (v) => patch((d) => {
					d.result.smodPlan.radiatorLast = v;
				})
			}),
			plan.radiatorLast === "replaced" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Replaced (year or YYYY-MM)",
				value: plan.radiatorDate,
				placeholder: "2019-06",
				onChange: (v) => patch((d) => {
					d.result.smodPlan.radiatorDate = v;
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed text-muted-foreground",
				children: [
					"Bypass / external cooler: ",
					bypass === "Y" ? "installed" : bypass === "N" ? "not installed" : "not marked — see cooler lines",
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-foreground",
				children: SMOD_INTERVAL
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-foreground",
				children: line
			})
		]
	});
}
function SteeringOne({ id }) {
	const it = STEERING_ITEMS.find((x) => x.key === id);
	const row = useInspection((s) => s.draft.steering.items[id]);
	const drive = useInspection((s) => s.draft.header.drive);
	const patch = useInspection((s) => s.patch);
	const title = id === "shafts" ? drivelineShaftLabel(drive) : it.label;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title,
		guideId: it.guideId,
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.steering.items[id].checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.steering.items[id].notes = v;
		}),
		photoSlot: photoSlotDef(`steering.${id}`)?.slot
	});
}
function UnderbodyOne({ id }) {
	const it = UNDERBODY_ITEMS.find((x) => x.key === id);
	const row = useInspection((s) => s.draft.underbody.items[id]);
	const patch = useInspection((s) => s.patch);
	if (!useShows()(`underbody.${id}`)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: it.label,
		guideId: it.guideId,
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.underbody.items[id].checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.underbody.items[id].notes = v;
		}),
		photoSlot: photoSlotDef(`underbody.${id}`)?.slot
	});
}
function CabinOne({ id }) {
	const it = CABIN_ITEMS.find((x) => x.key === id);
	const row = useInspection((s) => s.draft.cabin.items[id]);
	const patch = useInspection((s) => s.patch);
	if (!useShows()(`cabin.${id}`)) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: it.label,
		guideId: it.guideId,
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.cabin.items[id].checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.cabin.items[id].notes = v;
		}),
		photoSlot: photoSlotDef(`cabin.${id}`)?.slot,
		children: id === "airbag" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AirbagLampSelect, {}) : null
	});
}
function RoadOne({ id }) {
	const it = ROAD_ITEMS.find((x) => x.key === id);
	const row = useInspection((s) => s.draft.road.items[id]);
	const gauge = useInspection((s) => s.draft.road.gaugeStable);
	const patch = useInspection((s) => s.patch);
	if (useInspection((s) => isSmodRisk(s.draft) && !s.draft.smodAcknowledged)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "hud-alert text-sm text-foreground",
		children: "Road test is locked. ATF is pink, milky, or sweet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: it.label,
		guideId: it.guideId,
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.road.items[id].checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.road.items[id].notes = v;
		}),
		children: id === "overheat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Gauge stable",
			value: gauge,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.road.gaugeStable = v;
			})
		}) : null
	});
}
function CheckRowById({ id }) {
	const highlight = useInspection((s) => s.headerHighlight);
	const embed = (0, import_react.useContext)(WalkEmbed);
	if (id === "header") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderFields, { highlight });
	if (id === "engine.overview") {
		if (embed) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hud-card space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold text-foreground",
					children: "Engine bay overview"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "One wide shot — tanks, belt, battery, leaks."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlainButton, {
					id: "engine.overview",
					title: "Engine bay overview"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoField, {
					slot: "engine.overview",
					required: true,
					label: "Engine bay overview"
				})
			]
		});
	}
	if (id === "cabin.dash") {
		if (embed) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hud-card space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold text-foreground",
					children: "Dash warning lights (key ON)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlainButton, {
					id: "cabin.dash",
					title: "Dash warning lights (key on)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoField, {
					slot: "cabin.dash",
					required: true,
					label: "Dash warning lights (key on)"
				})
			]
		});
	}
	if (id === "oilLevel") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OilLevelItem, {});
	if (id === "atf") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtfItem, {});
	if (id === "washer") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WasherItem, {});
	if (id === "oilLeak") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FluidsOneLeak, {});
	if (id === "coolant") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoolantItem, {});
	if (id === "psf") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PsfItem, {});
	if (id === "brake") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrakeFluidItem, {});
	if (id === "transferSeep") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransferSeepItem, {});
	if (id === "frontDiffSeep") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrontDiffSeepItem, {});
	if (id === "rearDiffSeep") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RearDiffSeepItem, {});
	if (id === "timingCover") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineSlice, { slice: "timingCover" });
	if (id === "manifolds") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineSlice, { slice: "manifolds" });
	if (id === "idle") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineSlice, { slice: "idle" });
	if (id === "belt") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineSlice, { slice: "belt" });
	if (id === "radiator") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadiatorItem, {});
	if (id === "atfLines") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtfLinesItem, {});
	if (id === "airFilter") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineSlice, { slice: "airFilter" });
	if (id === "battery") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineSlice, { slice: "battery" });
	if (id === "grounds") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineSlice, { slice: "grounds" });
	if (id === "pcv") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineSlice, { slice: "pcv" });
	if (id === "scan") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineSlice, { slice: "scan" });
	if (id === "transTable") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransTable, {});
	if (id === "atfReject") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtfRejectItem, {});
	if (id === "smodPlan") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmodPlanItem, {});
	if (id === "baseline") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BaselineItems, {});
	if (id.startsWith("baseline.")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BaselineItems, { only: id.slice(9) });
	if (id === "pads") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrakeSlice, { slice: "pads" });
	if (id === "rotors") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrakeSlice, { slice: "rotors" });
	if (id === "hoses") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrakeSlice, { slice: "hoses" });
	if (id === "master") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrakeSlice, { slice: "master" });
	if (id === "pedalHeight") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrakeSlice, { slice: "pedalHeight" });
	if (id === "parking") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrakeSlice, { slice: "parking" });
	if (id === "absLamps") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AbsLampsItem, {});
	if (id === "tread") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreadItem, {});
	if (id === "tireAge") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TireAgeItem, {});
	if (id === "wear") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WearItem, {});
	if (id === "pressures") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PressuresItem, {});
	if (id === "lugTorque") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrakeSlice, { slice: "lugTorque" });
	if (id === "bearings") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrakeSlice, { slice: "bearings" });
	if (id === "alignment") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrakeSlice, { slice: "alignment" });
	if (id.startsWith("steering.")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SteeringOne, { id: id.slice(9) });
	if (id.startsWith("underbody.")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnderbodyOne, { id: id.slice(10) });
	if (id === "cabin.recalls") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabinRecalls, {});
	if (id.startsWith("cabin.")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabinOne, { id: id.slice(6) });
	if (id.startsWith("road.")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoadOne, { id: id.slice(5) });
	if (id === "result") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultItem, {});
	return null;
}
function FluidsOneLeak() {
	const row = useInspection((s) => s.draft.fluids.oilLeak);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Engine oil leak check",
		hint: "Valve covers / oil cooler O-ring / pan / front cover",
		guideId: "fluids.oilLeak",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.fluids.oilLeak.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.fluids.oilLeak.notes = v;
		}),
		photoSlot: "fluids.oilLeak"
	});
}
function CoolantItem() {
	const row = useInspection((s) => s.draft.fluids.coolant);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Coolant reservoir level & color",
		hint: "Engine cold. Do not open the radiator cap hot.",
		guideId: "fluids.coolant",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.fluids.coolant.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.fluids.coolant.notes = v;
		}),
		photoSlot: "fluids.coolant",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Level & color",
				value: row.levelColor,
				onChange: (v) => patch((d) => {
					d.fluids.coolant.levelColor = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Freeze point",
				value: row.freezeF,
				placeholder: "-34°F",
				inputMode: "decimal",
				onChange: (v) => patch((d) => {
					d.fluids.coolant.freezeF = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Cap seated",
				value: row.capSeated,
				options: [{
					value: "Y",
					label: "Y"
				}, {
					value: "N",
					label: "N"
				}],
				onChange: (v) => patch((d) => {
					d.fluids.coolant.capSeated = v;
				})
			})
		]
	});
}
function PsfItem() {
	const row = useInspection((s) => s.draft.fluids.psf);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Power steering fluid",
		hint: "COLD marks when cold, HOT marks after a drive. Nissan PSF.",
		guideId: "fluids.psf",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.fluids.psf.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.fluids.psf.notes = v;
		}),
		photoSlot: "fluids.psf",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
			label: "Level",
			value: row.level,
			onChange: (v) => patch((d) => {
				d.fluids.psf.level = v;
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
			label: "Color",
			value: row.color,
			onChange: (v) => patch((d) => {
				d.fluids.psf.color = v;
			})
		})]
	});
}
function BrakeFluidItem() {
	const row = useInspection((s) => s.draft.fluids.brake);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Brake fluid",
		hint: "DOT 3 from a sealed bottle. Flush every 24 months.",
		guideId: "fluids.brake",
		checked: row.checked,
		notes: row.notes,
		onChecked: (v) => patch((d) => {
			d.fluids.brake.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.fluids.brake.notes = v;
		}),
		photoSlot: "fluids.brake",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Level",
				value: row.level,
				onChange: (v) => patch((d) => {
					d.fluids.brake.level = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Color",
				value: row.color,
				options: [{
					value: "clear-amber",
					label: "Clear-amber"
				}, {
					value: "dark",
					label: "Dark"
				}],
				onChange: (v) => patch((d) => {
					d.fluids.brake.color = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Moisture",
				value: row.moisture,
				options: [{
					value: "dry",
					label: "Dry"
				}, {
					value: "high",
					label: "High"
				}],
				onChange: (v) => patch((d) => {
					d.fluids.brake.moisture = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Cap sealed",
				value: row.capSealed,
				options: [{
					value: "Y",
					label: "Y"
				}, {
					value: "N",
					label: "N"
				}],
				onChange: (v) => patch((d) => {
					d.fluids.brake.capSealed = v;
				})
			})
		]
	});
}
function CabinRecalls() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecallsCheck, {});
}
function RecallsCheck() {
	const recalls = useInspection((s) => s.draft.cabin.recalls);
	const vin = useInspection((s) => s.draft.header.vin);
	const visitDate = useInspection((s) => s.draft.header.date);
	const patch = useInspection((s) => s.patch);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	const [mismatch, setMismatch] = (0, import_react.useState)(false);
	const ready = isVinComplete(vin);
	const stale = Boolean(recalls.vinChecked && normalizeVin(vin) !== recalls.vinChecked);
	const stamp = recalls.checkedAt ? recallStamp({
		checkedAt: recalls.checkedAt,
		vinChecked: recalls.vinChecked,
		ymm: recalls.ymm,
		campaigns: recalls.campaigns
	}) : "";
	async function run() {
		if (!ready) {
			setErr("Enter the 17-character VIN in the header first.");
			return;
		}
		setBusy(true);
		setErr("");
		setMismatch(false);
		try {
			const res = await lookupNissanCampaigns({ data: { vin } });
			if (res.status !== "ok") {
				setErr(res.error);
				return;
			}
			setMismatch(res.mismatch);
			patch((d) => {
				d.cabin.recalls.checked = true;
				d.cabin.recalls.checkedAt = visitDate.trim() || res.checkedAt;
				d.cabin.recalls.vinChecked = res.vin;
				d.cabin.recalls.ymm = res.ymm;
				d.cabin.recalls.source = res.source;
				d.cabin.recalls.campaigns = res.campaigns;
			});
		} catch {
			setErr("Could not reach the NHTSA campaign list. Try again.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Nissan campaigns",
		hint: "Live VIN lookup. Stamps the form with the date.",
		guideId: "cabin.recalls",
		checked: recalls.checked,
		notes: recalls.notes,
		onChecked: (v) => patch((d) => {
			d.cabin.recalls.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.cabin.recalls.notes = v;
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs tracking-wide text-muted-foreground",
				children: [
					"VIN ",
					vin || "—",
					" ",
					ready ? "" : "· 17 characters"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: busy,
				onClick: () => void run(),
				className: "tap-56 w-full rounded border border-primary bg-raised px-3 text-sm font-semibold text-primary",
				children: busy ? "Checking NHTSA…" : "Check Nissan campaigns"
			}),
			err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-warn",
				children: err
			}) : null,
			mismatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-warn",
				children: [
					"VIN decoded as ",
					recalls.ymm || "a different vehicle",
					" — not this 2005 Armada. Stamp is still on the form."
				]
			}) : null,
			stale ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-warn",
				children: "Header VIN changed since the last check. Run it again."
			}) : null,
			stamp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 rounded border border-border bg-inset px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-foreground",
					children: stamp
				}), recalls.campaigns.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5 text-sm text-muted-foreground",
					children: recalls.campaigns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-foreground",
							children: c.id
						}),
						" — ",
						c.component
					] }, c.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "NHTSA listed no campaigns for that year/make/model."
				})]
			}) : null
		]
	});
}
function EngineSlice({ slice }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineItemsFiltered, { only: slice });
}
function EngineItemsFiltered({ only }) {
	const e = useInspection((s) => s.draft.engine);
	const patch = useInspection((s) => s.patch);
	const shows = useShows();
	const interval = shows("battery") || shows("scan") || shows("airFilter");
	if (only === "timingCover") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Cold-start noise — timing cover",
		hint: "Short rattle 1–3 sec then gone is common. Ongoing rattle is not.",
		guideId: "engine.timingCover",
		checked: e.timingCover.checked,
		notes: e.timingCover.notes,
		onChecked: (v) => patch((d) => {
			d.engine.timingCover.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.engine.timingCover.notes = v;
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Noise",
				value: e.timingCover.noise,
				options: [
					{
						value: "quiet",
						label: "Quiet"
					},
					{
						value: "short-rattle",
						label: "Short rattle"
					},
					{
						value: "ongoing-rattle",
						label: "Ongoing rattle"
					}
				],
				onChange: (v) => patch((d) => {
					d.engine.timingCover.noise = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Seconds",
				value: e.timingCover.seconds,
				inputMode: "numeric",
				onChange: (v) => patch((d) => {
					d.engine.timingCover.seconds = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Oil pressure",
				value: e.timingCover.oilPressure,
				options: [{
					value: "ok",
					label: "In the green"
				}, {
					value: "low",
					label: "Low / lamp"
				}],
				onChange: (v) => patch((d) => {
					d.engine.timingCover.oilPressure = v;
				})
			})
		]
	});
	if (only === "manifolds") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Cold-start noise — exhaust manifolds",
		hint: "Tick plus soot at the flange gets scheduled.",
		guideId: "engine.manifolds",
		checked: e.manifolds.checked,
		notes: e.manifolds.notes,
		onChecked: (v) => patch((d) => {
			d.engine.manifolds.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.engine.manifolds.notes = v;
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Noise",
			value: e.manifolds.noise,
			options: [
				{
					value: "quiet",
					label: "Quiet"
				},
				{
					value: "tick-l",
					label: "Tick L"
				},
				{
					value: "tick-r",
					label: "Tick R"
				},
				{
					value: "both",
					label: "Both"
				}
			],
			onChange: (v) => patch((d) => {
				d.engine.manifolds.noise = v;
			})
		}), interval ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Soot at flange",
			value: e.manifolds.soot,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.engine.manifolds.soot = v;
			})
		}) : null]
	});
	if (only === "idle") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Idle quality",
		guideId: "engine.idle",
		checked: e.idle.checked,
		notes: e.idle.notes,
		onChecked: (v) => patch((d) => {
			d.engine.idle.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.engine.idle.notes = v;
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Quality",
			value: e.idle.quality,
			options: [{
				value: "smooth",
				label: "Smooth"
			}, {
				value: "rough",
				label: "Rough"
			}],
			onChange: (v) => patch((d) => {
				d.engine.idle.quality = v;
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "CEL",
			value: e.idle.cel,
			options: [{
				value: "off",
				label: "Off"
			}, {
				value: "on",
				label: "On"
			}],
			onChange: (v) => patch((d) => {
				d.engine.idle.cel = v;
			})
		})]
	});
	if (only === "belt") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Serpentine belt",
		guideId: "engine.belt",
		checked: e.belt.checked,
		notes: e.belt.notes,
		onChecked: (v) => patch((d) => {
			d.engine.belt.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.engine.belt.notes = v;
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Condition",
			value: e.belt.condition,
			options: [
				{
					value: "ok",
					label: "OK"
				},
				{
					value: "cracks",
					label: "Cracks"
				},
				{
					value: "glaze",
					label: "Glaze"
				},
				{
					value: "fray",
					label: "Fray"
				}
			],
			onChange: (v) => patch((d) => {
				d.engine.belt.condition = v;
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Tensioner play",
			value: e.belt.tensionerPlay,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.engine.belt.tensionerPlay = v;
			})
		})]
	});
	if (only === "airFilter") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Air filter",
		hint: "Cabin filter is a 15k item, behind the glove box.",
		guideId: "engine.airFilter",
		checked: e.airFilter.checked,
		notes: e.airFilter.notes,
		onChecked: (v) => patch((d) => {
			d.engine.airFilter.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.engine.airFilter.notes = v;
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Condition",
			value: e.airFilter.condition,
			options: [
				{
					value: "clean",
					label: "Clean"
				},
				{
					value: "dirty",
					label: "Dirty"
				},
				{
					value: "replace",
					label: "Replace"
				}
			],
			onChange: (v) => patch((d) => {
				d.engine.airFilter.condition = v;
			})
		}), interval ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Cabin filter due",
			value: e.airFilter.cabinDue,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.engine.airFilter.cabinDue = v;
			})
		}) : null]
	});
	if (only === "battery") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Battery",
		hint: interval ? "Rest ~12.4–12.7 V. Running ~13.5–14.7 V." : "Glance the terminals. Load test unhides at 15k / 30k.",
		guideId: "engine.battery",
		checked: e.battery.checked,
		notes: e.battery.notes,
		onChecked: (v) => patch((d) => {
			d.engine.battery.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.engine.battery.notes = v;
		}),
		photoSlot: "engine.battery",
		children: [
			interval ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Rest V",
				value: e.battery.restV,
				inputMode: "decimal",
				onChange: (v) => patch((d) => {
					d.engine.battery.restV = v;
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Running V",
				value: e.battery.runningV,
				inputMode: "decimal",
				onChange: (v) => patch((d) => {
					d.engine.battery.runningV = v;
				})
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Terminals clean",
				value: e.battery.terminalsClean,
				options: [{
					value: "Y",
					label: "Y"
				}, {
					value: "N",
					label: "N"
				}],
				onChange: (v) => patch((d) => {
					d.engine.battery.terminalsClean = v;
				})
			}),
			interval ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
				label: "Load test",
				value: e.battery.loadTest,
				options: [{
					value: "pass",
					label: "Pass"
				}, {
					value: "fail",
					label: "Fail"
				}],
				onChange: (v) => patch((d) => {
					d.engine.battery.loadTest = v;
				})
			}) : null
		]
	});
	if (only === "grounds") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Ground straps",
		hint: "Block-to-chassis and body.",
		guideId: "engine.grounds",
		checked: e.grounds.checked,
		notes: e.grounds.notes,
		onChecked: (v) => patch((d) => {
			d.engine.grounds.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.engine.grounds.notes = v;
		}),
		photoSlot: "engine.grounds",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Condition",
			value: e.grounds.condition,
			options: [{
				value: "tight",
				label: "Tight"
			}, {
				value: "corroded",
				label: "Corroded"
			}],
			onChange: (v) => patch((d) => {
				d.engine.grounds.condition = v;
			})
		})
	});
	if (only === "pcv") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "PCV hose / vacuum lines",
		guideId: "engine.pcv",
		checked: e.pcv.checked,
		notes: e.pcv.notes,
		onChecked: (v) => patch((d) => {
			d.engine.pcv.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.engine.pcv.notes = v;
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Condition",
			value: e.pcv.condition,
			options: [
				{
					value: "ok",
					label: "OK"
				},
				{
					value: "cracked",
					label: "Cracked"
				},
				{
					value: "oily",
					label: "Oily"
				}
			],
			onChange: (v) => patch((d) => {
				d.engine.pcv.condition = v;
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Scan tool",
		hint: "Write codes before you clear them.",
		guideId: "engine.scan",
		checked: e.scan.checked,
		notes: e.scan.notes,
		onChecked: (v) => patch((d) => {
			d.engine.scan.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.engine.scan.notes = v;
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Stored codes",
				value: e.scan.stored,
				onChange: (v) => patch((d) => {
					d.engine.scan.stored = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Pending",
				value: e.scan.pending,
				onChange: (v) => patch((d) => {
					d.engine.scan.pending = v;
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "ATF temp",
				value: e.scan.atfTemp,
				onChange: (v) => patch((d) => {
					d.engine.scan.atfTemp = v;
				})
			})
		]
	});
}
function BrakeSlice({ slice }) {
	const b = useInspection((s) => s.draft.brakes);
	const patch = useInspection((s) => s.patch);
	const shows = useShows();
	if (slice === "pads") {
		const showPads = shows("pads");
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
			title: "Pad thickness",
			hint: showPads ? "Measure remaining friction material, not the steel backing." : "Visual check on an oil-change short visit. Full mm readings unhide at 15k / 30k.",
			guideId: "brakes.pads",
			checked: b.pads.checked,
			notes: b.pads.notes,
			onChecked: (v) => patch((d) => {
				d.brakes.pads.checked = v;
			}),
			onNotes: (v) => patch((d) => {
				d.brakes.pads.notes = v;
			}),
			children: [
				showPads ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerGrid, {
					keys: CORNERS,
					values: b.pads,
					suffix: "mm",
					onChange: (k, v) => patch((d) => {
						d.brakes.pads[k] = v;
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WearVsLast, { kind: "pads" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerPhotos, {
					prefix: "brakes.pads",
					required: true
				})
			]
		});
	}
	if (slice === "rotors") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Rotors",
		hint: "Thickness / rust lip / pulse on stop",
		guideId: "brakes.rotors",
		checked: b.rotors.checked,
		notes: b.rotors.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.rotors.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.rotors.notes = v;
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
			label: "Front",
			value: b.rotors.front,
			onChange: (v) => patch((d) => {
				d.brakes.rotors.front = v;
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
			label: "Rear",
			value: b.rotors.rear,
			onChange: (v) => patch((d) => {
				d.brakes.rotors.rear = v;
			})
		})]
	});
	if (slice === "hoses") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Brake hoses & lines",
		hint: "Calipers, hoses, and steel lines. Wet caliper is a fail — open Guide for how to inspect them.",
		guideId: "brakes.hoses",
		checked: b.hoses.checked,
		notes: b.hoses.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.hoses.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.hoses.notes = v;
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
			label: "Condition",
			value: b.hoses.condition,
			onChange: (v) => patch((d) => {
				d.brakes.hoses.condition = v;
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Wet caliper",
			value: b.hoses.wetCaliper,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.brakes.hoses.wetCaliper = v;
			})
		})]
	});
	if (slice === "master") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Master cylinder / booster",
		guideId: "brakes.master",
		checked: b.master.checked,
		notes: b.master.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.master.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.master.notes = v;
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Seepage",
			value: b.master.seepage,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.brakes.master.seepage = v;
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Pedal firm",
			value: b.master.pedalFirm,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.brakes.master.pedalFirm = v;
			})
		})]
	});
	if (slice === "pedalHeight") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Pedal height engine running",
		hint: "Spec ≥ 3.5 in @ 110 lb",
		guideId: "brakes.pedalHeight",
		checked: b.pedalHeight.checked,
		notes: b.pedalHeight.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.pedalHeight.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.pedalHeight.notes = v;
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
			label: "Measured",
			value: b.pedalHeight.measured,
			onChange: (v) => patch((d) => {
				d.brakes.pedalHeight.measured = v;
			})
		})
	});
	if (slice === "parking") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SimpleCheck, {
		title: "Parking brake",
		hint: "Spec 3–4 clicks @ 44 lb",
		guideId: "brakes.parking",
		checked: b.parking.checked,
		notes: b.parking.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.parking.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.parking.notes = v;
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
			label: "Clicks",
			value: b.parking.clicks,
			inputMode: "numeric",
			onChange: (v) => patch((d) => {
				d.brakes.parking.clicks = v;
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Holds on grade",
			value: b.parking.holdsGrade,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.brakes.parking.holdsGrade = v;
			})
		})]
	});
	if (slice === "lugTorque") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Lug torque after rotation",
		hint: "98 ft-lb star. Recheck after the road test.",
		guideId: "brakes.lugTorque",
		checked: b.lugTorque.checked,
		notes: b.lugTorque.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.lugTorque.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.lugTorque.notes = v;
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Rechecked after drive",
			value: b.lugTorque.rechecked,
			options: [{
				value: "Y",
				label: "Y"
			}, {
				value: "N",
				label: "N"
			}],
			onChange: (v) => patch((d) => {
				d.brakes.lugTorque.rechecked = v;
			})
		})
	});
	if (slice === "bearings") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Wheel bearings / hubs",
		guideId: "brakes.bearings",
		checked: b.bearings.checked,
		notes: b.bearings.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.bearings.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.bearings.notes = v;
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerGrid, {
			keys: CORNERS,
			values: b.bearings,
			onChange: (k, v) => patch((d) => {
				d.brakes.bearings[k] = v;
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleCheck, {
		title: "Alignment feel",
		guideId: "brakes.alignment",
		checked: b.alignment.checked,
		notes: b.alignment.notes,
		onChecked: (v) => patch((d) => {
			d.brakes.alignment.checked = v;
		}),
		onNotes: (v) => patch((d) => {
			d.brakes.alignment.notes = v;
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipSelect, {
			label: "Feel",
			value: b.alignment.feel,
			options: [
				{
					value: "straight",
					label: "Straight"
				},
				{
					value: "pull-l",
					label: "Pull L"
				},
				{
					value: "pull-r",
					label: "Pull R"
				},
				{
					value: "wander",
					label: "Wander"
				}
			],
			onChange: (v) => patch((d) => {
				d.brakes.alignment.feel = v;
			})
		})
	});
}
var DB_NAME = "armada-inspection-voice-v1";
var STORE = "clips";
function openDb() {
	return new Promise((resolve, reject) => {
		if (typeof indexedDB === "undefined") {
			reject(/* @__PURE__ */ new Error("no indexedDB"));
			return;
		}
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
function key(draftId, rowId) {
	return `${draftId}:${rowId}`;
}
async function loadVoice(draftId, rowId) {
	try {
		const db = await openDb();
		return await new Promise((resolve, reject) => {
			const req = db.transaction(STORE, "readonly").objectStore(STORE).get(key(draftId, rowId));
			req.onsuccess = () => resolve(req.result || null);
			req.onerror = () => reject(req.error);
		});
	} catch {
		return null;
	}
}
async function saveVoice(draftId, clip) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.objectStore(STORE).put(clip, key(draftId, clip.rowId));
	});
}
async function deleteVoice(draftId, rowId) {
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
		tx.objectStore(STORE).delete(key(draftId, rowId));
	});
}
function blobToDataUrl(blob) {
	return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => resolve(String(r.result));
		r.onerror = () => reject(r.error);
		r.readAsDataURL(blob);
	});
}
function speechEngine() {
	const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
	if (!Ctor) return null;
	const rec = new Ctor();
	rec.continuous = true;
	rec.interimResults = true;
	rec.lang = "en-US";
	return rec;
}
function VoiceNote({ rowId }) {
	const draftId = useInspection((s) => s.draft.id);
	const patch = useInspection((s) => s.patch);
	const touchSave = useInspection((s) => s.touchSave);
	const [clip, setClip] = (0, import_react.useState)(null);
	const [holding, setHolding] = (0, import_react.useState)(false);
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const recRef = (0, import_react.useRef)(null);
	const chunks = (0, import_react.useRef)([]);
	const started = (0, import_react.useRef)(0);
	const speechRef = (0, import_react.useRef)(null);
	const transcript = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		let live = true;
		loadVoice(draftId, rowId).then((c) => {
			if (live) setClip(c);
		});
		return () => {
			live = false;
		};
	}, [draftId, rowId]);
	async function startHold() {
		if (holding) return;
		transcript.current = "";
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const rec = new MediaRecorder(stream);
			chunks.current = [];
			rec.ondataavailable = (e) => {
				if (e.data.size) chunks.current.push(e.data);
			};
			rec.start();
			recRef.current = rec;
			started.current = Date.now();
			setHolding(true);
			const speech = speechEngine();
			if (speech) {
				speech.onresult = (ev) => {
					const last = ev.results[ev.results.length - 1];
					if (last) transcript.current = last[0].transcript.trim();
				};
				speech.onerror = () => void 0;
				try {
					speech.start();
				} catch {}
				speechRef.current = speech;
			}
		} catch {
			setHolding(false);
		}
	}
	async function stopHold() {
		const rec = recRef.current;
		recRef.current = null;
		setHolding(false);
		speechRef.current?.stop();
		speechRef.current = null;
		if (!rec) return;
		await new Promise((resolve) => {
			rec.onstop = () => resolve();
			if (rec.state !== "inactive") rec.stop();
			else resolve();
		});
		rec.stream.getTracks().forEach((t) => t.stop());
		const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
		if (blob.size < 200) return;
		try {
			const dataUrl = await blobToDataUrl(blob);
			const next = {
				id: `${rowId}-${Date.now()}`,
				rowId,
				dataUrl,
				durationMs: Date.now() - started.current,
				transcript: transcript.current,
				createdAt: Date.now()
			};
			await saveVoice(draftId, next);
			setClip(next);
			let spoken = next.transcript;
			if (!spoken) {
				spoken = await transcribeIfNeeded(next.dataUrl);
				if (spoken) {
					next.transcript = spoken;
					setClip({
						...next,
						transcript: spoken
					});
				}
			}
			if (spoken) patch((d) => {
				setRowNotes(d, rowId, appendNote(rowNotes(d, rowId), spoken));
			});
			touchSave();
			useInspection.getState().flushPersist();
		} catch {
			useInspection.getState().setSaveError("Could not save — free space or export PDF now.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "field-label",
				children: "Voice note"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onPointerDown: (e) => {
					e.preventDefault();
					startHold();
				},
				onPointerUp: () => void stopHold(),
				onPointerCancel: () => void stopHold(),
				onPointerLeave: () => holding && void stopHold(),
				onContextMenu: (e) => e.preventDefault(),
				className: cn("tap-56 flex w-full touch-none select-none items-center justify-center gap-2 rounded border font-semibold", holding ? "border-fail bg-fail text-foreground" : "border-border bg-raised text-foreground"),
				children: [holding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5" }), holding ? "Release to save" : "Hold to record"]
			}),
			clip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 rounded border border-border bg-inset p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
						src: clip.dataUrl,
						controls: true,
						className: "w-full"
					}),
					clip.transcript ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-foreground",
						children: clip.transcript
					}) : null,
					confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "tap-56 rounded border border-border bg-raised font-medium",
							onClick: () => setConfirm(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "tap-56 rounded bg-fail font-semibold text-foreground",
							onClick: () => {
								deleteVoice(draftId, rowId).then(() => setClip(null));
								setConfirm(false);
								touchSave();
							},
							children: "Delete"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setConfirm(true),
						className: "tap-56 inline-flex w-full items-center justify-center gap-1 rounded border border-border font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Delete voice note"]
					})
				]
			}) : null
		]
	});
}
/** Every checklist / walk-through row that has a Guide control. */
function checklistGuideIds() {
	return [
		"fluids.oilLevel",
		"fluids.oilLeak",
		"fluids.coolant",
		"fluids.atf",
		"fluids.psf",
		"fluids.brake",
		"fluids.washer",
		"fluids.transferSeep",
		"fluids.frontDiffSeep",
		"fluids.rearDiffSeep",
		"engine.timingCover",
		"engine.manifolds",
		"engine.idle",
		"engine.belt",
		"engine.radiator",
		"engine.atfLines",
		"engine.airFilter",
		"engine.battery",
		"engine.grounds",
		"engine.pcv",
		"engine.scan",
		...TRANS_ROWS.map((r) => r.guideId),
		"trans.atfReject",
		"brakes.pads",
		"brakes.rotors",
		"brakes.hoses",
		"brakes.master",
		"brakes.pedalHeight",
		"brakes.parking",
		"brakes.absLamps",
		"brakes.tread",
		"brakes.tireAge",
		"brakes.wear",
		"brakes.pressures",
		"brakes.lugTorque",
		"brakes.bearings",
		"brakes.alignment",
		...STEERING_ITEMS.map((i) => i.guideId),
		...UNDERBODY_ITEMS.map((i) => i.guideId),
		...CABIN_ITEMS.map((i) => i.guideId),
		"cabin.recalls",
		...ROAD_ITEMS.map((i) => i.guideId),
		"result.smodPlan",
		"result.overall",
		...BASELINE_ITEMS.map((i) => i.guideId)
	];
}
var BARE_PREFIX = {
	oilLevel: "fluids",
	oilLeak: "fluids",
	coolant: "fluids",
	atf: "fluids",
	psf: "fluids",
	brake: "fluids",
	washer: "fluids",
	transferSeep: "fluids",
	frontDiffSeep: "fluids",
	rearDiffSeep: "fluids",
	timingCover: "engine",
	manifolds: "engine",
	idle: "engine",
	belt: "engine",
	radiator: "engine",
	atfLines: "engine",
	airFilter: "engine",
	battery: "engine",
	grounds: "engine",
	pcv: "engine",
	scan: "engine",
	pads: "brakes",
	rotors: "brakes",
	hoses: "brakes",
	master: "brakes",
	pedalHeight: "brakes",
	parking: "brakes",
	absLamps: "brakes",
	tread: "brakes",
	tireAge: "brakes",
	wear: "brakes",
	pressures: "brakes",
	lugTorque: "brakes",
	bearings: "brakes",
	alignment: "brakes",
	atfReject: "trans",
	smodPlan: "result"
};
/** Walk rows that are forms, not a single how-to. */
var WALK_NO_GUIDE = /* @__PURE__ */ new Set([
	"header",
	"transTable",
	"baseline",
	"engine.overview",
	"cabin.dash"
]);
/** Map a Walk-the-truck row id to its Guide chapter, or null if that row has no Guide. */
function walkRowGuideId(row) {
	if (WALK_NO_GUIDE.has(row)) return null;
	if (row === "result") return "result.overall";
	if (row.includes(".")) return row;
	const prefix = BARE_PREFIX[row];
	return prefix ? `${prefix}.${row}` : null;
}
/** Checklist row id for a Guide chapter. Trans shift rows share the 15k table. */
function guideRowId(guideId) {
	if (guideId === "result.overall") return "result";
	if (guideId === "trans.atfReject") return "atfReject";
	if (guideId === "trans.fourwd") return "trans.fourwd";
	if (guideId.startsWith("trans.")) return "transTable";
	const dot = guideId.indexOf(".");
	if (dot < 0) return guideId;
	const prefix = guideId.slice(0, dot);
	const rest = guideId.slice(dot + 1);
	if (prefix === "steering" || prefix === "underbody" || prefix === "cabin" || prefix === "road" || prefix === "baseline") return guideId;
	return rest;
}
/** Guide chapters that belong to a visible checklist row for this visit / drive. */
function guideShows(guideId, visit, drive, plan = null) {
	if (guideId === "result.overall") return true;
	if (guideId === "trans.fourwd") return rowShows("transTable", visit, drive, plan) && driveShows(drive, "4WD");
	return rowShows(guideRowId(guideId), visit, drive, plan);
}
function visibleGuideIds(visit, drive, plan = null) {
	return checklistGuideIds().filter((id) => guideShows(id, visit, drive, plan));
}
var WALK_STEPS = [
	{
		num: 1,
		title: "Outside, engine off, cold",
		blurb: "Tires and lights. Look at the ground for fresh drips. Each row’s Guide opens that part’s how-to.",
		rows: [
			"tread",
			"tireAge",
			"wear",
			"pressures",
			"lugTorque",
			"cabin.jack",
			"cabin.airbag",
			"cabin.seatbelts",
			"cabin.latches",
			"cabin.horn",
			"cabin.lights",
			"cabin.wipers",
			"cabin.hvac",
			"cabin.glass",
			"cabin.recalls"
		]
	},
	{
		num: 2,
		title: "Under hood, engine off, cold",
		blurb: "Do not start it yet. Coolant reservoir, radiator, brake fluid, PSF, battery, air filter, PCV.",
		rows: [
			"coolant",
			"radiator",
			"engine.overview",
			"brake",
			"psf",
			"battery",
			"grounds",
			"airFilter",
			"pcv",
			"washer",
			"baseline.sparkPlugs",
			"baseline.coolantService",
			"baseline.brakeFluid"
		]
	},
	{
		num: 3,
		title: "First start, still in the driveway",
		blurb: "You are listening. Do not rev it. Timing cover, manifolds, idle, dash lamps.",
		rows: [
			"timingCover",
			"manifolds",
			"idle",
			"scan",
			"absLamps",
			"cabin.dash",
			"road.coldStart",
			"baseline.manifoldBolts"
		]
	},
	{
		num: 4,
		title: "Engine oil",
		blurb: "Oil-change visit: drain, filter, fill. 15k / 30k: hot dipstick after 10 minutes.",
		rows: ["oilLevel"]
	},
	{
		num: 5,
		title: "Transmission fluid (the important one)",
		blurb: "Idle, shift P-R-N-D, then HOT read. Pink, milky, or sweet is SMOD — stop.",
		rows: ["atf"]
	},
	{
		num: 6,
		title: "Short road loop",
		blurb: "Quiet road. Temp gauge, one clean upshift, a stop. Full trans table is 15k / 30k. Skip this drive if ATF is pink or milky.",
		rows: [
			"transTable",
			"road.overheat",
			"road.brakes",
			"road.vibration",
			"road.shifts",
			"road.lamps"
		]
	},
	{
		num: 7,
		title: "After the drive (heat makes leaks show)",
		blurb: "Park level. Engine off. Oil leak, belt, pads glance, pan, cooler fittings. Front-end is 15k / 30k.",
		rows: [
			"oilLeak",
			"belt",
			"pads",
			"rotors",
			"hoses",
			"master",
			"pedalHeight",
			"parking",
			"bearings",
			"alignment",
			"steering.steeringPlay",
			"steering.tieRods",
			"steering.ballJoints",
			"steering.sway",
			"steering.springs",
			"steering.shocks",
			"steering.rack",
			"steering.shafts",
			"steering.seals",
			"steering.mounts",
			"underbody.oilPan",
			"underbody.transPan",
			"underbody.fuel",
			"underbody.exhaust",
			"underbody.frame",
			"underbody.lines",
			"baseline.seepage",
			"baseline.ucaJoints",
			"baseline.airShocks"
		]
	},
	{
		num: 8,
		title: "Radiator / SMOD check",
		blurb: "ATF cooler is built into this radiator. Wet fittings or milky ATF — do not keep driving it. 30k / 270k: prevention, not just detection.",
		rows: [
			"atfLines",
			"atfReject",
			"smodPlan"
		]
	},
	{
		num: 9,
		title: "Differentials and transfer case",
		blurb: "Not dipstick items. 30k service. Hidden on an oil-change short check.",
		rows: [
			"transferSeep",
			"frontDiffSeep",
			"rearDiffSeep",
			"baseline.diffFluid"
		]
	},
	{
		num: 10,
		title: "Result",
		blurb: "Call it. Pink/milky/sweet ATF cannot be a Pass. 30k: write the SMOD prevention plan.",
		rows: ["result"]
	}
];
var SECTION_SHORT = {
	1: "Outside",
	2: "Fluids",
	3: "First start",
	4: "Engine oil",
	5: "ATF",
	6: "Road",
	7: "Leaks / chassis",
	8: "SMOD",
	9: "Diffs",
	10: "Result"
};
var PLAIN_TITLE = {
	oilLevel: "dipstick",
	oilLeak: "wet spots, not dust",
	coolant: "overflow tank",
	atf: "skinny stick, engine idling",
	radiator: "front tank + cooler fittings",
	atfLines: "in-radiator ATF cooler",
	pads: "inner pad through the window",
	tread: "tread + inner shoulder",
	timingCover: "listen, do not rev",
	engine: "wide bay shot",
	"engine.overview": "wide bay shot",
	"cabin.dash": "key ON, lamps",
	result: "overall call"
};
var LOOK_FOR = {
	oilLevel: [
		"Level between the marks after the 10-minute wait",
		"No metallic glitter",
		"Not milky / coffee-colored (coolant in oil)",
		"No strong fuel smell"
	],
	"oilLevel.service": [
		"Record oil type, amount, filter PN, crush washer",
		"Miles come from the header",
		"Do not read the dipstick after a fresh fill"
	],
	atf: [
		"Idle, then shift P-R-N-D, then HOT read",
		"Color is red/amber, not pink or milky",
		"Smell is ATF, not sweet (SMOD)",
		"Level in the HOT hashes with the engine running"
	],
	pads: [
		"Inner pad through the caliper window, flashlight",
		"Factory min 3.0 mm; replace at 1.0 mm",
		"Inner vs outer taper can mean a sticky caliper or UCA"
	],
	radiator: [
		"Stand at the front bumper, hood open",
		"End tanks dry — no wet ATF cooler fittings",
		"Unknown original radiator at high miles is an SMOD risk even if ATF looks red"
	],
	atfLines: [
		"Two small fittings on the passenger-side end tank",
		"Dry fittings = good. Wet = photo and do not ignore",
		"Pink/milky ATF plus wet fittings — do not drive"
	],
	coolant: [
		"Overflow tank between MIN and MAX, engine cold",
		"No oil sheen, no strawberry tint",
		"Factory freeze around −34°F on a 50/50 mix"
	],
	tread: [
		"Depth in 32nds, all four plus spare if you have it",
		"Inner shoulder — that is where this truck wears first",
		"2/32 is legal minimum; even wear is the spec"
	],
	timingCover: [
		"One start, no rev. Listen at the front cover",
		"1–3 seconds then gone can be a watch",
		"Ongoing rattle plus low oil — do not drive"
	],
	result: [
		"Overall is Pass, schedule repairs, or Do not drive",
		"Pink/milky/sweet ATF cannot be a Pass",
		"Save, print, PDF, share, or email from the report"
	]
};
/** 2WD drops transfer/front diff. Oil-change is Step 12 short set. */
function walkRowVisible(id, visit, drive, plan = null) {
	return rowShows(id, visit, drive, plan);
}
function walkStepCopy(step, drive, visit = "", oilChange = isOilChange(visit)) {
	if (step.num === 4) {
		if (oilChange) return {
			title: "Oil change",
			blurb: "Drain, filter, fill. Record type, quarts, filter PN, crush washer. Not a dipstick read — no color, no level."
		};
		return {
			title: "After warmup — engine oil for real",
			blurb: "Engine off. Wait more than 10 minutes so oil drains back. Then the dipstick."
		};
	}
	if (oilChange) {
		if (step.num === 1) return {
			title: "Tires and lights",
			blurb: "Tread, age, wear, pressures, lamps, wipers. Ground for drips."
		};
		if (step.num === 3) return {
			title: "Listen",
			blurb: "Do not rev it. Timing cover, manifolds, idle, dash lamps. Scan is 15k."
		};
		if (step.num === 6) return {
			title: "Short road loop",
			blurb: "Temp gauge, one clean upshift, a stop. Not the 15–20 min trans table."
		};
		if (step.num === 7) return {
			title: "Leak look",
			blurb: "Heat makes leaks show. Oil leak, belt, visual pads, pan, ATF cooler fittings."
		};
	}
	if (step.num === 9 && drive === "2WD") return {
		title: "Rear differential",
		blurb: "2WD has no transfer case or front axle. Rear diff is a 30k service item."
	};
	return {
		title: step.title,
		blurb: step.blurb
	};
}
function shopTitle(id) {
	if (id === "engine.overview") return "Engine bay overview";
	if (id === "cabin.dash") return "Dash warning lights (key ON)";
	if (id === "result") return "Overall result";
	if (id === "transTable") return "Transmission shift table";
	return STATUS_ROW_LABELS[id] ?? id;
}
function lookForOf(id, oilChange) {
	if (id === "oilLevel" && oilChange) return LOOK_FOR["oilLevel.service"] ?? [];
	if (LOOK_FOR[id]) return LOOK_FOR[id];
	const gid = walkRowGuideId(id);
	const p = gid ? plainFor(gid) : void 0;
	if (!p) return [];
	return [
		p.looksGood,
		p.specPlain,
		p.secondLook,
		p.stopShop
	].filter((s) => Boolean(s && s.trim()));
}
function expandRow(id) {
	if (id === "baseline") return BASELINE_ITEMS.map((i) => `baseline.${i.key}`);
	return [id];
}
/** One card per visible checklist row, in the 10-stage yard order. Result is last. */
function walkQueue(visit, drive, plan = null, oilChange = isOilChange(visit)) {
	const out = [];
	for (const step of WALK_STEPS) {
		const copy = walkStepCopy(step, drive, visit, oilChange);
		for (const raw of step.rows) for (const id of expandRow(raw)) {
			if (id === "header") continue;
			if (!walkRowVisible(id, visit, drive, plan)) continue;
			const guideId = walkRowGuideId(id);
			out.push({
				id,
				stageNum: step.num,
				stageTitle: copy.title,
				section: SECTION_SHORT[step.num] ?? copy.title,
				shopTitle: id === "oilLevel" && oilChange ? "Record oil change" : shopTitle(id),
				plainTitle: id === "oilLevel" && oilChange ? "type, amount, filter, miles" : PLAIN_TITLE[id] ?? "",
				lookFor: lookForOf(id, oilChange),
				guideId
			});
		}
	}
	return out;
}
var WALK_CHIPS = [
	{
		value: "pass",
		label: "PASS",
		status: "pass"
	},
	{
		value: "monitor",
		label: "MONITOR",
		status: "monitor"
	},
	{
		value: "attention",
		label: "SERVICE SOON",
		status: "attention"
	},
	{
		value: "asap",
		label: "URGENT",
		status: "asap"
	},
	{
		value: "na",
		label: "N/A",
		status: "na"
	},
	{
		value: "unable",
		label: "UNABLE",
		status: "unable"
	}
];
var NOTE_CHIPS = [
	"seepage",
	"dry",
	"inner pad thin",
	"wet fitting",
	"rattle gone after 2s",
	"original radiator",
	"no glitter"
];
function slotsFor(id) {
	return photoSlotsForItem(id).filter((s) => photoSlotDef(s));
}
function requiredSlots(id) {
	return slotsFor(id).filter((s) => isRequiredPhotoSlot(s) || photoSlotDef(s)?.required);
}
function stepReady(card, draft, photos, reason) {
	if (card.id === "result") {
		if (!draft.result.overall) return {
			ok: false,
			why: "Set the overall call"
		};
		const missing = missingRequiredPhotos(draft, photos);
		if (missing.length) return {
			ok: false,
			why: `${missing.length} photos still required`
		};
		return {
			ok: true,
			why: ""
		};
	}
	const choice = walkChoiceOf(draft, card.id);
	if (!choice) return {
		ok: false,
		why: "Set a status"
	};
	const need = requiredSlots(card.id);
	if (choice === "na" || choice === "unable") {
		if (need.length && !reason.trim() && need.some((s) => !photoSkipReason(draft, s))) return {
			ok: false,
			why: "Add a reason"
		};
		return {
			ok: true,
			why: ""
		};
	}
	for (const slot of need) {
		const def = photoSlotDef(slot);
		if (!def) continue;
		if (shotOk(photos[slot]) || def && hasPhoto(photos, def)) continue;
		if (photoSkipReason(draft, slot)) continue;
		return {
			ok: false,
			why: "Take the photo, or mark UNABLE with a reason"
		};
	}
	return {
		ok: true,
		why: ""
	};
}
function WalkStatus({ id }) {
	const choice = useInspection((s) => walkChoiceOf(s.draft, id));
	const mapped = useInspection((s) => rowStatus(s.draft, id));
	const photos = useInspection((s) => s.photos);
	const patch = useInspection((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "field-label",
				children: "Status"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: WALK_CHIPS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						patch((d) => {
							applyWalkChoice(d, id, o.value, photos);
						});
						markGrokConfirmedIfEditing(id);
						useInspection.getState().flushPersist();
					},
					"data-status": o.status,
					"data-on": choice === o.value ? "true" : "false",
					className: cn("chip-status tap-56 rounded border px-2 text-sm font-bold tracking-wide", choice === o.value ? "" : "chip-off"),
					children: o.label
				}, o.value))
			}),
			mapped === "asap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-snug text-fail",
				children: "URGENT — factory range or a do-not-drive gate fired."
			}) : mapped === "attention" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-snug text-attention",
				children: "SERVICE SOON — truck can still be driven."
			}) : null
		]
	});
}
function WalkCardView({ card, index, total }) {
	const draft = useInspection((s) => s.draft);
	useInspection((s) => s.photos);
	const patch = useInspection((s) => s.patch);
	const setSkip = useInspection((s) => s.setPhotoSkip);
	const jumpToGuide = useInspection((s) => s.jumpToGuide);
	const openPlain = useInspection((s) => s.openPlain);
	const choice = walkChoiceOf(draft, card.id);
	const notes = rowNotes(draft, card.id);
	const plain = card.guideId ? plainFor(card.guideId) : void 0;
	const slots = slotsFor(card.id);
	const required = requiredSlots(card.id);
	const skipText = required.map((s) => photoSkipReason(draft, s)).find(Boolean) ?? "";
	const [reason, setReason] = (0, import_react.useState)(skipText);
	(0, import_react.useEffect)(() => {
		setReason(skipText);
	}, [card.id, skipText]);
	function applyReason(v) {
		setReason(v);
		for (const slot of required) setSkip(slot, v);
	}
	const isResult = card.id === "result";
	const showFields = card.id !== "engine.overview" && card.id !== "cabin.dash";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hud-card space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "traveler-stamp text-xs text-primary",
						children: [
							"Step ",
							index + 1,
							" of ",
							total,
							" · ",
							card.stageNum,
							". ",
							card.section
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold text-balance text-foreground",
						children: card.shopTitle
					}),
					card.plainTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base text-foreground",
						children: card.plainTitle
					}) : null,
					card.guideId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => openPlain(card.guideId),
							className: "tap-56 inline-flex items-center justify-center gap-2 rounded border border-border bg-raised font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-5" }), "Meaning"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => jumpToGuide(card.guideId),
							className: "tap-56 inline-flex items-center justify-center gap-2 rounded border border-border bg-raised font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" }), "Guide"]
						})]
					}) : null
				]
			}),
			plain ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideDiagram, { kind: plain.diagram }) : card.id === "engine.overview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideDiagram, { kind: "engine" }) : card.id === "cabin.dash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideDiagram, { kind: "cabin" }) : card.id === "transTable" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideDiagram, { kind: "trans" }) : null,
			slots.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: slots.map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoField, {
					slot,
					required: isRequiredPhotoSlot(slot),
					label: photoSlotDef(slot)?.label
				}, slot))
			}) : null,
			card.lookFor.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hud-card space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "field-label",
					children: "What to look for"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5 text-base leading-relaxed text-foreground",
					children: card.lookFor.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", b] }, b))
				})]
			}) : null,
			showFields ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalkEmbed.Provider, {
				value: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckRowById, { id: card.id })
			}) : null,
			isResult ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalkStatus, { id: card.id }),
			isResult ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrokScanBanner, {
				itemId: card.id,
				slots,
				stepName: card.shopTitle
			}),
			(choice === "na" || choice === "unable") && required.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
				value: reason,
				onChange: applyReason,
				placeholder: "Why you can’t inspect this (required)"
			}) : null,
			isResult ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "field-label",
						children: "Quick notes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: NOTE_CHIPS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => patch((d) => {
								const cur = rowNotes(d, card.id);
								if (cur.includes(c)) return;
								setRowNotes(d, card.id, cur ? `${cur} · ${c}` : c);
							}),
							className: "tap-56 rounded border border-border bg-inset px-3 text-sm font-medium",
							children: c
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesField, {
						value: notes,
						onChange: (v) => patch((d) => {
							setRowNotes(d, card.id, v);
						}),
						placeholder: "Optional note"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceNote, { rowId: card.id })
				]
			}),
			choice === "attention" || choice === "asap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepairBlock, { id: card.id }) : null
		]
	});
}
function useWakeLock(on) {
	(0, import_react.useEffect)(() => {
		if (!on || typeof navigator === "undefined" || !("wakeLock" in navigator)) return;
		let sent = null;
		let dead = false;
		async function grab() {
			try {
				sent = await navigator.wakeLock.request("screen");
			} catch {
				sent = null;
			}
		}
		grab();
		const vis = () => {
			if (document.visibilityState === "visible" && !dead) grab();
		};
		document.addEventListener("visibilitychange", vis);
		return () => {
			dead = true;
			document.removeEventListener("visibilitychange", vis);
			sent?.release();
		};
	}, [on]);
}
function WalkView() {
	const walkIndex = useInspection((s) => s.walkIndex);
	const setWalkIndex = useInspection((s) => s.setWalkIndex);
	const visit = useInspection((s) => s.draft.header.visitType);
	const drive = useInspection((s) => s.draft.header.drive);
	const plan = useInspection((s) => s.draft.header.plan);
	const oilChange = useInspection((s) => oilChangeMode(s.draft));
	const draft = useInspection((s) => s.draft);
	const photos = useInspection((s) => s.photos);
	const markSubmitted = useInspection((s) => s.markSubmitted);
	const goHome = useInspection((s) => s.goHome);
	const openResults = useInspection((s) => s.openResults);
	const saveError = useInspection((s) => s.saveError);
	const queue = walkQueue(visit, drive, plan, oilChange);
	const idx = Math.min(Math.max(0, walkIndex), Math.max(0, queue.length - 1));
	const card = queue[idx];
	useWakeLock(true);
	(0, import_react.useEffect)(() => {
		if (queue.length && walkIndex !== idx) setWalkIndex(idx);
	}, [
		queue.length,
		walkIndex,
		idx,
		setWalkIndex
	]);
	const touch = (0, import_react.useRef)(null);
	if (!card) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-base text-foreground",
		children: "Pick a visit type to start the walk."
	});
	const ready = stepReady(card, draft, photos, requiredSlots(card.id).map((s) => photoSkipReason(draft, s)).find(Boolean) ?? "");
	const last = idx >= queue.length - 1;
	const first = idx <= 0;
	const blocked = Boolean(saveError) || !ready.ok;
	function go(next) {
		setWalkIndex(Math.max(0, Math.min(queue.length - 1, next)));
		useInspection.getState().flushPersist();
	}
	function finish() {
		if (headerComplete(draft.header)) markSubmitted("idle");
		else openResults();
		useInspection.getState().flushPersist();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 pb-32",
		onTouchStart: (e) => {
			const t = e.changedTouches[0];
			if (t) touch.current = {
				x: t.clientX,
				y: t.clientY
			};
		},
		onTouchEnd: (e) => {
			const t = e.changedTouches[0];
			const start = touch.current;
			touch.current = null;
			if (!t || !start) return;
			const dx = t.clientX - start.x;
			const dy = t.clientY - start.y;
			if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy)) return;
			if (dx < 0 && !blocked && !last) go(idx + 1);
			if (dx > 0 && first) goHome();
			if (dx > 0 && !first) go(idx - 1);
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalkCardView, {
			card,
			index: idx,
			total: queue.length
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky bottom-0 z-20 -mx-4 border-t border-border bg-background px-4 py-3",
			children: [saveError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-sm font-medium text-fail",
				children: saveError
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => first ? goHome() : go(idx - 1),
					className: "tap-56 flex flex-1 items-center justify-center gap-1 rounded border border-border bg-raised font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" }), first ? "Home" : "Previous"]
				}), last ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: blocked,
					onClick: finish,
					className: "tap-56 flex flex-[1.4] items-center justify-center gap-1 rounded bg-primary font-semibold text-primary-foreground disabled:opacity-40",
					children: saveError ? "Fix save" : ready.ok ? "See results" : ready.why || "See results"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: blocked,
					onClick: () => go(idx + 1),
					className: "tap-56 flex flex-[1.4] items-center justify-center gap-1 rounded bg-primary font-semibold text-primary-foreground disabled:opacity-40",
					children: [saveError ? "Fix save" : ready.ok ? "Next" : ready.why || "Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })]
				})]
			})]
		})]
	});
}
function FlagList({ items, stamp }) {
	const jumpToGuide = useInspection((s) => s.jumpToGuide);
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "traveler-stamp text-xs text-fail",
			children: stamp
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2 text-sm leading-relaxed text-foreground",
			children: items.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => jumpToGuide(f.guideId),
				className: "tap-56 flex w-full items-start gap-2 text-left",
				"aria-label": `Open How-To for ${f.label}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block",
						children: statusLine(f)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex shrink-0 items-center gap-1 pt-1 font-mono text-xs font-medium tracking-wide text-primary uppercase",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-3.5" }), "Guide"]
				})]
			}) }, f.id))
		})]
	});
}
function ConditionBanner() {
	const report = conditionReport(useInspection((s) => s.draft), useInspection((s) => s.photos), wearHistory(useInspection((s) => s.lastSubmitted), useInspection((s) => s.archive)));
	const c = report.counts;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-card space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "traveler-stamp text-xs text-primary",
				children: "Vehicle condition score"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "reading text-3xl text-primary",
				children: [report.score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-lg text-muted-foreground",
					children: "/100"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-1 text-sm text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["URGENT: ", c.asap] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["SERVICE SOON: ", c.attention] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Monitor: ", c.monitor] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Passed: ", c.pass] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Not inspected / N/A: ", c.na] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagList, {
				items: report.asap,
				stamp: "URGENT"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagList, {
				items: report.attention,
				stamp: "SERVICE SOON"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagList, {
				items: report.monitor,
				stamp: "Monitor"
			})
		]
	});
}
function mark(tone) {
	if (tone === "due") return "✅";
	if (tone === "watch") return "⚠️";
	return "Skip / not due:";
}
function Line({ line }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "space-y-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-snug text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mr-1",
					children: line.tone === "skip" ? "" : mark(line.tone)
				}), line.tone === "skip" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted-foreground",
					children: ["Skip / not due: ", line.label]
				}) : line.label]
			}),
			line.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pl-6 text-xs leading-snug text-muted-foreground",
				children: line.note
			}) : null,
			line.tone === "watch" && line.guideId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlainButton, {
				id: line.guideId,
				title: line.label
			}) : null
		]
	});
}
function FlagLine({ flag }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: cn("text-sm leading-snug", flag.tone === "alert" ? "text-fail" : "text-warn"),
			children: [
				flag.tone === "alert" ? "🔴" : "⚠️",
				" ",
				flag.text
			]
		}), flag.guideId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlainButton, {
			id: flag.guideId,
			title: flag.text
		}) : null]
	});
}
function RecCard() {
	const draft = useInspection((s) => s.draft);
	const maint = useInspection((s) => s.maint);
	const patch = useInspection((s) => s.patch);
	const setMode = useInspection((s) => s.setChecklistMode);
	const setWalk = useInspection((s) => s.setWalkIndex);
	const collapseAll = useInspection((s) => s.collapseAll);
	const log = rowsForVin(maint, draft.header.vin);
	const plan = buildPlan(draft, log);
	const visit = draft.header.visitType;
	if (!plan.miles) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-card space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "traveler-stamp text-xs text-primary",
			children: "Mileage picks the inspection"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-relaxed text-muted-foreground",
			children: "Type current miles. The maintenance log (if you have one) is used first; blank history uses the safer list."
		})]
	});
	const due = plan.lines.filter((l) => l.tone === "due");
	const watch = plan.lines.filter((l) => l.tone === "watch");
	const skip = plan.lines.filter((l) => l.tone === "skip");
	function startRecommended() {
		patch((d) => {
			d.header.visitType = "recommended";
			d.header.plan = flagsFromPlan(plan);
		});
		setMode("walk");
		setWalk(0);
		collapseAll();
	}
	function force(v) {
		patch((d) => {
			d.header.visitType = v;
			d.header.plan = v === "recommended" ? flagsFromPlan(plan) : null;
		});
		setMode("walk");
		setWalk(0);
		collapseAll();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-card space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "traveler-stamp text-xs text-primary",
				children: [
					"Based on ",
					plan.miles.toLocaleString("en-US"),
					" miles, we recommend"
				]
			}),
			plan.flags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: plan.flags.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagLine, { flag: f }, f.key))
			}) : log.length === 0 && plan.unknownHistory ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-snug text-warn",
				children: "No maintenance log — treating history as unknown (safer list)."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2",
				children: [
					due.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { line: l }, l.key)),
					watch.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { line: l }, l.key)),
					skip.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { line: l }, l.key))
				]
			}),
			visit === "recommended" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-pass",
				children: "Mileage-based checklist is loaded. Override below if this visit is a set service."
			}) : visit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-warn",
				children: [
					"Override on: ",
					VISIT_TYPES.find((v) => v.value === visit)?.label ?? visit,
					". Checklist is that form, not the mileage mix."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: startRecommended,
				className: cn("tap-44 w-full rounded font-medium", visit === "recommended" ? "border border-border bg-raised" : "bg-primary text-primary-foreground"),
				children: visit === "recommended" ? "Reload recommended inspection" : "Start recommended inspection"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "field-label",
				children: "Or force a set visit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: VISIT_TYPES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => force(v.value),
					className: cn("tap-44 rounded border px-3 font-mono text-xs font-medium tracking-wide", visit === v.value ? "chip-on" : "chip-off text-muted-foreground"),
					children: v.label
				}, v.value))
			})
		]
	});
}
function Section({ id, children }) {
	const open = useInspection((s) => s.openSections.includes(id));
	const toggle = useInspection((s) => s.toggleSection);
	const def = SECTION_DEFS.find((s) => s.id === id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-b border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => toggle(id),
			className: cn("flex min-h-14 w-full items-center justify-between gap-3 border-l-2 px-2 py-3 text-left", open ? "border-l-primary" : "border-l-transparent"),
			"aria-expanded": open,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-sm font-semibold tracking-wide text-foreground",
				children: def.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180") })]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3 pb-4",
			children
		}) : null]
	});
}
function FullChecklist() {
	const visit = useInspection((s) => s.draft.header.visitType);
	const drive = useInspection((s) => s.draft.header.drive);
	const plan = useInspection((s) => s.draft.header.plan);
	const shows = (id) => rowShows(id, visit, drive, plan);
	const steering = shows("steering.ballJoints") || shows("steering.tieRods") || shows("steering.steeringPlay");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			id: "fluids",
			children: [shows("oilLevel") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OilLevelItem, {}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FluidsRest, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "engine",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineItems, {})
		}),
		shows("transTable") || shows("atfReject") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "trans",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransTable, {})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "brakes",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrakeItems, {})
		}),
		steering ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "steering",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SteeringItems, {})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "underbody",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnderbodyItems, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "cabin",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabinItems, {})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "road",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoadItems, {})
		}),
		shows("baseline") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "baseline",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BaselineItems, {})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			id: "result",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultItem, {})
		})
	] });
}
function ChecklistView() {
	const mode = useInspection((s) => s.checklistMode);
	const setMode = useInspection((s) => s.setChecklistMode);
	const expandAll = useInspection((s) => s.expandAll);
	const collapseAll = useInspection((s) => s.collapseAll);
	const visit = useInspection((s) => s.draft.header.visitType);
	const short = useInspection((s) => oilChangeMode(s.draft));
	const photoHighlight = useInspection((s) => s.photoHighlight);
	const draft = useInspection((s) => s.draft);
	const photos = useInspection((s) => s.photos);
	const missing = missingRequiredPhotos(draft, photos);
	const highlight = useInspection((s) => s.headerHighlight);
	const started = Boolean(visit);
	if (started && mode === "walk") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WalkView, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				id: "header",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderFields, { highlight })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaintLog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecCard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConditionBanner, {}),
			started && missing.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hud-alert-warn space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "traveler-stamp text-xs text-warn",
					children: photoHighlight ? "Missing required photos — submit is blocked" : "Photos required"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1 text-sm text-foreground",
					children: missing.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", m.line] }, m.slot))
				})]
			}) : null,
			started && short ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "traveler-stamp px-1 text-xs text-primary",
				children: "Oil-change short check · 15k / 30k / Baseline unhide the rest"
			}) : null,
			started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hud-seg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						collapseAll();
						setMode("walk");
					},
					"data-on": "false",
					className: "hud-seg-btn",
					children: "Walk the truck"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode("full"),
					"data-on": "true",
					className: "hud-seg-btn",
					children: "Full checklist"
				})]
			}) : null,
			started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: expandAll,
					className: "tap-56 flex-1 rounded border border-border bg-inset font-mono text-xs font-medium tracking-wider uppercase text-foreground",
					children: "Expand all"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: collapseAll,
					className: "tap-56 flex-1 rounded border border-border bg-inset font-mono text-xs font-medium tracking-wider uppercase text-foreground",
					children: "Collapse all"
				})]
			}) : null,
			started ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullChecklist, {}) : null
		]
	});
}
function ch(c) {
	return c;
}
var GUIDE_SECTION_ORDER = [
	"1. Fluids",
	"2. Engine bay",
	"3. Transmission",
	"4. Brakes & rolling",
	"5. Steering / driveline",
	"6. Underbody",
	"7. Cabin & safety",
	"8. Road test",
	"9. Result"
];
var GUIDE_CHAPTERS = [
	ch({
		id: "fluids.oilLevel",
		section: "1. Fluids",
		title: "Engine oil",
		lede: "2005 Armada 5.6L VK56DE. Oil-change visit: drain, filter, fill — record type, quarts, filter PN, crush washer. Do not read the dipstick after you dumped the pan. 15k / 30k / baseline: hot reading, engine off, more than 10 minutes.",
		factory: "Genuine Nissan 5W-30 full synthetic. Capacity with filter 6.2 L / 6½ qt. Change every 3,500–5,000 miles or 6 months at this mileage. New crush washer on the drain plug every time. Confirm torque and filter PN in FSM SM5E-1T60U1.",
		requires: "Oil-change visit: type, amount used, filter PN, crush washer replaced Y/N, mileage from the header. Not color. Not level. 15k / 30k: level ground, engine at operating temperature, key OFF, wait MORE THAN 10 MINUTES, read between L and H on the engine stick — not the trans stick.",
		measure: "Oil change: drain hot, swap filter, new crush washer, fill 6½ qt 5W-30, run, shut down, glance the pan and filter for leaks. Write type / quarts / filter PN / washer. 15k dipstick: engine oil stick is left/front, long yellow or marked handle. Pull, wipe lint-free, seat fully, pull again. L = low, H = high.",
		good: "Oil change: 5W-30 in, about 6.5 qt, filter PN written, crush washer Y, no drip at the pan. 15k: film between L and H. Dark brown at high miles is normal. No fuel smell, not gritty, not chocolate-milk milky.",
		fail: "Oil change: old washer reused, unknown filter, Dexron poured, no amount written. 15k: below L add 5W-30 a little at a time. Above H: drain a little. Milky chocolate-milk oil: coolant in the oil — do not run it.",
		steps: [
			"Oil-change visit: warm the engine, drain the pan, replace the filter, new crush washer on the plug. Confirm plug torque in FSM SM5E-1T60U1. Do not guess.",
			"Fill Genuine Nissan 5W-30 full synthetic. Capacity with filter is 6.2 L / 6½ qt. Do not dump 8 qt “to be safe.”",
			"Write oil type, amount used, filter PN, crush washer Y/N. Mileage is the number already in the Vehicle header. Check the box. Do not fill Color / level — you just emptied the pan.",
			"Run it, shut it down, look at the pan rail and the filter for a drip. That leak look is the next walk step.",
			"15k / 30k / baseline only: after warmup, engine OFF more than 10 minutes, then the dipstick. Pull, wipe, seat, pull. Log color/level and any quarts added. That is not an oil-change visit."
		]
	}),
	ch({
		id: "fluids.oilLeak",
		section: "1. Fluids",
		title: "Engine oil leak check",
		lede: "VK56 common seeps: valve covers, oil-cooler O-ring at the block, oil pan, front cover / timing cover, filter. Heat after a drive makes fresh wetness show.",
		factory: "No published “allowed drip rate.” Seepage that wets a finger is a leak. Damp dusty film on an old gasket at high miles is common. Active dripping is not. Photograph wetness.",
		requires: "Find the source before you keep adding oil. Fresh puddles on the ground are a find-it-now item. Do not crawl under a cheap scissor jack — stands on the frame, or a lift.",
		measure: "Cold: look at the pavement where it sat overnight (honey/black = oil). After a drive, engine off a few minutes: flashlight on valve covers, oil-cooler adapter at the block, filter, pan rail, front cover. Wipe a finger — fresh wet vs dusty film.",
		good: "No fresh wet finger. No drip on the ground. Old dusty stain at 270k can be logged as a watch item.",
		fail: "Active drip, wet oil-cooler O-ring, soaked timing cover, or a puddle. Schedule gasket/O-ring/cooler work. Do not ignore a leak that empties the stick between visits.",
		steps: [
			"Before you start it, look at the ground. Note color: honey/black = oil.",
			"After the drive, park level. Engine off. Wait a few minutes so you do not burn yourself.",
			"Flashlight: both valve covers, oil-cooler adapter at the block (very common seep on this engine), filter housing, pan and drain plug, front / timing cover.",
			"Wipe. Fresh wet oil is a fail. Dusty brown film that does not wet the finger is a note.",
			"Photograph the wet area. Write which corner of the engine is wet."
		]
	}),
	ch({
		id: "fluids.coolant",
		section: "1. Fluids",
		title: "Coolant reservoir level & color",
		lede: "Read the plastic overflow tank COLD. Never open the radiator cap on a hot VK56. Oil film or red tint in the coolant is SMOD in the other direction.",
		factory: "50/50 Nissan Long Life (or matching HOAT) and distilled water only. System capacity about 14.4 L / 3¾ gal including the reservoir. Service about 60,000 miles / 5 years if history is unknown. Never tap water. Never mix orange Dex-Cool into this system.",
		requires: "Engine COLD. Level between MIN and MAX molded in the tank. Color uniform — not rusty, not oily, not sludged. Cap on the reservoir seated. Do not open the radiator cap hot.",
		measure: "Stand at the front bumper. Translucent tank beside the radiator, MIN/MAX on the plastic. Shine a light through it. Do not read the radiator itself. Note color and whether the cap is fully seated.",
		good: "Between MIN and MAX (near MAX is fine). Uniform green/blue/whatever was last poured. No oil film, no rust mud, no sweet oily red tint.",
		fail: "Below MIN or empty: do not drive. Milky / oil film / red ATF tint: oil-cooler or SMOD — stop and treat as mixed fluids. Muddy rust: flush cold. If the tank is full but it later runs hot, the cap, radiator, or water pump is next — do not just add water.",
		steps: [
			"Engine cold. Hood open. Do not start it yet.",
			"Read MIN/MAX on the overflow tank. Photograph the level.",
			"Look for oil sheen or strawberry tint. That is coolant mixing with oil or ATF.",
			"Confirm the reservoir cap is seated.",
			"Do not open the radiator cap. If a cold service is due (unknown at 270k), drain cold, flush with distilled water, refill 50/50 Nissan LL, squeeze hoses, run to temp, cool, recheck."
		]
	}),
	ch({
		id: "fluids.atf",
		section: "1. Fluids",
		title: "ATF — dipstick HOT",
		lede: "This reading saves the RE5R05A. Wrong method adds fluid you should not, or misses coolant in the ATF. Idle, shift P-R-N-D, HOT marks, stick inserted reversed.",
		factory: "Only Genuine Nissan Matic J. Matic S is the later factory-accepted substitute. Do not pour Dexron, Mercon, or “universal ATF.” Dry fill about 11¼ qt / 10.6 L. A pan drain only comes out about 4–6 qt. Factory HOT check is ATF near 149°F (65°C). Drain/fill when hot, factory about 176°F / 80°C. 30k cadence.",
		requires: "Level pavement. Engine IDLING. In Park. After a 10–15 min mixed drive (engine gauge in the middle). Stick inserted REVERSED until the handle contacts the tube. Read HOT marks, not COLD. Never check with the engine off, on a slope, or in gear.",
		measure: "Passenger-side firewall, long tube, small bolt through a tab on the handle — that bolt must come out. Wipe with lint-free paper, not a fuzzy rag. Reinsert reversed, pull, read HOT hashes. Then look at color and smell on the paper. Bolt the handle back down.",
		good: "Level in the HOT range. Transparent red or amber. Smells like ATF. No glitter.",
		fail: "Pink, milky, strawberry, or sweet: SMOD. Coolant is in the ATF. Park it. Do not “see if it shifts.” Brown/varnish/burnt: old or overheated — drain/fill Matic J/S. Metal glitter: pan drop. Low and still red: find the leak before you keep adding. High: often a cold reading mistaken for hot — recheck HOT, drain excess if truly over full.",
		steps: [
			"Drive 10–15 minutes of mixed use until the temp gauge sits in its normal middle. Come back to level pavement. Parking brake on. Engine stays running at idle.",
			"Foot on the brake. Shift slowly P → R → N → D → 2/1 if those gates exist → back to P. Pause one second in each. Leave it in P.",
			"Remove the small bolt that pins the trans-stick handle. Pull. Wipe lint-free.",
			"Slide the stick back in REVERSED from the way it normally sits, until the cap/handle contacts the top of the tube. Factory procedure. Pull and read the HOT marks.",
			"Look at color and smell on the paper. Bolt the handle down so the stick cannot walk out.",
			"Add Matic J or S only, a little at a time, engine idling, if it is truly low on a HOT reading. Recheck HOT. Never dump 11 quarts — the converter still holds fluid."
		]
	}),
	ch({
		id: "fluids.psf",
		section: "1. Fluids",
		title: "Power steering fluid",
		lede: "Nissan PSF only. COLD marks when the truck has sat. HOT marks after the drive. The high-pressure hose is a common leak on this chassis.",
		factory: "Nissan PSF (or the exact Nissan-specified equivalent). Read COLD range engine off after a sit. Read HOT range after the road test. Do not overfill above the top mark.",
		requires: "Engine off for the cold reading. Reservoir marked PSF. Fluid red or amber, not black, not burnt. Reservoir and high-pressure hose dry.",
		measure: "Find the PSF reservoir in the engine bay — COLD and HOT ranges on the cap or body. Engine off, read COLD MAX/MIN. After the drive, recheck HOT. Note color and whether the high-pressure hose (to the rack) is wet.",
		good: "At or near COLD MAX when cold. In the HOT range after a drive, not above the top mark. Red/amber, not burnt. Dry hose and reservoir.",
		fail: "Below MIN. Foamy (air in the system). Black/burnt. Wet high-pressure hose or rack — schedule the hose/rack. Do not keep topping a leak.",
		steps: [
			"Engine off. Read COLD MAX/MIN. Photograph the level.",
			"Note color: red/amber vs black.",
			"Look at the high-pressure hose and the rack boots. Wet PSF is a leak.",
			"After the drive, engine off a minute, read the HOT range. Still not above the top mark.",
			"Top only with Nissan PSF if it is truly low, then find why."
		]
	}),
	ch({
		id: "fluids.brake",
		section: "1. Fluids",
		title: "Brake fluid",
		lede: "Firewall, driver’s side. DOT 3 from a sealed bottle. Level follows pad wear — a sudden drop is a leak, not “add and go.”",
		factory: "DOT 3. Flush every 24 months regardless of miles. Never DOT 5 silicone. Never an old open bottle. Reservoir never allowed to run dry during a bleed.",
		requires: "Level between MIN and MAX on the master-cylinder reservoir. Color light honey / pale yellow. Cap sealed. Below MIN means worn pads or a leak — find which.",
		measure: "Wipe the cap area first so dirt does not fall in. Read MIN/MAX on the side of the translucent reservoir. Note color: clear-amber vs dark brown/black.",
		good: "Between MIN and MAX. Light honey / pale yellow. Cap fully seated. Pedal later proves firm.",
		fail: "Below MIN. Dark brown or black: hygroscopic old fluid — flush DOT 3, one corner at a time, two-person or pressure bleeder. Wetness at the master = do not drive it. Wrong fluid or air left in the circuit is a sinking pedal.",
		steps: [
			"Engine off. Wipe the cap. Read MIN/MAX. Photograph.",
			"Note color (clear-amber vs dark) and that the cap is sealed.",
			"If dark or overdue 24 months: DOT 3 from a sealed bottle, one corner at a time, reservoir never dry, until the bleeder runs clean. If you have not bled brakes before, this is a shop job.",
			"If level is low, measure pads and look for wet calipers/lines before you just fill it."
		]
	}),
	ch({
		id: "fluids.washer",
		section: "1. Fluids",
		title: "Washer fluid",
		lede: "Blue cap in the engine bay. Front and rear washers must both throw fluid — you confirm spray later with the wipers.",
		factory: "Any washer fluid rated for the climate. Do not pour coolant or plain water in and leave it in winter.",
		requires: "Bottle not empty. Both nozzles wet the glass. Rear hatch washer works.",
		measure: "Look in the translucent bottle or dip. Key ON, spray front and rear. Note clogs.",
		good: "Fluid present. Both fronts and the rear spray. No cracked bottle.",
		fail: "Empty, frozen, or no spray from a nozzle. Clear the jet or refill before a road test in dirty weather.",
		steps: [
			"Find the blue-cap bottle. Confirm fluid is visible.",
			"Top with washer fluid if low.",
			"Key ON, spray front and rear. Aim the jets at the glass, not the roof."
		]
	}),
	ch({
		id: "fluids.transferSeep",
		section: "1. Fluids",
		title: "Transfer case seep (4WD)",
		lede: "Not a dipstick. 30k service item on 4WD Armadas. Check seepage every visit; check level on the 30k.",
		factory: "Nissan Matic D, about 3.0 L / 3⅛ qt. Change every 30,000 miles. Fill to the fill-plug hole, truck level.",
		requires: "Seals dry enough that you cannot wipe a fresh wet finger. Level at the fill hole on a 30k. 2WD trucks skip this.",
		measure: "After a drive, flashlight on the transfer case (behind the transmission, 4WD). Look at output seals and the pan/cover. For level: fill plug out (upper plug, not the drain). Oil should wet your finger at the hole.",
		good: "Dry seals. Gear-oil/ATF look, not milky, not glitter. Level at the hole.",
		fail: "Fresh wetness at the seals. Milky (water). Glitter. Low: fill Matic D and find the leak. Do not confuse transfer seep with trans-pan ATF.",
		steps: [
			"Confirm 4WD. 2WD: mark N/A.",
			"Park level after a drive. Flashlight on the transfer case seals.",
			"On a 30k: fill plug out, finger at the hole, smell and color.",
			"Photograph wetness. Fill only with Matic D."
		]
	}),
	ch({
		id: "fluids.frontDiffSeep",
		section: "1. Fluids",
		title: "Front differential seep (4WD)",
		lede: "Front axle housing on 4WD. 30k fluid. Seepage at the cover or axle seals is the visit check.",
		factory: "API GL-5 80W-90 (synthetic 75W-90 is acceptable for heat and noise). Front about 1.6 L / 3⅜ pt. Change every 30,000 miles.",
		requires: "Truck level. No active drip. Fill to the fill-plug hole on a 30k. 2WD skips this.",
		measure: "Flashlight on the front diff cover, axle seals, and vent. For level: upper fill plug out. Oil at or just below the hole.",
		good: "Dry enough. Gear oil looks like gear oil — not milky, not glitter-heavy, not burnt tar.",
		fail: "Active drip. Milky (water). Heavy glitter. Cover bolts weeping a stream.",
		steps: [
			"4WD only. After a drive, look at the front housing and axle seals.",
			"30k: fill plug out, finger wet at the hole, smell it.",
			"Refill GL-5 80W-90 to the hole. Photograph seepage."
		]
	}),
	ch({
		id: "fluids.rearDiffSeep",
		section: "1. Fluids",
		title: "Rear differential seep",
		lede: "Cover and pinion seal. Rear diffs on these can whine (TSB NTB05-069). Whine plus glitter is not “just refill.”",
		factory: "API GL-5 80W-90 (synthetic 75W-90 acceptable). Rear about 1.75 L / 3¾ pt. Change every 30,000 miles.",
		requires: "No active drip at the cover or pinion. Level at the fill hole on a 30k. Pinion seal dry.",
		measure: "Flashlight on the rear cover gasket and the pinion seal (yoke). Wipe. For level: upper fill plug, truck level, oil at the hole. Note pinion Y/N on the checklist.",
		good: "Dry pinion and cover. Oil at the hole. No heavy glitter, not milky, not burnt.",
		fail: "Wet pinion seal, dripping cover, milky oil, glitter plus whine — do not just refill. Schedule seal/rebuild diagnosis.",
		steps: [
			"After a drive, look at the rear cover and the pinion yoke.",
			"Mark pinion seal Y/N. Photograph wetness.",
			"30k: fill plug out, finger at the hole, smell and color.",
			"If it whines and the magnet/oil has glitter, stop treating it as a fluid-only job."
		]
	}),
	ch({
		id: "engine.timingCover",
		section: "2. Engine bay",
		title: "Cold-start noise — timing cover",
		lede: "VK56 timing chain. You are listening at the front of the engine on a COLD start. Do not rev it.",
		factory: "Short rattle 1–3 seconds then gone is common (chain/tensioner taking up slack). Ongoing rattle is worn tensioner or guides — TSB NTB05-084a territory. Confirm any repair against FSM SM5E-1T60U1.",
		requires: "Cold engine. Idle only. Record seconds and whether it dies or keeps going.",
		measure: "Phone ready at the front bumper. Key ON, start, idle. Walk to the timing cover (front of the engine). Listen 15–20 seconds. Write quiet / short rattle / ongoing rattle and seconds.",
		good: "Quiet, or a short 1–3 sec rattle that is the same every morning and then gone.",
		fail: "Rattle that keeps going. Rattle that grows visit to visit. Ongoing rattle plus a low oil-pressure note or lamp is do-not-drive — Pass is blocked. Budget a timing set. Do not ignore it.",
		steps: [
			"Engine COLD. Do not rev.",
			"Key to ON — watch dash prove-out. Start. Idle.",
			"Stand at the front bumper 15–20 seconds, then each wheel well.",
			"Log seconds. Short then gone: watch. Ongoing: plan the timing set. Write oil pressure in the green or low / lamp. Ongoing plus low oil pressure cannot be a Pass."
		]
	}),
	ch({
		id: "engine.manifolds",
		section: "2. Engine bay",
		title: "Cold-start noise — exhaust manifolds",
		lede: "Exhaust-manifold cracks are very common on the VK56. Tick plus soot at the flange gets scheduled.",
		factory: "No “allowed crack.” A black sooty stripe at the manifold-to-head flange means a crack or blown gasket. Cold-only tick with no soot can wait a short while. Soot plus tick gets scheduled.",
		requires: "Listen cold. After warmup, look at both bank flanges for soot. Write L / R / both and soot Y/N.",
		measure: "Tick is louder cold, one bank — left or right cylinder head / manifold, not the timing cover. After it warms, flashlight on each manifold-to-head flange.",
		good: "Quiet after warmup. No soot stripe.",
		fail: "Tick that stays plus soot: schedule manifolds/gaskets. Do not confuse this with a chain rattle (front cover).",
		steps: [
			"On the cold start, walk each side of the engine. Note L, R, or both.",
			"After warmup, look at each flange. Black sooty stripe = leak.",
			"Photograph soot. Schedule if tick + soot."
		]
	}),
	ch({
		id: "engine.idle",
		section: "2. Engine bay",
		title: "Idle quality",
		lede: "Still in the driveway. Smooth idle, CEL off after prove-out. Hunting idle is a find-it-now, not a road-test problem.",
		factory: "Oil pressure lamp OFF within a second or two. Charge lamp OFF. AT check, ABS, SLIP, VDC, CEL off after prove-out. Idle smooth, not hunting. Temp gauge climbs slowly from cold — must not jump to hot.",
		requires: "Idle in Park, engine running. No new lamps. Write smooth/rough and CEL on/off.",
		measure: "Watch the dash after start. Feel the mirror/steering. Listen for knock (deeper, does not go away) vs a little cam/chain tick that fades.",
		good: "Smooth idle. All prove-out lamps off. Temp climbing slowly.",
		fail: "Rough, hunting, shaking the mirror. CEL stays on — scan before the road test. Knock: stop. Temp jumping to hot: stop.",
		steps: [
			"Key ON — lamps prove out. Start. Do not rev.",
			"Confirm oil and charge lamps go out immediately.",
			"Note idle quality and CEL.",
			"If any lamp stays on, scan codes before you pull out."
		]
	}),
	ch({
		id: "engine.belt",
		section: "2. Engine bay",
		title: "Serpentine belt",
		lede: "One belt drives the front accessories. Glaze, fray, missing chunks, or a floppy tensioner get replaced — belt and tensioner together if noisy.",
		factory: "Replace the belt when cracked, glazed, frayed, or down to the cords. Tensioner play is not “watch it.” Confirm part numbers in the FSM. Typical 60k look on an aged belt.",
		requires: "Ribs intact. No glaze. Tensioner not flopping. No squeal on start.",
		measure: "Engine off. Twist the belt to see the ribs and the back. Push the tensioner arm — it should be firm, not sloppy. After start, listen for squeal.",
		good: "OK: no cracks, no glaze, no fray, tensioner quiet and firm.",
		fail: "Cracks, glaze, fray, cords showing, squeal, tensioner play. Replace belt and tensioner together if glazed or noisy.",
		steps: [
			"Engine off. Inspect the full length — ribs and back.",
			"Check tensioner play by hand.",
			"Start and listen for squeal.",
			"Photograph cracks/glaze. Do not dress a glazed belt with goop."
		]
	}),
	ch({
		id: "engine.radiator",
		section: "2. Engine bay",
		title: "Radiator tanks, seams, hoses",
		lede: "Plastic tanks on this radiator crack at the seams. Two small metal lines into the tank are ATF cooler lines — not heater hoses. Engine cold for the first look.",
		factory: "Hoses firm, not mushy, not rock-hard. Tanks not split. No seep at upper/lower seams or hose clamps. Never open the cap hot. Cooling system 14.4 L / 3¾ gal 50/50 Nissan LL.",
		requires: "Dry clamps. Plastic not split. Hoses that still squeeze like rubber. ATF ports dry (see ATF cooler lines if wet).",
		measure: "Squeeze upper and lower radiator hoses and heater hoses. Look at top and bottom tank seams. Look at the two small ATF lines into the tank. After a drive, look again for wetness.",
		good: "Hoses dry at the clamps, firm. Tanks dry. No swollen spots.",
		fail: "Soft hoses get replaced, not “watched.” Split plastic, seeping seams, or wet ATF ports. Overheat later in the drive: stop.",
		steps: [
			"Engine cold. Squeeze the big hoses. Photograph seams.",
			"Find the two small ATF cooler lines. If wet or pink, treat as SMOD risk — open the ATF cooler-lines how-to.",
			"After the drive, recheck for fresh wetness. Do not open the cap hot."
		]
	}),
	ch({
		id: "engine.atfLines",
		section: "2. Engine bay",
		title: "ATF cooler lines at radiator",
		lede: "The 2005 Armada radiator has a small ATF cooler built in. When that chamber cracks, coolant and ATF mix and kill the RE5R05A. This is the SMOD check.",
		factory: "Those two small metal/rubber lines dump ATF heat into the radiator. A bypass reroutes them to an external stacked-plate cooler (or factory auxiliary plus an added cooler) and caps the radiator ATF ports. Highest-value job on a 2005 that still shifts. After bypass: idle, shift, HOT ATF recheck, leak look, short road test.",
		requires: "ATF red/amber on the stick. Coolant not oily. Those two fittings dry. If any of the three is wrong, treat as SMOD. Pink/milky/sweet ATF: do not bypass-and-drive — valve body/TCM may already be ruined.",
		measure: "They are not heater hoses. Follow one from the transmission and one returning. Look at the fittings where they enter the radiator. Wet, rusty, or stained = leaking. After a drive, feel carefully for oily wetness.",
		good: "Still connected (unless a proper bypass is already done). Fittings dry. No pink residue. Bypass-done Y only if the radiator ports are capped and an external cooler is actually installed.",
		fail: "Wet fittings, pink residue, oily coolant, or milky ATF. Park it. Do not keep driving it to finish the week. Bypass is for a truck that still shifts with clean ATF.",
		steps: [
			"Find the two small lines into the radiator tank. Photograph the fittings.",
			"Note connected Y/N, wet fittings Y/N, bypass already done Y/N.",
			"Cross-check ATF color/smell and coolant sheen.",
			"If mixed: stop. Diagnosis, likely rebuild/reman — not “bypass and hope.”"
		]
	}),
	ch({
		id: "engine.airFilter",
		section: "2. Engine bay",
		title: "Air filter",
		lede: "Engine air box, clamps, passenger or center-forward. Cabin filter is behind the glove box on most of these — 15k visit.",
		factory: "Replace rather than tap-clean if packed. Cabin filter on the 15k. Oil-soaked paper is blow-by / PCV, not “a dirty filter.”",
		requires: "Pleats visible, not caked. No oil soaking. Cabin due Y/N written.",
		measure: "Unclip the air-box lid. Lift the filter. Hold it up to the sky. Cabin: drop the glove-box door per the owner’s manual, slide the filter out.",
		good: "Clean, or dirty enough to note but not blocking. Cabin not overdue if this is a 15k.",
		fail: "Packed, wet with oil, torn. Replace. Find PCV if it is oily.",
		steps: [
			"Unclip the box. Hold the element to the sky.",
			"Note clean / dirty / replace. Photograph if dirty.",
			"15k: cabin filter behind the glove box."
		]
	}),
	ch({
		id: "engine.battery",
		section: "2. Engine bay",
		title: "Battery",
		lede: "Top posts in the engine bay. Age plus night-shift sits kill these. A load test is the honest test.",
		factory: "Resting after shutdown overnight typically 12.4–12.7 V. Running typically 13.5–14.7 V. Tight, clean posts. No cracked case. Load test at a parts store at this age.",
		requires: "Write rest V, running V, terminals clean Y/N, load test pass/fail.",
		measure: "Engine off: rest voltage across posts. Wiggle cable ends — white/green crust is corrosion. After start: running voltage. Load test if rest is low or cranking is slow.",
		good: "Rest 12.4–12.7 V. Running 13.5–14.7 V. Tight clean posts. Load test pass.",
		fail: "Rest below ~12.2 V, running below ~13.3 or above ~15, corroded terminals, cracked case, load-test fail, slow crank. Clean/repair/replace before you strand it.",
		steps: [
			"Engine off. Measure rest V. Photograph terminals.",
			"Wiggle the clamps. Clean if crusty.",
			"Start. Measure running V.",
			"Load test if in doubt. Do not clear a no-crank as “just the stick.”"
		]
	}),
	ch({
		id: "engine.grounds",
		section: "2. Engine bay",
		title: "Ground straps",
		lede: "Block-to-chassis and body. Corroded grounds on this chassis mimic sensor and charge problems.",
		factory: "Tight, clean metal-to-metal. No broken strands. No paint under the lug.",
		requires: "Write tight or corroded. Both engine and body straps.",
		measure: "Find the braided/flat straps at the block and body. Wiggle. Look under the lug for rust/paint.",
		good: "Tight, clean, intact braid.",
		fail: "Green crust, broken braid, loose lug. Clean or replace. Do not ignore a random electrical ghost until grounds are proven.",
		steps: [
			"Locate block-to-chassis and body grounds.",
			"Wiggle. Photograph corrosion.",
			"Clean to bare metal and retighten if corroded."
		]
	}),
	ch({
		id: "engine.pcv",
		section: "2. Engine bay",
		title: "PCV hose / vacuum lines",
		lede: "Cracked or oily PCV on a VK56 is blow-by and a dirty intake, not a “hose only” story if the filter is oil-soaked.",
		factory: "Hoses intact, not collapsed, not soaked in oil. PCV valve rattles if it is the removable type. Replace cracked hose — do not tape it.",
		requires: "OK / cracked / oily written. Vacuum lines seated.",
		measure: "Follow the PCV hose from the valve cover / intake. Squeeze. Look for oil inside the air box. Tug vacuum lines at the intake.",
		good: "OK: seated, not cracked, not oily.",
		fail: "Cracked, collapsed, oily, or off the nipple. Hiss at idle: find the leak now. Oil in the air filter: PCV/blow-by.",
		steps: [
			"Engine off. Trace PCV and nearby vacuum lines.",
			"Note cracked or oily. Photograph.",
			"Reseat or replace. Do not leave a hiss for a week “to see.”"
		]
	}),
	ch({
		id: "engine.scan",
		section: "2. Engine bay",
		title: "Scan tool",
		lede: "Any OBD-II reader that shows codes is enough. Write stored and pending BEFORE you clear anything. ATF temp helps the HOT dipstick.",
		factory: "Do not clear codes until they are written down. AT check / CEL / ABS / SLIP / VDC that stay on after prove-out get scanned before the road test. Factory ATF HOT check is near 149°F (65°C).",
		requires: "Stored codes, pending codes, ATF temp written.",
		measure: "Plug in under the dash. Record stored and pending. If the tool reads ATF temp, write it for the dipstick check.",
		good: "No stored, no pending, or known-old codes already diagnosed. ATF temp in the HOT window when you read the stick.",
		fail: "New stored codes, pending that return, lamps that stay on. Stop and diagnose before the road test. Do not clear and hope.",
		steps: [
			"Key ON or engine running per the tool.",
			"Write stored and pending. Photograph the screen.",
			"Note ATF temp if shown. Use it when you pull the trans stick.",
			"Do not clear until the report is done."
		]
	}),
	ch({
		id: "trans.parkReverse",
		section: "3. Transmission",
		title: "Park → Reverse engagement",
		lede: "RE5R05A. Do this cold and again after a 15-minute drive. Skip the whole drive if ATF is pink, milky, or sweet.",
		factory: "Takes gear in about a second. Mild bump is OK. Long delay, bang, or grinding is not. Level ground, foot on the brake, idle.",
		requires: "Cold and hot both circled: Good / Delay / Bang. Do not continue if ATF is rejected.",
		measure: "From a complete stop, brake on, shift P → R. Count the beat until it takes. Repeat after the drive when hot.",
		good: "Good: takes in about a second, mild bump.",
		fail: "Delay or bang, worse hot than cold. That is a failing unit — not a “fluid top.”",
		steps: [
			"Confirm ATF is not pink/milky/sweet. If it is, lock the road test.",
			"Level, brake on, idle. P → R. Feel the take-up.",
			"Log cold. Repeat hot after 15 min. Write notes."
		]
	}),
	ch({
		id: "trans.reverseDrive",
		section: "3. Transmission",
		title: "Reverse → Drive",
		lede: "Same standard as Park → Reverse. Delay or bang that grows as it heats up is a fail.",
		factory: "Takes gear in about a second, mild bump OK. Delay or bang is not.",
		requires: "Cold and hot: Good / Delay / Bang.",
		measure: "Brake on, idle, R → D. Feel the take-up. Repeat hot.",
		good: "Good, both temperatures.",
		fail: "Delay or bang, especially worse hot.",
		steps: ["Brake on, idle. R → D.", "Log cold and hot. Do not power-brake it to “test.”"]
	}),
	ch({
		id: "trans.up12",
		section: "3. Transmission",
		title: "1–2 upshift",
		lede: "Light throttle from a stop on a quiet road. Cold 1–2 is often a little firmer than hot 1–2 — that by itself is not a failed transmission.",
		factory: "One clean step. No roar of rpm without movement (flare). No slam.",
		requires: "Cold and hot: Clean / Flare / Harsh.",
		measure: "From a complete stop, light throttle. Feel 1–2. Flare = rpm jumps before it grabs.",
		good: "Clean. Slightly firmer cold is OK.",
		fail: "Flare, slam, or miss. Flare that gets longer as it heats up is a failing unit.",
		steps: ["Quiet road. Light throttle from a stop.", "Feel 1–2. Log cold and after the drive, hot."]
	}),
	ch({
		id: "trans.up23",
		section: "3. Transmission",
		title: "2–3 upshift",
		lede: "Same standard as 1–2. One clean step, no flare, no slam.",
		factory: "Clean step. Flare or harsh is not acceptable.",
		requires: "Cold and hot: Clean / Flare / Harsh.",
		measure: "Continue the light-throttle pull. Feel 2–3. Then a little more throttle on a second run.",
		good: "Clean both temperatures.",
		fail: "Flare, slam, miss.",
		steps: ["Light throttle through 2–3. Repeat with a bit more throttle.", "Log cold and hot."]
	}),
	ch({
		id: "trans.up345",
		section: "3. Transmission",
		title: "3–4 and 4–5",
		lede: "Quiet fifth at cruise. Missing 5th is a fail on this 5-speed.",
		factory: "Quiet fifth. Clean 3–4 and 4–5. Hunt or miss is not.",
		requires: "Cold and hot: Clean / Miss / Hunt.",
		measure: "Build speed on a quiet road. Feel 3–4 and 4–5. Cruise and see that 5th holds.",
		good: "Clean, quiet fifth.",
		fail: "No 5th, hunt between gears, miss.",
		steps: ["Light then moderate throttle up through the gears.", "Confirm 5th holds on cruise. Log cold and hot."]
	}),
	ch({
		id: "trans.tcc",
		section: "3. Transmission",
		title: "TCC lock ~45–60 mph light throttle",
		lede: "Torque-converter clutch. Gentle lock around 45–60 mph with a light foot. Shudder like rumble strips is the classic RE5R05A complaint — fluid/cooler first, then diagnosis.",
		factory: "Smooth lock. Slip (rpm rises at the same speed) or shudder is not. Skip if ATF is rejected.",
		requires: "Cold and hot: Smooth / Shudder / Slip.",
		measure: "Cruise 45–60 mph, gentle foot. Feel a slight lock. Shudder = rumble-strip vibration under a light foot.",
		good: "Smooth lock, both temperatures (often clearer hot).",
		fail: "Shudder or slip. Do not keep driving it hard. ATF condition and cooler/bypass first, then a shop that knows this trans.",
		steps: ["Quiet road, 45–60 mph, light throttle.", "Feel lock. Log shudder/slip. Recheck ATF if it shudders."]
	}),
	ch({
		id: "trans.kickdown",
		section: "3. Transmission",
		title: "Kickdown 5–4 / 4–3",
		lede: "Passing-speed kickdown. It should downshift and pull — not hesitate in a tall gear or slam.",
		factory: "Clean downshift and pull. Late or harsh is not.",
		requires: "Cold and hot: Clean / Late / Harsh.",
		measure: "At cruise, press through the kickdown. Feel 5–4 / 4–3. Repeat hot.",
		good: "Clean, pulls.",
		fail: "Hesitates, stays in a tall gear, or slams.",
		steps: ["Safe passing lane. Kickdown once cold if you must, then properly hot.", "Log clean / late / harsh."]
	}),
	ch({
		id: "trans.fourwd",
		section: "3. Transmission",
		title: "4WD engage / disengage",
		lede: "If equipped. Use 4H only on dirt or a loose surface — 4H on dry pavement will bind and feel like a driveline problem that is not there.",
		factory: "Engages and returns to 2H. Binds on pavement if you test it there — that is the test method failing, not the transfer case.",
		requires: "Works / Binds / No. 2WD: mark N/A.",
		measure: "Loose surface. 2H → 4H → back. Listen for clunks. Do not force it at speed.",
		good: "Works, no bind on a loose surface.",
		fail: "Will not engage, stays bound, grinding. Diagnose transfer case / actuator / hubs. Do not test 4H on dry pavement and call it a fail.",
		steps: [
			"2WD truck: N/A.",
			"Loose dirt/gravel only. Shift 4H, drive a few yards, return to 2H.",
			"Log works / binds / no."
		]
	}),
	ch({
		id: "trans.atfReject",
		section: "3. Transmission",
		title: "ATF reject condition",
		lede: "STOP if pink, milky, or sweet-smelling. That is coolant in the transmission. Do not continue the drive. Do not call the truck a Pass.",
		factory: "Pink / milky / strawberry / sweet = SMOD. Park it. Do not bypass-and-drive. Valve body and internal TCM may already be ruined. That is a diagnosis and likely a rebuild or reman conversation.",
		requires: "If ATF color is pink or milky, or smell is sweet: check this box, lock Section 3 and the road test, overall cannot be Pass.",
		measure: "The paper from the HOT dipstick. Color and smell. Coolant reservoir oil film is the other direction of the same leak.",
		good: "Not rejected. ATF red/amber, smells like ATF.",
		fail: "Rejected. Do not drive it to finish the week. Write it on the result line.",
		steps: [
			"Read the ATF how-to first. Look at the paper.",
			"Pink, milky, or sweet: check reject, acknowledge STOP, skip the road test.",
			"Photograph the stick and the paper. Do not add Dexron, Mercon, or anything except Matic J/S — and do not add those to milky fluid to “see.”"
		]
	}),
	ch({
		id: "brakes.pads",
		section: "4. Brakes & rolling",
		title: "Pad thickness",
		lede: "Measure remaining friction material, not the steel backing. Wheel off is best. Through the wheel you can often see the outer pad.",
		factory: "Nissan BR for this platform: lining new about 12.0 mm (0.476 in). Repair limit 1.0 mm (0.039 in). Do not run them to the indicator grind. Write LF / RF / LR / RR in mm. Confirm in FSM SM5E-1T60U1 before you machine or replace.",
		requires: "A number in mm at each corner on a 15k/30k/baseline. Visual on an oil-change short check. Honest material left. Next visit compares vs last and the miles between — that is how a sticking caliper shows up before the rotor is scrap.",
		measure: "Brake pad gauge or steel rule on the friction material only. Inner pad is often thinner — look inboard with a light, or pull the wheel. Do not measure the backing plate. Write LF / RF / LR / RR so the next report can compute wear rate.",
		good: "Well above 1.0 mm, even inner/outer, no taper to the grind tab. Shop practice: schedule before you are staring at the limit.",
		fail: "At or near 1.0 mm, grind tab contacting, inner pad gone, wet with brake fluid. Replace as an axle set. Do not mix thicknesses on the same axle.",
		steps: [
			"Chock, jack stands on the frame if the wheel comes off.",
			"Measure remaining lining at each corner. Write mm.",
			"Photograph the thinnest pad. Note inner vs outer.",
			"If one corner of an axle dropped much more than the other since last visit, treat it as a sticking caliper until proven otherwise."
		]
	}),
	ch({
		id: "brakes.rotors",
		section: "4. Brakes & rolling",
		title: "Rotors",
		lede: "Thickness, rust lip, grooves, pulse on a stop. Front discs on the 2005 brake system are a two-millimeter window from new to minimum.",
		factory: "2005 brake system: front disc standard thickness 28.0 mm (1.10 in), minimum 26.0 mm (1.02 in). Rear disc standard 14.0 mm (0.551 in), repair limit 12.0 mm (0.472 in) per FSM SM5E-1T60U1 SDS. Do not machine below the stamp. Grooves you can catch a fingernail in, or a huge rust lip, fail even if thickness is legal.",
		requires: "Write front and rear thickness / condition. Pulse on stop is a rotor/hub issue until proven otherwise.",
		measure: "Micrometer at the thinnest swept face, not the rust lip. Compare to the MIN stamp on the hat. Feel a 30 and 60 stop later for pulse.",
		good: "Above MIN, no fingernail grooves, no huge rust lip, no pulse.",
		fail: "At or below MIN, deep grooves, lip that the pad is riding, pulse, heat cracks. Replace. Do not “cut to nothing.”",
		steps: [
			"Wheel off is honest. Measure thickness. Read the MIN stamp.",
			"Run a fingernail across the swept face. Look at the rust lip.",
			"Write F and R. Photograph lips/grooves.",
			"Confirm pulse on the road-test stops."
		]
	}),
	ch({
		id: "brakes.hoses",
		section: "4. Brakes & rolling",
		title: "Brake hoses & lines",
		lede: "This checklist line is the caliper inspection on the 2005 Armada: rubber hoses, steel lines, and the caliper at each corner. A wet caliper is a leak — not dusty film.",
		factory: "Hoses not cracked, not swollen, not leaking at the crimp. Caliper dry at the piston dust boot, slide-pin boots, and banjo bolt. Slide pins move by hand with a smear of brake grease — they must not be seized. Piston boot intact, not torn, not ballooned. Steel lines along the frame not scabbed through. Pad backing plates dry — wet backing is a leaking caliper, not just worn pads. Front rotor new 28.0 mm (1.10 in), minimum 26.0 mm (1.02 in). Pad lining new about 12.0 mm, repair limit 1.0 mm (0.039 in) — those numbers live on the pad and rotor lines; a wet caliper makes those readings a fail even if thickness is legal. Confirm flare-nut and caliper-bolt torque in FSM SM5E-1T60U1. Do not guess.",
		requires: "Write hose/line condition. Wet caliper Y/N at every corner you can see. Any fresh wetness is a fail until the source is proven. Do not drive a leaking brake circuit.",
		measure: "Chock. Jack stands on the frame if the wheel comes off — never crawl under a scissor jack. One corner at a time: flashlight on the hose from body to caliper, the steel line in the inner fender, the caliper piston dust boot, both slide-pin boots, and the banjo. Squeeze the hose — a bulge is a fail. Wipe the caliper body and the boot — fresh DOT 3 vs dusty film. Push the slide pins. Look at the inboard pad backing for wetness. Repeat LF / RF / LR / RR.",
		good: "Dry calipers. Pins slide. Boots intact. Hoses flexible, no cracks, no bulge. Lines solid. Wet caliper N.",
		fail: "Cracked or bulged hose. Wet caliper, wet banjo, torn piston boot, seized pins, rusted-through line, fluid on the pad backing. Replace hose / caliper / line as required. Do not clamp a bulge. Do not keep adding fluid to a wet corner.",
		searchExtra: "caliper calipers piston boot slide pin pins banjo dust boot wet caliper brake hose",
		steps: [
			"Park level. Parking brake on. Chock the opposite wheel. If the wheel comes off, stands on the frame.",
			"Start at LF. Follow the rubber hose from the body bracket to the caliper. Look for cracks, wetness at the crimp, and a bulge when you squeeze.",
			"Look at the caliper: piston dust boot, slide-pin boots, banjo bolt. Wipe — fresh fluid is a fail. Dusty film is a note.",
			"If the wheel is off, push the slide pins. They must move. A seized pin tapers the pads — see pad thickness on this visit.",
			"Repeat RF, LR, RR. Write wet caliper Y/N. Photograph any wet boot, bulge, or scabbed line.",
			"If any corner is wet, check pad/rotor contamination and the master-cylinder level before you add fluid."
		]
	}),
	ch({
		id: "brakes.master",
		section: "4. Brakes & rolling",
		title: "Master cylinder / booster",
		lede: "Firewall, driver’s side. Seepage at the master into the booster is how you get a disappearing pedal and a dead vacuum booster.",
		factory: "No seepage at the master. Pedal firm with the engine running. Booster: engine running, pedal assist present. Confirm any replacement against the FSM.",
		requires: "Seepage Y/N. Pedal firm Y/N.",
		measure: "Look at the master-to-booster seam and the reservoir. Engine running, press the pedal — it should be firm, not sinking. Engine off vs running: booster should make the pedal easier running.",
		good: "Dry master. Firm pedal. Booster assists.",
		fail: "Wet seam, sinking pedal, no assist, reservoir crusted with fluid. Do not drive it. Master/booster is a paired conversation if fluid has entered the booster.",
		steps: [
			"Wipe and look at the master/booster seam.",
			"Engine running: firm pedal, no sink.",
			"Photograph seepage. Do not keep adding fluid to a wet master."
		]
	}),
	ch({
		id: "brakes.pedalHeight",
		section: "4. Brakes & rolling",
		title: "Pedal height engine running",
		lede: "Factory figure is remaining pedal, not “how far you push.”",
		factory: "With the engine running, distance from pedal top to floor under a hard push should still have pedal left — 3.5 in (90 mm) or more remaining under 110 lb. Write the measured remaining height.",
		requires: "Engine running. Measured number. Spec ≥ 3.5 in @ 110 lb.",
		measure: "Engine idling. Press the pedal hard (~110 lb — a firm two-foot shop press). Measure from the pedal pad down to the floor (remaining height). Do not measure travel from the released position unless you also know the released height.",
		good: "≥ 3.5 in remaining, firm, no sink.",
		fail: "Less than 3.5 in remaining, sinking, spongy. Air, leak, or master. Do not road-test a short/sinking pedal hard.",
		steps: [
			"Engine running. Firm press.",
			"Measure remaining height to the floor. Write it.",
			"If short or sinking, find fluid loss or air before the 60 mph stop."
		]
	}),
	ch({
		id: "brakes.parking",
		section: "4. Brakes & rolling",
		title: "Parking brake",
		lede: "Pedal-type park brake on this truck. Count clicks from fully released.",
		factory: "About 3–4 clicks at 44 lb. Must hold on a grade. Write clicks and holds-on-grade Y/N.",
		requires: "3–4 clicks at a firm push. Holds the truck on a grade. Fully releases (no drag).",
		measure: "Fully release. Press the park-brake pedal and count clicks at a firm push (~44 lb). Then on a grade (or a restrained stall), set it and see if it holds. Drive a few feet released — no drag.",
		good: "3–4 clicks, holds, no drag released.",
		fail: "Goes to the floor, 1 click, 8 clicks, does not hold, or drags. Adjust or repair. Do not leave a dragging park brake — it cooks rear pads.",
		steps: ["Fully released. Count clicks at a firm press. Write the number.", "Hold-on-grade test. Release and confirm no drag."]
	}),
	ch({
		id: "brakes.absLamps",
		section: "4. Brakes & rolling",
		title: "ABS / SLIP / VDC lamps",
		lede: "Prove-out then off. Stay-on or intermittent is a scan item before you call brakes “fine.”",
		factory: "ABS, SLIP, and VDC prove out at key ON / start, then go OFF. A lamp that stays on is a stored fault. Do not clear until written.",
		requires: "Prove-out then off / stay on / intermittent.",
		measure: "Key ON, watch the cluster. After start, they must go out. Note flicker on the drive.",
		good: "Prove-out then off. Stay off on the drive.",
		fail: "Stay on or intermittent. Scan ABS codes. Do not road-test as a pass with ABS dark-failed.",
		steps: [
			"Key ON — watch prove-out.",
			"After start, confirm they go out.",
			"If they stay on, scan and write codes. Do not clear first."
		]
	}),
	ch({
		id: "brakes.tread",
		section: "4. Brakes & rolling",
		title: "Tires tread",
		lede: "All four plus the spare. Inner edge of the fronts is where Armadas hide wear — crouch and look.",
		factory: "Replace before cords. Even wear across the face. US legal minimum is 2/32 in in the grooves; do not run an SUV there. Inner-shoulder wear on the fronts means alignment or upper control arms — do not ignore it.",
		requires: "Write LF / RF / LR / RR / spare. Tread even. No cords, bulges, or cracks. Next visit compares vs last and miles between — alignment / UCA show up as one side going faster.",
		measure: "Tread gauge in the main grooves, not the wear bars only. Check inner and outer. Spare too.",
		good: "Honest tread, even, spare usable.",
		fail: "Cords, 2/32 or less, inner shoulder gone, spare flat/missing. Schedule tires/alignment/UCAs as the wear pattern says.",
		steps: [
			"Gauge each tire including the spare. Write the numbers.",
			"Crouch and look at the front inner shoulders.",
			"If one side of an axle lost 2/32 more than the other since last visit, treat it as alignment or UCA until proven otherwise."
		]
	}),
	ch({
		id: "brakes.tireAge",
		section: "4. Brakes & rolling",
		title: "Tire age (DOT week/year)",
		lede: "Four-digit DOT date on the sidewall. Example 2319 = 23rd week of 2019. Tires older than 6–7 years get replaced even with tread.",
		factory: "Replace at 6–7 years regardless of tread. Write week/year for each corner and the spare. Spare is often the oldest.",
		requires: "DOT week/year written. Age, not just tread.",
		measure: "Find DOT on the sidewall (sometimes only on the inner side). Last four digits: WWYY.",
		good: "Under ~6–7 years, all five.",
		fail: "Older than 6–7 years, unreadable DOT, spare from a different decade. Replace even with tread.",
		steps: ["Read DOT on each tire and the spare. Write WWYY.", "If you must crawl to see the inner stamp, do it. Photograph."]
	}),
	ch({
		id: "brakes.wear",
		section: "4. Brakes & rolling",
		title: "Tire wear pattern",
		lede: "Even / inner shoulder / outer / cupping / center. Pattern tells you alignment, UCAs, pressure, or balance.",
		factory: "Even across the face. Inner-shoulder wear on the fronts = alignment or upper control arms. Center wear = overinflation. Outer = underinflation or aggressive cornering. Cupping = balance/shocks.",
		requires: "One pattern call, plus notes if corners disagree.",
		measure: "Look and feel inner and outer of each front. Compare rears.",
		good: "Even wear across the face on all four, matching the wear-pattern call.",
		fail: "Inner, outer, cupping, center. Do not just buy tires without fixing UCAs/alignment if the inner shoulder is gone.",
		steps: [
			"Feel inner fronts. Look at rears.",
			"Circle the pattern. Photograph inner wear.",
			"If inner fronts, plan alignment and UCA inspection."
		]
	}),
	ch({
		id: "brakes.pressures",
		section: "4. Brakes & rolling",
		title: "Pressures including spare",
		lede: "Cold. Driver’s-door sticker, not the number on the tire.",
		factory: "Set to the door-jamb placard for the 2005 Armada (load and tire size on that sticker). Spare has its own number on the sticker. Measure cold.",
		requires: "Write LF / RF / LR / RR / spare. Match the door sticker.",
		measure: "Quality gauge, cold, all five. Compare to the driver’s-door sticker.",
		good: "All five at the sticker. Caps on.",
		fail: "20% low, spare forgotten, set to the sidewall max. Reset to the door sticker.",
		steps: ["Read the door sticker first.", "Gauge all five cold. Write the numbers. Set to spec."]
	}),
	ch({
		id: "brakes.lugTorque",
		section: "4. Brakes & rolling",
		title: "Lug torque after rotation",
		lede: "After any wheel-off or rotation, torque in a star pattern. Then recheck after a short drive.",
		factory: "2005 Armada wheel nuts: 98 ft-lb (133 N·m). Star pattern, clean dry threads (no grease unless the FSM says otherwise). Recheck after 50–100 miles. Confirm in the owner’s manual / FSM if wheels were changed.",
		requires: "Torqued to spec after rotation or any wheel-off. Not “impacted until it sings.”",
		measure: "Click-type or beam torque wrench set to 98 ft-lb. Star pattern. All five wheels if you rotated, including the spare carrier if you pulled it.",
		good: "All lugs at 98 ft-lb, star, rechecked.",
		fail: "Unknown impact-only, missing lug, rounded nut, never rechecked. Do not leave the shop without a wrench click.",
		steps: [
			"If you did not pull wheels, mark N/A or confirm they were not loose.",
			"If you did: 98 ft-lb star. Recheck after the road test.",
			"Write it. Do not paint-pen a guess."
		]
	}),
	ch({
		id: "brakes.bearings",
		section: "4. Brakes & rolling",
		title: "Wheel bearings / hubs",
		lede: "Growl that changes with speed, or play at 12 and 6 with the wheel off the ground.",
		factory: "No perceptible rock in the hub with the wheel off the ground (12 and 6). No growl on the drive. Confirm hub nut torque in the FSM if you take a hub apart — do not guess that number.",
		requires: "Write LF / RF / LR / RR play or growl.",
		measure: "On stands, grab the tire at 12 and 6 and rock. A clunk here is bearing/ball joint — isolate with a pry. On the drive, growl that follows speed and changes in a turn is a hub.",
		good: "No play, no growl.",
		fail: "Rock in the hub, growl, heat at the cap after a drive. Replace the hub. Do not pack an old unit and call it good.",
		steps: ["Stands, 12-and-6 rock each corner. Write play.", "Road test: listen for growl. Note which side in a turn."]
	}),
	ch({
		id: "brakes.alignment",
		section: "4. Brakes & rolling",
		title: "Alignment feel",
		lede: "Tracks straight, small play only. Pull, wander, or inner front wear = alignment and likely UCAs on this chassis.",
		factory: "Straight on a level road, hands light. Dry-park wander plus inner front tire wear = upper control arms / alignment. Do not ignore inner shoulder wear.",
		requires: "Pull L / Pull R / Wander / Straight.",
		measure: "Level road, light grip. Does it walk? Brake in a straight line later for pull vs brake pull.",
		good: "Straight.",
		fail: "Pull, wander, or inner wear. Schedule alignment and inspect UCAs/ball joints/tie rods before you just buy tires.",
		steps: ["Level road, light hands. Note pull or wander.", "Pair with inner tire wear and the UCA/tie-rod checks."]
	}),
	ch({
		id: "steering.steeringPlay",
		section: "5. Steering / driveline",
		title: "Steering play at idle",
		lede: "Engine idling, lightly shake the wheel. Small play only. Clunk is a joint, not “character.”",
		factory: "Small play only. No clunk, no groan at full lock on the drive. Tracks straight.",
		requires: "Idle, Park or level ground, light shake. Note clunk or excess free play.",
		measure: "Engine idling. Lightly shake the steering wheel. Then full lock both ways on the drive — no groan that dumps PSF.",
		good: "Small play, no clunk.",
		fail: "Clunk, huge dead band, groan at lock (PSF/rack). Find tie rods, shaft U-joint, or rack.",
		steps: ["Idle. Light shake. Listen at the column and the rack.", "Full lock later on the drive. Check PSF if it groans."]
	}),
	ch({
		id: "steering.tieRods",
		section: "5. Steering / driveline",
		title: "Inner / outer tie rods",
		lede: "Wheels off the ground: grab the tire at 9 and 3. Inner and outer both fail on these.",
		factory: "No rock, no torn boot leaking grease. Replace as a pair on that side if the joint is loose. Alignment after.",
		requires: "No perceptible knock at 9 and 3. Boots intact.",
		measure: "Stands. 9 and 3 on each front tire. Have a helper watch the inner joint at the rack while you rock.",
		good: "Tight, boots intact.",
		fail: "Knock, torn boot, dry joint. Replace. Do not grease a torn boot and return it to service.",
		steps: ["Stands, 9-and-3 rock. Watch inner and outer.", "Photograph torn boots. Plan alignment after replacement."]
	}),
	ch({
		id: "steering.ballJoints",
		section: "5. Steering / driveline",
		title: "Upper & lower ball joints / UCAs",
		lede: "12 and 6 with the wheel off the ground. Upper control arms and ball joints are the inner-tire-wear story on this chassis.",
		factory: "No rock, no torn boot. Dry-park wander plus inner front wear = UCAs / alignment. Replace, then align.",
		requires: "No clunk at 12/6 that is the joint (not the hub). Boots intact.",
		measure: "Stands. 12 and 6. Isolate hub vs joint with a pry on the joint. Look at UCA bushings.",
		good: "Tight joints, decent UCA bushings.",
		fail: "Clunk, torn boot, collapsed UCA bushing, inner tire wear. Schedule UCAs/joints and alignment.",
		steps: ["12-and-6 rock. Pry the joint to separate hub play from ball-joint play.", "Look at UCA bushings. Photograph. Pair with inner tire wear."]
	}),
	ch({
		id: "steering.sway",
		section: "5. Steering / driveline",
		title: "Sway-bar bushings & end links",
		lede: "Clunk over small bumps is often end links, not the rack.",
		factory: "Bushings not walked out. End-link joints tight, boots intact. No clunk over speed bumps.",
		requires: "No clunk at the bar. Links tight.",
		measure: "Push the bar. Watch the bushings. Shake each end link. Road: small bumps.",
		good: "Quiet, tight, bushings in the saddles.",
		fail: "Clunk, torn link, bushing walked out. Replace links/bushings. Cheap and it changes the feel.",
		steps: ["Hands on the bar and each link. Photograph torn boots.", "Confirm on the first small bump of the drive."]
	}),
	ch({
		id: "steering.springs",
		section: "5. Steering / driveline",
		title: "Spring perches / shackles / body mounts",
		lede: "Rear shackles, front perches, body mounts. Rust and collapsed mounts make it wander and squeak.",
		factory: "Perches intact, shackles not egg-shaped, body mounts not collapsed to metal-on-metal.",
		requires: "No cracked perch, no broken leaf shackle, mounts doing their job.",
		measure: "Flashlight on front spring perches and rear shackles. Push on the body vs frame at a mount.",
		good: "Intact, not collapsed, not rusted through.",
		fail: "Rusted perch, egg-shaped shackle holes, cooked body mounts. Schedule. Do not ignore a perch crack.",
		steps: ["Front perches, rear shackles, a sample of body mounts.", "Photograph rust-through. Do not crawl under a scissor jack."]
	}),
	ch({
		id: "steering.shocks",
		section: "5. Steering / driveline",
		title: "Shock / strut leaks",
		lede: "Wet shock is a used-up shock. Cupped tires often start here.",
		factory: "Dry body, not dripping. Mounts intact. A light dusty film can be old; a wet streak is a fail.",
		requires: "No active leak. No broken mount.",
		measure: "Wipe the shock body. Look at the shaft. Bounce a corner — it should settle, not keep bouncing.",
		good: "Dry, controlled bounce.",
		fail: "Wet streak, broken mount, bounce that will not die, cupping. Replace as a pair on the axle.",
		steps: ["Look at all four. Photograph wet bodies.", "Bounce test. Pair with cupping on the tire line."]
	}),
	ch({
		id: "steering.rack",
		section: "5. Steering / driveline",
		title: "Rack boots / PSF high-pressure hose",
		lede: "Torn rack boot dumps grease and then the rack. The high-pressure PSF hose is a common leak on this chassis. Recheck PSF HOT after the drive.",
		factory: "Boots intact, dry. High-pressure hose dry. PSF in the HOT range after the drive, not burnt.",
		requires: "No torn boot, no wet hose, PSF not black.",
		measure: "Look at both rack boots. Follow the high-pressure hose from pump to rack. After the drive, read PSF HOT.",
		good: "Dry boots, dry hose, HOT PSF in range.",
		fail: "Torn boot, wet hose, groan at lock, burnt PSF. Replace hose/rack as required. Do not keep topping.",
		steps: ["Boots and hose, flashlight. Photograph wetness.", "After the drive, PSF HOT reading. Full-lock groan is a clue."]
	}),
	ch({
		id: "steering.shafts",
		section: "5. Steering / driveline",
		title: "Front & rear drive shafts / U-joints / slip yoke (4WD)",
		lede: "Vibration 45–70 that is not tires is often a U-joint or shaft. 4WD has a front shaft too.",
		factory: "U-joints have no perceptible play. Slip yoke not dry-seized. No clunk on take-up. Confirm any U-joint spec in the FSM.",
		requires: "No play, no rust-frozen joint, no missing strap bolts.",
		measure: "Under the truck, twist and pull each joint. Look at the rear slip yoke. On the drive, vibration that changes with speed but not with braking.",
		good: "Tight joints, no vibration 45–70 from the driveline.",
		fail: "Play, rusted joint, missing bolts, vibration. Replace joints/shaft. Do not ignore a clicking U-joint.",
		steps: ["Stands or lift. Hands on each joint. Photograph rust/play.", "4WD: front shaft too. Pair with the vibration road-test line."]
	}),
	ch({
		id: "steering.seals",
		section: "5. Steering / driveline",
		title: "CV / pinion / axle seals",
		lede: "Fresh gear oil or ATF at a seal is a leak. Dusty old film is a note. Pinion is the rear yoke.",
		factory: "Seals dry enough that you cannot wipe a fresh wet finger. Active dripping is a fail. Pair with the seep lines in Fluids.",
		requires: "No active drip at CV, pinion, or axle seals.",
		measure: "Flashlight on front CVs (4WD), rear axle seals, pinion. Wipe.",
		good: "Dry, or old dusty film only.",
		fail: "Fresh wet, flung oil on the back of a wheel. Schedule the seal. Check the matching fluid level.",
		steps: ["After a drive, look at CVs, axle ends, pinion.", "Photograph wetness. Fill the matching box on Fluids if it is a seep."]
	}),
	ch({
		id: "steering.mounts",
		section: "5. Steering / driveline",
		title: "Engine and transmission mounts",
		lede: "A cooked mount lets the VK56 bang on take-off and tears other things. Look, then have a helper load Drive and Reverse against the brake.",
		factory: "Rubber not split through, not collapsed onto the limiter. No metal-on-metal clunk on take-up.",
		requires: "Intact mounts, no bang in Drive or Reverse.",
		measure: "Visual on engine and trans mounts. Helper: brake on, idle, D then R — watch the engine rock.",
		good: "Controlled rock, rubber intact.",
		fail: "Split, collapsed, bang. Replace. Do not leave a trans mount until it shears the exhaust or the cooler lines.",
		steps: ["Visual, flashlight. Photograph cracked rubber.", "Load D and R against the brake. Watch the rock."]
	}),
	ch({
		id: "underbody.oilPan",
		section: "6. Underbody",
		title: "Oil pan and drain plug",
		lede: "Pan rail, drain plug, crush washer. Common seep at the pan and at the oil-cooler adapter above it.",
		factory: "New crush washer every drain. Plug torque from FSM SM5E-1T60U1 — do not guess. No active drip.",
		requires: "Plug present, not rounded, not weeping a stream. Pan not caved.",
		measure: "After a drive, flashlight on the pan rail and plug. Wipe.",
		good: "Dry enough, washer recently replaced if you just serviced it.",
		fail: "Streamer from the plug, stripped plug, cracked pan. Fix before the next drive.",
		steps: ["Look at the pan and plug. Photograph drips.", "If you drain: new washer, correct torque from the FSM, recheck after the drive."]
	}),
	ch({
		id: "underbody.transPan",
		section: "6. Underbody",
		title: "Transmission pan and cooler fittings",
		lede: "RE5R05A pan gasket and the two cooler lines. If you have never seen the inside at 270k, drop the pan once: new gasket, new filter, clean the magnet.",
		factory: "Fine grey film on the magnet is normal. Chunks and clutch flake are not. Pan drain ~4–6 qt, not a full 11¼. Matic J/S only. Do not high-pressure power-flush an unknown 270k unit.",
		requires: "No active drip at the pan or cooler fittings. Magnet/photo if you drop it.",
		measure: "Flashlight on the pan rail and cooler fittings after a drive. If you drop it, photograph the magnet.",
		good: "Dry rail, dry fittings, grey film only.",
		fail: "Drip, wet cooler fittings (SMOD path), chunks on the magnet. Do not keep driving hard.",
		steps: ["Look at the pan and cooler fittings. Photograph wetness.", "If history unknown at 270k: drop pan, photo the magnet, new filter/gasket, Matic J/S back, HOT level."]
	}),
	ch({
		id: "underbody.fuel",
		section: "6. Underbody",
		title: "Fuel tank, straps, lines, EVAP area",
		lede: "Smell, wetness, rusted straps, EVAP hoses dry-rotted at the tank.",
		factory: "No leak. Straps intact. Lines not rusted through. EVAP hoses not cracked. Any fuel wetness is a fail — do not drive it.",
		requires: "Dry tank and lines, straps not broken.",
		measure: "Flashlight, nose. Look at straps, the tank top/sides, metal lines, EVAP can and hoses.",
		good: "Dry, straps sound, no fuel smell.",
		fail: "Fuel smell/wet, broken strap, rusted line. Stop. Repair before you spark it.",
		steps: ["After a drive (heat helps). Look and sniff.", "Photograph rusted straps or wetness. Do not probe a wet tank with a trouble light that can spark."]
	}),
	ch({
		id: "underbody.exhaust",
		section: "6. Underbody",
		title: "Exhaust hangers, cats, muffler, leaks",
		lede: "Pair with the manifold tick. From the flanges back: hangers, cats, muffler, tips.",
		factory: "No blow at flanges. Hangers intact. Cats not rattling internally. Muffler not blown out. Manifold soot is the engine-bay line.",
		requires: "Quiet after warmup aside from a known manifold tick. Hangers holding.",
		measure: "Cold-ish after a short wait. Look at each flange for soot. Push hangers. Listen for cat rattle.",
		good: "Dry flanges, hangers intact, no blow.",
		fail: "Soot blow, broken hanger, rattling cat, hole in the muffler. Schedule. Exhaust in the cabin is a do-not-drive.",
		steps: ["Flanges, hangers, cats, muffler. Photograph soot.", "If cabin smell, fail the road test and do not keep driving it."]
	}),
	ch({
		id: "underbody.frame",
		section: "6. Underbody",
		title: "Frame rust, spare-tire carrier, running-board mounts",
		lede: "Frame, spare carrier under the rear, running-board / step mounts. Scale is one thing. Holes are another.",
		factory: "No rust-through at the frame, carrier, or step mounts. Spare carrier operates. Confirm any weld repair is structural, not a band-aid.",
		requires: "Solid frame in the usual rust belts (rear, steps, carrier). Spare can come down.",
		measure: "Ice pick or screwdriver — tap, do not spear blindly. Look at the spare carrier bolts and the step mounts.",
		good: "Surface scale OK at this age. No holes, carrier works.",
		fail: "Holes, crumbly frame, seized carrier, step hanging off. Schedule. A spare you cannot drop is a fail on that line.",
		steps: ["Walk the frame rails, steps, spare carrier.", "Try the carrier. Photograph rust-through."]
	}),
	ch({
		id: "underbody.lines",
		section: "6. Underbody",
		title: "Brake and fuel line rust",
		lede: "Hard lines along the frame. Surface rust is a note. Flake-to-hole is a fail.",
		factory: "Lines not rusted through. Clamps present. Any brake-line wetness is a do-not-drive.",
		requires: "Solid lines, no wetness.",
		measure: "Flashlight along the frame. Gently wipe. Look at bends and clamps.",
		good: "Surface rust only, dry, clamps on.",
		fail: "Flaking to holes, wet brake line, wet fuel line. Brake line: do not drive. Fuel line: do not drive.",
		steps: ["Follow brake and fuel lines. Photograph scabs.", "If wet, stop. This is not a “next visit” item."]
	}),
	ch({
		id: "cabin.airbag",
		section: "7. Cabin & safety",
		title: "Airbag lamp proves out and goes off",
		lede: "Key ON: lamp ON for prove-out, then OFF. A lamp that stays on is a stored SRS fault — not a pass.",
		factory: "Prove-out then off. Do not probe SRS with a test light. Do not clear codes to hide a lamp.",
		requires: "Lamp on, then off. Stays off. A stay-on or intermittent lamp is a hard gate — Pass is blocked.",
		measure: "Key ON, watch the cluster. If it stays on, scan SRS (not just powertrain).",
		good: "Prove-out then off.",
		fail: "Stays on, never comes on, or flickers. Diagnose. Do not call Pass with an airbag lamp.",
		steps: ["Key ON. Watch the airbag lamp.", "If it stays on, scan and write. Do not disconnect the battery to “reset” it for the report."]
	}),
	ch({
		id: "cabin.seatbelts",
		section: "7. Cabin & safety",
		title: "Seatbelts latch and retract — all rows",
		lede: "All three rows on an Armada. Latch, unlatch, retract. Torn webbing is a fail.",
		factory: "Every belt latches, unlatches, and retracts. No cut webbing. No missing tongues. Child-seat anchors present if equipped.",
		requires: "All rows checked, not just the fronts.",
		measure: "Pull each belt to the latch. Click. Jerk. Release. Let it retract. Look at the webbing.",
		good: "All latch and retract. Webbing intact.",
		fail: "Won’t latch, won’t retract, cut webbing, missing buckle. Replace. Do not knot a belt.",
		steps: ["Front, middle, third row. Both sides.", "Photograph damaged webbing. Write which seat failed."]
	}),
	ch({
		id: "cabin.latches",
		section: "7. Cabin & safety",
		title: "Doors / rear hatch / rear glass latch",
		lede: "Every door, the hatch, and the rear glass. A hatch that pops on the highway is a do-not-drive.",
		factory: "Each latch catches on the first slam, secondary catch works, interior and exterior handles work, child locks work if equipped.",
		requires: "All portals latch. Rear glass latches.",
		measure: "Open/close each door, hatch, rear glass. Try inside and outside handles. Confirm it stays shut when you pull.",
		good: "All latch and stay.",
		fail: "Won’t catch, pops open, handle dead, rear glass unlatched. Repair before you drive it.",
		steps: ["Walk around. Every door, hatch, glass.", "Photograph a failed latch. Do not tape a hatch shut and pass it."]
	}),
	ch({
		id: "cabin.horn",
		section: "7. Cabin & safety",
		title: "Horn",
		lede: "It has to work. Center of the wheel, a real honk.",
		factory: "Horn sounds from the pad. Both notes if dual. No delay.",
		requires: "Sounds when pressed.",
		measure: "Key ON or ACC as this truck needs. Press the pad.",
		good: "Loud, immediate.",
		fail: "Dead, faint, only one note if dual. Clock-spring / horn / fuse — fix it. A dead horn is a fail on this safety sheet.",
		steps: ["Key ON or ACC as this truck needs. Press the pad in the center of the wheel.", "Listen for a real honk, both notes if dual. If dead, check the horn fuse, then the clock-spring / switch."]
	}),
	ch({
		id: "cabin.lights",
		section: "7. Cabin & safety",
		title: "Lamps — headlights through hazards",
		lede: "Headlights, high beams, fogs, tails, brake, reverse, plate, hazards. Second person helps on brake and reverse.",
		factory: "Every bulb works. Aim not in other people’s eyes. Brake lights on both sides plus the high mount. Hazards work with key off.",
		requires: "Walk-around with a helper on brake/reverse/turn.",
		measure: "Key ON, engine still off for the first pass. Headlights low and high, fogs, tails, plate, hazards. Helper: brake, reverse, turns.",
		good: "Every lamp works.",
		fail: "Any dark bulb, cracked lens leaking water, brake light out. Replace before night driving. A dark brake lamp is a fail.",
		steps: ["Key ON. Walk around. Helper on brake and reverse.", "Hazards with key off. Photograph a dark lamp."]
	}),
	ch({
		id: "cabin.wipers",
		section: "7. Cabin & safety",
		title: "Wipers / washers front and rear",
		lede: "Front pair and the rear hatch. Rubber not torn. Washers wet the glass.",
		factory: "Wipe the glass clean, park at the bottom, rear works, washers spray. Replace torn rubber — do not flip a blade and pass it.",
		requires: "Front and rear wipe. Washers spray.",
		measure: "Key ON. Lift each blade, look at the rubber edge. Run front and rear. Spray washers.",
		good: "Clean wipe, rubber intact, both washers spray.",
		fail: "Torn rubber, chatter, dead rear, no spray. Replace blades / fix washer. Do not road-test rain-blind.",
		steps: ["Lift blades. Run front and rear. Spray.", "Replace torn rubber now if you have blades."]
	}),
	ch({
		id: "cabin.hvac",
		section: "7. Cabin & safety",
		title: "Defroster and HVAC blower",
		lede: "Defroster has to clear the glass. Blower on all speeds. A dead defroster is a fail in this climate.",
		factory: "Defrost blows on the windshield. Blower all speeds. Heat eventually with a warm engine. A/C optional for this safety line — defrost is not.",
		requires: "Defrost works. Blower not dead.",
		measure: "Key ON, engine can be running. Defrost mode, blower high, hand at the windshield ducts. Click through speeds.",
		good: "Air on the glass, all speeds.",
		fail: "No defrost, one speed only, burning smell. Repair. Do not pass a truck that cannot clear the windshield.",
		steps: ["Defrost + high blower. Feel the glass ducts.", "Click speeds. Note a burning smell as a fail."]
	}),
	ch({
		id: "cabin.glass",
		section: "7. Cabin & safety",
		title: "Mirrors / glass cracks",
		lede: "Driver’s view. A crack in the wiper sweep is a fail. Both outside mirrors present and usable.",
		factory: "No cracked windshield in the driver’s view. Mirrors present, glass not shattered. Rear glass latches (separate line) and is not a spiderweb.",
		requires: "Driver can see. No illegal crack in the sweep.",
		measure: "Stand outside and in the seat. Look at the windshield sweep, both mirrors, rear glass.",
		good: "Clear view, mirrors intact.",
		fail: "Crack in the sweep, missing mirror, shattered rear. Schedule glass. Do not drive a sweep crack as a pass.",
		steps: ["Sit in the seat. Look through the sweep.", "Walk the mirrors and rear glass. Photograph cracks."]
	}),
	ch({
		id: "cabin.jack",
		section: "7. Cabin & safety",
		title: "Jack, lug wrench, spare present and usable",
		lede: "Spare inflated, jack and lug wrench present, carrier works. A spare you cannot get down is not a spare.",
		factory: "Spare at the door-sticker pressure, legal tread, not 12 years old. Jack and wrench present. Carrier operates. Do not set the truck on this jack and crawl under it — it is for a roadside wheel change on level ground, then stands if you crawl.",
		requires: "Spare present and inflated. Jack and wrench present. Carrier works.",
		measure: "Find the jack/wrench. Drop or inspect the spare. Gauge it. DOT date on the spare.",
		good: "All present, spare holds air, carrier works.",
		fail: "Missing jack, missing wrench, flat spare, seized carrier. Fix it. You will need it on this truck.",
		steps: ["Locate jack and wrench. Inspect the spare and carrier.", "Gauge the spare. Write age on the tire-age line too."]
	}),
	ch({
		id: "cabin.recalls",
		section: "7. Cabin & safety",
		title: "Nissan campaigns",
		lede: "This visit, this VIN. Live NHTSA lookup of Nissan safety campaigns. The paper form keeps the dated stamp.",
		factory: "Open safety campaigns get done or written. Airbag, fuel, IPDM, and equipment campaigns on this chassis are not optional notes. NHTSA is the public Nissan campaign filing.",
		requires: "17-character VIN in the header. Tap Check Nissan campaigns. The form must read: Checked Nissan campaign list on [date] for VIN [vin].",
		measure: "VIN from the dash or door sticker. The app decodes it and pulls the NHTSA campaign list for that year/make/model. VIN-specific “already repaired” status is dealer-only — list campaigns here, note still-open work in notes.",
		good: "Stamp on the form with this VIN and today’s visit date. Campaigns listed. Any still-open dealer work written in notes.",
		fail: "No VIN, no lookup, or a Pass with an unrepaired safety campaign you already know is open. Do not.",
		steps: [
			"Enter the 17-character VIN from the dash or door in the header.",
			"Tap Check Nissan campaigns. Wait for the NHTSA list.",
			"Confirm the stamp: Checked Nissan campaign list on [date] for VIN [vin].",
			"Read campaign numbers (fuel gauge, IPDM, A/C fan, lower links on this truck). Note any still open at a dealer.",
			"The PDF carries the stamp so the file is defensible later."
		]
	}),
	ch({
		id: "road.coldStart",
		section: "8. Road test",
		title: "Cold start — chain and manifold noise recorded",
		lede: "The road-test box is the confirmation that you actually logged the cold-start noises from the engine-bay lines.",
		factory: "Timing-cover rattle seconds and manifold tick/soot already written. Do not skip the cold start and then guess.",
		requires: "Those engine-bay lines filled. This box checked only after that.",
		measure: "Look back at timing cover and manifolds. Copy the result here as “recorded.”",
		good: "Recorded. Quiet or a known short rattle, manifolds noted.",
		fail: "Never listened cold. Ongoing rattle or tick+soot not written.",
		steps: ["Do the cold start first, before the drive.", "Check this box only after timing-cover and manifold lines have numbers/notes."]
	}),
	ch({
		id: "road.overheat",
		section: "8. Road test",
		title: "No overheat after 15 min mixed driving",
		lede: "Temp gauge settles at the normal middle mark and stays there. Climbing toward H in normal driving: stop.",
		factory: "Gauge in the middle, stable. Not toward H. Skip the drive if ATF is rejected or coolant is empty.",
		requires: "15 min mixed driving. Gauge stable Y/N.",
		measure: "Watch the gauge the whole drive. After 15 min it must be stable in the middle.",
		good: "Stable, middle. Gauge stable Y.",
		fail: "Climbing, bouncing, steam, smell. Stop. Cooling problem. Do not finish the loop to “see.”",
		steps: ["Mixed road, 15 minutes. Watch the gauge.", "Write stable Y/N. Stop if it climbs."]
	}),
	ch({
		id: "road.brakes",
		section: "8. Road test",
		title: "Brakes from 30 and from 60 — no pull, no pulse",
		lede: "Moderate stops, not panic stops. Straight, firm, no shake.",
		factory: "Straight, firm pedal, no shake. Pull, pulse (rotors), soft pedal that sinks, grinding: fail. Pair with pad/rotor measurements.",
		requires: "One stop from ~30 and one from ~60 in a safe place.",
		measure: "Hands light, brake straight. Feel pull and pulse in the pedal/wheel.",
		good: "Straight, firm, no pulse.",
		fail: "Pull, pulse, sink, grind. Measure rotors/pads. Do not keep doing 60s on a pulsing truck.",
		steps: ["Safe road. ~30 mph moderate stop. Then ~60.", "Log pull/pulse. Photograph nothing — write it, then recheck rotors."]
	}),
	ch({
		id: "road.vibration",
		section: "8. Road test",
		title: "No new vibration 45–70 mph",
		lede: "Shake that changes with speed = tires / balance / U-joint / shaft. Not a “road’s rough” shrug.",
		factory: "None at 45–70. If it shakes, isolate tires vs driveline (does it change in a turn, or only on throttle).",
		requires: "Cruise 45–70. No new shake.",
		measure: "Smooth road. 45, 55, 65. Note throttle on vs coast.",
		good: "No new vibration at 45–70 mph on a smooth road.",
		fail: "Shake. Check balance, inner tires, U-joints, shafts. Do not pass it as character.",
		steps: ["Cruise 45–70 on a smooth road.", "If it shakes, note speed and throttle. Inspect tires and shafts."]
	}),
	ch({
		id: "road.shifts",
		section: "8. Road test",
		title: "Shift quality matches Section 3",
		lede: "The road test is not a second opinion that undoes a failed 1–2. It confirms the table.",
		factory: "Matches the cold/hot table. Flare, missing 5th, TCC shudder, delay that grows hot: failing trans.",
		requires: "Section 3 filled. This box = the drive agreed.",
		measure: "Drive the same checks: take-up, 1–2, 2–3, 4–5, TCC, kickdown.",
		good: "Matches a clean table.",
		fail: "Drive is worse than the table, or the table was already flare/shudder. Do not Pass.",
		steps: ["Fill Section 3 on the drive.", "Check this box only if the table and the seat-of-pants agree."]
	}),
	ch({
		id: "road.lamps",
		section: "8. Road test",
		title: "No new warning lamps",
		lede: "Nothing new after the drive. If a lamp comes on, stop and scan. Do not clear codes until you write them.",
		factory: "No new dash lamps. Stop and scan. Write stored/pending.",
		requires: "Cluster clean aside from known-old items already written.",
		measure: "Watch the cluster the whole drive and after shutdown/restart.",
		good: "No new lamps.",
		fail: "New CEL, AT, ABS, oil, temp. Stop. Scan. Do not Pass.",
		steps: ["Watch the cluster. If a lamp comes on, stop and scan.", "Write codes on the scan line. Do not clear first."]
	}),
	ch({
		id: "baseline.sparkPlugs",
		section: "270k due",
		title: "Spark plugs (105k iridium — cycle 2 or 3)",
		lede: "VK56DE iridium plugs are a 105,000-mile item. At 270k you are on cycle 2 (210k) or heading into cycle 3 (315k). Unknown last change is a Fail, not a note.",
		factory: "Nissan iridium spark plugs, 105,000-mile interval on this 5.6. Coil-on-plug, eight plugs. Confirm plug type in FSM SM5E-1T60U1 before you buy. Do not gap a worn iridium tip as a “fix.”",
		requires: "Last replaced miles written, or Unknown. Cycle 2 or 3 marked. Pass or Fail. Pass only if last change is within 105k of current miles and you can prove it.",
		measure: "Current miles minus last plug miles. If last is unknown, treat as overdue. Pull one coil only if you are actually inspecting — boot oil is a valve-cover / tube-seal issue, not a plug-gap issue.",
		good: "Last change within 105k, iridium still in spec, boots dry. Pass.",
		fail: "Unknown last change at 270k. Last change ≥105k ago. Oil in the tubes. Misfire. Cycle 1 claimed at 270k is not honest.",
		steps: [
			"Write current miles and last plug miles. If you cannot prove last change, mark Unknown and Fail.",
			"270 ÷ 105 ≈ 2.6 — you are on cycle 2 or 3, not cycle 1.",
			"If replacing: one bank at a time, anti-seize only if the plug spec says so, torque to FSM, dielectric on the boot.",
			"Grade Pass or Fail. A note is not a grade."
		]
	}),
	ch({
		id: "baseline.coolantService",
		section: "270k due",
		title: "Coolant service + cap + thermostat + water-pump weep",
		lede: "Glance at the reservoir is not a coolant service. At 270k, unknown history means drain, cap, thermostat behavior, and the water-pump weep hole.",
		factory: "50/50 Nissan Long Life (HOAT) and distilled water. System about 14.4 L / 3¾ gal. Service about 60,000 miles / 5 years if history is unknown. Never tap water. Never Dex-Cool mixed in. Radiator cap holds system pressure — a weak cap is overheat. Thermostat must let the gauge reach the normal middle and stay there. Water-pump weep hole at the 6 o’clock of the pump: wet = the pump is done.",
		requires: "Last service miles/year or unknown. Cap Pass/Fail. Thermostat Pass/Fail (gauge to middle, not stuck cold or jumping to H). Weep dry/wet. Overall Pass or Fail.",
		measure: "Engine COLD for cap and weep. After the drive: gauge must sit at the normal middle. Weep hole: look at the pump body below the pulley for dried coolant or a wet streak. Do not open the radiator cap hot.",
		good: "Service in the last 60k / 5 years, cap holds, gauge stable at middle, weep dry.",
		fail: "Unknown or overdue service. Weak/unseated cap. Gauge never warms or climbs to H. Wet weep hole. Oily coolant is SMOD — stop.",
		steps: [
			"Cold: reservoir level, color, freeze point. Cap seated. Photograph the weep hole.",
			"Drive: gauge to the middle and stays. Stuck closed overheats. Stuck open never warms.",
			"If history unknown at 270k: drain cold, flush distilled, new cap if weak, refill 50/50 Nissan LL.",
			"Wet weep: replace the pump (and usually the thermostat while you are there). Grade Pass or Fail."
		]
	}),
	ch({
		id: "baseline.brakeFluid",
		section: "270k due",
		title: "Brake fluid (DOT 3, moisture)",
		lede: "DOT 3 is hygroscopic. At 270k, “it still looks ok” is not a 24-month flush. Grade it.",
		factory: "DOT 3 from a sealed bottle. Flush every 24 months regardless of miles. Never DOT 5 silicone. Never an old open bottle. Reservoir never dry during a bleed. Color should be light honey / pale yellow. High moisture fails the fluid even if the pedal is firm today.",
		requires: "Last flush date/miles or unknown. Color and moisture already on the fluids row. Pass or Fail on this 270k line.",
		measure: "Wipe the cap. Read MIN/MAX. Color: clear-amber vs dark. Moisture chip from the fluids row. If last flush is unknown or >24 months, Fail and flush.",
		good: "Flushed within 24 months, light honey, dry, cap sealed, pedal later firm.",
		fail: "Unknown last flush at 270k. Dark brown/black. High moisture. Below MIN (pads or leak). Wet master — do not drive.",
		steps: [
			"Write last flush. Unknown at 270k is a Fail.",
			"Color and moisture. Dark or high moisture: DOT 3 bleed, one corner at a time, reservoir never dry — or a shop.",
			"Grade Pass or Fail. Do not hide overdue fluid in notes."
		]
	}),
	ch({
		id: "baseline.diffFluid",
		section: "270k due",
		title: "Diff and transfer-case fluid",
		lede: "Seep look is not a fluid change. 30k item. Fill-plug level, color, glitter. 2WD is rear only.",
		factory: "Rear and front (4WD): API GL-5 80W-90 (synthetic 75W-90 ok for heat). Front about 1.6 L / 3⅜ pt. Rear about 1.8 L / 3¾ pt — confirm in FSM. Transfer (4WD): Nissan Matic D, about 3.0 L / 3⅛ qt. Change every 30,000 miles. Fill to the fill-plug hole, truck level.",
		requires: "Each fill plug Pass/Fail: rear always; front and transfer on 4WD. Overall Pass or Fail. Level at the hole, not milky, not glitter-heavy, not burnt tar.",
		measure: "Park level after a drive. Upper fill plug out — not the drain. Finger at the hole. Oil should wet the finger. Smell and color. Photograph seepage vs the fill.",
		good: "Level at the hole, gear oil looks like gear oil, transfer is Matic D not milky. Last change within 30k or you just serviced it.",
		fail: "Low, milky, glitter, burnt, unknown last change at 270k (nine 30k intervals overdue). Seep-only with no fill-plug check is a Fail on this line.",
		steps: [
			"2WD: rear only. 4WD: transfer, front, rear.",
			"Fill plug out. Finger wet at the hole. Color, smell, glitter.",
			"If unknown at 270k: drain/fill to spec. Grade each plug, then the line Pass or Fail."
		]
	}),
	ch({
		id: "baseline.seepage",
		section: "270k due",
		title: "Valve-cover / timing-cover / oil-pan seepage grade",
		lede: "VK56 seeps. Grade each: dry, film, wet, drip. Wet or drip is a Fail — not “watch it.”",
		factory: "No published drip rate. Dusty film on an old gasket at 270k is common. Fresh wet that wets a finger is a leak. Active drip is not a watch item. Valve-cover gaskets, front cover, oil-cooler O-ring at the block, pan rail are the usual sources.",
		requires: "A grade on valve covers, timing cover, and oil pan. Overall Pass or Fail. Photograph wetness.",
		measure: "After a drive, engine off a few minutes. Flashlight. Wipe a finger: dry / dusty film / fresh wet / drip on the ground. Timing cover is the front of the engine. Pan is underneath — stands on the frame.",
		good: "Dry, or dusty film that does not wet the finger. Pass with the grades written.",
		fail: "Wet or drip at covers, timing cover, or pan. Oil-cooler O-ring wet. Puddle on the ground. Do not call that a note.",
		steps: [
			"Grade valve covers, timing cover, pan: dry / film / wet / drip.",
			"Photograph anything wetter than film.",
			"Overall Pass only if nothing is wet or dripping. Grade it."
		]
	}),
	ch({
		id: "baseline.manifoldBolts",
		section: "270k due",
		title: "Exhaust manifold / heat-shield bolts",
		lede: "VK56 classic: heat-shield bolts back out, shields rattle, manifolds crack. This line is the bolts and shields, not just the cold tick.",
		factory: "Heat shields stay bolted. Missing or loose bolts are a fail. A sooty stripe at the manifold-to-head flange is a crack or gasket — schedule. Confirm fastener torque in FSM SM5E-1T60U1. Do not “snug it” with the engine hot.",
		requires: "Both banks: shields present, bolts present and tight. Pass or Fail. Soot Y/N already on the cold-start manifold line.",
		measure: "Engine off, after warmup cool enough to touch the shields, not the manifold. Wiggle each shield. Count bolts. Flashlight at the flange for soot. Cold tick plus soot is the other line — this line is hardware.",
		good: "Shields tight, bolts present, no rattle, no missing hardware.",
		fail: "Loose or missing heat-shield bolts, rattling shield, broken stud. Schedule hardware (and manifolds if soot + tick).",
		steps: [
			"Both banks. Wiggle the shields. Missing bolt = Fail.",
			"Photograph gaps or soot at the flange.",
			"Grade Pass or Fail. Do not leave missing bolts as a note."
		]
	}),
	ch({
		id: "baseline.ucaJoints",
		section: "270k due",
		title: "Upper control arms / ball joints",
		lede: "Inner pad taper and inner tire wear on this chassis are UCAs until proven otherwise. Grade the joints, not the alignment shop later.",
		factory: "No rock at the upper or lower ball joint. UCA bushings not collapsed. Inner-shoulder tire wear or inner pad taper means alignment after the arms, not just new tires. Replace, then align. Confirm any torque in the FSM.",
		requires: "12-and-6 rock Pass/Fail. Inner taper Y/N written. Overall Pass or Fail.",
		measure: "Stands. 12 and 6 on each front tire. Pry the joint to separate hub play from ball-joint play. Look at UCA bushings. Pair with the pad mm and tire-wear lines.",
		good: "Tight joints, decent bushings, even inner/outer pads and tires.",
		fail: "Clunk, torn boot, collapsed UCA bushing, inner pad taper, inner tire wear. Schedule UCAs/joints and alignment. Do not just buy tires.",
		steps: [
			"12-and-6. Pry the joint. Photograph torn boots / collapsed bushings.",
			"Mark inner taper Y/N from the pad and tire lines.",
			"Grade Pass or Fail. Inner taper with “watch the arms” in notes is a Fail."
		]
	}),
	ch({
		id: "baseline.airShocks",
		section: "270k due",
		title: "Rear load-leveling / air shocks",
		lede: "Some 2005 Armadas have rear load-leveling. If not equipped, Pass. If equipped, leaks and sag are a Fail — not a ride-quality note.",
		factory: "If equipped: rear air/load-leveling shocks hold height, dry, compressor not short-cycling. A wet air shock is used up. Pair of the axle. If not equipped, conventional shocks still get the leak look on the shock line — this line is N/A Pass.",
		requires: "Equipped Y/N. If N: Pass. If Y: height even, dry, compressor quiet. Pass or Fail.",
		measure: "Look at the rear shocks. Air lines and a compressor/dryer mean equipped. Park on level ground: rear sit even, not one-side sag. Wet streak on the air shock body is a leak. Bounce: it should settle.",
		good: "Not equipped (Pass), or equipped, dry, level, compressor not running constantly.",
		fail: "Equipped and sagging, wet, or compressor short-cycling. Replace as a pair. Do not keep adding air to a leak.",
		steps: [
			"Decide equipped Y/N. Not equipped: Pass this line.",
			"If equipped: height, wetness, compressor behavior. Photograph sag or wetness.",
			"Grade Pass or Fail."
		]
	}),
	ch({
		id: "result.smodPlan",
		section: "9. Result",
		title: "SMOD prevention — 30k / 270k",
		lede: "Detection is pink, milky, or sweet ATF. Prevention is an external stacked-plate cooler and a new radiator before that happens. At 270k, red ATF today is not a maintenance plan.",
		factory: "The 2005 Armada radiator has a small ATF cooler in the tank. That chamber cracks; coolant and ATF mix and kill the RE5R05A (SMOD). Nissan does not publish a “replace radiator to prevent SMOD” mile. This shop’s 30k powertrain action is: bypass the in-radiator cooler to an external stacked-plate cooler, cap the radiator ATF ports, and replace the radiator if it is original, unknown, or the tanks are 10+ years old. Highest-value job on a 2005 that still shifts.",
		requires: "Radiator last replacement: original/unknown or year. Cooler fittings photo — required on 30k / 270k, and whenever fittings are wet. Bypass already done Y/N on the cooler-lines row. Write the plan even if ATF is still red.",
		measure: "Year or YYYY-MM on the radiator if it was replaced; otherwise original/unknown. Photograph the two small ATF fittings at the radiator tank (wet or dry). Confirm whether an external cooler is actually installed and the radiator ports are capped.",
		good: "External cooler installed, radiator replaced with a date on the form, fittings photo on file, ATF still red/amber. Plan is closed.",
		fail: "Original or unknown radiator, or in-radiator cooler still in service, at 30k / 270k. Wet fittings with no photo. Calling Pass because “it isn’t milky today.”",
		steps: [
			"This is the 30k / 270k result action — not the oil-change glance.",
			"Write radiator last: original/unknown, or the replacement year.",
			"Photograph the ATF cooler fittings at the radiator. Required, even if dry.",
			"If bypass is not done: schedule external stacked-plate cooler + radiator replacement. Cap the old ports.",
			"If ATF is already pink/milky/sweet: stop. Prevention is too late — see ATF reject. Do not bypass-and-drive.",
			"Stamp the form: not milky today is not a maintenance plan."
		]
	}),
	ch({
		id: "result.overall",
		section: "9. Result",
		title: "Overall result & sign-off",
		lede: "Pass means normal for mileage. Do not drive means park it. Pink/milky/sweet ATF cannot be a Pass. Neither can a pad at 1.0 mm, a rotor at min, a collapsed rest voltage, an ABS or airbag lamp that stays on, a pedal below spec, or an ongoing timing-cover rattle with low oil pressure.",
		factory: "Oil change 3,500–5,000 miles or 6 months. 15k: measured brakes, cabin filter, front end, battery, manifold soot. 30k: ATF drain/fill (pan/filter if due), diffs + transfer, brake fluid if 24 months, air filter, hoses, alignment if inner wear. Confirm fasteners in FSM SM5E-1T60U1. Hard gates auto-block Pass: SMOD; pad ≤ 1.0 mm; rotor ≤ min; rest V < 12.2; active ABS/airbag lamp; pedal < 3.5 in; ongoing timing rattle plus low oil pressure.",
		requires: "Date, miles, inspector on the header. Every inspected row has a status: Pass / Monitor / Needs attention / Repair ASAP / N/A. Overall circled. Fail items written. Next service miles written. Name and date. Score prints at the top of the form.",
		measure: "Read the fail items out loud. If a hard gate is open, overall is Do not drive. Pass and Pass with notes are blocked.",
		good: "No hard gates. Pass, or Pass with notes for watch items (dusty seeps, short cold rattle).",
		fail: "Do not drive: SMOD, pad at 1.0 mm, rotor at min, rest V collapsed, ABS/airbag lamp staying on, pedal below spec, ongoing timing rattle plus low oil pressure, brake leak, fuel leak, overheat. Schedule repairs: everything else that is not safe-to-ignore.",
		steps: [
			"Header complete. Fail items listed in plain language.",
			"If ATF is pink/milky/sweet: Do not drive. Never Pass.",
			"If a pad is ≤ 1.0 mm, a rotor is at min, rest V is collapsed, an ABS or airbag lamp is staying on, the pedal is below spec, or an ongoing timing rattle sits with low oil pressure: Do not drive. Never Pass.",
			"Write next oil / 15k / 30k miles. Sign name and date."
		]
	})
];
var CHAPTER_ALIASES = {
	caliper: "brakes.hoses",
	calipers: "brakes.hoses"
};
function findChapter(id) {
	const mapped = CHAPTER_ALIASES[id] ?? id;
	return GUIDE_CHAPTERS.find((c) => c.id === mapped);
}
function chapterSearchText(ch) {
	return [
		ch.id,
		ch.section,
		ch.title,
		ch.lede,
		ch.factory,
		ch.requires,
		ch.measure,
		ch.good,
		ch.fail,
		ch.searchExtra ?? "",
		...ch.steps
	].join(" ").toLowerCase();
}
function ChapterArticle({ ch, flash, onOpen }) {
	const plain = plainFor(ch.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: ch.id,
		className: cn("hud-card scroll-mt-44 space-y-3", flash ? "border-primary ring-1 ring-primary" : ""),
		children: [
			onOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onOpen,
				className: "block w-full text-left",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-balance text-foreground",
					children: ch.title
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold text-balance text-foreground",
				children: ch.title
			}),
			plain ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideDiagram, { kind: plain.diagram }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-pretty text-muted-foreground",
				children: plain?.what ?? ch.lede
			}),
			plain ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-pretty text-foreground",
					children: plain.where
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-foreground",
						children: "How-to"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "list-decimal space-y-2 pl-5 text-sm leading-relaxed text-pretty text-foreground",
						children: ch.steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, i))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideBlock, {
							heading: "Looks good",
							body: plain.looksGood,
							tone: "pass"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideBlock, {
							heading: "Needs a second look",
							body: plain.secondLook
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideBlock, {
							heading: "Stop / shop",
							body: plain.stopShop,
							tone: "fail"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideBlock, {
					heading: "Factory spec, in plain language",
					body: plain.specPlain
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs leading-snug text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: "Tools: "
					}), plain.tools]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "traveler-stamp text-xs text-primary",
					children: "Shop spec"
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold text-foreground",
					children: "How-to"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "list-decimal space-y-2 pl-5 text-sm leading-relaxed text-pretty text-foreground",
					children: ch.steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, i))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideBlock, {
				heading: "Factory spec",
				body: ch.factory
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideBlock, {
				heading: "What the factory requires",
				body: ch.requires
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideBlock, {
				heading: "How to read / measure",
				body: ch.measure
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideBlock, {
				heading: "Good",
				body: ch.good,
				tone: "pass"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideBlock, {
				heading: "Needs inspection / replace",
				body: ch.fail,
				tone: "fail"
			})
		]
	});
}
function GuideView() {
	const target = useInspection((s) => s.guideTarget);
	const focusId = useInspection((s) => s.guideFocus);
	const clearGuideTarget = useInspection((s) => s.clearGuideTarget);
	const clearGuideFocus = useInspection((s) => s.clearGuideFocus);
	const jumpToGuide = useInspection((s) => s.jumpToGuide);
	const setTab = useInspection((s) => s.setTab);
	const visit = useInspection((s) => s.draft.header.visitType);
	const drive = useInspection((s) => s.draft.header.drive);
	const plan = useInspection((s) => s.draft.header.plan);
	const [q, setQ] = (0, import_react.useState)("");
	const [flashId, setFlashId] = (0, import_react.useState)(null);
	const allowed = (0, import_react.useMemo)(() => new Set(visibleGuideIds(visit, drive, plan)), [
		visit,
		drive,
		plan
	]);
	const visitChapters = (0, import_react.useMemo)(() => GUIDE_CHAPTERS.filter((c) => allowed.has(c.id)), [allowed]);
	(0, import_react.useEffect)(() => {
		if (!target) return;
		setQ("");
		const id = findChapter(target)?.id ?? target;
		setFlashId(id);
		clearGuideTarget();
		const clear = window.setTimeout(() => setFlashId(null), 2200);
		return () => window.clearTimeout(clear);
	}, [target, clearGuideTarget]);
	const focused = focusId ? findChapter(focusId) : void 0;
	const chapters = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		if (!needle) return visitChapters;
		return visitChapters.filter((c) => chapterSearchText(c).includes(needle));
	}, [q, visitChapters]);
	const grouped = (0, import_react.useMemo)(() => {
		return GUIDE_SECTION_ORDER.map((section) => ({
			section,
			items: chapters.filter((c) => c.section === section)
		})).filter((g) => g.items.length > 0);
	}, [chapters]);
	const siblings = (0, import_react.useMemo)(() => {
		if (!focused) return [];
		return visitChapters.filter((c) => c.section === focused.section && c.id !== focused.id);
	}, [focused, visitChapters]);
	if (focused && !q.trim()) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTab("checklist"),
					className: "tap-44 flex flex-1 items-center justify-center gap-1 rounded border border-border bg-raised text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Checklist"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: clearGuideFocus,
					className: "tap-44 flex flex-1 items-center justify-center rounded border border-border bg-raised text-sm font-medium",
					children: "All how-tos"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "traveler-stamp px-1 text-xs text-primary",
				children: "How-to for this check"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChapterArticle, {
				ch: focused,
				flash: flashId === focused.id
			}),
			siblings.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium tracking-wide text-faint uppercase",
					children: ["Other checks in ", focused.section]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-1.5",
					children: siblings.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => jumpToGuide(s.id),
						className: "tap-44 rounded border border-border bg-raised px-3 text-left text-sm font-medium text-foreground",
						children: s.title
					}, s.id))
				})]
			}) : null
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5 pb-4",
		children: [
			focusId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: clearGuideFocus,
				className: "tap-44 text-sm font-medium text-muted-foreground",
				children: "Clear search · all how-tos"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "relative block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-3.5 left-3 size-5 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search this checklist’s How-To",
					className: "field-input pl-11 placeholder:text-faint"
				})]
			}),
			q.trim() ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "chip-row px-0.5",
				children: GUIDE_SECTION_ORDER.map((section) => {
					const first = visitChapters.find((c) => c.section === section);
					if (!first) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							const el = document.getElementById(first.id);
							if (!el) return;
							const offset = (document.querySelector("header")?.getBoundingClientRect().height ?? 180) + 20;
							el.style.scrollMarginTop = `${offset}px`;
							el.scrollIntoView({
								behavior: "auto",
								block: "start"
							});
						},
						className: "tap-44 shrink-0 rounded border border-border bg-raised px-3 font-mono text-xs font-medium tracking-wide text-muted-foreground",
						children: section
					}, section);
				})
			}),
			chapters.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Nothing matches that search."
			}) : null,
			grouped.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "traveler-stamp px-1 text-xs text-primary",
					children: g.section
				}), g.items.map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChapterArticle, {
					ch,
					flash: flashId === ch.id,
					onOpen: () => jumpToGuide(ch.id)
				}, ch.id))]
			}, g.section))
		]
	});
}
function GuideBlock({ heading, body, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("space-y-1 rounded p-3", tone === "pass" && "bg-pass-dim", tone === "fail" && "bg-fail-dim", !tone && "bg-inset"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
			children: heading
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-relaxed text-pretty text-foreground",
			children: body
		})]
	});
}
function SettingsSheet({ open, onClose }) {
	const settings = useInspection((s) => s.settings);
	const setSettings = useInspection((s) => s.setSettings);
	const archive = useInspection((s) => s.archive);
	const startNew = useInspection((s) => s.startNew);
	const restoreArchive = useInspection((s) => s.restoreArchive);
	const clearArchives = useInspection((s) => s.clearArchives);
	const clearMaint = useInspection((s) => s.clearMaint);
	const draft = useInspection((s) => s.draft);
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	if (!open) return null;
	function onStartNew() {
		if (isDraftStarted(draft)) {
			setConfirm("new");
			return;
		}
		startNew();
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overlay-frame flex flex-col bg-background/80 backdrop-blur-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "min-h-16 flex-1",
			"aria-label": "Close settings",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sheet-panel overflow-y-auto rounded-t-xl border-t border-border bg-raised p-4 pb-8 shadow-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Settings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "tap-56 grid place-items-center",
					"aria-label": "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-6" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Email goes out through Resend when you submit. Put the API key in Secrets. PDF still generates if email is not set up."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "To email",
						value: settings.toEmail,
						onChange: (v) => setSettings({ toEmail: v }),
						placeholder: "shop@example.com"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
						label: "CC",
						value: settings.ccEmail,
						onChange: (v) => setSettings({ ccEmail: v })
					}),
					confirm === "new" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 rounded border border-fail bg-fail-dim p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: "Archive this draft and start a new inspection?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmPair, {
							confirmLabel: "Start new",
							onCancel: () => setConfirm(null),
							onConfirm: () => {
								startNew();
								setConfirm(null);
								onClose();
							}
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onStartNew,
						className: "tap-56 w-full rounded border border-border bg-inset font-semibold",
						children: "Start new inspection"
					}),
					confirm === "maint" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 rounded border border-fail bg-fail-dim p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: "Clear the maintenance log for this truck? Inspections stay."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmPair, {
							confirmLabel: "Clear log",
							onCancel: () => setConfirm(null),
							onConfirm: () => {
								clearMaint();
								setConfirm(null);
							}
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setConfirm("maint"),
						className: "tap-56 w-full rounded border border-border bg-inset font-semibold text-fail",
						children: "Clear maintenance log"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "traveler-stamp mb-2 text-xs text-faint",
								children: "Last 10 drafts"
							}),
							archive.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "No archived drafts yet."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2",
								children: archive.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										restoreArchive(a.id);
										onClose();
									},
									className: "tap-56 w-full rounded border border-border bg-inset px-3 py-2 text-left text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block font-medium",
										children: [
											a.header.date || "No date",
											" · ",
											formatMiles(a.header.miles) || "—",
											" mi"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											a.header.inspector || "No inspector",
											" · ",
											formatStamp(a.updatedAt)
										]
									})]
								}) }, a.id))
							}),
							archive.length > 0 ? confirm === "archives" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-2 rounded border border-fail bg-fail-dim p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-foreground",
									children: "Clear archived drafts?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmPair, {
									confirmLabel: "Clear",
									onCancel: () => setConfirm(null),
									onConfirm: () => {
										clearArchives();
										setConfirm(null);
									}
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setConfirm("archives"),
								className: "tap-56 mt-3 w-full rounded border border-border font-semibold text-fail",
								children: "Clear archives"
							}) : null
						]
					})
				]
			})]
		})]
	});
}
var VISUAL_SEC = 45;
var MEASURE_SEC = 90;
var ROAD_LOOP_SEC = 180;
/** Measure / photo rows take longer than a glance. */
var MEASURE = /* @__PURE__ */ new Set([
	"pads",
	"rotors",
	"atf",
	"radiator",
	"atfLines",
	"oilLevel",
	"battery",
	"tread",
	"tireAge",
	"pressures",
	"pedalHeight",
	"coolant",
	"brake",
	"scan",
	"lugTorque",
	"engine.overview",
	"cabin.dash",
	"hoses",
	"master",
	"road.brakes",
	"baseline.sparkPlugs",
	"baseline.coolantService",
	"baseline.brakeFluid",
	"baseline.diffFluid",
	"baseline.seepage",
	"baseline.ucaJoints"
]);
function itemEstimateSec(id) {
	if (id === "transTable") return ROAD_LOOP_SEC;
	if (MEASURE.has(id)) return MEASURE_SEC;
	return VISUAL_SEC;
}
/** Inspector set a status (including Can’t inspect). Notes/photo alone do not count. */
function itemComplete(draft, id) {
	if (id === "result") return Boolean(draft.result.overall);
	return walkChoiceOf(draft, id) !== "";
}
function formatRemaining(sec, opts) {
	if (!opts.ready) return "—";
	if (opts.total <= 0) return "—";
	if (opts.done >= opts.total) return "Done";
	if (sec < 60) return "Less than 1 min";
	const min = Math.round(sec / 60);
	return min === 1 ? "1 min" : `${min} min`;
}
function inspectionProgress(draft) {
	const ready = headerComplete(draft.header);
	const visit = draft.header.visitType;
	const queue = visit ? walkQueue(visit, draft.header.drive, draft.header.plan, oilChangeMode(draft)) : [];
	const total = queue.length;
	let done = 0;
	let remainingSec = 0;
	for (const card of queue) if (itemComplete(draft, card.id)) done += 1;
	else remainingSec += itemEstimateSec(card.id);
	const percent = total ? Math.round(done / total * 100) : 0;
	const remainingLabel = formatRemaining(remainingSec, {
		ready,
		total,
		done
	});
	const line = total ? `${done} / ${total} complete — ${percent}%` : ready ? "0 / 0 complete" : "";
	const reportLine = !total ? "" : done >= total ? `Inspection ${done}/${total} complete` : `Inspection ${done}/${total} — unfinished items listed as Not inspected`;
	return {
		done,
		total,
		percent,
		remainingSec,
		remainingLabel,
		line,
		reportLine,
		ready
	};
}
var REPORT_TITLE = "2005 Nissan Armada Inspection Report";
function hasNumber(s) {
	return /\d/.test(s);
}
function plainLine(f) {
	const measured = (f.measured || "").trim();
	const range = (f.range || "").trim();
	if (f.id === "smod" || (f.id === "atf" || f.id === "atfReject") && /pink|milky|sweet/.test(measured)) return `Transmission cooling system requires attention (${measured || "ATF milky / sweet"} — SMOD risk)`;
	if (f.id === "smod.plan" || f.id === "smodPlan") {
		if (!measured || /original|unknown/.test(measured)) return "Original or unknown radiator — SMOD risk";
		return `${measured} — SMOD risk`;
	}
	if (hasNumber(measured) && range) return `${f.label}: ${measured} (${range})`;
	if (measured && measured !== "see checklist") return `${f.label} — ${measured}`;
	return f.label;
}
function gateLine(g) {
	return plainLine({
		id: g.id,
		label: g.label,
		measured: g.measured,
		range: g.range
	});
}
function isSmodish(id) {
	return id === "smod" || id === "smod.plan" || id === "smodPlan" || id === "atf" || id === "atfReject";
}
function critKey(id) {
	if (id === "smod") return "atf";
	if (id === "smod.plan") return "smodPlan";
	if (id.startsWith("pads.")) return "pads";
	if (id.startsWith("rotors.")) return "rotors";
	if (id === "battery.restV") return "battery";
	if (id === "timing.oil") return "timingCover";
	if (id === "airbag.lamp") return "cabin.airbag";
	if (id === "abs.lamps") return "absLamps";
	if (id === "pedalHeight") return "pedalHeight";
	return id;
}
function buildSummary(draft, photos = {}, history = [], log = []) {
	const snap = structuredClone(draft);
	applyAutoStatuses(snap, photos);
	const report = conditionReport(snap, photos, history);
	const gates = driveGates(snap);
	const h = snap.header;
	const seen = /* @__PURE__ */ new Set();
	const critical = [];
	const photoMap = photos;
	const withPhotos = (id, line, guideId) => {
		const p = plainFor(guideId);
		const meaning = p ? `${p.why} Good: ${p.good} Bad: ${p.bad}` : void 0;
		const grokLine = grokReportLine(suggestionForItem(snap.grokScan, id, photoSlotsForItem(id)));
		return {
			id,
			line,
			guideId,
			photos: photosForItem(id, photoMap),
			meaning,
			grokLine: grokLine || void 0
		};
	};
	const push = (id, line, guideId) => {
		const key = critKey(id);
		if (seen.has(key)) return;
		seen.add(key);
		critical.push(withPhotos(key, line, guideId));
	};
	for (const g of gates) push(g.id, gateLine(g), g.guideId);
	for (const f of report.asap) push(f.id, plainLine(f), f.guideId);
	for (const f of report.attention) if (isSmodish(f.id)) push(f.id, plainLine(f), f.guideId);
	const attention = report.attention.filter((f) => !seen.has(critKey(f.id)) && !isSmodish(f.id)).map((f) => withPhotos(f.id, plainLine(f), f.guideId));
	const monitor = report.monitor.map((f) => withPhotos(f.id, plainLine(f), f.guideId));
	const passed = report.passed.map((f) => withPhotos(f.id, f.label, f.guideId));
	const na = report.na.map((f) => withPhotos(f.id, f.label, f.guideId));
	const rec = buildPlan(snap, log);
	const current = parseMiles$1(h.miles);
	const maintRows = log.map((r) => ({
		service: serviceLabel(r),
		miles: r.miles.trim() ? formatMiles(r.miles) : "Unknown",
		date: r.date.trim() ? formatMaintDate(r.date) : "—",
		age: ageOf(r, current).label,
		photo: r.photo
	}));
	return {
		title: REPORT_TITLE,
		miles: formatMiles(h.miles),
		date: h.date,
		inspector: h.inspector.trim(),
		vin: h.vin.trim(),
		drive: h.drive,
		tow: h.towPkg === "Y" ? "Tow package" : h.towPkg === "N" ? "No tow package" : "",
		visit: visitLabel(h.visitType),
		planStamp: recStamp(rec),
		recLines: rec.lines,
		maintRows,
		maintFlags: rec.flags,
		maintDisclaimer: MAINT_DISCLAIMER,
		progressLine: inspectionProgress(snap).reportLine,
		score: report.score,
		counts: report.counts,
		critical,
		attention,
		monitor,
		passed,
		na,
		missingPhotos: missingRequiredPhotos(snap, photoMap),
		repairs: repairTable(snap)
	};
}
function dateLabel(iso) {
	return formatShortDate(iso) || iso;
}
/** Factory parts + torque for a 2005 Armada VK56DE / RE5R05A. One strip. Not memory. */
var PARTS_STRIP = {
	title: "FACTORY STRIP  ·  2005 Armada VK56DE / RE5R05A  ·  not memory",
	lines: [
		"Oil: Nissan 5W-30 full synthetic · 6.2 L / 6.5 qt with filter · new crush washer every drain",
		"ATF RE5R05A: Nissan Matic J (Matic S OK) · pan drain ~4-6 qt · dry fill 10.6 L / 11.25 qt · HOT ~149 F",
		"Brake: DOT 3, flush 24 mo · pads 12.0 mm new / 1.0 mm repair (review 3.0) · rotors F 28.0/26.0, R 14.0/12.0 mm",
		"Lugs: 98 ft-lb (133 N-m) star, dry threads · recheck after 50-100 mi"
	]
};
var MARGIN = 36;
var RIGHT = 576;
var WIDTH = 540;
var STRIP_H = 62;
var STRIP_TOP = 716;
var BOX = 9;
function ascii(s) {
	return s.replaceAll("→", "->").replaceAll("–", "-").replaceAll("—", "-").replaceAll("•", "-").replaceAll("½", " 1/2").replaceAll("¼", " 1/4").replaceAll("¾", " 3/4").replaceAll("°", " deg").replaceAll("’", "'").replaceAll("‘", "'").replaceAll("“", "\"").replaceAll("”", "\"");
}
function yn(v) {
	if (v === "Y") return "Y";
	if (v === "N") return "N";
	return "";
}
function dash(v) {
	const t = (v ?? "").trim();
	return t ? ascii(t) : "";
}
var Writer = class {
	doc;
	y = MARGIN;
	page = 1;
	photos;
	grok;
	constructor(photos, grok = {}) {
		this.doc = new import_jspdf_node_min.jsPDF({
			unit: "pt",
			format: "letter"
		});
		this.photos = photos;
		this.grok = grok;
	}
	footer() {
		this.doc.setDrawColor(120);
		this.doc.setLineWidth(.5);
		this.doc.rect(MARGIN, STRIP_TOP, WIDTH, STRIP_H);
		this.doc.setTextColor(50);
		this.doc.setFont("helvetica", "bold");
		this.doc.setFontSize(7);
		this.doc.text(ascii(PARTS_STRIP.title), 42, 727);
		this.doc.setFont("helvetica", "normal");
		this.doc.setFontSize(7);
		let y = 738;
		for (const line of PARTS_STRIP.lines) {
			this.doc.text(ascii(line), 42, y);
			y += 10;
		}
		this.doc.setFontSize(8);
		this.doc.setTextColor(90);
		this.doc.text(String(this.page), RIGHT, 784, { align: "right" });
		this.doc.setTextColor(0);
	}
	newPage() {
		this.footer();
		this.doc.addPage();
		this.page += 1;
		this.y = MARGIN;
	}
	ensure(h) {
		if (this.y + h > 708) this.newPage();
	}
	heading(t) {
		this.ensure(22);
		this.doc.setFont("helvetica", "bold");
		this.doc.setFontSize(12);
		this.doc.text(ascii(t), MARGIN, this.y);
		this.y += 16;
	}
	kv(k, v) {
		this.ensure(14);
		this.doc.setFont("helvetica", "normal");
		this.doc.setFontSize(9);
		this.doc.text(ascii(k), MARGIN, this.y);
		this.doc.text(dash(v) || "—", RIGHT, this.y, { align: "right" });
		this.y += 13;
	}
	note(t) {
		const s = dash(t);
		if (!s) return;
		this.ensure(24);
		this.doc.setFont("helvetica", "italic");
		this.doc.setFontSize(8);
		const lines = this.doc.splitTextToSize(s, WIDTH);
		this.doc.text(lines, MARGIN, this.y);
		this.y += lines.length * 11 + 4;
	}
	drawPhoto(shot, grokLine = "") {
		if (!shot?.dataUrl) return;
		const scale = Math.min(220 / Math.max(shot.w, 1), 120 / Math.max(shot.h, 1), 1);
		const w = Math.max(40, shot.w * scale);
		const h = Math.max(30, shot.h * scale);
		const extra = grokLine || "";
		this.ensure(h + (shot.caption || extra ? 32 : 10));
		try {
			this.doc.addImage(shot.dataUrl, "JPEG", MARGIN, this.y, w, h);
			this.y += h + 6;
		} catch {}
		if (shot.caption) {
			this.doc.setFont("helvetica", "italic");
			this.doc.setFontSize(8);
			const lines = this.doc.splitTextToSize(ascii(shot.caption), WIDTH);
			this.doc.text(lines, MARGIN, this.y);
			this.y += lines.length * 11 + 4;
		}
		if (extra) {
			this.doc.setFont("helvetica", "italic");
			this.doc.setFontSize(8);
			const lines = this.doc.splitTextToSize(ascii(extra), WIDTH);
			this.doc.text(lines, MARGIN, this.y);
			this.y += lines.length * 11 + 4;
		}
	}
	row(label, checked, extras, notes, photoSlot) {
		this.ensure(22);
		this.doc.setDrawColor(40);
		this.doc.rect(MARGIN, this.y - 8, BOX, BOX);
		if (checked) {
			this.doc.setFont("helvetica", "bold");
			this.doc.setFontSize(10);
			this.doc.text("X", 37.5, this.y);
		}
		this.doc.setFont("helvetica", "normal");
		this.doc.setFontSize(9);
		this.doc.text(ascii(label), 51, this.y);
		this.y += 14;
		for (const [k, v] of extras) {
			if (!dash(v)) continue;
			this.kv(k, v);
		}
		this.note(notes);
		const drawn = /* @__PURE__ */ new Set();
		const drawSlot = (slot) => {
			if (!slot || drawn.has(slot) || !shotOk(this.photos[slot])) return;
			drawn.add(slot);
			this.drawPhoto(this.photos[slot], this.grok[slot] || "");
		};
		drawSlot(photoSlot);
		const def = photoSlot ? photoSlotDef(photoSlot) : void 0;
		if (def) for (const p of photosForItem(def.itemId, this.photos)) drawSlot(p.slot);
	}
	bullet(text) {
		this.ensure(16);
		this.doc.setFont("helvetica", "normal");
		this.doc.setFontSize(9);
		const lines = this.doc.splitTextToSize("- " + ascii(text), WIDTH);
		this.doc.text(lines, MARGIN, this.y);
		this.y += lines.length * 12 + 2;
	}
	meaning(text) {
		if (!text) return;
		this.ensure(20);
		this.doc.setFont("helvetica", "italic");
		this.doc.setFontSize(8);
		const lines = this.doc.splitTextToSize(ascii(text), WIDTH);
		this.doc.text(lines, 44, this.y);
		this.y += lines.length * 11 + 4;
	}
	repairTable(rows) {
		if (!rows.length) return;
		this.heading("Repair priority and estimated cost");
		const cols = [
			MARGIN,
			184,
			258,
			354,
			466
		];
		const widths = [
			144,
			70,
			92,
			108,
			110
		];
		const header = [
			"Item",
			"Priority",
			"DIY",
			"Independent",
			"Dealer"
		];
		this.ensure(18);
		this.doc.setFont("helvetica", "bold");
		this.doc.setFontSize(8);
		header.forEach((h, i) => this.doc.text(h, cols[i], this.y));
		this.y += 12;
		this.doc.setDrawColor(160);
		this.doc.setLineWidth(.4);
		this.doc.line(MARGIN, this.y - 8, RIGHT, this.y - 8);
		for (const r of rows) {
			const pri = r.priority === "immediate" ? "Immediate" : r.priority === "soon" ? "Soon" : "Monitor";
			const wrapped = [
				ascii(r.title),
				pri,
				ascii(printRange(r.diy)),
				ascii(printRange(r.independent)),
				ascii(printDealer(r))
			].map((c, i) => this.doc.splitTextToSize(c, widths[i] - 4));
			const lines = Math.max(...wrapped.map((w) => w.length), 1);
			this.ensure(lines * 11 + 8);
			this.doc.setFont("helvetica", "normal");
			this.doc.setFontSize(8);
			wrapped.forEach((w, i) => this.doc.text(w, cols[i], this.y));
			this.y += lines * 11 + 4;
			if (r.note) {
				this.doc.setFont("helvetica", "italic");
				const note = this.doc.splitTextToSize(ascii(r.note), WIDTH);
				this.doc.text(note, MARGIN, this.y);
				this.y += note.length * 10 + 2;
			}
		}
		const totals = repairTotals(rows);
		this.ensure(22);
		this.doc.setFont("helvetica", "bold");
		this.doc.setFontSize(8);
		this.doc.text("Rough total (not a quote)", cols[0], this.y);
		this.doc.setFont("helvetica", "normal");
		this.doc.text(ascii(printRange(totals.diy)), cols[2], this.y);
		this.doc.text(ascii(printRange(totals.independent)), cols[3], this.y);
		this.doc.text(ascii(printRange(totals.dealer)), cols[4], this.y);
		this.y += 14;
		this.doc.setFont("helvetica", "italic");
		this.doc.setFontSize(8);
		this.doc.text(ESTIMATE_DISCLAIMER, MARGIN, this.y);
		this.y += 16;
	}
};
async function buildInspectionPdf(draft, photos, history = [], log = []) {
	const grok = {};
	for (const [id, g] of Object.entries(draft.grokScan ?? {})) {
		const line = grokReportLine(g);
		if (!line) continue;
		grok[id] = line;
		if (g.slot) grok[g.slot] = line;
	}
	const w = new Writer(photos, grok);
	const h = draft.header;
	const summary = buildSummary(draft, photos, history, log);
	w.doc.setFont("helvetica", "bold");
	w.doc.setFontSize(16);
	w.doc.text(ascii(REPORT_TITLE), MARGIN, w.y);
	w.y += 20;
	w.kv("Mileage", summary.miles);
	w.kv("Date", summary.date);
	w.kv("Inspector", summary.inspector);
	if (summary.vin) w.kv("VIN", summary.vin);
	if (summary.drive) w.kv("Drive", summary.drive);
	if (summary.tow) w.kv("Tow pkg", summary.tow);
	w.kv("Visit type", summary.visit);
	if (summary.maintRows.length) {
		w.heading("Maintenance history");
		for (const r of summary.maintRows) {
			if (r.photo) w.drawPhoto(r.photo);
			w.bullet(`${r.service} — ${r.miles} — ${r.date} (${r.age})`);
		}
		w.doc.setFont("helvetica", "italic");
		w.doc.setFontSize(8);
		w.doc.text(ascii(summary.maintDisclaimer), MARGIN, w.y);
		w.y += 14;
	}
	if (summary.maintFlags.length) {
		w.heading("Due / overdue");
		for (const f of summary.maintFlags) w.bullet((f.tone === "alert" ? "[SMOD] " : "[due] ") + f.text);
		w.y += 4;
	}
	if (summary.planStamp) {
		w.heading(summary.planStamp);
		for (const l of summary.recLines) if (l.tone === "skip") w.bullet("Skip / not due: " + l.label);
		else w.bullet((l.tone === "due" ? "[due] " : "[watch] ") + l.label);
		w.y += 4;
	}
	w.drawPhoto(photos["header.vin"]);
	w.y += 6;
	if (summary.progressLine) {
		w.doc.setFont("helvetica", "normal");
		w.doc.setFontSize(10);
		w.doc.text(ascii(summary.progressLine), MARGIN, w.y);
		w.y += 14;
	}
	w.heading("Vehicle condition score: " + summary.score + "/100");
	if (summary.missingPhotos.length) {
		w.heading("Missing required photos");
		for (const m of summary.missingPhotos) w.bullet(m.line);
		w.y += 4;
	}
	if (summary.critical.length) {
		w.heading("Critical items");
		for (const f of summary.critical) {
			for (const p of f.photos) w.drawPhoto(p.shot, f.grokLine || grok[p.slot] || grok[f.id] || "");
			w.bullet(f.line);
			w.meaning(f.meaning);
		}
		w.y += 4;
	}
	if (summary.attention.length) {
		w.heading("Recommended repairs");
		for (const f of summary.attention) {
			for (const p of f.photos) w.drawPhoto(p.shot, f.grokLine || grok[p.slot] || grok[f.id] || "");
			w.bullet(f.line);
			w.meaning(f.meaning);
		}
		w.y += 4;
	}
	if (summary.monitor.length) {
		w.heading("Monitor");
		for (const f of summary.monitor) {
			for (const p of f.photos) w.drawPhoto(p.shot, f.grokLine || grok[p.slot] || grok[f.id] || "");
			w.bullet(f.line);
			w.meaning(f.meaning);
		}
		w.y += 4;
	}
	w.repairTable(summary.repairs);
	w.heading("Passed");
	w.doc.setFont("helvetica", "normal");
	w.doc.setFontSize(9);
	w.doc.text(`${summary.counts.pass} items`, MARGIN, w.y);
	w.y += 16;
	w.newPage();
	w.doc.setFont("helvetica", "bold");
	w.doc.setFontSize(14);
	w.doc.text("Full checklist", MARGIN, w.y);
	w.y += 18;
	w.heading("1. Fluids");
	const f = draft.fluids;
	if (oilChangeMode(draft)) w.row("Oil change performed", f.oilLevel.checked, [
		["Type", draft.result.oilType],
		["Amount", draft.result.oilAmount],
		["Filter PN", draft.result.oilFilterPn],
		["Crush washer", yn(draft.result.crushWasher)]
	], oilChangeRecord(draft));
	else w.row("Engine oil level & condition", f.oilLevel.checked, [["Color / level", f.oilLevel.colorLevel], ["qt added", f.oilLevel.qtAdded]], f.oilLevel.notes);
	w.row("Engine oil leak check", f.oilLeak.checked, [], f.oilLeak.notes, "fluids.oilLeak");
	w.row("Coolant reservoir", f.coolant.checked, [
		["Level & color", f.coolant.levelColor],
		["Freeze point", f.coolant.freezeF],
		["Cap seated", yn(f.coolant.capSeated)]
	], f.coolant.notes, "fluids.coolant");
	w.row("ATF — dipstick HOT", f.atf.checked, [
		["In range", yn(f.atf.inRange)],
		["Color", f.atf.color],
		["Smell", f.atf.smell]
	], f.atf.notes, "fluids.atf");
	w.row("Power steering fluid", f.psf.checked, [["Level", f.psf.level], ["Color", f.psf.color]], f.psf.notes, "fluids.psf");
	w.row("Brake fluid", f.brake.checked, [
		["Level", f.brake.level],
		["Color", f.brake.color],
		["Moisture", f.brake.moisture],
		["Cap sealed", yn(f.brake.capSealed)]
	], f.brake.notes, "fluids.brake");
	w.row("Washer fluid", f.washer.checked, [], f.washer.notes, "fluids.washer");
	if (visitShows(h.visitType, "15k") && driveShows(h.drive, "4WD")) {
		w.row("Transfer case seep (4WD)", f.transferSeep.checked, [["Wetness", yn(f.transferSeep.wetness)]], f.transferSeep.notes, "fluids.transferSeep");
		w.row("Front differential seep (4WD)", f.frontDiffSeep.checked, [["Seep", yn(f.frontDiffSeep.seep)]], f.frontDiffSeep.notes, "fluids.frontDiffSeep");
	}
	if (visitShows(h.visitType, "15k")) w.row("Rear differential seep", f.rearDiffSeep.checked, [["Seep", yn(f.rearDiffSeep.seep)], ["Pinion", yn(f.rearDiffSeep.pinion)]], f.rearDiffSeep.notes, "fluids.rearDiffSeep");
	w.note(f.notes);
	w.newPage();
	w.heading("2. Engine bay");
	const e = draft.engine;
	w.drawPhoto(photos["engine.overview"]);
	w.row("Cold-start noise — timing cover", e.timingCover.checked, [
		["Noise", e.timingCover.noise],
		["Seconds", e.timingCover.seconds],
		["Oil pressure", e.timingCover.oilPressure]
	], e.timingCover.notes, "engine.timingCover");
	w.row("Exhaust manifolds", e.manifolds.checked, [["Noise", e.manifolds.noise], ["Soot", yn(e.manifolds.soot)]], e.manifolds.notes, "engine.manifolds");
	w.row("Idle quality", e.idle.checked, [["Quality", e.idle.quality], ["CEL", e.idle.cel]], e.idle.notes);
	w.row("Serpentine belt", e.belt.checked, [["Condition", e.belt.condition], ["Tensioner play", yn(e.belt.tensionerPlay)]], e.belt.notes, "engine.belt");
	w.row("Radiator tanks / hoses", e.radiator.checked, [["Seeping", yn(e.radiator.seeping)]], e.radiator.notes, "engine.radiator");
	w.row("ATF cooler lines at radiator", e.atfLines.checked, [
		["Connected", yn(e.atfLines.connected)],
		["Wet fittings", yn(e.atfLines.wetFittings)],
		["Bypass done", yn(e.atfLines.bypassDone)]
	], e.atfLines.notes, "engine.atfLines");
	w.row("Air filter", e.airFilter.checked, [["Condition", e.airFilter.condition], ["Cabin due", yn(e.airFilter.cabinDue)]], e.airFilter.notes, "engine.airFilter");
	w.row("Battery", e.battery.checked, [
		["Rest V", e.battery.restV],
		["Running V", e.battery.runningV],
		["Terminals", yn(e.battery.terminalsClean)],
		["Load", e.battery.loadTest]
	], e.battery.notes, "engine.battery");
	w.row("Ground straps", e.grounds.checked, [["Condition", e.grounds.condition]], e.grounds.notes, "engine.grounds");
	w.row("PCV hose / vacuum lines", e.pcv.checked, [["Condition", e.pcv.condition]], e.pcv.notes, "engine.pcv");
	if (rowShows("scan", h.visitType, h.drive, h.plan)) w.row("Scan tool", e.scan.checked, [
		["Stored", e.scan.stored],
		["Pending", e.scan.pending],
		["ATF temp", e.scan.atfTemp]
	], e.scan.notes);
	w.note(e.notes);
	w.newPage();
	w.heading("3. Transmission road check");
	if (rowShows("transTable", h.visitType, h.drive, h.plan)) for (const row of TRANS_ROWS) {
		if (row.key === "fourwd" && !driveShows(h.drive, "4WD")) continue;
		const v = draft.trans.rows[row.key];
		w.row(row.label, Boolean(v.cold || v.hot), [["Cold", v.cold], ["Hot", v.hot]], v.notes);
	}
	else w.note("Short loop — full cold/hot shift table is 15k / 30k.");
	w.row("ATF reject condition", draft.trans.atfReject, [], draft.trans.notes);
	w.newPage();
	w.heading("4. Brakes & rolling gear");
	const b = draft.brakes;
	w.row("Pad thickness", b.pads.checked, CORNERS.map((c) => [c.label + " mm", dash(b.pads[c.key])]), b.pads.notes);
	for (const c of CORNERS) w.drawPhoto(photos[`brakes.pads.${c.key}`]);
	const prior = priorWearVisit(draft, history);
	if (prior) {
		const cmp = wearCompare(draft, prior);
		w.note(wearStamp(cmp));
		for (const c of cmp.pads) {
			if (c.last == null && c.now == null) continue;
			w.note(wearLine(c, " mm", cmp.milesBetween));
		}
	}
	if (rowShows("rotors", h.visitType, h.drive, h.plan)) {
		w.row("Rotors", b.rotors.checked, [["Front", b.rotors.front], ["Rear", b.rotors.rear]], b.rotors.notes, "brakes.rotors");
		w.row("Brake hoses & lines", b.hoses.checked, [["Condition", b.hoses.condition], ["Wet caliper", yn(b.hoses.wetCaliper)]], b.hoses.notes, "brakes.hoses");
		w.row("Master cylinder / booster", b.master.checked, [["Seepage", yn(b.master.seepage)], ["Pedal firm", yn(b.master.pedalFirm)]], b.master.notes, "brakes.master");
		w.row("Pedal height", b.pedalHeight.checked, [["Measured", b.pedalHeight.measured]], b.pedalHeight.notes);
		w.row("Parking brake", b.parking.checked, [["Clicks", b.parking.clicks], ["Holds grade", yn(b.parking.holdsGrade)]], b.parking.notes);
	}
	w.row("ABS / SLIP / VDC lamps", b.absLamps.checked, [["State", b.absLamps.state]], b.absLamps.notes, "cabin.dash");
	w.row("Tires tread", b.tread.checked, CORNERS_SPARE.map((c) => [c.label, dash(b.tread[c.key])]), b.tread.notes);
	for (const c of CORNERS) w.drawPhoto(photos[`brakes.tread.${c.key}`]);
	if (prior) {
		const cmp = wearCompare(draft, prior);
		w.note(wearStamp(cmp));
		for (const c of cmp.tread) {
			if (c.last == null && c.now == null) continue;
			w.note(wearLine(c, "/32", cmp.milesBetween));
		}
	}
	w.row("Tire age", b.tireAge.checked, CORNERS_SPARE.map((c) => [c.label, dash(b.tireAge[c.key])]), b.tireAge.notes, "brakes.tireAge");
	w.row("Wear pattern", b.wear.checked, [["Pattern", b.wear.pattern]], b.wear.notes, "brakes.wear");
	w.row("Pressures", b.pressures.checked, CORNERS_SPARE.map((c) => [c.label, dash(b.pressures[c.key])]), b.pressures.notes);
	if (rowShows("lugTorque", h.visitType, h.drive, h.plan)) {
		w.row("Lug torque", b.lugTorque.checked, [["Rechecked", yn(b.lugTorque.rechecked)]], b.lugTorque.notes);
		w.row("Wheel bearings", b.bearings.checked, CORNERS.map((c) => [c.label, dash(b.bearings[c.key])]), b.bearings.notes);
		w.row("Alignment feel", b.alignment.checked, [["Feel", b.alignment.feel]], b.alignment.notes);
	}
	w.note(b.notes);
	const steeringRows = STEERING_ITEMS.filter((it) => rowShows(`steering.${it.key}`, h.visitType, h.drive, h.plan));
	if (steeringRows.length) {
		w.newPage();
		w.heading("5. Steering / driveline");
		for (const it of steeringRows) {
			const row = draft.steering.items[it.key];
			const label = it.key === "shafts" ? drivelineShaftLabel(h.drive) : it.label;
			w.row(label, row.checked, [], row.notes, "photo" in it && it.photo ? `steering.${it.key}` : void 0);
		}
		w.note(draft.steering.notes);
	}
	w.newPage();
	w.heading("6. Underbody");
	for (const it of UNDERBODY_ITEMS) {
		if (!rowShows(`underbody.${it.key}`, h.visitType, h.drive, h.plan)) continue;
		const row = draft.underbody.items[it.key];
		w.row(it.label, row.checked, [], row.notes, it.photo ? `underbody.${it.key}` : void 0);
	}
	w.note(draft.underbody.notes);
	w.newPage();
	w.heading("7. Cabin & safety");
	for (const it of CABIN_ITEMS) {
		if (!rowShows(`cabin.${it.key}`, h.visitType, h.drive, h.plan)) continue;
		const row = draft.cabin.items[it.key];
		const extras = it.key === "airbag" && draft.cabin.airbagLamp ? [["Lamp", draft.cabin.airbagLamp]] : [];
		w.row(it.label, row.checked, extras, row.notes, "photo" in it && it.photo ? `cabin.${it.key}` : void 0);
	}
	if (rowShows("cabin.recalls", h.visitType, h.drive, h.plan)) {
		const rec = draft.cabin.recalls;
		const extras = [];
		if (rec.checkedAt) extras.push(["Stamp", recallStamp(rec)]);
		for (const c of rec.campaigns) extras.push([c.id, c.component]);
		w.row("Nissan campaigns", rec.checked, extras, rec.notes);
	}
	w.note(draft.cabin.notes);
	w.newPage();
	w.heading("8. Final road test");
	for (const it of ROAD_ITEMS) {
		if (!rowShows(`road.${it.key}`, h.visitType, h.drive, h.plan)) continue;
		const row = draft.road.items[it.key];
		w.row(it.label, row.checked, it.key === "overheat" ? [["Gauge stable", yn(draft.road.gaugeStable)]] : [], row.notes);
	}
	w.note(draft.road.notes);
	if (rowShows("baseline", h.visitType, h.drive, h.plan)) {
		const pf = (v) => v === "pass" ? "Pass" : v === "fail" ? "Fail" : "—";
		const b = draft.baseline;
		w.newPage();
		w.heading("270k due — Pass/Fail");
		w.row("Spark plugs (105k iridium)", b.sparkPlugs.checked, [
			["Last miles", b.sparkPlugs.lastMiles],
			["Cycle", b.sparkPlugs.cycle],
			["Grade", pf(b.sparkPlugs.verdict)]
		], b.sparkPlugs.notes);
		w.row("Coolant service + cap + thermostat + weep", b.coolantService.checked, [
			["Last service", b.coolantService.lastService],
			["Cap", pf(b.coolantService.cap)],
			["Thermostat", pf(b.coolantService.thermostat)],
			["Pump weep", yn(b.coolantService.pumpWeep)],
			["Grade", pf(b.coolantService.verdict)]
		], b.coolantService.notes, "baseline.coolantService");
		w.row("Brake fluid (DOT 3)", b.brakeFluid.checked, [["Last flush", b.brakeFluid.lastFlush], ["Grade", pf(b.brakeFluid.verdict)]], b.brakeFluid.notes);
		w.row("Diff and transfer-case fluid", b.diffFluid.checked, [
			...h.drive === "2WD" ? [] : [["Transfer", pf(b.diffFluid.transfer)], ["Front diff", pf(b.diffFluid.front)]],
			["Rear diff", pf(b.diffFluid.rear)],
			["Grade", pf(b.diffFluid.verdict)]
		], b.diffFluid.notes);
		w.row("Seepage grade", b.seepage.checked, [
			["Valve covers", b.seepage.valveCover],
			["Timing cover", b.seepage.timingCover],
			["Oil pan", b.seepage.oilPan],
			["Grade", pf(b.seepage.verdict)]
		], b.seepage.notes, "baseline.seepage");
		w.row("Manifold / heat-shield bolts", b.manifoldBolts.checked, [["Grade", pf(b.manifoldBolts.verdict)]], b.manifoldBolts.notes, "baseline.manifoldBolts");
		w.row("UCAs / ball joints", b.ucaJoints.checked, [["Inner taper", yn(b.ucaJoints.innerTaper)], ["Grade", pf(b.ucaJoints.verdict)]], b.ucaJoints.notes, "baseline.ucaJoints");
		w.row("Rear load-leveling / air shocks", b.airShocks.checked, [["Equipped", yn(b.airShocks.equipped)], ["Grade", pf(b.airShocks.verdict)]], b.airShocks.notes, "baseline.airShocks");
		w.note(b.notes);
	}
	w.newPage();
	w.heading("9. Result");
	w.kv("Overall", overallLabel(draft.result.overall));
	w.note(draft.result.failItems);
	if (oilChangeMode(draft)) w.note(oilChangeRecord(draft));
	else w.kv("Oil change @", draft.result.oilChangeMi);
	w.kv("15k @", draft.result.service15kMi);
	w.kv("30k powertrain @", draft.result.service30kMi);
	if (rowShows("smodPlan", h.visitType, h.drive, h.plan)) {
		const p = draft.result.smodPlan;
		w.row("SMOD prevention", p.checked, [
			["Radiator last", p.radiatorLast === "replaced" ? p.radiatorDate || "replaced" : p.radiatorLast || "unknown"],
			["Bypass / external cooler", yn(draft.engine.atfLines.bypassDone)],
			["Cooler fittings photo", photos["engine.atfLines"] ? "Y" : "N"]
		], smodPlanRecord(draft), "engine.atfLines");
	}
	w.kv("Sign-off", draft.result.signName);
	w.kv("Sign date", draft.result.signDate);
	w.kv("Printed", formatStamp(Date.now()));
	w.footer();
	const blob = w.doc.output("blob");
	const miles = formatMiles(h.miles).replace(/,/g, "") || "miles";
	return {
		blob,
		filename: `armada-inspection-${h.date || "draft"}-${miles}.pdf`
	};
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
async function sharePdf(blob, filename) {
	const file = new File([blob], filename, { type: "application/pdf" });
	const nav = navigator;
	if (!nav.share) return false;
	try {
		if (nav.canShare && !nav.canShare({ files: [file] })) return false;
		await nav.share({
			files: [file],
			title: REPORT_TITLE
		});
		return true;
	} catch {
		return false;
	}
}
function emailSubject(draft) {
	const miles = formatMiles(draft.header.miles);
	return `${REPORT_TITLE} — ${draft.header.date} — ${miles} mi`;
}
async function printPdf(blob) {
	const url = URL.createObjectURL(blob);
	await new Promise((resolve) => {
		const iframe = document.createElement("iframe");
		iframe.setAttribute("aria-hidden", "true");
		iframe.style.position = "fixed";
		iframe.style.right = "0";
		iframe.style.bottom = "0";
		iframe.style.width = "0";
		iframe.style.height = "0";
		iframe.style.border = "0";
		iframe.src = url;
		const done = () => {
			setTimeout(() => {
				iframe.remove();
				URL.revokeObjectURL(url);
				resolve();
			}, 500);
		};
		iframe.onload = () => {
			try {
				iframe.contentWindow?.focus();
				iframe.contentWindow?.print();
			} catch {
				window.open(url, "_blank");
			}
			done();
		};
		document.body.appendChild(iframe);
	});
}
async function blobToBase64(blob) {
	const buf = await blob.arrayBuffer();
	const bytes = new Uint8Array(buf);
	let binary = "";
	for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
	return btoa(binary);
}
function escapeHtml(s) {
	return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function repairTableHtml(s) {
	if (!s.repairs.length) return "";
	const t = repairTotals(s.repairs);
	return `<h3>Repair priority and estimated cost</h3>
<table><thead><tr><th>Item</th><th>Priority</th><th>DIY</th><th>Independent</th><th>Dealer</th></tr></thead>
<tbody>${s.repairs.map((r) => `<tr><td>${escapeHtml(r.title)}</td><td>${escapeHtml(priorityLabel(r.priority))}</td><td>${escapeHtml(printRange(r.diy))}</td><td>${escapeHtml(printRange(r.independent))}</td><td>${escapeHtml(printDealer(r))}</td></tr>`).join("")}
<tr><td colspan="2">Rough total (not a quote)</td><td>${escapeHtml(printRange(t.diy))}</td><td>${escapeHtml(printRange(t.independent))}</td><td>${escapeHtml(printRange(t.dealer))}</td></tr>
</tbody></table>
<p>${escapeHtml(ESTIMATE_DISCLAIMER)}</p>`;
}
function list(title, items) {
	if (!items.length) return "";
	return `<h3>${escapeHtml(title)}</h3><ul>${items.map((i) => {
		const cap = i.photos?.map((p) => p.shot.caption).filter(Boolean).join("; ");
		const extra = "meaning" in i && i.meaning ? ` ${escapeHtml(i.meaning)}` : "";
		return `<li>${escapeHtml(i.line)}${cap ? ` — ${escapeHtml(cap)}` : ""}${extra}</li>`;
	}).join("")}</ul>`;
}
function inspectionEmailHtml(opts) {
	if (opts.summary) {
		const s = opts.summary;
		const meta = [
			s.vin ? `VIN: ${escapeHtml(s.vin)}` : "",
			s.drive ? `Drive: ${escapeHtml(s.drive)}` : "",
			s.tow ? escapeHtml(s.tow) : "",
			s.visit ? `Visit: ${escapeHtml(s.visit)}` : ""
		].filter(Boolean).join("<br/>");
		const rec = s.planStamp ? `<p><strong>${escapeHtml(s.planStamp)}</strong></p><ul>${s.recLines.map((l) => l.tone === "skip" ? `<li>Skip / not due: ${escapeHtml(l.label)}</li>` : `<li>${l.tone === "due" ? "✅" : "⚠️"} ${escapeHtml(l.label)}</li>`).join("")}</ul>` : "";
		const hist = s.maintRows.length ? `<h3>Maintenance history</h3>
<table><thead><tr><th>Service</th><th>Mileage</th><th>Date</th></tr></thead><tbody>${s.maintRows.map((r) => `<tr><td>${escapeHtml(r.service)}<br/><span>${escapeHtml(r.age)}</span></td><td>${escapeHtml(r.miles)}</td><td>${escapeHtml(r.date)}</td></tr>`).join("")}</tbody></table>
<p><em>${escapeHtml(s.maintDisclaimer)}</em></p>` : "";
		const due = s.maintFlags.length ? `<ul>${s.maintFlags.map((f) => `<li>${f.tone === "alert" ? "🔴" : "⚠️"} ${escapeHtml(f.text)}</li>`).join("")}</ul>` : "";
		return `<h2>${escapeHtml(s.title)}</h2>
<p>Mileage: ${escapeHtml(s.miles)}<br/>
Date: ${escapeHtml(s.date)}<br/>
Inspector: ${escapeHtml(s.inspector)}${meta ? `<br/>${meta}` : ""}</p>
${hist}
${due}
${rec}
${s.progressLine ? `<p>${escapeHtml(s.progressLine)}</p>` : ""}
<p><strong>Vehicle condition score: ${s.score}/100</strong></p>
${s.missingPhotos.length ? list("Missing required photos", s.missingPhotos) : ""}
${list("Critical items", s.critical)}
${list("Recommended repairs", s.attention)}
${list("Monitor", s.monitor)}
${repairTableHtml(s)}
<p><strong>Passed:</strong> ${s.counts.pass} items</p>
<p>Full checklist and marked photos are in the attached PDF (summary on page 1).</p>`;
	}
	const range = opts.rangeLines && opts.rangeLines.length ? `<p><strong>Out of range — review or technician follow-up</strong></p>
<ul>${opts.rangeLines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>` : "";
	return `<p>2005 Armada inspection attached.</p>
<p>Inspector: ${escapeHtml(opts.inspector)}<br/>
Date: ${escapeHtml(opts.date)}<br/>
Miles: ${escapeHtml(opts.miles)}<br/>
Result: ${escapeHtml(opts.overall)}</p>
${range}`;
}
var sendInspectionEmail = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("83c5bb32428c72ea023e44062d38763ee23edc8a2be80df20109991a824153ff"));
var EMAIL_COPY = {
	sent: "Emailed.",
	skipped: "No To address — add one below.",
	unconfigured: "Resend is not set up. PDF still works on this phone.",
	failed: "Email failed.",
	idle: ""
};
function Lines({ items, thumbs }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-3 text-sm leading-relaxed text-foreground",
		children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "space-y-2",
			children: [
				thumbs ? i.photos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.shot.dataUrl,
						alt: p.shot.caption || i.line,
						className: "max-h-36 w-full rounded border border-border object-cover"
					}),
					p.shot.caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-muted-foreground",
						children: p.shot.caption
					}) : null,
					i.grokLine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: i.grokLine
					}) : null
				] }, p.slot)) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["• ", i.line] }),
				i.meaning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted-foreground",
					children: i.meaning
				}) : null
			]
		}, i.id))
	});
}
function ReportView() {
	const open = useInspection((s) => s.successOpen);
	const status = useInspection((s) => s.lastEmailStatus);
	const err = useInspection((s) => s.lastEmailError);
	const keepEditing = useInspection((s) => s.keepEditing);
	const goHome = useInspection((s) => s.goHome);
	const startNew = useInspection((s) => s.startNew);
	const saveToHistory = useInspection((s) => s.saveToHistory);
	const markSubmitted = useInspection((s) => s.markSubmitted);
	const draft = useInspection((s) => s.draft);
	const photos = useInspection((s) => s.photos);
	const lastSubmitted = useInspection((s) => s.lastSubmitted);
	const archive = useInspection((s) => s.archive);
	const maint = useInspection((s) => s.maint);
	const settings = useInspection((s) => s.settings);
	const setSettings = useInspection((s) => s.setSettings);
	const [showPassed, setShowPassed] = (0, import_react.useState)(false);
	const [showNa, setShowNa] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)(true);
	const cache = (0, import_react.useRef)(null);
	const history = wearHistory(lastSubmitted, archive);
	const log = rowsForVin(maint, draft.header.vin);
	const summary = (0, import_react.useMemo)(() => buildSummary(draft, photos, history, log), [
		draft,
		photos,
		history,
		log
	]);
	const repairTotalsRow = repairTotals(summary.repairs);
	if (!open) return null;
	async function pdf() {
		if (cache.current) return cache.current;
		const built = await buildInspectionPdf(draft, photos, history, log);
		cache.current = built;
		return built;
	}
	async function run(label, fn) {
		setBusy(label);
		try {
			await fn();
		} finally {
			setBusy("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overlay-frame flex flex-col bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "app-scroll px-4 pt-4 pb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-xl space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "traveler-stamp text-xs text-primary",
						children: "VK56DE · RE5R05A"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold tracking-tight text-balance",
						children: summary.title
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "space-y-1 text-sm text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Mileage"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: summary.miles || "—" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: dateLabel(summary.date) || "—" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Inspector"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: summary.inspector || "—" })]
							}),
							summary.vin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "VIN"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-xs",
									children: summary.vin
								})]
							}) : null,
							summary.drive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Drive"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: summary.drive })]
							}) : null,
							summary.tow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Tow"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: summary.tow })]
							}) : null,
							summary.visit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Visit"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: summary.visit })]
							}) : null
						]
					}),
					summary.maintRows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hud-card space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "traveler-stamp text-xs text-primary",
								children: "Maintenance history"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-1 pr-2 font-medium",
												children: "Service"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-1 pr-2 font-medium",
												children: "Mileage"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-1 font-medium",
												children: "Date"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: summary.maintRows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "align-top",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-1 pr-2",
												children: [
													r.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: r.photo.dataUrl,
														alt: "",
														className: "mb-1 max-h-16 rounded border border-border object-cover"
													}) : null,
													r.service,
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "block text-xs text-muted-foreground",
														children: r.age
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-1 pr-2",
												children: r.miles
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-1",
												children: r.date
											})
										]
									}, i)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-snug text-muted-foreground",
								children: summary.maintDisclaimer
							})
						]
					}) : null,
					summary.maintFlags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1 text-sm",
						children: summary.maintFlags.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: f.tone === "alert" ? "text-fail" : "text-warn",
							children: [
								f.tone === "alert" ? "🔴" : "⚠️",
								" ",
								f.text
							]
						}, f.key))
					}) : null,
					summary.planStamp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hud-card space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "traveler-stamp text-xs text-primary",
							children: summary.planStamp
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-1 text-sm text-foreground",
							children: [summary.recLines.filter((l) => l.tone !== "skip").map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								l.tone === "due" ? "✅" : "⚠️",
								" ",
								l.label
							] }, l.key)), summary.recLines.filter((l) => l.tone === "skip").map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "text-muted-foreground",
								children: ["Skip / not due: ", l.label]
							}, l.key))]
						})]
					}) : null,
					summary.progressLine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: summary.progressLine
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hud-card space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "traveler-stamp text-xs text-primary",
							children: "Vehicle condition score"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "reading text-3xl text-primary",
							children: [summary.score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg text-muted-foreground",
								children: "/100"
							})]
						})]
					}),
					summary.missingPhotos.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "hud-alert-warn space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "traveler-stamp text-xs text-warn",
							children: "Missing required photos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1 text-sm text-foreground",
							children: summary.missingPhotos.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", m.line] }, m.slot))
						})]
					}) : null,
					summary.critical.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-fail",
							children: "🚨 Critical items"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lines, {
							items: summary.critical,
							thumbs: true
						})]
					}) : null,
					summary.attention.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-attention",
							children: "⚠️ Recommended repairs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lines, {
							items: summary.attention,
							thumbs: true
						})]
					}) : null,
					summary.monitor.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-warn",
							children: "👀 Monitor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lines, {
							items: summary.monitor,
							thumbs: true
						})]
					}) : null,
					summary.repairs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-foreground",
								children: "Repair priority and estimated cost"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full min-w-[28rem] text-left text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-1 pr-2 font-medium",
												children: "Item"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-1 pr-2 font-medium",
												children: "Priority"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-1 pr-2 font-medium",
												children: "DIY"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-1 pr-2 font-medium",
												children: "Independent"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-1 font-medium",
												children: "Dealer"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [summary.repairs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border align-top",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "py-2 pr-2",
												children: [r.title, r.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-xs text-muted-foreground",
													children: r.note
												}) : null]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2",
												children: priorityLabel(r.priority)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2",
												children: printRange(r.diy)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2",
												children: printRange(r.independent)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2",
												children: printDealer(r)
											})
										]
									}, r.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2",
												colSpan: 2,
												children: "Rough total (not a quote)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2",
												children: printRange(repairTotalsRow.diy)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2 pr-2",
												children: printRange(repairTotalsRow.independent)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-2",
												children: printRange(repairTotalsRow.dealer)
											})
										]
									})] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: ESTIMATE_DISCLAIMER
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-pass",
								children: "✅ Passed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-foreground",
								children: [summary.counts.pass, " items"]
							}),
							summary.passed.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "tap-44 text-sm font-medium text-primary",
								onClick: () => setShowPassed((v) => !v),
								children: showPassed ? "Hide passed items" : "Show passed items"
							}) : null,
							showPassed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lines, { items: summary.passed }) : null
						]
					}),
					summary.na.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "tap-44 text-sm font-medium text-muted-foreground",
							onClick: () => setShowNa((v) => !v),
							children: showNa ? "Hide not inspected / N/A" : `Not inspected / N/A — ${summary.counts.na} (show)`
						}), showNa ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lines, { items: summary.na }) : null]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "To email",
								value: settings.toEmail,
								onChange: (v) => setSettings({ toEmail: v }),
								placeholder: "shop@example.com"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "CC",
								value: settings.ccEmail,
								onChange: (v) => setSettings({ ccEmail: v })
							}),
							status !== "idle" || err ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [EMAIL_COPY[status] ?? "", status === "failed" && err ? ` ${err}` : ""]
							}) : null
						]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "submit-bar space-y-2 border-t border-border px-4 pt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: Boolean(busy),
							onClick: () => {
								saveToHistory();
								setSaved(true);
							},
							className: "tap-44 rounded border border-border bg-inset text-sm font-medium",
							children: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-pass" }), " Saved"]
							}) : "Save report"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: Boolean(busy),
							onClick: () => void run("print", async () => printPdf((await pdf()).blob)),
							className: "tap-44 rounded border border-border bg-inset text-sm font-medium",
							children: busy === "print" ? "Printing…" : "Print report"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: Boolean(busy),
							onClick: () => void run("download", async () => {
								const p = await pdf();
								downloadBlob(p.blob, p.filename);
							}),
							className: "tap-44 rounded border border-border bg-inset text-sm font-medium",
							children: busy === "download" ? "Building…" : "Download PDF"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: Boolean(busy),
							onClick: () => void run("share", async () => {
								const p = await pdf();
								if (!await sharePdf(p.blob, p.filename)) downloadBlob(p.blob, p.filename);
							}),
							className: "tap-44 rounded border border-border bg-inset text-sm font-medium",
							children: busy === "share" ? "Sharing…" : "Share report"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: Boolean(busy),
					onClick: () => void run("email", async () => {
						const to = settings.toEmail.trim();
						if (!to) {
							markSubmitted("skipped");
							return;
						}
						try {
							const p = await pdf();
							const res = await sendInspectionEmail({ data: {
								to,
								cc: settings.ccEmail,
								subject: emailSubject(draft),
								html: inspectionEmailHtml({
									inspector: draft.header.inspector,
									date: draft.header.date,
									miles: formatMiles(draft.header.miles),
									overall: overallLabel(draft.result.overall),
									summary
								}),
								filename: p.filename,
								pdfBase64: await blobToBase64(p.blob)
							} });
							markSubmitted(res.status);
						} catch (e) {
							markSubmitted("failed", e instanceof Error ? e.message : "Email failed");
						}
					}),
					className: "tap-44 w-full rounded bg-primary font-mono text-sm font-semibold tracking-widest uppercase text-primary-foreground",
					children: busy === "email" ? "Sending…" : "Email report"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							keepEditing();
							goHome();
						},
						className: "tap-44 rounded border border-border bg-inset text-sm font-medium",
						children: "Keep editing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (isDraftStarted(draft) && !window.confirm("Archive this draft and start a new inspection?")) return;
							startNew();
						},
						className: "tap-44 rounded border border-border bg-inset text-sm font-medium",
						children: "Start new"
					})]
				})
			]
		})]
	});
}
function ProgressMeter({ etaPrefix = "Estimated time remaining" }) {
	const draft = useInspection((s) => s.draft);
	const mode = useInspection((s) => s.checklistMode);
	const tab = useInspection((s) => s.tab);
	const walkIndex = useInspection((s) => s.walkIndex);
	const p = inspectionProgress(draft);
	const walking = tab === "checklist" && mode === "walk" && p.total > 0;
	const step = walking ? Math.min(walkIndex, Math.max(0, p.total - 1)) + 1 : 0;
	const width = p.total ? p.percent : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "traveler-stamp text-xs text-primary",
					children: "Inspection progress"
				}), walking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs text-muted-foreground",
					children: [
						"Step ",
						step,
						" of ",
						p.total
					]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "progress-meter",
				role: "progressbar",
				"aria-label": "Inspection progress",
				"aria-valuemin": 0,
				"aria-valuemax": p.total || 0,
				"aria-valuenow": p.done,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("progress-meter-fill"),
					style: { width: `${width}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "reading text-sm text-primary",
					children: p.total ? p.line : p.ready ? "0 / 0 complete" : "—"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs leading-snug text-muted-foreground",
					children: [
						etaPrefix,
						": ",
						p.remainingLabel
					]
				})]
			})
		]
	});
}
var WORRY = {
	idle: {
		emoji: "⚪",
		label: "Not started",
		line: "No statuses set yet."
	},
	pass: {
		emoji: "🟢",
		label: "Pass",
		line: "No Repair ASAP or Needs attention."
	},
	watch: {
		emoji: "🟡",
		label: "Needs attention",
		line: "Monitor items — no Immediate / Repair ASAP."
	},
	repairs: {
		emoji: "🟠",
		label: "Repairs needed",
		line: "Needs attention is on the list."
	},
	critical: {
		emoji: "🔴",
		label: "Critical",
		line: "Repair ASAP, SMOD, or Do not drive."
	}
};
var RESULT_CONDITION = {
	incomplete: {
		emoji: "⚪",
		label: "INCOMPLETE",
		line: "In-visit items still Not inspected."
	},
	pass: {
		emoji: "🟢",
		label: "PASS",
		line: "No Repair ASAP or Needs attention."
	},
	watch: {
		emoji: "🟡",
		label: "ATTENTION REQUIRED",
		line: "Monitor / close to spec."
	},
	repairs: {
		emoji: "🟠",
		label: "REPAIRS RECOMMENDED",
		line: "Needs attention on this visit."
	},
	critical: {
		emoji: "🔴",
		label: "CRITICAL / DO NOT DRIVE",
		line: "Repair ASAP, SMOD, or a do-not-drive gate."
	}
};
function worryOf(draft, report, done) {
	const gates = driveGates(draft);
	if (done === 0) return {
		tone: "idle",
		...WORRY.idle
	};
	if (report.counts.asap > 0 || gates.length > 0 || isSmodRisk(draft)) return {
		tone: "critical",
		...WORRY.critical
	};
	if (report.counts.attention > 0) return {
		tone: "repairs",
		...WORRY.repairs
	};
	if (report.counts.monitor > 0) return {
		tone: "watch",
		...WORRY.watch
	};
	return {
		tone: "pass",
		...WORRY.pass
	};
}
function queueOf(draft) {
	const visit = draft.header.visitType;
	if (!visit) return [];
	return walkQueue(visit, draft.header.drive, draft.header.plan, oilChangeMode(draft));
}
function firstIncompleteIndex(draft) {
	const q = queueOf(draft);
	const i = q.findIndex((c) => !itemComplete(draft, c.id));
	return i < 0 ? Math.max(0, q.length - 1) : i;
}
function stepPhrase(card, oilChange) {
	if (card.id === "oilLevel") return oilChange ? "record oil change" : "check engine oil";
	if (card.id === "atf" || card.id === "atfLines" || card.id === "radiator" || card.id === "atfReject") return "inspect transmission cooling system (ATF cooler / radiator)";
	const t = card.shopTitle.trim();
	if (!t) return "continue";
	return t.charAt(0).toLowerCase() + t.slice(1);
}
function startHint(draft, log) {
	const miles = formatMiles(draft.header.miles) || draft.header.miles.trim();
	if (!miles) return "Enter miles to recommend the inspection set.";
	const due = buildPlan(draft, log).lines.filter((l) => l.tone === "due" || l.tone === "watch");
	const oil = due.some((l) => l.key === "fluids");
	const brakes = due.some((l) => l.key === "brakes" || l.key === "tires");
	const smod = due.some((l) => l.key === "cooling" || l.key === "trans");
	const bits = [];
	if (oil) bits.push("Oil");
	if (brakes) bits.push("brakes");
	if (smod) bits.push("SMOD check");
	if (!bits.length) bits.push("A short look-over");
	return `${bits.length === 1 ? bits[0] : bits.length === 2 ? `${bits[0]} and ${bits[1]}` : `${bits[0]}, ${bits[1]}, and ${bits[2]}`} recommended at ${miles} miles.`;
}
function jumpForId(draft, id) {
	const q = queueOf(draft);
	const rid = id.startsWith("trans.") ? "transTable" : id === "header" ? "" : id;
	if (!rid) return 0;
	const i = q.findIndex((c) => c.id === rid || c.id === id);
	return i < 0 ? null : i;
}
function visitItemStatus(draft, id) {
	if (id === "result") {
		const o = draft.result?.overall;
		if (!o) return "unset";
		if (o === "do-not-drive") return "asap";
		if (o === "schedule") return "attention";
		if (o === "pass-notes") return "monitor";
		return "pass";
	}
	const cur = draft.itemStatus?.[id];
	if (!cur) return "unset";
	if (!cur.manual && cur.value === "na") return "unset";
	return cur.value;
}
function smodDriveNow(draft) {
	if (isSmodRisk(draft)) return true;
	return draft.engine?.atfLines?.wetFittings === "Y";
}
function nextAction(draft, photos = {}, log = []) {
	const oilChange = oilChangeMode(draft);
	const q = queueOf(draft);
	const progress = inspectionProgress(draft);
	const gates = driveGates(draft);
	if (isSmodRisk(draft) || gates.some((g) => g.id === "smod" || g.guideId.includes("atf"))) return {
		text: "Inspect transmission cooling system (ATF cooler / radiator)",
		walkIndex: jumpForId(draft, "atf") ?? jumpForId(draft, "atfLines")
	};
	const stop = gates[0];
	if (stop) {
		const idx = jumpForId(draft, stop.guideId) ?? firstIncompleteIndex(draft);
		const card = q[idx];
		return {
			text: card ? `Continue inspection — Step ${idx + 1}, ${stepPhrase(card, oilChange)}` : stop.label,
			walkIndex: idx
		};
	}
	const missing = missingRequiredPhotos(draft, photos).filter((m) => m.slot !== "header.vin");
	if (progress.done > 0 && missing[0]) {
		const slot = missing[0].slot;
		const def = PHOTO_SLOTS.find((s) => s.slot === slot);
		return {
			text: `Take required photo: ${missing[0].label.replace(/ photo$/i, "").toLowerCase()}`,
			walkIndex: jumpForId(draft, def?.itemId ?? slot) ?? firstIncompleteIndex(draft)
		};
	}
	const smodOn = rowShows("smodPlan", draft.header.visitType, draft.header.drive, draft.header.plan);
	const rad = draft.result?.smodPlan?.radiatorLast ?? "";
	const radUnknown = smodOn && (rad === "" || rad === "original");
	if (!progress.done) return {
		text: startHint(draft, log),
		walkIndex: q.length ? 0 : 0
	};
	if (radUnknown) return {
		text: "Log radiator history — unknown replacement",
		walkIndex: jumpForId(draft, "smodPlan")
	};
	const idx = firstIncompleteIndex(draft);
	const card = q[idx];
	if (!card || card.id === "result") return {
		text: "Finish Result and save report",
		walkIndex: Math.max(0, q.length - 1)
	};
	if (card.id === "oilLevel" && oilChange) return {
		text: `Continue inspection — Step ${idx + 1}, record oil change`,
		walkIndex: idx
	};
	return {
		text: `Continue inspection — Step ${idx + 1}, ${stepPhrase(card, oilChange)}`,
		walkIndex: idx
	};
}
function meaningOf(guideId, fallback) {
	const p = guideId ? plainFor(guideId) : void 0;
	if (!p) return fallback;
	return (p.why || p.what || fallback).split(/(?<=\.)\s/)[0] ?? fallback;
}
function lineFromCard(draft, card, photos, report) {
	const st = visitItemStatus(draft, card.id);
	const flag = [
		...report.asap,
		...report.attention,
		...report.monitor,
		...report.passed,
		...report.na
	].find((f) => f.id === card.id);
	const guideId = flag?.guideId || walkRowGuideId(card.id) || "";
	const label = card.shopTitle || STATUS_ROW_LABELS[card.id] || card.id;
	return {
		id: card.id,
		label,
		status: st,
		measured: flag?.measured && flag.measured !== "see checklist" ? flag.measured : "",
		range: flag?.range && !/on the Guide/i.test(flag.range) ? flag.range : "",
		guideId,
		meaning: meaningOf(guideId, label),
		photos: photosForItem(card.id, photos),
		grokLine: grokReportLine(suggestionForItem(draft.grokScan, card.id, photoSlotsForItem(card.id)))
	};
}
function visitLists(draft, photos, report) {
	const lists = {
		asap: [],
		attention: [],
		monitor: [],
		pass: [],
		na: []
	};
	for (const card of queueOf(draft)) {
		if (card.id === "result") continue;
		const st = visitItemStatus(draft, card.id);
		const line = lineFromCard(draft, card, photos, report);
		if (st === "unset" || st === "na" || st === "unable") lists.na.push(line);
		else if (st === "asap") lists.asap.push(line);
		else if (st === "attention") lists.attention.push(line);
		else if (st === "monitor") lists.monitor.push(line);
		else lists.pass.push(line);
	}
	if (isSmodRisk(draft) && !lists.asap.some((l) => l.id === "atf" || l.id === "atfLines" || l.id === "smodPlan")) {
		const atf = queueOf(draft).find((c) => c.id === "atf" || c.id === "atfLines" || c.id === "smodPlan");
		if (atf && !lists.asap.some((l) => l.id === atf.id)) {
			lists.asap.push(lineFromCard(draft, atf, photos, report));
			lists.pass = lists.pass.filter((l) => l.id !== atf.id);
			lists.na = lists.na.filter((l) => l.id !== atf.id);
			lists.attention = lists.attention.filter((l) => l.id !== atf.id);
			lists.monitor = lists.monitor.filter((l) => l.id !== atf.id);
		}
	}
	return lists;
}
function resultToneOf(lists, draft) {
	if (lists.na.some((l) => l.status === "unset")) return "incomplete";
	if (lists.asap.length || driveGates(draft).length || isSmodRisk(draft)) return "critical";
	if (lists.attention.length) return "repairs";
	if (lists.monitor.length) return "watch";
	return "pass";
}
function resultsNextAction(draft, lists, photos, log, tone) {
	const oilChange = oilChangeMode(draft);
	const q = queueOf(draft);
	if (tone === "incomplete") {
		const idx = firstIncompleteIndex(draft);
		const card = q[idx];
		return {
			text: `Finish Walk — ${card ? stepPhrase(card, oilChange) : "the next item"}`,
			walkIndex: idx
		};
	}
	if (smodDriveNow(draft) || lists.asap.some((l) => l.id === "atf" || l.id === "atfLines" || l.id === "smodPlan" || l.id === "radiator")) return {
		text: smodDriveNow(draft) ? "Do not keep driving until a shop confirms SMOD. Transmission cooling system protection should be addressed first." : "Transmission cooling system protection should be addressed first.",
		walkIndex: jumpForId(draft, "atf") ?? jumpForId(draft, "atfLines")
	};
	if (lists.asap[0]) return {
		text: `${lists.asap[0].label} should be addressed first.`,
		walkIndex: jumpForId(draft, lists.asap[0].id)
	};
	if (lists.attention[0]) return {
		text: `${lists.attention[0].label} should be repaired at the next service.`,
		walkIndex: jumpForId(draft, lists.attention[0].id)
	};
	const missing = missingRequiredPhotos(draft, photos).filter((m) => m.slot !== "header.vin");
	if (missing[0]) {
		const def = PHOTO_SLOTS.find((s) => s.slot === missing[0].slot);
		return {
			text: `Take required photo: ${missing[0].label.replace(/ photo$/i, "").toLowerCase()}`,
			walkIndex: jumpForId(draft, def?.itemId ?? missing[0].slot)
		};
	}
	const plan = buildPlan(draft, log);
	if (plan.flags.find((f) => f.key === "smod-history")) return {
		text: "Log radiator history — unknown replacement",
		walkIndex: jumpForId(draft, "smodPlan")
	};
	const spark = plan.flags.find((f) => f.key === "spark");
	if (spark) return {
		text: spark.text,
		walkIndex: jumpForId(draft, "baseline.sparkPlugs")
	};
	return {
		text: "No open items. Save and share the report.",
		walkIndex: null
	};
}
function walkIndexForFlag(draft, id) {
	return jumpForId(draft, id) ?? firstIncompleteIndex(draft);
}
function visitScore(lists) {
	return Math.max(0, Math.min(100, 100 - 15 * lists.asap.length - 6 * lists.attention.length - 2 * lists.monitor.length));
}
function homeModel(draft, photos = {}, log = [], submitted = false) {
	const progress = inspectionProgress(draft);
	const report = conditionReport(draft, photos);
	const lists = visitLists(draft, photos, report);
	const h = draft.header;
	const incomplete = resultToneOf(lists, draft) === "incomplete";
	return {
		miles: formatMiles(h.miles) || h.miles.trim(),
		date: h.date,
		inspector: h.inspector.trim(),
		visit: visitLabel(h.visitType) || (h.miles.trim() ? "Recommended from mileage" : ""),
		vin: h.vin.trim(),
		drive: h.drive,
		tow: h.towPkg === "Y" ? "Tow package" : h.towPkg === "N" ? "No tow" : "",
		worry: worryOf(draft, report, progress.done),
		score: progress.done ? visitScore(lists) : null,
		progress,
		counts: {
			asap: lists.asap.length,
			attention: lists.attention.length,
			monitor: lists.monitor.length,
			pass: lists.pass.length,
			na: lists.na.length
		},
		lists,
		next: nextAction(draft, photos, log),
		started: progress.done > 0,
		submitted,
		incomplete,
		repairs: repairTable(draft),
		maintFlags: buildPlan(draft, log).flags
	};
}
function resultsModel(draft, photos = {}, log = [], submitted = false) {
	const base = homeModel(draft, photos, log, submitted);
	const tone = resultToneOf(base.lists, draft);
	return {
		...base,
		tone,
		condition: RESULT_CONDITION[tone],
		score: visitScore(base.lists),
		next: resultsNextAction(draft, base.lists, photos, log, tone)
	};
}
var COUNT_TILES = [
	{
		key: "asap",
		emoji: "🚨",
		label: "Critical issues"
	},
	{
		key: "attention",
		emoji: "⚠️",
		label: "Recommended repairs"
	},
	{
		key: "monitor",
		emoji: "👀",
		label: "Monitor"
	},
	{
		key: "pass",
		emoji: "✅",
		label: "Passed"
	}
];
var TONE_CLASS$1 = {
	idle: "border-border text-muted-foreground",
	pass: "border-pass text-pass",
	watch: "border-warn text-warn",
	repairs: "border-attention text-attention",
	critical: "border-fail text-fail"
};
function HomeView() {
	const draft = useInspection((s) => s.draft);
	const photos = useInspection((s) => s.photos);
	const maint = useInspection((s) => s.maint);
	const lastSubmitted = useInspection((s) => s.lastSubmitted);
	const highlight = useInspection((s) => s.headerHighlight);
	const filter = useInspection((s) => s.homeFilter);
	const setFilter = useInspection((s) => s.setHomeFilter);
	const openWalk = useInspection((s) => s.openWalk);
	const openFull = useInspection((s) => s.openFull);
	const openResults = useInspection((s) => s.openResults);
	const setTab = useInspection((s) => s.setTab);
	const patch = useInspection((s) => s.patch);
	const collapseAll = useInspection((s) => s.collapseAll);
	const log = rowsForVin(maint, draft.header.vin);
	const model = homeModel(draft, photos, log, Boolean(lastSubmitted && lastSubmitted.id === draft.id));
	function ensureVisit() {
		if (draft.header.visitType) return;
		const plan = buildPlan(draft, log);
		patch((d) => {
			d.header.visitType = "recommended";
			d.header.plan = flagsFromPlan(plan);
		});
	}
	function startOrContinue() {
		ensureVisit();
		collapseAll();
		openWalk(model.next.walkIndex ?? 0);
	}
	function force(v) {
		patch((d) => {
			d.header.visitType = v;
			d.header.plan = v === "recommended" ? flagsFromPlan(buildPlan(d, log)) : null;
		});
	}
	const bits = [
		model.miles ? `${model.miles} miles` : null,
		model.date ? formatShortDate(model.date) : null,
		model.visit || null
	].filter(Boolean);
	const meta = [
		model.vin,
		model.drive,
		model.tow
	].filter(Boolean).join(" · ");
	if (filter) {
		const list = model.lists[filter];
		const tile = COUNT_TILES.find((t) => t.key === filter);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilter(null),
					className: "tap-56 text-sm font-semibold text-primary",
					children: "← Dashboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-lg font-semibold",
					children: [
						tile.emoji,
						" ",
						tile.label
					]
				}),
				list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setFilter(null);
							collapseAll();
							openWalk(walkIndexForFlag(draft, item.id));
						},
						className: "hud-card flex w-full items-center justify-between gap-2 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: item.label
							}), item.measured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: item.measured
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 shrink-0 text-muted-foreground" })]
					}) }, item.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "None on this visit."
				})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hud-card space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl leading-none",
						children: "🚙"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold tracking-tight",
						children: "2005 Nissan Armada"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: bits.length ? bits.join(" · ") : "Fill date, miles, inspector"
					}),
					meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-faint",
						children: meta
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("hud-card space-y-1 border-l-4", TONE_CLASS$1[model.worry.tone]),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "traveler-stamp text-xs",
						children: "Overall condition"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-lg font-semibold",
						children: [
							model.worry.emoji,
							" ",
							model.worry.label
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-foreground",
						children: model.worry.line
					}),
					model.score != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "reading text-sm text-muted-foreground",
						children: [
							"Vehicle condition score ",
							model.score,
							"/100"
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hud-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressMeter, { etaPrefix: "Est. time left" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: COUNT_TILES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setFilter(t.key),
					className: "hud-card tap-56 space-y-0.5 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							t.emoji,
							" ",
							t.label
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "reading text-lg text-primary",
						children: model.counts[t.key]
					})]
				}, t.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hud-card space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "traveler-stamp text-xs text-primary",
					children: "Next recommended action"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base font-medium leading-snug text-pretty",
					children: model.next.text
				})]
			}),
			model.submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => openResults(),
				className: "tap-56 w-full rounded bg-primary font-semibold text-primary-foreground",
				children: "View results"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: startOrContinue,
				className: "tap-56 w-full rounded bg-primary font-semibold text-primary-foreground",
				children: model.started ? "Continue inspection" : "Start Walk the Truck"
			}),
			model.started && !model.submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => openResults(),
				className: "tap-56 w-full rounded border border-border bg-raised font-semibold",
				children: model.incomplete ? "View results (incomplete)" : "View results"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => openFull(),
						className: "tap-56 rounded border border-border bg-inset text-sm font-semibold",
						children: "Full checklist"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab("history"),
						className: "tap-56 rounded border border-border bg-inset text-sm font-semibold",
						children: "History"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab("reports"),
						className: "tap-56 rounded border border-border bg-inset text-sm font-semibold",
						children: "Saved reports"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "hud-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "tap-56 cursor-pointer font-semibold",
					children: "Vehicle"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 pt-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeaderFields, { highlight }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "field-label",
							children: "Visit type"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => force("recommended"),
								className: cn("tap-56 rounded border px-3 font-mono text-xs font-medium", draft.header.visitType === "recommended" ? "chip-on" : "chip-off text-foreground"),
								children: "From mileage"
							}), VISIT_TYPES.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => force(v.value),
								className: cn("tap-56 rounded border px-3 font-mono text-xs font-medium", draft.header.visitType === v.value ? "chip-on" : "chip-off text-foreground"),
								children: v.label
							}, v.value))]
						})
					]
				})]
			})
		]
	});
}
function HistoryView() {
	const goHome = useInspection((s) => s.goHome);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: goHome,
				className: "tap-44 text-sm font-medium text-primary",
				children: "← Dashboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Maintenance history"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaintLog, {})
		]
	});
}
function ReportsView() {
	const goHome = useInspection((s) => s.goHome);
	const archive = useInspection((s) => s.archive);
	const restore = useInspection((s) => s.restoreArchive);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: goHome,
				className: "tap-44 text-sm font-medium text-primary",
				children: "← Dashboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold",
				children: "Saved reports"
			}),
			archive.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: archive.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => restore(d.id),
					className: "hud-card flex w-full flex-col items-start gap-0.5 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-medium",
						children: [
							formatMiles(d.header.miles) || "—",
							" mi · ",
							formatShortDate(d.header.date) || "—"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [
							visitLabel(d.header.visitType) || "Inspection",
							" · ",
							d.header.inspector || "—"
						]
					})]
				}) }, d.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No saved reports on this phone yet."
			})
		]
	});
}
function ReportActions({ compact }) {
	const draft = useInspection((s) => s.draft);
	const photos = useInspection((s) => s.photos);
	const lastSubmitted = useInspection((s) => s.lastSubmitted);
	const archive = useInspection((s) => s.archive);
	const maint = useInspection((s) => s.maint);
	const settings = useInspection((s) => s.settings);
	const saveToHistory = useInspection((s) => s.saveToHistory);
	const markSubmitted = useInspection((s) => s.markSubmitted);
	const openReport = useInspection((s) => s.openReport);
	const [busy, setBusy] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)(true);
	const cache = (0, import_react.useRef)(null);
	const history = wearHistory(lastSubmitted, archive);
	const log = rowsForVin(maint, draft.header.vin);
	const summary = (0, import_react.useMemo)(() => buildSummary(draft, photos, history, log), [
		draft,
		photos,
		history,
		log
	]);
	async function pdf() {
		if (cache.current) return cache.current;
		const built = await buildInspectionPdf(draft, photos, history, log);
		cache.current = built;
		return built;
	}
	async function run(label, fn) {
		setBusy(label);
		try {
			await fn();
		} finally {
			setBusy("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => openReport(),
				className: "tap-44 w-full rounded bg-primary font-semibold text-primary-foreground",
				children: "View report"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: Boolean(busy),
						onClick: () => {
							saveToHistory();
							setSaved(true);
						},
						className: "tap-44 rounded border border-border bg-inset text-sm font-medium",
						children: saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-pass" }), " Saved"]
						}) : "Save report"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: Boolean(busy),
						onClick: () => void run("print", async () => printPdf((await pdf()).blob)),
						className: "tap-44 rounded border border-border bg-inset text-sm font-medium",
						children: busy === "print" ? "Printing…" : "Print"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: Boolean(busy),
						onClick: () => void run("download", async () => {
							const p = await pdf();
							downloadBlob(p.blob, p.filename);
						}),
						className: "tap-44 rounded border border-border bg-inset text-sm font-medium",
						children: busy === "download" ? "Building…" : "PDF"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: Boolean(busy),
						onClick: () => void run("share", async () => {
							const p = await pdf();
							if (!await sharePdf(p.blob, p.filename)) downloadBlob(p.blob, p.filename);
						}),
						className: "tap-44 rounded border border-border bg-inset text-sm font-medium",
						children: busy === "share" ? "Sharing…" : "Share"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: Boolean(busy),
				onClick: () => void run("email", async () => {
					const to = settings.toEmail.trim();
					if (!to) {
						markSubmitted("skipped");
						return;
					}
					try {
						const p = await pdf();
						const res = await sendInspectionEmail({ data: {
							to,
							cc: settings.ccEmail,
							subject: emailSubject(draft),
							html: inspectionEmailHtml({
								inspector: draft.header.inspector,
								date: draft.header.date,
								miles: formatMiles(draft.header.miles),
								overall: overallLabel(draft.result.overall),
								summary
							}),
							filename: p.filename,
							pdfBase64: await blobToBase64(p.blob)
						} });
						markSubmitted(res.status);
					} catch (e) {
						markSubmitted("failed", e instanceof Error ? e.message : "Email failed");
					}
				}),
				className: "tap-44 w-full rounded border border-border bg-raised font-medium",
				children: busy === "email" ? "Sending…" : "Email report"
			})
		]
	});
}
var TILES = [
	{
		key: "asap",
		emoji: "🚨",
		label: "Critical",
		sub: "Items requiring immediate attention."
	},
	{
		key: "attention",
		emoji: "🟠",
		label: "Repair soon",
		sub: "Recommended within the next service interval."
	},
	{
		key: "monitor",
		emoji: "🟡",
		label: "Monitor",
		sub: "Wear or watch items."
	},
	{
		key: "pass",
		emoji: "🟢",
		label: "Passed",
		sub: "In spec this visit."
	},
	{
		key: "na",
		emoji: "⚪",
		label: "Not inspected",
		sub: "In-visit rows left N/A or skipped."
	}
];
var TONE_CLASS = {
	incomplete: "border-border text-muted-foreground",
	pass: "border-pass text-pass",
	watch: "border-warn text-warn",
	repairs: "border-attention text-attention",
	critical: "border-fail text-fail"
};
function ItemCard({ item, onJump }) {
	const jumpToGuide = useInspection((s) => s.jumpToGuide);
	const openPlain = useInspection((s) => s.openPlain);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hud-card space-y-2",
		children: [
			item.photos[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: item.photos[0].shot.dataUrl,
				alt: item.photos[0].shot.caption || item.label,
				className: "max-h-28 w-full rounded border border-border object-cover"
			}) : null,
			item.photos[0]?.shot.caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: item.photos[0].shot.caption
			}) : null,
			item.grokLine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: item.grokLine
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onJump,
				className: "flex w-full items-start justify-between gap-2 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-medium",
						children: item.label
					}), item.measured || item.range ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-0.5 block text-sm text-muted-foreground",
						children: [item.measured || "—", item.range ? ` · ${item.range}` : ""]
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5 shrink-0 text-muted-foreground" })]
			}),
			item.meaning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-snug text-muted-foreground",
				children: item.meaning
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [item.guideId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => openPlain(item.guideId),
					className: "tap-56 inline-flex items-center gap-1 rounded border border-border bg-inset px-3 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4" }), "What this means"]
				}) : null, item.guideId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => jumpToGuide(item.guideId),
					className: "tap-56 inline-flex items-center gap-1 rounded border border-border bg-inset px-3 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), "Guide"]
				}) : null]
			})
		]
	});
}
function ResultsView() {
	const draft = useInspection((s) => s.draft);
	const photos = useInspection((s) => s.photos);
	const maint = useInspection((s) => s.maint);
	const lastSubmitted = useInspection((s) => s.lastSubmitted);
	const filter = useInspection((s) => s.homeFilter);
	const setFilter = useInspection((s) => s.setHomeFilter);
	const openWalk = useInspection((s) => s.openWalk);
	const openFull = useInspection((s) => s.openFull);
	const openReport = useInspection((s) => s.openReport);
	const collapseAll = useInspection((s) => s.collapseAll);
	const model = resultsModel(draft, photos, rowsForVin(maint, draft.header.vin), Boolean(lastSubmitted && lastSubmitted.id === draft.id));
	const totals = repairTotals(model.repairs);
	function jump(id) {
		setFilter(null);
		collapseAll();
		openWalk(walkIndexForFlag(draft, id));
	}
	const bits = [
		model.miles ? `${model.miles} miles` : null,
		model.date ? formatShortDate(model.date) : null,
		model.inspector || null,
		model.visit || null
	].filter(Boolean);
	const meta = [
		model.vin,
		model.drive,
		model.tow
	].filter(Boolean).join(" · ");
	if (filter) {
		const tile = TILES.find((t) => t.key === filter);
		const list = model.lists[filter];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilter(null),
					className: "tap-56 text-sm font-semibold text-primary",
					children: "← Results"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-lg font-semibold",
					children: [
						tile.emoji,
						" ",
						tile.label
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: tile.sub
				})] }),
				list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, {
						item,
						onJump: () => jump(item.id)
					}, item.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "None on this visit."
				})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hud-card space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl leading-none",
						children: "🚙"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold tracking-tight",
						children: "2005 Nissan Armada"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: bits.length ? bits.join(" · ") : "—"
					}),
					meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-faint",
						children: meta
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("hud-card space-y-1 border-l-4", TONE_CLASS[model.tone]),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "traveler-stamp text-xs",
						children: "Overall condition"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-lg font-semibold tracking-wide",
						children: [
							model.condition.emoji,
							" ",
							model.condition.label
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "reading text-sm",
						children: [
							"Vehicle health score: ",
							model.score ?? 0,
							"/100"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: TILES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setFilter(t.key),
					className: "hud-card tap-56 space-y-1 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium",
						children: [
							t.emoji,
							" ",
							t.label,
							" — ",
							model.counts[t.key]
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-snug text-muted-foreground",
						children: t.sub
					})]
				}, t.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hud-card space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "traveler-stamp text-xs text-primary",
						children: "Recommended next action"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-medium leading-snug text-pretty",
						children: model.next.text
					}),
					model.tone === "incomplete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							collapseAll();
							openWalk(model.next.walkIndex ?? 0);
						},
						className: "tap-56 w-full rounded bg-primary font-semibold text-primary-foreground",
						children: "Finish Walk"
					}) : null
				]
			}),
			model.repairs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "hud-card space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "traveler-stamp text-xs text-primary",
						children: "Priority + estimated cost"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[28rem] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 pr-2 font-medium",
										children: "Item"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 pr-2 font-medium",
										children: "Priority"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 pr-2 font-medium",
										children: "DIY"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 pr-2 font-medium",
										children: "Independent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-1 font-medium",
										children: "Dealer"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [model.repairs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border align-top",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-2",
										children: r.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-2",
										children: priorityLabel(r.priority)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-2",
										children: printRange(r.diy)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-2",
										children: printRange(r.independent)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2",
										children: printDealer(r)
									})
								]
							}, r.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-2",
										colSpan: 2,
										children: "Rough total (not a quote)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-2",
										children: printRange(totals.diy)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-2",
										children: printRange(totals.independent)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2",
										children: printRange(totals.dealer)
									})
								]
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: ESTIMATE_DISCLAIMER
					})
				]
			}) : null,
			model.maintFlags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 text-sm",
				children: model.maintFlags.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: f.tone === "alert" ? "text-fail" : "text-warn",
					children: [
						f.tone === "alert" ? "🔴" : "⚠️",
						" ",
						f.text
					]
				}, f.key))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => openReport(),
				className: "tap-56 w-full rounded bg-primary font-semibold text-primary-foreground",
				children: "View full report"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportActions, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => openFull(),
					className: "tap-56 rounded border border-border bg-inset text-sm font-semibold",
					children: "Full checklist"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						collapseAll();
						openWalk(model.next.walkIndex ?? 0);
					},
					className: "tap-56 rounded border border-border bg-inset text-sm font-semibold",
					children: "Back to Walk"
				})]
			})
		]
	});
}
/**
* iOS Safari / installed-PWA leftover-keyboard fix.
*
* After an input blurs, WebKit often keeps the layout viewport (and
* visualViewport.height) at the keyboard-open size. The traveler then sits in
* the top half of the screen with a dead gap where the keyboard was.
*
* We size `.app-frame` from the visual viewport while a field is focused, and
* snap back to the last full-screen height the moment nothing is focused —
* even if Safari still reports the shrunk number.
*/
var KEYBOARD_GAP_PX = 80;
function isEditable(el) {
	if (!(el instanceof HTMLElement)) return false;
	if (el instanceof HTMLInputElement) {
		if (el.readOnly || el.disabled) return false;
		return !(/* @__PURE__ */ new Set([
			"button",
			"checkbox",
			"radio",
			"submit",
			"reset",
			"file",
			"hidden",
			"image",
			"range",
			"color"
		])).has(el.type);
	}
	if (el instanceof HTMLTextAreaElement) return !el.readOnly && !el.disabled;
	if (el instanceof HTMLSelectElement) return !el.disabled;
	return el.isContentEditable;
}
function measureViewport() {
	const vv = window.visualViewport;
	if (vv && vv.height > 0) return {
		height: vv.height,
		offsetTop: vv.offsetTop
	};
	return {
		height: window.innerHeight,
		offsetTop: 0
	};
}
function zeroDocumentScroll() {
	window.scrollTo(0, 0);
	document.documentElement.scrollTop = 0;
	document.body.scrollTop = 0;
}
function installViewportLock() {
	const root = document.documentElement;
	let fullHeight = Math.max(window.innerHeight, measureViewport().height);
	const timeouts = [];
	const apply = () => {
		const { height, offsetTop } = measureViewport();
		const focused = isEditable(document.activeElement);
		if (focused && fullHeight - height > KEYBOARD_GAP_PX) {
			root.style.setProperty("--app-height", `${Math.round(height)}px`);
			root.style.setProperty("--app-top", `${Math.round(offsetTop)}px`);
			root.classList.add("keyboard-open");
			return;
		}
		if (!focused) {
			fullHeight = Math.max(fullHeight, height, window.innerHeight);
			root.classList.remove("keyboard-open");
			root.style.setProperty("--app-height", `${Math.round(fullHeight)}px`);
			root.style.setProperty("--app-top", "0px");
			zeroDocumentScroll();
			return;
		}
		root.style.setProperty("--app-height", `${Math.round(height)}px`);
		root.style.setProperty("--app-top", `${Math.round(offsetTop)}px`);
	};
	const restoreSoon = () => {
		apply();
		requestAnimationFrame(apply);
		for (const ms of [
			50,
			160,
			320,
			500
		]) timeouts.push(window.setTimeout(apply, ms));
	};
	const resetFull = () => {
		fullHeight = Math.max(window.innerHeight, measureViewport().height);
		restoreSoon();
	};
	const onFocusIn = (e) => {
		apply();
		const el = e.target;
		if (!(el instanceof HTMLElement) || !isEditable(el)) return;
		timeouts.push(window.setTimeout(() => {
			el.scrollIntoView({
				block: "center",
				inline: "nearest"
			});
		}, 300));
	};
	const onFocusOut = () => {
		restoreSoon();
	};
	const onVisibility = () => {
		if (document.visibilityState === "visible") restoreSoon();
	};
	const vv = window.visualViewport;
	vv?.addEventListener("resize", apply);
	vv?.addEventListener("scroll", apply);
	window.addEventListener("resize", apply);
	window.addEventListener("orientationchange", resetFull);
	window.addEventListener("pageshow", restoreSoon);
	document.addEventListener("focusin", onFocusIn);
	document.addEventListener("focusout", onFocusOut);
	document.addEventListener("visibilitychange", onVisibility);
	const vk = navigator.virtualKeyboard;
	if (vk) vk.overlaysContent = true;
	apply();
	return () => {
		for (const id of timeouts) window.clearTimeout(id);
		vv?.removeEventListener("resize", apply);
		vv?.removeEventListener("scroll", apply);
		window.removeEventListener("resize", apply);
		window.removeEventListener("orientationchange", resetFull);
		window.removeEventListener("pageshow", restoreSoon);
		document.removeEventListener("focusin", onFocusIn);
		document.removeEventListener("focusout", onFocusOut);
		document.removeEventListener("visibilitychange", onVisibility);
	};
}
function SavedStamp() {
	const lastSavedAt = useInspection((s) => s.lastSavedAt);
	const saveError = useInspection((s) => s.saveError);
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setNow(Date.now()), 15e3);
		return () => window.clearInterval(id);
	}, []);
	if (saveError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "max-w-[10rem] text-right text-xs font-semibold leading-snug text-fail",
		children: saveError
	});
	if (!lastSavedAt) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-semibold tracking-wide text-foreground",
		children: formatSaved(lastSavedAt, now)
	});
}
function AppShell() {
	useInspection((s) => s.hydrated);
	const tab = useInspection((s) => s.tab);
	const mode = useInspection((s) => s.checklistMode);
	const setTab = useInspection((s) => s.setTab);
	const goHome = useInspection((s) => s.goHome);
	const clearGuideFocus = useInspection((s) => s.clearGuideFocus);
	const draft = useInspection((s) => s.draft);
	const photos = useInspection((s) => s.photos);
	const requestSubmit = useInspection((s) => s.requestSubmit);
	const markSubmitted = useInspection((s) => s.markSubmitted);
	const patch = useInspection((s) => s.patch);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		Promise.resolve(useInspection.persist.rehydrate()).then(() => {
			useInspection.getState().setHydrated();
		});
		const w = window;
		w.__armadaPatch = useInspection.getState().patch;
		w.__armadaGet = () => useInspection.getState();
	}, [patch]);
	(0, import_react.useEffect)(() => installViewportLock(), []);
	(0, import_react.useEffect)(() => {
		const flush = () => useInspection.getState().flushPersist();
		const onVis = () => {
			if (document.visibilityState === "hidden") flush();
		};
		document.addEventListener("visibilitychange", onVis);
		window.addEventListener("pagehide", flush);
		document.addEventListener("freeze", flush);
		return () => {
			document.removeEventListener("visibilitychange", onVis);
			window.removeEventListener("pagehide", flush);
			document.removeEventListener("freeze", flush);
		};
	}, []);
	const ready = headerComplete(draft.header);
	const missingPhotos = missingRequiredPhotos(draft, photos);
	const onHome = tab === "home";
	const onResults = tab === "results";
	const walking = tab === "checklist" && mode === "walk";
	function onSubmit() {
		if (!requestSubmit()) return;
		markSubmitted("idle");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-frame text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "hud-header safe-top shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 px-4 pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-2",
							children: [onHome || onResults ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: goHome,
								className: "tap-56 grid place-items-center rounded border border-border bg-raised",
								"aria-label": "Dashboard",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "traveler-stamp text-xs text-primary",
									children: "Sys · VK56DE · RE5R05A"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "truncate text-lg font-semibold tracking-tight text-balance",
									children: onHome ? "2005 Armada" : onResults ? "Results" : tab === "guide" ? "How-to" : walking ? "Walk the truck" : tab === "history" ? "History" : tab === "reports" ? "Saved reports" : "Checklist"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 flex-col items-end gap-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-2 text-xs uppercase tracking-widest text-faint",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hud-led",
										"aria-hidden": true
									}), "Local"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SavedStamp, {})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSettingsOpen(true),
								className: "tap-56 grid place-items-center rounded border border-border bg-raised",
								"aria-label": "Settings",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" })
							})]
						})]
					}),
					!onHome && (tab === "checklist" || tab === "guide") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 pt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressMeter, {})
					}) : null,
					!onHome && !onResults && tab !== "history" && tab !== "reports" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hud-seg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTab("checklist"),
								"data-on": tab === "checklist" ? "true" : "false",
								className: "hud-seg-btn",
								children: "Inspect"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									clearGuideFocus();
									setTab("guide");
								},
								"data-on": tab === "guide" ? "true" : "false",
								className: "hud-seg-btn",
								children: "Guide"
							})]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "app-scroll mx-auto w-full max-w-xl px-4 pt-4 pb-4",
				children: [
					tab === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeView, {}) : null,
					tab === "results" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsView, {}) : null,
					tab === "checklist" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecklistView, {}) : null,
					tab === "guide" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GuideView, {}) : null,
					tab === "history" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryView, {}) : null,
					tab === "reports" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportsView, {}) : null
				]
			}),
			tab === "checklist" && mode === "full" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "submit-bar border-t border-border px-4 pt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onSubmit(),
					disabled: !ready,
					className: "tap-56 w-full rounded bg-primary font-mono text-sm font-semibold tracking-widest uppercase text-primary-foreground disabled:opacity-40",
					children: ready ? missingPhotos.length ? `${missingPhotos.length} photos required` : "Submit" : "Fill date, miles, inspector"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsSheet, {
				open: settingsOpen,
				onClose: () => setSettingsOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlainSheet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportView, {})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {});
}
//#endregion
export { Home as component };
