import { type ReactNode, useContext, useState } from "react";
import { ItemBlock, ChipSelect, TextField, NotesField, AtfRitualGate, OilWaitGate, useOilWaitReady, GuideLink, VerdictSelect, StatusSelect, PhotoField, CornerPhotos, WalkEmbed } from "@/components/ui/fields";
import { useInspection } from "@/lib/inspection/store";
import {
  CABIN_ITEMS,
  CORNERS,
  CORNERS_SPARE,
  OVERALL_OPTIONS,
  ROAD_ITEMS,
  STEERING_ITEMS,
  TRANS_ROWS,
  UNDERBODY_ITEMS,
  driveShows,
  drivelineShaftLabel,
  isSmodRisk,
  oilChangeRecord,
  smodPlanRecord,
  SMOD_INTERVAL,
  rowShows,
  visitShows,
  type CabinKey,
  type Corner,
  type CornerSpare,
  type PassFail,
  type RoadKey,
  type SeepGrade,
  type SteeringKey,
  type UnderbodyKey,
} from "@/lib/inspection/types";
import { oilChangeMode, atfHotRequired } from "@/lib/inspection/plan";
import { LogOilButton } from "@/components/checklist/maint-log";
import { isVinComplete, normalizeVin, recallStamp } from "@/lib/inspection/recalls";
import { lookupNissanCampaigns } from "@/lib/inspection/recalls-lookup";
import { WearVsLast } from "@/components/checklist/wear-vs-last";
import { overallBlocked } from "@/lib/inspection/status";
import { photoSlotDef } from "@/lib/inspection/photo-slots";
import { PlainButton } from "@/components/guide/plain-sheet";
import { cn } from "@/lib/utils";

function useShows() {
  const visit = useInspection((s) => s.draft.header.visitType);
  const drive = useInspection((s) => s.draft.header.drive);
  const plan = useInspection((s) => s.draft.header.plan);
  return (id: string) => rowShows(id, visit, drive, plan);
}

function Shown({ id, children }: { id: string; children: ReactNode }) {
  const shows = useShows();
  if (!shows(id)) return null;
  return <>{children}</>;
}

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

function CornerGrid({
  keys,
  values,
  onChange,
  suffix,
}: {
  keys: readonly { key: Corner | CornerSpare; label: string }[];
  values: { lf?: string; rf?: string; lr?: string; rr?: string; spare?: string };
  onChange: (key: string, v: string) => void;
  suffix?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {keys.map((c) => (
        <TextField
          key={c.key}
          label={suffix ? `${c.label} ${suffix}` : c.label}
          value={values[c.key] ?? ""}
          inputMode="decimal"
          onChange={(v) => onChange(c.key, v)}
        />
      ))}
    </div>
  );
}

export function OilLevelItem() {
  const oilChange = useInspection((s) => oilChangeMode(s.draft));
  if (oilChange) return <OilChangePerformedItem />;
  return <OilDipstickItem />;
}

function OilChangePerformedItem() {
  const row = useInspection((s) => s.draft.fluids.oilLevel);
  const oilType = useInspection((s) => s.draft.result.oilType);
  const oilAmount = useInspection((s) => s.draft.result.oilAmount);
  const oilFilterPn = useInspection((s) => s.draft.result.oilFilterPn);
  const crushWasher = useInspection((s) => s.draft.result.crushWasher);
  const line = useInspection((s) => oilChangeRecord(s.draft));
  const miles = useInspection((s) => s.draft.header.miles);
  const patch = useInspection((s) => s.patch);
  return (
    <ItemBlock
      title="Oil change performed"
      hint="Not a dipstick read. Factory 5W-30 full synthetic. About 6.5 qt with filter. New crush washer every time."
      guideId="fluids.oilLevel"
      checked={row.checked}
      onChecked={(v) =>
        patch((d) => {
          d.fluids.oilLevel.checked = v;
        })
      }
      notes={row.notes}
      onNotes={(v) =>
        patch((d) => {
          d.fluids.oilLevel.notes = v;
        })
      }
    >
      <TextField
        label="Oil type"
        value={oilType}
        placeholder="5W-30 full synthetic"
        onChange={(v) =>
          patch((d) => {
            d.result.oilType = v;
          })
        }
      />
      <TextField
        label="Amount used"
        value={oilAmount}
        placeholder="6.5 qt"
        inputMode="decimal"
        onChange={(v) =>
          patch((d) => {
            d.result.oilAmount = v;
          })
        }
      />
      <TextField
        label="Filter PN"
        value={oilFilterPn}
        placeholder="Nissan filter PN"
        onChange={(v) =>
          patch((d) => {
            d.result.oilFilterPn = v;
          })
        }
      />
      <ChipSelect
        label="Crush washer replaced"
        value={crushWasher}
        options={[
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
        ]}
        onChange={(v) =>
          patch((d) => {
            d.result.crushWasher = v as typeof d.result.crushWasher;
          })
        }
      />
      <p className="text-sm leading-relaxed text-muted-foreground">
        {miles.trim() ? line : "Mileage comes from the Vehicle header."}
      </p>
      <LogOilButton />
    </ItemBlock>
  );
}

function OilDipstickItem() {
  const row = useInspection((s) => s.draft.fluids.oilLevel);
  const patch = useInspection((s) => s.patch);
  const ready = useOilWaitReady();
  return (
    <ItemBlock
      title="Engine oil level & condition"
      hint="After warmup. Engine off. Wait more than 10 minutes. 5W-30."
      guideId="fluids.oilLevel"
      checked={row.checked}
      onChecked={(v) =>
        patch((d) => {
          d.fluids.oilLevel.checked = v;
        })
      }
      notes={row.notes}
      onNotes={(v) =>
        patch((d) => {
          d.fluids.oilLevel.notes = v;
        })
      }
      locked={!ready}
    >
      <OilWaitGate>
        <TextField
          label="Color / level"
          value={row.colorLevel}
          placeholder="Between L and H"
          onChange={(v) =>
            patch((d) => {
              d.fluids.oilLevel.colorLevel = v;
            })
          }
        />
        <TextField
          label="qt added"
          value={row.qtAdded}
          inputMode="decimal"
          onChange={(v) =>
            patch((d) => {
              d.fluids.oilLevel.qtAdded = v;
            })
          }
        />
      </OilWaitGate>
    </ItemBlock>
  );
}

export function AtfItem() {
  const row = useInspection((s) => s.draft.fluids.atf);
  const idle = useInspection((s) => s.draft.atfIdle);
  const cycled = useInspection((s) => s.draft.atfCycled);
  const hot = useInspection((s) => s.draft.atfHot);
  const patch = useInspection((s) => s.patch);
  const hotProc = useInspection((s) => atfHotRequired(s.draft));
  const ready = !hotProc || (idle && cycled && hot);
  return (
    <ItemBlock
      title={hotProc ? "ATF — dipstick HOT" : "ATF color / smell"}
      hint={
        hotProc
          ? "Nissan Matic J (Matic S OK). Idle, shift P-R-N-D, then HOT read. Pink, milky, or sweet is SMOD — stop."
          : "Look at color and smell. Nissan Matic J. Pink, milky, or sweet is SMOD — stop. HOT procedure is a 30k item."
      }
      guideId="fluids.atf"
      checked={row.checked}
      onChecked={(v) =>
        patch((d) => {
          d.fluids.atf.checked = v;
        })
      }
      notes={row.notes}
      onNotes={(v) =>
        patch((d) => {
          d.fluids.atf.notes = v;
        })
      }
      locked={!ready}
      photoSlot="fluids.atf"
      photoRequired
    >
      {hotProc ? (
        <AtfRitualGate>
          <AtfFields row={row} />
        </AtfRitualGate>
      ) : (
        <AtfFields row={row} />
      )}
    </ItemBlock>
  );
}

function AtfFields({ row }: { row: { inRange: string; color: string; smell: string } }) {
  const patch = useInspection((s) => s.patch);
  const hotProc = useInspection((s) => atfHotRequired(s.draft));
  return (
    <>
      {hotProc ? (
        <ChipSelect
          label="Level in range"
          value={row.inRange}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) =>
            patch((d) => {
              d.fluids.atf.inRange = v as typeof d.fluids.atf.inRange;
            })
          }
        />
      ) : null}
      <ChipSelect
        label="Color"
        value={row.color}
        options={[
          { value: "red-amber", label: "Red-amber" },
          { value: "brown", label: "Brown" },
          { value: "pink", label: "Pink" },
          { value: "milky", label: "Milky" },
        ]}
        onChange={(v) =>
          patch((d) => {
            d.fluids.atf.color = v as typeof d.fluids.atf.color;
          })
        }
      />
      <ChipSelect
        label="Smell"
        value={row.smell}
        options={[
          { value: "atf", label: "ATF" },
          { value: "burnt", label: "Burnt" },
          { value: "sweet", label: "Sweet" },
        ]}
        onChange={(v) =>
          patch((d) => {
            d.fluids.atf.smell = v as typeof d.fluids.atf.smell;
          })
        }
      />
      <p className="text-xs leading-snug text-fail">
        One-line SMOD warning: if ATF is pink, milky, or sweet — coolant is in the transmission. Do not keep driving.
      </p>
    </>
  );
}

function SimpleCheck({
  title,
  hint,
  guideId,
  checked,
  notes,
  onChecked,
  onNotes,
  photoSlot,
  photoRequired,
  children,
}: {
  title: string;
  hint?: string;
  guideId?: string;
  checked: boolean;
  notes: string;
  onChecked: (v: boolean) => void;
  onNotes: (v: string) => void;
  photoSlot?: string;
  photoRequired?: boolean;
  children?: ReactNode;
}) {
  return (
    <ItemBlock
      title={title}
      hint={hint}
      guideId={guideId}
      checked={checked}
      onChecked={onChecked}
      notes={notes}
      onNotes={onNotes}
      photoSlot={photoSlot}
      photoRequired={photoRequired}
    >
      {children}
    </ItemBlock>
  );
}

