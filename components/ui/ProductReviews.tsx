"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, Loader2 } from "@/components/ui/animated-icons";

interface ReviewData {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  reviewer_name: string;
}

interface ReviewsState {
  reviews: ReviewData[];
  avgRating: number;
  total: number;
}

interface Props {
  slug: string;
  isLoggedIn: boolean;
}

function Stars({ rating, size = 14, interactive = false, onRate }: {
  rating: number; size?: number; interactive?: boolean; onRate?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type={interactive ? "button" : undefined}
          onClick={interactive && onRate ? () => onRate(i) : undefined}
          onMouseEnter={interactive ? () => setHovered(i) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={size}
            className={`transition-colors ${i <= (hovered || rating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"}`}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ slug, isLoggedIn }: Props) {
  const [state, setState] = useState<ReviewsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 0, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/products/${slug}/reviews`);
    if (res.ok) setState(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, [slug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rating) { setFormError("Please select a star rating."); return; }
    setSubmitting(true);
    setFormError(null);
    const res = await fetch(`/api/products/${slug}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setFormError(data.error ?? "Failed to submit review.");
    } else {
      setSubmitted(true);
      setShowForm(false);
      await load();
    }
    setSubmitting(false);
  };

  return (
    <div className="border-t border-border pt-12 mt-12">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1"
            style={{ fontFamily: "var(--font-oswald)" }}>Customer Reviews</p>
          {state && state.total > 0 ? (
            <div className="flex items-center gap-3">
              <h2 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2rem", letterSpacing: "0.02em" }}
                className="text-foreground">
                {state.avgRating.toFixed(1)}
              </h2>
              <div>
                <Stars rating={Math.round(state.avgRating)} size={16} />
                <p className="text-muted-foreground text-[10px] mt-0.5">{state.total} review{state.total !== 1 ? "s" : ""}</p>
              </div>
            </div>
          ) : (
            <h2 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.8rem", letterSpacing: "0.02em" }}
              className="text-foreground">
              No Reviews Yet
            </h2>
          )}
        </div>

        {isLoggedIn && !submitted && (
          <button
            onClick={() => setShowForm(v => !v)}
            className="px-5 py-2.5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 text-[10px] tracking-[0.15em] uppercase transition-all"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        )}
        {!isLoggedIn && (
          <p className="text-muted-foreground text-xs">
            <Link href="/auth/login" className="text-primary hover:underline">Sign in</Link> to write a review
          </p>
        )}
        {submitted && (
          <p className="text-success text-xs flex items-center gap-1.5">
            <CheckCircle size={13} /> Review submitted!
          </p>
        )}
      </div>

      {/* Write review form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-card border border-border p-6 space-y-4">
              <p className="text-foreground text-sm font-medium"
                style={{ fontFamily: "var(--font-oswald)", letterSpacing: "0.05em" }}>
                Your Review
              </p>

              {/* Star rating */}
              <div>
                <label className="block text-muted-foreground text-[10px] tracking-[0.15em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-oswald)" }}>Rating *</label>
                <Stars rating={form.rating} size={24} interactive onRate={r => setForm(f => ({ ...f, rating: r }))} />
              </div>

              {/* Title */}
              <div>
                <label className="block text-muted-foreground text-[10px] tracking-[0.15em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-oswald)" }}>Review Title</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Summarize your experience"
                  className="w-full bg-background border border-border focus:border-primary text-foreground text-sm px-4 py-3 outline-none transition-colors placeholder:text-muted-foreground/40"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-muted-foreground text-[10px] tracking-[0.15em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-oswald)" }}>Review</label>
                <textarea
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="Tell others what you think about this product…"
                  rows={4}
                  className="w-full bg-background border border-border focus:border-primary text-foreground text-sm px-4 py-3 outline-none transition-colors placeholder:text-muted-foreground/40 resize-none"
                />
              </div>

              {formError && (
                <p className="text-primary text-xs bg-primary/10 border border-primary/20 px-4 py-2">
                  {formError}
                </p>
              )}

              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-[10px] tracking-[0.15em] uppercase transition-colors flex items-center gap-2"
                  style={{ fontFamily: "var(--font-oswald)" }}>
                  {submitting ? <><Loader2 size={11} className="animate-spin" /> Submitting…</> : "Submit Review"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 border border-border text-muted-foreground hover:text-foreground text-[10px] tracking-[0.15em] uppercase transition-colors"
                  style={{ fontFamily: "var(--font-oswald)" }}>
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border border-border p-5 animate-pulse space-y-3">
              <div className="h-3 bg-secondary w-24" />
              <div className="h-4 bg-secondary w-48" />
              <div className="h-3 bg-secondary w-full" />
            </div>
          ))}
        </div>
      ) : !state?.reviews.length ? (
        <div className="text-center py-12 border border-border">
          <Star size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Be the first to review this product.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {state.reviews.map(review => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Stars rating={review.rating} size={13} />
                    {review.is_verified_purchase && (
                      <span className="flex items-center gap-1 text-[9px] text-success tracking-wider uppercase"
                        style={{ fontFamily: "var(--font-oswald)" }}>
                        <CheckCircle size={10} /> Verified
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <p className="text-foreground text-sm font-medium">{review.title}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-foreground text-xs">{review.reviewer_name}</p>
                  <p className="text-muted-foreground/60 text-[10px]">
                    {new Date(review.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              {review.body && (
                <p className="text-muted-foreground text-sm leading-relaxed">{review.body}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
