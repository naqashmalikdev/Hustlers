"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";

const MotionLink = motion.create(Link);

const quickLinks = [
  { label: "Location",    id: "branches" },
  { label: "Timetable",   id: "timetable" },
  { label: "Supplements", id: "supplements" },
  { label: "Contact Us",  id: "contact" },
];

function InstagramIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
export function Footer() {
  const { lenis } = useSmoothScroll();

  function scrollTo(id: string) {
    // On pages without the homepage sections (e.g. /privacy, /terms),
    // route home to the target section instead of silently doing nothing.
    if (!document.getElementById(id)) {
      window.location.href = `/#${id}`;
      return;
    }
    if (lenis) lenis.scrollTo(`#${id}`, {
      offset: -90,
      duration: 2,
      easing: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <footer className="border-t border-border bg-background" aria-label="Site footer">

      {/* ── TOP STRIP — big brand statement ── */}
      <div className="border-b border-border overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 py-12">
          <p
            className="text-foreground uppercase leading-[0.92]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(40px, 7vw, 84px)",
              letterSpacing: "-0.02em",
            }}
          >
            Outwork. Outlast. <span className="text-primary">Outshine.</span>
          </p>
        </div>
      </div>

      {/* ── MAIN COLUMNS ── */}
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border">

          {/* Brand */}
          <div className="py-10 md:pr-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <Image src="/logo.png" alt="Hustlers Gym" width={32} height={32} className="rounded-lg object-contain" />
              <span
                className="uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "23px",
                  letterSpacing: "0.08em",
                }}
              >
                Hustlers <span className="text-primary">Gym</span>
              </span>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              Johar Town&apos;s biggest gym — elite coaching, championship-grade equipment, and premium facilities for those who refuse to settle.
            </p>

            <div className="flex gap-2">
              {[
                { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/hustlers.pk" },
                { icon: FacebookIcon,  label: "Facebook",  href: "https://www.facebook.com/hustlers.pk" },
              ].map(({ icon: Icon, label, href }) => (
                <MotionLink
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <Icon />
                </MotionLink>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="py-10 md:px-10">
            <p
              className="text-muted-foreground text-[9px] tracking-[0.25em] uppercase mb-5"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Quick Links
            </p>
            <ul className="flex flex-col gap-2">
              {quickLinks.map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="text-foreground text-sm hover:text-primary transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:underline"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="py-10 md:pl-10">
            <p
              className="text-muted-foreground text-[9px] tracking-[0.25em] uppercase mb-5"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Contact
            </p>
            <div className="flex flex-col gap-3">
              <p className="text-foreground text-sm">+92 336 4404573</p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Hustlers Gym. All Rights Reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-muted-foreground text-xs hover:text-primary transition-colors duration-200 cursor-pointer"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground text-xs hover:text-primary transition-colors duration-200 cursor-pointer"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
