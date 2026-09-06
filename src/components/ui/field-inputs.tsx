import { createContext, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const WalkEmbed = createContext(false);

export function ConfirmPair({
  onCancel,
  onConfirm,
  confirmLabel = "Delete",
}: {
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button type="button" onClick={onCancel} className="tap-56 rounded border border-border bg-raised font-semibold">
        Cancel
      </button>
      <button type="button" onClick={onConfirm} className="tap-56 rounded bg-fail font-semibold text-foreground">
        {confirmLabel}
      </button>
    </div>
  );
}


export function CheckHit({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      data-on={on ? "true" : "false"}
      className={cn(
        "check-hit grid size-14 shrink-0 place-items-center border-2",
        on ? "border-pass bg-pass text-background" : "border-line bg-inset text-transparent",
        className,
      )}
    >
      <Check className="size-7" strokeWidth={3} />
    </span>
  );
}

export const VERDICT_OPTIONS = [
  { value: "pass", label: "Pass" },
  { value: "fail", label: "Fail" },
];

export function VerdictSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ChipSelect
      label="Grade — Pass or Fail, not a note"
      value={value}
      options={VERDICT_OPTIONS}
      onChange={onChange}
    />
  );
}

export function ChipSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label?: string;
  value: string;
  options: { value: string; label: string; disabled?: boolean }[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      {label ? <p className="field-label">{label}</p> : null}
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = value === o.value;
          const locked = disabled || o.disabled;
          return (
            <button
              key={o.value}
              type="button"
              disabled={locked}
              onClick={() => onChange(active ? "" : o.value)}
              className={cn(
                "tap-56 rounded border px-3 text-sm font-semibold",
                active ? "chip-on" : "chip-off",
                locked && "opacity-40",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  disabled,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "decimal";
  disabled?: boolean;
  id?: string;
}) {
  const numeric = inputMode === "numeric" || inputMode === "decimal";
  function bump(dir: number) {
    const n = Number(String(value).replace(/[^\d.-]/g, ""));
    const step = inputMode === "decimal" ? 0.1 : 1;
    const next = (Number.isFinite(n) ? n : 0) + dir * step;
    const rounded = inputMode === "decimal" ? Math.round(next * 10) / 10 : Math.round(next);
    onChange(String(rounded));
  }
  return (
    <label className="block space-y-1.5">
      <span className="field-label">{label}</span>
      {numeric ? (
        <div className="flex gap-2">
          <button type="button" disabled={disabled} onClick={() => bump(-1)} className="tap-56 shrink-0 rounded border border-border bg-raised text-xl font-bold" aria-label="Decrease">
            −
          </button>
          <input
            id={id}
            value={value}
            disabled={disabled}
            inputMode={inputMode}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="field-input min-w-0 flex-1 text-center text-lg placeholder:text-muted-foreground"
          />
          <button type="button" disabled={disabled} onClick={() => bump(1)} className="tap-56 shrink-0 rounded border border-border bg-raised text-xl font-bold" aria-label="Increase">
            +
          </button>
        </div>
      ) : (
        <input
          id={id}
          value={value}
          disabled={disabled}
          inputMode={inputMode}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="field-input placeholder:text-muted-foreground"
        />
      )}
    </label>
  );
}

export function NotesField({
  value,
  onChange,
  placeholder = "Notes",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="field-input min-h-14 py-2 placeholder:text-faint"
    />
  );
}
