"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Check, Tag } from "@/components/ui/animated-icons";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_amount: number;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  code: "",
  type: "percentage" as "percentage" | "fixed",
  value: 10,
  min_order_amount: 0,
  max_uses: "" as string | number,
  expires_at: "",
  is_active: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/coupons");
    if (res.ok) setCoupons(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setDrawerOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      min_order_amount: c.min_order_amount,
      max_uses: c.max_uses ?? "",
      expires_at: c.expires_at ? c.expires_at.split("T")[0] : "",
      is_active: c.is_active,
    });
    setError(null);
    setDrawerOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      code: String(form.code).toUpperCase().trim(),
      max_uses: form.max_uses === "" ? null : Number(form.max_uses),
      expires_at: form.expires_at || null,
    };

    const url = editing ? `/api/admin/coupons/${editing.id}` : "/api/admin/coupons";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to save coupon.");
    } else {
      setDrawerOpen(false);
      await load();
    }
    setSaving(false);
  };

  const deleteCoupon = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/admin/coupons/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    setDeleting(false);
    await load();
  };

  const toggleActive = async (c: Coupon) => {
    await fetch(`/api/admin/coupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !c.is_active }),
    });
    setCoupons(prev => prev.map(x => x.id === c.id ? { ...x, is_active: !x.is_active } : x));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border pb-5">
        <div>
          <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "var(--font-oswald)" }}>Admin Panel</p>
          <h1 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2.4rem", letterSpacing: "0.02em" }} className="text-foreground uppercase">
            Coupons
          </h1>
          <p className="text-muted-foreground text-xs mt-1">{coupons.length} coupon{coupons.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary hover:bg-primary text-primary-foreground px-4 py-2.5 text-[10px] tracking-[0.15em] uppercase transition-colors"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          <Plus size={13} /> New Coupon
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {["Code", "Type", "Value", "Min Order", "Uses", "Expires", "Status", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-muted-foreground text-[10px] tracking-[0.15em] uppercase"
                  style={{ fontFamily: "var(--font-oswald)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(8)].map((_, j) => (
                    <td key={j} className="px-4 py-3.5">
                      <div className="h-3 bg-border animate-pulse rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : coupons.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground text-sm">
                  No coupons yet. Create one to get started.
                </td>
              </tr>
            ) : (
              coupons.map(c => {
                const expired = c.expires_at ? new Date(c.expires_at) < new Date() : false;
                return (
                  <tr key={c.id} className="hover:bg-card transition-colors">
                    <td className="px-4 py-3.5">
                      <span style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.1em", fontSize: "0.85rem" }}
                        className="text-foreground flex items-center gap-1.5">
                        <Tag size={11} className="text-primary" /> {c.code}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground capitalize">{c.type}</td>
                    <td className="px-4 py-3.5">
                      <span style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "0.95rem", letterSpacing: "0.04em" }} className="text-foreground">
                        {c.type === "percentage" ? `${c.value}%` : `PKR ${c.value.toLocaleString()}`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {c.min_order_amount > 0 ? `PKR ${c.min_order_amount.toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-muted-foreground">{c.uses_count}</span>
                      {c.max_uses && <span className="text-muted-foreground"> / {c.max_uses}</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      {c.expires_at ? (
                        <span className={expired ? "text-primary" : "text-muted-foreground"}>
                          {new Date(c.expires_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => toggleActive(c)} className="flex items-center gap-1.5 group">
                        <div className={`w-8 h-4 transition-all relative ${c.is_active ? "bg-primary" : "bg-border"}`}>
                          <div className={`absolute top-0.5 w-3 h-3 bg-white transition-all ${c.is_active ? "left-4" : "left-0.5"}`} />
                        </div>
                        <span className={`text-[9px] tracking-wider uppercase ${c.is_active ? "text-success" : "text-muted-foreground"}`}
                          style={{ fontFamily: "var(--font-oswald)" }}>
                          {c.is_active ? "Active" : "Off"}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(c)} className="text-muted-foreground hover:text-muted-foreground transition-colors p-1">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setDeleteId(c.id)} className="text-muted-foreground hover:text-primary transition-colors p-1">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40" onClick={() => setDrawerOpen(false)} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-secondary border-l border-border z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div>
                  <p className="text-primary text-[9px] tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
                    {editing ? "Edit" : "Create"}
                  </p>
                  <h2 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.5rem", letterSpacing: "0.04em" }} className="text-foreground">
                    {editing ? editing.code : "New Coupon"}
                  </h2>
                </div>
                <button onClick={() => setDrawerOpen(false)} className="text-muted-foreground hover:text-muted-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {error && (
                  <div className="bg-primary/10 border border-primary/30 px-4 py-3 text-primary text-xs">{error}</div>
                )}

                {/* Code */}
                <div>
                  <label className="block text-muted-foreground text-[10px] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
                    Coupon Code
                  </label>
                  <input
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="e.g. SUMMER20"
                    className="w-full bg-background border border-border focus:border-muted-foreground text-foreground text-sm px-3 py-2.5 outline-none uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  />
                </div>

                {/* Type + Value */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground text-[10px] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>Type</label>
                    <select
                      value={form.type}
                      onChange={e => setForm(f => ({ ...f, type: e.target.value as "percentage" | "fixed" }))}
                      className="w-full bg-background border border-border focus:border-muted-foreground text-foreground text-xs px-3 py-2.5 outline-none"
                      style={{ fontFamily: "var(--font-oswald)" }}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (PKR)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-muted-foreground text-[10px] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
                      Value {form.type === "percentage" ? "(%)" : "(PKR)"}
                    </label>
                    <input
                      type="number" min={0}
                      value={form.value}
                      onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                      className="w-full bg-background border border-border focus:border-muted-foreground text-foreground text-sm px-3 py-2.5 outline-none"
                    />
                  </div>
                </div>

                {/* Min order */}
                <div>
                  <label className="block text-muted-foreground text-[10px] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
                    Minimum Order (PKR)
                  </label>
                  <input
                    type="number" min={0}
                    value={form.min_order_amount}
                    onChange={e => setForm(f => ({ ...f, min_order_amount: Number(e.target.value) }))}
                    className="w-full bg-background border border-border focus:border-muted-foreground text-foreground text-sm px-3 py-2.5 outline-none"
                  />
                  <p className="text-muted-foreground text-[10px] mt-1">Set to 0 for no minimum</p>
                </div>

                {/* Max uses */}
                <div>
                  <label className="block text-muted-foreground text-[10px] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
                    Max Uses
                  </label>
                  <input
                    type="number" min={1}
                    value={form.max_uses}
                    onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                    placeholder="Leave blank for unlimited"
                    className="w-full bg-background border border-border focus:border-muted-foreground text-foreground text-sm px-3 py-2.5 outline-none placeholder:text-border"
                  />
                </div>

                {/* Expiry */}
                <div>
                  <label className="block text-muted-foreground text-[10px] tracking-[0.15em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={form.expires_at}
                    onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                    className="w-full bg-background border border-border focus:border-muted-foreground text-foreground text-sm px-3 py-2.5 outline-none"
                    style={{ colorScheme: "dark" }}
                  />
                  <p className="text-muted-foreground text-[10px] mt-1">Leave blank for no expiry</p>
                </div>

                {/* Active toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground text-xs">Active</p>
                    <p className="text-muted-foreground text-[10px]">Customers can use this coupon</p>
                  </div>
                  <button
                    onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                    className={`w-10 h-5 transition-all relative ${form.is_active ? "bg-primary" : "bg-border"}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white transition-all ${form.is_active ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setDrawerOpen(false)}
                    className="flex-1 py-3 border border-border text-muted-foreground hover:text-muted-foreground text-[10px] tracking-[0.15em] uppercase transition-colors"
                    style={{ fontFamily: "var(--font-oswald)" }}>
                    Cancel
                  </button>
                  <button onClick={save} disabled={saving || !form.code}
                    className="flex-1 py-3 bg-primary hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-[10px] tracking-[0.15em] uppercase transition-colors flex items-center justify-center gap-2"
                    style={{ fontFamily: "var(--font-oswald)" }}>
                    {saving ? "Saving…" : editing ? "Update Coupon" : "Create Coupon"}
                    {!saving && <Check size={12} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50" onClick={() => setDeleteId(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card border border-border p-6 w-full max-w-sm"
            >
              <h3 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.3rem", letterSpacing: "0.04em" }} className="text-foreground mb-2">
                Delete Coupon?
              </h3>
              <p className="text-muted-foreground text-xs mb-5">This cannot be undone. Past orders using this coupon are unaffected.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 border border-border text-muted-foreground text-[10px] tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-oswald)" }}>
                  Cancel
                </button>
                <button onClick={deleteCoupon} disabled={deleting}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground text-[10px] tracking-widest uppercase disabled:opacity-50"
                  style={{ fontFamily: "var(--font-oswald)" }}>
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
