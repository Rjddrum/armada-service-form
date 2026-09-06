import { jsPDF } from "jspdf";
import { formatMiles, formatStamp } from "@/lib/utils";
import { oilChangeMode } from "./plan.ts";
import {
  CABIN_ITEMS,
  CORNERS,
  CORNERS_SPARE,
  ROAD_ITEMS,
  STEERING_ITEMS,
  TRANS_ROWS,
  UNDERBODY_ITEMS,
  driveShows,
  drivelineShaftLabel,
  overallLabel,
  smodPlanRecord,
  oilChangeRecord,
  rowShows,
  visitShows,
  type InspectionDraft,
} from "./types";
import { recallStamp } from "./recalls";
import type { PhotoShot } from "./photos";
import type { MaintRow } from "./maint";
import { priorWearVisit, wearCompare, wearLine, wearStamp } from "./wear";
import { PARTS_STRIP } from "./parts";
import { REPORT_TITLE, buildSummary } from "./report";
import { photosForItem, photoSlotDef, shotOk } from "./photo-slots";
import { grokReportLine } from "./grok-scan";
import {
  ESTIMATE_DISCLAIMER,
  printDealer,
  printRange,
  repairTotals,
  type RepairRow,
} from "./repairs";

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 36;
const RIGHT = PAGE_W - MARGIN;
const WIDTH = RIGHT - MARGIN;
const STRIP_H = 62;
const STRIP_TOP = PAGE_H - STRIP_H - 14;
const FOOTER_Y = STRIP_TOP;
const BOX = 9;

function ascii(s: string): string {
  return s
    .replaceAll("→", "->")
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replaceAll("•", "-")
    .replaceAll("½", " 1/2")
    .replaceAll("¼", " 1/4")
    .replaceAll("¾", " 3/4")
    .replaceAll("°", " deg")
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"');
}

function yn(v: string): string {
  if (v === "Y") return "Y";
  if (v === "N") return "N";
  return "";
}
function dash(v: string | undefined | null): string {
  const t = (v ?? "").trim();
  return t ? ascii(t) : "";
}

