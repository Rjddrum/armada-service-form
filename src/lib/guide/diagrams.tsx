import type { ReactNode } from "react";
import type { DiagramKind } from "./plain.ts";

function Frame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="overflow-hidden rounded border border-border bg-inset">
      <svg viewBox="0 0 320 168" className="w-full" role="img" aria-label={caption}>
        <rect width="320" height="168" fill="#0d1418" />
        {children}
      </svg>
      <figcaption className="px-3 py-2 text-xs leading-snug text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}

function label(x: number, y: number, text: string) {
  return (
    <text x={x} y={y} fill="#5ad4c6" fontSize="9" fontFamily="ui-monospace, monospace">
      {text}
    </text>
  );
}

export function GuideDiagram({ kind }: { kind: DiagramKind }) {
  switch (kind) {
    case "radiator":
      return (
        <Frame caption="Stand at the front bumper, hood open. Radiator is the wide tank across the front. Two small fittings on the passenger-side end tank are the in-radiator ATF cooler.">
          <rect x="40" y="36" width="240" height="70" rx="6" fill="none" stroke="#5ad4c6" strokeWidth="2" />
          <text x="90" y="76" fill="#e8eef2" fontSize="12">
            Radiator
          </text>
          <circle cx="250" cy="50" r="7" fill="none" stroke="#f0b429" strokeWidth="2" />
          <circle cx="250" cy="92" r="7" fill="none" stroke="#f0b429" strokeWidth="2" />
          {label(198, 28, "ATF cooler fittings")}
          <path d="M257 50 H300" stroke="#f0b429" strokeWidth="2" />
          <path d="M257 92 H300" stroke="#f0b429" strokeWidth="2" />
          {label(40, 128, "You stand here")}
        </Frame>
      );
    case "atf":
      return (
        <Frame caption="Passenger-side firewall, engine running. The trans stick is the skinny tube with a small bolt through the handle. Not the engine oil stick.">
          <rect x="24" y="28" width="180" height="110" rx="4" fill="none" stroke="#3d4d56" />
          {label(30, 22, "Firewall (passenger)")}
          <rect x="160" y="44" width="10" height="90" fill="#5ad4c6" />
          <rect x="148" y="36" width="34" height="12" rx="2" fill="#e8eef2" />
          <circle cx="182" cy="42" r="3" fill="#f0b429" />
          {label(198, 46, "Bolt in handle")}
          {label(198, 88, "ATF stick")}
          {label(30, 154, "Engine stays idling")}
        </Frame>
      );
    case "oil":
      return (
        <Frame caption="Driver-side front of the engine. Long yellow (or marked) handle is engine oil. Wait 10+ minutes after shutdown on a 15k visit.">
          <rect x="50" y="30" width="140" height="100" rx="8" fill="none" stroke="#3d4d56" />
          {label(50, 24, "VK56 engine")}
          <rect x="168" y="40" width="8" height="80" fill="#f0b429" />
          <rect x="158" y="32" width="28" height="10" fill="#f0b429" />
          {label(200, 40, "Oil stick")}
          {label(50, 150, "Not the trans stick")}
        </Frame>
      );
    case "coolant":
      return (
        <Frame caption="Front of the bay, engine cold. Read the translucent overflow tank — MIN/MAX molded in the plastic. Do not open the radiator cap hot.">
          <rect x="40" y="40" width="90" height="90" rx="4" fill="none" stroke="#5ad4c6" />
          {label(40, 34, "Overflow tank")}
          <line x1="50" y1="70" x2="120" y2="70" stroke="#8aa0ad" />
          {label(126, 74, "MAX")}
          <line x1="50" y1="110" x2="120" y2="110" stroke="#8aa0ad" />
          {label(126, 114, "MIN")}
          <rect x="170" y="50" width="110" height="50" rx="4" fill="none" stroke="#3d4d56" />
          {label(178, 78, "Radiator — leave cap")}
        </Frame>
      );
    case "battery":
      return (
        <Frame caption="Driver-side of the engine bay. Big black box. Red cable is +, black is −. Ground straps run to the body and engine.">
          <rect x="50" y="40" width="120" height="80" rx="4" fill="none" stroke="#e8eef2" strokeWidth="2" />
          <text x="78" y="86" fill="#e8eef2" fontSize="16">
            +
          </text>
          <text x="130" y="86" fill="#8aa0ad" fontSize="16">
            −
          </text>
          {label(50, 34, "Battery")}
          {label(184, 70, "Ground strap → body")}
        </Frame>
      );
    case "pads":
      return (
        <Frame caption="Look through the wheel at the caliper. The pad is the friction material, not the steel backing. Measure remaining meat in mm.">
          <circle cx="110" cy="84" r="58" fill="none" stroke="#8aa0ad" strokeWidth="6" />
          <rect x="88" y="50" width="18" height="68" fill="#5ad4c6" />
          <rect x="108" y="50" width="10" height="68" fill="#3d4d56" />
          {label(184, 60, "Pad (measure this)")}
          {label(184, 78, "Rotor")}
          {label(184, 120, "Caliper body")}
        </Frame>
      );
    case "tire":
      return (
        <Frame caption="All four corners plus the spare. Check the tread face and the inner shoulder — the edge you cannot see without a crouch or a mirror.">
          <circle cx="90" cy="84" r="50" fill="none" stroke="#e8eef2" strokeWidth="8" />
          <path d="M90 40 C 70 84 70 84 90 128" fill="none" stroke="#f0b429" strokeWidth="4" />
          {label(160, 64, "Inner shoulder")}
          {label(160, 84, "(yellow)")}
          {label(160, 120, "Tread face")}
        </Frame>
      );
    case "engine":
      return (
        <Frame caption="Stand at the front, hood open. Timing cover is the front of the engine. Valve covers are the two long lids on top.">
          <rect x="60" y="36" width="200" height="90" rx="6" fill="none" stroke="#5ad4c6" />
          <rect x="70" y="44" width="80" height="20" fill="#3d4d56" />
          <rect x="170" y="44" width="80" height="20" fill="#3d4d56" />
          {label(70, 30, "Valve covers")}
          <rect x="60" y="110" width="200" height="16" fill="#f0b429" opacity="0.4" />
          {label(60, 148, "Front / timing cover")}
        </Frame>
      );
    case "trans":
      return (
        <Frame caption="You feel this from the driver seat. TCC is the lock-up clutch in the torque converter — it should go quiet and smooth around 45–60 mph, light throttle.">
          <rect x="40" y="50" width="240" height="50" rx="8" fill="none" stroke="#5ad4c6" />
          {label(50, 44, "RE5R05A — 5-speed auto")}
          {label(50, 80, "P  R  N  D   2  1")}
          {label(50, 128, "Listen / feel. Do not guess from Park.")}
        </Frame>
      );
    case "under":
      return (
        <Frame caption="On stands at the frame, or a lift. Never a cheap scissor jack. Look along the frame rails, pans, and lines from front to back.">
          <rect x="30" y="70" width="260" height="14" fill="#5ad4c6" />
          <rect x="70" y="50" width="80" height="20" fill="none" stroke="#e8eef2" />
          {label(70, 44, "Oil pan")}
          <rect x="170" y="90" width="80" height="20" fill="none" stroke="#f0b429" />
          {label(170, 126, "Trans pan")}
        </Frame>
      );
    case "cabin":
      return (
        <Frame caption="Key ON, engine may be off. Watch the dash cluster: lamps should light, then go out. Photograph the cluster if anything stays on.">
          <rect x="40" y="40" width="240" height="80" rx="10" fill="none" stroke="#e8eef2" />
          <circle cx="90" cy="80" r="18" fill="none" stroke="#5ad4c6" />
          <circle cx="160" cy="80" r="18" fill="none" stroke="#5ad4c6" />
          <circle cx="230" cy="80" r="18" fill="none" stroke="#f0b429" />
          {label(40, 148, "Prove-out then off. Yellow = still on.")}
        </Frame>
      );
    case "steering":
      return (
        <Frame caption="Front wheel off or turned out. Upper control arm (UCA) is the top A-shaped arm. Ball joint is the pivot at the knuckle.">
          <path d="M60 40 L160 40 L130 90 L90 90 Z" fill="none" stroke="#5ad4c6" strokeWidth="2" />
          {label(60, 32, "UCA")}
          <circle cx="110" cy="96" r="10" fill="none" stroke="#f0b429" strokeWidth="2" />
          {label(128, 100, "Ball joint")}
          <rect x="96" y="108" width="28" height="36" fill="none" stroke="#8aa0ad" />
        </Frame>
      );
    case "brake":
      return (
        <Frame caption="Driver footwell: pedal height from the floor. Master cylinder is the reservoir on the firewall, driver side, under the hood.">
          <path d="M80 40 L80 110 L140 130" fill="none" stroke="#5ad4c6" strokeWidth="3" />
          {label(150, 80, "Pedal")}
          <rect x="200" y="40" width="70" height="40" rx="4" fill="none" stroke="#e8eef2" />
          {label(200, 34, "Master cyl")}
        </Frame>
      );
    default:
      return (
        <Frame caption="After a drive, heat makes leaks show. Look at pans, covers, and the ground where it sat.">
          <ellipse cx="160" cy="120" rx="70" ry="16" fill="none" stroke="#f0b429" />
          {label(110, 124, "Fresh drip")}
          <rect x="80" y="40" width="160" height="50" rx="6" fill="none" stroke="#5ad4c6" />
          {label(90, 70, "Pan / cover")}
        </Frame>
      );
  }
}
