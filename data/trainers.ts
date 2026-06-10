export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  bio: string;
  imageSrc: string;
  socials: {
    instagram?: string;
    youtube?: string;
  };
  badges: string[];
}

export const trainers: Trainer[] = [
  {
    id: "trainer-1",
    name: "Omar Khalid",
    specialty: "Strength & Powerlifting",
    experience: 9,
    bio: "National-level powerlifter and certified strength coach. Omar has helped over 200 athletes break personal records using periodised programming and precise biomechanical cues.",
    imageSrc:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=640&h=860&fit=crop&q=80&auto=format",
    socials: { instagram: "https://instagram.com", youtube: "https://youtube.com" },
    badges: ["NSCA-CSCS", "Powerlifting", "Barbell Mechanics", "Fat Loss"],
  },
  {
    id: "trainer-2",
    name: "Sana Mirza",
    specialty: "HIIT & Fat Loss",
    experience: 6,
    bio: "Certified HIIT specialist with a sports science degree. Sana designs metabolic conditioning programs that maximise calorie burn and preserve lean muscle across all fitness levels.",
    imageSrc:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=640&h=860&fit=crop&q=80&auto=format",
    socials: { instagram: "https://instagram.com" },
    badges: ["ACE-CPT", "HIIT Certified", "Nutrition Coach", "Mobility"],
  },
  {
    id: "trainer-3",
    name: "Tariq Saleem",
    specialty: "Bodybuilding & Hypertrophy",
    experience: 12,
    bio: "IFBB pro competitor and hypertrophy specialist. Tariq's evidence-based approach to muscle building has produced champion physiques across multiple national competitions.",
    imageSrc:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=640&h=860&fit=crop&q=80&auto=format",
    socials: { instagram: "https://instagram.com", youtube: "https://youtube.com" },
    badges: ["IFBB Pro", "Hypertrophy", "Contest Prep", "Supplement Advice"],
  },
  {
    id: "trainer-4",
    name: "Ayesha Farooq",
    specialty: "Yoga & Functional Movement",
    experience: 7,
    bio: "500-hour certified yoga instructor and FMS practitioner. Ayesha bridges the gap between traditional wellness and modern athletic performance through targeted mobility work.",
    imageSrc:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=640&h=860&fit=crop&q=80&auto=format",
    socials: { instagram: "https://instagram.com" },
    badges: ["RYT-500", "FMS Level 2", "Pilates", "Recovery Protocols"],
  },
  {
    id: "trainer-5",
    name: "Bilal Hassan",
    specialty: "CrossFit & Conditioning",
    experience: 8,
    bio: "CrossFit Level-2 coach and former military fitness instructor. Bilal brings military-grade conditioning principles to civilian athletes seeking elite functional fitness.",
    imageSrc:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=640&h=860&fit=crop&q=80&auto=format",
    socials: { instagram: "https://instagram.com", youtube: "https://youtube.com" },
    badges: ["CF-L2", "Military Fitness", "Olympic Lifting", "Endurance"],
  },
];
