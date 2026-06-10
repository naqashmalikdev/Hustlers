import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Package, Clock } from "@/components/ui/animated-icons";
import type { Order } from "@/lib/supabase/types";

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "Pending",    color: "var(--muted-foreground)",    bg: "var(--border)" },
  confirmed:  { label: "Confirmed",  color: "#3b82f6", bg: "var(--secondary)" },
  processing: { label: "Processing", color: "var(--warning)", bg: "var(--secondary)" },
  shipped:    { label: "Shipped",    color: "#8b5cf6", bg: "var(--secondary)" },
  delivered:  { label: "Delivered",  color: "var(--success)", bg: "var(--accent)" },
  cancelled:  { label: "Cancelled",  color: "var(--primary)", bg: "var(--secondary)" },
  refunded:   { label: "Refunded",   color: "var(--muted-foreground)",    bg: "var(--border)" },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at, order_items(quantity)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const totalOrders = orders?.length ?? 0;
  const totalSpent = orders?.reduce((s, o) => s + o.total, 0) ?? 0;

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="border-b border-border pb-5">
        <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "var(--font-oswald)" }}>
          My Account
        </p>
        <h1 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2.2rem", letterSpacing: "0.02em" }}
          className="text-foreground uppercase">
          Dashboard
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total Orders", value: totalOrders, icon: ShoppingBag },
          { label: "Total Spent",  value: `PKR ${totalSpent.toLocaleString()}`, icon: Package },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={14} className="text-primary" />
              <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
                {label}
              </p>
            </div>
            <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.8rem" }} className="text-foreground">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-card border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-primary" />
            <span className="text-foreground text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
              Recent Orders
            </span>
          </div>
          <Link href="/account/orders"
            className="flex items-center gap-1 text-muted-foreground hover:text-muted-foreground text-[10px] tracking-widest uppercase transition-colors"
            style={{ fontFamily: "var(--font-oswald)" }}>
            View All <ArrowRight size={11} />
          </Link>
        </div>

        {!orders?.length ? (
          <div className="py-14 text-center">
            <ShoppingBag size={32} className="text-border mx-auto mb-3" />
            <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.3rem" }} className="text-muted-foreground uppercase tracking-widest">
              No orders yet
            </p>
            <Link href="/shop"
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors"
              style={{ fontFamily: "var(--font-oswald)" }}>
              Shop Now <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {orders.map((order) => {
              const st = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
              const itemCount = (order.order_items as unknown as { quantity: number }[]).reduce((s, i) => s + i.quantity, 0);
              return (
                <li key={order.id}>
                  <Link href={`/account/orders/${order.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-card transition-colors group">
                    <div>
                      <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1rem", letterSpacing: "0.06em" }}
                        className="text-foreground uppercase">
                        {order.order_number}
                      </p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">
                        {itemCount} item{itemCount !== 1 ? "s" : ""} &middot; {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-0.5 text-[9px] tracking-widest uppercase border font-bold"
                        style={{ fontFamily: "var(--font-oswald)", color: st.color, borderColor: `${st.color}40`, background: `${st.bg}` }}>
                        {st.label}
                      </span>
                      <div className="text-right">
                        <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1rem" }} className="text-foreground">
                          PKR {order.total.toLocaleString()}
                        </p>
                      </div>
                      <ArrowRight size={13} className="text-muted-foreground group-hover:text-muted-foreground transition-colors" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
