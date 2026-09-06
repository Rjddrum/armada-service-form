import { VISIT_TYPES, type VisitType } from "@/lib/inspection/types";
import { buildPlan, flagsFromPlan, type RecLine, type RecTone } from "@/lib/inspection/plan";
import { rowsForVin, type MaintFlag } from "@/lib/inspection/maint";
import { useInspection } from "@/lib/inspection/store";
import { PlainButton } from "@/components/guide/plain-sheet";
import { cn } from "@/lib/utils";

function mark(tone: RecTone): string {
  if (tone === "due") return "✅";
  if (tone === "watch") return "⚠️";
  return "Skip / not due:";
}

function Line({ line }: { line: RecLine }) {
  return (
    <li className="space-y-1">
      <p className="text-sm leading-snug text-foreground">
        <span className="mr-1">{line.tone === "skip" ? "" : mark(line.tone)}</span>
        {line.tone === "skip" ? <span className="text-muted-foreground">Skip / not due: {line.label}</span> : line.label}
      </p>
      {line.note ? <p className="pl-6 text-xs leading-snug text-muted-foreground">{line.note}</p> : null}
      {line.tone === "watch" && line.guideId ? <PlainButton id={line.guideId} title={line.label} /> : null}
    </li>
  );
}

function FlagLine({ flag }: { flag: MaintFlag }) {
  return (
    <li className="space-y-1">
      <p className={cn("text-sm leading-snug", flag.tone === "alert" ? "text-fail" : "text-warn")}>
        {flag.tone === "alert" ? "🔴" : "⚠️"} {flag.text}
      </p>
      {flag.guideId ? <PlainButton id={flag.guideId} title={flag.text} /> : null}
    </li>
  );
}

export function RecCard() {
  const draft = useInspection((s) => s.draft);
  const maint = useInspection((s) => s.maint);
  const patch = useInspection((s) => s.patch);
  const setMode = useInspection((s) => s.setChecklistMode);
  const setWalk = useInspection((s) => s.setWalkIndex);
  const collapseAll = useInspection((s) => s.collapseAll);
  const log = rowsForVin(maint, draft.header.vin);
  const plan = buildPlan(draft, log);
  const visit = draft.header.visitType;
  if (!plan.miles) {
    return (
      <div className="hud-card space-y-2">
        <p className="traveler-stamp text-xs text-primary">Mileage picks the inspection</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Type current miles. The maintenance log (if you have one) is used first; blank history uses the safer list.
        </p>
      </div>
    );
  }

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

  function force(v: VisitType) {
    patch((d) => {
      d.header.visitType = v;
      d.header.plan = v === "recommended" ? flagsFromPlan(plan) : null;
    });
    setMode("walk");
    setWalk(0);
    collapseAll();
  }

  return (
    <div className="hud-card space-y-3">
      <p className="traveler-stamp text-xs text-primary">Based on {plan.miles.toLocaleString("en-US")} miles, we recommend</p>
      {plan.flags.length ? (
        <ul className="space-y-2">
          {plan.flags.map((f) => (
            <FlagLine key={f.key} flag={f} />
          ))}
        </ul>
      ) : log.length === 0 && plan.unknownHistory ? (
        <p className="text-xs leading-snug text-warn">No maintenance log — treating history as unknown (safer list).</p>
      ) : null}
      <ul className="space-y-2">
        {due.map((l) => (
          <Line key={l.key} line={l} />
        ))}
        {watch.map((l) => (
          <Line key={l.key} line={l} />
        ))}
        {skip.map((l) => (
          <Line key={l.key} line={l} />
        ))}
      </ul>
      {visit === "recommended" ? (
        <p className="text-xs text-pass">Mileage-based checklist is loaded. Override below if this visit is a set service.</p>
      ) : visit ? (
        <p className="text-xs text-warn">
          Override on: {VISIT_TYPES.find((v) => v.value === visit)?.label ?? visit}. Checklist is that form, not the mileage mix.
        </p>
      ) : null}
      <button
        type="button"
        onClick={startRecommended}
        className={cn(
          "tap-44 w-full rounded font-medium",
          visit === "recommended" ? "border border-border bg-raised" : "bg-primary text-primary-foreground",
        )}
      >
        {visit === "recommended" ? "Reload recommended inspection" : "Start recommended inspection"}
      </button>
      <p className="field-label">Or force a set visit</p>
      <div className="flex flex-wrap gap-2">
        {VISIT_TYPES.map((v) => (
          <button
            key={v.value}
            type="button"
            onClick={() => force(v.value)}
            className={cn(
              "tap-44 rounded border px-3 font-mono text-xs font-medium tracking-wide",
              visit === v.value ? "chip-on" : "chip-off text-muted-foreground",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}