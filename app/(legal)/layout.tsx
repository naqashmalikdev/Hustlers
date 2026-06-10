import Link from "next/link";
import { Zap, ArrowLeft } from "@/components/ui/animated-icons";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Footer } from "@/components/layout/Footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Slim header — logo + back to site */}
      <header className="fixed top-0 inset-x-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 h-[60px] flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0 focus-visible:outline-none">
            <div className="w-7 h-7 rounded-md bg-gradient-brand flex items-center justify-center glow-brand">
              <Zap size={13} className="text-primary-foreground fill-primary-foreground" />
            </div>
            <span
              className="uppercase tracking-widest text-foreground"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", letterSpacing: "0.08em" }}
            >
              HUST<span className="text-primary">LERS</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="group hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              <ArrowLeft size={14} />
              Back to site
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="pt-[60px] flex-1">{children}</main>

      <Footer />
    </div>
  );
}
