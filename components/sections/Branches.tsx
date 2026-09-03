"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock } from "@/components/ui/animated-icons";

const MAPS_URL = "https://maps.app.goo.gl/YvQWJ9SyqYCsg1sh7";

export function Branches() {
  return (
    <section id="branches" className="border-t border-border" aria-label="Location">
      <div className="max-w-screen-2xl mx-auto px-6 pt-24 pb-24">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="chip">
            <span className="inline-block h-1.5 w-1.5 bg-primary" />
            Our Location
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">[ LAHORE, PAKISTAN ]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pt-10 pb-10 items-end">
          <h2
            className="lg:col-span-8 text-foreground uppercase leading-[0.82] tracking-[-0.03em]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(56px, 11vw, 150px)" }}
          >
            Find<span style={{ color: "transparent", WebkitTextStroke: "1.5px var(--primary)" }}>Us</span>
          </h2>
          <p className="lg:col-span-4 text-muted-foreground text-[15px] leading-relaxed lg:pb-3">
            The best gym in Johar Town, Lahore — 876 &amp; 877 R1, near KIPS Academy. Open Mon–Sat, 6 AM to midnight.
          </p>
        </div>

        {/* Card */}
        <div className="border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Image */}
            <div className="relative min-h-[320px] lg:min-h-[480px]">
              <Image
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&h=600&fit=crop&q=80&auto=format"
                alt="Hustlers Gym – Johar Town, Lahore"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 55%)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-white/60 text-[10px] tracking-[0.3em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
                  Lahore, Pakistan
                </p>
                <h3
                  className="text-white uppercase leading-[0.9]"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(30px, 4.5vw, 56px)", letterSpacing: "-0.02em" }}
                >
                  Johar Town
                </h3>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {[
                {
                  icon: MapPin,
                  label: "Address",
                  val: "876 & 877 R1, Johar Town, Lahore — Near KIPS Academy",
                  href: MAPS_URL,
                },
                {
                  icon: Phone,
                  label: "Phone",
                  val: "+92 336 4404573",
                },
                {
                  icon: Clock,
                  label: "Hours",
                  val: "Mon–Sat: 6:00 AM – 12:00 AM | Closed Sunday",
                },
              ].map(({ icon: Icon, label, val, href }) => (
                <div key={label} className="flex items-start gap-4 px-7 py-6 border-b border-border">
                  <span className="w-9 h-9 rounded-lg border border-border flex items-center justify-center shrink-0 text-foreground mt-0.5">
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-oswald)" }}>
                      {label}
                    </p>
                    {href ? (
                      <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground text-sm leading-snug underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors duration-200"
                      >
                        {val}
                      </Link>
                    ) : (
                      <p className="text-foreground text-sm leading-snug">{val}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-auto px-7 py-7">
                <Link
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get directions to Hustlers Gym on Google Maps"
                  className="group flex w-full items-center justify-between gap-4 rounded-xl bg-primary px-6 py-5 text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_32px_-12px_var(--primary)]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                      <MapPin size={18} />
                    </span>
                    <span>
                      <span
                        className="block text-[15px] font-bold uppercase tracking-[0.12em]"
                        style={{ fontFamily: "var(--font-condensed)" }}
                      >
                        Get Directions
                      </span>
                      <span className="mt-0.5 block text-xs text-primary-foreground/70">
                        Open location in Google Maps
                      </span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-xl transition-transform duration-200 group-hover:translate-x-1">
                    ↗
                  </span>
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