export function FluidsRest() {
  const f = useInspection((s) => s.draft.fluids);
  const drive = useInspection((s) => s.draft.header.drive);
  const patch = useInspection((s) => s.patch);
  const shows = useShows();
  const interval = shows("rearDiffSeep") || shows("transferSeep");
  const fourwd = driveShows(drive, "4WD");
  return (
    <>
      <Shown id="oilLeak">
      <SimpleCheck
        title="Engine oil leak check"
        hint="Valve covers / oil cooler O-ring / pan / front cover"
        guideId="fluids.oilLeak"
        checked={f.oilLeak.checked}
        notes={f.oilLeak.notes}
        onChecked={(v) => patch((d) => { d.fluids.oilLeak.checked = v; })}
        onNotes={(v) => patch((d) => { d.fluids.oilLeak.notes = v; })}
        photoSlot="fluids.oilLeak"
      />
      </Shown>
      <Shown id="coolant">
      <SimpleCheck
        title="Coolant reservoir level & color"
        hint="Engine cold. Do not open the radiator cap hot."
        guideId="fluids.coolant"
        checked={f.coolant.checked}
        notes={f.coolant.notes}
        onChecked={(v) => patch((d) => { d.fluids.coolant.checked = v; })}
        onNotes={(v) => patch((d) => { d.fluids.coolant.notes = v; })}
        photoSlot="fluids.coolant"
      >
        <TextField
          label="Level & color"
          value={f.coolant.levelColor}
          onChange={(v) => patch((d) => { d.fluids.coolant.levelColor = v; })}
        />
        <TextField
          label="Freeze point"
          value={f.coolant.freezeF}
          placeholder="-34°F"
          inputMode="decimal"
          onChange={(v) => patch((d) => { d.fluids.coolant.freezeF = v; })}
        />
        <ChipSelect
          label="Cap seated"
          value={f.coolant.capSeated}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.fluids.coolant.capSeated = v as typeof d.fluids.coolant.capSeated; })}
        />
      </SimpleCheck>
      </Shown>
      <Shown id="atf">
      <AtfItem />
      </Shown>
      <Shown id="psf">
      <SimpleCheck
        title="Power steering fluid"
        hint="COLD marks when cold, HOT marks after a drive. Nissan PSF."
        guideId="fluids.psf"
        checked={f.psf.checked}
        notes={f.psf.notes}
        onChecked={(v) => patch((d) => { d.fluids.psf.checked = v; })}
        onNotes={(v) => patch((d) => { d.fluids.psf.notes = v; })}
        photoSlot="fluids.psf"
      >
        <TextField label="Level" value={f.psf.level} onChange={(v) => patch((d) => { d.fluids.psf.level = v; })} />
        <TextField label="Color" value={f.psf.color} onChange={(v) => patch((d) => { d.fluids.psf.color = v; })} />
      </SimpleCheck>
      </Shown>
      <Shown id="brake">
      <SimpleCheck
        title="Brake fluid"
        hint="DOT 3 from a sealed bottle. Flush every 24 months."
        guideId="fluids.brake"
        checked={f.brake.checked}
        notes={f.brake.notes}
        onChecked={(v) => patch((d) => { d.fluids.brake.checked = v; })}
        onNotes={(v) => patch((d) => { d.fluids.brake.notes = v; })}
        photoSlot="fluids.brake"
      >
        <TextField label="Level" value={f.brake.level} onChange={(v) => patch((d) => { d.fluids.brake.level = v; })} />
        <ChipSelect
          label="Color"
          value={f.brake.color}
          options={[
            { value: "clear-amber", label: "Clear-amber" },
            { value: "dark", label: "Dark" },
          ]}
          onChange={(v) => patch((d) => { d.fluids.brake.color = v as typeof d.fluids.brake.color; })}
        />
        <ChipSelect
          label="Moisture"
          value={f.brake.moisture}
          options={[
            { value: "dry", label: "Dry" },
            { value: "high", label: "High" },
          ]}
          onChange={(v) => patch((d) => { d.fluids.brake.moisture = v as typeof d.fluids.brake.moisture; })}
        />
        <ChipSelect
          label="Cap sealed"
          value={f.brake.capSealed}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.fluids.brake.capSealed = v as typeof d.fluids.brake.capSealed; })}
        />
      </SimpleCheck>
      </Shown>
      <Shown id="washer">
      <WasherItem />
      </Shown>
      {interval && fourwd ? (
        <>
          <TransferSeepItem />
          <FrontDiffSeepItem />
        </>
      ) : null}
      {interval ? <RearDiffSeepItem /> : null}
      <NotesField
        value={f.notes}
        onChange={(v) => patch((d) => { d.fluids.notes = v; })}
        placeholder="Section notes"
      />
    </>
  );
}

export function WasherItem() {
  const row = useInspection((s) => s.draft.fluids.washer);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Washer fluid"
      guideId="fluids.washer"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.fluids.washer.checked = v; })}
      onNotes={(v) => patch((d) => { d.fluids.washer.notes = v; })}
    />
  );
}

export function TransferSeepItem() {
  const row = useInspection((s) => s.draft.fluids.transferSeep);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Transfer case seep (4WD)"
      hint="30k service item. Not a dipstick."
      guideId="fluids.transferSeep"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.fluids.transferSeep.checked = v; })}
      onNotes={(v) => patch((d) => { d.fluids.transferSeep.notes = v; })}
    >
      <ChipSelect
        label="Wetness at seals"
        value={row.wetness}
        options={[
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
        ]}
        onChange={(v) => patch((d) => { d.fluids.transferSeep.wetness = v as typeof d.fluids.transferSeep.wetness; })}
      />
    </SimpleCheck>
  );
}

export function FrontDiffSeepItem() {
  const row = useInspection((s) => s.draft.fluids.frontDiffSeep);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Front differential seep (4WD)"
      hint="30k service item."
      guideId="fluids.frontDiffSeep"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.fluids.frontDiffSeep.checked = v; })}
      onNotes={(v) => patch((d) => { d.fluids.frontDiffSeep.notes = v; })}
    >
      <ChipSelect
        label="Seep"
        value={row.seep}
        options={[
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
        ]}
        onChange={(v) => patch((d) => { d.fluids.frontDiffSeep.seep = v as typeof d.fluids.frontDiffSeep.seep; })}
      />
    </SimpleCheck>
  );
}

export function RearDiffSeepItem() {
  const row = useInspection((s) => s.draft.fluids.rearDiffSeep);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Rear differential seep"
      hint="30k service item. Pinion seal."
      guideId="fluids.rearDiffSeep"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.fluids.rearDiffSeep.checked = v; })}
      onNotes={(v) => patch((d) => { d.fluids.rearDiffSeep.notes = v; })}
    >
      <ChipSelect
        label="Seep"
        value={row.seep}
        options={[
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
        ]}
        onChange={(v) => patch((d) => { d.fluids.rearDiffSeep.seep = v as typeof d.fluids.rearDiffSeep.seep; })}
      />
      <ChipSelect
        label="Pinion seal"
        value={row.pinion}
        options={[
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
        ]}
        onChange={(v) => patch((d) => { d.fluids.rearDiffSeep.pinion = v as typeof d.fluids.rearDiffSeep.pinion; })}
      />
    </SimpleCheck>
  );
}

export function EngineItems() {
  const e = useInspection((s) => s.draft.engine);
  const patch = useInspection((s) => s.patch);
  const shows = useShows();
  const interval = shows("battery") || shows("scan") || shows("airFilter");
  return (
    <>
      <Shown id="engine.overview">
      <div className="hud-card space-y-3">
        <h3 className="text-base font-semibold text-foreground">Engine bay overview</h3>
        <p className="text-sm text-muted-foreground">One wide shot — tanks, belt, battery, leaks.</p>
        <PlainButton id="engine.overview" title="Engine bay overview" />
        <PhotoField slot="engine.overview" required label="Engine bay overview" />
      </div>
      </Shown>
      <Shown id="timingCover">
      <SimpleCheck
        title="Cold-start noise — timing cover"
        hint="Short rattle 1–3 sec then gone is common. Ongoing rattle is not."
        guideId="engine.timingCover"
        checked={e.timingCover.checked}
        notes={e.timingCover.notes}
        onChecked={(v) => patch((d) => { d.engine.timingCover.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.timingCover.notes = v; })}
      >
        <ChipSelect
          label="Noise"
          value={e.timingCover.noise}
          options={[
            { value: "quiet", label: "Quiet" },
            { value: "short-rattle", label: "Short rattle" },
            { value: "ongoing-rattle", label: "Ongoing rattle" },
          ]}
          onChange={(v) => patch((d) => { d.engine.timingCover.noise = v as typeof d.engine.timingCover.noise; })}
        />
        <TextField
          label="Seconds"
          value={e.timingCover.seconds}
          inputMode="numeric"
          onChange={(v) => patch((d) => { d.engine.timingCover.seconds = v; })}
        />
        <ChipSelect
          label="Oil pressure"
          value={e.timingCover.oilPressure}
          options={[
            { value: "ok", label: "In the green" },
            { value: "low", label: "Low / lamp" },
          ]}
          onChange={(v) => patch((d) => { d.engine.timingCover.oilPressure = v as typeof d.engine.timingCover.oilPressure; })}
        />
      </SimpleCheck>
      </Shown>
      <Shown id="manifolds">
      <SimpleCheck
        title="Cold-start noise — exhaust manifolds"
        hint="Tick plus soot at the flange gets scheduled."
        guideId="engine.manifolds"
        checked={e.manifolds.checked}
        notes={e.manifolds.notes}
        onChecked={(v) => patch((d) => { d.engine.manifolds.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.manifolds.notes = v; })}
      >
        <ChipSelect
          label="Noise"
          value={e.manifolds.noise}
          options={[
            { value: "quiet", label: "Quiet" },
            { value: "tick-l", label: "Tick L" },
            { value: "tick-r", label: "Tick R" },
            { value: "both", label: "Both" },
          ]}
          onChange={(v) => patch((d) => { d.engine.manifolds.noise = v as typeof d.engine.manifolds.noise; })}
        />
        {interval ? (
          <ChipSelect
            label="Soot at flange"
            value={e.manifolds.soot}
            options={[
              { value: "Y", label: "Y" },
              { value: "N", label: "N" },
            ]}
            onChange={(v) => patch((d) => { d.engine.manifolds.soot = v as typeof d.engine.manifolds.soot; })}
          />
        ) : null}
      </SimpleCheck>
      </Shown>
      <Shown id="idle">
      <SimpleCheck
        title="Idle quality"
        guideId="engine.idle"
        checked={e.idle.checked}
        notes={e.idle.notes}
        onChecked={(v) => patch((d) => { d.engine.idle.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.idle.notes = v; })}
      >
        <ChipSelect
          label="Quality"
          value={e.idle.quality}
          options={[
            { value: "smooth", label: "Smooth" },
            { value: "rough", label: "Rough" },
          ]}
          onChange={(v) => patch((d) => { d.engine.idle.quality = v as typeof d.engine.idle.quality; })}
        />
        <ChipSelect
          label="CEL"
          value={e.idle.cel}
          options={[
            { value: "off", label: "Off" },
            { value: "on", label: "On" },
          ]}
          onChange={(v) => patch((d) => { d.engine.idle.cel = v as typeof d.engine.idle.cel; })}
        />
      </SimpleCheck>
      </Shown>
      <Shown id="belt">
      <SimpleCheck
        title="Serpentine belt"
        guideId="engine.belt"
        checked={e.belt.checked}
        notes={e.belt.notes}
        onChecked={(v) => patch((d) => { d.engine.belt.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.belt.notes = v; })}
      >
        <ChipSelect
          label="Condition"
          value={e.belt.condition}
          options={[
            { value: "ok", label: "OK" },
            { value: "cracks", label: "Cracks" },
            { value: "glaze", label: "Glaze" },
            { value: "fray", label: "Fray" },
          ]}
          onChange={(v) => patch((d) => { d.engine.belt.condition = v as typeof d.engine.belt.condition; })}
        />
        <ChipSelect
          label="Tensioner play"
          value={e.belt.tensionerPlay}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.engine.belt.tensionerPlay = v as typeof d.engine.belt.tensionerPlay; })}
        />
      </SimpleCheck>
      </Shown>
      <Shown id="radiator">
      <RadiatorItem />
      </Shown>
      <Shown id="atfLines">
      <AtfLinesItem />
      </Shown>
      <Shown id="airFilter">
      <SimpleCheck
        title="Air filter"
        hint="Cabin filter is a 15k item, behind the glove box."
        guideId="engine.airFilter"
        checked={e.airFilter.checked}
        notes={e.airFilter.notes}
        onChecked={(v) => patch((d) => { d.engine.airFilter.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.airFilter.notes = v; })}
      >
        <ChipSelect
          label="Condition"
          value={e.airFilter.condition}
          options={[
            { value: "clean", label: "Clean" },
            { value: "dirty", label: "Dirty" },
            { value: "replace", label: "Replace" },
          ]}
          onChange={(v) => patch((d) => { d.engine.airFilter.condition = v as typeof d.engine.airFilter.condition; })}
        />
        {interval ? (
          <ChipSelect
            label="Cabin filter due"
            value={e.airFilter.cabinDue}
            options={[
              { value: "Y", label: "Y" },
              { value: "N", label: "N" },
            ]}
            onChange={(v) => patch((d) => { d.engine.airFilter.cabinDue = v as typeof d.engine.airFilter.cabinDue; })}
          />
        ) : null}
      </SimpleCheck>
      </Shown>
      <Shown id="battery">
      <SimpleCheck
        title="Battery"
        hint={interval ? "Rest ~12.4–12.7 V. Running ~13.5–14.7 V." : "Glance the terminals. Load test unhides at 15k / 30k."}
        guideId="engine.battery"
        checked={e.battery.checked}
        notes={e.battery.notes}
        onChecked={(v) => patch((d) => { d.engine.battery.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.battery.notes = v; })}
        photoSlot="engine.battery"
      >
        {interval ? (
          <>
            <TextField label="Rest V" value={e.battery.restV} inputMode="decimal" onChange={(v) => patch((d) => { d.engine.battery.restV = v; })} />
            <TextField label="Running V" value={e.battery.runningV} inputMode="decimal" onChange={(v) => patch((d) => { d.engine.battery.runningV = v; })} />
          </>
        ) : null}
        <ChipSelect
          label="Terminals clean"
          value={e.battery.terminalsClean}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.engine.battery.terminalsClean = v as typeof d.engine.battery.terminalsClean; })}
        />
        {interval ? (
          <ChipSelect
            label="Load test"
            value={e.battery.loadTest}
            options={[
              { value: "pass", label: "Pass" },
              { value: "fail", label: "Fail" },
            ]}
            onChange={(v) => patch((d) => { d.engine.battery.loadTest = v as typeof d.engine.battery.loadTest; })}
          />
        ) : null}
      </SimpleCheck>
      </Shown>
      <Shown id="grounds">
      <SimpleCheck
        title="Ground straps"
        hint="Block-to-chassis and body."
        guideId="engine.grounds"
        checked={e.grounds.checked}
        notes={e.grounds.notes}
        onChecked={(v) => patch((d) => { d.engine.grounds.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.grounds.notes = v; })}
        photoSlot="engine.grounds"
      >
        <ChipSelect
          label="Condition"
          value={e.grounds.condition}
          options={[
            { value: "tight", label: "Tight" },
            { value: "corroded", label: "Corroded" },
          ]}
          onChange={(v) => patch((d) => { d.engine.grounds.condition = v as typeof d.engine.grounds.condition; })}
        />
      </SimpleCheck>
      </Shown>
      <Shown id="pcv">
      <SimpleCheck
        title="PCV hose / vacuum lines"
        guideId="engine.pcv"
        checked={e.pcv.checked}
        notes={e.pcv.notes}
        onChecked={(v) => patch((d) => { d.engine.pcv.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.pcv.notes = v; })}
      >
        <ChipSelect
          label="Condition"
          value={e.pcv.condition}
          options={[
            { value: "ok", label: "OK" },
            { value: "cracked", label: "Cracked" },
            { value: "oily", label: "Oily" },
          ]}
          onChange={(v) => patch((d) => { d.engine.pcv.condition = v as typeof d.engine.pcv.condition; })}
        />
      </SimpleCheck>
      </Shown>
      <Shown id="scan">
      <SimpleCheck
        title="Scan tool"
        hint="Write codes before you clear them."
        guideId="engine.scan"
        checked={e.scan.checked}
        notes={e.scan.notes}
        onChecked={(v) => patch((d) => { d.engine.scan.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.scan.notes = v; })}
      >
        <TextField label="Stored codes" value={e.scan.stored} onChange={(v) => patch((d) => { d.engine.scan.stored = v; })} />
        <TextField label="Pending" value={e.scan.pending} onChange={(v) => patch((d) => { d.engine.scan.pending = v; })} />
        <TextField label="ATF temp" value={e.scan.atfTemp} onChange={(v) => patch((d) => { d.engine.scan.atfTemp = v; })} />
      </SimpleCheck>
      </Shown>
      <NotesField value={e.notes} onChange={(v) => patch((d) => { d.engine.notes = v; })} placeholder="Section notes" />
    </>
  );
}

