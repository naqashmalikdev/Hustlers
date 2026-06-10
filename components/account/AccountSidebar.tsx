"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, ShoppingBag, LogOut, Zap, Home } from "@/components/ui/animated-icons";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account",        label: "Dashboard",    icon: Home },
  { href: "/account/orders", label: "My Orders",    icon: ShoppingBag },
  { href: "/account/profile",label: "Profile",      icon: User },
];

interface Props { name: string; email: string }

export function AccountSidebar({ name, email }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="lg:w-64 shrink-0">
      {/* Profile card */}
      <div className="bg-card border border-border p-6 mb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-gradient-brand flex items-center justify-center shrink-0 glow-brand">
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }} className="text-primary-foreground">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-foreground text-sm font-medium truncate" style={{ fontFamily: "var(--font-oswald)" }}>
              {name}
            </p>
            <p className="text-muted-foreground text-[10px] truncate">{email}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <Link href="/" className="flex items-center gap-2">
            <Zap size={10} className="text-primary" />
            <span className="text-primary text-[9px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
              HUSTLERS Member
            </span>
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-card border border-border overflow-hidden">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/account" ? pathname === "/account" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-b-0 transition-colors duration-150 group",
                isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="account-nav-indicator"
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <Icon size={14} className={isActive ? "text-primary" : ""} />
              <span className="text-[11px] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
                {label}
              </span>
            </Link>
          );
        })}

        {/* Sign out */}
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-5 py-3.5 text-muted-foreground hover:text-primary hover:bg-secondary transition-colors duration-150 cursor-pointer border-t border-border"
        >
          <LogOut size={14} />
          <span className="text-[11px] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
            Sign Out
          </span>
        </button>
      </nav>
    </aside>
  );
}
