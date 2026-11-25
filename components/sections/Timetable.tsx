"use client";

const SLOTS = [
  {
    index: "01",
    label: "Co-Timing",
    sublabel: "Morning · Open to All",
    time: "5:00 AM – 11:00 AM",
    accent: "bg-primary",
    accentText: "text-primary",
    accentBg: "bg-primary/5",
    accentBorder: "border-primary/25",
    tag: "Open to All",
    tagColor: "bg-primary/10 text-primary border-primary/20",
    ladies: false,
  },
  {
    index: "02",
    label: "Ladies Only",
    sublabel: "Afternoon · Women Only",
    time: "11:00 AM – 4:00 PM",
    accent: "bg-purple-500",
    accentText: "text-purple-400",
    accentBg: "bg-purple-500/8",
    accentBorder: "border-purple-500/30",
    tag: "Women Only",
    tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    ladies: true,
  },
  {
    index: "03",
    label: "Co-Timing",
    sublabel: "Evening · Open to All",
    time: "4:00 PM – 5:00 AM",
    accent: "bg-primary",
    accentText: "text-primary",
    accentBg: "bg-primary/5",
    accentBorder: "border-primary/25",
    tag: "Open to All",
    tagColor: "bg-primary/10 text-primary border-primary/20",
    ladies: false,
  },
];

export function Timetable() {
  return (
    <section id="timetable" className="border-t border-border" aria-label="Daily Schedule">

      {/* Header */}
      <div className="max-w-screen-2xl mx-auto px-6 pt-24">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="chip">
            <span className="inline-block h-1.5 w-1.5 bg-primary" />
            Daily Schedule
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">[ MON–SAT / CLOSED SUN ]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pt-10 pb-12 items-end">
          <h2
            className="lg:col-span-8 text-foreground uppercase leading-[0.82] tracking-[-0.03em]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(56px, 11vw, 150px)" }}
          >
            Time
            <span className="block" style={{ color: "transparent", WebkitTextStroke: "1.5px var(--primary)" }}>
              table
            </span>
          </h2>
          <p className="lg:col-span-4 text-muted-foreground text-[15px] leading-relaxed lg:pb-3">
            Three sessions daily — co-ed mornings and evenings with dedicated ladies-only hours in between.
          </p>
        </div>
      </div>

      {/* Schedule cards */}
      <div className="max-w-screen-2xl mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SLOTS.map((slot) => (
            <div
              key={slot.index}
              className={`relative flex flex-col gap-5 rounded-2xl border p-6 overflow-hidden ${slot.accentBg} ${slot.accentBorder}`}
            >
              {/* Watermark number */}
              <span
                className="absolute top-4 right-5 text-[48px] font-black leading-none select-none pointer-events-none opacity-[0.07]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {slot.index}
              </span>

              {/* Top: sublabel + tag */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-bold tracking-[0.3em] uppercase ${slot.accentText}`}
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  {slot.ladies ? "Afternoon" : slot.index === "01" ? "Morning" : "Evening"}
                </span>
                <span className={`text-[9px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full border ${slot.tagColor}`}>
                  {slot.tag}
                </span>
              </div>

              {/* Session name */}
              <p
                className="text-foreground uppercase leading-tight"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(22px, 2.5vw, 30px)", letterSpacing: "-0.02em" }}
              >
                {slot.label}
              </p>

              {/* Divider */}
              <div className={`h-px w-full ${slot.accent} opacity-20`} />

              {/* Time */}
              <div>
                <p className="text-muted-foreground text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-oswald)" }}>
                  Timings
                </p>
                <p className={`font-mono font-semibold ${slot.accentText}`} style={{ fontSize: "clamp(13px, 1.4vw, 15px)" }}>
                  {slot.time}
                </p>
              </div>

              {/* Female class — ladies card only */}
              {slot.ladies && (
                <>
                  <div className="h-px w-full bg-purple-500 opacity-20" />
                  <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-3.5 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-[9px] font-bold tracking-[0.25em] uppercase text-purple-400"
                        style={{ fontFamily: "var(--font-oswald)" }}
                      >
                        Complimentary Class
                      </span>
                      <span className="text-[9px] font-semibold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border border-purple-500/30 bg-purple-500/15 text-purple-300">
                        Free
                      </span>
                    </div>
                    <p
                      className="text-purple-300 uppercase leading-tight"
                      style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.01em" }}
                    >
                      Female Class
                    </p>
                    <p className="font-mono text-purple-400/80 font-semibold text-[12px]">
                      11:30 PM · Daily
                    </p>
                    <ul className="flex flex-col gap-1 mt-1">
                      {["Fat Burn", "Strength Building", "Improve Stamina", "Boost Confidence", "Overall Wellness"].map((b) => (
                        <li key={b} className="flex items-center gap-2 text-[10px] text-purple-300/80">
                          <span className="w-1 h-1 rounded-full bg-purple-400 shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Sunday closed */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 rounded-2xl border border-dashed border-border bg-secondary/20">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-muted-foreground/30 shrink-0" />
            <span className="text-muted-foreground font-semibold text-sm uppercase tracking-widest" style={{ fontFamily: "var(--font-oswald)" }}>
              Sunday
            </span>
          </div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/50 font-bold" style={{ fontFamily: "var(--font-oswald)" }}>
            Closed — Rest Day
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="max-w-screen-2xl mx-auto px-6 pb-24">
        <p className="mt-4 text-muted-foreground/60 text-[11px] leading-relaxed border border-border/50 rounded-lg px-4 py-3 bg-secondary/10">
          <span className="text-foreground/60 font-semibold">Note:</span>{" "}
          Timings may change without prior notice. Please confirm before visiting.
        </p>
      </div>

    </section>
  );
}
