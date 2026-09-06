//#region node_modules/.nitro/vite/services/ssr/assets/grok-scan-1cGQChnJ.js
var VISIT_TYPES = [
	{
		value: "oil-change",
		label: "Oil-change short check"
	},
	{
		value: "15k",
		label: "15k inspection"
	},
	{
		value: "30k",
		label: "30k powertrain"
	},
	{
		value: "baseline-270k",
		label: "Baseline 270k"
	}
];
var OVERALL_OPTIONS = [
	{
		value: "pass",
		label: "Pass"
	},
	{
		value: "pass-notes",
		label: "Pass with notes"
	},
	{
		value: "schedule",
		label: "Schedule repairs"
	},
	{
		value: "do-not-drive",
		label: "Do not drive"
	}
];
var TRANS_ROWS = [
	{
		key: "parkReverse",
		label: "Park → Reverse engagement",
		options: [
			"Good",
			"Delay",
			"Bang"
		],
		guideId: "trans.parkReverse"
	},
	{
		key: "reverseDrive",
		label: "Reverse → Drive",
		options: [
			"Good",
			"Delay",
			"Bang"
		],
		guideId: "trans.reverseDrive"
	},
	{
		key: "up12",
		label: "1–2 upshift",
		options: [
			"Clean",
			"Flare",
			"Harsh"
		],
		guideId: "trans.up12"
	},
	{
		key: "up23",
		label: "2–3 upshift",
		options: [
			"Clean",
			"Flare",
			"Harsh"
		],
		guideId: "trans.up23"
	},
	{
		key: "up345",
		label: "3–4 and 4–5",
		options: [
			"Clean",
			"Miss",
			"Hunt"
		],
		guideId: "trans.up345"
	},
	{
		key: "tcc",
		label: "TCC lock ~45–60 mph light throttle",
		options: [
			"Smooth",
			"Shudder",
			"Slip"
		],
		guideId: "trans.tcc"
	},
	{
		key: "kickdown",
		label: "Kickdown 5–4 / 4–3",
		options: [
			"Clean",
			"Late",
			"Harsh"
		],
		guideId: "trans.kickdown"
	},
	{
		key: "fourwd",
		label: "4WD engage / disengage",
		options: [
			"Works",
			"Binds",
			"No"
		],
		guideId: "trans.fourwd",
		drive: "4WD"
	}
];
var CORNERS = [
	{
		key: "lf",
		label: "LF"
	},
	{
		key: "rf",
		label: "RF"
	},
	{
		key: "lr",
		label: "LR"
	},
	{
		key: "rr",
		label: "RR"
	}
];
var CORNERS_SPARE = [...CORNERS, {
	key: "spare",
	label: "Spare"
}];
var STEERING_ITEMS = [
	{
		key: "steeringPlay",
		label: "Steering play at idle",
		guideId: "steering.steeringPlay",
		minVisit: "15k"
	},
	{
		key: "tieRods",
		label: "Inner / outer tie rods",
		guideId: "steering.tieRods",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "ballJoints",
		label: "Upper & lower ball joints / UCAs",
		guideId: "steering.ballJoints",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "sway",
		label: "Sway-bar bushings & end links",
		guideId: "steering.sway",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "springs",
		label: "Spring perches / shackles / body mounts",
		guideId: "steering.springs",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "shocks",
		label: "Shock / strut leaks",
		guideId: "steering.shocks",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "rack",
		label: "Rack boots / PSF high-pressure hose",
		guideId: "steering.rack",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "shafts",
		label: "Front & rear drive shafts / U-joints / slip yoke (4WD)",
		guideId: "steering.shafts",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "seals",
		label: "CV / pinion / axle seals",
		guideId: "steering.seals",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "mounts",
		label: "Engine and transmission mounts",
		guideId: "steering.mounts",
		photo: true,
		minVisit: "15k"
	}
];
var UNDERBODY_ITEMS = [
	{
		key: "oilPan",
		label: "Oil pan and drain plug",
		guideId: "underbody.oilPan",
		photo: true
	},
	{
		key: "transPan",
		label: "Transmission pan and cooler fittings",
		guideId: "underbody.transPan",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "fuel",
		label: "Fuel tank, straps, lines, EVAP area",
		guideId: "underbody.fuel",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "exhaust",
		label: "Exhaust hangers, cats, muffler, leaks",
		guideId: "underbody.exhaust",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "frame",
		label: "Frame rust, spare-tire carrier, running-board mounts",
		guideId: "underbody.frame",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "lines",
		label: "Brake and fuel line rust",
		guideId: "underbody.lines",
		photo: true,
		minVisit: "15k"
	}
];
var CABIN_ITEMS = [
	{
		key: "airbag",
		label: "Airbag lamp proves out and goes off",
		guideId: "cabin.airbag",
		minVisit: "15k"
	},
	{
		key: "seatbelts",
		label: "Seatbelts latch and retract — all rows",
		guideId: "cabin.seatbelts",
		minVisit: "15k"
	},
	{
		key: "latches",
		label: "Doors / rear hatch / rear glass latch",
		guideId: "cabin.latches",
		minVisit: "15k"
	},
	{
		key: "horn",
		label: "Horn",
		guideId: "cabin.horn",
		minVisit: "15k"
	},
	{
		key: "lights",
		label: "Headlights, high beams, fogs, tails, brake, reverse, plate, hazards",
		guideId: "cabin.lights"
	},
	{
		key: "wipers",
		label: "Wipers / washers front and rear",
		guideId: "cabin.wipers"
	},
	{
		key: "hvac",
		label: "Defroster and HVAC blower",
		guideId: "cabin.hvac",
		minVisit: "15k"
	},
	{
		key: "glass",
		label: "Mirrors / glass cracks",
		guideId: "cabin.glass",
		photo: true,
		minVisit: "15k"
	},
	{
		key: "jack",
		label: "Jack, lug wrench, spare present and usable",
		guideId: "cabin.jack",
		photo: true,
		minVisit: "15k"
	}
];
var ROAD_ITEMS = [
	{
		key: "coldStart",
		label: "Cold start — chain and manifold noise recorded",
		guideId: "road.coldStart"
	},
	{
		key: "overheat",
		label: "No overheat after 15 min mixed driving",
		guideId: "road.overheat"
	},
	{
		key: "brakes",
		label: "Brakes from 30 and from 60 — no pull, no pulse",
		guideId: "road.brakes"
	},
	{
		key: "vibration",
		label: "No new vibration 45–70 mph",
		guideId: "road.vibration",
		minVisit: "15k"
	},
	{
		key: "shifts",
		label: "Shift quality matches Section 3",
		guideId: "road.shifts"
	},
	{
		key: "lamps",
		label: "No new warning lamps",
		guideId: "road.lamps"
	}
];
var BASELINE_ITEMS = [
	{
		key: "sparkPlugs",
		label: "Spark plugs (105k iridium — cycle 2 or 3)",
		guideId: "baseline.sparkPlugs"
	},
	{
		key: "coolantService",
		label: "Coolant service + cap + thermostat + water-pump weep",
		guideId: "baseline.coolantService"
	},
	{
		key: "brakeFluid",
		label: "Brake fluid (DOT 3, moisture)",
		guideId: "baseline.brakeFluid"
	},
	{
		key: "diffFluid",
		label: "Diff and transfer-case fluid",
		guideId: "baseline.diffFluid"
	},
	{
		key: "seepage",
		label: "Valve-cover / timing-cover / oil-pan seepage grade",
		guideId: "baseline.seepage"
	},
	{
		key: "manifoldBolts",
		label: "Exhaust manifold / heat-shield bolts",
		guideId: "baseline.manifoldBolts"
	},
	{
		key: "ucaJoints",
		label: "Upper control arms / ball joints",
		guideId: "baseline.ucaJoints"
	},
	{
		key: "airShocks",
		label: "Rear load-leveling / air shocks",
		guideId: "baseline.airShocks"
	}
];
var OIL_WAIT_MS = 6e5;
function oilChangeRecord(draft) {
	const t = draft.header.miles.replace(/[^\d]/g, "");
	return `Oil change completed at ${t ? Number(t).toLocaleString("en-US") : "—"} miles — ${draft.result.oilType.trim() || "—"}, ${draft.result.oilAmount.trim() || "—"}, filter ${draft.result.oilFilterPn.trim() || "—"}, ${draft.result.crushWasher === "Y" ? "crush washer replaced" : draft.result.crushWasher === "N" ? "crush washer not replaced" : "crush washer —"}.`;
}
var SMOD_INTERVAL = "30k powertrain: external stacked-plate cooler and radiator replacement if the radiator is original, unknown, or the in-radiator ATF cooler is still in service. Do not wait for milky ATF.";
function smodPlanRecord(draft) {
	const t = draft.result.smodPlan;
	return `SMOD prevention — radiator last: ${t.radiatorLast === "original" ? "original" : t.radiatorLast === "replaced" ? t.radiatorDate.trim() || "replaced — date not written" : "unknown"}. ${draft.engine.atfLines?.bypassDone === "Y" ? "external cooler installed" : "external cooler not installed"}. ${SMOD_INTERVAL} Not milky today is not a maintenance plan.`;
}
var SECTION_DEFS = [
	{
		id: "header",
		label: "Vehicle",
		short: "Hdr"
	},
	{
		id: "fluids",
		label: "1. Fluids",
		short: "1"
	},
	{
		id: "engine",
		label: "2. Engine bay",
		short: "2"
	},
	{
		id: "trans",
		label: "3. Transmission",
		short: "3"
	},
	{
		id: "brakes",
		label: "4. Brakes & rolling",
		short: "4"
	},
	{
		id: "steering",
		label: "5. Steering / driveline",
		short: "5"
	},
	{
		id: "underbody",
		label: "6. Underbody",
		short: "6"
	},
	{
		id: "cabin",
		label: "7. Cabin & safety",
		short: "7"
	},
	{
		id: "road",
		label: "8. Final road test",
		short: "8"
	},
	{
		id: "baseline",
		label: "270k due",
		short: "270"
	},
	{
		id: "result",
		label: "9. Result",
		short: "9"
	}
];
var ALL_SECTION_IDS = SECTION_DEFS.map((s) => s.id);
function isSmodRisk(draft) {
	const { color, smell } = draft.fluids.atf;
	return color === "pink" || color === "milky" || smell === "sweet";
}
function headerComplete(h) {
	return Boolean(h.date && h.miles.trim() && h.inspector.trim());
}
function overallLabel(v) {
	return OVERALL_OPTIONS.find((o) => o.value === v)?.label ?? "—";
}
function visitLabel(v) {
	if (v === "recommended") return "Mileage-based inspection";
	return VISIT_TYPES.find((o) => o.value === v)?.label ?? "";
}
function isOilChange(visit) {
	return visit === "oil-change";
}
/** minVisit of 15k shows on 15k/30k/270k; 30k on 30k/270k; baseline only on 270k. */
function visitShows(visit, min) {
	if (!min) return true;
	if (!visit || visit === "recommended" || visit === "oil-change") return false;
	if (min === "baseline") return visit === "baseline-270k";
	if (min !== "30k") return true;
	return visit === "30k" || visit === "baseline-270k";
}
function driveShows(drive, need) {
	return !need || !drive || drive === "4WD";
}
var BRAKE_INTERVAL_IDS = /* @__PURE__ */ new Set([
	"rotors",
	"hoses",
	"master",
	"pedalHeight",
	"parking",
	"lugTorque",
	"bearings",
	"alignment"
]);
function taggedMinVisit(item) {
	if (item && typeof item === "object" && "minVisit" in item) return item.minVisit;
}
/** Oil-change short set. Pads are not on this visit. */
var OIL_SHORT = /* @__PURE__ */ new Set([
	"oilLevel",
	"oilLeak",
	"coolant",
	"atf",
	"atfLines",
	"brake",
	"pressures",
	"tread",
	"cabin.lights",
	"absLamps",
	"cabin.airbag",
	"atfReject",
	"washer",
	"underbody.oilPan",
	"engine.overview",
	"cabin.dash",
	"cabin.wipers",
	"road.lamps",
	"road.overheat"
]);
var REC_ALWAYS = /* @__PURE__ */ new Set([
	"oilLeak",
	"coolant",
	"atf",
	"atfLines",
	"brake",
	"pressures",
	"tread",
	"cabin.lights",
	"absLamps",
	"cabin.airbag",
	"atfReject",
	"washer",
	"underbody.oilPan",
	"engine.overview",
	"cabin.dash",
	"cabin.wipers"
]);
var REC_OIL = /* @__PURE__ */ new Set(["oilLevel"]);
var REC_MULTI = /* @__PURE__ */ new Set([
	"oilLevel",
	"pads",
	"tireAge",
	"wear",
	"battery",
	"grounds",
	"airFilter",
	"pcv",
	"road.brakes",
	"road.overheat",
	"road.lamps",
	"road.coldStart",
	"idle",
	"underbody.transPan"
]);
var REC_POWER = /* @__PURE__ */ new Set([
	"transferSeep",
	"frontDiffSeep",
	"rearDiffSeep",
	"radiator",
	"belt",
	"hoses",
	"steering.ballJoints",
	"steering.tieRods",
	"underbody.exhaust",
	"smodPlan",
	"transTable",
	"scan",
	"road.shifts"
]);
var REC_COOL = /* @__PURE__ */ new Set([
	"radiator",
	"atf",
	"atfLines",
	"coolant",
	"smodPlan",
	"underbody.transPan"
]);
var REC_HIGH = new Set("timingCover,manifolds,scan,transTable,rotors,master,pedalHeight,parking,lugTorque,bearings,alignment,cabin.recalls,road.vibration,road.shifts,underbody.frame,underbody.fuel,underbody.lines,baseline,steering.steeringPlay,steering.sway,steering.springs,steering.shocks,steering.rack,steering.shafts,steering.seals,steering.mounts".split(","));
function recommendedRowShows(id, plan, drive) {
	const p = plan ?? {
		oilService: false,
		multiPoint: false,
		powertrain: false,
		cooling: false,
		highMiles: false,
		sparkPlugs: false,
		coolantService: false,
		brakeFluidService: false
	};
	if (id === "header" || id === "result") return true;
	if (id === "trans.fourwd") return p.powertrain && driveShows(drive, "4WD");
	if (id.startsWith("trans.")) return p.powertrain || p.highMiles;
	if ((id === "transferSeep" || id === "frontDiffSeep") && !driveShows(drive, "4WD")) return false;
	let on = REC_ALWAYS.has(id);
	if (p.oilService && REC_OIL.has(id)) on = true;
	if (p.multiPoint && REC_MULTI.has(id)) on = true;
	if (p.powertrain && REC_POWER.has(id)) on = true;
	if (p.cooling && REC_COOL.has(id)) on = true;
	if (p.sparkPlugs && (id === "baseline.sparkPlugs" || id === "baseline")) on = true;
	if (p.coolantService && (id === "baseline.coolantService" || id === "baseline" || id === "coolant")) on = true;
	if (p.brakeFluidService && (id === "baseline.brakeFluid" || id === "baseline" || id === "brake")) on = true;
	if (p.highMiles && (REC_HIGH.has(id) || id.startsWith("baseline."))) on = true;
	if (id === "transTable" && (p.powertrain || p.highMiles)) on = true;
	return on;
}
function rowShows(id, visit, drive = "", plan = null) {
	if (!visit) return id === "header" || id === "result";
	if (visit === "recommended") return recommendedRowShows(id, plan, drive);
	if (visit === "oil-change") {
		if (id === "header" || id === "result") return true;
		if ((id === "transferSeep" || id === "frontDiffSeep" || id === "trans.fourwd") && !driveShows(drive, "4WD")) return false;
		return OIL_SHORT.has(id);
	}
	if (id === "atfReject") return true;
	if (id.startsWith("trans.")) {
		if (id === "trans.fourwd") return visitShows(visit, "15k") && driveShows(drive, "4WD");
		return visitShows(visit, "15k");
	}
	if (id === "transferSeep" || id === "frontDiffSeep") return visitShows(visit, "15k") && driveShows(drive, "4WD");
	if (id === "rearDiffSeep" || id === "scan" || id === "transTable" || BRAKE_INTERVAL_IDS.has(id) || id.startsWith("steering.")) return visitShows(visit, "15k");
	if (id.startsWith("underbody.")) return visitShows(visit, taggedMinVisit(UNDERBODY_ITEMS.find((it) => it.key === id.slice(10))));
	if (id === "cabin.recalls") return visitShows(visit, "15k");
	if (id.startsWith("cabin.")) return visitShows(visit, taggedMinVisit(CABIN_ITEMS.find((it) => it.key === id.slice(6))));
	if (id === "smodPlan") return visitShows(visit, "30k");
	if (id === "baseline" || id.startsWith("baseline.")) return visitShows(visit, "baseline");
	if (id.startsWith("road.")) return visitShows(visit, taggedMinVisit(ROAD_ITEMS.find((it) => it.key === id.slice(5))));
	return true;
}
var CHECK_ROW_IDS = [
	"oilLevel",
	"oilLeak",
	"coolant",
	"atf",
	"psf",
	"brake",
	"washer",
	"transferSeep",
	"frontDiffSeep",
	"rearDiffSeep",
	"timingCover",
	"manifolds",
	"idle",
	"belt",
	"radiator",
	"atfLines",
	"airFilter",
	"battery",
	"grounds",
	"pcv",
	"scan",
	"pads",
	"rotors",
	"hoses",
	"master",
	"pedalHeight",
	"parking",
	"absLamps",
	"tread",
	"tireAge",
	"wear",
	"pressures",
	"lugTorque",
	"bearings",
	"alignment",
	...STEERING_ITEMS.map((i) => `steering.${i.key}`),
	...UNDERBODY_ITEMS.map((i) => `underbody.${i.key}`),
	...CABIN_ITEMS.map((i) => `cabin.${i.key}`),
	"cabin.recalls",
	...ROAD_ITEMS.map((i) => `road.${i.key}`),
	"smodPlan",
	...BASELINE_ITEMS.map((i) => `baseline.${i.key}`)
];
CHECK_ROW_IDS.length;
function drivelineShaftLabel(drive) {
	return drive === "2WD" ? "Rear drive shaft / U-joints / slip yoke" : "Front & rear drive shafts / U-joints / slip yoke (4WD)";
}
function oilWaitReady(startedAt, now = Date.now()) {
	return startedAt != null && now - startedAt >= 6e5;
}
function checkedCount(draft) {
	const visit = draft.header.visitType;
	const drive = draft.header.drive;
	const plan = visit === "recommended" ? draft.header.plan : null;
	let n = 0;
	const bump = (id, row) => {
		if (rowShows(id, visit, drive, plan) && row?.checked) n += 1;
	};
	bump("oilLevel", draft.fluids.oilLevel);
	bump("oilLeak", draft.fluids.oilLeak);
	bump("coolant", draft.fluids.coolant);
	bump("atf", draft.fluids.atf);
	bump("psf", draft.fluids.psf);
	bump("brake", draft.fluids.brake);
	bump("washer", draft.fluids.washer);
	bump("transferSeep", draft.fluids.transferSeep);
	bump("frontDiffSeep", draft.fluids.frontDiffSeep);
	bump("rearDiffSeep", draft.fluids.rearDiffSeep);
	bump("timingCover", draft.engine.timingCover);
	bump("manifolds", draft.engine.manifolds);
	bump("idle", draft.engine.idle);
	bump("belt", draft.engine.belt);
	bump("radiator", draft.engine.radiator);
	bump("atfLines", draft.engine.atfLines);
	bump("airFilter", draft.engine.airFilter);
	bump("battery", draft.engine.battery);
	bump("grounds", draft.engine.grounds);
	bump("pcv", draft.engine.pcv);
	bump("scan", draft.engine.scan);
	bump("pads", draft.brakes.pads);
	bump("rotors", draft.brakes.rotors);
	bump("hoses", draft.brakes.hoses);
	bump("master", draft.brakes.master);
	bump("pedalHeight", draft.brakes.pedalHeight);
	bump("parking", draft.brakes.parking);
	bump("absLamps", draft.brakes.absLamps);
	bump("tread", draft.brakes.tread);
	bump("tireAge", draft.brakes.tireAge);
	bump("wear", draft.brakes.wear);
	bump("pressures", draft.brakes.pressures);
	bump("lugTorque", draft.brakes.lugTorque);
	bump("bearings", draft.brakes.bearings);
	bump("alignment", draft.brakes.alignment);
	for (const it of STEERING_ITEMS) bump(`steering.${it.key}`, draft.steering.items[it.key]);
	for (const it of UNDERBODY_ITEMS) bump(`underbody.${it.key}`, draft.underbody.items[it.key]);
	for (const it of CABIN_ITEMS) bump(`cabin.${it.key}`, draft.cabin.items[it.key]);
	bump("cabin.recalls", draft.cabin.recalls);
	for (const it of ROAD_ITEMS) bump(`road.${it.key}`, draft.road.items[it.key]);
	bump("smodPlan", draft.result.smodPlan);
	const baseline = draft.baseline;
	for (const it of BASELINE_ITEMS) bump(`baseline.${it.key}`, baseline[it.key]);
	return n;
}
function isDraftStarted(draft) {
	if (draft.header.miles.trim() || draft.header.inspector.trim() || draft.header.vin.trim() || draft.result.overall) return true;
	return checkedCount(draft) > 0;
}
var PHOTO_CORNERS = [
	{
		key: "lf",
		label: "LF"
	},
	{
		key: "rf",
		label: "RF"
	},
	{
		key: "lr",
		label: "LR"
	},
	{
		key: "rr",
		label: "RR"
	}
];
var PHOTO_SLOTS = [
	{
		slot: "header.vin",
		label: "VIN plate",
		required: true,
		itemId: "header"
	},
	{
		slot: "cabin.dash",
		label: "Dash warning lights (key on)",
		required: true,
		itemId: "absLamps"
	},
	{
		slot: "engine.radiator",
		label: "Cooler fittings photo",
		required: true,
		itemId: "radiator",
		aliases: ["engine.atfLines"]
	},
	{
		slot: "fluids.atf",
		label: "ATF on the stick at HOT",
		required: true,
		itemId: "atf"
	},
	{
		slot: "engine.overview",
		label: "Engine bay overview",
		required: true,
		itemId: "engine.overview"
	},
	{
		slot: "fluids.oilLeak",
		label: "Oil leaks / timing cover / oil pan",
		required: true,
		itemId: "oilLeak",
		aliases: ["engine.timingCover", "underbody.oilPan"]
	},
	...PHOTO_CORNERS.map((c) => ({
		slot: `brakes.pads.${c.key}`,
		label: `${c.label} pad`,
		required: true,
		itemId: "pads"
	})),
	...PHOTO_CORNERS.map((c) => ({
		slot: `brakes.tread.${c.key}`,
		label: `${c.label} tread + inner shoulder`,
		required: true,
		itemId: "tread"
	})),
	{
		slot: "underbody.frame",
		label: "Frame / rust",
		required: true,
		itemId: "underbody.frame"
	},
	{
		slot: "steering.ballJoints",
		label: "Suspension (UCA / ball joint / perch / shock)",
		required: true,
		itemId: "steering.ballJoints"
	},
	{
		slot: "fluids.coolant",
		label: "Coolant reservoir",
		required: false,
		itemId: "coolant"
	},
	{
		slot: "fluids.psf",
		label: "Power steering fluid",
		required: false,
		itemId: "psf"
	},
	{
		slot: "fluids.brake",
		label: "Brake fluid",
		required: false,
		itemId: "brake"
	},
	{
		slot: "engine.battery",
		label: "Battery / grounds",
		required: false,
		itemId: "battery"
	},
	{
		slot: "engine.grounds",
		label: "Grounds",
		required: false,
		itemId: "grounds"
	},
	{
		slot: "underbody.exhaust",
		label: "Exhaust / heat shields",
		required: false,
		itemId: "underbody.exhaust"
	},
	{
		slot: "cabin.jack",
		label: "Spare / jack",
		required: false,
		itemId: "cabin.jack"
	}
];
var BY_SLOT = new Map(PHOTO_SLOTS.map((s) => [s.slot, s]));
function photoSlotDef(slot) {
	return BY_SLOT.get(slot);
}
function isRequiredPhotoSlot(slot) {
	return BY_SLOT.get(slot)?.required === true;
}
function shotOk(shot) {
	return Boolean(shot && typeof shot === "object" && shot.dataUrl);
}
function hasPhoto(photos, def) {
	if (shotOk(photos[def.slot])) return true;
	return (def.aliases ?? []).some((a) => shotOk(photos[a]));
}
function photoSkipReason(draft, slot) {
	return (draft.photoSkip?.[slot] ?? "").trim();
}
function missingRequiredPhotos(draft, photos = {}) {
	const visit = draft.header.visitType;
	const drive = draft.header.drive;
	const out = [];
	for (const def of PHOTO_SLOTS) {
		if (!def.required) continue;
		if (!rowShows(def.itemId, visit, drive, draft.header.plan)) continue;
		const entry = draft.itemStatus?.[def.itemId];
		if (entry?.manual && entry.value === "na") continue;
		if (photoSkipReason(draft, def.slot)) continue;
		if (hasPhoto(photos, def)) continue;
		out.push({
			slot: def.slot,
			label: def.label,
			line: `${def.label}: missing (photo required)`
		});
	}
	return out;
}
var ITEM_SLOTS = {};
for (const def of PHOTO_SLOTS) (ITEM_SLOTS[def.itemId] ??= []).push(def.slot);
function photoSlotsForItem(itemId) {
	if (ITEM_SLOTS[itemId]) return ITEM_SLOTS[itemId];
	if (itemId === "atfLines") return ["engine.radiator", "engine.atfLines"];
	if (itemId === "smodPlan") return ["engine.radiator", "engine.atfLines"];
	if (itemId === "timingCover") return ["fluids.oilLeak", "engine.timingCover"];
	return ITEM_SLOTS[itemId] ?? [];
}
function flagPhotoSlot(itemId) {
	return `item.${itemId}`;
}
function photosForItem(itemId, photos) {
	const slots = new Set(photoSlotsForItem(itemId));
	slots.add(flagPhotoSlot(itemId));
	if (itemId === "atf" || itemId === "smod" || itemId === "atfReject") {
		slots.add("fluids.atf");
		slots.add("engine.radiator");
		slots.add("engine.atfLines");
	}
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const slot of slots) {
		const shot = photos[slot];
		if (!shotOk(shot) || seen.has(shot.dataUrl)) continue;
		seen.add(shot.dataUrl);
		out.push({
			slot,
			shot
		});
	}
	return out;
}
var GROK_STATUS_LABEL = {
	pass: "PASS",
	monitor: "MONITOR",
	attention: "SERVICE SOON",
	asap: "URGENT",
	unable: "UNABLE"
};
var UNSURE_LINE = "Could not verify from this photo — retake in daylight.";
var SMOD_LINE = "Possible coolant/ATF mix — do not treat as PASS.";
/** Required photos that auto-scan. VIN is never sent. */
var AUTO_SCAN_SLOTS = /* @__PURE__ */ new Set([
	"engine.radiator",
	"engine.atfLines",
	"fluids.atf",
	"brakes.pads.lf",
	"brakes.pads.rf",
	"brakes.pads.lr",
	"brakes.pads.rr",
	"brakes.tread.lf",
	"brakes.tread.rf",
	"brakes.tread.lr",
	"brakes.tread.rr",
	"fluids.oilLeak",
	"engine.overview",
	"cabin.dash"
]);
function isVinSlot(slot) {
	return slot === "header.vin" || /(^|[./])vin($|[./])/i.test(slot);
}
function isScanAllowedSlot(slot) {
	return Boolean(slot) && !isVinSlot(slot);
}
function isAutoScanSlot(slot) {
	return AUTO_SCAN_SLOTS.has(slot) && isScanAllowedSlot(slot);
}
function photoHash(dataUrl) {
	return `${dataUrl.length}:${dataUrl.slice(16, 48)}:${dataUrl.slice(-24)}`;
}
function shouldAutoScan(existing, slot, hash) {
	if (!isAutoScanSlot(slot)) return false;
	if (!existing) return true;
	if (existing.photoHash === hash) return false;
	if (existing.confirmed || existing.dismissed) return false;
	return true;
}
function parseStatusLabel(raw) {
	const t = raw.trim().toUpperCase().replace(/[_-]+/g, " ");
	if (t === "PASS") return "pass";
	if (t === "MONITOR") return "monitor";
	if (t === "SERVICE SOON" || t === "ATTENTION" || t === "NEEDS ATTENTION") return "attention";
	if (t === "URGENT" || t === "ASAP" || t === "REPAIR ASAP") return "asap";
	if (t === "UNABLE" || t === "N/A" || t === "NA" || t === "CANT INSPECT" || t === "CAN'T INSPECT") return "unable";
	return null;
}
function grokStatusToItem(status) {
	return status;
}
var MEASURE_RE = /\d+(?:\.\d+)?\s*(?:mm|psi|volts?|\bv\b|qt|quarts?|°f|deg)/i;
var SMOD_RE = /\b(milky|pink|sweet|coolant\s*\/\s*atf|atf\s*mix|wet(?:ness)?\s+(?:at\s+)?(?:the\s+)?(?:atf\s+)?(?:cooler\s+)?fittings?)\b/i;
function looksInventedMeasurement(text) {
	return MEASURE_RE.test(text);
}
function looksSmod(text) {
	return SMOD_RE.test(text);
}
function parseGrokJson(raw) {
	const trimmed = raw.trim();
	const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
	const body = fence ? fence[1].trim() : trimmed;
	const start = body.indexOf("{");
	const end = body.lastIndexOf("}");
	if (start < 0 || end <= start) return null;
	try {
		const obj = JSON.parse(body.slice(start, end + 1));
		return {
			suggestedStatus: String(obj.suggestedStatus ?? obj.status ?? ""),
			whatItSees: String(obj.whatItSees ?? obj.sees ?? ""),
			whereOnPhoto: String(obj.whereOnPhoto ?? obj.circle ?? ""),
			askInspector: String(obj.askInspector ?? obj.ask ?? "")
		};
	} catch {
		return null;
	}
}
function clip(s, n) {
	const t = s.replace(/\s+/g, " ").trim();
	if (t.length <= n) return t;
	return t.slice(0, n - 1).trimEnd() + "…";
}
function sanitizeSuggestion(raw) {
	const unsure = {
		suggestedStatus: "unable",
		whatItSees: UNSURE_LINE,
		whereOnPhoto: "Retake in daylight, fill the frame with the part.",
		askInspector: "Is the photo sharp enough to judge this?",
		confirmed: false,
		dismissed: false,
		editing: false
	};
	if (!raw) return unsure;
	let status = parseStatusLabel(raw.suggestedStatus);
	let sees = clip(raw.whatItSees, 160);
	let where = clip(raw.whereOnPhoto, 120);
	let ask = clip(raw.askInspector, 120);
	if (!status || !sees) return unsure;
	if (looksInventedMeasurement(sees) || looksInventedMeasurement(where)) return unsure;
	if (looksSmod(sees) || looksSmod(where) || looksSmod(ask)) {
		status = "asap";
		sees = SMOD_LINE;
		if (!ask) ask = "Is the ATF milky or just backlit?";
	}
	if (!where) where = "Circle the problem area.";
	if (!ask) ask = "Does this match what you see on the truck?";
	return {
		suggestedStatus: status,
		whatItSees: sees,
		whereOnPhoto: where,
		askInspector: ask,
		confirmed: false,
		dismissed: false,
		editing: false
	};
}
function grokReportLine(g) {
	if (!g || g.dismissed || !g.whatItSees.trim()) return "";
	const tag = g.confirmed ? "Inspector-confirmed" : "Grok suggestion (not confirmed)";
	return `${g.whatItSees} · ${tag}`;
}
function suggestionForItem(scans, itemId, slots = []) {
	if (!scans) return void 0;
	if (scans[itemId] && !scans[itemId].dismissed) return scans[itemId];
	for (const slot of slots) {
		const id = photoSlotDef(slot)?.itemId;
		if (id && scans[id] && !scans[id].dismissed) return scans[id];
	}
}
function privacyPayload(input) {
	const image = typeof input.imageDataUrl === "string" && input.imageDataUrl.startsWith("data:image/") ? input.imageDataUrl.slice(0, 14e5) : "";
	return {
		stepId: String(input.stepId || "").slice(0, 80),
		stepName: String(input.stepName || "").slice(0, 120),
		slotLabel: String(input.slotLabel || "").slice(0, 120),
		imageDataUrl: image,
		transcript: String(input.transcript || "").slice(0, 2e3)
	};
}
function appendNote(cur, add) {
	const a = add.trim();
	if (!a) return cur;
	if (cur.includes(a)) return cur;
	return cur.trim() ? `${cur.trim()} · ${a}` : a;
}
//#endregion
export { isRequiredPhotoSlot as A, photoSlotDef as B, grokReportLine as C, isAutoScanSlot as D, headerComplete as E, oilWaitReady as F, sanitizeSuggestion as G, photosForItem as H, overallLabel as I, smodPlanRecord as J, shotOk as K, parseGrokJson as L, isSmodRisk as M, missingRequiredPhotos as N, isDraftStarted as O, oilChangeRecord as P, photoHash as R, flagPhotoSlot as S, hasPhoto as T, privacyPayload as U, photoSlotsForItem as V, rowShows as W, visitLabel as X, suggestionForItem as Y, visitShows as Z, UNDERBODY_ITEMS as _, CORNERS as a, driveShows as b, OIL_WAIT_MS as c, PHOTO_SLOTS as d, ROAD_ITEMS as f, TRANS_ROWS as g, STEERING_ITEMS as h, CHECK_ROW_IDS as i, isScanAllowedSlot as j, isOilChange as k, OVERALL_OPTIONS as l, SMOD_INTERVAL as m, BASELINE_ITEMS as n, CORNERS_SPARE as o, SECTION_DEFS as p, shouldAutoScan as q, CABIN_ITEMS as r, GROK_STATUS_LABEL as s, ALL_SECTION_IDS as t, PHOTO_CORNERS as u, VISIT_TYPES as v, grokStatusToItem as w, drivelineShaftLabel as x, appendNote as y, photoSkipReason as z };
