import Link from "next/link";
import { Zap } from "@/components/ui/animated-icons";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { ShopNavActions } from "@/components/ui/ShopNavActions";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Shop-specific navbar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 h-[60px] flex items-center justify-between gap-6">
          {/* Logo */}
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

          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase flex-1"
            style={{ fontFamily: "var(--font-oswald)" }}>
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-foreground">Shop</span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeSwitcher />
            <ShopNavActions />
          </div>
        </div>
      </header>

      <main className="pt-[60px]">
        {children}
      </main>
    </div>
  );
}
