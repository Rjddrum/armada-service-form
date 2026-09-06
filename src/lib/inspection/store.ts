import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { emptyDraft, emptySettings, rememberPeople } from "./defaults";
import {
  headerComplete,
  isDraftStarted,
  isSmodRisk,
  ALL_SECTION_IDS,
  type InspectionDraft,
  type SectionId,
  type SettingsState,
} from "./types";
import { coerceOverall, driveGates, isPassValue } from "./drive";
import { applyAutoStatuses, overallBlocked } from "./status";
import { missingRequiredPhotos } from "./photo-slots";
import { buildPlan, flagsFromPlan } from "./plan";
import {
  alreadyLogged,
  emptyMaint,
  emptyMaintRow,
  patchRows,
  rekeyMaint,
  rowsForVin,
  type MaintRow,
  type MaintState,
} from "./maint";
import {
  clearAllPhotos,
  deletePhoto,
  loadPhotos,
  prunePhotos,
  putPhoto,
  type PhotoShot,
} from "./photos";

const DRAFT_KEY = "armada-inspection-draft-v1";
const ARCHIVE_KEY = "armada-inspection-archive-v1";
const SETTINGS_KEY = "armada-inspection-settings-v1";
const LAST_KEY = "armada-inspection-last-v1";
const LAST_SAVED_KEY = "armada-last-saved-at-v1";

const TAB_IDS = ["home", "checklist", "guide", "history", "reports", "results"] as const;

export type TabId = "home" | "checklist" | "guide" | "history" | "reports" | "results";
export type ChecklistMode = "full" | "walk";
export type HomeFilter = "asap" | "attention" | "monitor" | "pass" | "na" | null;

interface InspectionState {
  hydrated: boolean;
  draft: InspectionDraft;
  settings: SettingsState;
  archive: InspectionDraft[];
  lastSubmitted: InspectionDraft | null;
  tab: TabId;
  checklistMode: ChecklistMode;
  walkIndex: number;
  homeFilter: HomeFilter;
  guideTarget: string | null;
  guideFocus: string | null;
  openSections: SectionId[];
  successOpen: boolean;
  lastEmailStatus: "idle" | "sent" | "skipped" | "failed" | "unconfigured";
  lastEmailError: string;
  headerHighlight: boolean;
  photoHighlight: boolean;
  photos: Record<string, PhotoShot>;
  maint: MaintState;
  plainId: string | null;
  lastSavedAt: number;
  saveError: string;
  grokBusy: Record<string, boolean>;
  grokError: Record<string, string>;
  setHydrated: () => void;
  setTab: (tab: TabId) => void;
  setChecklistMode: (mode: ChecklistMode) => void;
  setWalkIndex: (i: number) => void;
  goHome: () => void;
  openWalk: (index?: number) => void;
  openFull: () => void;
  setHomeFilter: (filter: HomeFilter) => void;
  openReport: () => void;
  openResults: () => void;
  jumpToGuide: (stepId: string) => void;
  openPlain: (id: string) => void;
  closePlain: () => void;
  clearGuideTarget: () => void;
  clearGuideFocus: () => void;
  toggleSection: (id: SectionId) => void;
  ensureSectionOpen: (id: SectionId) => void;
  expandAll: () => void;
  collapseAll: () => void;
  patch: (fn: (d: InspectionDraft) => void) => void;
  setSettings: (patch: Partial<SettingsState>) => void;
  resetDraft: () => void;
  startNew: () => void;
  restoreArchive: (id: string) => void;
  clearArchives: () => void;
  markSubmitted: (emailStatus: InspectionState["lastEmailStatus"], err?: string) => void;
  saveToHistory: () => void;
  closeSuccess: () => void;
  keepEditing: () => void;
  requestSubmit: () => boolean;
  setPhoto: (slot: string, shot: PhotoShot) => void;
  clearPhoto: (slot: string) => void;
  setPhotoSkip: (slot: string, reason: string) => void;
  patchMaint: (fn: (rows: MaintRow[]) => MaintRow[]) => void;
  addMaintRow: (over?: Partial<MaintRow>) => void;
  removeMaintRow: (id: string) => void;
  logOilChange: () => boolean;
  clearMaint: () => void;
  touchSave: () => void;
  setSaveError: (msg: string) => void;
  flushPersist: () => void;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function markSaved(): number {
  const t = Date.now();
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LAST_SAVED_KEY, String(t));
    } catch {
      /* quota on sidecar is non-fatal */
    }
  }
  return t;
}

