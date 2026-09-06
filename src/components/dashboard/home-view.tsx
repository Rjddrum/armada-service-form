import { ChevronRight } from "lucide-react";
import { HeaderFields } from "@/components/checklist/header-fields";
import { ProgressMeter } from "@/components/checklist/progress-meter";
import { useInspection } from "@/lib/inspection/store";
import { homeModel, walkIndexForFlag, type HomeFilter } from "@/lib/inspection/dashboard";
import { rowsForVin } from "@/lib/inspection/maint";
import { VISIT_TYPES, type VisitType } from "@/lib/inspection/types";
import { buildPlan, flagsFromPlan } from "@/lib/inspection/plan";
import { formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const COUNT_TILES: { key: HomeFilter; emoji: string; label: string }[] = [
  { key: "asap", emoji: "🚨", label: "Critical issues" },
  { key: "attention", emoji: "⚠️", label: "Recommended repairs" },
  { key: "monitor", emoji: "👀", label: "Monitor" },
  { key: "pass", emoji: "✅", label: "Passed" },
];

const TONE_CLASS: Record<string, string> = {
  idle: "border-border text-muted-foreground",
  pass: "border-pass text-pass",
  watch: "border-warn text-warn",
  repairs: "border-attention text-attention",
  critical: "border-fail text-fail",
};

export function HomeView() {
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
  const submitted = Boolean(lastSubmitted && lastSubmitted.id === draft.id);
  const model = homeModel(draft, photos, log, submitted);

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

  function force(v: VisitType) {
    patch((d) => {
      d.header.visitType = v;
      d.header.plan = v === "recommended" ? flagsFromPlan(buildPlan(d, log)) : null;
    });
  }

  const bits = [
    model.miles ? `${model.miles} miles` : null,
    model.date ? formatShortDate(model.date) : null,
    model.visit || null,
  ].filter(Boolean);
  const meta = [model.vin, model.drive, model.tow].filter(Boolean).join(" · ");

  if (filter) {
    const list = model.lists[filter];
    const tile = COUNT_TILES.find((t) => t.key === filter)!;
    return (
      <div className="space-y-4">
        <button type="button" onClick={() => setFilter(null)} className="tap-56 text-sm font-semibold text-primary">
          ← Dashboard
        </button>
        <h2 className="text-lg font-semibold">
          {tile.emoji} {tile.label}
        </h2>
        {list.length ? (
          <ul className="space-y-2">
            {list.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setFilter(null);
                    collapseAll();
                    openWalk(walkIndexForFlag(draft, item.id));
                  }}
                  className="hud-card flex w-full items-center justify-between gap-2 text-left"
                >
                  <span className="min-w-0">
                    <span className="block font-medium">{item.label}</span>
                    {item.measured ? <span className="text-sm text-muted-foreground">{item.measured}</span> : null}
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">None on this visit.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="hud-card space-y-1">
        <p className="text-2xl leading-none">🚙</p>
        <h2 className="text-xl font-semibold tracking-tight">2005 Nissan Armada</h2>
        <p className="text-sm text-muted-foreground">{bits.length ? bits.join(" · ") : "Fill date, miles, inspector"}</p>
        {meta ? <p className="font-mono text-xs text-faint">{meta}</p> : null}
      </div>

      <div className={cn("hud-card space-y-1 border-l-4", TONE_CLASS[model.worry.tone])}>
        <p className="traveler-stamp text-xs">Overall condition</p>
        <p className="text-lg font-semibold">
          {model.worry.emoji} {model.worry.label}
        </p>
        <p className="text-sm text-foreground">{model.worry.line}</p>
        {model.score != null ? (
          <p className="reading text-sm text-muted-foreground">Vehicle condition score {model.score}/100</p>
        ) : null}
      </div>

      <div className="hud-card">
        <ProgressMeter etaPrefix="Est. time left" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {COUNT_TILES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            className="hud-card tap-56 space-y-0.5 text-left"
          >
            <p className="text-sm">
              {t.emoji} {t.label}
            </p>
            <p className="reading text-lg text-primary">{model.counts[t.key]}</p>
          </button>
        ))}
      </div>

      <div className="hud-card space-y-2">
        <p className="traveler-stamp text-xs text-primary">Next recommended action</p>
        <p className="text-base font-medium leading-snug text-pretty">{model.next.text}</p>
      </div>

      {model.submitted ? (
        <button
          type="button"
          onClick={() => openResults()}
          className="tap-56 w-full rounded bg-primary font-semibold text-primary-foreground"
        >
          View results
        </button>
      ) : (
        <button
          type="button"
          onClick={startOrContinue}
          className="tap-56 w-full rounded bg-primary font-semibold text-primary-foreground"
        >
          {model.started ? "Continue inspection" : "Start Walk the Truck"}
        </button>
      )}
      {model.started && !model.submitted ? (
        <button
          type="button"
          onClick={() => openResults()}
          className="tap-56 w-full rounded border border-border bg-raised font-semibold"
        >
          {model.incomplete ? "View results (incomplete)" : "View results"}
        </button>
      ) : null}

      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={() => openFull()} className="tap-56 rounded border border-border bg-inset text-sm font-semibold">
          Full checklist
        </button>
        <button type="button" onClick={() => setTab("history")} className="tap-56 rounded border border-border bg-inset text-sm font-semibold">
          History
        </button>
        <button type="button" onClick={() => setTab("reports")} className="tap-56 rounded border border-border bg-inset text-sm font-semibold">
          Saved reports
        </button>
      </div>

      <details className="hud-card">
        <summary className="tap-56 cursor-pointer font-semibold">Vehicle</summary>
        <div className="space-y-3 pt-2">
          <HeaderFields highlight={highlight} />
          <p className="field-label">Visit type</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => force("recommended")}
              className={cn(
                "tap-56 rounded border px-3 font-mono text-xs font-medium",
                draft.header.visitType === "recommended" ? "chip-on" : "chip-off text-foreground",
              )}
            >
              From mileage
            </button>
            {VISIT_TYPES.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => force(v.value)}
                className={cn(
                  "tap-56 rounded border px-3 font-mono text-xs font-medium",
                  draft.header.visitType === v.value ? "chip-on" : "chip-off text-foreground",
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
