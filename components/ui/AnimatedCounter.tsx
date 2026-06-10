"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  unit: string;
  label: string;
  className?: string;
}

export function AnimatedCounter({ value, unit, label, className }: AnimatedCounterProps) {
  const numRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const numEl = numRef.current;
    const container = containerRef.current;
    if (!numEl || !container) return;

    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: value,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => { numEl.textContent = Math.round(obj.val).toString(); },
          });
        },
      });
    }, container);

    return () => ctx.revert();
  }, [value]);

  return (
    <div ref={containerRef} className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-baseline gap-0.5">
        <span
          ref={numRef}
          className="text-primary font-bold leading-none"
          style={{ fontFamily: "var(--font-oswald)", fontSize: "2.75rem" }}
        >
          0
        </span>
        <span
          className="text-foreground font-medium leading-none text-xl"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          {unit}
        </span>
      </div>
      <span className="text-muted-foreground text-[10px] uppercase tracking-widest">{label}</span>
    </div>
  );
}
