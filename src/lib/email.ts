import { createServerFn } from "@tanstack/react-start";

import type { InspectionSummary } from "./inspection/report";
import { ESTIMATE_DISCLAIMER, printDealer, printRange, priorityLabel, repairTotals } from "./inspection/repairs";

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&" + "amp;")
    .replaceAll("<", "&" + "lt;")
    .replaceAll(">", "&" + "gt;")
    .replaceAll('"', "&" + "quot;");
}

function repairTableHtml(s: InspectionSummary): string {
  if (!s.repairs.length) return "";
  const t = repairTotals(s.repairs);
  const rows = s.repairs
    .map(
      (r) =>
        `<tr><td>${escapeHtml(r.title)}</td><td>${escapeHtml(priorityLabel(r.priority))}</td><td>${escapeHtml(printRange(r.diy))}</td><td>${escapeHtml(printRange(r.independent))}</td><td>${escapeHtml(printDealer(r))}</td></tr>`,
    )
    .join("");
  return `<h3>Repair priority and estimated cost</h3>
<table><thead><tr><th>Item</th><th>Priority</th><th>DIY</th><th>Independent</th><th>Dealer</th></tr></thead>
<tbody>${rows}
<tr><td colspan="2">Rough total (not a quote)</td><td>${escapeHtml(printRange(t.diy))}</td><td>${escapeHtml(printRange(t.independent))}</td><td>${escapeHtml(printRange(t.dealer))}</td></tr>
</tbody></table>
<p>${escapeHtml(ESTIMATE_DISCLAIMER)}</p>`;
}

function list(title: string, items: { line: string; photos?: { shot: { caption?: string } }[] }[]): string {
  if (!items.length) return "";
  return `<h3>${escapeHtml(title)}</h3><ul>${items
    .map((i) => {
      const cap = i.photos?.map((p) => p.shot.caption).filter(Boolean).join("; ");
      const extra = "meaning" in i && i.meaning ? ` ${escapeHtml(i.meaning as string)}` : "";
      return `<li>${escapeHtml(i.line)}${cap ? ` — ${escapeHtml(cap)}` : ""}${extra}</li>`;
    })
    .join("")}</ul>`;
}

export function inspectionEmailHtml(opts: {
  inspector: string;
  date: string;
  miles: string;
  overall: string;
  rangeLines?: string[];
  summary?: InspectionSummary;
}): string {
  if (opts.summary) {
    const s = opts.summary;
    const meta = [
      s.vin ? `VIN: ${escapeHtml(s.vin)}` : "",
      s.drive ? `Drive: ${escapeHtml(s.drive)}` : "",
      s.tow ? escapeHtml(s.tow) : "",
      s.visit ? `Visit: ${escapeHtml(s.visit)}` : "",
    ]
      .filter(Boolean)
      .join("<br/>");
    const rec = s.planStamp
      ? `<p><strong>${escapeHtml(s.planStamp)}</strong></p><ul>${s.recLines
          .map((l) =>
            l.tone === "skip"
              ? `<li>Skip / not due: ${escapeHtml(l.label)}</li>`
              : `<li>${l.tone === "due" ? "✅" : "⚠️"} ${escapeHtml(l.label)}</li>`,
          )
          .join("")}</ul>`
      : "";
    const hist = s.maintRows.length
      ? `<h3>Maintenance history</h3>
<table><thead><tr><th>Service</th><th>Mileage</th><th>Date</th></tr></thead><tbody>${s.maintRows
          .map(
            (r) =>
              `<tr><td>${escapeHtml(r.service)}<br/><span>${escapeHtml(r.age)}</span></td><td>${escapeHtml(r.miles)}</td><td>${escapeHtml(r.date)}</td></tr>`,
          )
          .join("")}</tbody></table>
<p><em>${escapeHtml(s.maintDisclaimer)}</em></p>`
      : "";
    const due = s.maintFlags.length
      ? `<ul>${s.maintFlags
          .map((f) => `<li>${f.tone === "alert" ? "🔴" : "⚠️"} ${escapeHtml(f.text)}</li>`)
          .join("")}</ul>`
      : "";
    return `<h2>${escapeHtml(s.title)}</h2>
<p>Mileage: ${escapeHtml(s.miles)}<br/>
Date: ${escapeHtml(s.date)}<br/>
Inspector: ${escapeHtml(s.inspector)}${meta ? `<br/>${meta}` : ""}</p>
${hist}
${due}
${rec}
${s.progressLine ? `<p>${escapeHtml(s.progressLine)}</p>` : ""}
<p><strong>Vehicle condition score: ${s.score}/100</strong></p>
${s.missingPhotos.length ? list("Missing required photos", s.missingPhotos) : ""}
${list("Critical items", s.critical)}
${list("Recommended repairs", s.attention)}
${list("Monitor", s.monitor)}
${repairTableHtml(s)}
<p><strong>Passed:</strong> ${s.counts.pass} items</p>
<p>Full checklist and marked photos are in the attached PDF (summary on page 1).</p>`;
  }
  const range =
    opts.rangeLines && opts.rangeLines.length
      ? `<p><strong>Out of range — review or technician follow-up</strong></p>
<ul>${opts.rangeLines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>`
      : "";
  return `<p>2005 Armada inspection attached.</p>
<p>Inspector: ${escapeHtml(opts.inspector)}<br/>
Date: ${escapeHtml(opts.date)}<br/>
Miles: ${escapeHtml(opts.miles)}<br/>
Result: ${escapeHtml(opts.overall)}</p>
${range}`;
}

export type EmailPayload = {
  to: string;
  cc?: string;
  subject: string;
  html: string;
  filename: string;
  pdfBase64: string;
};

export const sendInspectionEmail = createServerFn({ method: "POST" })
  .validator((d: EmailPayload) => d)
  .handler(async ({ data }) => {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      return { status: "unconfigured" as const };
    }
    const from = process.env.RESEND_FROM || "Armada Inspection <onboarding@resend.dev>";
    const to = data.to.trim();
    if (!to) return { status: "skipped" as const };
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        cc: data.cc?.trim() ? [data.cc.trim()] : undefined,
        subject: data.subject,
        html: data.html,
        attachments: [
          {
            filename: data.filename,
            content: data.pdfBase64,
          },
        ],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text.slice(0, 200) || `Resend ${res.status}`);
    }
    return { status: "sent" as const };
  });

