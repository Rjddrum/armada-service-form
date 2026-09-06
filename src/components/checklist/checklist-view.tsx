import { type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import {
  BrakeItems,
  CabinItems,
  EngineItems,
  FluidsRest,
  OilLevelItem,
  ResultItem,
  RoadItems,
  SteeringItems,
  TransTable,
  UnderbodyItems,
  BaselineItems,
} from "@/components/checklist/items";
import { HeaderFields } from "@/components/checklist/header-fields";
import { WalkView } from "@/components/checklist/walk-view";
import { ConditionBanner } from "@/components/checklist/condition-banner";
import { useInspection } from "@/lib/inspection/store";
import { missingRequiredPhotos } from "@/lib/inspection/photo-slots";
import { SECTION_DEFS, rowShows, type SectionId } from "@/lib/inspection/types";
import { RecCard } from "@/components/checklist/rec-card";
import { MaintLog } from "@/components/checklist/maint-log";
import { oilChangeMode } from "@/lib/inspection/plan";
import { cn } from "@/lib/utils";

function Section({ id, children }: { id: SectionId; children: ReactNode }) {
  const open = useInspection((s) => s.openSections.includes(id));
  const toggle = useInspection((s) => s.toggleSection);
  const def = SECTION_DEFS.find((s) => s.id === id)!;
  return (
    <section className="border-b border-border">
      <button
        type="button"
        onClick={() => toggle(id)}
        className={cn(
          "flex min-h-14 w-full items-center justify-between gap-3 border-l-2 px-2 py-3 text-left",
          open ? "border-l-primary" : "border-l-transparent",
        )}
        aria-expanded={open}
      >
        <span className="font-mono text-sm font-semibold tracking-wide text-foreground">{def.label}</span>
        <ChevronDown className={cn("size-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open ? <div className="space-y-3 pb-4">{children}</div> : null}
    </section>
  );
}

function FullChecklist() {
  const visit = useInspection((s) => s.draft.header.visitType);
  const drive = useInspection((s) => s.draft.header.drive);
  const plan = useInspection((s) => s.draft.header.plan);
  const shows = (id: string) => rowShows(id, visit, drive, plan);
  const steering = shows("steering.ballJoints") || shows("steering.tieRods") || shows("steering.steeringPlay");
  return (
    <div>
      <Section id="fluids">
        {shows("oilLevel") ? <OilLevelItem /> : null}
        <FluidsRest />
      </Section>
      <Section id="engine">
        <EngineItems />
      </Section>
      {shows("transTable") || shows("atfReject") ? (
        <Section id="trans">
          <TransTable />
        </Section>
      ) : null}
      <Section id="brakes">
        <BrakeItems />
      </Section>
      {steering ? (
        <Section id="steering">
          <SteeringItems />
        </Section>
      ) : null}
      <Section id="underbody">
        <UnderbodyItems />
      </Section>
      <Section id="cabin">
        <CabinItems />
      </Section>
      <Section id="road">
        <RoadItems />
      </Section>
      {shows("baseline") ? (
        <Section id="baseline">
          <BaselineItems />
        </Section>
      ) : null}
      <Section id="result">
        <ResultItem />
      </Section>
    </div>
  );
}

export function ChecklistView() {
  const mode = useInspection((s) => s.checklistMode);
  const setMode = useInspection((s) => s.setChecklistMode);
  const expandAll = useInspection((s) => s.expandAll);
  const collapseAll = useInspection((s) => s.collapseAll);
  const visit = useInspection((s) => s.draft.header.visitType);
  const short = useInspection((s) => oilChangeMode(s.draft));
  const photoHighlight = useInspection((s) => s.photoHighlight);
  const draft = useInspection((s) => s.draft);
  const photos = useInspection((s) => s.photos);
  const missing = missingRequiredPhotos(draft, photos);
  const highlight = useInspection((s) => s.headerHighlight);
  const started = Boolean(visit);

  if (started && mode === "walk") {
    return <WalkView />;
  }

  return (
    <div className="space-y-4">
      <Section id="header">
        <HeaderFields highlight={highlight} />
      </Section>
      <MaintLog />
      <RecCard />
      <ConditionBanner />
      {started && missing.length ? (
        <div className="hud-alert-warn space-y-2">
          <p className="traveler-stamp text-xs text-warn">
            {photoHighlight ? "Missing required photos — submit is blocked" : "Photos required"}
          </p>
          <ul className="space-y-1 text-sm text-foreground">
            {missing.map((m) => (
              <li key={m.slot}>• {m.line}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {started && short ? (
        <p className="traveler-stamp px-1 text-xs text-primary">
          Oil-change short check · 15k / 30k / Baseline unhide the rest
        </p>
      ) : null}
      {started ? (
        <div className="hud-seg">
          <button
            type="button"
            onClick={() => {
              collapseAll();
              setMode("walk");
            }}
            data-on="false"
            className="hud-seg-btn"
          >
            Walk the truck
          </button>
          <button
            type="button"
            onClick={() => setMode("full")}
            data-on="true"
            className="hud-seg-btn"
          >
            Full checklist
          </button>
        </div>
      ) : null}
      {started ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="tap-56 flex-1 rounded border border-border bg-inset font-mono text-xs font-medium tracking-wider uppercase text-foreground"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="tap-56 flex-1 rounded border border-border bg-inset font-mono text-xs font-medium tracking-wider uppercase text-foreground"
          >
            Collapse all
          </button>
        </div>
      ) : null}
      {started ? <FullChecklist /> : null}
    </div>
  );
}
