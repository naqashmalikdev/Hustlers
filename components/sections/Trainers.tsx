"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "@/components/ui/animated-icons";
import { gsap } from "@/lib/gsap";
import { TrainerCard } from "@/components/ui/TrainerCard";
import { trainers } from "@/data/trainers";
import { cn } from "@/lib/utils";

export function Trainers() {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);

  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const scrollStart = useRef(0);
  const hasDragged  = useRef(false);

  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  /* scroll-into-view animation */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const cards = wrap.querySelectorAll<HTMLElement>("[data-trainer-card]");
    const ctx = gsap.context(() => {
      gsap.fromTo(cards,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: wrap, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateEdges, { passive: true });
    updateEdges();
    return () => el.removeEventListener("scroll", updateEdges);
  }, [updateEdges]);

  function scrollBy(dir: "left" | "right") {
    trackRef.current?.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  }

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current  = true;
    hasDragged.current  = false;
    startX.current      = e.pageX;
    scrollStart.current = trackRef.current?.scrollLeft ?? 0;
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return;
    const delta = e.pageX - startX.current;
    if (Math.abs(delta) > 4) hasDragged.current = true;
    if (trackRef.current) trackRef.current.scrollLeft = scrollStart.current - delta;
  }
  function onMouseUp() { isDragging.current = false; }

  return (
    <section id="trainers" className="relative py-24 lg:py-28 bg-mesh" aria-label="Trainers">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center gap-10 lg:gap-12">

          {/* ── LEFT RAIL — index, title, controls ── */}
          <div className="lg:col-span-4 px-6 lg:pl-6 lg:pr-0">
            <span className="chip mb-5">
              <span className="inline-block h-1.5 w-1.5 bg-primary" />
              Meet the Team
            </span>

            <h2
              className="text-foreground uppercase leading-[0.84] tracking-[-0.03em]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(44px, 6vw, 80px)" }}
            >
              Our
              <span
                className="block"
                style={{ color: "transparent", WebkitTextStroke: "1.5px var(--primary)" }}
              >
                Trainers
              </span>
            </h2>

            <p className="text-muted-foreground text-[15px] mt-5 max-w-sm leading-relaxed">
              Elite coaches handpicked for expertise, credentials, and a real obsession with transformation.
            </p>

            {/* count + arrows */}
            <div className="mt-9 flex items-center justify-between border-t border-border pt-6 max-w-sm">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-foreground"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "44px", lineHeight: 1 }}
                >
                  {String(trainers.length).padStart(2, "0")}
                </span>
                <span className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
                  / elite&nbsp;coaches
                </span>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => scrollBy("left")}
                  disabled={!canLeft}
                  aria-label="Previous trainers"
                  className={cn(
                    "w-11 h-11 border flex items-center justify-center transition-all duration-200 cursor-pointer",
                    canLeft
                      ? "border-border text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
                      : "border-border/20 text-foreground/15 cursor-not-allowed"
                  )}
                >
                  <ArrowLeft size={16} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => scrollBy("right")}
                  disabled={!canRight}
                  aria-label="Next trainers"
                  className={cn(
                    "w-11 h-11 border flex items-center justify-center transition-all duration-200 cursor-pointer",
                    canRight
                      ? "border-border text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
                      : "border-border/20 text-foreground/15 cursor-not-allowed"
                  )}
                >
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* ── RIGHT FILM-STRIP — horizontal scroll ── */}
          <div className="lg:col-span-8 min-w-0 relative">
            {/* right edge fade only (cards bleed off-screen to the right) */}
            <div
              className={cn(
                "absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-opacity duration-300 hidden lg:block",
                canRight ? "opacity-100" : "opacity-0"
              )}
              style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
            />

            <div
              ref={trackRef}
              className="flex overflow-x-auto scrollbar-hide pb-2 cursor-grab active:cursor-grabbing select-none px-6 lg:pl-0 lg:pr-6"
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              role="list"
              aria-label="Trainer profiles"
            >
              <div ref={wrapRef} className="flex gap-5">
                {trainers.map((trainer, i) => (
                  <div
                    key={trainer.id}
                    data-trainer-card
                    role="listitem"
                    className="relative"
                  >
                    {/* Index number — top-left of photo */}
                    <span
                      className="absolute top-3 left-3 z-10 text-white/25 font-black leading-none pointer-events-none select-none"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        fontSize: "56px",
                        lineHeight: 1,
                      }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <TrainerCard trainer={trainer} />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
