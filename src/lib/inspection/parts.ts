/** Factory parts + torque for a 2005 Armada VK56DE / RE5R05A. One strip. Not memory. */
export const PARTS_STRIP = {
  title: "FACTORY STRIP  ·  2005 Armada VK56DE / RE5R05A  ·  not memory",
  lines: [
    "Oil: Nissan 5W-30 full synthetic · 6.2 L / 6.5 qt with filter · new crush washer every drain",
    "ATF RE5R05A: Nissan Matic J (Matic S OK) · pan drain ~4-6 qt · dry fill 10.6 L / 11.25 qt · HOT ~149 F",
    "Brake: DOT 3, flush 24 mo · pads 12.0 mm new / 1.0 mm repair (review 3.0) · rotors F 28.0/26.0, R 14.0/12.0 mm",
    "Lugs: 98 ft-lb (133 N-m) star, dry threads · recheck after 50-100 mi",
  ],
} as const;

export function partsStripText(): string {
  return [PARTS_STRIP.title, ...PARTS_STRIP.lines].join("\n");
}