export function RadiatorItem() {
  const row = useInspection((s) => s.draft.engine.radiator);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Radiator tanks, seams, hoses"
      hint="Engine cold for the first look."
      guideId="engine.radiator"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.engine.radiator.checked = v; })}
      onNotes={(v) => patch((d) => { d.engine.radiator.notes = v; })}
      photoSlot="engine.radiator"
      photoRequired
    >
      <ChipSelect
        label="Seeping"
        value={row.seeping}
        options={[
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
        ]}
        onChange={(v) => patch((d) => { d.engine.radiator.seeping = v as typeof d.engine.radiator.seeping; })}
      />
    </SimpleCheck>
  );
}

export function AtfLinesItem() {
  const row = useInspection((s) => s.draft.engine.atfLines);
  const visit = useInspection((s) => s.draft.header.visitType);
  const plan = useInspection((s) => s.draft.header.plan);
  const patch = useInspection((s) => s.patch);
  const requirePhoto =
    visitShows(visit, "30k") || Boolean(plan?.cooling) || row.wetFittings === "Y";
  return (
    <SimpleCheck
      title="ATF cooler lines at radiator"
      hint="Wet fittings or pink residue = SMOD risk. 30k / 270k: fittings photo required even if dry."
      guideId="engine.atfLines"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.engine.atfLines.checked = v; })}
      onNotes={(v) => patch((d) => { d.engine.atfLines.notes = v; })}
      photoSlot="engine.atfLines"
      photoRequired={requirePhoto}
    >
      <ChipSelect
        label="Still connected to radiator"
        value={row.connected}
        options={[
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
        ]}
        onChange={(v) => patch((d) => { d.engine.atfLines.connected = v as typeof d.engine.atfLines.connected; })}
      />
      <ChipSelect
        label="Wet fittings"
        value={row.wetFittings}
        options={[
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
        ]}
        onChange={(v) => patch((d) => { d.engine.atfLines.wetFittings = v as typeof d.engine.atfLines.wetFittings; })}
      />
      <ChipSelect
        label="Bypass already done"
        value={row.bypassDone}
        options={[
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
        ]}
        onChange={(v) => patch((d) => { d.engine.atfLines.bypassDone = v as typeof d.engine.atfLines.bypassDone; })}
      />
    </SimpleCheck>
  );
}

export function TransTable() {
  const rows = useInspection((s) => s.draft.trans.rows);
  const notes = useInspection((s) => s.draft.trans.notes);
  const drive = useInspection((s) => s.draft.header.drive);
  const visit = useInspection((s) => s.draft.header.visitType);
  const patch = useInspection((s) => s.patch);
  const smod = useInspection((s) => isSmodRisk(s.draft) && !s.draft.smodAcknowledged);
  const showTable = useShows()("transTable");
  if (smod) {
    return (
      <div className="hud-alert text-sm leading-relaxed text-foreground">
        Section 3 is locked. ATF is pink, milky, or sweet — coolant in the transmission. Do not continue the
        drive. Acknowledge the STOP banner first.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {showTable ? (
        TRANS_ROWS.filter((r) => r.key !== "fourwd" || driveShows(drive, "4WD")).map((r) => {
        const v = rows[r.key];
        const opts = r.options.map((o) => ({ value: o, label: o }));
        return (
          <div key={r.key} className="hud-card space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="pt-2.5 font-semibold text-foreground">{r.label}</h3>
              <GuideLink id={r.guideId} label={r.label} />
            </div>
            <PlainButton id={r.guideId} title={r.label} />
            <ChipSelect
              label="Cold"
              value={v.cold}
              options={opts}
              onChange={(val) => patch((d) => { d.trans.rows[r.key].cold = val; })}
            />
            <ChipSelect
              label="Hot"
              value={v.hot}
              options={opts}
              onChange={(val) => patch((d) => { d.trans.rows[r.key].hot = val; })}
            />
            <NotesField
              value={v.notes}
              onChange={(val) => patch((d) => { d.trans.rows[r.key].notes = val; })}
            />
            <StatusSelect id={`trans.${r.key}`} />
          </div>
        );
      })
      ) : (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Full cold/hot shift table is 15k / 30k. This visit is a short loop — temp gauge, one upshift, a stop.
        </p>
      )}
      <AtfRejectItem />
      <NotesField value={notes} onChange={(v) => patch((d) => { d.trans.notes = v; })} placeholder="Section notes" />
    </div>
  );
}

export function AtfRejectItem() {
  const checked = useInspection((s) => s.draft.trans.atfReject);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="ATF reject condition"
      hint="STOP if pink, milky, or sweet-smelling. Do not continue the drive."
      guideId="trans.atfReject"
      checked={checked}
      notes=""
      onChecked={(v) => patch((d) => { d.trans.atfReject = v; })}
      onNotes={() => undefined}
    />
  );
}

export function BrakeItems() {
  const b = useInspection((s) => s.draft.brakes);
  const patch = useInspection((s) => s.patch);
  const shows = useShows();
  const showPads = shows("pads");
  return (
    <>
      <Shown id="pads">
      <SimpleCheck
        title="Pad thickness"
        hint="Measure remaining friction material, not the steel backing."
        guideId="brakes.pads"
        checked={b.pads.checked}
        notes={b.pads.notes}
        onChecked={(v) => patch((d) => { d.brakes.pads.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.pads.notes = v; })}
      >
        {showPads ? (
          <CornerGrid
            keys={CORNERS}
            values={b.pads}
            suffix="mm"
            onChange={(k, v) => patch((d) => { d.brakes.pads[k as Corner] = v; })}
          />
        ) : null}
        <WearVsLast kind="pads" />
        <CornerPhotos prefix="brakes.pads" required />
      </SimpleCheck>
      </Shown>
      {showPads ? (
        <>
      <SimpleCheck
        title="Rotors"
        hint="Thickness / rust lip / pulse on stop"
        guideId="brakes.rotors"
        checked={b.rotors.checked}
        notes={b.rotors.notes}
        onChecked={(v) => patch((d) => { d.brakes.rotors.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.rotors.notes = v; })}
      >
        <TextField label="Front" value={b.rotors.front} onChange={(v) => patch((d) => { d.brakes.rotors.front = v; })} />
        <TextField label="Rear" value={b.rotors.rear} onChange={(v) => patch((d) => { d.brakes.rotors.rear = v; })} />
      </SimpleCheck>
      <SimpleCheck
        title="Brake hoses & lines"
        hint="Calipers, hoses, and steel lines. Wet caliper is a fail — open Guide for how to inspect them."
        guideId="brakes.hoses"
        checked={b.hoses.checked}
        notes={b.hoses.notes}
        onChecked={(v) => patch((d) => { d.brakes.hoses.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.hoses.notes = v; })}
      >
        <TextField label="Condition" value={b.hoses.condition} onChange={(v) => patch((d) => { d.brakes.hoses.condition = v; })} />
        <ChipSelect
          label="Wet caliper"
          value={b.hoses.wetCaliper}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.brakes.hoses.wetCaliper = v as typeof d.brakes.hoses.wetCaliper; })}
        />
      </SimpleCheck>
      <SimpleCheck
        title="Master cylinder / booster"
        guideId="brakes.master"
        checked={b.master.checked}
        notes={b.master.notes}
        onChecked={(v) => patch((d) => { d.brakes.master.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.master.notes = v; })}
      >
        <ChipSelect
          label="Seepage"
          value={b.master.seepage}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.brakes.master.seepage = v as typeof d.brakes.master.seepage; })}
        />
        <ChipSelect
          label="Pedal firm"
          value={b.master.pedalFirm}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.brakes.master.pedalFirm = v as typeof d.brakes.master.pedalFirm; })}
        />
      </SimpleCheck>
      <SimpleCheck
        title="Pedal height engine running"
        hint="Spec ≥ 3.5 in @ 110 lb"
        guideId="brakes.pedalHeight"
        checked={b.pedalHeight.checked}
        notes={b.pedalHeight.notes}
        onChecked={(v) => patch((d) => { d.brakes.pedalHeight.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.pedalHeight.notes = v; })}
      >
        <TextField label="Measured" value={b.pedalHeight.measured} onChange={(v) => patch((d) => { d.brakes.pedalHeight.measured = v; })} />
      </SimpleCheck>
      <SimpleCheck
        title="Parking brake"
        hint="Spec 3–4 clicks @ 44 lb"
        guideId="brakes.parking"
        checked={b.parking.checked}
        notes={b.parking.notes}
        onChecked={(v) => patch((d) => { d.brakes.parking.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.parking.notes = v; })}
      >
        <TextField label="Clicks" value={b.parking.clicks} inputMode="numeric" onChange={(v) => patch((d) => { d.brakes.parking.clicks = v; })} />
        <ChipSelect
          label="Holds on grade"
          value={b.parking.holdsGrade}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.brakes.parking.holdsGrade = v as typeof d.brakes.parking.holdsGrade; })}
        />
      </SimpleCheck>
      </>
      ) : null}
      <AbsLampsItem />
      <TreadItem />
      <TireAgeItem />
      <WearItem />
      <PressuresItem />
      {showPads ? (
        <>
      <SimpleCheck
        title="Lug torque after rotation"
        hint="98 ft-lb star. Recheck after the road test."
        guideId="brakes.lugTorque"
        checked={b.lugTorque.checked}
        notes={b.lugTorque.notes}
        onChecked={(v) => patch((d) => { d.brakes.lugTorque.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.lugTorque.notes = v; })}
      >
        <ChipSelect
          label="Rechecked after drive"
          value={b.lugTorque.rechecked}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.brakes.lugTorque.rechecked = v as typeof d.brakes.lugTorque.rechecked; })}
        />
      </SimpleCheck>
      <SimpleCheck
        title="Wheel bearings / hubs"
        guideId="brakes.bearings"
        checked={b.bearings.checked}
        notes={b.bearings.notes}
        onChecked={(v) => patch((d) => { d.brakes.bearings.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.bearings.notes = v; })}
      >
        <CornerGrid
          keys={CORNERS}
          values={b.bearings}
          onChange={(k, v) => patch((d) => { d.brakes.bearings[k as Corner] = v; })}
        />
      </SimpleCheck>
      <SimpleCheck
        title="Alignment feel"
        guideId="brakes.alignment"
        checked={b.alignment.checked}
        notes={b.alignment.notes}
        onChecked={(v) => patch((d) => { d.brakes.alignment.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.alignment.notes = v; })}
      >
        <ChipSelect
          label="Feel"
          value={b.alignment.feel}
          options={[
            { value: "straight", label: "Straight" },
            { value: "pull-l", label: "Pull L" },
            { value: "pull-r", label: "Pull R" },
            { value: "wander", label: "Wander" },
          ]}
          onChange={(v) => patch((d) => { d.brakes.alignment.feel = v as typeof d.brakes.alignment.feel; })}
        />
      </SimpleCheck>
        </>
      ) : null}
      <NotesField value={b.notes} onChange={(v) => patch((d) => { d.brakes.notes = v; })} placeholder="Section notes" />
    </>
  );
}

