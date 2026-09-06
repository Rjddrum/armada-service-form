import { BookOpen } from "lucide-react";
import { useInspection } from "@/lib/inspection/store";
import { flagLine, outOfRangeFlags } from "@/lib/inspection/range";
import { wearHistory } from "@/lib/inspection/wear";

export function OutOfRangeBanner() {
  const draft = useInspection((s) => s.draft);
  const photos = useInspection((s) => s.photos);
  const lastSubmitted = useInspection((s) => s.lastSubmitted);
  const archive = useInspection((s) => s.archive);
  const jumpToGuide = useInspection((s) => s.jumpToGuide);
  const flags = outOfRangeFlags(draft, photos, wearHistory(lastSubmitted, archive));
  if (!flags.length) return null;
  return (
    <div className="hud-alert-warn space-y-2">
      <p className="traveler-stamp text-xs text-warn">Out of range — review or technician follow-up</p>
      <ul className="space-y-2 text-sm leading-relaxed text-foreground">
        {flags.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              onClick={() => jumpToGuide(f.guideId)}
              className="tap-44 flex w-full items-start gap-2 text-left"
              aria-label={`Open How-To for ${f.label}`}
            >
              <span className="min-w-0 flex-1">
                <span className="block">{flagLine(f)}</span>
                <span className="mt-0.5 block text-muted-foreground">{f.note}</span>
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
