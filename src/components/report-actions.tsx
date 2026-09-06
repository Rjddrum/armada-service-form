import { useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useInspection } from "@/lib/inspection/store";
import { buildSummary } from "@/lib/inspection/report";
import { rowsForVin } from "@/lib/inspection/maint";
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

export function ReportActions({ compact }: { compact?: boolean }) {
  const draft = useInspection((s) => s.draft);
  const photos = useInspection((s) => s.photos);
  const lastSubmitted = useInspection((s) => s.lastSubmitted);
  const archive = useInspection((s) => s.archive);
  const maint = useInspection((s) => s.maint);
  const settings = useInspection((s) => s.settings);
  const saveToHistory = useInspection((s) => s.saveToHistory);
  const markSubmitted = useInspection((s) => s.markSubmitted);
  const openReport = useInspection((s) => s.openReport);
  const [busy, setBusy] = useState("");
  const [saved, setSaved] = useState(true);
  const cache = useRef<{ blob: Blob; filename: string } | null>(null);
  const history = wearHistory(lastSubmitted, archive);
  const log = rowsForVin(maint, draft.header.vin);
  const summary = useMemo(() => buildSummary(draft, photos, history, log), [draft, photos, history, log]);

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
    <div className="space-y-2">
      {compact ? (
        <button
          type="button"
          onClick={() => openReport()}
          className="tap-44 w-full rounded bg-primary font-semibold text-primary-foreground"
        >
          View report
        </button>
      ) : null}
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
          {busy === "print" ? "Printing…" : "Print"}
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
          {busy === "download" ? "Building…" : "PDF"}
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
          {busy === "share" ? "Sharing…" : "Share"}
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
        className="tap-44 w-full rounded border border-border bg-raised font-medium"
      >
        {busy === "email" ? "Sending…" : "Email report"}
      </button>
    </div>
  );
}
