import { useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useInspection } from "@/lib/inspection/store";
import { isDraftStarted } from "@/lib/inspection/types";
import { buildSummary, dateLabel } from "@/lib/inspection/report";
import { rowsForVin } from "@/lib/inspection/maint";
import {
  ESTIMATE_DISCLAIMER,
  printDealer,
  printRange,
  priorityLabel,
  repairTotals,
} from "@/lib/inspection/repairs";
import { wearHistory } from "@/lib/inspection/wear";
import {
  blobToBase64,
  buildInspectionPdf,
  downloadBlob,
  emailSubject,
  printPdf,
  sharePdf,
} from "@/lib/inspection/pdf";
import { inspectionEmailHtml, sendInspectionEmail } from "@/lib/email";
import { overallLabel } from "@/lib/inspection/types";
import { formatMiles } from "@/lib/utils";
import { TextField } from "@/components/ui/fields";

const EMAIL_COPY: Record<string, string> = {
  sent: "Emailed.",
  skipped: "No To address — add one below.",
  unconfigured: "Resend is not set up. PDF still works on this phone.",
  failed: "Email failed.",
  idle: "",
};

import type { SummaryLine } from "@/lib/inspection/report";

function Lines({ items, thumbs }: { items: SummaryLine[]; thumbs?: boolean }) {
  return (
    <ul className="space-y-3 text-sm leading-relaxed text-foreground">
      {items.map((i) => (
        <li key={i.id} className="space-y-2">
          {thumbs
            ? i.photos.map((p) => (
                <div key={p.slot}>
                  <img src={p.shot.dataUrl} alt={p.shot.caption || i.line} className="max-h-36 w-full rounded border border-border object-cover" />
                  {p.shot.caption ? <p className="mt-1 text-muted-foreground">{p.shot.caption}</p> : null}
                  {i.grokLine ? <p className="mt-1 text-sm text-muted-foreground">{i.grokLine}</p> : null}
                </div>
              ))
            : null}
          <p>• {i.line}</p>
          {i.meaning ? <p className="text-sm leading-relaxed text-muted-foreground">{i.meaning}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export function ReportView() {
  const open = useInspection((s) => s.successOpen);
  const status = useInspection((s) => s.lastEmailStatus);
  const err = useInspection((s) => s.lastEmailError);
  const keepEditing = useInspection((s) => s.keepEditing);
  const goHome = useInspection((s) => s.goHome);
  const startNew = useInspection((s) => s.startNew);
  const saveToHistory = useInspection((s) => s.saveToHistory);
  const markSubmitted = useInspection((s) => s.markSubmitted);
  const draft = useInspection((s) => s.draft);
  const photos = useInspection((s) => s.photos);
  const lastSubmitted = useInspection((s) => s.lastSubmitted);
  const archive = useInspection((s) => s.archive);
  const maint = useInspection((s) => s.maint);
  const settings = useInspection((s) => s.settings);
  const setSettings = useInspection((s) => s.setSettings);
  const [showPassed, setShowPassed] = useState(false);
  const [showNa, setShowNa] = useState(false);
  const [busy, setBusy] = useState("");
  const [saved, setSaved] = useState(true);
  const cache = useRef<{ blob: Blob; filename: string } | null>(null);

  const history = wearHistory(lastSubmitted, archive);
  const log = rowsForVin(maint, draft.header.vin);
  const summary = useMemo(() => buildSummary(draft, photos, history, log), [draft, photos, history, log]);
  const repairTotalsRow = repairTotals(summary.repairs);

  if (!open) return null;

  async function pdf() {
    if (cache.current) return cache.current;
    const built = await buildInspectionPdf(draft, photos, history, log);
    cache.current = built;
    return built;
  }

  async function run(label: string, fn: () => Promise<void>) {
    setBusy(label);
    try {
      await fn();
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="overlay-frame flex flex-col bg-background">
      <div className="app-scroll px-4 pt-4 pb-4">
        <div className="mx-auto w-full max-w-xl space-y-5">
          <div>
            <p className="traveler-stamp text-xs text-primary">VK56DE · RE5R05A</p>
            <h2 className="text-xl font-semibold tracking-tight text-balance">{summary.title}</h2>
          </div>
          <dl className="space-y-1 text-sm text-foreground">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Mileage</dt>
              <dd>{summary.miles || "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Date</dt>
              <dd>{dateLabel(summary.date) || "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Inspector</dt>
              <dd>{summary.inspector || "—"}</dd>
            </div>
            {summary.vin ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">VIN</dt>
                <dd className="font-mono text-xs">{summary.vin}</dd>
              </div>
            ) : null}
            {summary.drive ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Drive</dt>
                <dd>{summary.drive}</dd>
              </div>
            ) : null}
            {summary.tow ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Tow</dt>
                <dd>{summary.tow}</dd>
              </div>
            ) : null}
            {summary.visit ? (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Visit</dt>
                <dd>{summary.visit}</dd>
              </div>
            ) : null}
          </dl>
          {summary.maintRows.length ? (
            <div className="hud-card space-y-2">
              <p className="traveler-stamp text-xs text-primary">Maintenance history</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="py-1 pr-2 font-medium">Service</th>
                      <th className="py-1 pr-2 font-medium">Mileage</th>
                      <th className="py-1 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.maintRows.map((r, i) => (
                      <tr key={i} className="align-top">
                        <td className="py-1 pr-2">
                          {r.photo ? (
                            <img src={r.photo.dataUrl} alt="" className="mb-1 max-h-16 rounded border border-border object-cover" />
                          ) : null}
                          {r.service}
                          <span className="block text-xs text-muted-foreground">{r.age}</span>
                        </td>
                        <td className="py-1 pr-2">{r.miles}</td>
                        <td className="py-1">{r.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs leading-snug text-muted-foreground">{summary.maintDisclaimer}</p>
            </div>
          ) : null}
          {summary.maintFlags.length ? (
            <ul className="space-y-1 text-sm">
              {summary.maintFlags.map((f) => (
                <li key={f.key} className={f.tone === "alert" ? "text-fail" : "text-warn"}>
                  {f.tone === "alert" ? "🔴" : "⚠️"} {f.text}
                </li>
              ))}
            </ul>
          ) : null}
          {summary.planStamp ? (
            <div className="hud-card space-y-2">
              <p className="traveler-stamp text-xs text-primary">{summary.planStamp}</p>
              <ul className="space-y-1 text-sm text-foreground">
                {summary.recLines
                  .filter((l) => l.tone !== "skip")
                  .map((l) => (
                    <li key={l.key}>
                      {l.tone === "due" ? "✅" : "⚠️"} {l.label}
                    </li>
                  ))}
                {summary.recLines
                  .filter((l) => l.tone === "skip")
                  .map((l) => (
                    <li key={l.key} className="text-muted-foreground">
                      Skip / not due: {l.label}
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

          {summary.progressLine ? (
            <p className="text-sm text-muted-foreground">{summary.progressLine}</p>
          ) : null}

          <div className="hud-card space-y-1">
            <p className="traveler-stamp text-xs text-primary">Vehicle condition score</p>
            <p className="reading text-3xl text-primary">
              {summary.score}
              <span className="text-lg text-muted-foreground">/100</span>
            </p>
          </div>

          {summary.missingPhotos.length ? (
            <section className="hud-alert-warn space-y-2">
              <p className="traveler-stamp text-xs text-warn">Missing required photos</p>
              <ul className="space-y-1 text-sm text-foreground">
                {summary.missingPhotos.map((m) => (
                  <li key={m.slot}>• {m.line}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {summary.critical.length ? (
            <section className="space-y-2">
              <h3 className="font-semibold text-fail">🚨 Critical items</h3>
              <Lines items={summary.critical} thumbs />
            </section>
          ) : null}

          {summary.attention.length ? (
            <section className="space-y-2">
              <h3 className="font-semibold text-attention">⚠️ Recommended repairs</h3>
              <Lines items={summary.attention} thumbs />
            </section>
          ) : null}

          {summary.monitor.length ? (
            <section className="space-y-2">
              <h3 className="font-semibold text-warn">👀 Monitor</h3>
              <Lines items={summary.monitor} thumbs />
            </section>
          ) : null}

          {summary.repairs.length ? (
            <section className="space-y-3">
              <h3 className="font-semibold text-foreground">Repair priority and estimated cost</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="py-1 pr-2 font-medium">Item</th>
                      <th className="py-1 pr-2 font-medium">Priority</th>
                      <th className="py-1 pr-2 font-medium">DIY</th>
                      <th className="py-1 pr-2 font-medium">Independent</th>
                      <th className="py-1 font-medium">Dealer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.repairs.map((r) => (
                      <tr key={r.id} className="border-t border-border align-top">
                        <td className="py-2 pr-2">
                          {r.title}
                          {r.note ? <span className="block text-xs text-muted-foreground">{r.note}</span> : null}
                        </td>
                        <td className="py-2 pr-2">{priorityLabel(r.priority)}</td>
                        <td className="py-2 pr-2">{printRange(r.diy)}</td>
                        <td className="py-2 pr-2">{printRange(r.independent)}</td>
                        <td className="py-2">{printDealer(r)}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-border font-medium">
                      <td className="py-2 pr-2" colSpan={2}>
                        Rough total (not a quote)
                      </td>
                      <td className="py-2 pr-2">{printRange(repairTotalsRow.diy)}</td>
                      <td className="py-2 pr-2">{printRange(repairTotalsRow.independent)}</td>
                      <td className="py-2">{printRange(repairTotalsRow.dealer)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">{ESTIMATE_DISCLAIMER}</p>
            </section>
          ) : null}

          <section className="space-y-2">
            <h3 className="font-semibold text-pass">✅ Passed</h3>
            <p className="text-sm text-foreground">{summary.counts.pass} items</p>
            {summary.passed.length ? (
              <button
                type="button"
                className="tap-44 text-sm font-medium text-primary"
                onClick={() => setShowPassed((v) => !v)}
              >
                {showPassed ? "Hide passed items" : "Show passed items"}
              </button>
            ) : null}
            {showPassed ? <Lines items={summary.passed} /> : null}
          </section>

          {summary.na.length ? (
            <section className="space-y-2">
              <button
                type="button"
                className="tap-44 text-sm font-medium text-muted-foreground"
                onClick={() => setShowNa((v) => !v)}
              >
                {showNa ? "Hide not inspected / N/A" : `Not inspected / N/A — ${summary.counts.na} (show)`}
              </button>
              {showNa ? <Lines items={summary.na} /> : null}
            </section>
          ) : null}

          <div className="space-y-2">
            <TextField
              label="To email"
              value={settings.toEmail}
              onChange={(v) => setSettings({ toEmail: v })}
              placeholder="shop@example.com"
            />
            <TextField
              label="CC"
              value={settings.ccEmail}
              onChange={(v) => setSettings({ ccEmail: v })}
            />
            {status !== "idle" || err ? (
              <p className="text-sm text-muted-foreground">
                {EMAIL_COPY[status] ?? ""}
                {status === "failed" && err ? ` ${err}` : ""}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="submit-bar space-y-2 border-t border-border px-4 pt-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={Boolean(busy)}
            onClick={() => {
              saveToHistory();
              setSaved(true);
            }}
            className="tap-44 rounded border border-border bg-inset text-sm font-medium"
          >
            {saved ? (
              <span className="inline-flex items-center gap-1">
                <Check className="size-4 text-pass" /> Saved
              </span>
            ) : (
              "Save report"
            )}
          </button>
          <button
            type="button"
            disabled={Boolean(busy)}
            onClick={() => void run("print", async () => printPdf((await pdf()).blob))}
            className="tap-44 rounded border border-border bg-inset text-sm font-medium"
          >
            {busy === "print" ? "Printing…" : "Print report"}
          </button>
          <button
            type="button"
            disabled={Boolean(busy)}
            onClick={() =>
              void run("download", async () => {
                const p = await pdf();
                downloadBlob(p.blob, p.filename);
              })
            }
            className="tap-44 rounded border border-border bg-inset text-sm font-medium"
          >
            {busy === "download" ? "Building…" : "Download PDF"}
          </button>
          <button
            type="button"
            disabled={Boolean(busy)}
            onClick={() =>
              void run("share", async () => {
                const p = await pdf();
                const ok = await sharePdf(p.blob, p.filename);
                if (!ok) downloadBlob(p.blob, p.filename);
              })
            }
            className="tap-44 rounded border border-border bg-inset text-sm font-medium"
          >
            {busy === "share" ? "Sharing…" : "Share report"}
          </button>
        </div>
        <button
          type="button"
          disabled={Boolean(busy)}
          onClick={() =>
            void run("email", async () => {
              const to = settings.toEmail.trim();
              if (!to) {
                markSubmitted("skipped");
                return;
              }
              try {
                const p = await pdf();
                const res = await sendInspectionEmail({
                  data: {
                    to,
                    cc: settings.ccEmail,
                    subject: emailSubject(draft),
                    html: inspectionEmailHtml({
                      inspector: draft.header.inspector,
                      date: draft.header.date,
                      miles: formatMiles(draft.header.miles),
                      overall: overallLabel(draft.result.overall),
                      summary,
                    }),
                    filename: p.filename,
                    pdfBase64: await blobToBase64(p.blob),
                  },
                });
                markSubmitted(res.status);
              } catch (e) {
                markSubmitted("failed", e instanceof Error ? e.message : "Email failed");
              }
            })
          }
          className="tap-44 w-full rounded bg-primary font-mono text-sm font-semibold tracking-widest uppercase text-primary-foreground"
        >
          {busy === "email" ? "Sending…" : "Email report"}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              keepEditing();
              goHome();
            }}
            className="tap-44 rounded border border-border bg-inset text-sm font-medium"
          >
            Keep editing
          </button>
          <button
            type="button"
            onClick={() => {
              if (isDraftStarted(draft) && !window.confirm("Archive this draft and start a new inspection?")) return;
              startNew();
            }}
            className="tap-44 rounded border border-border bg-inset text-sm font-medium"
          >
            Start new
          </button>
        </div>
      </div>
    </div>
  );
}
