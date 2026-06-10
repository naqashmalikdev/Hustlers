"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "@/components/ui/animated-icons";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import type { Product, ProductCategory } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type FilterOption = "all" | ProductCategory;

const filters: { label: string; value: FilterOption }[] = [
  { label: "All",         value: "all" },
  { label: "Protein",     value: "protein" },
  { label: "Pre-Workout", value: "pre-workout" },
  { label: "Recovery",    value: "recovery" },
  { label: "Vitamins",    value: "vitamins" },
  { label: "Apparel",     value: "apparel" },
  { label: "Equipment",   value: "equipment" },
];

const sortOptions = [
  { label: "Newest",       value: "newest" },
  { label: "Price: Low",   value: "price_asc" },
  { label: "Price: High",  value: "price_desc" },
];

interface Props { products: Product[] }

export function ShopClient({ products }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    let list = [...products];

    if (activeFilter !== "all") {
      list = list.filter((p) => p.category === activeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }

    if (sort === "price_asc")  list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, activeFilter, sort, search]);

  // Only show filter tabs that have products
  const availableCategories = useMemo(
    () => new Set(products.map((p) => p.category)),
    [products]
  );

  return (
    <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
      {/* Controls row */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-10">
        {/* Filter tabs */}
        <div
          className="flex flex-wrap gap-0 border border-border shrink-0"
          role="group"
          aria-label="Filter by category"
        >
          {filters
            .filter((f) => f.value === "all" || availableCategories.has(f.value as ProductCategory))
            .map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                aria-pressed={activeFilter === value}
                className={cn(
                  "px-4 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-200 cursor-pointer border-r border-border last:border-r-0",
                  activeFilter === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                {label}
              </button>
            ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="relative shrink-0">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card border border-border text-foreground placeholder:text-muted-foreground/50 text-xs pl-9 pr-4 py-2.5 w-52 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-card border border-border text-muted-foreground text-[10px] tracking-[0.15em] uppercase px-3 py-2.5 focus:outline-none focus:border-primary transition-colors cursor-pointer"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="h-px bg-border mb-8" />
      <p
        className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-8"
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        {visible.length} Product{visible.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="py-32 text-center">
          <p
            className="text-muted-foreground/40 uppercase tracking-widest"
            style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2rem" }}
          >
            No Products Found
          </p>
          <p className="text-muted-foreground text-xs mt-2">Try a different filter or search term.</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border"
          role="list"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                role="listitem"
                className="bg-card flex"
              >
                <ShopProductCard product={product} className="w-full" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
