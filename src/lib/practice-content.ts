export type Meditation = {
  id: string;
  day: number;
  title: string;
  minutes: number;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
  script: string[];
};

export const MEDITATIONS: Meditation[] = [
  {
    id: "dawn",
    day: 0,
    title: "Dawn — Find",
    minutes: 7,
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2,
    script: [
      "Sit as if the spine were a quiet column of light.",
      "Inhale through the nose. Count four.",
      "Hold without gripping.",
      "Exhale longer than you arrived.",
      "Love is not a mood. It is a direction.",
    ],
  },
  {
    id: "water",
    day: 1,
    title: "Water — Share",
    minutes: 8,
    inhale: 5,
    hold: 2,
    exhale: 7,
    rest: 2,
    script: [
      "Imagine a well that never empties because it is given from.",
      "On the exhale, send one person a silent sentence of goodwill.",
      "Do not wait to feel generous. Act as if you already are.",
    ],
  },
  {
    id: "stone",
    day: 2,
    title: "Stone — Be",
    minutes: 11,
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 2,
    script: [
      "Become the mountain you are sitting on, even if it is a chair.",
      "Nothing to improve. Nothing to perform.",
      "Eternity is the Now — not later, not after the work.",
    ],
  },
  {
    id: "fire",
    day: 3,
    title: "Fire — Clarify",
    minutes: 6,
    inhale: 3,
    hold: 3,
    exhale: 6,
    rest: 1,
    script: [
      "Name one resentment. Do not decorate it.",
      "On the next ten breaths, let the heat of it burn clean, not bitter.",
      "You are not your story. You are the one who can put it down.",
    ],
  },
  {
    id: "lotus",
    day: 4,
    title: "Lotus — Heart",
    minutes: 9,
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 4,
    script: [
      "Box breath. Equal sides. A room with four walls and a door open.",
      "Place attention in the center of the chest, not the head.",
      "If feeling comes, let it. If it does not, do not fake it.",
    ],
  },
  {
    id: "night",
    day: 5,
    title: "Night — Rest",
    minutes: 12,
    inhale: 4,
    hold: 2,
    exhale: 8,
    rest: 2,
    script: [
      "Lengthen the exhale until the nervous system believes you are safe.",
      "Tomorrow's work is not in this room.",
      "Love yourself now — not after you earn it.",
    ],
  },
  {
    id: "infinite",
    day: 6,
    title: "Infinite — Return",
    minutes: 10,
    inhale: 5,
    hold: 5,
    exhale: 5,
    rest: 5,
    script: [
      "The mark of this house is infinity, not perfection.",
      "Breathe as a circle that does not start and does not finish.",
      "When you open your eyes, keep one thread of this with you.",
    ],
  },
];

export function meditationForToday(date = new Date()) {
  return MEDITATIONS[date.getDay() % MEDITATIONS.length];
}

export const NOURISHMENT = [
  "Warm lemon water before coffee.",
  "Protein and color at the first meal. Not a bar in the car.",
  "Cook one thing with your hands today.",
  "Salt, mineral, water — then caffeine.",
  "Eat without a screen for ten minutes.",
  "A bitter green. A slow chew.",
  "Stop two bites before full.",
];

export const MOVEMENT = [
  "Twenty minutes of walking. Phone in a pocket, not a hand.",
  "Spine: cat, cow, twist. Two minutes is enough if you mean it.",
  "Carry something heavy with a straight back.",
  "Sun on skin if you can. Shade if you cannot.",
  "Climb stairs as prayer, not punishment.",
  "Stretch the hips you sit on.",
  "Dance badly in a kitchen. Circulation is the point.",
];
