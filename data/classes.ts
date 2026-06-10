export interface GymClass {
  id: string;
  name: string;
  duration: number;
  intensity: number; // 1–10
  description: string;
  schedule: string[];
  iconName: string;
  caloriesBurned: number;
  imageSrc: string;
}

export const gymClasses: GymClass[] = [
  {
    id: "class-1",
    name: "HIIT Inferno",
    duration: 45,
    intensity: 9,
    description:
      "High-intensity interval training that alternates explosive bursts with active recovery. Designed to spike your metabolic rate and keep it elevated for hours post-workout.",
    schedule: ["Mon", "Wed", "Fri", "Sat"],
    iconName: "Flame",
    caloriesBurned: 600,
    imageSrc:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=700&fit=crop&q=80&auto=format",
  },
  {
    id: "class-2",
    name: "Cardio Burn",
    duration: 50,
    intensity: 7,
    description:
      "Sustained cardiovascular training combining treadmill intervals, rowing, and cycling. Builds aerobic base while targeting stubborn body fat through steady-state effort.",
    schedule: ["Tue", "Thu", "Sat", "Sun"],
    iconName: "Heart",
    caloriesBurned: 500,
    imageSrc:
      "https://images.unsplash.com/photo-1675026482188-8102367ecc16?w=600&h=700&fit=crop&q=80&auto=format",
  },
  {
    id: "class-3",
    name: "Circuit Blast",
    duration: 40,
    intensity: 8,
    description:
      "Full-body circuit combining resistance and cardio stations. Each round elevates your heart rate while building functional strength and muscular endurance simultaneously.",
    schedule: ["Mon", "Wed", "Fri"],
    iconName: "Zap",
    caloriesBurned: 550,
    imageSrc:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600&h=700&fit=crop&q=80&auto=format",
  },
  {
    id: "class-4",
    name: "Power Sculpt",
    duration: 55,
    intensity: 7,
    description:
      "Resistance-focused class using dumbbells and resistance bands to sculpt lean muscle. The controlled tempo and progressive overload approach guarantees visible body composition change.",
    schedule: ["Tue", "Thu", "Sun"],
    iconName: "Dumbbell",
    caloriesBurned: 450,
    imageSrc:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=700&fit=crop&q=80&auto=format",
  },
  {
    id: "class-5",
    name: "Tabata Shred",
    duration: 30,
    intensity: 10,
    description:
      "Pure Tabata protocol — 20 seconds maximum effort, 10 seconds rest, repeated across 8 brutal rounds. The most time-efficient fat-burning workout in our entire program.",
    schedule: ["Mon", "Tue", "Thu", "Sat"],
    iconName: "Timer",
    caloriesBurned: 480,
    imageSrc:
      "https://images.unsplash.com/photo-1591311630200-ffa9120a540f?w=600&h=700&fit=crop&q=80&auto=format",
  },
  {
    id: "class-6",
    name: "Core Destroyer",
    duration: 35,
    intensity: 8,
    description:
      "Targeted core and abdominal conditioning class using planks, rotational exercises, and weighted movements. Builds the athletic foundation every serious lifter needs.",
    schedule: ["Wed", "Fri", "Sun"],
    iconName: "Target",
    caloriesBurned: 380,
    imageSrc:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=700&fit=crop&q=80&auto=format",
  },
];
