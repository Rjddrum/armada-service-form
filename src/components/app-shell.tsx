import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, Settings } from "lucide-react";
import { HomeView } from "@/components/dashboard/home-view";
import { useInspection } from "@/lib/inspection/store";
import { ProgressMeter } from "@/components/checklist/progress-meter";
import { installViewportLock } from "@/lib/viewport";
import { formatSaved } from "@/lib/utils";

const ChecklistView = lazy(() =>
  import("@/components/checklist/checklist-view").then((m) => ({ default: m.ChecklistView })),
);
const GuideView = lazy(() => import("@/components/guide/guide-view").then((m) => ({ default: m.GuideView })));
const SettingsSheet = lazy(() =>
  import("@/components/settings-sheet").then((m) => ({ default: m.SettingsSheet })),
);
const ReportView = lazy(() => import("@/components/report-view").then((m) => ({ default: m.ReportView })));
const PlainSheet = lazy(() => import("@/components/guide/plain-sheet").then((m) => ({ default: m.PlainSheet })));
const HistoryView = lazy(() =>
  import("@/components/dashboard/history-view").then((m) => ({ default: m.HistoryView })),
);
const ReportsView = lazy(() =>
  import("@/components/dashboard/reports-view").then((m) => ({ default: m.ReportsView })),
);
const ResultsView = lazy(() =>
  import("@/components/dashboard/results-view").then((m) => ({ default: m.ResultsView })),
);

function ChunkFallback() {
  return (
    <div className="hud-card py-10">
      <p className="text-center text-xl font-semibold tracking-wide text-foreground">Loading…</p>
    </div>
  );
}

function LazyPane({ children }: { children: ReactNode }) {
  return <Suspense fallback={<ChunkFallback />}>{children}</Suspense>;
}

function SavedStamp() {
  const lastSavedAt = useInspection((s) => s.lastSavedAt);
  const saveError = useInspection((s) => s.saveError);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  if (saveError) {
    return <p className="max-w-[10rem] text-right text-xs font-semibold leading-snug text-fail">{saveError}</p>;
  }
  if (!lastSavedAt) return null;
  return (
    <p className="text-xs font-semibold tracking-wide text-foreground">{formatSaved(lastSavedAt, now)}</p>
  );
}

export function AppShell() {
  const tab = useInspection((s) => s.tab);
  const mode = useInspection((s) => s.checklistMode);
  const headerReady = useInspection((s) => s.headerReady);
  const missingPhotoCount = useInspection((s) => s.missingRequiredPhotoCount);
  const plainId = useInspection((s) => s.plainId);
  const reportOpen = useInspection((s) => s.successOpen);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    void Promise.resolve(useInspection.persist.rehydrate()).then(() => {
      useInspection.getState().setHydrated();
    });
    const w = window as unknown as {
      __armadaPatch: ReturnType<typeof useInspection.getState>["patch"];
      __armadaGet: () => ReturnType<typeof useInspection.getState>;
    };
    w.__armadaPatch = useInspection.getState().patch;
    w.__armadaGet = () => useInspection.getState();
  }, []);

  useEffect(() => installViewportLock(), []);

  useEffect(() => {
    const flush = () => useInspection.getState().flushPersist();
    const onVis = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", flush);
    document.addEventListener("freeze", flush as EventListener);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("freeze", flush as EventListener);
    };
  }, []);

  const onHome = tab === "home";
  const onResults = tab === "results";
  const walking = tab === "checklist" && mode === "walk";

  function onSubmit() {
    const s = useInspection.getState();
    if (!s.requestSubmit()) return;
    s.markSubmitted("idle");
  }

  return (
    <div className="app-frame text-foreground">
      <header className="hud-header safe-top shrink-0">
        <div className="flex items-center justify-between gap-3 px-4 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            {onHome || onResults ? null : (
              <button
                type="button"
                onClick={() => useInspection.getState().goHome()}
                className="tap-56 grid place-items-center rounded border border-border bg-raised"
                aria-label="Dashboard"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            <div className="min-w-0">
              <p className="traveler-stamp text-xs text-primary">Sys · VK56DE · RE5R05A</p>
              <h1 className="truncate text-lg font-semibold tracking-tight text-balance">
                {onHome
                  ? "2005 Armada"
                  : onResults
                    ? "Results"
                    : tab === "guide"
                      ? "How-to"
                      : walking
                        ? "Walk the truck"
                        : tab === "history"
                          ? "History"
                          : tab === "reports"
                            ? "Saved reports"
                            : "Checklist"}
              </h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex min-w-0 flex-col items-end gap-0.5">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-faint">
                <span className="hud-led" aria-hidden />
                Local
              </span>
              <SavedStamp />
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="tap-56 grid place-items-center rounded border border-border bg-raised"
              aria-label="Settings"
            >
              <Settings className="size-5" />
            </button>
          </div>
        </div>
        {!onHome && (tab === "checklist" || tab === "guide") ? (
          <div className="px-4 pt-3">
            <ProgressMeter />
          </div>
        ) : null}
        {!onHome && !onResults && tab !== "history" && tab !== "reports" ? (
          <div className="px-4 py-3">
            <div className="hud-seg">
              <button
                type="button"
                onClick={() => useInspection.getState().setTab("checklist")}
                data-on={tab === "checklist" ? "true" : "false"}
                className="hud-seg-btn"
              >
                Inspect
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = useInspection.getState();
                  s.clearGuideFocus();
                  s.setTab("guide");
                }}
                data-on={tab === "guide" ? "true" : "false"}
                className="hud-seg-btn"
              >
                Guide
              </button>
            </div>
          </div>
        ) : (
          <div className="h-3" />
        )}
      </header>

      <main className="app-scroll mx-auto w-full max-w-xl px-4 pt-4 pb-4">
        {tab === "home" ? <HomeView /> : null}
        {tab === "results" ? (
          <LazyPane>
            <ResultsView />
          </LazyPane>
        ) : null}
        {tab === "checklist" ? (
          <LazyPane>
            <ChecklistView />
          </LazyPane>
        ) : null}
        {tab === "guide" ? (
          <LazyPane>
            <GuideView />
          </LazyPane>
        ) : null}
        {tab === "history" ? (
          <LazyPane>
            <HistoryView />
          </LazyPane>
        ) : null}
        {tab === "reports" ? (
          <LazyPane>
            <ReportsView />
          </LazyPane>
        ) : null}
      </main>

      {tab === "checklist" && mode === "full" ? (
        <div className="submit-bar border-t border-border px-4 pt-3">
          <button
            type="button"
            onClick={() => onSubmit()}
            disabled={!headerReady}
            className="tap-56 w-full rounded bg-primary font-mono text-sm font-semibold tracking-widest uppercase text-primary-foreground disabled:opacity-40"
          >
            {headerReady
              ? missingPhotoCount > 0
                ? `${missingPhotoCount} photos required`
                : "Submit"
              : "Fill date, miles, inspector"}
          </button>
        </div>
      ) : null}

      {settingsOpen ? (
        <LazyPane>
          <SettingsSheet open onClose={() => setSettingsOpen(false)} />
        </LazyPane>
      ) : null}
      {plainId ? (
        <LazyPane>
          <PlainSheet />
        </LazyPane>
      ) : null}
      {reportOpen ? (
        <LazyPane>
          <ReportView />
        </LazyPane>
      ) : null}
    </div>
  );
}
