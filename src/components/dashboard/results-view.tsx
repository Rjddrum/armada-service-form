import { BookOpen, ChevronRight, Info } from "lucide-react";
import { ReportActions } from "@/components/report-actions";
import { useInspection } from "@/lib/inspection/store";
import { resultsModel, walkIndexForFlag, type HomeFilter, type ResultLine } from "@/lib/inspection/dashboard";
import { rowsForVin } from "@/lib/inspection/maint";
import {
  ESTIMATE_DISCLAIMER,
  printDealer,
  printRange,
  priorityLabel,
  repairTotals,
} from "@/lib/inspection/repairs";
import { formatShortDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TILES: { key: HomeFilter; emoji: string; label: string; sub: string }[] = [
  { key: "asap", emoji: "🚨", label: "Critical", sub: "Items requiring immediate attention." },
  { key: "attention", emoji: "🟠", label: "Repair soon", sub: "Recommended within the next service interval." },
  { key: "monitor", emoji: "🟡", label: "Monitor", sub: "Wear or watch items." },
  { key: "pass", emoji: "🟢", label: "Passed", sub: "In spec this visit." },
  { key: "na", emoji: "⚪", label: "Not inspected", sub: "In-visit rows left N/A or skipped." },
];

const TONE_CLASS: Record<string, string> = {
  incomplete: "border-border text-muted-foreground",
  pass: "border-pass text-pass",
  watch: "border-warn text-warn",
  repairs: "border-attention text-attention",
  critical: "border-fail text-fail",
};

function ItemCard({ item, onJump }: { item: ResultLine; onJump: () => void }) {
  const jumpToGuide = useInspection((s) => s.jumpToGuide);
  const openPlain = useInspection((s) => s.openPlain);
  return (
    <div className="hud-card space-y-2">
      {item.photos[0] ? (
        <img
          src={item.photos[0].shot.dataUrl}
          alt={item.photos[0].shot.caption || item.label}
          className="max-h-28 w-full rounded border border-border object-cover"
        />
      ) : null}
      {item.photos[0]?.shot.caption ? (
        <p className="text-sm text-muted-foreground">{item.photos[0].shot.caption}</p>
      ) : null}
      {item.grokLine ? <p className="text-sm text-muted-foreground">{item.grokLine}</p> : null}
      <button type="button" onClick={onJump} className="flex w-full items-start justify-between gap-2 text-left">
        <span className="min-w-0">
          <span className="block font-medium">{item.label}</span>
          {item.measured || item.range ? (
            <span className="mt-0.5 block text-sm text-muted-foreground">
              {item.measured || "—"}
              {item.range ? ` · ${item.range}` : ""}
            </span>
          ) : null}
        </span>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
      </button>
      {item.meaning ? <p className="text-sm leading-snug text-muted-foreground">{item.meaning}</p> : null}
      <div className="flex gap-2">
        {item.guideId ? (
          <button
            type="button"
            onClick={() => openPlain(item.guideId)}
            className="tap-56 inline-flex items-center gap-1 rounded border border-border bg-inset px-3 text-sm font-semibold"
          >
            <Info className="size-4" />
            What this means
          </button>
        ) : null}
        {item.guideId ? (
          <button
            type="button"
            onClick={() => jumpToGuide(item.guideId)}
            className="tap-56 inline-flex items-center gap-1 rounded border border-border bg-inset px-3 text-sm font-semibold"
          >
            <BookOpen className="size-4" />
            Guide
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function ResultsView() {
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
  const log = rowsForVin(maint, draft.header.vin);
  const submitted = Boolean(lastSubmitted && lastSubmitted.id === draft.id);
  const model = resultsModel(draft, photos, log, submitted);
  const totals = repairTotals(model.repairs);

  function jump(id: string) {
    setFilter(null);
    collapseAll();
    openWalk(walkIndexForFlag(draft, id));
  }

  const bits = [
    model.miles ? `${model.miles} miles` : null,
    model.date ? formatShortDate(model.date) : null,
    model.inspector || null,
    model.visit || null,
  ].filter(Boolean);
  const meta = [model.vin, model.drive, model.tow].filter(Boolean).join(" · ");

  if (filter) {
    const tile = TILES.find((t) => t.key === filter)!;
    const list = model.lists[filter];
    return (
      <div className="space-y-4 pb-8">
        <button type="button" onClick={() => setFilter(null)} className="tap-56 text-sm font-semibold text-primary">
          ← Results
        </button>
        <div>
          <h2 className="text-lg font-semibold">
            {tile.emoji} {tile.label}
          </h2>
          <p className="text-sm text-muted-foreground">{tile.sub}</p>
        </div>
        {list.length ? (
          <div className="space-y-3">
            {list.map((item) => (
              <ItemCard key={item.id} item={item} onJump={() => jump(item.id)} />
            ))}
          </div>
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
        <p className="text-sm text-muted-foreground">{bits.length ? bits.join(" · ") : "—"}</p>
        {meta ? <p className="font-mono text-xs text-faint">{meta}</p> : null}
      </div>

      <div className={cn("hud-card space-y-1 border-l-4", TONE_CLASS[model.tone])}>
        <p className="traveler-stamp text-xs">Overall condition</p>
        <p className="text-lg font-semibold tracking-wide">
          {model.condition.emoji} {model.condition.label}
        </p>
        <p className="reading text-sm">Vehicle health score: {model.score ?? 0}/100</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TILES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            className="hud-card tap-56 space-y-1 text-left"
          >
            <p className="text-sm font-medium">
              {t.emoji} {t.label} — {model.counts[t.key]}
            </p>
            <p className="text-xs leading-snug text-muted-foreground">{t.sub}</p>
          </button>
        ))}
      </div>

      <div className="hud-card space-y-2">
        <p className="traveler-stamp text-xs text-primary">Recommended next action</p>
        <p className="text-base font-medium leading-snug text-pretty">{model.next.text}</p>
        {model.tone === "incomplete" ? (
          <button
            type="button"
            onClick={() => {
              collapseAll();
              openWalk(model.next.walkIndex ?? 0);
            }}
            className="tap-56 w-full rounded bg-primary font-semibold text-primary-foreground"
          >
            Finish Walk
          </button>
        ) : null}
      </div>

      {model.repairs.length ? (
        <section className="hud-card space-y-2">
          <p className="traveler-stamp text-xs text-primary">Priority + estimated cost</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="py-1 pr-2 font-medium">Item</th>
                  <th className="py-1 pr-2 font-medium">Priority</th>
                  <th className="py-1 pr-2 font-medium">DIY</th>
                  <th className="py-1 pr-2 font-medium">Independent</th>
                  <th className="py-1 font-medium">Dealer</th>
                </tr>
              </thead>
              <tbody>
                {model.repairs.map((r) => (
                  <tr key={r.id} className="border-t border-border align-top">
                    <td className="py-2 pr-2">{r.title}</td>
                    <td className="py-2 pr-2">{priorityLabel(r.priority)}</td>
                    <td className="py-2 pr-2">{printRange(r.diy)}</td>
                    <td className="py-2 pr-2">{printRange(r.independent)}</td>
                    <td className="py-2">{printDealer(r)}</td>
                  </tr>
                ))}
                <tr className="border-t border-border font-medium">
                  <td className="py-2 pr-2" colSpan={2}>
                    Rough total (not a quote)
                  </td>
                  <td className="py-2 pr-2">{printRange(totals.diy)}</td>
                  <td className="py-2 pr-2">{printRange(totals.independent)}</td>
                  <td className="py-2">{printRange(totals.dealer)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">{ESTIMATE_DISCLAIMER}</p>
        </section>
      ) : null}

      {model.maintFlags.length ? (
        <ul className="space-y-1 text-sm">
          {model.maintFlags.map((f) => (
            <li key={f.key} className={f.tone === "alert" ? "text-fail" : "text-warn"}>
              {f.tone === "alert" ? "🔴" : "⚠️"} {f.text}
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        onClick={() => openReport()}
        className="tap-56 w-full rounded bg-primary font-semibold text-primary-foreground"
      >
        View full report
      </button>
      <ReportActions />
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => openFull()} className="tap-56 rounded border border-border bg-inset text-sm font-semibold">
          Full checklist
        </button>
        <button
          type="button"
          onClick={() => {
            collapseAll();
            openWalk(model.next.walkIndex ?? 0);
          }}
          className="tap-56 rounded border border-border bg-inset text-sm font-semibold"
        >
          Back to Walk
        </button>
      </div>
    </div>
  );
}