class Writer {
  doc: jsPDF;
  y = MARGIN;
  page = 1;
  photos: Record<string, PhotoShot>;
  grok: Record<string, string>;
  constructor(photos: Record<string, PhotoShot>, grok: Record<string, string> = {}) {
    this.doc = new jsPDF({ unit: "pt", format: "letter" });
    this.photos = photos;
    this.grok = grok;
  }
  footer() {
    this.doc.setDrawColor(120);
    this.doc.setLineWidth(0.5);
    this.doc.rect(MARGIN, STRIP_TOP, WIDTH, STRIP_H);
    this.doc.setTextColor(50);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(7);
    this.doc.text(ascii(PARTS_STRIP.title), MARGIN + 6, STRIP_TOP + 11);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(7);
    let y = STRIP_TOP + 22;
    for (const line of PARTS_STRIP.lines) {
      this.doc.text(ascii(line), MARGIN + 6, y);
      y += 10;
    }
    this.doc.setFontSize(8);
    this.doc.setTextColor(90);
    this.doc.text(String(this.page), RIGHT, PAGE_H - 8, { align: "right" });
    this.doc.setTextColor(0);
  }
  newPage() {
    this.footer();
    this.doc.addPage();
    this.page += 1;
    this.y = MARGIN;
  }
  ensure(h: number) {
    if (this.y + h > FOOTER_Y - 8) this.newPage();
  }
  heading(t: string) {
    this.ensure(22);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.doc.text(ascii(t), MARGIN, this.y);
    this.y += 16;
  }
  kv(k: string, v: string) {
    this.ensure(14);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9);
    this.doc.text(ascii(k), MARGIN, this.y);
    this.doc.text(dash(v) || "—", RIGHT, this.y, { align: "right" });
    this.y += 13;
  }
  note(t: string) {
    const s = dash(t);
    if (!s) return;
    this.ensure(24);
    this.doc.setFont("helvetica", "italic");
    this.doc.setFontSize(8);
    const lines = this.doc.splitTextToSize(s, WIDTH);
    this.doc.text(lines, MARGIN, this.y);
    this.y += lines.length * 11 + 4;
  }
  drawPhoto(shot?: PhotoShot, grokLine = "") {
    if (!shot?.dataUrl) return;
    const maxW = 220;
    const maxH = 120;
    const scale = Math.min(maxW / Math.max(shot.w, 1), maxH / Math.max(shot.h, 1), 1);
    const w = Math.max(40, shot.w * scale);
    const h = Math.max(30, shot.h * scale);
    const extra = grokLine || "";
    this.ensure(h + (shot.caption || extra ? 32 : 10));
    try {
      this.doc.addImage(shot.dataUrl, "JPEG", MARGIN, this.y, w, h);
      this.y += h + 6;
    } catch {
      /* skip bad jpeg */
    }
    if (shot.caption) {
      this.doc.setFont("helvetica", "italic");
      this.doc.setFontSize(8);
      const lines = this.doc.splitTextToSize(ascii(shot.caption), WIDTH);
      this.doc.text(lines, MARGIN, this.y);
      this.y += lines.length * 11 + 4;
    }
    if (extra) {
      this.doc.setFont("helvetica", "italic");
      this.doc.setFontSize(8);
      const lines = this.doc.splitTextToSize(ascii(extra), WIDTH);
      this.doc.text(lines, MARGIN, this.y);
      this.y += lines.length * 11 + 4;
    }
  }
  row(label: string, checked: boolean, extras: [string, string][], notes: string, photoSlot?: string) {
    this.ensure(22);
    this.doc.setDrawColor(40);
    this.doc.rect(MARGIN, this.y - 8, BOX, BOX);
    if (checked) {
      this.doc.setFont("helvetica", "bold");
      this.doc.setFontSize(10);
      this.doc.text("X", MARGIN + 1.5, this.y);
    }
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9);
    this.doc.text(ascii(label), MARGIN + BOX + 6, this.y);
    this.y += 14;
    for (const [k, v] of extras) {
      if (!dash(v)) continue;
      this.kv(k, v);
    }
    this.note(notes);
    const drawn = new Set<string>();
    const drawSlot = (slot?: string) => {
      if (!slot || drawn.has(slot) || !shotOk(this.photos[slot])) return;
      drawn.add(slot);
      this.drawPhoto(this.photos[slot], this.grok[slot] || "");
    };
    drawSlot(photoSlot);
    const def = photoSlot ? photoSlotDef(photoSlot) : undefined;
    if (def) {
      for (const p of photosForItem(def.itemId, this.photos)) drawSlot(p.slot);
    }
  }
  bullet(text: string) {
    this.ensure(16);
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(9);
    const lines = this.doc.splitTextToSize("- " + ascii(text), WIDTH);
    this.doc.text(lines, MARGIN, this.y);
    this.y += lines.length * 12 + 2;
  }
  meaning(text?: string) {
    if (!text) return;
    this.ensure(20);
    this.doc.setFont("helvetica", "italic");
    this.doc.setFontSize(8);
    const lines = this.doc.splitTextToSize(ascii(text), WIDTH);
    this.doc.text(lines, MARGIN + 8, this.y);
    this.y += lines.length * 11 + 4;
  }
  repairTable(rows: RepairRow[]) {
    if (!rows.length) return;
    this.heading("Repair priority and estimated cost");
    const cols = [MARGIN, MARGIN + 148, MARGIN + 222, MARGIN + 318, MARGIN + 430];
    const widths = [144, 70, 92, 108, 110];
    const header = ["Item", "Priority", "DIY", "Independent", "Dealer"];
    this.ensure(18);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8);
    header.forEach((h, i) => this.doc.text(h, cols[i]!, this.y));
    this.y += 12;
    this.doc.setDrawColor(160);
    this.doc.setLineWidth(0.4);
    this.doc.line(MARGIN, this.y - 8, RIGHT, this.y - 8);
    for (const r of rows) {
      const pri = r.priority === "immediate" ? "Immediate" : r.priority === "soon" ? "Soon" : "Monitor";
      const cells = [ascii(r.title), pri, ascii(printRange(r.diy)), ascii(printRange(r.independent)), ascii(printDealer(r))];
      const wrapped = cells.map((c, i) => this.doc.splitTextToSize(c, widths[i]! - 4));
      const lines = Math.max(...wrapped.map((w) => w.length), 1);
      this.ensure(lines * 11 + 8);
      this.doc.setFont("helvetica", "normal");
      this.doc.setFontSize(8);
      wrapped.forEach((w, i) => this.doc.text(w, cols[i]!, this.y));
      this.y += lines * 11 + 4;
      if (r.note) {
        this.doc.setFont("helvetica", "italic");
        const note = this.doc.splitTextToSize(ascii(r.note), WIDTH);
        this.doc.text(note, MARGIN, this.y);
        this.y += note.length * 10 + 2;
      }
    }
    const totals = repairTotals(rows);
    this.ensure(22);
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(8);
    this.doc.text("Rough total (not a quote)", cols[0]!, this.y);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(ascii(printRange(totals.diy)), cols[2]!, this.y);
    this.doc.text(ascii(printRange(totals.independent)), cols[3]!, this.y);
    this.doc.text(ascii(printRange(totals.dealer)), cols[4]!, this.y);
    this.y += 14;
    this.doc.setFont("helvetica", "italic");
    this.doc.setFontSize(8);
    this.doc.text(ESTIMATE_DISCLAIMER, MARGIN, this.y);
    this.y += 16;
  }
}

