"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Thermometer, Droplets, Wind, Leaf } from "@/components/ui/animated-icons";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";
import { gsap } from "@/lib/gsap";

const SAUNA_IMAGE =
  "https://images.unsplash.com/photo-1712659606957-b7395ba9ebb2?w=1200&h=1600&fit=crop&q=80&auto=format";

const stats = [
  { value: 90, unit: "°C", label: "Temperature" },
  { value: 12, unit: "+", label: "Capacity" },
  { value: 6,  unit: "",  label: "Daily Sessions" },
];

const features = [
  { icon: Thermometer, text: "Infrared & traditional Finnish sauna" },
  { icon: Droplets,    text: "Steam room with eucalyptus aromatherapy" },
  { icon: Wind,        text: "Cold plunge contrast therapy" },
  { icon: Leaf,        text: "Private bookings for recovery" },
];

export function SteamSauna() {
  const sectionRef  = useRef<HTMLElement>(null);
  const imageRef    = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLUListElement>(null);
  const { lenis }   = useSmoothScroll();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      /* parallax on image */
      const img = imageRef.current?.querySelector("img");
      if (img) {
        gsap.fromTo(img, { y: "-12%" }, {
          y: "12%",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.8,
          },
        });
      }

      /* stagger features */
      if (featuresRef.current) {
        gsap.fromTo(
          featuresRef.current.querySelectorAll("li"),
          { x: -28, opacity: 0 },
          {
            x: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 87%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, section);
    return () => ctx.revert();
  }, []);

  function scrollTo(id: string) {
    if (lenis) lenis.scrollTo(`#${id}`, { offset: -90 });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="steam-sauna"
      ref={sectionRef}
      className="relative overflow-hidden flex flex-col lg:flex-row border-t border-border"
      aria-label="Steam and Sauna"
    >
      {/* ── LEFT: IMAGE ── */}
      <div
        ref={imageRef}
        className="relative w-full lg:w-[52%] h-[50vh] lg:h-auto lg:self-stretch overflow-hidden"
        suppressHydrationWarning
      >
        {SAUNA_IMAGE && (
          <Image
            src={SAUNA_IMAGE}
            alt="Premium steam and sauna facility"
            fill
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover object-center"
            priority={false}
          />
        )}

        {/* dark scrim from right so text side bleeds in */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0) 50%, var(--background) 100%)" }}
        />

        {/* EXCLUSIVE tag — burned into the photo */}
        <div className="absolute top-6 left-6">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold tracking-[0.25em] uppercase glow-brand"
            style={{ fontFamily: "var(--font-condensed)" }}
          >
            Exclusive — Flagship Only
          </span>
        </div>

        {/* large ghost text on image bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 hidden lg:block">
          <p
            className="text-white/10 font-black uppercase leading-none select-none pointer-events-none"
            style={{
              fontFamily: "var(--font-bebas-neue)",
              fontSize: "clamp(60px, 9vw, 110px)",
              lineHeight: 0.9,
            }}
            aria-hidden="true"
          >
            Recover
          </p>
        </div>
      </div>

      {/* ── RIGHT: CONTENT ── */}
      <div className="relative w-full lg:w-[48%] bg-background flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-24">

        {/* Eyebrow */}
        <p
          className="text-primary text-[11px] tracking-[0.3em] uppercase font-semibold mb-5"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Recovery &amp; Wellness
        </p>

        {/* Title */}
        <div className="mb-7">
          <h2
            className="text-foreground uppercase leading-none"
            style={{
              fontFamily: "var(--font-bebas-neue)",
              fontSize: "clamp(48px, 6vw, 82px)",
              letterSpacing: "-0.01em",
            }}
          >
            Steam
          </h2>
          <h2
            className="uppercase leading-none"
            style={{
              fontFamily: "var(--font-bebas-neue)",
              fontSize: "clamp(48px, 6vw, 82px)",
              letterSpacing: "-0.01em",
              color: "transparent",
              WebkitTextStroke: "2px var(--primary)",
              marginLeft: "clamp(16px, 2.5vw, 40px)",
            }}
          >
            Sauna
          </h2>
        </div>

        {/* Body copy */}
        <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-8">
          At HUSTLERS, recovery is as important as training. Our world-class steam and sauna
          facilities are exclusively available at flagship branches. Accelerate muscle recovery,
          flush toxins, reduce cortisol, and emerge ready to train harder tomorrow.
        </p>

        {/* ── STATS ── */}
        <div className="flex items-stretch gap-0 mb-10 border border-border">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex-1 px-5 py-4 ${i < stats.length - 1 ? "border-r border-border" : ""}`}
            >
              <AnimatedCounter value={stat.value} unit={stat.unit} label={stat.label} />
            </div>
          ))}
        </div>

        {/* ── FEATURES ── */}
        <ul ref={featuresRef} className="flex flex-col gap-0 mb-10 border-t border-border">
          {features.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-4 py-3.5 border-b border-border"
            >
              <span className="w-8 h-8 border border-border flex items-center justify-center shrink-0 text-brand">
                <Icon size={15} />
              </span>
              <span className="text-foreground text-sm">{text}</span>
            </li>
          ))}
        </ul>

        {/* ── CTA ── */}
        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollTo("contact")}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-primary text-primary-foreground text-[12px] font-bold tracking-[0.2em] uppercase cursor-pointer hover:brightness-110 hover:-translate-y-0.5 glow-brand transition-all duration-200"
            style={{ fontFamily: "var(--font-condensed)" }}
          >
            Book a Session
            <span aria-hidden="true" className="text-base leading-none">→</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
