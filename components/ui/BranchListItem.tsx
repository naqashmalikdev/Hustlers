"use client";

import { motion } from "framer-motion";
import type { Branch } from "@/data/branches";
import { cn } from "@/lib/utils";

interface BranchListItemProps {
  branch: Branch;
  isActive: boolean;
  onClick: () => void;
  index: number;
  className?: string;
}

export function BranchListItem({ branch, isActive, onClick, index, className }: BranchListItemProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "w-full text-left relative border-b border-border cursor-pointer group",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
        "transition-colors duration-200",
        isActive ? "bg-primary/5" : "hover:bg-secondary/40",
        className
      )}
    >
      {/* Active left bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary origin-top"
        animate={{ scaleY: isActive ? 1 : 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />

      <div className="flex items-center gap-4 px-5 py-5">
        {/* Index number */}
        <span
          className={cn(
            "text-[11px] font-black font-mono w-5 shrink-0 transition-colors duration-200",
            isActive ? "text-primary" : "text-muted-foreground/30"
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "uppercase leading-none transition-colors duration-200",
              isActive ? "text-primary" : "text-foreground"
            )}
            style={{
              fontFamily: "var(--font-bebas-neue)",
              fontSize: "22px",
              letterSpacing: "0.04em",
            }}
          >
            {branch.name}
          </h3>
          <p
            className="text-muted-foreground text-[10px] tracking-[0.15em] uppercase mt-1"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {branch.city}
            {branch.isFlexFit && (
              <span className="ml-2 text-muted-foreground/50">· Flagship</span>
            )}
            {branch.hasSteamSauna && (
              <span className="ml-2 text-primary">· Steam &amp; Sauna</span>
            )}
          </p>
        </div>

        {/* Hours */}
        <p className="text-muted-foreground/50 text-[9px] tracking-wide text-right hidden sm:block shrink-0">
          {branch.hours.split("–")[0].trim()}<br />
          <span className="text-muted-foreground/30">–{branch.hours.split("–")[1]}</span>
        </p>
      </div>
    </button>
  );
}