export function AbsLampsItem() {
  const row = useInspection((s) => s.draft.brakes.absLamps);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="ABS / SLIP / VDC lamps"
      guideId="brakes.absLamps"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.brakes.absLamps.checked = v; })}
      onNotes={(v) => patch((d) => { d.brakes.absLamps.notes = v; })}
    >
      <PhotoField slot="cabin.dash" required label="Dash warning lights (key on)" />
      <ChipSelect
        label="State"
        value={row.state}
        options={[
          { value: "prove-out", label: "Prove-out then off" },
          { value: "stay-on", label: "Stay on" },
          { value: "intermittent", label: "Intermittent" },
        ]}
        onChange={(v) => patch((d) => { d.brakes.absLamps.state = v as typeof d.brakes.absLamps.state; })}
      />
    </SimpleCheck>
  );
}

export function TreadItem() {
  const row = useInspection((s) => s.draft.brakes.tread);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Tires tread"
      guideId="brakes.tread"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.brakes.tread.checked = v; })}
      onNotes={(v) => patch((d) => { d.brakes.tread.notes = v; })}
    >
      <CornerGrid
        keys={CORNERS_SPARE}
        values={row}
        onChange={(k, v) => patch((d) => { d.brakes.tread[k as CornerSpare] = v; })}
      />
      <WearVsLast kind="tread" />
      <CornerPhotos prefix="brakes.tread" required />
    </SimpleCheck>
  );
}

export function TireAgeItem() {
  const row = useInspection((s) => s.draft.brakes.tireAge);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Tire age (DOT week/year)"
      hint="Older than 6–7 years gets replaced even with tread."
      guideId="brakes.tireAge"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.brakes.tireAge.checked = v; })}
      onNotes={(v) => patch((d) => { d.brakes.tireAge.notes = v; })}
    >
      <CornerGrid
        keys={CORNERS_SPARE}
        values={row}
        onChange={(k, v) => patch((d) => { d.brakes.tireAge[k as CornerSpare] = v; })}
      />
    </SimpleCheck>
  );
}

export function WearItem() {
  const row = useInspection((s) => s.draft.brakes.wear);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Tire wear pattern"
      hint="Inner-shoulder wear on the fronts means alignment or UCAs."
      guideId="brakes.wear"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.brakes.wear.checked = v; })}
      onNotes={(v) => patch((d) => { d.brakes.wear.notes = v; })}
    >
      <ChipSelect
        label="Pattern"
        value={row.pattern}
        options={[
          { value: "even", label: "Even" },
          { value: "inner", label: "Inner shoulder" },
          { value: "outer", label: "Outer" },
          { value: "cupping", label: "Cupping" },
          { value: "center", label: "Center" },
        ]}
        onChange={(v) => patch((d) => { d.brakes.wear.pattern = v as typeof d.brakes.wear.pattern; })}
      />
    </SimpleCheck>
  );
}

export function PressuresItem() {
  const row = useInspection((s) => s.draft.brakes.pressures);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Pressures including spare"
      hint="Match the driver’s-door sticker, not the number on the tire."
      guideId="brakes.pressures"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.brakes.pressures.checked = v; })}
      onNotes={(v) => patch((d) => { d.brakes.pressures.notes = v; })}
    >
      <CornerGrid
        keys={CORNERS_SPARE}
        values={row}
        onChange={(k, v) => patch((d) => { d.brakes.pressures[k as CornerSpare] = v; })}
      />
    </SimpleCheck>
  );
}

export function SteeringItems() {
  const items = useInspection((s) => s.draft.steering.items);
  const notes = useInspection((s) => s.draft.steering.notes);
  const drive = useInspection((s) => s.draft.header.drive);
  const patch = useInspection((s) => s.patch);
  const shows = useShows();
  const visible = STEERING_ITEMS.filter((it) => shows(`steering.${it.key}`));
  if (visible.length === 0) return null;
  return (
    <>
      {visible.map((it) => {
        const row = items[it.key];
        const title = it.key === "shafts" ? drivelineShaftLabel(drive) : it.label;
        return (
          <SimpleCheck
            key={it.key}
            title={title}
            guideId={it.guideId}
            checked={row.checked}
            notes={row.notes}
            onChecked={(v) => patch((d) => { d.steering.items[it.key].checked = v; })}
            onNotes={(v) => patch((d) => { d.steering.items[it.key].notes = v; })}
            photoSlot={photoSlotDef(`steering.${it.key}`)?.slot}
          />
        );
      })}
      <NotesField value={notes} onChange={(v) => patch((d) => { d.steering.notes = v; })} placeholder="Section notes" />
    </>
  );
}

export function UnderbodyItems() {
  const items = useInspection((s) => s.draft.underbody.items);
  const notes = useInspection((s) => s.draft.underbody.notes);
  const patch = useInspection((s) => s.patch);
  const shows = useShows();
  return (
    <>
      {UNDERBODY_ITEMS.filter((it) => shows(`underbody.${it.key}`)).map((it) => {
        const row = items[it.key];
        return (
          <SimpleCheck
            key={it.key}
            title={it.label}
            guideId={it.guideId}
            checked={row.checked}
            notes={row.notes}
            onChecked={(v) => patch((d) => { d.underbody.items[it.key].checked = v; })}
            onNotes={(v) => patch((d) => { d.underbody.items[it.key].notes = v; })}
            photoSlot={photoSlotDef(`underbody.${it.key}`)?.slot}
          />
        );
      })}
      <NotesField value={notes} onChange={(v) => patch((d) => { d.underbody.notes = v; })} placeholder="Section notes" />
    </>
  );
}

function AirbagLampSelect() {
  const value = useInspection((s) => s.draft.cabin.airbagLamp);
  const patch = useInspection((s) => s.patch);
  return (
    <ChipSelect
      label="Lamp"
      value={value}
      options={[
        { value: "prove-out", label: "Prove-out then off" },
        { value: "stay-on", label: "Stay on" },
        { value: "intermittent", label: "Intermittent" },
      ]}
      onChange={(v) => patch((d) => { d.cabin.airbagLamp = v as typeof d.cabin.airbagLamp; })}
    />
  );
}

export function CabinItems() {
  const items = useInspection((s) => s.draft.cabin.items);
  const notes = useInspection((s) => s.draft.cabin.notes);
  const patch = useInspection((s) => s.patch);
  const shows = useShows();
  return (
    <>
      {CABIN_ITEMS.filter((it) => shows(`cabin.${it.key}`)).map((it) => {
        const row = items[it.key];
        return (
          <SimpleCheck
            key={it.key}
            title={it.label}
            guideId={it.guideId}
            checked={row.checked}
            notes={row.notes}
            onChecked={(v) => patch((d) => { d.cabin.items[it.key].checked = v; })}
            onNotes={(v) => patch((d) => { d.cabin.items[it.key].notes = v; })}
            photoSlot={photoSlotDef(`cabin.${it.key}`)?.slot}
          >
            {it.key === "airbag" ? <AirbagLampSelect /> : null}
          </SimpleCheck>
        );
      })}
      {shows("cabin.recalls") ? <RecallsCheck /> : null}
      <NotesField value={notes} onChange={(v) => patch((d) => { d.cabin.notes = v; })} placeholder="Section notes" />
    </>
  );
}

export function RoadItems() {
  const items = useInspection((s) => s.draft.road.items);
  const gauge = useInspection((s) => s.draft.road.gaugeStable);
  const notes = useInspection((s) => s.draft.road.notes);
  const visit = useInspection((s) => s.draft.header.visitType);
  const patch = useInspection((s) => s.patch);
  const smod = useInspection((s) => isSmodRisk(s.draft) && !s.draft.smodAcknowledged);
  const shows = useShows();
  const short = visit === "oil-change" || (visit === "recommended" && !shows("transTable"));
  if (smod) {
    return (
      <div className="hud-alert text-sm leading-relaxed text-foreground">
        Road test is locked. ATF is pink, milky, or sweet. Do not drive it.
      </div>
    );
  }
  return (
    <>
      {ROAD_ITEMS.filter((it) => shows(`road.${it.key}`)).map((it) => {
        const row = items[it.key];
        const title =
          short && it.key === "overheat"
            ? "No overheat on the short loop"
            : short && it.key === "shifts"
              ? "One clean upshift"
              : short && it.key === "brakes"
                ? "One firm stop — no pull, no pulse"
                : it.label;
        return (
          <SimpleCheck
            key={it.key}
            title={title}
            guideId={it.guideId}
            checked={row.checked}
            notes={row.notes}
            onChecked={(v) => patch((d) => { d.road.items[it.key].checked = v; })}
            onNotes={(v) => patch((d) => { d.road.items[it.key].notes = v; })}
          >
            {it.key === "overheat" ? (
              <ChipSelect
                label="Gauge stable"
                value={gauge}
                options={[
                  { value: "Y", label: "Y" },
                  { value: "N", label: "N" },
                ]}
                onChange={(v) => patch((d) => { d.road.gaugeStable = v as typeof d.road.gaugeStable; })}
              />
            ) : null}
          </SimpleCheck>
        );
      })}
      <NotesField value={notes} onChange={(v) => patch((d) => { d.road.notes = v; })} placeholder="Section notes" />
    </>
  );
}

