import Link from "next/link";
import { Zap, Lock } from "@/components/ui/animated-icons";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6 h-[60px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 focus-visible:outline-none">
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
          <div className="flex items-center gap-4">
            <span
              className="hidden sm:flex items-center gap-1.5 text-muted-foreground text-[10px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              <Lock size={11} /> Secure Checkout
            </span>
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
