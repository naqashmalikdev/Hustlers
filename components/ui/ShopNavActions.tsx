"use client";

import { ShoppingBag, User } from "@/components/ui/animated-icons";
import Link from "next/link";
import { useCart } from "@/providers/CartProvider";

export function ShopNavActions() {
  const { itemCount, openCart } = useCart();

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/account"
        className="w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
        aria-label="Account"
      >
        <User size={15} />
      </Link>

      <button
        onClick={openCart}
        className="relative w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
        aria-label="Open cart"
      >
        <ShoppingBag size={15} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        )}
      </button>
    </div>
  );
}