const SEEP_GRADES = [
  { value: "dry", label: "Dry" },
  { value: "film", label: "Film" },
  { value: "wet", label: "Wet" },
  { value: "drip", label: "Drip" },
];

function grade(row: { verdict: PassFail; checked: boolean }, v: string) {
  row.verdict = v as PassFail;
  row.checked = v !== "";
}

export function BaselineItems({ only }: { only?: string }) {
  const b = useInspection((s) => s.draft.baseline);
  const drive = useInspection((s) => s.draft.header.drive);
  const patch = useInspection((s) => s.patch);
  const fourwd = driveShows(drive, "4WD");
  const show = (k: string) => !only || only === k;
  return (
    <>
      {only ? null : (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Baseline 270k — Pass or Fail on each line. Notes are not a grade.
        </p>
      )}
      {show("sparkPlugs") ? (
      <SimpleCheck
        title="Spark plugs (105k iridium — cycle 2 or 3)"
        hint="At 270k you are on replacement cycle 2 or 3. Unknown last change is a Fail."
        guideId="baseline.sparkPlugs"
        checked={b.sparkPlugs.checked}
        notes={b.sparkPlugs.notes}
        onChecked={(v) => patch((d) => { d.baseline.sparkPlugs.checked = v; })}
        onNotes={(v) => patch((d) => { d.baseline.sparkPlugs.notes = v; })}
      >
        <TextField
          label="Last replaced at miles"
          value={b.sparkPlugs.lastMiles}
          inputMode="numeric"
          placeholder="unknown"
          onChange={(v) => patch((d) => { d.baseline.sparkPlugs.lastMiles = v.replace(/[^\d]/g, ""); })}
        />
        <ChipSelect
          label="Cycle"
          value={b.sparkPlugs.cycle}
          options={[
            { value: "2", label: "2 (210k)" },
            { value: "3", label: "3 (315k)" },
            { value: "unknown", label: "Unknown" },
          ]}
          onChange={(v) => patch((d) => { d.baseline.sparkPlugs.cycle = v as typeof d.baseline.sparkPlugs.cycle; })}
        />
        <VerdictSelect value={b.sparkPlugs.verdict} onChange={(v) => patch((d) => grade(d.baseline.sparkPlugs, v))} />
      </SimpleCheck>
      ) : null}
      {show("coolantService") ? (
      <SimpleCheck
        title="Coolant service + cap + thermostat + water-pump weep"
        hint="60k / 5 years if history unknown. Weep hole wet is a Fail."
        guideId="baseline.coolantService"
        checked={b.coolantService.checked}
        notes={b.coolantService.notes}
        onChecked={(v) => patch((d) => { d.baseline.coolantService.checked = v; })}
        onNotes={(v) => patch((d) => { d.baseline.coolantService.notes = v; })}
      >
        <TextField
          label="Last coolant service"
          value={b.coolantService.lastService}
          placeholder="miles or year"
          onChange={(v) => patch((d) => { d.baseline.coolantService.lastService = v; })}
        />
        <ChipSelect
          label="Radiator cap"
          value={b.coolantService.cap}
          options={[{ value: "pass", label: "Pass" }, { value: "fail", label: "Fail" }]}
          onChange={(v) => patch((d) => { d.baseline.coolantService.cap = v as PassFail; })}
        />
        <ChipSelect
          label="Thermostat"
          value={b.coolantService.thermostat}
          options={[{ value: "pass", label: "Pass" }, { value: "fail", label: "Fail" }]}
          onChange={(v) => patch((d) => { d.baseline.coolantService.thermostat = v as PassFail; })}
        />
        <ChipSelect
          label="Water-pump weep"
          value={b.coolantService.pumpWeep}
          options={[
            { value: "N", label: "Dry" },
            { value: "Y", label: "Wet" },
          ]}
          onChange={(v) => patch((d) => { d.baseline.coolantService.pumpWeep = v as typeof d.baseline.coolantService.pumpWeep; })}
        />
        <VerdictSelect value={b.coolantService.verdict} onChange={(v) => patch((d) => grade(d.baseline.coolantService, v))} />
      </SimpleCheck>
      ) : null}
      {show("brakeFluid") ? (
      <SimpleCheck
        title="Brake fluid (DOT 3, moisture)"
        hint="Flush every 24 months. Dark or high moisture is a Fail."
        guideId="baseline.brakeFluid"
        checked={b.brakeFluid.checked}
        notes={b.brakeFluid.notes}
        onChecked={(v) => patch((d) => { d.baseline.brakeFluid.checked = v; })}
        onNotes={(v) => patch((d) => { d.baseline.brakeFluid.notes = v; })}
      >
        <TextField
          label="Last flush"
          value={b.brakeFluid.lastFlush}
          placeholder="miles or date"
          onChange={(v) => patch((d) => { d.baseline.brakeFluid.lastFlush = v; })}
        />
        <VerdictSelect value={b.brakeFluid.verdict} onChange={(v) => patch((d) => grade(d.baseline.brakeFluid, v))} />
      </SimpleCheck>
      ) : null}
      {show("diffFluid") ? (
      <SimpleCheck
        title="Diff and transfer-case fluid"
        hint="Fill-plug level, not just a seep look. 30k fluid. 2WD is rear only."
        guideId="baseline.diffFluid"
        checked={b.diffFluid.checked}
        notes={b.diffFluid.notes}
        onChecked={(v) => patch((d) => { d.baseline.diffFluid.checked = v; })}
        onNotes={(v) => patch((d) => { d.baseline.diffFluid.notes = v; })}
      >
        {fourwd ? (
          <>
            <ChipSelect
              label="Transfer fill plug"
              value={b.diffFluid.transfer}
              options={[{ value: "pass", label: "Pass" }, { value: "fail", label: "Fail" }]}
              onChange={(v) => patch((d) => { d.baseline.diffFluid.transfer = v as PassFail; })}
            />
            <ChipSelect
              label="Front diff fill plug"
              value={b.diffFluid.front}
              options={[{ value: "pass", label: "Pass" }, { value: "fail", label: "Fail" }]}
              onChange={(v) => patch((d) => { d.baseline.diffFluid.front = v as PassFail; })}
            />
          </>
        ) : null}
        <ChipSelect
          label="Rear diff fill plug"
          value={b.diffFluid.rear}
          options={[{ value: "pass", label: "Pass" }, { value: "fail", label: "Fail" }]}
          onChange={(v) => patch((d) => { d.baseline.diffFluid.rear = v as PassFail; })}
        />
        <VerdictSelect value={b.diffFluid.verdict} onChange={(v) => patch((d) => grade(d.baseline.diffFluid, v))} />
      </SimpleCheck>
      ) : null}
      {show("seepage") ? (
      <SimpleCheck
        title="Valve-cover / timing-cover / oil-pan seepage grade"
        hint="Grade each. Wet or drip is a Fail — not a watch note."
        guideId="baseline.seepage"
        checked={b.seepage.checked}
        notes={b.seepage.notes}
        onChecked={(v) => patch((d) => { d.baseline.seepage.checked = v; })}
        onNotes={(v) => patch((d) => { d.baseline.seepage.notes = v; })}
      >
        <ChipSelect
          label="Valve covers"
          value={b.seepage.valveCover}
          options={SEEP_GRADES}
          onChange={(v) => patch((d) => { d.baseline.seepage.valveCover = v as SeepGrade; })}
        />
        <ChipSelect
          label="Timing cover"
          value={b.seepage.timingCover}
          options={SEEP_GRADES}
          onChange={(v) => patch((d) => { d.baseline.seepage.timingCover = v as SeepGrade; })}
        />
        <ChipSelect
          label="Oil pan"
          value={b.seepage.oilPan}
          options={SEEP_GRADES}
          onChange={(v) => patch((d) => { d.baseline.seepage.oilPan = v as SeepGrade; })}
        />
        <VerdictSelect value={b.seepage.verdict} onChange={(v) => patch((d) => grade(d.baseline.seepage, v))} />
      </SimpleCheck>
      ) : null}
      {show("manifoldBolts") ? (
      <SimpleCheck
        title="Exhaust manifold / heat-shield bolts"
        hint="VK56 classic. Loose or missing heat-shield bolts are a Fail."
        guideId="baseline.manifoldBolts"
        checked={b.manifoldBolts.checked}
        notes={b.manifoldBolts.notes}
        onChecked={(v) => patch((d) => { d.baseline.manifoldBolts.checked = v; })}
        onNotes={(v) => patch((d) => { d.baseline.manifoldBolts.notes = v; })}
      >
        <VerdictSelect value={b.manifoldBolts.verdict} onChange={(v) => patch((d) => grade(d.baseline.manifoldBolts, v))} />
      </SimpleCheck>
      ) : null}
      {show("ucaJoints") ? (
      <SimpleCheck
        title="Upper control arms / ball joints"
        hint="Pair with inner pad/tire taper. Loose UCA or joint is a Fail."
        guideId="baseline.ucaJoints"
        checked={b.ucaJoints.checked}
        notes={b.ucaJoints.notes}
        onChecked={(v) => patch((d) => { d.baseline.ucaJoints.checked = v; })}
        onNotes={(v) => patch((d) => { d.baseline.ucaJoints.notes = v; })}
      >
        <ChipSelect
          label="Inner pad / tire taper"
          value={b.ucaJoints.innerTaper}
          options={[
            { value: "N", label: "Even" },
            { value: "Y", label: "Inner taper" },
          ]}
          onChange={(v) => patch((d) => { d.baseline.ucaJoints.innerTaper = v as typeof d.baseline.ucaJoints.innerTaper; })}
        />
        <VerdictSelect value={b.ucaJoints.verdict} onChange={(v) => patch((d) => grade(d.baseline.ucaJoints, v))} />
      </SimpleCheck>
      ) : null}
      {show("airShocks") ? (
      <SimpleCheck
        title="Rear load-leveling / air shocks"
        hint="If not equipped, Pass. If equipped, leaks or sag are a Fail."
        guideId="baseline.airShocks"
        checked={b.airShocks.checked}
        notes={b.airShocks.notes}
        onChecked={(v) => patch((d) => { d.baseline.airShocks.checked = v; })}
        onNotes={(v) => patch((d) => { d.baseline.airShocks.notes = v; })}
      >
        <ChipSelect
          label="Equipped"
          value={b.airShocks.equipped}
          options={[
            { value: "N", label: "Not equipped" },
            { value: "Y", label: "Equipped" },
          ]}
          onChange={(v) => patch((d) => { d.baseline.airShocks.equipped = v as typeof d.baseline.airShocks.equipped; })}
        />
        <VerdictSelect value={b.airShocks.verdict} onChange={(v) => patch((d) => grade(d.baseline.airShocks, v))} />
      </SimpleCheck>
      ) : null}
      {only ? null : <NotesField value={b.notes} onChange={(v) => patch((d) => { d.baseline.notes = v; })} placeholder="270k due notes" />}
    </>
  );
}

