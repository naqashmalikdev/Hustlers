"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Eye } from "@/components/ui/animated-icons";
import { useCart } from "@/providers/CartProvider";
import type { Product } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  className?: string;
}

export function ShopProductCard({ product, className }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const inStock = product.stock_quantity > 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!inStock) return;
    addItem(product, 1, product.flavors[0] ?? null, product.sizes[0] ?? null);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  const discount = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null;

  return (
    <motion.article
      className={cn(
        "group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full transition-all duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-card)]",
        className
      )}
      whileHover="hover"
      initial="rest"
    >
      {/* Red top bar on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5 bg-primary origin-left z-10"
        variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* IMAGE */}
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-square bg-secondary overflow-hidden">
          <motion.div
            className="absolute inset-0"
            variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            )}
          </motion.div>

          {/* Out of stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-background/75 flex items-center justify-center">
              <span
                className="px-3 py-1 bg-foreground text-background text-[10px] font-bold tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                Out of Stock
              </span>
            </div>
          )}

          {/* Discount badge */}
          {discount && (
            <div
              className="absolute top-2.5 right-2.5 bg-primary text-primary-foreground px-2.5 py-1 text-[10px] font-bold glow-brand"
              style={{ fontFamily: "var(--font-condensed)" }}
            >
              -{discount}%
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-2.5 left-2.5">
            <span
              className="inline-block bg-black/55 text-white px-2.5 py-1 text-[9px] font-bold tracking-[0.2em] uppercase backdrop-blur-md"
              style={{ fontFamily: "var(--font-condensed)" }}
            >
              {product.category.replace("-", " ")}
            </span>
          </div>

          {/* Weight badge */}
          {product.weight && (
            <div className="absolute bottom-2 right-2">
              <span
                className="inline-block px-2 py-0.5 bg-background/80 text-foreground text-[9px] font-bold tracking-widest uppercase border border-border"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                {product.weight}
              </span>
            </div>
          )}

          {/* View detail on hover */}
          <motion.div
            className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 py-2 bg-background/80 backdrop-blur-sm"
            variants={{ rest: { opacity: 0, y: 8 }, hover: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.2 }}
          >
            <Eye size={11} className="text-foreground" />
            <span
              className="text-foreground text-[9px] tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              View Details
            </span>
          </motion.div>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        <p
          className="text-muted-foreground text-[9px] tracking-[0.25em] uppercase font-semibold mb-1"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          {product.brand}
        </p>

        <Link href={`/shop/${product.slug}`}>
          <h3
            className="text-foreground uppercase leading-tight mb-3 hover:text-primary transition-colors"
            style={{
              fontFamily: "var(--font-bebas-neue)",
              fontSize: "clamp(18px, 2.2vw, 22px)",
              letterSpacing: "0.02em",
            }}
          >
            {product.name}
          </h3>
        </Link>

        {product.flavors.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.flavors.slice(0, 3).map((f) => (
              <span
                key={f}
                className="text-[9px] text-muted-foreground border border-border px-1.5 py-0.5 tracking-wide"
              >
                {f}
              </span>
            ))}
            {product.flavors.length > 3 && (
              <span className="text-[9px] text-muted-foreground/50 px-1.5 py-0.5">
                +{product.flavors.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div>
            <p
              className="text-muted-foreground text-[9px] tracking-widest uppercase mb-0.5"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Price
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className="text-foreground font-black"
                style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "22px", letterSpacing: "0.02em" }}
              >
                PKR {product.price.toLocaleString()}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span
                  className="text-muted-foreground line-through"
                  style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "14px" }}
                >
                  {product.compare_at_price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            disabled={!inStock}
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              "w-11 h-11 flex items-center justify-center border transition-all duration-200 cursor-pointer",
              inStock
                ? "border-primary text-brand hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-[var(--shadow-brand)]"
                : "border-border text-muted-foreground/30 cursor-not-allowed"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
                  <Check size={15} />
                </motion.span>
              ) : (
                <motion.span key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
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
