import { BookOpen, Info, X } from "lucide-react";
import { GuideDiagram } from "@/lib/guide/diagrams";
import { plainFor } from "@/lib/guide/plain";
import { useInspection } from "@/lib/inspection/store";

export function PlainButton({ id, title }: { id: string; title: string }) {
  const openPlain = useInspection((s) => s.openPlain);
  if (!plainFor(id)) return null;
  return (
    <button
      type="button"
      onClick={() => openPlain(id)}
      className="tap-44 inline-flex items-center gap-1 px-1 text-sm font-medium text-primary"
      aria-label={`What does ${title} mean?`}
    >
      <Info className="size-4" />
      What does this mean?
    </button>
  );
}

export function PlainSheet() {
  const id = useInspection((s) => s.plainId);
  const close = useInspection((s) => s.closePlain);
  const jumpToGuide = useInspection((s) => s.jumpToGuide);
  const card = id ? plainFor(id) : undefined;
  if (!id || !card) return null;
  return (
    <div className="overlay-frame z-[55] flex flex-col bg-background">
      <div className="flex items-start justify-between gap-2 px-4 pt-4">
        <div>
          <p className="traveler-stamp text-xs text-primary">What does this mean?</p>
          <h2 className="text-lg font-semibold text-balance text-foreground">Beginner card</h2>
        </div>
        <button type="button" className="tap-44 grid place-items-center" onClick={close} aria-label="Close">
          <X className="size-6" />
        </button>
      </div>
      <div className="app-scroll space-y-4 px-4 pt-3 pb-4">
        <GuideDiagram kind={card.diagram} />
        <p className="text-sm leading-relaxed text-pretty text-foreground">{card.what}</p>
        <p className="text-sm leading-relaxed text-pretty text-foreground">{card.where}</p>
        <div className="hud-card space-y-1">
          <p className="field-label">Why this matters</p>
          <p className="text-sm leading-relaxed text-pretty text-foreground">{card.why}</p>
        </div>
        <p className="text-sm leading-relaxed text-pretty text-foreground">
          <span className="font-medium text-pass">Good: </span>
          {card.good}
        </p>
        <p className="text-sm leading-relaxed text-pretty text-foreground">
          <span className="font-medium text-fail">Bad: </span>
          {card.bad}
        </p>
        <p className="text-sm leading-relaxed text-pretty text-foreground">{card.next}</p>
        <button
          type="button"
          onClick={() => {
            close();
            jumpToGuide(id);
          }}
          className="tap-44 inline-flex w-full items-center justify-center gap-2 rounded bg-primary font-medium text-primary-foreground"
        >
          <BookOpen className="size-4" />
          Open the how-to Guide
        </button>
      </div>
    </div>
  );
}