export function ResultItem() {
  const r = useInspection((s) => s.draft.result);
  const line = useInspection((s) => oilChangeRecord(s.draft));
  const patch = useInspection((s) => s.patch);
  const oilChangeVisit = useInspection((s) => oilChangeMode(s.draft));
  const showPlan = useInspection((s) =>
    rowShows("smodPlan", s.draft.header.visitType, s.draft.header.drive, s.draft.header.plan),
  );
  const blocked = useInspection((s) => overallBlocked(s.draft));
  const embed = useContext(WalkEmbed);
  return (
    <div className="space-y-3">
      {showPlan && !embed ? <SmodPlanItem /> : null}
      <div className="hud-card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="pt-2.5 font-semibold text-foreground">Overall</h3>
        <GuideLink id="result.overall" label="Overall result" />
      </div>
      <PlainButton id="result.overall" title="Overall result" />
      <ChipSelect
        value={r.overall}
        options={OVERALL_OPTIONS.map((o) => ({
          value: o.value,
          label: o.label,
          disabled: blocked && (o.value === "pass" || o.value === "pass-notes"),
        }))}
        onChange={(v) => patch((d) => {
          d.result.overall = (blocked && (v === "pass" || v === "pass-notes") ? "do-not-drive" : v) as typeof d.result.overall;
        })}
      />
      {blocked ? (
        <p className="text-sm leading-relaxed text-fail">
          Pass is blocked. A hard gate is open — overall is Do not drive.
        </p>
      ) : null}
      <NotesField
        value={r.failItems}
        onChange={(v) => patch((d) => { d.result.failItems = v; })}
        placeholder="Fail items"
      />
      {oilChangeVisit ? (
        <p className="text-sm leading-relaxed text-foreground">{line}</p>
      ) : (
        <TextField
          label="Oil change @"
          value={r.oilChangeMi}
          inputMode="numeric"
          placeholder="miles"
          onChange={(v) => patch((d) => { d.result.oilChangeMi = v; })}
        />
      )}
      <LogOilButton />
      <TextField
        label="15k @"
        value={r.service15kMi}
        inputMode="numeric"
        onChange={(v) => patch((d) => { d.result.service15kMi = v; })}
      />
      <TextField
        label="30k powertrain @"
        value={r.service30kMi}
        inputMode="numeric"
        onChange={(v) => patch((d) => { d.result.service30kMi = v; })}
      />
      <TextField
        label="Sign-off name"
        value={r.signName}
        onChange={(v) => patch((d) => { d.result.signName = v; })}
      />
      <label className="block space-y-1.5">
        <span className="field-label">Sign date</span>
        <input
          type="date"
          value={r.signDate}
          onChange={(e) => patch((d) => { d.result.signDate = e.target.value; })}
          className="field-input"
        />
      </label>
      </div>
    </div>
  );
}

function SmodPlanItem() {
  const plan = useInspection((s) => s.draft.result.smodPlan);
  const bypass = useInspection((s) => s.draft.engine.atfLines.bypassDone);
  const line = useInspection((s) => smodPlanRecord(s.draft));
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="SMOD prevention — 30k / 270k"
      hint="Not milky today is not a maintenance plan. Photo the cooler fittings."
      guideId="result.smodPlan"
      checked={plan.checked}
      notes={plan.notes}
      onChecked={(v) => patch((d) => { d.result.smodPlan.checked = v; })}
      onNotes={(v) => patch((d) => { d.result.smodPlan.notes = v; })}
      photoSlot="engine.radiator"
      photoRequired
    >
      <ChipSelect
        label="Radiator last replacement"
        value={plan.radiatorLast}
        options={[
          { value: "original", label: "Original / unknown" },
          { value: "replaced", label: "Replaced" },
        ]}
        onChange={(v) => patch((d) => { d.result.smodPlan.radiatorLast = v as typeof d.result.smodPlan.radiatorLast; })}
      />
      {plan.radiatorLast === "replaced" ? (
        <TextField
          label="Replaced (year or YYYY-MM)"
          value={plan.radiatorDate}
          placeholder="2019-06"
          onChange={(v) => patch((d) => { d.result.smodPlan.radiatorDate = v; })}
        />
      ) : null}
      <p className="text-sm leading-relaxed text-muted-foreground">
        Bypass / external cooler: {bypass === "Y" ? "installed" : bypass === "N" ? "not installed" : "not marked — see cooler lines"}.
      </p>
      <p className="text-sm leading-relaxed text-foreground">{SMOD_INTERVAL}</p>
      <p className="text-sm leading-relaxed text-foreground">{line}</p>
    </SimpleCheck>
  );
}

function SteeringOne({ id }: { id: SteeringKey }) {
  const it = STEERING_ITEMS.find((x) => x.key === id)!;
  const row = useInspection((s) => s.draft.steering.items[id]);
  const drive = useInspection((s) => s.draft.header.drive);
  const patch = useInspection((s) => s.patch);
  const title = id === "shafts" ? drivelineShaftLabel(drive) : it.label;
  return (
    <SimpleCheck
      title={title}
      guideId={it.guideId}
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.steering.items[id].checked = v; })}
      onNotes={(v) => patch((d) => { d.steering.items[id].notes = v; })}
      photoSlot={photoSlotDef(`steering.${id}`)?.slot}
    />
  );
}

function UnderbodyOne({ id }: { id: UnderbodyKey }) {
  const it = UNDERBODY_ITEMS.find((x) => x.key === id)!;
  const row = useInspection((s) => s.draft.underbody.items[id]);
  const patch = useInspection((s) => s.patch);
  const shows = useShows();
  if (!shows(`underbody.${id}`)) return null;
  return (
    <SimpleCheck
      title={it.label}
      guideId={it.guideId}
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.underbody.items[id].checked = v; })}
      onNotes={(v) => patch((d) => { d.underbody.items[id].notes = v; })}
      photoSlot={photoSlotDef(`underbody.${id}`)?.slot}
    />
  );
}

function CabinOne({ id }: { id: CabinKey }) {
  const it = CABIN_ITEMS.find((x) => x.key === id)!;
  const row = useInspection((s) => s.draft.cabin.items[id]);
  const patch = useInspection((s) => s.patch);
  const shows = useShows();
  if (!shows(`cabin.${id}`)) return null;
  return (
    <SimpleCheck
      title={it.label}
      guideId={it.guideId}
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.cabin.items[id].checked = v; })}
      onNotes={(v) => patch((d) => { d.cabin.items[id].notes = v; })}
      photoSlot={photoSlotDef(`cabin.${id}`)?.slot}
    >
      {id === "airbag" ? <AirbagLampSelect /> : null}
    </SimpleCheck>
  );
}

function RoadOne({ id }: { id: RoadKey }) {
  const it = ROAD_ITEMS.find((x) => x.key === id)!;
  const row = useInspection((s) => s.draft.road.items[id]);
  const gauge = useInspection((s) => s.draft.road.gaugeStable);
  const patch = useInspection((s) => s.patch);
  const smod = useInspection((s) => isSmodRisk(s.draft) && !s.draft.smodAcknowledged);
  if (smod) {
    return (
      <div className="hud-alert text-sm text-foreground">
        Road test is locked. ATF is pink, milky, or sweet.
      </div>
    );
  }
  return (
    <SimpleCheck
      title={it.label}
      guideId={it.guideId}
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.road.items[id].checked = v; })}
      onNotes={(v) => patch((d) => { d.road.items[id].notes = v; })}
    >
      {id === "overheat" ? (
        <ChipSelect
          label="Gauge stable"
          value={gauge}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.road.gaugeStable = v as typeof d.road.gaugeStable; })}
        />
      ) : null}
    </SimpleCheck>
  );
}

export function CheckRowById({ id }: { id: string }) {
  const highlight = useInspection((s) => s.headerHighlight);
  const embed = useContext(WalkEmbed);
  if (id === "header") return <HeaderFields highlight={highlight} />;
  if (id === "engine.overview") {
    if (embed) return null;
    return (
      <div className="hud-card space-y-3">
        <h3 className="text-base font-semibold text-foreground">Engine bay overview</h3>
        <p className="text-sm text-muted-foreground">One wide shot — tanks, belt, battery, leaks.</p>
        <PlainButton id="engine.overview" title="Engine bay overview" />
        <PhotoField slot="engine.overview" required label="Engine bay overview" />
      </div>
    );
  }
  if (id === "cabin.dash") {
    if (embed) return null;
    return (
      <div className="hud-card space-y-3">
        <h3 className="text-base font-semibold text-foreground">Dash warning lights (key ON)</h3>
        <PlainButton id="cabin.dash" title="Dash warning lights (key on)" />
        <PhotoField slot="cabin.dash" required label="Dash warning lights (key on)" />
      </div>
    );
  }
  if (id === "oilLevel") return <OilLevelItem />;
  if (id === "atf") return <AtfItem />;
  if (id === "washer") return <WasherItem />;
  if (id === "oilLeak") {
    return <FluidsOneLeak />;
  }
  if (id === "coolant") return <CoolantItem />;
  if (id === "psf") return <PsfItem />;
  if (id === "brake") return <BrakeFluidItem />;
  if (id === "transferSeep") return <TransferSeepItem />;
  if (id === "frontDiffSeep") return <FrontDiffSeepItem />;
  if (id === "rearDiffSeep") return <RearDiffSeepItem />;
  if (id === "timingCover") return <EngineSlice slice="timingCover" />;
  if (id === "manifolds") return <EngineSlice slice="manifolds" />;
  if (id === "idle") return <EngineSlice slice="idle" />;
  if (id === "belt") return <EngineSlice slice="belt" />;
  if (id === "radiator") return <RadiatorItem />;
  if (id === "atfLines") return <AtfLinesItem />;
  if (id === "airFilter") return <EngineSlice slice="airFilter" />;
  if (id === "battery") return <EngineSlice slice="battery" />;
  if (id === "grounds") return <EngineSlice slice="grounds" />;
  if (id === "pcv") return <EngineSlice slice="pcv" />;
  if (id === "scan") return <EngineSlice slice="scan" />;
  if (id === "transTable") return <TransTable />;
  if (id === "atfReject") return <AtfRejectItem />;
  if (id === "smodPlan") return <SmodPlanItem />;
  if (id === "baseline") return <BaselineItems />;
  if (id.startsWith("baseline.")) return <BaselineItems only={id.slice("baseline.".length)} />;
  if (id === "pads") return <BrakeSlice slice="pads" />;
  if (id === "rotors") return <BrakeSlice slice="rotors" />;
  if (id === "hoses") return <BrakeSlice slice="hoses" />;
  if (id === "master") return <BrakeSlice slice="master" />;
  if (id === "pedalHeight") return <BrakeSlice slice="pedalHeight" />;
  if (id === "parking") return <BrakeSlice slice="parking" />;
  if (id === "absLamps") return <AbsLampsItem />;
  if (id === "tread") return <TreadItem />;
  if (id === "tireAge") return <TireAgeItem />;
  if (id === "wear") return <WearItem />;
  if (id === "pressures") return <PressuresItem />;
  if (id === "lugTorque") return <BrakeSlice slice="lugTorque" />;
  if (id === "bearings") return <BrakeSlice slice="bearings" />;
  if (id === "alignment") return <BrakeSlice slice="alignment" />;
  if (id.startsWith("steering.")) return <SteeringOne id={id.slice("steering.".length) as SteeringKey} />;
  if (id.startsWith("underbody.")) return <UnderbodyOne id={id.slice("underbody.".length) as UnderbodyKey} />;
  if (id === "cabin.recalls") return <CabinRecalls />;
  if (id.startsWith("cabin.")) return <CabinOne id={id.slice("cabin.".length) as CabinKey} />;
  if (id.startsWith("road.")) return <RoadOne id={id.slice("road.".length) as RoadKey} />;
  if (id === "result") return <ResultItem />;
  return null;
}

function FluidsOneLeak() {
  const row = useInspection((s) => s.draft.fluids.oilLeak);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Engine oil leak check"
      hint="Valve covers / oil cooler O-ring / pan / front cover"
      guideId="fluids.oilLeak"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.fluids.oilLeak.checked = v; })}
      onNotes={(v) => patch((d) => { d.fluids.oilLeak.notes = v; })}
      photoSlot="fluids.oilLeak"
    />
  );
}

