"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, Home } from "@/components/ui/animated-icons";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 24 }}
          className="w-20 h-20 bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle size={36} className="text-brand" />
        </motion.div>

        <p
          className="text-primary text-[11px] tracking-[0.35em] uppercase mb-4"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Order Confirmed
        </p>

        <h1
          className="text-foreground uppercase leading-none mb-4"
          style={{
            fontFamily: "var(--font-bebas-neue)",
            fontSize: "clamp(44px, 8vw, 72px)",
            letterSpacing: "-0.01em",
          }}
        >
          Thank<span className="text-primary"> You</span>
        </h1>

        {orderNumber && (
          <div className="inline-block border border-border bg-card px-6 py-3 mb-6">
            <p className="text-muted-foreground/60 text-[9px] tracking-[0.25em] uppercase mb-1"
              style={{ fontFamily: "var(--font-oswald)" }}>Order Number</p>
            <p
              className="text-foreground tracking-widest"
              style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.6rem" }}
            >
              {orderNumber}
            </p>
          </div>
        )}

        <p className="text-muted-foreground text-sm leading-relaxed mb-10">
          Your order has been received. A confirmation email has been sent to your inbox.
          We&apos;ll process and dispatch your order shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-bold tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors"
            style={{ fontFamily: "var(--font-oswald)", fontSize: "0.75rem" }}
          >
            <ShoppingBag size={14} />
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-3.5 border border-border text-muted-foreground font-bold tracking-[0.2em] uppercase hover:border-foreground/30 hover:text-foreground transition-colors"
            style={{ fontFamily: "var(--font-oswald)", fontSize: "0.75rem" }}
          >
            <Home size={14} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
