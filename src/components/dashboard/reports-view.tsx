import { useInspection } from "@/lib/inspection/store";
import { visitLabel } from "@/lib/inspection/types";
import { formatMiles, formatShortDate } from "@/lib/utils";

export function ReportsView() {
  const goHome = useInspection((s) => s.goHome);
  const archive = useInspection((s) => s.archive);
  const restore = useInspection((s) => s.restoreArchive);

  return (
    <div className="space-y-4">
      <button type="button" onClick={goHome} className="tap-44 text-sm font-medium text-primary">
        ← Dashboard
      </button>
      <h2 className="text-lg font-semibold">Saved reports</h2>
      {archive.length ? (
        <ul className="space-y-2">
          {archive.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => restore(d.id)}
                className="hud-card flex w-full flex-col items-start gap-0.5 text-left"
              >
                <span className="font-medium">
                  {formatMiles(d.header.miles) || "—"} mi · {formatShortDate(d.header.date) || "—"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {visitLabel(d.header.visitType) || "Inspection"} · {d.header.inspector || "—"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No saved reports on this phone yet.</p>
      )}
    </div>
  );
}
