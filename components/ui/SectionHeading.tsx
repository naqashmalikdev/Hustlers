"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  description?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  description,
  className,
}: SectionHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      });
      tl.from(".sh-eyebrow", { y: 18, autoAlpha: 0, duration: 0.5 })
        .from(".sh-line", { yPercent: 116, duration: 0.8, stagger: 0.1 }, "-=0.25")
        .from(".sh-rule", { scaleX: 0, duration: 0.7 }, "-=0.45")
        .from(".sh-desc", { y: 14, autoAlpha: 0, duration: 0.5 }, "-=0.4");
    }, el);
    return () => ctx.revert();
  }, []);

  const lines = title.split("\n");

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {/* Eyebrow — boxy blueprint marker + extending rule */}
      <div
        className={cn(
          "sh-eyebrow flex items-center gap-3",
          align === "center" && "justify-center"
        )}
      >
        <span className="chip border border-border bg-card/40 px-3 py-1.5">
          <span className="inline-block h-1.5 w-1.5 bg-primary" />
          {eyebrow}
        </span>
        <span
          className={cn(
            "h-px w-12 bg-gradient-to-r from-border to-transparent sm:w-20",
            align === "center" && "hidden"
          )}
        />
      </div>

      {/* Title — oversized display, last line accented in animated brand gradient */}
      <h2
        className="text-foreground uppercase leading-[0.9] tracking-[-0.02em] text-[clamp(2.5rem,6vw,5rem)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {lines.map((line, i) => {
          const accent = i === lines.length - 1 && lines.length > 1;
          return (
            <span key={i} className="block overflow-hidden pb-[0.04em]">
              <span className={cn("sh-line block", accent && "text-primary animate-gradient")}>
                {line}
              </span>
            </span>
          );
        })}
      </h2>

      {/* Animated brand rule */}
      <span
        className={cn(
          "sh-rule h-[3px] w-14 bg-gradient-brand",
          align === "center" ? "origin-center" : "origin-left"
        )}
      />

      {/* Description (optional) */}
      {description && (
        <p className="sh-desc text-muted-foreground text-[15px] leading-relaxed max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}
