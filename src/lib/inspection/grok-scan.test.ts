import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  GROK_STATUS_LABEL,
  SMOD_LINE,
  UNSURE_LINE,
  appendNote,
  grokReportLine,
  isAutoScanSlot,
  isScanAllowedSlot,
  looksInventedMeasurement,
  parseGrokJson,
  parseStatusLabel,
  privacyPayload,
  sanitizeSuggestion,
  shouldAutoScan,
  suggestionForItem,
} from "./grok-scan.ts";

describe("Grok yard scan", () => {
  it("maps labels to the six-button statuses", () => {
    assert.equal(parseStatusLabel("PASS"), "pass");
    assert.equal(parseStatusLabel("service soon"), "attention");
    assert.equal(parseStatusLabel("URGENT"), "asap");
    assert.equal(parseStatusLabel("UNABLE"), "unable");
    assert.equal(GROK_STATUS_LABEL.attention, "SERVICE SOON");
  });

  it("never auto-scans the VIN plate", () => {
    assert.equal(isScanAllowedSlot("header.vin"), false);
    assert.equal(isAutoScanSlot("header.vin"), false);
    assert.equal(isAutoScanSlot("engine.radiator"), true);
    assert.equal(isAutoScanSlot("fluids.atf"), true);
    assert.equal(isAutoScanSlot("brakes.pads.lf"), true);
    assert.equal(isAutoScanSlot("fluids.coolant"), false);
  });

  it("privacy payload keeps only step + photo/note — no VIN or email", () => {
    const p = privacyPayload({
      stepId: "atf",
      stepName: "ATF",
      slotLabel: "ATF on the stick at HOT",
      imageDataUrl: "data:image/jpeg;base64,abc",
      transcript: "looks brown",
    });
    assert.deepEqual(Object.keys(p).sort(), ["imageDataUrl", "slotLabel", "stepId", "stepName", "transcript"]);
    assert.equal("vin" in p, false);
    assert.equal(JSON.stringify(p).includes("5N1"), false);
  });

  it("rejects invented measurements as UNABLE", () => {
    assert.equal(looksInventedMeasurement("inner pad 2.1 mm"), true);
    const s = sanitizeSuggestion({
      suggestedStatus: "SERVICE SOON",
      whatItSees: "LF inner pad is 2.1 mm.",
      whereOnPhoto: "Circle the inner pad.",
      askInspector: "Is the inner pad that thin?",
    });
    assert.equal(s.suggestedStatus, "unable");
    assert.equal(s.whatItSees, UNSURE_LINE);
  });

  it("forces URGENT + canned SMOD line on milky/pink/wet fittings", () => {
    const s = sanitizeSuggestion({
      suggestedStatus: "PASS",
      whatItSees: "Wetness at the ATF cooler fittings on the radiator.",
      whereOnPhoto: "Circle the passenger-side fitting.",
      askInspector: "Is the ATF milky or just backlit?",
    });
    assert.equal(s.suggestedStatus, "asap");
    assert.equal(s.whatItSees, SMOD_LINE);
  });

  it("parses fenced JSON and labels report lines", () => {
    const parsed = parseGrokJson("```json\n{\"suggestedStatus\":\"MONITOR\",\"whatItSees\":\"Dry seepage film.\",\"whereOnPhoto\":\"Circle the timing cover.\",\"askInspector\":\"Is it wetter in person?\"}\n```");
    assert.ok(parsed);
    const s = sanitizeSuggestion(parsed);
    assert.equal(s.suggestedStatus, "monitor");
    const line = grokReportLine({
      itemId: "oilLeak",
      slot: "fluids.oilLeak",
      suggestedStatus: "monitor",
      whatItSees: s.whatItSees,
      whereOnPhoto: s.whereOnPhoto,
      askInspector: s.askInspector,
      confirmed: false,
      dismissed: false,
      editing: false,
      source: "photo",
      photoHash: "x",
      at: 1,
    });
    assert.match(line, /Grok suggestion \(not confirmed\)/);
    const confirmed = grokReportLine({
      itemId: "oilLeak",
      slot: "fluids.oilLeak",
      suggestedStatus: "monitor",
      whatItSees: s.whatItSees,
      whereOnPhoto: s.whereOnPhoto,
      askInspector: s.askInspector,
      confirmed: true,
      dismissed: false,
      editing: false,
      source: "photo",
      photoHash: "x",
      at: 1,
    });
    assert.match(confirmed, /Inspector-confirmed/);
    assert.equal(grokReportLine({ dismissed: true, whatItSees: "x" } as never), "");
  });

  it("does not auto-rescan the same photo or after confirm/ignore", () => {
    const g = {
      itemId: "atf",
      slot: "fluids.atf",
      suggestedStatus: "monitor" as const,
      whatItSees: "ATF looks amber.",
      whereOnPhoto: "Stick",
      askInspector: "Hot read?",
      confirmed: false,
      dismissed: false,
      editing: false,
      source: "photo" as const,
      photoHash: "h1",
      at: 1,
    };
    assert.equal(shouldAutoScan(g, "fluids.atf", "h1"), false);
    assert.equal(shouldAutoScan({ ...g, confirmed: true }, "fluids.atf", "h2"), false);
    assert.equal(shouldAutoScan(undefined, "fluids.atf", "h1"), true);
  });

  it("appendNote does not duplicate", () => {
    assert.equal(appendNote("", "wet fitting"), "wet fitting");
    assert.equal(appendNote("wet fitting", "wet fitting"), "wet fitting");
    assert.equal(appendNote("dry", "wet fitting"), "dry · wet fitting");
  });

  it("finds a suggestion by walk id or photo item id", () => {
    const scans = {
      absLamps: {
        itemId: "absLamps",
        slot: "cabin.dash",
        suggestedStatus: "pass" as const,
        whatItSees: "Dash lamps off.",
        whereOnPhoto: "",
        askInspector: "Key on?",
        confirmed: false,
        dismissed: false,
        editing: false,
        source: "photo" as const,
        photoHash: "h",
        at: 1,
      },
    };
    assert.equal(suggestionForItem(scans, "absLamps")?.itemId, "absLamps");
    assert.equal(suggestionForItem(scans, "cabin.dash", ["cabin.dash"])?.itemId, "absLamps");
  });
});
