import { TextField, ChipSelect } from "@/components/ui/field-inputs";
import { PhotoField } from "@/components/checklist/photo-field";
import { useInspection } from "@/lib/inspection/store";
import { normalizeVin } from "@/lib/inspection/recalls";
import { cn } from "@/lib/utils";

export function HeaderFields({ highlight }: { highlight?: boolean }) {
  const h = useInspection((s) => s.draft.header);
  const patch = useInspection((s) => s.patch);
  return (
    <div
      className={cn(
        "hud-card space-y-3",
        highlight ? "border-warn" : "",
      )}
    >
      {highlight ? (
        <p className="text-sm font-medium text-warn">Date, miles, and inspector are required to submit.</p>
      ) : null}
      <label className="block space-y-1.5">
        <span className="field-label">Date</span>
        <input
          type="date"
          value={h.date}
          onChange={(e) =>
            patch((d) => {
              d.header.date = e.target.value;
            })
          }
          className="field-input"
        />
      </label>
      <TextField
        label="Miles"
        value={h.miles}
        inputMode="numeric"
        placeholder="Type current miles"
        onChange={(v) =>
          patch((d) => {
            d.header.miles = v.replace(/[^\d]/g, "");
          })
        }
      />
      <TextField
        label="Inspector"
        value={h.inspector}
        onChange={(v) =>
          patch((d) => {
            d.header.inspector = v;
          })
        }
      />
      <TextField
        label="VIN"
        value={h.vin}
        placeholder="17 characters"
        onChange={(v) =>
          patch((d) => {
            d.header.vin = normalizeVin(v).slice(0, 17);
          })
        }
      />
      <p className="field-label">VIN plate</p>
      <PhotoField slot="header.vin" required label="VIN plate" />
      <ChipSelect
        label="Drive"
        value={h.drive}
        options={[
          { value: "2WD", label: "2WD" },
          { value: "4WD", label: "4WD" },
        ]}
        onChange={(v) =>
          patch((d) => {
            d.header.drive = v as typeof d.header.drive;
          })
        }
      />
      <ChipSelect
        label="Tow pkg"
        value={h.towPkg}
        options={[
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
        ]}
        onChange={(v) =>
          patch((d) => {
            d.header.towPkg = v as typeof d.header.towPkg;
          })
        }
      />
    </div>
  );
}