function readSavedAt(): number {
  if (typeof window === "undefined") return 0;
  try {
    const n = Number(localStorage.getItem(LAST_SAVED_KEY) || "0");
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

type PersistSlice = {
  draft: InspectionDraft;
  openSections: SectionId[];
  checklistMode: ChecklistMode;
  walkIndex: number;
  maint: MaintState;
  tab: TabId;
};

function persistSlice(s: PersistSlice): PersistSlice {
  return {
    draft: s.draft,
    openSections: s.openSections,
    checklistMode: s.checklistMode,
    walkIndex: s.walkIndex,
    maint: s.maint,
    tab: s.tab,
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
          if (useInspection.getState().saveError !== msg) {
            useInspection.setState({ saveError: msg });
          }
        });
      }
    },
    removeItem: (name) => {
      try {
        localStorage.removeItem(name);
      } catch {
        /* */
      }
    },
  }));
}

function pushArchive(current: InspectionDraft, archive: InspectionDraft[]) {
  if (!isDraftStarted(current)) return archive;
  const next = [
    { ...structuredClone(current), updatedAt: Date.now() },
    ...archive.filter((a) => a.id !== current.id),
  ];
  return next.slice(0, 10);
}

function hydrateDraft(raw: InspectionDraft): InspectionDraft {
  const base = emptyDraft();
  const draft: InspectionDraft = {
    ...base,
    ...raw,
    header: { ...base.header, ...raw.header },
    fluids: {
      ...base.fluids,
      ...raw.fluids,
      coolant: { ...base.fluids.coolant, ...raw.fluids?.coolant },
      brake: { ...base.fluids.brake, ...raw.fluids?.brake },
    },
    engine: {
      ...base.engine,
      ...raw.engine,
      timingCover: { ...base.engine.timingCover, ...raw.engine?.timingCover },
      battery: { ...base.engine.battery, ...raw.engine?.battery },
    },
    trans: { ...base.trans, ...raw.trans, rows: { ...base.trans.rows, ...raw.trans?.rows } },
    brakes: {
      ...base.brakes,
      ...raw.brakes,
      lugTorque: { ...base.brakes.lugTorque, ...raw.brakes?.lugTorque },
    },
    steering: { ...base.steering, ...raw.steering, items: { ...base.steering.items, ...raw.steering?.items } },
    underbody: { ...base.underbody, ...raw.underbody, items: { ...base.underbody.items, ...raw.underbody?.items } },
    cabin: {
      ...base.cabin,
      ...raw.cabin,
      items: { ...base.cabin.items, ...raw.cabin?.items },
      airbagLamp: raw.cabin?.airbagLamp ?? base.cabin.airbagLamp,
      recalls: { ...base.cabin.recalls, ...raw.cabin?.recalls, campaigns: raw.cabin?.recalls?.campaigns ?? base.cabin.recalls.campaigns },
    },
    road: { ...base.road, ...raw.road, items: { ...base.road.items, ...raw.road?.items } },
    baseline: {
      ...base.baseline,
      ...raw.baseline,
      sparkPlugs: { ...base.baseline.sparkPlugs, ...raw.baseline?.sparkPlugs },
      coolantService: { ...base.baseline.coolantService, ...raw.baseline?.coolantService },
      brakeFluid: { ...base.baseline.brakeFluid, ...raw.baseline?.brakeFluid },
      diffFluid: { ...base.baseline.diffFluid, ...raw.baseline?.diffFluid },
      seepage: { ...base.baseline.seepage, ...raw.baseline?.seepage },
      manifoldBolts: { ...base.baseline.manifoldBolts, ...raw.baseline?.manifoldBolts },
      ucaJoints: { ...base.baseline.ucaJoints, ...raw.baseline?.ucaJoints },
      airShocks: { ...base.baseline.airShocks, ...raw.baseline?.airShocks },
    },
    result: {
      ...base.result,
      ...raw.result,
      smodPlan: { ...base.result.smodPlan, ...raw.result?.smodPlan },
    },
    oilWaitStartedAt: raw.oilWaitStartedAt ?? null,
    atfIdle: Boolean(raw.atfIdle),
    atfCycled: Boolean(raw.atfCycled),
    atfHot: Boolean(raw.atfHot),
    smodAcknowledged: Boolean(raw.smodAcknowledged),
    itemStatus: raw.itemStatus && typeof raw.itemStatus === "object" ? raw.itemStatus : {},
    photoSkip: raw.photoSkip && typeof raw.photoSkip === "object" ? raw.photoSkip : {},
    repairs: raw.repairs && typeof raw.repairs === "object" ? raw.repairs : {},
    grokScan: raw.grokScan && typeof raw.grokScan === "object" ? raw.grokScan : {},
  };
  if (draft.header.visitType === "recommended") {
    draft.header.plan = flagsFromPlan(buildPlan(draft, []));
  }
  return draft;
}

