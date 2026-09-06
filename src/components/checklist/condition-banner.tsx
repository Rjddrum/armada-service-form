import { BookOpen } from "lucide-react";
import { useInspection } from "@/lib/inspection/store";
import { conditionReport, statusLine, type StatusFlag } from "@/lib/inspection/status";
import { wearHistory } from "@/lib/inspection/wear";

function FlagList({ items, stamp }: { items: StatusFlag[]; stamp: string }) {
  const jumpToGuide = useInspection((s) => s.jumpToGuide);
  if (!items.length) return null;
  return (
    <div className="space-y-2">
      <p className="traveler-stamp text-xs text-fail">{stamp}</p>
      <ul className="space-y-2 text-sm leading-relaxed text-foreground">
        {items.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              onClick={() => jumpToGuide(f.guideId)}
              className="tap-56 flex w-full items-start gap-2 text-left"
              aria-label={`Open How-To for ${f.label}`}
            >
              <span className="min-w-0 flex-1">
                <span className="block">{statusLine(f)}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 pt-1 font-mono text-xs font-medium tracking-wide text-primary uppercase">
                <BookOpen className="size-3.5" />
                Guide
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ConditionBanner() {
  const draft = useInspection((s) => s.draft);
  const photos = useInspection((s) => s.photos);
  const lastSubmitted = useInspection((s) => s.lastSubmitted);
  const archive = useInspection((s) => s.archive);
  const report = conditionReport(draft, photos, wearHistory(lastSubmitted, archive));
  const c = report.counts;
  return (
    <div className="hud-card space-y-3">
      <p className="traveler-stamp text-xs text-primary">Vehicle condition score</p>
      <p className="reading text-3xl text-primary">
        {report.score}
        <span className="text-lg text-muted-foreground">/100</span>
      </p>
      <ul className="space-y-1 text-sm text-foreground">
        <li>URGENT: {c.asap}</li>
        <li>SERVICE SOON: {c.attention}</li>
        <li>Monitor: {c.monitor}</li>
        <li>Passed: {c.pass}</li>
        <li>Not inspected / N/A: {c.na}</li>
      </ul>
      <FlagList items={report.asap} stamp="URGENT" />
      <FlagList items={report.attention} stamp="SERVICE SOON" />
      <FlagList items={report.monitor} stamp="Monitor" />
    </div>
  );
}
