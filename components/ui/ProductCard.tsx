"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "@/components/ui/animated-icons";
import type { Supplement } from "@/data/supplements";
import { useCart } from "@/providers/CartProvider";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  supplement: Supplement;
  className?: string;
}

export function ProductCard({ supplement, className }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  function handleAdd() {
    if (!supplement.inStock) return;
    // Build a minimal Product shape from the static supplement data
    addItem(
      {
        id: supplement.id,
        name: supplement.name,
        brand: supplement.brand,
        description: null,
        category: supplement.category as import("@/lib/supabase/types").ProductCategory,
        price: supplement.price,
        compare_at_price: null,
        weight: supplement.weight,
        images: [supplement.imageSrc],
        flavors: supplement.flavors,
        sizes: [],
        stock_quantity: supplement.inStock ? 99 : 0,
        is_active: true,
        slug: supplement.id,
        created_at: "",
        updated_at: "",
      },
      1,
      supplement.flavors[0] ?? null,
      null
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <motion.article
      className={cn(
        "group relative bg-card border border-border overflow-hidden cursor-pointer flex flex-col h-full",
        className
      )}
      whileHover="hover"
      initial="rest"
    >
      {/* top bar slide */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.75 bg-primary origin-left z-10"
        variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* ── IMAGE ── */}
      <div className="relative aspect-square bg-secondary overflow-hidden">
        <motion.div
          className="absolute inset-0"
          variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          suppressHydrationWarning
        >
          {supplement.imageSrc && (
            <Image
              src={supplement.imageSrc}
              alt={`${supplement.name} by ${supplement.brand}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover"
            />
          )}
        </motion.div>

        {/* Out of stock overlay */}
        {!supplement.inStock && (
          <div className="absolute inset-0 bg-background/75 flex items-center justify-center">
            <span
              className="px-3 py-1 bg-foreground text-background text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Out of Stock
            </span>
          </div>
        )}

        {/* Category — top left */}
        <div className="absolute top-0 left-0">
          <span
            className="inline-block px-2.5 py-1 bg-foreground text-background text-[9px] font-bold tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {supplement.category.replace("-", " ")}
          </span>
        </div>

        {/* Weight — bottom right */}
        <div className="absolute bottom-2 right-2">
          <span
            className="inline-block px-2 py-0.5 bg-background/80 text-foreground text-[9px] font-bold tracking-widest uppercase border border-border"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {supplement.weight}
          </span>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand */}
        <p
          className="text-muted-foreground text-[9px] tracking-[0.25em] uppercase font-semibold mb-1"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          {supplement.brand}
        </p>

        {/* Name */}
        <h3
          className="text-foreground uppercase leading-tight mb-3"
          style={{
            fontFamily: "var(--font-bebas-neue)",
            fontSize: "clamp(20px, 2.5vw, 24px)",
            letterSpacing: "0.02em",
          }}
        >
          {supplement.name}
        </h3>

        {/* Flavors — text list, no dots */}
        {supplement.flavors.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {supplement.flavors.slice(0, 3).map((f) => (
              <span
                key={f}
                className="text-[9px] text-muted-foreground border border-border px-1.5 py-0.5 tracking-wide"
              >
                {f}
              </span>
            ))}
            {supplement.flavors.length > 3 && (
              <span className="text-[9px] text-muted-foreground/50 px-1.5 py-0.5">
                +{supplement.flavors.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div>
            <p className="text-muted-foreground text-[9px] tracking-widest uppercase mb-0.5">Price</p>
            <span
              className="text-foreground font-black"
              style={{
                fontFamily: "var(--font-bebas-neue)",
                fontSize: "22px",
                letterSpacing: "0.02em",
              }}
            >
              PKR {supplement.price.toLocaleString()}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            disabled={!supplement.inStock}
            aria-label={`Add ${supplement.name} to cart`}
            className={cn(
              "w-10 h-10 flex items-center justify-center border transition-colors duration-200 cursor-pointer",
              supplement.inStock
                ? "border-primary text-brand hover:bg-primary hover:text-primary-foreground"
                : "border-border text-muted-foreground/30 cursor-not-allowed"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check size={15} />
                </motion.span>
              ) : (
                <motion.span
                  key="cart"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ShoppingCart size={15} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
