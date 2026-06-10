"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, Tag, BarChart3,
  LogOut, Zap, ExternalLink,
} from "@/components/ui/animated-icons";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin",           label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products",  label: "Products",  icon: Package },
  { href: "/admin/orders",    label: "Orders",    icon: ShoppingBag },
  { href: "/admin/coupons",   label: "Coupons",   icon: Tag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

interface Props { name: string }

export function AdminSidebar({ name }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="w-60 shrink-0 bg-secondary border-r border-border flex flex-col min-h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 h-16 flex items-center border-b border-border shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-brand flex items-center justify-center glow-brand">
            <Zap size={13} className="text-primary-foreground fill-primary-foreground" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", letterSpacing: "0.08em" }}
            className="text-foreground uppercase">
            HUST<span className="text-primary">LERS</span>
          </span>
        </Link>
        <span className="ml-auto px-1.5 py-0.5 bg-primary/15 text-primary text-[8px] tracking-widest uppercase border border-primary/30"
          style={{ fontFamily: "var(--font-oswald)" }}>
          Admin
        </span>
      </div>

      {/* Admin name */}
      <div className="px-5 py-4 border-b border-border">
        <p className="text-muted-foreground text-[9px] tracking-[0.2em] uppercase mb-0.5" style={{ fontFamily: "var(--font-oswald)" }}>Signed in as</p>
        <p className="text-muted-foreground text-xs truncate">{name}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 px-5 py-3 transition-colors duration-150",
                isActive
                  ? "text-foreground bg-primary/8"
                  : "text-muted-foreground hover:text-muted-foreground hover:bg-card"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-nav-indicator"
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <Icon size={15} className={isActive ? "text-primary" : ""} />
              <span className="text-[11px] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border py-2">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-5 py-3 text-muted-foreground hover:text-muted-foreground transition-colors">
          <ExternalLink size={14} />
          <span className="text-[11px] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
            View Site
          </span>
        </Link>
        <button onClick={signOut}
          className="w-full flex items-center gap-3 px-5 py-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer">
          <LogOut size={14} />
          <span className="text-[11px] tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