function CoolantItem() {
  const row = useInspection((s) => s.draft.fluids.coolant);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Coolant reservoir level & color"
      hint="Engine cold. Do not open the radiator cap hot."
      guideId="fluids.coolant"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.fluids.coolant.checked = v; })}
      onNotes={(v) => patch((d) => { d.fluids.coolant.notes = v; })}
      photoSlot="fluids.coolant"
    >
      <TextField label="Level & color" value={row.levelColor} onChange={(v) => patch((d) => { d.fluids.coolant.levelColor = v; })} />
      <TextField
        label="Freeze point"
        value={row.freezeF}
        placeholder="-34°F"
        inputMode="decimal"
        onChange={(v) => patch((d) => { d.fluids.coolant.freezeF = v; })}
      />
      <ChipSelect
        label="Cap seated"
        value={row.capSeated}
        options={[
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
        ]}
        onChange={(v) => patch((d) => { d.fluids.coolant.capSeated = v as typeof d.fluids.coolant.capSeated; })}
      />
    </SimpleCheck>
  );
}

function PsfItem() {
  const row = useInspection((s) => s.draft.fluids.psf);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Power steering fluid"
      hint="COLD marks when cold, HOT marks after a drive. Nissan PSF."
      guideId="fluids.psf"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.fluids.psf.checked = v; })}
      onNotes={(v) => patch((d) => { d.fluids.psf.notes = v; })}
      photoSlot="fluids.psf"
    >
      <TextField label="Level" value={row.level} onChange={(v) => patch((d) => { d.fluids.psf.level = v; })} />
      <TextField label="Color" value={row.color} onChange={(v) => patch((d) => { d.fluids.psf.color = v; })} />
    </SimpleCheck>
  );
}

function BrakeFluidItem() {
  const row = useInspection((s) => s.draft.fluids.brake);
  const patch = useInspection((s) => s.patch);
  return (
    <SimpleCheck
      title="Brake fluid"
      hint="DOT 3 from a sealed bottle. Flush every 24 months."
      guideId="fluids.brake"
      checked={row.checked}
      notes={row.notes}
      onChecked={(v) => patch((d) => { d.fluids.brake.checked = v; })}
      onNotes={(v) => patch((d) => { d.fluids.brake.notes = v; })}
      photoSlot="fluids.brake"
    >
      <TextField label="Level" value={row.level} onChange={(v) => patch((d) => { d.fluids.brake.level = v; })} />
      <ChipSelect
        label="Color"
        value={row.color}
        options={[
          { value: "clear-amber", label: "Clear-amber" },
          { value: "dark", label: "Dark" },
        ]}
        onChange={(v) => patch((d) => { d.fluids.brake.color = v as typeof d.fluids.brake.color; })}
      />
      <ChipSelect
        label="Moisture"
        value={row.moisture}
        options={[
          { value: "dry", label: "Dry" },
          { value: "high", label: "High" },
        ]}
        onChange={(v) => patch((d) => { d.fluids.brake.moisture = v as typeof d.fluids.brake.moisture; })}
      />
      <ChipSelect
        label="Cap sealed"
        value={row.capSealed}
        options={[
          { value: "Y", label: "Y" },
          { value: "N", label: "N" },
        ]}
        onChange={(v) => patch((d) => { d.fluids.brake.capSealed = v as typeof d.fluids.brake.capSealed; })}
      />
    </SimpleCheck>
  );
}

function CabinRecalls() {
  return <RecallsCheck />;
}

function RecallsCheck() {
  const recalls = useInspection((s) => s.draft.cabin.recalls);
  const vin = useInspection((s) => s.draft.header.vin);
  const visitDate = useInspection((s) => s.draft.header.date);
  const patch = useInspection((s) => s.patch);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [mismatch, setMismatch] = useState(false);
  const ready = isVinComplete(vin);
  const stale = Boolean(recalls.vinChecked && normalizeVin(vin) !== recalls.vinChecked);
  const stamp = recalls.checkedAt
    ? recallStamp({
        checkedAt: recalls.checkedAt,
        vinChecked: recalls.vinChecked,
        ymm: recalls.ymm,
        campaigns: recalls.campaigns,
      })
    : "";

  async function run() {
    if (!ready) {
      setErr("Enter the 17-character VIN in the header first.");
      return;
    }
    setBusy(true);
    setErr("");
    setMismatch(false);
    try {
      const res = await lookupNissanCampaigns({ data: { vin } });
      if (res.status !== "ok") {
        setErr(res.error);
        return;
      }
      setMismatch(res.mismatch);
      patch((d) => {
        d.cabin.recalls.checked = true;
        d.cabin.recalls.checkedAt = visitDate.trim() || res.checkedAt;
        d.cabin.recalls.vinChecked = res.vin;
        d.cabin.recalls.ymm = res.ymm;
        d.cabin.recalls.source = res.source;
        d.cabin.recalls.campaigns = res.campaigns;
      });
    } catch {
      setErr("Could not reach the NHTSA campaign list. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <SimpleCheck
      title="Nissan campaigns"
      hint="Live VIN lookup. Stamps the form with the date."
      guideId="cabin.recalls"
      checked={recalls.checked}
      notes={recalls.notes}
      onChecked={(v) => patch((d) => { d.cabin.recalls.checked = v; })}
      onNotes={(v) => patch((d) => { d.cabin.recalls.notes = v; })}
    >
      <p className="font-mono text-xs tracking-wide text-muted-foreground">
        VIN {vin || "—"} {ready ? "" : "· 17 characters"}
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void run()}
        className="tap-56 w-full rounded border border-primary bg-raised px-3 text-sm font-semibold text-primary"
      >
        {busy ? "Checking NHTSA…" : "Check Nissan campaigns"}
      </button>
      {err ? <p className="text-sm text-warn">{err}</p> : null}
      {mismatch ? (
        <p className="text-sm text-warn">VIN decoded as {recalls.ymm || "a different vehicle"} — not this 2005 Armada. Stamp is still on the form.</p>
      ) : null}
      {stale ? <p className="text-sm text-warn">Header VIN changed since the last check. Run it again.</p> : null}
      {stamp ? (
        <div className="space-y-2 rounded border border-border bg-inset px-3 py-2">
          <p className="text-sm leading-relaxed text-foreground">{stamp}</p>
          {recalls.campaigns.length ? (
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {recalls.campaigns.map((c) => (
                <li key={c.id}>
                  <span className="font-mono text-foreground">{c.id}</span>
                  {" — "}
                  {c.component}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">NHTSA listed no campaigns for that year/make/model.</p>
          )}
        </div>
      ) : null}
    </SimpleCheck>
  );
}

function EngineSlice({
  slice,
}: {
  slice: "timingCover" | "manifolds" | "idle" | "belt" | "airFilter" | "battery" | "grounds" | "pcv" | "scan";
}) {
  return <EngineItemsFiltered only={slice} />;
}

function EngineItemsFiltered({
  only,
}: {
  only: "timingCover" | "manifolds" | "idle" | "belt" | "airFilter" | "battery" | "grounds" | "pcv" | "scan";
}) {
  const e = useInspection((s) => s.draft.engine);
  const patch = useInspection((s) => s.patch);
  const shows = useShows();
  const interval = shows("battery") || shows("scan") || shows("airFilter");
  if (only === "timingCover") {
    return (
      <SimpleCheck
        title="Cold-start noise — timing cover"
        hint="Short rattle 1–3 sec then gone is common. Ongoing rattle is not."
        guideId="engine.timingCover"
        checked={e.timingCover.checked}
        notes={e.timingCover.notes}
        onChecked={(v) => patch((d) => { d.engine.timingCover.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.timingCover.notes = v; })}
      >
        <ChipSelect
          label="Noise"
          value={e.timingCover.noise}
          options={[
            { value: "quiet", label: "Quiet" },
            { value: "short-rattle", label: "Short rattle" },
            { value: "ongoing-rattle", label: "Ongoing rattle" },
          ]}
          onChange={(v) => patch((d) => { d.engine.timingCover.noise = v as typeof d.engine.timingCover.noise; })}
        />
        <TextField label="Seconds" value={e.timingCover.seconds} inputMode="numeric" onChange={(v) => patch((d) => { d.engine.timingCover.seconds = v; })} />
        <ChipSelect
          label="Oil pressure"
          value={e.timingCover.oilPressure}
          options={[
            { value: "ok", label: "In the green" },
            { value: "low", label: "Low / lamp" },
          ]}
          onChange={(v) => patch((d) => { d.engine.timingCover.oilPressure = v as typeof d.engine.timingCover.oilPressure; })}
        />
      </SimpleCheck>
    );
  }
  if (only === "manifolds") {
    return (
      <SimpleCheck
        title="Cold-start noise — exhaust manifolds"
        hint="Tick plus soot at the flange gets scheduled."
        guideId="engine.manifolds"
        checked={e.manifolds.checked}
        notes={e.manifolds.notes}
        onChecked={(v) => patch((d) => { d.engine.manifolds.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.manifolds.notes = v; })}
      >
        <ChipSelect
          label="Noise"
          value={e.manifolds.noise}
          options={[
            { value: "quiet", label: "Quiet" },
            { value: "tick-l", label: "Tick L" },
            { value: "tick-r", label: "Tick R" },
            { value: "both", label: "Both" },
          ]}
          onChange={(v) => patch((d) => { d.engine.manifolds.noise = v as typeof d.engine.manifolds.noise; })}
        />
        {interval ? (
          <ChipSelect
            label="Soot at flange"
            value={e.manifolds.soot}
            options={[
              { value: "Y", label: "Y" },
              { value: "N", label: "N" },
            ]}
            onChange={(v) => patch((d) => { d.engine.manifolds.soot = v as typeof d.engine.manifolds.soot; })}
          />
        ) : null}
      </SimpleCheck>
    );
  }
  if (only === "idle") {
    return (
      <SimpleCheck
        title="Idle quality"
        guideId="engine.idle"
        checked={e.idle.checked}
        notes={e.idle.notes}
        onChecked={(v) => patch((d) => { d.engine.idle.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.idle.notes = v; })}
      >
        <ChipSelect
          label="Quality"
          value={e.idle.quality}
          options={[
            { value: "smooth", label: "Smooth" },
            { value: "rough", label: "Rough" },
          ]}
          onChange={(v) => patch((d) => { d.engine.idle.quality = v as typeof d.engine.idle.quality; })}
        />
        <ChipSelect
          label="CEL"
          value={e.idle.cel}
          options={[
            { value: "off", label: "Off" },
            { value: "on", label: "On" },
          ]}
          onChange={(v) => patch((d) => { d.engine.idle.cel = v as typeof d.engine.idle.cel; })}
        />
      </SimpleCheck>
    );
  }
  if (only === "belt") {
    return (
      <SimpleCheck
        title="Serpentine belt"
        guideId="engine.belt"
        checked={e.belt.checked}
        notes={e.belt.notes}
        onChecked={(v) => patch((d) => { d.engine.belt.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.belt.notes = v; })}
      >
        <ChipSelect
          label="Condition"
          value={e.belt.condition}
          options={[
            { value: "ok", label: "OK" },
            { value: "cracks", label: "Cracks" },
            { value: "glaze", label: "Glaze" },
            { value: "fray", label: "Fray" },
          ]}
          onChange={(v) => patch((d) => { d.engine.belt.condition = v as typeof d.engine.belt.condition; })}
        />
        <ChipSelect
          label="Tensioner play"
          value={e.belt.tensionerPlay}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.engine.belt.tensionerPlay = v as typeof d.engine.belt.tensionerPlay; })}
        />
      </SimpleCheck>
    );
  }
  if (only === "airFilter") {
    return (
      <SimpleCheck
        title="Air filter"
        hint="Cabin filter is a 15k item, behind the glove box."
        guideId="engine.airFilter"
        checked={e.airFilter.checked}
        notes={e.airFilter.notes}
        onChecked={(v) => patch((d) => { d.engine.airFilter.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.airFilter.notes = v; })}
      >
        <ChipSelect
          label="Condition"
          value={e.airFilter.condition}
          options={[
            { value: "clean", label: "Clean" },
            { value: "dirty", label: "Dirty" },
            { value: "replace", label: "Replace" },
          ]}
          onChange={(v) => patch((d) => { d.engine.airFilter.condition = v as typeof d.engine.airFilter.condition; })}
        />
        {interval ? (
          <ChipSelect
            label="Cabin filter due"
            value={e.airFilter.cabinDue}
            options={[
              { value: "Y", label: "Y" },
              { value: "N", label: "N" },
            ]}
            onChange={(v) => patch((d) => { d.engine.airFilter.cabinDue = v as typeof d.engine.airFilter.cabinDue; })}
          />
        ) : null}
      </SimpleCheck>
    );
  }
  if (only === "battery") {
    return (
      <SimpleCheck
        title="Battery"
        hint={interval ? "Rest ~12.4–12.7 V. Running ~13.5–14.7 V." : "Glance the terminals. Load test unhides at 15k / 30k."}
        guideId="engine.battery"
        checked={e.battery.checked}
        notes={e.battery.notes}
        onChecked={(v) => patch((d) => { d.engine.battery.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.battery.notes = v; })}
        photoSlot="engine.battery"
      >
        {interval ? (
          <>
            <TextField label="Rest V" value={e.battery.restV} inputMode="decimal" onChange={(v) => patch((d) => { d.engine.battery.restV = v; })} />
            <TextField label="Running V" value={e.battery.runningV} inputMode="decimal" onChange={(v) => patch((d) => { d.engine.battery.runningV = v; })} />
          </>
        ) : null}
        <ChipSelect
          label="Terminals clean"
          value={e.battery.terminalsClean}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.engine.battery.terminalsClean = v as typeof d.engine.battery.terminalsClean; })}
        />
        {interval ? (
          <ChipSelect
            label="Load test"
            value={e.battery.loadTest}
            options={[
              { value: "pass", label: "Pass" },
              { value: "fail", label: "Fail" },
            ]}
            onChange={(v) => patch((d) => { d.engine.battery.loadTest = v as typeof d.engine.battery.loadTest; })}
          />
        ) : null}
      </SimpleCheck>
    );
  }
  if (only === "grounds") {
    return (
      <SimpleCheck
        title="Ground straps"
        hint="Block-to-chassis and body."
        guideId="engine.grounds"
        checked={e.grounds.checked}
        notes={e.grounds.notes}
        onChecked={(v) => patch((d) => { d.engine.grounds.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.grounds.notes = v; })}
        photoSlot="engine.grounds"
      >
        <ChipSelect
          label="Condition"
          value={e.grounds.condition}
          options={[
            { value: "tight", label: "Tight" },
            { value: "corroded", label: "Corroded" },
          ]}
          onChange={(v) => patch((d) => { d.engine.grounds.condition = v as typeof d.engine.grounds.condition; })}
        />
      </SimpleCheck>
    );
  }
  if (only === "pcv") {
    return (
      <SimpleCheck
        title="PCV hose / vacuum lines"
        guideId="engine.pcv"
        checked={e.pcv.checked}
        notes={e.pcv.notes}
        onChecked={(v) => patch((d) => { d.engine.pcv.checked = v; })}
        onNotes={(v) => patch((d) => { d.engine.pcv.notes = v; })}
      >
        <ChipSelect
          label="Condition"
          value={e.pcv.condition}
          options={[
            { value: "ok", label: "OK" },
            { value: "cracked", label: "Cracked" },
            { value: "oily", label: "Oily" },
          ]}
          onChange={(v) => patch((d) => { d.engine.pcv.condition = v as typeof d.engine.pcv.condition; })}
        />
      </SimpleCheck>
    );
  }
  return (
    <SimpleCheck
      title="Scan tool"
      hint="Write codes before you clear them."
      guideId="engine.scan"
      checked={e.scan.checked}
      notes={e.scan.notes}
      onChecked={(v) => patch((d) => { d.engine.scan.checked = v; })}
      onNotes={(v) => patch((d) => { d.engine.scan.notes = v; })}
    >
      <TextField label="Stored codes" value={e.scan.stored} onChange={(v) => patch((d) => { d.engine.scan.stored = v; })} />
      <TextField label="Pending" value={e.scan.pending} onChange={(v) => patch((d) => { d.engine.scan.pending = v; })} />
      <TextField label="ATF temp" value={e.scan.atfTemp} onChange={(v) => patch((d) => { d.engine.scan.atfTemp = v; })} />
    </SimpleCheck>
  );
}

