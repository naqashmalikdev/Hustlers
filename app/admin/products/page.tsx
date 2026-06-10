"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search, Loader2, X, Save, Upload, ImagePlus } from "@/components/ui/animated-icons";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/supabase/types";

const CATEGORIES = ["protein", "pre-workout", "recovery", "vitamins", "apparel", "equipment"] as const;

function inputCls(err?: boolean) {
  return `w-full bg-secondary border ${err ? "border-primary" : "border-border"} text-foreground placeholder:text-muted-foreground px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors`;
}

type ProductForm = {
  name: string; brand: string; description: string; category: string;
  price: string; compare_at_price: string; weight: string; images: string;
  flavors: string; sizes: string; stock_quantity: string; is_active: boolean; slug: string;
};

const EMPTY_FORM: ProductForm = {
  name: "", brand: "HUSTLERS Nutrition", description: "", category: "protein",
  price: "", compare_at_price: "", weight: "", images: "", flavors: "", sizes: "",
  stock_quantity: "", is_active: true, slug: "",
};

function toSlug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setUploadError(null);
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name, brand: p.brand, description: p.description ?? "",
      category: p.category, price: String(p.price),
      compare_at_price: p.compare_at_price ? String(p.compare_at_price) : "",
      weight: p.weight ?? "", images: p.images.join("\n"),
      flavors: p.flavors.join(", "), sizes: p.sizes.join(", "),
      stock_quantity: String(p.stock_quantity), is_active: p.is_active, slug: p.slug,
    });
    setError(null);
    setUploadError(null);
    setShowForm(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    const supabase = createClient();
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const ext = file.name.split(".").pop() ?? "jpg";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("product-images")
        .upload(filename, file, { contentType: file.type, upsert: false });

      if (uploadErr) {
        setUploadError(`Upload failed: ${uploadErr.message}`);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("product-images")
        .getPublicUrl(filename);

      uploadedUrls.push(publicUrl);
    }

    // Append to existing image URLs
    setForm(f => {
      const existing = f.images.trim();
      const newUrls = uploadedUrls.join("\n");
      return { ...f, images: existing ? `${existing}\n${newUrls}` : newUrls };
    });

    setUploading(false);
    // Reset file input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      description: form.description.trim() || null,
      category: form.category,
      price: parseFloat(form.price),
      compare_at_price: form.compare_at_price ? parseFloat(form.compare_at_price) : null,
      weight: form.weight.trim() || null,
      images: form.images.split("\n").map(s => s.trim()).filter(Boolean),
      flavors: form.flavors.split(",").map(s => s.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean),
      stock_quantity: parseInt(form.stock_quantity) || 0,
      is_active: form.is_active,
      slug: form.slug.trim() || toSlug(form.name),
    };

    const url    = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json();

    if (!res.ok) { setError(data.error ?? "Save failed"); setSaving(false); return; }
    setSaving(false);
    setShowForm(false);
    fetchProducts();
  }

  async function handleToggle(p: Product) {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !p.is_active }),
    });
    fetchProducts();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchProducts();
  }

  // Preview images currently entered in the form
  const previewUrls = form.images.split("\n").map(s => s.trim()).filter(Boolean);

  const visible = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "var(--font-oswald)" }}>Admin</p>
          <h1 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2.2rem" }} className="text-foreground uppercase">Products</h1>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors cursor-pointer"
          style={{ fontFamily: "var(--font-oswald)" }}>
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors" />
      </div>

      {/* Table */}
      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-muted-foreground text-[9px] tracking-[0.2em] uppercase font-normal"
                  style={{ fontFamily: "var(--font-oswald)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-card">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-4 bg-secondary animate-pulse" /></td></tr>
              ))
            ) : visible.map(p => (
              <tr key={p.id} className="hover:bg-card transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 shrink-0 bg-border overflow-hidden">
                      {p.images[0] && <Image src={p.images[0]} alt={p.name} fill sizes="40px" className="object-cover" />}
                    </div>
                    <div>
                      <p className="text-foreground text-xs font-medium">{p.name}</p>
                      <p className="text-muted-foreground text-[10px]">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-muted-foreground text-[10px] tracking-widest uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
                    {p.category.replace("-", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-foreground" style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "0.95rem" }}>
                    PKR {p.price.toLocaleString()}
                  </p>
                  {p.compare_at_price && <p className="text-muted-foreground text-[10px] line-through">{p.compare_at_price.toLocaleString()}</p>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold tabular-nums ${p.stock_quantity === 0 ? "text-primary" : p.stock_quantity < 10 ? "text-warning" : "text-success"}`}
                    style={{ fontFamily: "var(--font-oswald)" }}>
                    {p.stock_quantity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggle(p)} className="cursor-pointer">
                    {p.is_active
                      ? <ToggleRight size={20} className="text-success" />
                      : <ToggleLeft  size={20} className="text-muted-foreground" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)}
                      className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors cursor-pointer">
                      <Pencil size={11} />
                    </button>
                    <button onClick={() => setDeleteId(p.id)}
                      className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors cursor-pointer">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && visible.length === 0 && (
          <p className="text-center text-muted-foreground py-12 text-sm">No products found.</p>
        )}
      </div>

      {/* Product form drawer */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setShowForm(false)} />
            <motion.div key="drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 w-[min(520px,100vw)] bg-secondary border-l border-border z-50 flex flex-col">

              <div className="flex items-center justify-between px-6 h-14 border-b border-border shrink-0">
                <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.2rem", letterSpacing: "0.08em" }}
                  className="text-foreground uppercase">
                  {editing ? "Edit Product" : "New Product"}
                </p>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Basic fields */}
                {([
                  { label: "Product Name *",     key: "name",            type: "text",   ph: "Whey Isolate Pro" },
                  { label: "Brand *",             key: "brand",           type: "text",   ph: "HUSTLERS Nutrition" },
                  { label: "Slug *",              key: "slug",            type: "text",   ph: "whey-isolate-pro" },
                  { label: "Price (PKR) *",       key: "price",           type: "number", ph: "8500" },
                  { label: "Compare Price (PKR)", key: "compare_at_price",type: "number", ph: "10000" },
                  { label: "Weight / Size",       key: "weight",          type: "text",   ph: "2kg" },
                  { label: "Stock Quantity *",    key: "stock_quantity",  type: "number", ph: "50" },
                ] as const).map(({ label, key, type, ph }) => (
                  <div key={key}>
                    <label className="block text-muted-foreground text-[9px] tracking-[0.2em] uppercase mb-1.5" style={{ fontFamily: "var(--font-oswald)" }}>{label}</label>
                    <input type={type} value={form[key] as string} onChange={e => {
                      const val = e.target.value;
                      setForm(f => ({
                        ...f, [key]: val,
                        ...(key === "name" && !editing ? { slug: toSlug(val) } : {}),
                      }));
                    }} placeholder={ph} className={inputCls()} />
                  </div>
                ))}

                {/* Category */}
                <div>
                  <label className="block text-muted-foreground text-[9px] tracking-[0.2em] uppercase mb-1.5" style={{ fontFamily: "var(--font-oswald)" }}>Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className={inputCls() + " cursor-pointer"}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.replace("-", " ")}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-muted-foreground text-[9px] tracking-[0.2em] uppercase mb-1.5" style={{ fontFamily: "var(--font-oswald)" }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} placeholder="Product description…" className={inputCls() + " resize-none"} />
                </div>

                {/* Images — upload + URL */}
                <div>
                  <label className="block text-muted-foreground text-[9px] tracking-[0.2em] uppercase mb-1.5" style={{ fontFamily: "var(--font-oswald)" }}>
                    Images
                  </label>

                  {/* Upload button */}
                  <div className="mb-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-muted-foreground text-muted-foreground hover:border-primary hover:text-primary text-[10px] tracking-[0.15em] uppercase transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
                      style={{ fontFamily: "var(--font-oswald)" }}
                    >
                      {uploading
                        ? <><Loader2 size={13} className="animate-spin" /> Uploading…</>
                        : <><Upload size={13} /> Upload Images from Device</>
                      }
                    </button>
                    {uploadError && <p className="text-primary text-[10px] mt-1">{uploadError}</p>}
                  </div>

                  {/* Or paste URLs */}
                  <p className="text-muted-foreground text-[10px] mb-1.5">— or paste URLs (one per line) —</p>
                  <textarea
                    value={form.images}
                    onChange={e => setForm(f => ({ ...f, images: e.target.value }))}
                    rows={3}
                    placeholder={"https://images.unsplash.com/…\nhttps://…"}
                    className={inputCls() + " resize-none font-mono text-[11px]"}
                  />

                  {/* Image previews */}
                  {previewUrls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {previewUrls.map((url, i) => (
                        <div key={i} className="relative group w-16 h-16 bg-border border border-border overflow-hidden">
                          <img src={url} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                          <button
                            type="button"
                            onClick={() => {
                              const urls = form.images.split("\n").map(s => s.trim()).filter(Boolean);
                              urls.splice(i, 1);
                              setForm(f => ({ ...f, images: urls.join("\n") }));
                            }}
                            className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                          >
                            <X size={14} className="text-primary-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {previewUrls.length === 0 && (
                    <div className="mt-2 flex items-center justify-center h-16 border border-dashed border-border">
                      <ImagePlus size={20} className="text-border" />
                    </div>
                  )}
                </div>

                {/* Flavors */}
                <div>
                  <label className="block text-muted-foreground text-[9px] tracking-[0.2em] uppercase mb-1.5" style={{ fontFamily: "var(--font-oswald)" }}>
                    Flavors (comma-separated)
                  </label>
                  <input value={form.flavors} onChange={e => setForm(f => ({ ...f, flavors: e.target.value }))}
                    placeholder="Chocolate, Vanilla, Strawberry" className={inputCls()} />
                </div>

                {/* Sizes */}
                <div>
                  <label className="block text-muted-foreground text-[9px] tracking-[0.2em] uppercase mb-1.5" style={{ fontFamily: "var(--font-oswald)" }}>
                    Sizes (comma-separated)
                  </label>
                  <input value={form.sizes} onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))}
                    placeholder="S, M, L, XL" className={inputCls()} />
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3 py-2">
                  <button type="button" onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                    className={`relative w-10 h-5 transition-colors cursor-pointer ${form.is_active ? "bg-primary" : "bg-muted-foreground"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white transition-all ${form.is_active ? "left-5" : "left-0.5"}`} />
                  </button>
                  <span className="text-muted-foreground text-xs" style={{ fontFamily: "var(--font-oswald)" }}>
                    {form.is_active ? "Active (visible in shop)" : "Inactive (hidden)"}
                  </span>
                </div>

                {error && <p className="text-primary text-sm bg-primary/10 border border-primary/20 px-3 py-2">{error}</p>}
              </div>

              <div className="px-6 py-4 border-t border-border shrink-0">
                <button onClick={handleSave} disabled={saving || uploading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase text-[11px] hover:bg-primary transition-colors disabled:opacity-60 cursor-pointer"
                  style={{ fontFamily: "var(--font-oswald)" }}>
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? "Saving…" : editing ? "Update Product" : "Create Product"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div key="del-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50" onClick={() => setDeleteId(null)} />
            <motion.div key="del-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card border border-border p-8 w-80 text-center">
              <Trash2 size={28} className="text-primary mx-auto mb-4" />
              <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.3rem" }} className="text-foreground uppercase mb-2">
                Deactivate Product?
              </p>
              <p className="text-muted-foreground text-sm mb-6">The product will be hidden from the shop. Orders are preserved.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 border border-border text-muted-foreground hover:text-muted-foreground text-[11px] uppercase tracking-widest transition-colors cursor-pointer"
                  style={{ fontFamily: "var(--font-oswald)" }}>Cancel</button>
                <button onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground text-[11px] uppercase tracking-widest hover:bg-primary transition-colors cursor-pointer"
                  style={{ fontFamily: "var(--font-oswald)" }}>Deactivate</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
