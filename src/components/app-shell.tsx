import { useEffect, useState } from "react";
import { ChevronLeft, Settings } from "lucide-react";
import { ChecklistView } from "@/components/checklist/checklist-view";
import { GuideView } from "@/components/guide/guide-view";
import { SettingsSheet } from "@/components/settings-sheet";
import { ReportView } from "@/components/report-view";
import { PlainSheet } from "@/components/guide/plain-sheet";
import { HomeView } from "@/components/dashboard/home-view";
import { HistoryView } from "@/components/dashboard/history-view";
import { ReportsView } from "@/components/dashboard/reports-view";
import { ResultsView } from "@/components/dashboard/results-view";
import { useInspection } from "@/lib/inspection/store";
import { headerComplete } from "@/lib/inspection/types";
import { ProgressMeter } from "@/components/checklist/progress-meter";
import { installViewportLock } from "@/lib/viewport";
import { missingRequiredPhotos } from "@/lib/inspection/photo-slots";
import { formatSaved } from "@/lib/utils";

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
  const hydrated = useInspection((s) => s.hydrated);
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
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    void Promise.resolve(useInspection.persist.rehydrate()).then(() => {
      useInspection.getState().setHydrated();
    });
    const w = window as unknown as {
      __armadaPatch: typeof patch;
      __armadaGet: () => ReturnType<typeof useInspection.getState>;
    };
    w.__armadaPatch = useInspection.getState().patch;
    w.__armadaGet = () => useInspection.getState();
  }, [patch]);

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

  const ready = headerComplete(draft.header);
  const missingPhotos = missingRequiredPhotos(draft, photos);
  const onHome = tab === "home";
  const onResults = tab === "results";
  const walking = tab === "checklist" && mode === "walk";

  function onSubmit() {
    if (!requestSubmit()) return;
    markSubmitted("idle");
  }

  return (
    <div className="app-frame text-foreground">
      <header className="hud-header safe-top shrink-0">
        <div className="flex items-center justify-between gap-3 px-4 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            {onHome || onResults ? null : (
              <button
                type="button"
                onClick={goHome}
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
                onClick={() => setTab("checklist")}
                data-on={tab === "checklist" ? "true" : "false"}
                className="hud-seg-btn"
              >
                Inspect
              </button>
              <button
                type="button"
                onClick={() => {
                  clearGuideFocus();
                  setTab("guide");
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
        {tab === "results" ? <ResultsView /> : null}
        {tab === "checklist" ? <ChecklistView /> : null}
        {tab === "guide" ? <GuideView /> : null}
        {tab === "history" ? <HistoryView /> : null}
        {tab === "reports" ? <ReportsView /> : null}
      </main>

      {tab === "checklist" && mode === "full" ? (
        <div className="submit-bar border-t border-border px-4 pt-3">
          <button
            type="button"
            onClick={() => onSubmit()}
            disabled={!ready}
            className="tap-56 w-full rounded bg-primary font-mono text-sm font-semibold tracking-widest uppercase text-primary-foreground disabled:opacity-40"
          >
            {ready
              ? missingPhotos.length
                ? `${missingPhotos.length} photos required`
                : "Submit"
              : "Fill date, miles, inspector"}
          </button>
        </div>
      ) : null}

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <PlainSheet />
      <ReportView />
    </div>
  );
}
