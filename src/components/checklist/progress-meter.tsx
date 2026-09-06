import { useInspection } from "@/lib/inspection/store";
import { inspectionProgress } from "@/lib/inspection/progress";
import { cn } from "@/lib/utils";

export function ProgressMeter({ etaPrefix = "Estimated time remaining" }: { etaPrefix?: string }) {
  const draft = useInspection((s) => s.draft);
  const mode = useInspection((s) => s.checklistMode);
  const tab = useInspection((s) => s.tab);
  const walkIndex = useInspection((s) => s.walkIndex);
  const p = inspectionProgress(draft);
  const walking = tab === "checklist" && mode === "walk" && p.total > 0;
  const step = walking ? Math.min(walkIndex, Math.max(0, p.total - 1)) + 1 : 0;
  const width = p.total ? p.percent : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <p className="traveler-stamp text-xs text-primary">Inspection progress</p>
        {walking ? (
          <p className="font-mono text-xs text-muted-foreground">
            Step {step} of {p.total}
          </p>
        ) : null}
      </div>
      <div
        className="progress-meter"
        role="progressbar"
        aria-label="Inspection progress"
        aria-valuemin={0}
        aria-valuemax={p.total || 0}
        aria-valuenow={p.done}
      >
        <div className={cn("progress-meter-fill")} style={{ width: `${width}%` }} />
      </div>
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <p className="reading text-sm text-primary">{p.total ? p.line : p.ready ? "0 / 0 complete" : "—"}</p>
        <p className="text-xs leading-snug text-muted-foreground">
          {etaPrefix}: {p.remainingLabel}
        </p>
      </div>
    </div>
  );
}