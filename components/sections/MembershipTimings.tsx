"use client";

import { branches } from "@/data/branches";

const { timings } = branches[0];

export function MembershipTimings() {
  return (
    <section
      id="membership"
      className="border-t border-border bg-background"
      aria-label="Opening Hours"
    >
      <div className="max-w-screen-2xl mx-auto px-6 pt-24 pb-24">

        {/* ── HEADER BAND ── */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="chip">
            <span className="inline-block h-1.5 w-1.5 bg-primary" />
            Gym Hours
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            [ MON–SAT / CLOSED&nbsp;SUN ]
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pt-10 pb-12 items-end">
          <h2
            className="lg:col-span-8 text-foreground uppercase leading-[0.82] tracking-[-0.03em]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(48px, 9vw, 132px)" }}
          >
            Opening
            <span className="block" style={{ color: "transparent", WebkitTextStroke: "1.5px var(--primary)" }}>
              Hours
            </span>
          </h2>
          <p className="lg:col-span-4 text-muted-foreground text-[15px] leading-relaxed lg:pb-3">
            Train Monday to Saturday across morning, afternoon and evening sessions — with dedicated ladies&apos; hours every day.
          </p>
        </div>

        {/* ── TIMINGS TABLE ── */}
        <div className="max-w-2xl border border-border rounded-2xl flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <h3
              className="text-foreground uppercase"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(22px, 3vw, 30px)", letterSpacing: "-0.01em" }}
            >
              Gym Timings
            </h3>
            <span
              className="text-muted-foreground text-[10px] tracking-[0.25em] uppercase"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Closed Sun
            </span>
          </div>

          <div className="flex flex-col px-6 flex-1">
            {timings?.map((slot, i) => (
              <div
                key={slot.label}
                className="flex items-center justify-between gap-4 py-5 border-b border-border last:border-b-0"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-muted-foreground/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-muted-foreground text-[11px] tracking-[0.18em] uppercase"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    {slot.label}
                  </span>
                </span>
                <span
                  className="text-foreground shrink-0 text-right"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(15px, 2vw, 20px)" }}
                >
                  {slot.time}
                </span>
              </div>
            ))}
          </div>

          <div className="px-6 py-5 mt-auto border-t border-border">
            <span
              className="inline-block border border-border px-4 py-2 text-muted-foreground text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-condensed)" }}
            >
              Sunday — Rest Day
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
