"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Check, Loader2 } from "@/components/ui/animated-icons";
import type { Json } from "@/lib/supabase/types";

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  pending:    { label: "Pending",    color: "var(--muted-foreground)"    },
  confirmed:  { label: "Confirmed",  color: "#3b82f6" },
  processing: { label: "Processing", color: "var(--warning)" },
  shipped:    { label: "Shipped",    color: "#8b5cf6" },
  delivered:  { label: "Delivered",  color: "var(--success)" },
  cancelled:  { label: "Cancelled",  color: "var(--primary)" },
  refunded:   { label: "Refunded",   color: "var(--muted-foreground)"    },
};

const STATUS_FLOW = ["pending", "confirmed", "processing", "shipped", "delivered"];

interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  total: number;
  payment_method: string;
  notes: string | null;
  created_at: string;
  guest_email: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  shipping_address: Json;
  order_items: {
    id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    flavor: string | null;
    size: string | null;
    products: { name: string; images: string[]; brand: string } | null;
  }[];
}

function shippingAddr(addr: Json): Record<string, string> {
  if (typeof addr === "object" && addr !== null && !Array.isArray(addr)) {
    return addr as Record<string, string>;
  }
  return {};
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(r => r.json())
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    if (!order || updating) return;
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrder(prev => prev ? { ...prev, status: updated.status } : prev);
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-card w-48" />
        <div className="h-64 bg-card border border-border" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-sm mb-4">Order not found.</p>
        <Link href="/admin/orders" className="text-primary text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const st = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
  const addr = shippingAddr(order.shipping_address);
  const flowIdx = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-muted-foreground text-[10px] tracking-widest uppercase mb-4 transition-colors"
          style={{ fontFamily: "var(--font-oswald)" }}>
          <ArrowLeft size={11} /> Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-5">
          <div>
            <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "var(--font-oswald)" }}>Order Detail</p>
            <h1 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2rem", letterSpacing: "0.04em" }} className="text-foreground">
              {order.order_number}
            </h1>
            <p className="text-muted-foreground text-[10px] mt-0.5">
              {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <span className="px-3 py-1 text-[10px] tracking-widest uppercase border font-bold self-start sm:self-auto"
            style={{ fontFamily: "var(--font-oswald)", color: st.color, borderColor: `${st.color}40`, background: `${st.color}10` }}>
            {st.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status progress (for non-cancelled/refunded) */}
          {order.status !== "cancelled" && order.status !== "refunded" && (
            <div className="bg-card border border-border p-5">
              <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-5" style={{ fontFamily: "var(--font-oswald)" }}>
                Order Progress
              </p>
              <div className="flex items-center gap-0">
                {STATUS_FLOW.map((s, i) => {
                  const done = i <= flowIdx;
                  const active = i === flowIdx;
                  const sst = STATUS_STYLES[s];
                  return (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-7 h-7 flex items-center justify-center border-2 transition-all ${done ? "border-primary" : "border-border"}`}
                          style={{ background: active ? "var(--primary)" : done ? "var(--secondary)" : "transparent" }}>
                          {done ? <Check size={12} className={active ? "text-primary-foreground" : "text-primary"} /> : null}
                        </div>
                        <p className="text-[9px] tracking-wider uppercase text-center"
                          style={{ fontFamily: "var(--font-oswald)", color: done ? sst.color : "var(--muted-foreground)" }}>
                          {sst.label}
                        </p>
                      </div>
                      {i < STATUS_FLOW.length - 1 && (
                        <div className="flex-1 h-px mx-2 mb-5" style={{ background: i < flowIdx ? "var(--primary)" : "var(--border)" }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-card border border-border">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <Package size={13} className="text-primary" />
              <span className="text-foreground text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
                Items ({order.order_items.length})
              </span>
            </div>
            <ul className="divide-y divide-border">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex items-start gap-4 px-5 py-4">
                  <div className="w-12 h-12 bg-background border border-border flex-shrink-0 overflow-hidden">
                    {item.products?.images?.[0] ? (
                      <img src={item.products.images[0]} alt={item.products.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={16} className="text-border" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-xs font-medium truncate">{item.products?.name ?? "Product"}</p>
                    <p className="text-muted-foreground text-[10px]">{item.products?.brand}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.flavor && <span className="text-[9px] text-muted-foreground border border-border px-1.5 py-0.5">{item.flavor}</span>}
                      {item.size && <span className="text-[9px] text-muted-foreground border border-border px-1.5 py-0.5">{item.size}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-foreground text-xs" style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "0.9rem", letterSpacing: "0.04em" }}>
                      PKR {item.subtotal.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-[10px]">× {item.quantity} @ {item.unit_price.toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Update Status */}
          <div className="bg-card border border-border p-5">
            <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_STYLES).map(([s, info]) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={order.status === s || updating}
                  className="px-4 py-2 text-[9px] tracking-widest uppercase border transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  style={{
                    fontFamily: "var(--font-oswald)",
                    borderColor: order.status === s ? info.color : "var(--border)",
                    color: order.status === s ? info.color : "var(--muted-foreground)",
                    background: order.status === s ? `${info.color}15` : "transparent",
                  }}
                >
                  {updating && order.status !== s ? null : null}
                  {order.status === s ? <Check size={10} /> : null}
                  {info.label}
                </button>
              ))}
            </div>
            {updating && (
              <p className="text-muted-foreground text-[10px] mt-3 flex items-center gap-1.5">
                <Loader2 size={10} className="animate-spin" /> Updating status…
              </p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Customer info */}
          <div className="bg-card border border-border p-5">
            <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-oswald)" }}>Customer</p>
            <div className="space-y-2">
              <p className="text-foreground text-sm">{order.guest_name ?? "Member"}</p>
              {order.guest_email && <p className="text-muted-foreground text-xs">{order.guest_email}</p>}
              {order.guest_phone && <p className="text-muted-foreground text-xs">{order.guest_phone}</p>}
              {!order.guest_email && !order.guest_phone && (
                <p className="text-muted-foreground text-xs">Registered member</p>
              )}
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-card border border-border p-5">
            <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-oswald)" }}>Ship To</p>
            <div className="space-y-0.5 text-xs text-muted-foreground">
              {addr.full_name && <p className="text-foreground">{addr.full_name}</p>}
              {addr.phone && <p>{addr.phone}</p>}
              {addr.address_line1 && <p>{addr.address_line1}</p>}
              {addr.address_line2 && <p>{addr.address_line2}</p>}
              {(addr.city || addr.province) && <p>{[addr.city, addr.province].filter(Boolean).join(", ")}</p>}
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-card border border-border p-5">
            <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-oswald)" }}>Summary</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>PKR {order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>− PKR {order.discount_amount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shipping_amount === 0 ? "Free" : `PKR ${order.shipping_amount.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-foreground border-t border-border pt-2 mt-2"
                style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.05rem", letterSpacing: "0.04em" }}>
                <span>Total</span>
                <span>PKR {order.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[10px] text-muted-foreground">
                <span className="text-muted-foreground">Payment:</span>{" "}
                <span className="uppercase tracking-wider" style={{ fontFamily: "var(--font-oswald)" }}>
                  {order.payment_method.replace(/_/g, " ")}
                </span>
              </p>
            </div>
            {order.notes && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground mb-1">Notes</p>
                <p className="text-muted-foreground text-xs">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
