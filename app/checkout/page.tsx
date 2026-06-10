"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Tag, X, ChevronDown, ChevronUp, Lock } from "@/components/ui/animated-icons";
import { useCart } from "@/providers/CartProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { checkoutSchema, type CheckoutForm, PROVINCES } from "@/lib/validations/checkout";

interface CouponResult {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  discount: number;
}

const SHIPPING = 250;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });
  const province = watch("province");

  // Pre-fill form for logged-in users
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setValue("email", user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles").select("full_name, phone").eq("id", user.id).single();
      if (profile?.full_name) setValue("full_name", profile.full_name);
      if (profile?.phone) setValue("phone", profile.phone);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) router.push("/shop");
  }, [items, router]);

  const discountAmount = coupon?.discount ?? 0;
  const total = subtotal + SHIPPING - discountAmount;

  async function applyCode() {
    if (!couponCode.trim()) return;
    setCouponError(null);
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) { setCouponError(data.error ?? "Invalid coupon"); }
      else { setCoupon(data); }
    } catch {
      setCouponError("Failed to validate coupon.");
    } finally {
      setCouponLoading(false);
    }
  }

  async function onSubmit(form: CheckoutForm) {
    if (items.length === 0) return;
    setOrderError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form,
          items: items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
            unit_price: i.product.price,
            flavor: i.flavor,
            size: i.size,
          })),
          subtotal,
          discount_amount: discountAmount,
          shipping_amount: SHIPPING,
          total,
          coupon_id: coupon?.id ?? null,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setOrderError(data.error ?? "Something went wrong."); return; }

      clear();
      router.push(`/checkout/success?order=${data.order_number}`);
    } catch {
      setOrderError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) return null;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-16">
      {/* Page heading */}
      <div className="mb-10 lg:mb-12">
        <p
          className="text-primary text-[11px] tracking-[0.35em] uppercase font-semibold mb-3"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Almost There
        </p>
        <h1
          className="text-foreground uppercase leading-none"
          style={{
            fontFamily: "var(--font-bebas-neue)",
            fontSize: "clamp(40px, 7vw, 72px)",
            letterSpacing: "-0.01em",
          }}
        >
          Check<span className="text-primary">out</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">

        {/* ── LEFT: Form ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Contact */}
          <div>
            <SectionTitle>Contact Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" error={errors.full_name?.message}>
                <input {...register("full_name")} placeholder="Muhammad Ali"
                  className={inputCls(!!errors.full_name)} />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input {...register("email")} type="email" placeholder="you@example.com"
                  className={inputCls(!!errors.email)} />
              </Field>
              <Field label="Phone" error={errors.phone?.message} className="sm:col-span-2">
                <input {...register("phone")} placeholder="+92 300 0000000"
                  className={inputCls(!!errors.phone)} />
              </Field>
            </div>
          </div>

          {/* Shipping */}
          <div>
            <SectionTitle>Shipping Address</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Address Line 1" error={errors.address_line1?.message} className="sm:col-span-2">
                <input {...register("address_line1")} placeholder="Street address, building no."
                  className={inputCls(!!errors.address_line1)} />
              </Field>
              <Field label="Address Line 2 (optional)" className="sm:col-span-2">
                <input {...register("address_line2")} placeholder="Floor, apartment, landmark"
                  className={inputCls(false)} />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <input {...register("city")} placeholder="Lahore"
                  className={inputCls(!!errors.city)} />
              </Field>
              <Field label="Province" error={errors.province?.message}>
                <input type="hidden" {...register("province")} />
                <Select
                  value={province || undefined}
                  onValueChange={(val) => setValue("province", val, { shouldValidate: true })}
                >
                  <SelectTrigger
                    aria-invalid={!!errors.province}
                    className={cn(
                      // match the text inputs exactly: same padding, auto height,
                      // and override shadcn's fixed default height (data-[size]:h-8)
                      "w-full h-auto data-[size=default]:h-auto rounded-none px-4 py-3 text-sm bg-card text-foreground cursor-pointer transition-colors",
                      "data-placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:outline-none",
                      errors.province ? "border-primary focus-visible:border-primary" : "border-border focus-visible:border-primary",
                    )}
                  >
                    <SelectValue placeholder="Select province…" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-border rounded-none">
                    {PROVINCES.map((p) => (
                      <SelectItem
                        key={p}
                        value={p}
                        className="rounded-none cursor-pointer focus:bg-primary/10 focus:text-primary text-sm"
                      >
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          {/* Order notes */}
          <div>
            <SectionTitle>Order Notes (optional)</SectionTitle>
            <Field label="Notes">
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Special delivery instructions…"
                className={inputCls(false) + " resize-none"}
              />
            </Field>
          </div>

          {/* Payment */}
          <div>
            <SectionTitle>Payment</SectionTitle>
            <div className="border border-primary/40 bg-primary/5 p-5 flex items-center gap-4">
              <div className="w-4 h-4 border-2 border-primary flex items-center justify-center shrink-0">
                <div className="w-2 h-2 bg-primary" />
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">Cash on Delivery</p>
                <p className="text-muted-foreground text-xs mt-0.5">Pay when your order arrives.</p>
              </div>
            </div>
          </div>

          {orderError && (
            <p className="text-primary bg-primary/10 border border-primary/20 px-4 py-3 text-sm">
              {orderError}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-primary text-primary-foreground font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{ fontFamily: "var(--font-oswald)", fontSize: "0.8rem" }}
          >
            {submitting
              ? <><Loader2 size={15} className="animate-spin" /> Placing Order…</>
              : <><Lock size={13} /> Place Order — PKR {total.toLocaleString()}</>
            }
          </motion.button>
        </form>

        {/* ── RIGHT: Summary ── */}
        <div className="lg:sticky lg:top-8 space-y-6 h-fit">
          {/* Mobile toggle */}
          <button
            className="lg:hidden w-full flex items-center justify-between border border-border bg-card p-4 cursor-pointer"
            onClick={() => setSummaryOpen((v) => !v)}
          >
            <span className="text-foreground text-sm" style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.1em" }}>
              Order Summary ({items.length} item{items.length !== 1 ? "s" : ""})
            </span>
            {summaryOpen ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
          </button>

          <div className={`space-y-6 ${summaryOpen ? "block" : "hidden lg:block"}`}>
            {/* Items */}
            <div className="border border-border bg-card divide-y divide-border">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.flavor}`} className="flex gap-3 p-4">
                  <div className="relative w-16 h-16 shrink-0 bg-secondary overflow-hidden">
                    {item.product.images[0] && (
                      <Image src={item.product.images[0]} alt={item.product.name}
                        fill sizes="64px" className="object-cover" />
                    )}
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-xs truncate" style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "0.95rem", letterSpacing: "0.03em" }}>
                      {item.product.name}
                    </p>
                    {item.flavor && <p className="text-muted-foreground text-[10px]">{item.flavor}</p>}
                  </div>
                  <span className="text-foreground text-xs shrink-0" style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "0.9rem" }}>
                    PKR {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div>
              <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
                Coupon Code
              </p>
              {coupon ? (
                <div className="flex items-center justify-between border border-primary/40 bg-primary/5 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag size={12} className="text-brand" />
                    <span className="text-primary text-xs font-bold" style={{ fontFamily: "var(--font-oswald)" }}>
                      {coupon.code}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      -{coupon.type === "percentage" ? `${coupon.value}%` : `PKR ${coupon.value}`}
                    </span>
                  </div>
                  <button onClick={() => { setCoupon(null); setCouponCode(""); }}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCode())}
                    placeholder="WELCOME10"
                    className="flex-1 bg-card border border-border text-foreground placeholder:text-muted-foreground/40 px-3 py-2.5 text-xs tracking-widest focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={applyCode}
                    disabled={couponLoading}
                    className="px-4 py-2.5 bg-secondary text-muted-foreground text-[10px] tracking-[0.15em] uppercase hover:bg-secondary/70 hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    {couponLoading ? <Loader2 size={12} className="animate-spin" /> : "Apply"}
                  </button>
                </div>
              )}
              <AnimatePresence>
                {couponError && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-primary text-[10px] mt-2">
                    {couponError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Totals */}
            <div className="border border-border bg-card p-5 space-y-3">
              {[
                { label: "Subtotal", value: `PKR ${subtotal.toLocaleString()}` },
                { label: "Shipping", value: `PKR ${SHIPPING.toLocaleString()}` },
                ...(discountAmount > 0 ? [{ label: `Discount (${coupon!.code})`, value: `-PKR ${discountAmount.toLocaleString()}`, red: true }] : []),
              ].map(({ label, value, red }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[10px] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>{label}</span>
                  <span className={`text-xs ${red ? "text-primary" : "text-foreground"}`} style={{ fontFamily: "var(--font-oswald)" }}>{value}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-foreground text-[10px] tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "var(--font-oswald)" }}>Total</span>
                <span className="text-foreground font-black" style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.5rem" }}>
                  PKR {total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full bg-card border ${hasError ? "border-primary" : "border-border"} text-foreground placeholder:text-muted-foreground/40 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors`;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-foreground uppercase tracking-widest mb-5 pb-3 border-b border-border"
      style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.4rem", letterSpacing: "0.08em" }}
    >
      {children}
    </h2>
  );
}

function Field({ label, error, children, className = "" }: {
  label: string; error?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-primary text-[10px] mt-1.5">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
