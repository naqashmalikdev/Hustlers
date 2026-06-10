export type SupplementCategory = "protein" | "pre-workout" | "recovery" | "vitamins";

export interface Supplement {
  id: string;
  name: string;
  brand: string;
  category: SupplementCategory;
  price: number;
  weight: string;
  flavors: string[];
  imageSrc: string;
  rating: number;
  inStock: boolean;
}

export const supplements: Supplement[] = [
  {
    id: "supp-1",
    name: "Whey Isolate Pro",
    brand: "HUSTLERS Nutrition",
    category: "protein",
    price: 8500,
    weight: "2kg",
    flavors: ["Chocolate Fudge", "Vanilla Cream", "Strawberry", "Unflavoured"],
    imageSrc: "https://images.unsplash.com/photo-1693996045300-521e9d08cabc?w=400&h=400&fit=crop&q=80&auto=format",
    rating: 5,
    inStock: true,
  },
  {
    id: "supp-2",
    name: "Mass Builder XL",
    brand: "HUSTLERS Nutrition",
    category: "protein",
    price: 11500,
    weight: "3kg",
    flavors: ["Double Chocolate", "Banana Caramel", "Cookies & Cream"],
    imageSrc: "https://images.unsplash.com/photo-1693996045346-d0a9b9470909?w=400&h=400&fit=crop&q=80&auto=format",
    rating: 4,
    inStock: true,
  },
  {
    id: "supp-3",
    name: "Inferno Pre-Workout",
    brand: "HUSTLERS Nutrition",
    category: "pre-workout",
    price: 4200,
    weight: "300g",
    flavors: ["Watermelon Blast", "Blue Raspberry", "Cherry Bomb"],
    imageSrc: "https://images.unsplash.com/photo-1709976142411-26dfc86b13fc?w=400&h=400&fit=crop&q=80&auto=format",
    rating: 5,
    inStock: true,
  },
  {
    id: "supp-4",
    name: "Stim-Free Pump",
    brand: "HUSTLERS Nutrition",
    category: "pre-workout",
    price: 3800,
    weight: "280g",
    flavors: ["Tropical Punch", "Peach Mango"],
    imageSrc: "https://images.unsplash.com/photo-1704650311298-4d6915d34c64?w=400&h=400&fit=crop&q=80&auto=format",
    rating: 4,
    inStock: false,
  },
  {
    id: "supp-5",
    name: "Creatine Monohydrate",
    brand: "HUSTLERS Nutrition",
    category: "recovery",
    price: 2200,
    weight: "500g",
    flavors: ["Unflavoured"],
    imageSrc: "https://images.unsplash.com/photo-1709976142749-4a83767c4228?w=400&h=400&fit=crop&q=80&auto=format",
    rating: 5,
    inStock: true,
  },
  {
    id: "supp-6",
    name: "Recovery BCAA Complex",
    brand: "HUSTLERS Nutrition",
    category: "recovery",
    price: 3500,
    weight: "400g",
    flavors: ["Grape Ice", "Lemon Lime", "Mixed Berry", "Passionfruit"],
    imageSrc: "https://images.unsplash.com/photo-1693996045838-980674653385?w=400&h=400&fit=crop&q=80&auto=format",
    rating: 4,
    inStock: true,
  },
  {
    id: "supp-7",
    name: "Omega-3 Fish Oil",
    brand: "HUSTLERS Nutrition",
    category: "vitamins",
    price: 1800,
    weight: "120 softgels",
    flavors: [],
    imageSrc: "https://images.unsplash.com/photo-1670850757896-e1b6c3e311ea?w=400&h=400&fit=crop&q=80&auto=format",
    rating: 4,
    inStock: true,
  },
  {
    id: "supp-8",
    name: "Multivitamin Elite",
    brand: "HUSTLERS Nutrition",
    category: "vitamins",
    price: 2600,
    weight: "90 tablets",
    flavors: [],
    imageSrc: "https://images.unsplash.com/photo-1624362772755-4d5843e67047?w=400&h=400&fit=crop&q=80&auto=format",
    rating: 5,
    inStock: true,
  },
];
