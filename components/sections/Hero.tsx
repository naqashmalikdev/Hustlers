"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ArrowRight, Star } from "@/components/ui/animated-icons";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

/* Self-hosted gym background loop (1080p, ~21s) shipped in /public.
   Self-hosting avoids the external CDN's hotlink 403s — the clip now
   loads reliably. If it ever fails, the gym poster image stays visible. */
const HERO_VIDEO = "/hero.mp4";
const HERO_POSTER =
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85&auto=format&fit=crop";

const NAV = [
  { label: "Location", id: "branches" },
  { label: "Timetable", id: "timetable" },
  { label: "Shop", id: "supplements" },
  { label: "Contact", id: "contact" },
];

const STATS = [
  { value: "2K+", label: "Members" },
  { value: "12+", label: "Coaches" },
  { value: "1", label: "Location" },
];

export function Hero() {
  const { lenis } = useSmoothScroll();
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return; // content is visible by default — no motion for sensitive users

      // ── Load reveal ──
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-nav", { y: -24, autoAlpha: 0, duration: 0.6 })
        .from(".hero-chip", { y: 16, autoAlpha: 0, duration: 0.5 }, "-=0.25")
        .from(".hero-line", { yPercent: 115, duration: 0.95, stagger: 0.1 }, "-=0.2")
        .from(".hero-sub", { y: 16, autoAlpha: 0, duration: 0.55 }, "-=0.55")
        .from(".hero-cta", { y: 16, autoAlpha: 0, duration: 0.55 }, "-=0.4")
        .from(".hero-rail", { y: 18, autoAlpha: 0, duration: 0.6 }, "-=0.45");

      // ── Scroll-driven: video slowly zooms, content departs upward ──
      gsap.to(videoRef.current, {
        scale: 1.16,
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.to(".hero-inner", {
        yPercent: -16,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
      });

      ScrollTrigger.refresh();
    },
    { scope: root }
  );

  function scrollTo(id: string) {
    if (lenis)
      lenis.scrollTo(`#${id}`, {
        offset: -80,
        duration: 2,
        easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="intro"
      ref={root}
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-black"
      aria-label="Hero"
    >
      {/* ── Background video (parallax target) ── */}
      <video
        ref={videoRef}
        suppressHydrationWarning
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={HERO_POSTER}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full origin-center object-cover object-center grayscale"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      {/* ── Clean monochrome overlays for legibility ── */}
      <div className="pointer-events-none absolute inset-0 bg-black/55" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 46%, rgba(0,0,0,0) 72%), linear-gradient(to top, #000 1%, rgba(0,0,0,0.25) 30%, transparent 56%)",
        }}
      />
      {/* Hairline grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid-lines opacity-40" />

      {/* ── Top bar — minimal, hairline border ── */}
      <nav
        className="hero-nav absolute inset-x-0 top-0 z-30 hidden border-b border-white/10 lg:block"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-8">
          <button
            onClick={() => scrollTo("intro")}
            className="flex cursor-pointer items-center gap-2"
            aria-label="Back to top"
          >
            <Image src="/logo.png" alt="Hustlers Gym" width={36} height={36} className="rounded-md object-contain" />
            <span
              className="text-white"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              Hustlers <span className="text-[#f02b39]">Gym</span>
            </span>
          </button>
          <div className="flex items-center gap-1">
            {NAV.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="cursor-pointer px-4 py-2 text-[13px] text-white/60 transition-colors hover:text-white"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher className="border-white/20 text-white hover:border-white hover:text-white" />
            <button
              onClick={() => scrollTo("contact")}
              className="group flex cursor-pointer items-center gap-2 rounded-lg bg-[#f02b39] px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#d11f2c]"
            >
              Join Now
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Editorial content (vertically centred, left-aligned) ── */}
      <div className="hero-inner relative z-20 my-auto w-full px-6 pt-24 pb-14 md:px-12 md:pt-28 md:pb-16">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-10 lg:grid lg:grid-cols-12 lg:items-end">
          {/* Headline block */}
          <div className="min-w-0 lg:col-span-8">
            <h1
              className="mt-6 uppercase text-white leading-[0.86] tracking-[-0.03em]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(2.75rem, 9vw, 8.5rem)" }}
            >
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="hero-line block">Lahore&apos;s Best Gym</span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="hero-line block text-[#f02b39]">
                  Johar Town
                </span>
              </span>
            </h1>

            <p className="hero-sub mt-7 max-w-md text-[15px] leading-relaxed text-white/65">
              Elite coaching, championship-grade equipment and premium recovery —
              built for people who refuse to settle.
            </p>

            <div className="hero-cta mt-9 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollTo("contact")}
                className="group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#f02b39] px-7 py-3.5 text-[13px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(240,43,57,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#d11f2c]"
              >
                Start Training
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="cursor-pointer rounded-lg border border-white/25 px-7 py-3.5 text-[13px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/5"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Stats + rating rail */}
          <div className="hero-rail min-w-0 lg:col-span-4 lg:pb-2">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-0.5 text-[#f02b39]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className="fill-[#f02b39]" />
                ))}
              </div>
              <span className="text-[13px] text-white/60">4.9 · 800+ reviews</span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-white/15 bg-white/10">
              {STATS.map(({ value, label }) => (
                <div key={label} className="bg-black/40 px-3 py-5 text-center backdrop-blur-sm">
                  <div
                    className="text-white"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.9rem", lineHeight: 1 }}
                  >
                    {value}
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/40">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue — pinned to the bottom edge */}
      <div className="hero-inner absolute bottom-8 left-6 z-20 hidden items-center gap-3 text-white/40 md:left-12 lg:flex">
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
          <span className="block h-2 w-1 animate-bounce rounded-full bg-[#f02b39]" />
        </span>
        <span className="text-[11px] uppercase tracking-[0.3em]">Scroll</span>
      </div>
    </section>
  );
}
