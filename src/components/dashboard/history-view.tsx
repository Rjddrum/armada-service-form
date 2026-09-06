import { MaintLog } from "@/components/checklist/maint-log";
import { useInspection } from "@/lib/inspection/store";

export function HistoryView() {
  const goHome = useInspection((s) => s.goHome);
  return (
    <div className="space-y-4">
      <button type="button" onClick={goHome} className="tap-44 text-sm font-medium text-primary">
        ← Dashboard
      </button>
      <h2 className="text-lg font-semibold">Maintenance history</h2>
      <MaintLog />
    </div>
  );
}
