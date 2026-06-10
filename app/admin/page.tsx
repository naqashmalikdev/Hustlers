"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag, Package, TrendingUp, Clock,
  AlertTriangle, ArrowRight,
} from "@/components/ui/animated-icons";

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  pending:    { label: "Pending",    color: "var(--muted-foreground)"    },
  confirmed:  { label: "Confirmed",  color: "#3b82f6" },
  processing: { label: "Processing", color: "var(--warning)" },
  shipped:    { label: "Shipped",    color: "#8b5cf6" },
  delivered:  { label: "Delivered",  color: "var(--success)" },
  cancelled:  { label: "Cancelled",  color: "var(--primary)" },
  refunded:   { label: "Refunded",   color: "var(--muted-foreground)"    },
};

interface StatsData {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  monthRevenue: number;
  lowStock: { id: string; name: string; stock_quantity: number; category: string }[];
  recentOrders: { id: string; order_number: string; status: string; total: number; created_at: string; guest_email: string | null }[];
  statusCounts: Record<string, number>;
}

function StatCard({ label, value, sub, icon: Icon, accent }: {
  label: string; value: string | number; sub?: string; icon: React.ElementType; accent?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>{label}</p>
        <Icon size={15} className={accent ? "text-primary" : "text-muted-foreground"} />
      </div>
      <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2rem", letterSpacing: "0.02em" }} className="text-foreground">{value}</p>
      {sub && <p className="text-muted-foreground text-[10px] mt-1">{sub}</p>}
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!data) return <p className="text-muted-foreground text-sm">Failed to load stats.</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "var(--font-oswald)" }}>
          Admin Panel
        </p>
        <h1 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2.4rem", letterSpacing: "0.02em" }} className="text-foreground uppercase">
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={ShoppingBag} label="Total Orders"    value={data.totalOrders}                              sub={`${data.todayOrders} today`} />
        <StatCard icon={TrendingUp}  label="Total Revenue"   value={`PKR ${(data.totalRevenue/1000).toFixed(0)}K`} sub="all time" accent />
        <StatCard icon={TrendingUp}  label="This Month"      value={`PKR ${(data.monthRevenue/1000).toFixed(0)}K`} sub="current month" />
        <StatCard icon={Package}     label="Low Stock Items"  value={data.lowStock.length}                          sub="< 10 units" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-card border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-primary" />
              <span className="text-foreground text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>Recent Orders</span>
            </div>
            <Link href="/admin/orders" className="text-muted-foreground hover:text-muted-foreground text-[10px] tracking-widest uppercase flex items-center gap-1 transition-colors"
              style={{ fontFamily: "var(--font-oswald)" }}>
              View All <ArrowRight size={10} />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {data.recentOrders.map((order) => {
              const st = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
              return (
                <li key={order.id}>
                  <Link href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-card transition-colors group">
                    <div>
                      <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "0.95rem", letterSpacing: "0.06em" }} className="text-foreground">
                        {order.order_number}
                      </p>
                      <p className="text-muted-foreground text-[10px]">
                        {order.guest_email ?? "Member"} &middot; {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-0.5 text-[9px] tracking-widest uppercase border font-bold"
                        style={{ fontFamily: "var(--font-oswald)", color: st.color, borderColor: `${st.color}40` }}>
                        {st.label}
                      </span>
                      <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "0.95rem" }} className="text-foreground">
                        PKR {order.total.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Low stock */}
        <div className="bg-card border border-border">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <AlertTriangle size={13} className="text-warning" />
            <span className="text-foreground text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>Low Stock</span>
          </div>
          {data.lowStock.length === 0 ? (
            <p className="px-5 py-8 text-muted-foreground text-sm text-center">All products are well-stocked.</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.lowStock.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/products?edit=${p.id}`}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-card transition-colors">
                    <div>
                      <p className="text-foreground text-xs truncate max-w-[140px]">{p.name}</p>
                      <p className="text-muted-foreground text-[10px] capitalize">{p.category.replace("-", " ")}</p>
                    </div>
                    <span className={`text-[11px] font-bold tabular-nums ${p.stock_quantity === 0 ? "text-primary" : "text-warning"}`}
                      style={{ fontFamily: "var(--font-oswald)" }}>
                      {p.stock_quantity === 0 ? "OOS" : p.stock_quantity}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Order status breakdown */}
      <div className="bg-card border border-border p-5">
        <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-5" style={{ fontFamily: "var(--font-oswald)" }}>Order Status Breakdown</p>
        <div className="flex flex-wrap gap-4">
          {Object.entries(data.statusCounts).map(([status, count]) => {
            const st = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
            const pct = data.totalOrders ? Math.round((count / data.totalOrders) * 100) : 0;
            return (
              <div key={status} className="flex-1 min-w-[100px]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] uppercase tracking-widest" style={{ fontFamily: "var(--font-oswald)", color: st.color }}>
                    {st.label}
                  </span>
                  <span className="text-muted-foreground text-xs" style={{ fontFamily: "var(--font-oswald)" }}>{count}</span>
                </div>
                <div className="h-1 bg-border w-full">
                  <div className="h-1 transition-all duration-700" style={{ width: `${pct}%`, background: st.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-10 bg-card animate-pulse w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-card animate-pulse border border-border" />)}
      </div>
      <div className="h-64 bg-card animate-pulse border border-border" />
    </div>
  );
}
