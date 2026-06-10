"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, Heart, Zap, Dumbbell, Timer, Target } from "@/components/ui/animated-icons";
import type { GymClass } from "@/data/classes";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Flame, Heart, Zap, Dumbbell, Timer, Target,
};

function intensityLabel(n: number) {
  if (n <= 4) return "LOW";
  if (n <= 7) return "MED";
  return "HIGH";
}

interface ClassCardProps {
  gymClass: GymClass;
  className?: string;
  /** When true the card fills its grid cell (h-full) instead of locking a 3:4 aspect — used by the bento grid. */
  fill?: boolean;
  /** Larger type for the featured bento tile. */
  featured?: boolean;
}

export function ClassCard({ gymClass, className, fill = false, featured = false }: ClassCardProps) {
  const Icon = iconMap[gymClass.iconName] ?? Flame;
  const lvl  = intensityLabel(gymClass.intensity);

  return (
    <motion.article
      className={cn(
        "group relative overflow-hidden cursor-pointer rounded-2xl transition-shadow duration-300 hover:shadow-[var(--shadow-brand)]",
        fill ? "h-full" : "aspect-[3/4]",
        className
      )}
      whileHover="hover"
      initial="rest"
    >
      {/* ── Photo ── */}
      <motion.div
        className="absolute inset-0"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.07 } }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        suppressHydrationWarning
      >
        {gymClass.imageSrc && (
          <Image
            src={gymClass.imageSrc}
            alt={gymClass.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center"
          />
        )}
      </motion.div>

      {/* Base overlay — always on, strong bottom dark */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* Hover: red bleed from bottom */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.45 }}
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.22) 40%, transparent 70%)",
        }}
      />

      {/* ── TOP: icon + intensity ── */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-start justify-between z-10">
        {/* Icon box */}
        <motion.div
          className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/25 bg-black/50 backdrop-blur-sm text-white"
          variants={{ rest: { borderColor: "rgba(255,255,255,0.25)" }, hover: { borderColor: "rgba(255,255,255,0.85)" } }}
          transition={{ duration: 0.3 }}
        >
          <Icon size={15} />
        </motion.div>

        {/* Intensity */}
        <span
          className={cn(
            "text-[9px] font-black tracking-[0.25em] px-2.5 py-1 backdrop-blur-sm border",
            lvl === "HIGH"
              ? "text-black bg-white border-white"
              : lvl === "MED"
              ? "text-white border-white/60 bg-black/50"
              : "text-white/70 border-white/30 bg-black/40"
          )}
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          {lvl}
        </span>
      </div>

      {/* ── BOTTOM: text content ── */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 z-10">

        {/* Accent rule */}
        <motion.div
          className="h-[2px] bg-white mb-3 origin-left"
          variants={{ rest: { width: "28px" }, hover: { width: "48px" } }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Name */}
        <h3
          className="text-white uppercase leading-none tracking-tight"
          style={{
            fontFamily: "var(--font-bebas-neue)",
            fontSize: featured ? "clamp(36px, 4.5vw, 60px)" : "clamp(26px, 3.5vw, 34px)",
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          {gymClass.name}
        </h3>

        {/* Stats */}
        <div
          className="flex items-center gap-2 mt-1.5 mb-3 text-[10px] tracking-widest uppercase"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          <span className="text-white/50">{gymClass.duration} MIN</span>
          <span className="text-white/20">—</span>
          <span className="text-white font-bold">{gymClass.caloriesBurned} KCAL</span>
        </div>

        {/* Description — revealed on hover */}
        <motion.p
          className="text-white/65 text-xs leading-relaxed line-clamp-2 mb-4"
          variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
        >
          {gymClass.description}
        </motion.p>

        {/* Schedule dots */}
        <div className="flex gap-1.5">
          {["M","T","W","T","F","S","S"].map((d, i) => {
            const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
            const active = gymClass.schedule.includes(days[i]);
            return (
              <span
                key={i}
                className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-bold border transition-colors duration-200",
                  active
                    ? "border-white text-white bg-white/15"
                    : "border-white/15 text-white/20"
                )}
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                {d}
              </span>
            );
          })}
        </div>
      </div>

      {/* Left accent bar — slides up on hover */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#f02b39] origin-bottom"
        variants={{ rest: { scaleY: 0 }, hover: { scaleY: 1 } }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </motion.article>
  );
}
