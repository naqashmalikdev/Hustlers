"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Minus, Plus, ArrowLeft, Package, Star } from "@/components/ui/animated-icons";
import { useCart } from "@/providers/CartProvider";
import { ShopProductCard } from "@/components/ui/ShopProductCard";
import { ProductReviews } from "@/components/ui/ProductReviews";
import type { Product } from "@/lib/supabase/types";

interface Props {
  product: Product;
  related: Product[];
  slug: string;
  isLoggedIn: boolean;
}

export function ProductDetailClient({ product, related, slug, isLoggedIn }: Props) {
  const { addItem } = useCart();
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(
    product.flavors[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const inStock = product.stock_quantity > 0;
  const discount = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null;

  function handleAdd() {
    if (!inStock) return;
    addItem(product, quantity, selectedFlavor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Back link */}
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 pt-8 pb-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-[10px] tracking-[0.2em] uppercase transition-colors"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          <ArrowLeft size={12} />
          Back to Shop
        </Link>
      </div>

      {/* Main product section */}
      <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── LEFT: Images ── */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square bg-secondary overflow-hidden border border-border">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  {product.images[activeImage] && (
                    <Image
                      src={product.images[activeImage]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Out of stock */}
              {!inStock && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <span
                    className="px-4 py-2 bg-foreground text-background text-[11px] font-bold tracking-[0.25em] uppercase"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Discount badge */}
              {discount && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5"
                  style={{ fontFamily: "var(--font-oswald)", fontSize: "0.8rem", fontWeight: 700 }}>
                  -{discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 shrink-0 border-2 overflow-hidden transition-colors cursor-pointer ${
                      activeImage === i ? "border-primary" : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="flex flex-col">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-primary text-[10px] tracking-[0.3em] uppercase font-semibold"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                {product.category.replace("-", " ")}
              </span>
              {product.weight && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span
                    className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    {product.weight}
                  </span>
                </>
              )}
            </div>

            {/* Brand */}
            <p
              className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase mb-2"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              {product.brand}
            </p>

            {/* Name */}
            <h1
              className="text-foreground uppercase leading-none mb-6"
              style={{
                fontFamily: "var(--font-bebas-neue)",
                fontSize: "clamp(40px, 5vw, 64px)",
                letterSpacing: "-0.01em",
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-border">
              <span
                className="text-foreground font-black"
                style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "clamp(32px, 4vw, 48px)" }}
              >
                PKR {product.price.toLocaleString()}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span
                  className="text-muted-foreground/60 line-through"
                  style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.4rem" }}
                >
                  PKR {product.compare_at_price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Flavor selector */}
            {product.flavors.length > 0 && (
              <div className="mb-6">
                <p
                  className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-3"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Flavor: <span className="text-foreground">{selectedFlavor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.flavors.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFlavor(f)}
                      className={`px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase border transition-colors cursor-pointer ${
                        selectedFlavor === f
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      }`}
                      style={{ fontFamily: "var(--font-oswald)" }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <p
                  className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-3"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Size: <span className="text-foreground">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-[9px] tracking-[0.15em] uppercase border transition-colors cursor-pointer ${
                        selectedSize === s
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      }`}
                      style={{ fontFamily: "var(--font-oswald)" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 mb-8">
              {/* Qty stepper */}
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  aria-label="Decrease"
                >
                  <Minus size={12} />
                </button>
                <span
                  className="w-10 text-center text-foreground text-sm"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(q + 1, product.stock_quantity || 99))}
                  className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  aria-label="Increase"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Add to cart */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                disabled={!inStock}
                className={`flex-1 h-11 flex items-center justify-center gap-2 font-bold tracking-[0.2em] uppercase text-[11px] transition-colors cursor-pointer ${
                  inStock
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-muted-foreground/50 cursor-not-allowed"
                }`}
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span key="added" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2">
                      <Check size={15} /> Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2">
                      <ShoppingCart size={15} />
                      {inStock ? "Add to Cart" : "Out of Stock"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 mb-8">
              <Package size={13} className={inStock ? "text-success" : "text-muted-foreground"} />
              <span
                className={`text-[10px] tracking-[0.15em] uppercase ${inStock ? "text-success" : "text-muted-foreground"}`}
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                {inStock
                  ? product.stock_quantity < 10
                    ? `Only ${product.stock_quantity} left in stock`
                    : "In Stock"
                  : "Out of Stock"}
              </span>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
              {[
                { label: "Category", value: product.category.replace("-", " ") },
                { label: "Brand", value: product.brand },
                ...(product.weight ? [{ label: "Weight", value: product.weight }] : []),
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-muted-foreground/60 text-[9px] tracking-[0.2em] uppercase mb-1"
                    style={{ fontFamily: "var(--font-oswald)" }}>{label}</p>
                  <p className="text-foreground text-xs capitalize">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-screen-2xl mx-auto px-6 lg:px-12 pb-20">
        <ProductReviews slug={slug} isLoggedIn={isLoggedIn} />
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-16">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p
                  className="text-primary text-[10px] tracking-[0.3em] uppercase mb-3"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  More in {product.category.replace("-", " ")}
                </p>
                <h2
                  className="text-foreground uppercase leading-none"
                  style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "clamp(32px, 5vw, 56px)" }}
                >
                  Related <span className="text-primary">Products</span>
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground text-[10px] tracking-[0.2em] uppercase transition-colors"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                View All <Star size={10} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
              {related.map((p) => (
                <div key={p.id} className="bg-card flex">
                  <ShopProductCard product={p} className="w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
