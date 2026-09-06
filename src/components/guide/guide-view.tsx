import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { chapterSearchText, findChapter, GUIDE_CHAPTERS, GUIDE_SECTION_ORDER, type GuideChapter } from "@/lib/guide/content";
import { visibleGuideIds } from "@/lib/guide/catalog";
import { GuideDiagram } from "@/lib/guide/diagrams";
import { plainFor } from "@/lib/guide/plain";
import { useInspection } from "@/lib/inspection/store";
import { cn } from "@/lib/utils";

function ChapterArticle({
  ch,
  flash,
  onOpen,
}: {
  ch: GuideChapter;
  flash?: boolean;
  onOpen?: () => void;
}) {
  const plain = plainFor(ch.id);
  return (
    <article
      id={ch.id}
      className={cn(
        "hud-card scroll-mt-44 space-y-3",
        flash ? "border-primary ring-1 ring-primary" : "",
      )}
    >
      {onOpen ? (
        <button type="button" onClick={onOpen} className="block w-full text-left">
          <h2 className="text-lg font-semibold text-balance text-foreground">{ch.title}</h2>
        </button>
      ) : (
        <h2 className="text-lg font-semibold text-balance text-foreground">{ch.title}</h2>
      )}
      {plain ? <GuideDiagram kind={plain.diagram} /> : null}
      <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{plain?.what ?? ch.lede}</p>
      {plain ? (
        <>
          <p className="text-sm leading-relaxed text-pretty text-foreground">{plain.where}</p>
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-foreground">How-to</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-pretty text-foreground">
              {ch.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
          <div className="grid gap-2">
            <GuideBlock heading="Looks good" body={plain.looksGood} tone="pass" />
            <GuideBlock heading="Needs a second look" body={plain.secondLook} />
            <GuideBlock heading="Stop / shop" body={plain.stopShop} tone="fail" />
          </div>
          <GuideBlock heading="Factory spec, in plain language" body={plain.specPlain} />
          <p className="text-xs leading-snug text-muted-foreground">
            <span className="font-medium text-foreground">Tools: </span>
            {plain.tools}
          </p>
          <p className="traveler-stamp text-xs text-primary">Shop spec</p>
        </>
      ) : (
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-foreground">How-to</h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-pretty text-foreground">
            {ch.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}
      <GuideBlock heading="Factory spec" body={ch.factory} />
      <GuideBlock heading="What the factory requires" body={ch.requires} />
      <GuideBlock heading="How to read / measure" body={ch.measure} />
      <GuideBlock heading="Good" body={ch.good} tone="pass" />
      <GuideBlock heading="Needs inspection / replace" body={ch.fail} tone="fail" />
    </article>
  );
}

export function GuideView() {
  const target = useInspection((s) => s.guideTarget);
  const focusId = useInspection((s) => s.guideFocus);
  const clearGuideTarget = useInspection((s) => s.clearGuideTarget);
  const clearGuideFocus = useInspection((s) => s.clearGuideFocus);
  const jumpToGuide = useInspection((s) => s.jumpToGuide);
  const setTab = useInspection((s) => s.setTab);
  const visit = useInspection((s) => s.draft.header.visitType);
  const drive = useInspection((s) => s.draft.header.drive);
  const plan = useInspection((s) => s.draft.header.plan);
  const [q, setQ] = useState("");
  const [flashId, setFlashId] = useState<string | null>(null);

  const allowed = useMemo(() => new Set(visibleGuideIds(visit, drive, plan)), [visit, drive, plan]);
  const visitChapters = useMemo(
    () => GUIDE_CHAPTERS.filter((c) => allowed.has(c.id)),
    [allowed],
  );

  useEffect(() => {
    if (!target) return;
    setQ("");
    const ch = findChapter(target);
    const id = ch?.id ?? target;
    setFlashId(id);
    clearGuideTarget();
    const clear = window.setTimeout(() => setFlashId(null), 2200);
    return () => window.clearTimeout(clear);
  }, [target, clearGuideTarget]);

  const focused = focusId ? findChapter(focusId) : undefined;

  const chapters = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return visitChapters;
    return visitChapters.filter((c) => chapterSearchText(c).includes(needle));
  }, [q, visitChapters]);

  const grouped = useMemo(() => {
    return GUIDE_SECTION_ORDER.map((section) => ({
      section,
      items: chapters.filter((c) => c.section === section),
    })).filter((g) => g.items.length > 0);
  }, [chapters]);

  const siblings = useMemo(() => {
    if (!focused) return [];
    return visitChapters.filter((c) => c.section === focused.section && c.id !== focused.id);
  }, [focused, visitChapters]);

  if (focused && !q.trim()) {
    return (
      <div className="space-y-4 pb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("checklist")}
            className="tap-44 flex flex-1 items-center justify-center gap-1 rounded border border-border bg-raised text-sm font-medium"
          >
            <ArrowLeft className="size-4" />
            Checklist
          </button>
          <button
            type="button"
            onClick={clearGuideFocus}
            className="tap-44 flex flex-1 items-center justify-center rounded border border-border bg-raised text-sm font-medium"
          >
            All how-tos
          </button>
        </div>
        <p className="traveler-stamp px-1 text-xs text-primary">How-to for this check</p>
        <ChapterArticle ch={focused} flash={flashId === focused.id} />
        {siblings.length ? (
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-faint uppercase">
              Other checks in {focused.section}
            </p>
            <div className="flex flex-col gap-1.5">
              {siblings.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => jumpToGuide(s.id)}
                  className="tap-44 rounded border border-border bg-raised px-3 text-left text-sm font-medium text-foreground"
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      {focusId ? (
        <button
          type="button"
          onClick={clearGuideFocus}
          className="tap-44 text-sm font-medium text-muted-foreground"
        >
          Clear search · all how-tos
        </button>
      ) : null}
      <label className="relative block">
        <Search className="pointer-events-none absolute top-3.5 left-3 size-5 text-faint" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search this checklist’s How-To"
          className="field-input pl-11 placeholder:text-faint"
        />
      </label>
      {q.trim() ? null : (
        <div className="chip-row px-0.5">
          {GUIDE_SECTION_ORDER.map((section) => {
            const first = visitChapters.find((c) => c.section === section);
            if (!first) return null;
            return (
              <button
                key={section}
                type="button"
                onClick={() => {
                  const el = document.getElementById(first.id);
                  if (!el) return;
                  const header = document.querySelector("header");
                  const offset = (header?.getBoundingClientRect().height ?? 180) + 20;
                  el.style.scrollMarginTop = `${offset}px`;
                  el.scrollIntoView({ behavior: "auto", block: "start" });
                }}
                className="tap-44 shrink-0 rounded border border-border bg-raised px-3 font-mono text-xs font-medium tracking-wide text-muted-foreground"
              >
                {section}
              </button>
            );
          })}
        </div>
      )}
      {chapters.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing matches that search.</p>
      ) : null}
      {grouped.map((g) => (
        <div key={g.section} className="space-y-3">
          <p className="traveler-stamp px-1 text-xs text-primary">{g.section}</p>
          {g.items.map((ch) => (
            <ChapterArticle key={ch.id} ch={ch} flash={flashId === ch.id} onOpen={() => jumpToGuide(ch.id)} />
          ))}
        </div>
      ))}
    </div>
  );
}

function GuideBlock({
  heading,
  body,
  tone,
}: {
  heading: string;
  body: string;
  tone?: "pass" | "fail";
}) {
  return (
    <div
      className={cn(
        "space-y-1 rounded p-3",
        tone === "pass" && "bg-pass-dim",
        tone === "fail" && "bg-fail-dim",
        !tone && "bg-inset",
      )}
    >
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{heading}</h3>
      <p className="text-sm leading-relaxed text-pretty text-foreground">{body}</p>
    </div>
  );
}
