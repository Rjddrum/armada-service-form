import { useInspection } from "@/lib/inspection/store";
import { cn } from "@/lib/utils";
import {
  ESTIMATE_DISCLAIMER,
  PRIORITY_OPTIONS,
  catalogFor,
  printRange,
  resolvedRepair,
  showsRepairBlock,
  writeRepair,
  type RepairPriority,
} from "@/lib/inspection/repairs";
import { rowStatus } from "@/lib/inspection/status";
import type { DealerTier } from "@/lib/inspection/types";

const TIERS: DealerTier[] = ["$", "$$", "$$$", "$$$$"];

function money(v: string): string {
  return v.replace(/[^\d]/g, "");
}

function RangeInputs({
  label,
  low,
  high,
  onLow,
  onHigh,
  placeholder,
}: {
  label: string;
  low: string;
  high: string;
  onLow: (v: string) => void;
  onHigh: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="field-label">{label}</p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <input
          inputMode="numeric"
          value={low}
          placeholder={placeholder ? placeholder.split("–")[0] : ""}
          onChange={(e) => onLow(money(e.target.value))}
          className="field-input placeholder:text-faint"
          aria-label={`${label} low`}
        />
        <span className="text-muted-foreground">–</span>
        <input
          inputMode="numeric"
          value={high}
          placeholder={placeholder ? placeholder.split("–")[1] : ""}
          onChange={(e) => onHigh(money(e.target.value))}
          className="field-input placeholder:text-faint"
          aria-label={`${label} high`}
        />
      </div>
    </div>
  );
}

export function RepairBlock({ id }: { id: string }) {
  const draft = useInspection((s) => s.draft);
  const patch = useInspection((s) => s.patch);
  const grade = rowStatus(draft, id);
  const row = resolvedRepair(draft, id);
  if (!showsRepairBlock(grade) || !row) return null;
  const cat = catalogFor(id);
  const diyPh = cat?.diy ? `${cat.diy[0]}–${cat.diy[1]}` : undefined;
  const indPh = cat?.independent ? `${cat.independent[0]}–${cat.independent[1]}` : undefined;
  const dealerPh = cat?.dealer ? `${cat.dealer[0]}–${cat.dealer[1]}` : undefined;
  const empty = !row.hasDefault && !printRange(row.diy, "") && !printRange(row.independent, "") && !printRange(row.dealer, "");

  function set(partial: Parameters<typeof writeRepair>[2]) {
    patch((d) => writeRepair(d, id, partial));
  }

  return (
    <div className="space-y-3 rounded border border-line bg-inset p-3">
      <div>
        <p className="field-label">Repair priority & estimate</p>
        <p className="text-sm font-medium text-foreground">{row.title}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRIORITY_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => set({ priority: o.value as RepairPriority })}
            className={cn("tap-56 rounded border px-3 text-sm font-semibold", row.priority === o.value ? "chip-on" : "chip-off")}
          >
            {o.label}
          </button>
        ))}
      </div>
      <RangeInputs
        label="DIY"
        low={row.diy.low == null ? "" : String(row.diy.low)}
        high={row.diy.high == null ? "" : String(row.diy.high)}
        onLow={(v) => set({ diyLow: v })}
        onHigh={(v) => set({ diyHigh: v })}
        placeholder={diyPh}
      />
      <RangeInputs
        label="Independent shop"
        low={row.independent.low == null ? "" : String(row.independent.low)}
        high={row.independent.high == null ? "" : String(row.independent.high)}
        onLow={(v) => set({ indLow: v })}
        onHigh={(v) => set({ indHigh: v })}
        placeholder={indPh}
      />
      <RangeInputs
        label="Dealership"
        low={row.dealer.low == null ? "" : String(row.dealer.low)}
        high={row.dealer.high == null ? "" : String(row.dealer.high)}
        onLow={(v) => set({ dealerLow: v, dealerTier: "" })}
        onHigh={(v) => set({ dealerHigh: v, dealerTier: "" })}
        placeholder={dealerPh}
      />
      {row.dealer.low == null && row.dealer.high == null ? (
        <div className="space-y-1.5">
          <p className="field-label">Dealer $–$$$$ (if no dollar range)</p>
          <div className="flex flex-wrap gap-1.5">
            {TIERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set({ dealerTier: row.dealerTier === t ? "" : t, dealerLow: "", dealerHigh: "" })}
                className={cn("tap-56 rounded border px-3 text-sm font-semibold", row.dealerTier === t ? "chip-on" : "chip-off")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {empty ? <p className="text-sm text-muted-foreground">Enter estimate.</p> : null}
      {row.note ? <p className="text-xs text-muted-foreground">{row.note}</p> : null}
      <p className="text-xs text-faint">{ESTIMATE_DISCLAIMER}</p>
    </div>
  );
}
