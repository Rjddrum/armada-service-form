import { useInspection } from "@/lib/inspection/store";
import {
  priorWearVisit,
  wearCompare,
  wearHistory,
  wearLine,
  wearStamp,
  type WearCompare,
} from "@/lib/inspection/wear";
import { cn } from "@/lib/utils";

function useWear(): WearCompare | null {
  const draft = useInspection((s) => s.draft);
  const last = useInspection((s) => s.lastSubmitted);
  const archive = useInspection((s) => s.archive);
  const prior = priorWearVisit(draft, wearHistory(last, archive));
  if (!prior) return null;
  return wearCompare(draft, prior);
}

export function WearVsLast({ kind }: { kind: "pads" | "tread" }) {
  const compare = useWear();
  if (!compare) {
    return (
      <p className="text-sm leading-relaxed text-muted-foreground">
        No prior pad/tread numbers stored yet. Next inspection will compare against this one.
      </p>
    );
  }
  const rows = kind === "pads" ? compare.pads : compare.tread;
  const unit = kind === "pads" ? " mm" : "/32";
  const useful = rows.filter((c) => c.last != null || c.now != null);
  if (!useful.length) return null;
  return (
    <div className="space-y-1.5 rounded border border-line bg-inset p-3">
      <p className="traveler-stamp text-xs text-primary">{wearStamp(compare)}</p>
      {useful.map((c) => {
        const warn =
          kind === "pads" && c.lost != null && c.lost >= 1.0
            ? true
            : kind === "tread" && c.lost != null && c.lost >= 2;
        return (
          <p
            key={c.key}
            className={cn("text-sm leading-snug", warn ? "text-warn" : "text-foreground")}
          >
            {wearLine(c, unit, compare.milesBetween)}
          </p>
        );
      })}
    </div>
  );
}
