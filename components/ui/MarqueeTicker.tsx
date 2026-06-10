"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface MarqueeTickerProps {
  items: string[];
  className?: string;
  /** "dark" = black bar (default), "ghost" = transparent with border */
  variant?: "dark" | "ghost";
}

export function MarqueeTicker({ items, className, variant = "dark" }: MarqueeTickerProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  /* separator between items */
  const sep     = "  /  ";
  const segment = items.join(sep) + sep;
  /* quadruple so we have enough width to loop seamlessly */
  const text    = segment.repeat(4);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const tween = gsap.fromTo(
      strip,
      { x: "0%" },
      {
        x: "-50%",
        duration: strip.scrollWidth / 2 / 80, // 80 px/s
        ease: "none",
        repeat: -1,
      }
    );
    return () => { tween.kill(); };
  }, []);

  return (
    <div
      className={cn(
        "overflow-hidden",
        variant === "dark"
          ? "bg-foreground border-y border-foreground py-3"
          : "bg-transparent border-y border-border py-3",
        className
      )}
    >
      <div ref={stripRef} className="inline-flex will-change-transform gap-0">
        {[0, 1].map((k) => (
          <span
            key={k}
            aria-hidden={k === 1 ? "true" : undefined}
            className={cn(
              "inline-block whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.3em]",
              variant === "dark" ? "text-background" : "text-muted-foreground"
            )}
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {text}
          </span>
        ))}
      </div>
      {/* screen reader only */}
      <span className="sr-only">{items.join(", ")}</span>
    </div>
  );
}
