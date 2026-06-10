"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight, ArrowRight } from "@/components/ui/animated-icons";

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  pending:    { label: "Pending",    color: "var(--muted-foreground)"    },
  confirmed:  { label: "Confirmed",  color: "#3b82f6" },
  processing: { label: "Processing", color: "var(--warning)" },
  shipped:    { label: "Shipped",    color: "#8b5cf6" },
  delivered:  { label: "Delivered",  color: "var(--success)" },
  cancelled:  { label: "Cancelled",  color: "var(--primary)" },
  refunded:   { label: "Refunded",   color: "var(--muted-foreground)"    },
};

const STATUSES = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  guest_email: string | null;
  guest_name: string | null;
  user_id: string | null;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status !== "all") params.set("status", status);
    const res = await fetch(`/api/admin/orders?${params}`);
    if (res.ok) {
      const json = await res.json();
      setOrders(json.orders ?? []);
      setTotal(json.total ?? 0);
    }
    setLoading(false);
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  const filtered = search
    ? orders.filter(o =>
        o.order_number.toLowerCase().includes(search.toLowerCase()) ||
        (o.guest_email ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (o.guest_name ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "var(--font-oswald)" }}>Admin Panel</p>
        <h1 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2.4rem", letterSpacing: "0.02em" }} className="text-foreground uppercase">
          Orders
        </h1>
        <p className="text-muted-foreground text-xs mt-1">{total} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
            placeholder="Search by order # or email…"
            className="w-full bg-card border border-border text-foreground text-xs pl-8 pr-3 py-2.5 outline-none focus:border-muted-foreground placeholder:text-muted-foreground"
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 flex-wrap">
          <Filter size={12} className="text-muted-foreground mr-1" />
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className="px-3 py-1.5 text-[9px] tracking-widest uppercase border transition-all"
              style={{
                fontFamily: "var(--font-oswald)",
                borderColor: status === s ? (STATUS_STYLES[s]?.color ?? "var(--primary)") : "var(--border)",
                color: status === s ? (STATUS_STYLES[s]?.color ?? "var(--primary)") : "var(--muted-foreground)",
                background: status === s ? `${STATUS_STYLES[s]?.color ?? "var(--primary)"}10` : "transparent",
              }}
            >
              {s === "all" ? "All" : STATUS_STYLES[s]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {["Order #", "Customer", "Status", "Total", "Date", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-muted-foreground text-[10px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: "var(--font-oswald)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <AnimatePresence mode="wait">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-3 bg-border animate-pulse rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground text-sm">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const st = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-card transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <span style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "0.95rem", letterSpacing: "0.06em" }}
                          className="text-foreground">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-foreground">{order.guest_name ?? "Member"}</p>
                        {order.guest_email && <p className="text-muted-foreground text-[10px]">{order.guest_email}</p>}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 text-[9px] tracking-widest uppercase border font-bold"
                          style={{ fontFamily: "var(--font-oswald)", color: st.color, borderColor: `${st.color}40` }}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "0.95rem" }} className="text-foreground">
                          PKR {order.total.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <Link href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary text-[10px] tracking-widest uppercase transition-colors"
                          style={{ fontFamily: "var(--font-oswald)" }}>
                          View <ArrowRight size={10} />
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-[10px]">
            Page {page} of {totalPages} · {total} orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
