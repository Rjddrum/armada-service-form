import { CORNERS, isSmodRisk, type InspectionDraft, type OverallResult } from "./types.ts";

export interface DriveGate {
  id: string;
  label: string;
  measured: string;
  range: string;
  note: string;
  guideId: string;
}

const STOP = "Do not drive. Pass is blocked.";

function parseNum(raw: string | undefined): number | null {
  const t = (raw ?? "").trim().replace(",", ".");
  if (!t) return null;
  const m = t.match(/-?\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

function parseInches(raw: string | undefined): number | null {
  const t = (raw ?? "").trim().toLowerCase();
  if (!t) return null;
  const n = parseNum(t);
  if (n == null) return null;
  if (/\bmm\b/.test(t)) return n / 25.4;
  return n;
}

function lowOilPressure(draft: InspectionDraft): boolean {
  if (draft.engine?.timingCover?.oilPressure === "low") return true;
  const text = [
    draft.engine?.timingCover?.notes,
    draft.engine?.scan?.stored,
    draft.engine?.scan?.pending,
    draft.engine?.notes,
  ]
    .filter(Boolean)
    .join("\n");
  return /\blow\s+oil(\s+press)?|\boil\s+press(ure)?\s*(low|drop|lamp|light|warning)|oil\s+(pressure\s+)?(lamp|light|warning)/i.test(
    text,
  );
}

/** Hard park-it gates. SMOD plus the safety items that cannot be a Pass. */
export function driveGates(draft: InspectionDraft): DriveGate[] {
  const gates: DriveGate[] = [];
  const push = (g: DriveGate) => gates.push(g);

  if (isSmodRisk(draft)) {
    push({
      id: "smod",
      label: "SMOD — coolant in the ATF",
      measured: [draft.fluids.atf.color, draft.fluids.atf.smell].filter(Boolean).join(", "),
      range: "factory: red-amber ATF, smells like ATF",
      note: STOP,
      guideId: "fluids.atf",
    });
  }

  for (const c of CORNERS) {
    const n = parseNum(draft.brakes?.pads?.[c.key]);
    if (n != null && n <= 1) {
      push({
        id: `pads.${c.key}`,
        label: `${c.label} pad at repair limit`,
        measured: `${n} mm`,
        range: "factory repair limit 1.0 mm",
        note: STOP,
        guideId: "brakes.pads",
      });
    }
  }

  const front = parseNum(draft.brakes?.rotors?.front);
  if (front != null && front <= 26) {
    push({
      id: "rotors.front",
      label: "Front rotor at or below min",
      measured: `${front} mm`,
      range: "factory min 26.0 mm (new 28.0 mm)",
      note: STOP,
      guideId: "brakes.rotors",
    });
  }
  const rear = parseNum(draft.brakes?.rotors?.rear);
  if (rear != null && rear <= 12) {
    push({
      id: "rotors.rear",
      label: "Rear rotor at or below min",
      measured: `${rear} mm`,
      range: "factory min 12.0 mm (new 14.0 mm)",
      note: STOP,
      guideId: "brakes.rotors",
    });
  }

  const rest = parseNum(draft.engine?.battery?.restV);
  if (rest != null && rest < 12.2) {
    push({
      id: "battery.restV",
      label: "Battery rest voltage collapsed",
      measured: `${rest} V`,
      range: "factory rest 12.4–12.7 V — collapse is below 12.2 V",
      note: STOP,
      guideId: "engine.battery",
    });
  }

  const abs = draft.brakes?.absLamps?.state;
  if (abs === "stay-on" || abs === "intermittent") {
    push({
      id: "abs.lamps",
      label: "ABS / SLIP / VDC lamp",
      measured: abs,
      range: "factory: prove-out then off",
      note: STOP,
      guideId: "brakes.absLamps",
    });
  }

  const airbag = draft.cabin?.airbagLamp;
  if (airbag === "stay-on" || airbag === "intermittent") {
    push({
      id: "airbag.lamp",
      label: "Airbag lamp",
      measured: airbag,
      range: "factory: prove-out then off",
      note: STOP,
      guideId: "cabin.airbag",
    });
  }

  const inches = parseInches(draft.brakes?.pedalHeight?.measured);
  if (inches != null && inches < 3.5) {
    push({
      id: "pedalHeight",
      label: "Brake pedal below spec",
      measured: draft.brakes.pedalHeight.measured.trim(),
      range: "factory min 3.5 in remaining @ 110 lb",
      note: STOP,
      guideId: "brakes.pedalHeight",
    });
  }

  const rattle = draft.engine?.timingCover?.noise === "ongoing-rattle";
  if (rattle && lowOilPressure(draft)) {
    push({
      id: "timing.oil",
      label: "Ongoing timing-cover rattle + low oil pressure",
      measured: "ongoing rattle with low oil pressure",
      range: "factory: 1–3 sec then gone, oil pressure in the green",
      note: STOP,
      guideId: "engine.timingCover",
    });
  }

  return gates;
}

export function passBlocked(draft: InspectionDraft): boolean {
  return driveGates(draft).length > 0;
}

export function coerceOverall(draft: InspectionDraft): void {
  if (!passBlocked(draft)) return;
  if (draft.result.overall === "pass" || draft.result.overall === "pass-notes") {
    draft.result.overall = "do-not-drive";
  }
}

export function isPassValue(v: OverallResult | string): boolean {
  return v === "pass" || v === "pass-notes";
}
