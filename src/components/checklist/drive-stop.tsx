import { BookOpen } from "lucide-react";
import { useInspection } from "@/lib/inspection/store";
import { isSmodRisk } from "@/lib/inspection/types";
import { driveGates } from "@/lib/inspection/drive";

export function DriveStopBanner() {
  const draft = useInspection((s) => s.draft);
  const jumpToGuide = useInspection((s) => s.jumpToGuide);
  const patch = useInspection((s) => s.patch);
  const gates = driveGates(draft);
  if (!gates.length) return null;
  const smod = isSmodRisk(draft);
  return (
    <div className="hud-alert mx-4 mb-3 space-y-2">
      <p className="traveler-stamp text-xs text-fail">Stop — do not drive</p>
      <p className="text-sm leading-relaxed text-pretty text-foreground">
        Pass is blocked. These are park-it items, not notes.
      </p>
      <ul className="space-y-2 text-sm leading-relaxed text-foreground">
        {gates.map((g) => (
          <li key={g.id}>
            <button
              type="button"
              onClick={() => jumpToGuide(g.guideId)}
              className="tap-56 flex w-full items-start gap-2 text-left"
              aria-label={`Open How-To for ${g.label}`}
            >
              <span className="min-w-0 flex-1">
                <span className="block font-medium">
                  {g.label}: {g.measured}
                </span>
                <span className="mt-0.5 block text-muted-foreground">{g.range}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 pt-1 font-mono text-xs font-medium tracking-wide text-primary uppercase">
                <BookOpen className="size-3.5" />
                Guide
              </span>
            </button>
          </li>
        ))}
      </ul>
      {smod ? (
        draft.smodAcknowledged ? (
          <p className="text-xs text-muted-foreground">SMOD acknowledged. Section 3 and the road test stay locked off the drive. Still do not drive it.</p>
        ) : (
          <button
            type="button"
            onClick={() =>
              patch((d) => {
                d.smodAcknowledged = true;
              })
            }
            className="tap-56 w-full rounded bg-fail font-semibold text-foreground"
          >
            Acknowledge SMOD — lock lifts
          </button>
        )
      ) : null}
    </div>
  );
}