export async function buildInspectionPdf(
  draft: InspectionDraft,
  photos: Record<string, PhotoShot>,
  history: InspectionDraft[] = [],
  log: MaintRow[] = [],
) {
  const grok: Record<string, string> = {};
  for (const [id, g] of Object.entries(draft.grokScan ?? {})) {
    const line = grokReportLine(g);
    if (!line) continue;
    grok[id] = line;
    if (g.slot) grok[g.slot] = line;
  }
  const w = new Writer(photos, grok);
  const h = draft.header;
  const summary = buildSummary(draft, photos, history, log);

  w.doc.setFont("helvetica", "bold");
  w.doc.setFontSize(16);
  w.doc.text(ascii(REPORT_TITLE), MARGIN, w.y);
  w.y += 20;
  w.kv("Mileage", summary.miles);
  w.kv("Date", summary.date);
  w.kv("Inspector", summary.inspector);
  if (summary.vin) w.kv("VIN", summary.vin);
  if (summary.drive) w.kv("Drive", summary.drive);
  if (summary.tow) w.kv("Tow pkg", summary.tow);
  w.kv("Visit type", summary.visit);
  if (summary.maintRows.length) {
    w.heading("Maintenance history");
    for (const r of summary.maintRows) {
      if (r.photo) w.drawPhoto(r.photo);
      w.bullet(`${r.service} — ${r.miles} — ${r.date} (${r.age})`);
    }
    w.doc.setFont("helvetica", "italic");
    w.doc.setFontSize(8);
    w.doc.text(ascii(summary.maintDisclaimer), MARGIN, w.y);
    w.y += 14;
  }
  if (summary.maintFlags.length) {
    w.heading("Due / overdue");
    for (const f of summary.maintFlags) w.bullet((f.tone === "alert" ? "[SMOD] " : "[due] ") + f.text);
    w.y += 4;
  }
  if (summary.planStamp) {
    w.heading(summary.planStamp);
    for (const l of summary.recLines) {
      if (l.tone === "skip") w.bullet("Skip / not due: " + l.label);
      else w.bullet((l.tone === "due" ? "[due] " : "[watch] ") + l.label);
    }
    w.y += 4;
  }
  w.drawPhoto(photos["header.vin"]);
  w.y += 6;
  if (summary.progressLine) {
    w.doc.setFont("helvetica", "normal");
    w.doc.setFontSize(10);
    w.doc.text(ascii(summary.progressLine), MARGIN, w.y);
    w.y += 14;
  }
  w.heading("Vehicle condition score: " + summary.score + "/100");

  if (summary.missingPhotos.length) {
    w.heading("Missing required photos");
    for (const m of summary.missingPhotos) w.bullet(m.line);
    w.y += 4;
  }

  if (summary.critical.length) {
    w.heading("Critical items");
    for (const f of summary.critical) {
      for (const p of f.photos) w.drawPhoto(p.shot, f.grokLine || grok[p.slot] || grok[f.id] || "");
      w.bullet(f.line);
      w.meaning(f.meaning);
    }
    w.y += 4;
  }
  if (summary.attention.length) {
    w.heading("Recommended repairs");
    for (const f of summary.attention) {
      for (const p of f.photos) w.drawPhoto(p.shot, f.grokLine || grok[p.slot] || grok[f.id] || "");
      w.bullet(f.line);
      w.meaning(f.meaning);
    }
    w.y += 4;
  }
  if (summary.monitor.length) {
    w.heading("Monitor");
    for (const f of summary.monitor) {
      for (const p of f.photos) w.drawPhoto(p.shot, f.grokLine || grok[p.slot] || grok[f.id] || "");
      w.bullet(f.line);
      w.meaning(f.meaning);
    }
    w.y += 4;
  }
  w.repairTable(summary.repairs);
  w.heading("Passed");
  w.doc.setFont("helvetica", "normal");
  w.doc.setFontSize(9);
  w.doc.text(`${summary.counts.pass} items`, MARGIN, w.y);
  w.y += 16;

  w.newPage();
  w.doc.setFont("helvetica", "bold");
  w.doc.setFontSize(14);
  w.doc.text("Full checklist", MARGIN, w.y);
  w.y += 18;
  w.heading("1. Fluids");
  const f = draft.fluids;
  if (oilChangeMode(draft)) {
    w.row(
      "Oil change performed",
      f.oilLevel.checked,
      [
        ["Type", draft.result.oilType],
        ["Amount", draft.result.oilAmount],
        ["Filter PN", draft.result.oilFilterPn],
        ["Crush washer", yn(draft.result.crushWasher)],
      ],
      oilChangeRecord(draft),
    );
  } else {
    w.row("Engine oil level & condition", f.oilLevel.checked, [["Color / level", f.oilLevel.colorLevel], ["qt added", f.oilLevel.qtAdded]], f.oilLevel.notes);
  }
  w.row("Engine oil leak check", f.oilLeak.checked, [], f.oilLeak.notes, "fluids.oilLeak");
  w.row("Coolant reservoir", f.coolant.checked, [["Level & color", f.coolant.levelColor], ["Freeze point", f.coolant.freezeF], ["Cap seated", yn(f.coolant.capSeated)]], f.coolant.notes, "fluids.coolant");
  w.row("ATF — dipstick HOT", f.atf.checked, [["In range", yn(f.atf.inRange)], ["Color", f.atf.color], ["Smell", f.atf.smell]], f.atf.notes, "fluids.atf");
  w.row("Power steering fluid", f.psf.checked, [["Level", f.psf.level], ["Color", f.psf.color]], f.psf.notes, "fluids.psf");
  w.row("Brake fluid", f.brake.checked, [["Level", f.brake.level], ["Color", f.brake.color], ["Moisture", f.brake.moisture], ["Cap sealed", yn(f.brake.capSealed)]], f.brake.notes, "fluids.brake");
  w.row("Washer fluid", f.washer.checked, [], f.washer.notes, "fluids.washer");
  if (visitShows(h.visitType, "15k") && driveShows(h.drive, "4WD")) {
    w.row("Transfer case seep (4WD)", f.transferSeep.checked, [["Wetness", yn(f.transferSeep.wetness)]], f.transferSeep.notes, "fluids.transferSeep");
    w.row("Front differential seep (4WD)", f.frontDiffSeep.checked, [["Seep", yn(f.frontDiffSeep.seep)]], f.frontDiffSeep.notes, "fluids.frontDiffSeep");
  }
  if (visitShows(h.visitType, "15k")) {
    w.row("Rear differential seep", f.rearDiffSeep.checked, [["Seep", yn(f.rearDiffSeep.seep)], ["Pinion", yn(f.rearDiffSeep.pinion)]], f.rearDiffSeep.notes, "fluids.rearDiffSeep");
  }
  w.note(f.notes);

  w.newPage();
  w.heading("2. Engine bay");
  const e = draft.engine;
  w.drawPhoto(photos["engine.overview"]);
  w.row("Cold-start noise — timing cover", e.timingCover.checked, [["Noise", e.timingCover.noise], ["Seconds", e.timingCover.seconds], ["Oil pressure", e.timingCover.oilPressure]], e.timingCover.notes, "engine.timingCover");
  w.row("Exhaust manifolds", e.manifolds.checked, [["Noise", e.manifolds.noise], ["Soot", yn(e.manifolds.soot)]], e.manifolds.notes, "engine.manifolds");
  w.row("Idle quality", e.idle.checked, [["Quality", e.idle.quality], ["CEL", e.idle.cel]], e.idle.notes);
  w.row("Serpentine belt", e.belt.checked, [["Condition", e.belt.condition], ["Tensioner play", yn(e.belt.tensionerPlay)]], e.belt.notes, "engine.belt");
  w.row("Radiator tanks / hoses", e.radiator.checked, [["Seeping", yn(e.radiator.seeping)]], e.radiator.notes, "engine.radiator");
  w.row("ATF cooler lines at radiator", e.atfLines.checked, [["Connected", yn(e.atfLines.connected)], ["Wet fittings", yn(e.atfLines.wetFittings)], ["Bypass done", yn(e.atfLines.bypassDone)]], e.atfLines.notes, "engine.atfLines");
  w.row("Air filter", e.airFilter.checked, [["Condition", e.airFilter.condition], ["Cabin due", yn(e.airFilter.cabinDue)]], e.airFilter.notes, "engine.airFilter");
  w.row("Battery", e.battery.checked, [["Rest V", e.battery.restV], ["Running V", e.battery.runningV], ["Terminals", yn(e.battery.terminalsClean)], ["Load", e.battery.loadTest]], e.battery.notes, "engine.battery");
  w.row("Ground straps", e.grounds.checked, [["Condition", e.grounds.condition]], e.grounds.notes, "engine.grounds");
  w.row("PCV hose / vacuum lines", e.pcv.checked, [["Condition", e.pcv.condition]], e.pcv.notes, "engine.pcv");
  if (rowShows("scan", h.visitType, h.drive, h.plan)) {
    w.row("Scan tool", e.scan.checked, [["Stored", e.scan.stored], ["Pending", e.scan.pending], ["ATF temp", e.scan.atfTemp]], e.scan.notes);
  }
  w.note(e.notes);

  w.newPage();
  w.heading("3. Transmission road check");
  if (rowShows("transTable", h.visitType, h.drive, h.plan)) {
    for (const row of TRANS_ROWS) {
      if (row.key === "fourwd" && !driveShows(h.drive, "4WD")) continue;
      const v = draft.trans.rows[row.key];
      w.row(row.label, Boolean(v.cold || v.hot), [["Cold", v.cold], ["Hot", v.hot]], v.notes);
    }
  } else {
    w.note("Short loop — full cold/hot shift table is 15k / 30k.");
  }
  w.row("ATF reject condition", draft.trans.atfReject, [], draft.trans.notes);

  w.newPage();
  w.heading("4. Brakes & rolling gear");
  const b = draft.brakes;
  w.row("Pad thickness", b.pads.checked, CORNERS.map((c) => [c.label + " mm", dash(b.pads[c.key])] as [string, string]), b.pads.notes);
  for (const c of CORNERS) w.drawPhoto(photos[`brakes.pads.${c.key}`]);
  const prior = priorWearVisit(draft, history);
  if (prior) {
    const cmp = wearCompare(draft, prior);
    w.note(wearStamp(cmp));
    for (const c of cmp.pads) {
      if (c.last == null && c.now == null) continue;
      w.note(wearLine(c, " mm", cmp.milesBetween));
    }
  }
  if (rowShows("rotors", h.visitType, h.drive, h.plan)) {
    w.row("Rotors", b.rotors.checked, [["Front", b.rotors.front], ["Rear", b.rotors.rear]], b.rotors.notes, "brakes.rotors");
    w.row("Brake hoses & lines", b.hoses.checked, [["Condition", b.hoses.condition], ["Wet caliper", yn(b.hoses.wetCaliper)]], b.hoses.notes, "brakes.hoses");
    w.row("Master cylinder / booster", b.master.checked, [["Seepage", yn(b.master.seepage)], ["Pedal firm", yn(b.master.pedalFirm)]], b.master.notes, "brakes.master");
    w.row("Pedal height", b.pedalHeight.checked, [["Measured", b.pedalHeight.measured]], b.pedalHeight.notes);
    w.row("Parking brake", b.parking.checked, [["Clicks", b.parking.clicks], ["Holds grade", yn(b.parking.holdsGrade)]], b.parking.notes);
  }
  w.row("ABS / SLIP / VDC lamps", b.absLamps.checked, [["State", b.absLamps.state]], b.absLamps.notes, "cabin.dash");
  w.row("Tires tread", b.tread.checked, CORNERS_SPARE.map((c) => [c.label, dash(b.tread[c.key])] as [string, string]), b.tread.notes);
  for (const c of CORNERS) w.drawPhoto(photos[`brakes.tread.${c.key}`]);
  if (prior) {
    const cmp = wearCompare(draft, prior);
    w.note(wearStamp(cmp));
    for (const c of cmp.tread) {
      if (c.last == null && c.now == null) continue;
      w.note(wearLine(c, "/32", cmp.milesBetween));
    }
  }
  w.row("Tire age", b.tireAge.checked, CORNERS_SPARE.map((c) => [c.label, dash(b.tireAge[c.key])] as [string, string]), b.tireAge.notes, "brakes.tireAge");
  w.row("Wear pattern", b.wear.checked, [["Pattern", b.wear.pattern]], b.wear.notes, "brakes.wear");
  w.row("Pressures", b.pressures.checked, CORNERS_SPARE.map((c) => [c.label, dash(b.pressures[c.key])] as [string, string]), b.pressures.notes);
  if (rowShows("lugTorque", h.visitType, h.drive, h.plan)) {
    w.row("Lug torque", b.lugTorque.checked, [["Rechecked", yn(b.lugTorque.rechecked)]], b.lugTorque.notes);
    w.row("Wheel bearings", b.bearings.checked, CORNERS.map((c) => [c.label, dash(b.bearings[c.key])] as [string, string]), b.bearings.notes);
    w.row("Alignment feel", b.alignment.checked, [["Feel", b.alignment.feel]], b.alignment.notes);
  }
  w.note(b.notes);

  const steeringRows = STEERING_ITEMS.filter((it) => rowShows(`steering.${it.key}`, h.visitType, h.drive, h.plan));
  if (steeringRows.length) {
    w.newPage();
    w.heading("5. Steering / driveline");
    for (const it of steeringRows) {
      const row = draft.steering.items[it.key];
      const label = it.key === "shafts" ? drivelineShaftLabel(h.drive) : it.label;
      w.row(label, row.checked, [], row.notes, "photo" in it && it.photo ? `steering.${it.key}` : undefined);
    }
    w.note(draft.steering.notes);
  }

  w.newPage();
  w.heading("6. Underbody");
  for (const it of UNDERBODY_ITEMS) {
    if (!rowShows(`underbody.${it.key}`, h.visitType, h.drive, h.plan)) continue;
    const row = draft.underbody.items[it.key];
    w.row(it.label, row.checked, [], row.notes, it.photo ? `underbody.${it.key}` : undefined);
  }
  w.note(draft.underbody.notes);

  w.newPage();
  w.heading("7. Cabin & safety");
  for (const it of CABIN_ITEMS) {
    if (!rowShows(`cabin.${it.key}`, h.visitType, h.drive, h.plan)) continue;
    const row = draft.cabin.items[it.key];
    const extras: [string, string][] = it.key === "airbag" && draft.cabin.airbagLamp
      ? [["Lamp", draft.cabin.airbagLamp]]
      : [];
    w.row(it.label, row.checked, extras, row.notes, "photo" in it && it.photo ? `cabin.${it.key}` : undefined);
  }
  if (rowShows("cabin.recalls", h.visitType, h.drive, h.plan)) {
    const rec = draft.cabin.recalls;
    const extras: [string, string][] = [];
    if (rec.checkedAt) extras.push(["Stamp", recallStamp(rec)]);
    for (const c of rec.campaigns) extras.push([c.id, c.component]);
    w.row("Nissan campaigns", rec.checked, extras, rec.notes);
  }
  w.note(draft.cabin.notes);

  w.newPage();
  w.heading("8. Final road test");
  for (const it of ROAD_ITEMS) {
    if (!rowShows(`road.${it.key}`, h.visitType, h.drive, h.plan)) continue;
    const row = draft.road.items[it.key];
    w.row(it.label, row.checked, it.key === "overheat" ? [["Gauge stable", yn(draft.road.gaugeStable)]] : [], row.notes);
  }
  w.note(draft.road.notes);

  if (rowShows("baseline", h.visitType, h.drive, h.plan)) {
    const pf = (v: string) => (v === "pass" ? "Pass" : v === "fail" ? "Fail" : "—");
    const b = draft.baseline;
    w.newPage();
    w.heading("270k due — Pass/Fail");
    w.row(
      "Spark plugs (105k iridium)",
      b.sparkPlugs.checked,
      [
        ["Last miles", b.sparkPlugs.lastMiles],
        ["Cycle", b.sparkPlugs.cycle],
        ["Grade", pf(b.sparkPlugs.verdict)],
      ],
      b.sparkPlugs.notes,
    );
    w.row(
      "Coolant service + cap + thermostat + weep",
      b.coolantService.checked,
      [
        ["Last service", b.coolantService.lastService],
        ["Cap", pf(b.coolantService.cap)],
        ["Thermostat", pf(b.coolantService.thermostat)],
        ["Pump weep", yn(b.coolantService.pumpWeep)],
        ["Grade", pf(b.coolantService.verdict)],
      ],
      b.coolantService.notes,
      "baseline.coolantService",
    );
    w.row(
      "Brake fluid (DOT 3)",
      b.brakeFluid.checked,
      [
        ["Last flush", b.brakeFluid.lastFlush],
        ["Grade", pf(b.brakeFluid.verdict)],
      ],
      b.brakeFluid.notes,
    );
    w.row(
      "Diff and transfer-case fluid",
      b.diffFluid.checked,
      [
        ...(h.drive === "2WD"
          ? ([] as [string, string][])
          : ([
              ["Transfer", pf(b.diffFluid.transfer)],
              ["Front diff", pf(b.diffFluid.front)],
            ] as [string, string][])),
        ["Rear diff", pf(b.diffFluid.rear)],
        ["Grade", pf(b.diffFluid.verdict)],
      ],
      b.diffFluid.notes,
    );
    w.row(
      "Seepage grade",
      b.seepage.checked,
      [
        ["Valve covers", b.seepage.valveCover],
        ["Timing cover", b.seepage.timingCover],
        ["Oil pan", b.seepage.oilPan],
        ["Grade", pf(b.seepage.verdict)],
      ],
      b.seepage.notes,
      "baseline.seepage",
    );
    w.row("Manifold / heat-shield bolts", b.manifoldBolts.checked, [["Grade", pf(b.manifoldBolts.verdict)]], b.manifoldBolts.notes, "baseline.manifoldBolts");
    w.row(
      "UCAs / ball joints",
      b.ucaJoints.checked,
      [
        ["Inner taper", yn(b.ucaJoints.innerTaper)],
        ["Grade", pf(b.ucaJoints.verdict)],
      ],
      b.ucaJoints.notes,
      "baseline.ucaJoints",
    );
    w.row(
      "Rear load-leveling / air shocks",
      b.airShocks.checked,
      [
        ["Equipped", yn(b.airShocks.equipped)],
        ["Grade", pf(b.airShocks.verdict)],
      ],
      b.airShocks.notes,
      "baseline.airShocks",
    );
    w.note(b.notes);
  }

  w.newPage();
  w.heading("9. Result");
  w.kv("Overall", overallLabel(draft.result.overall));
  w.note(draft.result.failItems);
  if (oilChangeMode(draft)) {
    w.note(oilChangeRecord(draft));
  } else {
    w.kv("Oil change @", draft.result.oilChangeMi);
  }
  w.kv("15k @", draft.result.service15kMi);
  w.kv("30k powertrain @", draft.result.service30kMi);
  if (rowShows("smodPlan", h.visitType, h.drive, h.plan)) {
    const p = draft.result.smodPlan;
    w.row(
      "SMOD prevention",
      p.checked,
      [
        ["Radiator last", p.radiatorLast === "replaced" ? p.radiatorDate || "replaced" : p.radiatorLast || "unknown"],
        ["Bypass / external cooler", yn(draft.engine.atfLines.bypassDone)],
        ["Cooler fittings photo", photos["engine.atfLines"] ? "Y" : "N"],
      ],
      smodPlanRecord(draft),
      "engine.atfLines",
    );
  }
  w.kv("Sign-off", draft.result.signName);
  w.kv("Sign date", draft.result.signDate);
  w.kv("Printed", formatStamp(Date.now()));
  w.footer();

  const blob = w.doc.output("blob");
  const miles = formatMiles(h.miles).replace(/,/g, "") || "miles";
  const filename = `armada-inspection-${h.date || "draft"}-${miles}.pdf`;
  return { blob, filename };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function sharePdf(blob: Blob, filename: string): Promise<boolean> {
  const file = new File([blob], filename, { type: "application/pdf" });
  const nav = navigator as Navigator & {
    share?: (d: ShareData) => Promise<void>;
    canShare?: (d: ShareData) => boolean;
  };
  if (!nav.share) return false;
  try {
    if (nav.canShare && !nav.canShare({ files: [file] })) return false;
    await nav.share({ files: [file], title: REPORT_TITLE });
    return true;
  } catch {
    return false;
  }
}

export function emailSubject(draft: InspectionDraft): string {
  const miles = formatMiles(draft.header.miles);
  return `${REPORT_TITLE} — ${draft.header.date} — ${miles} mi`;
}

export async function printPdf(blob: Blob): Promise<void> {
  const url = URL.createObjectURL(blob);
  await new Promise<void>((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = url;
    const done = () => {
      setTimeout(() => {
        iframe.remove();
        URL.revokeObjectURL(url);
        resolve();
      }, 500);
    };
    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        window.open(url, "_blank");
      }
      done();
    };
    document.body.appendChild(iframe);
  });
}

export function emailBody(draft: InspectionDraft): string {
  return `Inspector ${draft.header.inspector}\nMiles ${formatMiles(draft.header.miles)}\nResult ${overallLabel(draft.result.overall)}`;
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}
