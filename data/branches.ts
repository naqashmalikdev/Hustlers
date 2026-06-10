export interface TimingSlot {
  label: string;
  time: string;
}

export interface MembershipTier {
  type: string;
  price: number;
  registrationFee?: number;
  registrationNote?: string;
}

export interface MembershipPackage {
  duration: string;
  price: number;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  amenities: string[];
  hasSteamSauna: boolean;
  isFlexFit: boolean;
  coords: { lat: number; lng: number };
  imageSrc: string;
  instagram?: string;
  mapsUrl?: string;
  timings?: TimingSlot[];
  membership?: {
    monthly: MembershipTier[];
    packages: MembershipPackage[];
    notes: string[];
  };
}

export const branches: Branch[] = [
  {
    id: "branch-lahore-lake-city",
    name: "Hustlers Gym – Lake City",
    city: "Lahore",
    address: "9732+4R7, Main Blvd, Block M, Lake City, Lahore, Pakistan",
    phone: "+92 42 111 487 853 | +92 300 487 8530",
    email: "lakecity@hustlers.pk",
    hours: "Mon–Sat: 6:00 AM – 12:00 AM | Closed Sunday",
    amenities: [
      "Gym Floor",
      "Ladies Section",
      "Co-Ed Hours",
      "Personal Training",
      "Group Classes",
      "Parking",
      "Locker Rooms",
    ],
    hasSteamSauna: false,
    isFlexFit: true,
    coords: { lat: 31.4007, lng: 74.1843 },
    imageSrc:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&h=600&fit=crop&q=80&auto=format",
    instagram: "https://www.instagram.com/hustlers.pk/",
    mapsUrl: "https://maps.app.goo.gl/F71NmcLwyNHqaAdn6",
    timings: [
      { label: "Co-Timings (Morning)", time: "6:00 AM – 10:30 AM" },
      { label: "Ladies Timings", time: "10:30 AM – 4:00 PM" },
      { label: "Co-Timings (Evening)", time: "4:00 PM – 12:00 AM" },
    ],
    membership: {
      monthly: [
        { type: "Regular", price: 6000, registrationFee: 3000 },
        { type: "Female", price: 5000, registrationNote: "No registration fee" },
        { type: "Couple", price: 10000, registrationNote: "No registration fee" },
      ],
      packages: [
        { duration: "3 Months", price: 16000 },
        { duration: "6 Months", price: 30000 },
      ],
      notes: [
        "PKR 3,000 registration charges apply for Regular membership.",
        "Registration charges 100% OFF for Females & Couples.",
      ],
    },
  },
];
