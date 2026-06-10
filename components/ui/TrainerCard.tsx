"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Trainer } from "@/data/trainers";

const MotionLink = motion.create(Link);
import { cn } from "@/lib/utils";

function InstagramIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

interface TrainerCardProps {
  trainer: Trainer;
  className?: string;
}

export function TrainerCard({ trainer, className }: TrainerCardProps) {
  return (
    <motion.article
      className={cn(
        "relative w-72 flex-shrink-0 group cursor-pointer rounded-2xl transition-shadow duration-300 hover:shadow-[var(--shadow-brand)]",
        className
      )}
      whileHover="hover"
      initial="rest"
    >
      {/* ── PHOTO BLOCK ── */}
      <div className="relative w-full overflow-hidden rounded-t-2xl" style={{ height: "420px" }}>
        {/* Photo */}
        <motion.div
          className="absolute inset-0"
          variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          suppressHydrationWarning
        >
          {trainer.imageSrc && (
            <Image
              src={trainer.imageSrc}
              alt={trainer.name}
              fill
              sizes="288px"
              className="object-cover object-top"
            />
          )}
        </motion.div>

        {/* Bottom-heavy scrim */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.0) 75%)",
          }}
        />

        {/* Experience pill — top right */}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-white text-black text-[10px] font-bold tracking-widest uppercase">
          {trainer.experience}Y
        </div>

        {/* ── NAME + SPECIALTY over photo ── */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {/* Accent rule */}
          <div className="w-8 h-[3px] bg-white mb-3" />

          <h3
            className="text-white uppercase leading-none tracking-tight"
            style={{
              fontFamily: "var(--font-bebas-neue)",
              fontSize: "clamp(28px, 5vw, 36px)",
            }}
          >
            {trainer.name}
          </h3>

          <p
            className="text-white/70 text-[10px] tracking-[0.2em] uppercase mt-1 font-medium"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {trainer.specialty}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-1 mt-3">
            {trainer.badges.slice(0, 3).map((badge) => (
              <span
                key={badge}
                className="px-2 py-0.5 text-[9px] font-semibold tracking-widest uppercase text-white/60 border border-white/20"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── INFO STRIP ── */}
      <div className="bg-card border border-border border-t-0 rounded-b-2xl px-5 py-4 transition-colors duration-300 group-hover:border-primary/40">
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
          {trainer.bio}
        </p>

        <div className="flex items-center justify-between mt-4">
          {/* Socials */}
          <div className="flex gap-2">
            {trainer.socials.instagram && (
              <MotionLink
                href={trainer.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${trainer.name} on Instagram`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-[#E1306C] transition-colors duration-200 cursor-pointer border border-border hover:border-[#E1306C]/40"
              >
                <InstagramIcon />
              </MotionLink>
            )}
            {trainer.socials.youtube && (
              <MotionLink
                href={trainer.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${trainer.name} on YouTube`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-[#FF0000] transition-colors duration-200 cursor-pointer border border-border hover:border-[#FF0000]/40"
              >
                <YouTubeIcon />
              </MotionLink>
            )}
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase bg-primary text-primary-foreground hover:brightness-110 transition-all duration-200 cursor-pointer"
            style={{ fontFamily: "var(--font-condensed)" }}
          >
            Profile
          </motion.button>
        </div>
      </div>

    </motion.article>
  );
}
