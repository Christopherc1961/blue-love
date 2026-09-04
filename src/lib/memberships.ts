export type MembershipTier = {
  id: "seeker" | "circle" | "devotee";
  name: string;
  path: string;
  priceCents: number;
  annualCents: number;
  tag: string;
  promise: string;
  discount: number;
  perks: string[];
};

export const MEMBERSHIPS: MembershipTier[] = [
  {
    id: "seeker",
    name: "Seeker",
    path: "Find Love",
    priceCents: 1900,
    annualCents: 19000,
    tag: "The seeking",
    promise: "The companion, the Love Letter, and 10% off the shop.",
    discount: 0.1,
    perks: [
      "Daily sitting from the 30-day Foundation Series",
      "Monthly Love Letter",
      "10% off in-stock bottles and digital",
      "Breath timer and streak that follows your account",
    ],
  },
  {
    id: "circle",
    name: "Circle",
    path: "Share Love",
    priceCents: 4900,
    annualCents: 49000,
    tag: "The conversation",
    promise: "The forum and 18% off — money that keeps moving.",
    discount: 0.18,
    perks: [
      "Everything in Seeker",
      "Circle forum posting",
      "18% off the catalog",
      "Sacred Sites map",
    ],
  },
  {
    id: "devotee",
    name: "Devotee",
    path: "Be Love",
    priceCents: 9900,
    annualCents: 99000,
    tag: "The practice",
    promise: "The house at its highest frequency. 25% off everything in stock.",
    discount: 0.25,
    perks: [
      "Everything in Circle",
      "25% off the shop, including apparel when it lands",
      "First word on replenishment and pilgrimage",
    ],
  },
];

export const MEMBER_RATES: Record<string, number> = {
  seeker: 0.1,
  circle: 0.18,
  devotee: 0.25,
};
