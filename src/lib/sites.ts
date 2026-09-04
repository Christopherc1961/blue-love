export type SacredSite = {
  id: string;
  name: string;
  place: string;
  lat: number;
  lng: number;
  frequency: string;
  practice: string;
  why: string;
};

/** Seven real pilgrimage geographies, mapped as the house's Sanctuaries of Love. */
export const SACRED_SITES: SacredSite[] = [
  {
    id: "sedona",
    name: "Cathedral Rock",
    place: "Sedona, Arizona",
    lat: 34.8195,
    lng: -111.7931,
    frequency: "Heart / vortex",
    practice: "Stand still at red rock. Breathe in for 4, hold 4, out 6. Ask nothing.",
    why: "The American desert as a tuning fork. Seekers come here to hear themselves.",
  },
  {
    id: "glastonbury",
    name: "Chalice Well & Tor",
    place: "Glastonbury, England",
    lat: 51.1445,
    lng: -2.6988,
    frequency: "Waters / remembrance",
    practice: "Drink or touch living water. Write one sentence you will keep.",
    why: "The old isle of glass. A well that has been tended as holy for longer than the shop.",
  },
  {
    id: "delphi",
    name: "Temple of Apollo",
    place: "Delphi, Greece",
    lat: 38.4824,
    lng: 22.501,
    frequency: "Oracle / knowing",
    practice: "Sit facing a mountain. Ask one honest question. Do not answer it today.",
    why: "Know thyself was not a brand line. It was a gate.",
  },
  {
    id: "giza",
    name: "The Plateau",
    place: "Giza, Egypt",
    lat: 29.9792,
    lng: 31.1342,
    frequency: "Stone / eternity",
    practice: "Count 108 slow breaths while looking at a horizon that outlives you.",
    why: "Geometry as prayer. The house uses this site to remember scale.",
  },
  {
    id: "varanasi",
    name: "The Ghats",
    place: "Varanasi, India",
    lat: 25.3109,
    lng: 83.0107,
    frequency: "River / release",
    practice: "Offer a flower or a thought to moving water. Let one grief leave.",
    why: "The city that does not flinch from death, and therefore teaches life.",
  },
  {
    id: "machu",
    name: "Machu Picchu",
    place: "Cusco Region, Peru",
    lat: -13.1631,
    lng: -72.545,
    frequency: "Mountain / alignment",
    practice: "Walk uphill in silence. Match breath to step. No photograph until the top.",
    why: "A city placed on a spine of the Andes. Alignment is a physical fact here.",
  },
  {
    id: "uluru",
    name: "Uluru",
    place: "Northern Territory, Australia",
    lat: -25.3444,
    lng: 131.0369,
    frequency: "Earth / belonging",
    practice: "Walk the base with respect. Do not climb. Listen for the land's pace.",
    why: "A living being in Anangu law. The house maps it as belonging, not conquest.",
  },
];

export function mercator(lat: number, lng: number) {
  const x = (lng + 180) / 360;
  const latRad = (lat * Math.PI) / 180;
  const y = (1 - Math.log(Math.tan(Math.PI / 4 + latRad / 2)) / Math.PI) / 2;
  return { x: Math.min(0.96, Math.max(0.04, x)), y: Math.min(0.9, Math.max(0.08, y)) };
}