function BrakeSlice({
  slice,
}: {
  slice: "pads" | "rotors" | "hoses" | "master" | "pedalHeight" | "parking" | "lugTorque" | "bearings" | "alignment";
}) {
  const b = useInspection((s) => s.draft.brakes);
  const patch = useInspection((s) => s.patch);
  const shows = useShows();
  if (slice === "pads") {
    const showPads = shows("pads");
    return (
      <SimpleCheck
        title="Pad thickness"
        hint={showPads ? "Measure remaining friction material, not the steel backing." : "Visual check on an oil-change short visit. Full mm readings unhide at 15k / 30k."}
        guideId="brakes.pads"
        checked={b.pads.checked}
        notes={b.pads.notes}
        onChecked={(v) => patch((d) => { d.brakes.pads.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.pads.notes = v; })}
      >
        {showPads ? (
          <CornerGrid
            keys={CORNERS}
            values={b.pads}
            suffix="mm"
            onChange={(k, v) => patch((d) => { d.brakes.pads[k as Corner] = v; })}
          />
        ) : null}
        <WearVsLast kind="pads" />
        <CornerPhotos prefix="brakes.pads" required />
      </SimpleCheck>
    );
  }
  if (slice === "rotors") {
    return (
      <SimpleCheck
        title="Rotors"
        hint="Thickness / rust lip / pulse on stop"
        guideId="brakes.rotors"
        checked={b.rotors.checked}
        notes={b.rotors.notes}
        onChecked={(v) => patch((d) => { d.brakes.rotors.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.rotors.notes = v; })}
      >
        <TextField label="Front" value={b.rotors.front} onChange={(v) => patch((d) => { d.brakes.rotors.front = v; })} />
        <TextField label="Rear" value={b.rotors.rear} onChange={(v) => patch((d) => { d.brakes.rotors.rear = v; })} />
      </SimpleCheck>
    );
  }
  if (slice === "hoses") {
    return (
      <SimpleCheck
        title="Brake hoses & lines"
        hint="Calipers, hoses, and steel lines. Wet caliper is a fail — open Guide for how to inspect them."
        guideId="brakes.hoses"
        checked={b.hoses.checked}
        notes={b.hoses.notes}
        onChecked={(v) => patch((d) => { d.brakes.hoses.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.hoses.notes = v; })}
      >
        <TextField label="Condition" value={b.hoses.condition} onChange={(v) => patch((d) => { d.brakes.hoses.condition = v; })} />
        <ChipSelect
          label="Wet caliper"
          value={b.hoses.wetCaliper}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.brakes.hoses.wetCaliper = v as typeof d.brakes.hoses.wetCaliper; })}
        />
      </SimpleCheck>
    );
  }
  if (slice === "master") {
    return (
      <SimpleCheck
        title="Master cylinder / booster"
        guideId="brakes.master"
        checked={b.master.checked}
        notes={b.master.notes}
        onChecked={(v) => patch((d) => { d.brakes.master.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.master.notes = v; })}
      >
        <ChipSelect
          label="Seepage"
          value={b.master.seepage}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.brakes.master.seepage = v as typeof d.brakes.master.seepage; })}
        />
        <ChipSelect
          label="Pedal firm"
          value={b.master.pedalFirm}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.brakes.master.pedalFirm = v as typeof d.brakes.master.pedalFirm; })}
        />
      </SimpleCheck>
    );
  }
  if (slice === "pedalHeight") {
    return (
      <SimpleCheck
        title="Pedal height engine running"
        hint="Spec ≥ 3.5 in @ 110 lb"
        guideId="brakes.pedalHeight"
        checked={b.pedalHeight.checked}
        notes={b.pedalHeight.notes}
        onChecked={(v) => patch((d) => { d.brakes.pedalHeight.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.pedalHeight.notes = v; })}
      >
        <TextField label="Measured" value={b.pedalHeight.measured} onChange={(v) => patch((d) => { d.brakes.pedalHeight.measured = v; })} />
      </SimpleCheck>
    );
  }
  if (slice === "parking") {
    return (
      <SimpleCheck
        title="Parking brake"
        hint="Spec 3–4 clicks @ 44 lb"
        guideId="brakes.parking"
        checked={b.parking.checked}
        notes={b.parking.notes}
        onChecked={(v) => patch((d) => { d.brakes.parking.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.parking.notes = v; })}
      >
        <TextField label="Clicks" value={b.parking.clicks} inputMode="numeric" onChange={(v) => patch((d) => { d.brakes.parking.clicks = v; })} />
        <ChipSelect
          label="Holds on grade"
          value={b.parking.holdsGrade}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.brakes.parking.holdsGrade = v as typeof d.brakes.parking.holdsGrade; })}
        />
      </SimpleCheck>
    );
  }
  if (slice === "lugTorque") {
    return (
      <SimpleCheck
        title="Lug torque after rotation"
        hint="98 ft-lb star. Recheck after the road test."
        guideId="brakes.lugTorque"
        checked={b.lugTorque.checked}
        notes={b.lugTorque.notes}
        onChecked={(v) => patch((d) => { d.brakes.lugTorque.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.lugTorque.notes = v; })}
      >
        <ChipSelect
          label="Rechecked after drive"
          value={b.lugTorque.rechecked}
          options={[
            { value: "Y", label: "Y" },
            { value: "N", label: "N" },
          ]}
          onChange={(v) => patch((d) => { d.brakes.lugTorque.rechecked = v as typeof d.brakes.lugTorque.rechecked; })}
        />
      </SimpleCheck>
    );
  }
  if (slice === "bearings") {
    return (
      <SimpleCheck
        title="Wheel bearings / hubs"
        guideId="brakes.bearings"
        checked={b.bearings.checked}
        notes={b.bearings.notes}
        onChecked={(v) => patch((d) => { d.brakes.bearings.checked = v; })}
        onNotes={(v) => patch((d) => { d.brakes.bearings.notes = v; })}
      >
        <CornerGrid keys={CORNERS} values={b.bearings} onChange={(k, v) => patch((d) => { d.brakes.bearings[k as Corner] = v; })} />
      </SimpleCheck>
    );
  }
  return (
    <SimpleCheck
      title="Alignment feel"
      guideId="brakes.alignment"
      checked={b.alignment.checked}
      notes={b.alignment.notes}
      onChecked={(v) => patch((d) => { d.brakes.alignment.checked = v; })}
      onNotes={(v) => patch((d) => { d.brakes.alignment.notes = v; })}
    >
      <ChipSelect
        label="Feel"
        value={b.alignment.feel}
        options={[
          { value: "straight", label: "Straight" },
          { value: "pull-l", label: "Pull L" },
          { value: "pull-r", label: "Pull R" },
          { value: "wander", label: "Wander" },
        ]}
        onChange={(v) => patch((d) => { d.brakes.alignment.feel = v as typeof d.brakes.alignment.feel; })}
      />
    </SimpleCheck>
  );
}
