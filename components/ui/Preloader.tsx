"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";

const SLATS = 6;

/**
 * Full-screen GSAP intro loader. Rendered in the root layout so its markup
 * ships in the initial HTML and covers the page from first paint (no flash of
 * content). The animated elements start hidden via inline styles and are
 * animated IN with .to() — so they never flash in their final state first.
 * Plays once per full page load; honours prefers-reduced-motion.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const { lenis } = useSmoothScroll();

  // Lock scrolling (native + Lenis) while the loader is on screen.
  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
    };
  }, [done, lenis]);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setDone(true);
      return;
    }

    const ctx = gsap.context(() => {
      const slats = gsap.utils.toArray<HTMLElement>(".pl-slat");

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setDone(true),
      });

      tl.to(".pl-top", { autoAlpha: 1, y: 0, duration: 0.4 })
        .to(".pl-word", { y: 0, duration: 0.7, ease: "power4.out", stagger: 0.08 }, "-=0.15")
        .to(".pl-meta", { autoAlpha: 1, y: 0, duration: 0.4 }, "-=0.2")
        // counter + bar run together over the same window
        .to(".pl-bar-fill", { scaleX: 1, duration: 1.2, ease: "power1.inOut" }, "<")
        .to(
          { v: 0 },
          {
            v: 100,
            duration: 1.2,
            ease: "power1.inOut",
            onUpdate() {
              const v = Math.round((this.targets()[0] as { v: number }).v);
              if (counterRef.current) counterRef.current.textContent = String(v).padStart(3, "0");
            },
          },
          "<",
        )
        .to(".pl-content", { autoAlpha: 0, y: -24, duration: 0.4, ease: "power2.in" }, "+=0.15")
        // industrial reveal — vertical slats lift away from the centre outwards
        .to(
          slats,
          { yPercent: -100, duration: 0.6, ease: "power4.inOut", stagger: { amount: 0.35, from: "center" } },
          "-=0.1",
        );
    }, root);

    return () => ctx.revert();
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] overflow-hidden"
      role="status"
      aria-label="Loading Hustlers Gym"
    >
      {/* Solid slat cover (also the exit-reveal panels) */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: SLATS }).map((_, i) => (
          <div
            key={i}
            className="pl-slat flex-1 bg-background border-r border-border/30 last:border-r-0"
          />
        ))}
      </div>

      {/* Content — editorial frame */}
      <div className="pl-content absolute inset-0 flex flex-col px-6 lg:px-10 py-7 lg:py-9">

        {/* faint blueprint grid */}
        <div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-50" aria-hidden="true" />

        {/* TOP ROW — chip + mono status (starts hidden) */}
        <div
          className="pl-top relative flex items-center justify-between border-b border-border pb-4"
          style={{ opacity: 0, visibility: "hidden", transform: "translateY(12px)" }}
        >
          <span className="chip">
            <span className="inline-block h-1.5 w-1.5 bg-primary" />
            Trust The Grind
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">[ LOADING ]</span>
        </div>

        {/* CENTER — masked wordmark */}
        <div className="relative flex-1 flex items-center justify-center">
          <h1
            className="flex items-baseline uppercase leading-none"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(52px, 13vw, 168px)",
              letterSpacing: "-0.03em",
            }}
            aria-label="Hustlers Gym"
          >
            <span className="inline-block overflow-hidden">
              <span className="pl-word inline-block text-foreground" style={{ transform: "translateY(110%)" }}>
                Hustlers&nbsp;
              </span>
            </span>
            <span className="inline-block overflow-hidden">
              <span
                className="pl-word inline-block"
                style={{ transform: "translateY(110%)", color: "transparent", WebkitTextStroke: "1.5px var(--primary)" }}
              >
                Gym
              </span>
            </span>
          </h1>
        </div>

        {/* BOTTOM — progress + big counter (starts hidden) */}
        <div
          className="pl-meta relative"
          style={{ opacity: 0, visibility: "hidden", transform: "translateY(12px)" }}
        >
          {/* full-width hairline progress */}
          <div className="h-px w-full bg-border relative overflow-hidden mb-5">
            <div
              className="pl-bar-fill absolute inset-0 bg-foreground origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          <div className="flex items-end justify-between gap-6">
            {/* live counter */}
            <div className="flex items-baseline gap-2">
              <span
                ref={counterRef}
                className="text-foreground tabular-nums leading-none"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(48px, 11vw, 120px)", letterSpacing: "-0.03em" }}
              >
                000
              </span>
              <span
                className="text-muted-foreground text-sm tracking-[0.2em] uppercase"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                %
              </span>
            </div>

            {/* label */}
            <div className="text-right pb-1.5">
              <p className="text-foreground text-[11px] tracking-[0.25em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
                Loading Experience
              </p>
              <p className="text-muted-foreground/70 text-[10px] tracking-[0.2em] uppercase mt-1" style={{ fontFamily: "var(--font-condensed)" }}>
                Pakistan&apos;s Premium Fitness Club
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
