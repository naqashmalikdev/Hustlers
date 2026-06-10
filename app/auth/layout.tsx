import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      {/* Brand glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, color-mix(in srgb, var(--foreground) 6%, transparent) 0%, transparent 70%)",
        }}
      />
      {/* Theme toggle */}
      <div className="absolute top-5 right-5 z-10">
        <ThemeSwitcher />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <span className="font-bebas text-4xl tracking-widest text-foreground">
              HUST<span className="text-primary">LERS</span>
            </span>
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
