"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag } from "@/components/ui/animated-icons";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";
import { ScrollTrigger } from "@/lib/gsap";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useCart } from "@/providers/CartProvider";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Location", id: "branches" },
  { label: "Timetable", id: "timetable" },
  { label: "Supplements", id: "supplements" },
  { label: "Contact", id: "contact" },
];

// ── Mobile drawer opening choreography ──
const drawerVariants = {
  hidden: { x: "100%" },
  show: {
    x: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] as const },
  },
};

const listVariants = {
  hidden: {},
  show: { transition: { delayChildren: 0.18, staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
};

// Big label rises up from behind an overflow-hidden mask
const labelVariants = {
  hidden: { y: "115%" },
  show: {
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.45, duration: 0.4, ease: "easeOut" as const },
  },
};

export function Navbar() {
  const [pastHero, setPastHero] = useState(false);
  const [active, setActive] = useState("intro");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lenis } = useSmoothScroll();
  const { itemCount, openCart } = useCart();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => {
      const heroH = document.getElementById("intro")?.offsetHeight ?? 600;
      setPastHero(window.scrollY > heroH * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const allLinks = [{ id: "intro" }, ...navLinks];
    const triggers = allLinks.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id),
      });
    });
    return () => {
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  function go(id: string) {
    setMobileOpen(false);
    setTimeout(() => {
      if (lenis)
        lenis.scrollTo(`#${id}`, {
          offset: -80,
          duration: 2,
          easing: (t: number) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        });
      else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

  return (
    <>
      {/* ══════════════════════════════════════
          DESKTOP — slides in after hero
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {pastHero && (
          <motion.header
            key="desktop-nav"
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 inset-x-0 z-50 max-lg:hidden border-b border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="max-w-screen-2xl mx-auto h-16 px-8 flex items-center justify-between gap-6">
              {/* Logo */}
              <button
                onClick={() => go("intro")}
                className="flex items-center gap-2 shrink-0 cursor-pointer focus-visible:outline-none"
                aria-label="Back to top"
              >
                <Image src="/logo.png" alt="Hustlers Gym" width={28} height={28} className="rounded-md object-contain" />
                <span
                  className="uppercase tracking-widest text-foreground"
                  style={{
                    fontFamily: "var(--font-bebas-neue)",
                    fontSize: "1.15rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  Hustlers <span className="text-primary">Gym</span>
                </span>
              </button>

              {/* Links */}
              <nav className="flex items-center" aria-label="Main navigation">
                {navLinks.map(({ label, id }) => {
                  const isActive = active === id;
                  return (
                    <button
                      key={id}
                      onClick={() => go(id)}
                      className={cn(
                        "relative px-4 py-1.5 text-[12px] tracking-wide whitespace-nowrap",
                        "cursor-pointer transition-colors duration-200 focus-visible:outline-none",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute bottom-0 left-4 right-4 h-px bg-primary"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 40,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Right: shop link + cart + theme + CTA */}
              <div className="flex items-center gap-2 shrink-0">
                <ThemeSwitcher />
                <Link
                  href="/shop"
                  className="px-4 py-2 text-muted-foreground hover:text-foreground text-[11px] font-bold tracking-[0.2em] uppercase transition-colors focus-visible:outline-none"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Shop
                </Link>
                <button
                  onClick={openCart}
                  className="relative w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer focus-visible:outline-none"
                  aria-label="Open cart"
                >
                  <ShoppingBag size={14} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => go("contact")}
                  className="px-5 py-2 bg-primary text-primary-foreground text-[11px] font-bold tracking-[0.2em] uppercase cursor-pointer hover:brightness-110 transition-all focus-visible:outline-none"
                  style={{ fontFamily: "var(--font-condensed)" }}
                >
                  Join Now
                </motion.button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          MOBILE TOPBAR — always visible
      ══════════════════════════════════════ */}
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 h-14 lg:hidden",
          "transition-all duration-300",
          pastHero || mobileOpen
            ? "bg-background/95 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        )}
      >
        {/* Logo */}
        <button
          onClick={() => go("intro")}
          className="flex items-center gap-2 cursor-pointer focus-visible:outline-none"
          aria-label="Back to top"
        >
          <Image src="/logo.png" alt="Hustlers Gym" width={28} height={28} className="rounded-md object-contain" />
          <span
            className={cn(
              "uppercase tracking-widest transition-colors duration-300",
              pastHero || mobileOpen ? "text-foreground" : "text-white"
            )}
            style={{
              fontFamily: "var(--font-bebas-neue)",
              fontSize: "1.1rem",
              letterSpacing: "0.1em",
            }}
          >
            Hustlers <span className="text-primary">Gym</span>
          </span>
        </button>

        {/* Right: cart + theme + hamburger */}
        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className={cn(
              "relative w-9 h-9 flex items-center justify-center border cursor-pointer transition-colors focus-visible:outline-none",
              pastHero || mobileOpen
                ? "border-border text-foreground"
                : "border-white/20 text-white"
            )}
            aria-label="Open cart"
          >
            <ShoppingBag size={14} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
          <ThemeSwitcher
            className={cn(
              "transition-colors duration-300",
              !pastHero && !mobileOpen
                ? "border-white/20 text-white hover:border-white hover:text-white"
                : ""
            )}
          />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className={cn(
              "w-9 h-9 flex items-center justify-center cursor-pointer transition-colors border focus-visible:outline-none",
              pastHero || mobileOpen
                ? "border-border text-foreground"
                : "border-white/20 text-white"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={16} />
                </motion.span>
              ) : (
                <motion.span
                  key="m"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* ══════════════════════════════════════
          MOBILE FULLSCREEN DRAWER
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel — slides in from right */}
            <motion.div
              key="drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-50 w-[min(360px,100vw)] bg-background border-l border-border flex flex-col lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-14 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <Image src="/logo.png" alt="Hustlers Gym" width={28} height={28} className="rounded-md object-contain" />
                  <span
                    className="text-foreground uppercase tracking-widest"
                    style={{
                      fontFamily: "var(--font-bebas-neue)",
                      fontSize: "1rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Hustlers <span className="text-primary">Gym</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Nav links — stagger in */}
              <nav
                data-lenis-prevent
                className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-hide"
                aria-label="Mobile navigation"
              >
                {[{ label: "Home", id: "intro" }, ...navLinks].map(
                  ({ label, id }, i) => (
                    <motion.button
                      key={id}
                      initial={{ opacity: 0, x: 32 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.05 + i * 0.055,
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => go(id)}
                      className={cn(
                        "group relative w-full text-left px-6 py-4 border-b border-border",
                        "flex items-center justify-between cursor-pointer",
                        "transition-colors duration-150",
                        active === id
                          ? "bg-primary/5 text-primary"
                          : "text-foreground hover:bg-secondary"
                      )}
                    >
                      {/* Index number */}
                      <span
                        className="text-muted-foreground/30 mr-4 tabular-nums text-sm"
                        style={{ fontFamily: "var(--font-oswald)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span
                        className="flex-1 uppercase tracking-widest"
                        style={{
                          fontFamily: "var(--font-bebas-neue)",
                          fontSize: "1.5rem",
                        }}
                      >
                        {label}
                      </span>

                      {/* Arrow — slides in on hover */}
                      <motion.span
                        className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                        initial={false}
                      >
                        →
                      </motion.span>

                      {/* Active indicator */}
                      {active === id && (
                        <motion.div
                          layoutId="mobile-active"
                          className="absolute left-0 top-0 bottom-0 w-0.75 bg-primary"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 40,
                          }}
                        />
                      )}
                    </motion.button>
                  )
                )}
              </nav>

              {/* Bottom: CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.35, ease: "easeOut" }}
                className="px-6 py-6 border-t border-border shrink-0 space-y-3"
              >
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 border border-border text-foreground text-[12px] font-bold tracking-[0.25em] uppercase cursor-pointer hover:border-foreground/30 hover:bg-secondary transition-colors"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  <ShoppingBag size={15} />
                  Shop Supplements
                </Link>
                <button
                  onClick={() => go("contact")}
                  className="w-full flex items-center justify-center py-3.5 bg-primary text-primary-foreground text-[12px] font-bold tracking-[0.25em] uppercase cursor-pointer hover:bg-primary/90 transition-colors"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Join Now
                </button>
                <p className="text-muted-foreground text-[10px] text-center tracking-wide">
                  Pakistan&apos;s Premier Fitness Destination
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
