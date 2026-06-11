import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ShopClient } from "./ShopClient";
import type { Product } from "@/lib/supabase/types";

export const metadata = {
  title: "Gym Supplements Lahore — Protein, Pre-Workout & More",
  description:
    "Shop premium gym supplements in Lahore at Hustlers Gym — protein, pre-workout, recovery and vitamins. Available in-store at Johar Town or order online.",
  keywords: [
    "gym supplements Lahore",
    "protein powder Lahore",
    "pre-workout Lahore",
    "buy supplements Lahore",
    "Hustlers gym supplements",
  ],
  alternates: {
    canonical: "https://hustlersgym.pk/shop",
  },
  openGraph: {
    title: "Gym Supplements Lahore — Hustlers Gym Shop",
    description:
      "Premium protein, pre-workout, recovery & vitamins — available at Hustlers Gym, Johar Town, Lahore.",
    url: "https://hustlersgym.pk/shop",
  },
};

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <>
      {/* ── PAGE HERO ── */}
      <section className="relative bg-background border-b border-border overflow-hidden">
        {/* Red glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 10% 50%, color-mix(in srgb, var(--foreground) 5%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-14">
          <p
            className="text-primary text-[11px] tracking-[0.35em] uppercase font-semibold mb-4"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            In-House Store
          </p>
          <h1
            className="text-foreground uppercase leading-none"
            style={{
              fontFamily: "var(--font-bebas-neue)",
              fontSize: "clamp(56px, 10vw, 120px)",
              letterSpacing: "-0.01em",
            }}
          >
            Supple<span className="text-primary">ments</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-4 max-w-md leading-relaxed">
            Premium nutrition to fuel your training — available online and at all HUSTLERS branches.
          </p>
        </div>
      </section>

      {/* ── PRODUCT GRID (client for filters) ── */}
      <Suspense fallback={<ShopSkeleton />}>
        <ShopClient products={products} />
      </Suspense>
    </>
  );
}

function ShopSkeleton() {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card aspect-[3/4] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
