"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/animated-icons";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/supabase/types";

type FilterOption = "all" | "protein" | "pre-workout" | "recovery" | "vitamins";

const filters: { label: string; value: FilterOption }[] = [
  { label: "All",         value: "all" },
  { label: "Protein",     value: "protein" },
  { label: "Pre-Workout", value: "pre-workout" },
  { label: "Recovery",    value: "recovery" },
  { label: "Vitamins",    value: "vitamins" },
];

export function Supplements() {
  const [active, setActive] = useState<FilterOption>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = active === "all"
    ? products
    : products.filter(p => p.category === active);

  const countFor = (value: FilterOption) =>
    value === "all" ? products.length : products.filter(p => p.category === value).length;

  return (
    <section id="supplements" className="border-t border-border" aria-label="Supplement Store">
      {/* Header */}
      <div className="max-w-screen-2xl mx-auto px-6 pt-24">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="chip">
            <span className="inline-block h-1.5 w-1.5 bg-primary" />
            In-House Store
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            [ {String(products.length).padStart(2, "0")} / SKUS ]
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pt-10 pb-12 items-end">
          <h2
            className="lg:col-span-7 min-w-0 text-foreground uppercase leading-[0.86] tracking-[-0.03em]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(40px, 6.5vw, 96px)" }}
          >
            Supple<span style={{ color: "transparent", WebkitTextStroke: "1.5px var(--primary)" }}>ments</span>
          </h2>
          <p className="lg:col-span-5 text-muted-foreground text-[15px] mt-1 leading-relaxed lg:pb-3">
            Premium nutrition to fuel your training — protein, pre-workout, recovery and daily vitamins, available in-house at Hustlers Gym, Johar Town.
          </p>
        </div>
      </div>

      {/* Body: vertical filter rail + grid */}
      <div className="max-w-screen-2xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ── FILTER RAIL ── */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24">
              <p
                className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase mb-3"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                Categories
              </p>
              <div className="flex flex-col" role="group" aria-label="Filter by category">
                {filters.map(({ label, value }) => {
                  const isActive = active === value;
                  return (
                    <button
                      key={value}
                      onClick={() => setActive(value)}
                      aria-pressed={isActive}
                      className={cn(
                        "group flex items-center justify-between gap-3 px-4 py-3.5 border-b border-border text-left transition-colors duration-200 cursor-pointer",
                        isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            "inline-block h-3 w-px transition-all duration-200",
                            isActive ? "bg-primary-foreground h-4" : "bg-border group-hover:bg-foreground"
                          )}
                        />
                        <span className="text-sm font-semibold uppercase tracking-wide">{label}</span>
                      </span>
                      <span className={cn("font-mono text-[11px]", isActive ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {String(countFor(value)).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>

              <Link
                href="/shop"
                className="group mt-6 flex items-center justify-between gap-3 bg-primary text-primary-foreground px-4 py-3.5 text-[11px] font-bold tracking-[0.2em] uppercase hover:brightness-110 transition-all cursor-pointer"
                style={{ fontFamily: "var(--font-condensed)" }}
              >
                View All Products
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </aside>

          {/* ── PRODUCT GRID ── */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-16 text-sm">No products in this category yet.</p>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                role="list" aria-label="Supplement products">
                <AnimatePresence mode="popLayout">
                  {filtered.slice(0, 6).map(product => (
                    <motion.div key={product.id} layout
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.22, ease: "easeOut" }}
                      role="listitem" className="flex">
                      <ShopProductCard product={product} className="w-full" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
