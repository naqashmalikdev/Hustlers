"use client";

import React, { createContext, useContext, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import type Lenis from "lenis";

interface LenisContextValue {
  lenis: Lenis | undefined;
}

const LenisContext = createContext<LenisContextValue>({ lenis: undefined });

export function useSmoothScroll(): LenisContextValue {
  return useContext(LenisContext);
}

function LenisContextBridge({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  return (
    <LenisContext.Provider value={{ lenis }}>
      {children}
    </LenisContext.Provider>
  );
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisOptions = {
    lerp: 0.08,
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  };

  return (
    <ReactLenis
      root
      options={lenisOptions}
    >
      <LenisContextBridge>{children}</LenisContextBridge>
    </ReactLenis>
  );
}
