"use client";

import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface AnalyticsData {
  dailyRevenue: { date: string; label: string; revenue: number; orders: number }[];
  statusData: { status: string; count: number }[];
  topProducts: { name: string; brand: string; revenue: number; units: number }[];
  categoryData: { category: string; count: number; totalValue: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending:    "var(--muted-foreground)",
  confirmed:  "#3b82f6",
  processing: "var(--warning)",
  shipped:    "#8b5cf6",
  delivered:  "var(--success)",
  cancelled:  "var(--primary)",
  refunded:   "var(--muted-foreground)",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", confirmed: "Confirmed", processing: "Processing",
  shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded",
};

const CATEGORY_COLORS = ["var(--primary)", "#3b82f6", "var(--warning)", "#8b5cf6", "var(--success)", "#ec4899"];

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-5" style={{ fontFamily: "var(--font-oswald)" }}>
      {label}
    </p>
  );
}

const tooltipStyle = {
  backgroundColor: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 0,
  color: "var(--foreground)",
  fontSize: 11,
  fontFamily: "var(--font-oswald)",
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-card w-56" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-card border border-border" />)}
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-muted-foreground text-sm">Failed to load analytics.</p>;

  const totalRevenue30d = data.dailyRevenue.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders30d = data.dailyRevenue.reduce((sum, d) => sum + d.orders, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "var(--font-oswald)" }}>Admin Panel</p>
        <h1 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2.4rem", letterSpacing: "0.02em" }} className="text-foreground uppercase">
          Analytics
        </h1>
        <p className="text-muted-foreground text-xs mt-1">Last 30 days performance</p>
      </div>

      {/* 30-day summary pills */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border p-5">
          <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>30-Day Revenue</p>
          <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2rem", letterSpacing: "0.02em" }} className="text-foreground">
            PKR {(totalRevenue30d / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="bg-card border border-border p-5">
          <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>30-Day Orders</p>
          <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2rem", letterSpacing: "0.02em" }} className="text-foreground">
            {totalOrders30d}
          </p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-card border border-border p-5">
        <SectionHeader label="Daily Revenue — Last 30 Days" />
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data.dailyRevenue} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-oswald)" }}
              axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-oswald)" }}
              axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: unknown) => [`PKR ${Number(v).toLocaleString()}`, "Revenue"]}
              labelStyle={{ color: "var(--muted-foreground)", marginBottom: 4 }}
            />
            <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2}
              fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: "var(--primary)" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Orders per day */}
      <div className="bg-card border border-border p-5">
        <SectionHeader label="Daily Orders — Last 30 Days" />
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data.dailyRevenue} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-oswald)" }}
              axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-oswald)" }}
              axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [String(v), "Orders"]}
              labelStyle={{ color: "var(--muted-foreground)", marginBottom: 4 }} />
            <Bar dataKey="orders" fill="var(--primary)" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order status pie */}
        <div className="bg-card border border-border p-5">
          <SectionHeader label="Order Status Breakdown" />
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={data.statusData} dataKey="count" nameKey="status" cx="50%" cy="50%"
                  innerRadius={50} outerRadius={75} strokeWidth={0}>
                  {data.statusData.map((entry, i) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "var(--muted-foreground)"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle}
                  formatter={(v: unknown, name: unknown) => [String(v), STATUS_LABELS[String(name)] ?? String(name)]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {data.statusData.map(s => (
                <div key={s.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2" style={{ background: STATUS_COLORS[s.status] ?? "var(--muted-foreground)" }} />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-oswald)" }}>
                      {STATUS_LABELS[s.status] ?? s.status}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs" style={{ fontFamily: "var(--font-oswald)" }}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-card border border-border p-5">
          <SectionHeader label="Inventory by Category" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.categoryData} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-oswald)" }}
                axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-oswald)" }}
                axisLine={false} tickLine={false} width={70}
                tickFormatter={v => v.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: unknown) => [String(v), "Products"]}
                labelStyle={{ color: "var(--muted-foreground)", marginBottom: 4 }} />
              <Bar dataKey="count" radius={[0, 2, 2, 0]}>
                {data.categoryData.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-card border border-border p-5">
        <SectionHeader label="Top Products by Revenue" />
        {data.topProducts.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No order data yet.</p>
        ) : (
          <div className="space-y-3">
            {data.topProducts.map((p, i) => {
              const max = data.topProducts[0].revenue;
              const pct = max > 0 ? (p.revenue / max) * 100 : 0;
              return (
                <div key={p.name + i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-[10px] w-4 text-right tabular-nums" style={{ fontFamily: "var(--font-oswald)" }}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-foreground text-xs">{p.name}</p>
                        <p className="text-muted-foreground text-[10px]">{p.brand} · {p.units} units sold</p>
                      </div>
                    </div>
                    <span style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "0.95rem", letterSpacing: "0.04em" }}
                      className="text-foreground">
                      PKR {(p.revenue / 1000).toFixed(1)}K
                    </span>
                  </div>
                  <div className="ml-7 h-1 bg-border">
                    <div className="h-1 transition-all duration-700"
                      style={{ width: `${pct}%`, background: i === 0 ? "var(--primary)" : "var(--muted-foreground)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
