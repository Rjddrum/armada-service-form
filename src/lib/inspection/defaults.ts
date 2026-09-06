import { todayISO } from "@/lib/utils";
import type {
  BrakesSection,
  CabinSection,
  CheckRow,
  EngineBaySection,
  FluidsSection,
  InspectionDraft,
  RoadSection,
  SettingsState,
  SteeringSection,
  TransRowKey,
  TransSection,
  UnderbodySection,
} from "./types";
import {
  CABIN_ITEMS,
  ROAD_ITEMS,
  STEERING_ITEMS,
  TRANS_ROWS,
  UNDERBODY_ITEMS,
} from "./types";

function row(): CheckRow {
  return { checked: false, notes: "" };
}

function remembered(): { inspector: string; vin: string } {
  if (typeof window === "undefined") return { inspector: "", vin: "" };
  try {
    return {
      inspector: localStorage.getItem("armada-last-inspector-v1") || "",
      vin: localStorage.getItem("armada-last-vin-v1") || "",
    };
  } catch {
    return { inspector: "", vin: "" };
  }
}

export function rememberPeople(inspector: string, vin: string) {
  if (typeof window === "undefined") return;
  try {
    if (inspector.trim()) localStorage.setItem("armada-last-inspector-v1", inspector.trim());
    if (vin.trim()) localStorage.setItem("armada-last-vin-v1", vin.trim());
  } catch {
    /* quota */
  }
}

export function emptyDraft(): InspectionDraft {
  const now = Date.now();
  const who = remembered();
  const transRows = {} as TransSection["rows"];
  for (const r of TRANS_ROWS) {
    transRows[r.key as TransRowKey] = { cold: "", hot: "", notes: "" };
  }
  const mapItems = <K extends string>(items: readonly { key: K }[]): Record<K, CheckRow> => {
    const out = {} as Record<K, CheckRow>;
    for (const i of items) out[i.key] = row();
    return out;
  };
  const fluids = (): FluidsSection => ({
    notes: "",
    oilLevel: { ...row(), colorLevel: "", qtAdded: "" },
    oilLeak: row(),
    coolant: { ...row(), levelColor: "", capSeated: "", freezeF: "" },
    atf: { ...row(), inRange: "", color: "", smell: "" },
    psf: { ...row(), level: "", color: "" },
    brake: { ...row(), level: "", color: "", capSealed: "", moisture: "" },
    washer: row(),
    transferSeep: { ...row(), wetness: "" },
    frontDiffSeep: { ...row(), seep: "" },
    rearDiffSeep: { ...row(), seep: "", pinion: "" },
  });
  const engine = (): EngineBaySection => ({
    notes: "",
    timingCover: { ...row(), noise: "", seconds: "", oilPressure: "" },
    manifolds: { ...row(), noise: "", soot: "" },
    idle: { ...row(), quality: "", cel: "" },
    belt: { ...row(), condition: "", tensionerPlay: "" },
    radiator: { ...row(), seeping: "" },
    atfLines: { ...row(), connected: "", wetFittings: "", bypassDone: "" },
    airFilter: { ...row(), condition: "", cabinDue: "" },
    battery: { ...row(), restV: "", runningV: "", terminalsClean: "", loadTest: "" },
    grounds: { ...row(), condition: "" },
    pcv: { ...row(), condition: "" },
    scan: { ...row(), stored: "", pending: "", atfTemp: "" },
  });
  const brakes = (): BrakesSection => ({
    notes: "",
    pads: { ...row(), lf: "", rf: "", lr: "", rr: "" },
    rotors: { ...row(), front: "", rear: "" },
    hoses: { ...row(), condition: "", wetCaliper: "" },
    master: { ...row(), seepage: "", pedalFirm: "" },
    pedalHeight: { ...row(), measured: "" },
    parking: { ...row(), clicks: "", holdsGrade: "" },
    absLamps: { ...row(), state: "" },
    tread: { ...row(), lf: "", rf: "", lr: "", rr: "", spare: "" },
    tireAge: { ...row(), lf: "", rf: "", lr: "", rr: "", spare: "" },
    wear: { ...row(), pattern: "" },
    pressures: { ...row(), lf: "", rf: "", lr: "", rr: "", spare: "" },
    lugTorque: { ...row(), rechecked: "" },
    bearings: { ...row(), lf: "", rf: "", lr: "", rr: "" },
    alignment: { ...row(), feel: "" },
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
      plan: null,
    },
    fluids: fluids(),
    engine: engine(),
    trans: { notes: "", rows: transRows, atfReject: false },
    brakes: brakes(),
    steering: { notes: "", items: mapItems(STEERING_ITEMS) },
    underbody: { notes: "", items: mapItems(UNDERBODY_ITEMS) },
    cabin: {
      notes: "",
      items: mapItems(CABIN_ITEMS),
      airbagLamp: "",
      recalls: { ...row(), checkedAt: "", vinChecked: "", ymm: "", source: "", campaigns: [] },
    },
    road: { notes: "", items: mapItems(ROAD_ITEMS), gaugeStable: "" },
    baseline: {
      notes: "",
      sparkPlugs: { ...row(), lastMiles: "", cycle: "", verdict: "" },
      coolantService: { ...row(), lastService: "", cap: "", thermostat: "", pumpWeep: "", verdict: "" },
      brakeFluid: { ...row(), lastFlush: "", verdict: "" },
      diffFluid: { ...row(), transfer: "", front: "", rear: "", verdict: "" },
      seepage: { ...row(), valveCover: "", timingCover: "", oilPan: "", verdict: "" },
      manifoldBolts: { ...row(), verdict: "" },
      ucaJoints: { ...row(), innerTaper: "", verdict: "" },
      airShocks: { ...row(), equipped: "", verdict: "" },
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
      smodPlan: { ...row(), radiatorLast: "", radiatorDate: "" },
    },
    smodAcknowledged: false,
    oilWaitStartedAt: null,
    atfIdle: false,
    atfCycled: false,
    atfHot: false,
    itemStatus: {},
    photoSkip: {},
    repairs: {},
    grokScan: {},
  };
}

export function emptySettings(): SettingsState {
  const who = remembered();
  return { toEmail: "", ccEmail: "", lastInspector: who.inspector, lastVin: who.vin };
}

