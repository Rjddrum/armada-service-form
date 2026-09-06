import { useRef, useState } from "react";
import { Camera, Pencil, Plus, Trash2, X } from "lucide-react";
import { TextField } from "@/components/ui/fields";
import { useInspection } from "@/lib/inspection/store";
import {
  MAINT_SERVICES,
  ageOf,
  formatMaintDate,
  rowsForVin,
  type MaintRow,
  type MaintServiceKey,
} from "@/lib/inspection/maint";
import { parseMiles } from "@/lib/inspection/plan";
import { compressPhoto } from "@/lib/inspection/photos";
import { formatMiles } from "@/lib/utils";
import { cn } from "@/lib/utils";

function ProofPhoto({ row }: { row: MaintRow }) {
  const patchMaint = useInspection((s) => s.patchMaint);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const shot = await compressPhoto(file);
      patchMaint((rows) => rows.map((r) => (r.id === row.id ? { ...r, photo: { ...shot, originalDataUrl: shot.dataUrl } } : r)));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => void onFile(e.target.files?.[0])}
      />
      {row.photo ? (
        <div className="relative overflow-hidden rounded border border-border">
          <img src={row.photo.dataUrl} alt={row.photo.caption || "Proof"} className="max-h-32 w-full object-cover" />
          <button
            type="button"
            onClick={() => patchMaint((rows) => rows.map((r) => (r.id === row.id ? { ...r, photo: undefined } : r)))}
            className="tap-44 absolute top-1 right-1 grid place-items-center rounded bg-fail text-foreground"
            aria-label="Remove proof photo"
          >
            <X className="size-5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="tap-44 inline-flex w-full items-center justify-center gap-2 rounded border border-dashed border-border bg-inset text-sm font-medium text-muted-foreground"
        >
          <Camera className="size-4" />
          {busy ? "Saving…" : "Proof photo (optional)"}
        </button>
      )}
    </div>
  );
}

function RowEditor({ row, currentMiles }: { row: MaintRow; currentMiles: number | null }) {
  const patchMaint = useInspection((s) => s.patchMaint);
  const remove = useInspection((s) => s.removeMaintRow);
  const age = ageOf(row, currentMiles);

  function set(over: Partial<MaintRow>) {
    patchMaint((rows) => rows.map((r) => (r.id === row.id ? { ...r, ...over } : r)));
  }

  return (
    <div className="hud-card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <label className="block min-w-0 flex-1 space-y-1.5">
          <span className="field-label">Service</span>
          <select
            value={row.service}
            onChange={(e) => set({ service: e.target.value as MaintServiceKey })}
            className="field-input"
          >
            {MAINT_SERVICES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => remove(row.id)}
          className="tap-44 mt-6 grid place-items-center rounded border border-border text-fail"
          aria-label="Remove service"
        >
          <Trash2 className="size-5" />
        </button>
      </div>
      {row.service === "other" ? (
        <TextField label="What was done" value={row.custom} onChange={(v) => set({ custom: v })} />
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <TextField
          label="Miles"
          value={row.miles}
          inputMode="numeric"
          placeholder="Unknown"
          onChange={(v) => set({ miles: v.replace(/[^\d]/g, "") })}
        />
        <TextField
          label="Date"
          value={row.date}
          placeholder="Aug 2026 or 2024"
          onChange={(v) => set({ date: v })}
        />
      </div>
      <TextField label="Notes" value={row.notes} onChange={(v) => set({ notes: v })} placeholder="optional" />
      <ProofPhoto row={row} />
      <p className="text-xs leading-snug text-muted-foreground">
        Age: {age.label}
        {row.miles ? ` · logged ${formatMiles(row.miles)} mi` : " · miles unknown"}
        {row.date.trim() ? ` · ${formatMaintDate(row.date)}` : " · date unknown"}
      </p>
    </div>
  );
}

export function MaintLog() {
  const maint = useInspection((s) => s.maint);
  const vin = useInspection((s) => s.draft.header.vin);
  const milesRaw = useInspection((s) => s.draft.header.miles);
  const add = useInspection((s) => s.addMaintRow);
  const rows = rowsForVin(maint, vin);
  const current = parseMiles(milesRaw);

  return (
    <div className="hud-card space-y-3">
      <div>
        <p className="traveler-stamp text-xs text-primary">Maintenance history</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Not the checklist. This log stays with the truck{vin.trim().length === 17 ? " (this VIN)" : ""} when you start a new inspection.
          Miles or date can be Unknown — do not invent numbers.
        </p>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No services logged yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id}>
              <RowEditor row={row} currentMiles={current} />
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => add()}
        className={cn("tap-44 inline-flex w-full items-center justify-center gap-2 rounded border border-border bg-inset font-medium")}
      >
        <Plus className="size-4" />
        Add service
      </button>
    </div>
  );
}

export function LogOilButton() {
  const logOil = useInspection((s) => s.logOilChange);
  const maint = useInspection((s) => s.maint);
  const draft = useInspection((s) => s.draft);
  const [msg, setMsg] = useState("");
  const rows = rowsForVin(maint, draft.header.vin);
  const logged = alreadyShown(rows, draft.header.miles);

  function onClick() {
    const ok = logOil();
    setMsg(ok ? "Logged this oil change." : logged ? "Already in the log at this mileage." : "Enter current miles first.");
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={onClick}
        className="tap-44 inline-flex w-full items-center justify-center gap-2 rounded border border-border bg-inset text-sm font-medium"
      >
        <Pencil className="size-4" />
        Log this oil change
      </button>
      {msg ? <p className="text-xs text-muted-foreground">{msg}</p> : null}
    </div>
  );
}

function alreadyShown(rows: MaintRow[], miles: string) {
  const m = parseMiles(miles);
  return rows.some((r) => r.service === "oil-change" && parseMiles(r.miles) === m && m != null);
}
