"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker";
import { ClassCard } from "@/components/ui/ClassCard";
import { gymClasses } from "@/data/classes";
import { cn } from "@/lib/utils";

export function FatLossClasses() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll<HTMLElement>("[data-class-card]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.07, duration: 0.65, ease: "power3.out",
          scrollTrigger: { trigger: grid, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    }, grid);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="fat-loss"
      className="relative overflow-hidden"
      aria-label="Fat Loss Classes"
    >
      {/* ── HEADER BAND — full-width top rule, numbered, asymmetric ── */}
      <div className="max-w-screen-2xl mx-auto px-6 pt-24">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="chip">
            <span className="inline-block h-1.5 w-1.5 bg-primary" />
            Classes &amp; Programs
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            [ {String(gymClasses.length).padStart(2, "0")} / PROGRAMS ]
          </span>
        </div>

        {/* Oversized headline spanning the band, description hangs to the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pt-10 pb-12 items-end">
          <h2
            className="lg:col-span-8 text-foreground uppercase leading-[0.82] tracking-[-0.03em]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(56px, 11vw, 150px)" }}
          >
            Fat&nbsp;Loss
            <span
              className="block"
              style={{ color: "transparent", WebkitTextStroke: "1.5px var(--primary)" }}
            >
              Classes
            </span>
          </h2>
          <p className="lg:col-span-4 text-muted-foreground text-[15px] leading-relaxed lg:pb-3">
            Six high-intensity programs engineered to torch fat, build endurance and sculpt a stronger physique — pick your intensity and show up.
          </p>
        </div>
      </div>

      {/* ── MARQUEE ── */}
      <MarqueeTicker items={gymClasses.map((c) => c.name)} className="mb-10" />

      {/* ── BENTO GRID — first program featured 2×2, rest fill ── */}
      <div className="max-w-screen-2xl mx-auto px-6 pb-24">
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 [grid-auto-rows:280px] sm:[grid-auto-rows:240px] lg:[grid-auto-rows:280px]"
          role="list"
          aria-label="Available classes"
        >
          {gymClasses.map((gymClass, i) => (
            <div
              key={gymClass.id}
              data-class-card
              role="listitem"
              className={cn(i === 0 && "sm:col-span-2 sm:row-span-2")}
            >
              <ClassCard
                gymClass={gymClass}
                fill
                featured={i === 0}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
