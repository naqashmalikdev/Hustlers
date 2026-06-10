"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "@/components/ui/animated-icons";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/providers/CartProvider";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

export function CartDrawer() {
  const { items, isOpen, itemCount, subtotal, removeItem, updateQty, closeCart } = useCart();
  const { lenis } = useSmoothScroll();

  // Lock background scroll + hide the page scrollbar while the cart is open.
  useEffect(() => {
    if (!isOpen) return;
    lockScroll();
    lenis?.stop();
    return () => {
      unlockScroll();
      lenis?.start();
    };
  }, [isOpen, lenis]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[min(420px,100vw)] bg-card text-foreground border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} className="text-brand" />
                <span
                  className="text-foreground uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.2rem" }}
                >
                  Cart
                </span>
                {itemCount > 0 && (
                  <span className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X size={14} />
              </button>
            </div>

            {/* Items */}
            <div
              data-lenis-prevent
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-hide"
            >
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                  <ShoppingBag size={48} className="text-muted-foreground/30" />
                  <p
                    className="text-muted-foreground uppercase tracking-widest text-center"
                    style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.4rem" }}
                  >
                    Your Cart is Empty
                  </p>
                  <p className="text-muted-foreground/60 text-xs text-center">
                    Add some supplements to fuel your training.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-2 px-6 py-3 bg-primary text-primary-foreground text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    Browse Shop
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((item) => {
                    const key = `${item.product.id}-${item.flavor}-${item.size}`;
                    return (
                      <motion.li
                        key={key}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4 p-5 hover:bg-secondary/40 transition-colors"
                      >
                        {/* Image (with fallback) */}
                        <Link
                          href={`/shop/${item.product.slug}`}
                          onClick={closeCart}
                          className="relative w-20 h-20 shrink-0 bg-secondary border border-border overflow-hidden flex items-center justify-center"
                        >
                          {item.product.images[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <ShoppingBag size={22} className="text-muted-foreground/30" />
                          )}
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p
                                className="text-muted-foreground text-[9px] tracking-[0.2em] uppercase mb-0.5"
                                style={{ fontFamily: "var(--font-oswald)" }}
                              >
                                {item.product.brand}
                              </p>
                              <Link href={`/shop/${item.product.slug}`} onClick={closeCart}>
                                <p
                                  className="text-foreground uppercase leading-tight truncate hover:text-primary transition-colors"
                                  style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.05rem", letterSpacing: "0.02em" }}
                                >
                                  {item.product.name}
                                </p>
                              </Link>
                              {item.flavor && (
                                <p className="text-muted-foreground/70 text-[9px] tracking-wide mt-0.5">
                                  {item.flavor}
                                </p>
                              )}
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => removeItem(item.product.id, item.flavor, item.size)}
                              className="shrink-0 -mr-1 -mt-1 p-1 text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer"
                              aria-label={`Remove ${item.product.name}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Qty + price row */}
                          <div className="mt-3 flex items-end justify-between gap-2">
                            {/* Qty controls */}
                            <div className="flex items-center border border-border">
                              <button
                                onClick={() => updateQty(item.product.id, item.quantity - 1, item.flavor, item.size)}
                                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={10} />
                              </button>
                              <span
                                className="w-7 text-center text-foreground text-xs tabular-nums"
                                style={{ fontFamily: "var(--font-oswald)" }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQty(item.product.id, item.quantity + 1, item.flavor, item.size)}
                                className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <span
                                className="block text-foreground font-black leading-none"
                                style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.15rem" }}
                              >
                                PKR {(item.product.price * item.quantity).toLocaleString()}
                              </span>
                              {item.quantity > 1 && (
                                <span className="block text-muted-foreground/60 text-[9px] tracking-wide mt-0.5">
                                  PKR {item.product.price.toLocaleString()} each
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 shrink-0 space-y-4">
                {/* Subtotal */}
                <div className="flex items-baseline justify-between">
                  <span
                    className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    Subtotal · {itemCount} item{itemCount !== 1 ? "s" : ""}
                  </span>
                  <span
                    className="text-foreground font-black"
                    style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.5rem" }}
                  >
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>

                <p className="text-muted-foreground/60 text-[10px]">
                  Shipping & discounts calculated at checkout.
                </p>

                {/* CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="group flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
                  style={{ fontFamily: "var(--font-oswald)", fontSize: "0.75rem" }}
                >
                  Checkout
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="block text-center text-[10px] text-muted-foreground hover:text-foreground transition-colors tracking-widest uppercase underline underline-offset-2"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