function applyPlan(draft: InspectionDraft, maint: MaintState) {
  if (draft.header.visitType === "recommended") {
    draft.header.plan = flagsFromPlan(buildPlan(draft, rowsForVin(maint, draft.header.vin)));
  }
}

export const useInspection = create<InspectionState>()(
  persist(
    (set, get) => ({
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
        const who = { inspector: "", vin: "" };
        if (typeof window !== "undefined") {
          try {
            who.inspector = localStorage.getItem("armada-last-inspector-v1") || "";
            who.vin = localStorage.getItem("armada-last-vin-v1") || "";
          } catch {
            /* */
          }
        }
        const settingsRaw = readJson<SettingsState>(SETTINGS_KEY, get().settings);
        const settings: SettingsState = {
          ...settingsRaw,
          lastInspector: settingsRaw.lastInspector || who.inspector,
          lastVin: settingsRaw.lastVin || who.vin,
        };
        const archive = readJson<InspectionDraft[]>(ARCHIVE_KEY, get().archive);
        const lastSubmitted = readJson<InspectionDraft | null>(LAST_KEY, null);
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
          lastSavedAt: readSavedAt(),
        });
        void loadPhotos(draftId).then((photos) => {
          if (get().draft.id === draftId) set({ photos });
        });
      },
      setTab: (tab) => set({ tab }),
      setChecklistMode: (mode) => set({ checklistMode: mode, tab: "checklist" }),
      setWalkIndex: (i) => set({ walkIndex: Math.max(0, Math.round(i)), lastSavedAt: markSaved() }),
      goHome: () => set({ tab: "home", homeFilter: null, successOpen: false }),
      openWalk: (index) =>
        set((s) => ({
          tab: "checklist" as const,
          checklistMode: "walk" as const,
          walkIndex: Math.max(0, Math.round(index ?? s.walkIndex)),
          homeFilter: null,
        })),
      openFull: () => set({ tab: "checklist", checklistMode: "full", homeFilter: null }),
      setHomeFilter: (filter) => set({ homeFilter: filter }),
      openReport: () => set({ successOpen: true }),
      openResults: () => set({ tab: "results", homeFilter: null, successOpen: false }),
      jumpToGuide: (stepId) => set({ tab: "guide", guideTarget: stepId, guideFocus: stepId, plainId: null }),
      openPlain: (id) => set({ plainId: id }),
      closePlain: () => set({ plainId: null }),
      clearGuideTarget: () => set({ guideTarget: null }),
      clearGuideFocus: () => set({ guideFocus: null, guideTarget: null }),
      toggleSection: (id) =>
        set((s) => ({
          openSections: s.openSections.includes(id)
            ? s.openSections.filter((x) => x !== id)
            : [...s.openSections, id],
        })),
      ensureSectionOpen: (id) =>
        set((s) =>
          s.openSections.includes(id) ? s : { openSections: [...s.openSections, id] },
        ),
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
        if (overallBlocked(next) && isPassValue(next.result.overall)) {
          next.result.overall = driveGates(next).length ? "do-not-drive" : "schedule";
        }
        rememberPeople(next.header.inspector, next.header.vin);
        set({ draft: next, maint, headerHighlight: false, lastSavedAt: markSaved(), saveError: "" });
      },
      setSettings: (patch) => {
        const settings = { ...get().settings, ...patch };
        writeJson(SETTINGS_KEY, settings);
        rememberPeople(settings.lastInspector, settings.lastVin);
        set({ settings });
      },
      resetDraft: () => set({ draft: emptyDraft(), successOpen: false, photos: {}, grokBusy: {}, grokError: {} }),
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
          grokError: {},
        });
        void prunePhotos([nextDraft.id, ...nextArchive.map((a) => a.id), lastSubmitted?.id ?? ""]);
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
          photos: {},
        });
        void loadPhotos(found.id).then((photos) => {
          if (get().draft.id === found.id) set({ photos });
        });
      },
      clearArchives: () => {
        writeJson(ARCHIVE_KEY, []);
        writeJson(LAST_KEY, null);
        writeJson(DRAFT_KEY, emptyDraft());
        void clearAllPhotos();
        set({ archive: [], lastSubmitted: null, draft: emptyDraft(), photos: {} });
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
          archive,
        });
      },
      saveToHistory: () => {
        const draft = structuredClone(get().draft);
        writeJson(LAST_KEY, draft);
        const archive = pushArchive(draft, get().archive);
        writeJson(ARCHIVE_KEY, archive);
        set({ lastSubmitted: draft, archive });
      },
      closeSuccess: () => set({ successOpen: false }),
      keepEditing: () => set({ successOpen: false, tab: "results" }),
      requestSubmit: () => {
        if (!headerComplete(get().draft.header)) {
          set((s) => ({
            headerHighlight: true,
            tab: "home",
            walkIndex: s.checklistMode === "walk" ? 0 : s.walkIndex,
            openSections: s.openSections.includes("header")
              ? s.openSections
              : [...s.openSections, "header"],
          }));
          return false;
        }
        const missing = missingRequiredPhotos(get().draft, get().photos);
        if (missing.length) {
          set({ photoHighlight: true, tab: "checklist" });
          return false;
        }
        set({ photoHighlight: false });
        return true;
      },
      setPhoto: (slot, shot) => {
        const draft = structuredClone(get().draft);
        if (draft.photoSkip?.[slot]) delete draft.photoSkip[slot];
        draft.updatedAt = Date.now();
        const photos = { ...get().photos, [slot]: shot };
        set({ photos, draft, photoHighlight: false, lastSavedAt: markSaved(), saveError: "" });
        void putPhoto(draft.id, slot, shot)
          .then(() => {
            get().touchSave();
          })
          .catch(() => {
            get().setSaveError("Could not save — free space or export PDF now.");
          });
      },
      clearPhoto: (slot) => {
        const draft = get().draft;
        const photos = { ...get().photos };
        delete photos[slot];
        set({ photos, draft: { ...draft, updatedAt: Date.now() }, lastSavedAt: markSaved() });
        void deletePhoto(draft.id, slot);
      },
      setPhotoSkip: (slot, reason) => {
        const draft = structuredClone(get().draft);
        if (!draft.photoSkip) draft.photoSkip = {};
        if (reason.trim()) draft.photoSkip[slot] = reason.trim();
        else delete draft.photoSkip[slot];
        draft.updatedAt = Date.now();
        set({ draft, photoHighlight: false, lastSavedAt: markSaved() });
      },
      patchMaint: (fn) => {
        const vin = get().draft.header.vin;
        const rows = fn(rowsForVin(get().maint, vin).map((r) => ({ ...r })));
        const maint = patchRows(get().maint, vin, rows);
        const draft = structuredClone(get().draft);
        applyPlan(draft, maint);
        applyAutoStatuses(draft, get().photos);
        coerceOverall(draft);
        set({ maint, draft, lastSavedAt: markSaved() });
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
        const rows = rowsForVin(get().maint, draft.header.vin);
        if (alreadyLogged(rows, "oil-change", miles)) return false;
        const notes = [draft.result.oilType, draft.result.oilAmount, draft.result.oilFilterPn]
          .map((s) => s.trim())
          .filter(Boolean)
          .join(" · ");
        get().addMaintRow({
          service: "oil-change",
          miles: miles.replace(/[^\d]/g, ""),
          date: draft.header.date || draft.result.signDate,
          notes,
        });
        return true;
      },
      clearMaint: () => {
        const maint = emptyMaint();
        const draft = structuredClone(get().draft);
        applyPlan(draft, maint);
        set({ maint, draft });
      },
      touchSave: () => set({ lastSavedAt: markSaved(), saveError: "" }),
      setSaveError: (msg) => set({ saveError: msg }),
      flushPersist: () => {
        const s = get();
        const ok = writeJson(DRAFT_KEY, {
          state: persistSlice(s),
          version: 0,
        });
        if (!ok) {
          set({ saveError: "Could not save — free space or export PDF now." });
          return;
        }
        set({ lastSavedAt: markSaved(), saveError: "" });
      },
    }),
    {
      name: DRAFT_KEY,
      storage: persistStorage(),
      partialize: (s) => persistSlice(s),
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<InspectionState>;
        const openSections = Array.isArray(p.openSections)
          ? p.openSections.filter((id): id is SectionId =>
              (ALL_SECTION_IDS as readonly string[]).includes(id),
            )
          : current.openSections;
        const checklistMode =
          p.checklistMode === "walk" || p.checklistMode === "full"
            ? p.checklistMode
            : current.checklistMode;
        const walkIndex =
          typeof p.walkIndex === "number" && Number.isFinite(p.walkIndex)
            ? Math.max(0, Math.round(p.walkIndex))
            : current.walkIndex;
        const tab = TAB_IDS.includes(p.tab as TabId) ? (p.tab as TabId) : current.tab;
        const draft = p.draft ? hydrateDraft(p.draft) : current.draft;
        const maint =
          p.maint && p.maint.trucks && typeof p.maint.trucks === "object" ? p.maint : current.maint;
        applyPlan(draft, maint);
        return { ...current, ...p, openSections, checklistMode, walkIndex, tab, draft, maint };
      },
    },
  ),
);
