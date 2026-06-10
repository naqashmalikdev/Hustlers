import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "@/components/ui/animated-icons";

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  pending:    { label: "Pending",    color: "var(--muted-foreground)"    },
  confirmed:  { label: "Confirmed",  color: "#3b82f6" },
  processing: { label: "Processing", color: "var(--warning)" },
  shipped:    { label: "Shipped",    color: "#8b5cf6" },
  delivered:  { label: "Delivered",  color: "var(--success)" },
  cancelled:  { label: "Cancelled",  color: "var(--primary)" },
  refunded:   { label: "Refunded",   color: "var(--muted-foreground)"    },
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at, order_items(quantity, unit_price, products(name))")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-5">
        <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "var(--font-oswald)" }}>
          My Account
        </p>
        <h1 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2.2rem", letterSpacing: "0.02em" }}
          className="text-foreground uppercase">
          Order History
        </h1>
      </div>

      {!orders?.length ? (
        <div className="bg-card border border-border py-20 text-center">
          <ShoppingBag size={40} className="text-border mx-auto mb-4" />
          <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.5rem" }} className="text-muted-foreground uppercase tracking-widest mb-4">
            No Orders Yet
          </p>
          <Link href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors"
            style={{ fontFamily: "var(--font-oswald)" }}>
            Shop Now <ArrowRight size={12} />
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border divide-y divide-border">
          {orders.map((order) => {
            const st = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
            const items = order.order_items as unknown as { quantity: number; unit_price: number; products: { name: string } | null }[];
            const itemCount = items.reduce((s, i) => s + i.quantity, 0);
            return (
              <Link key={order.id} href={`/account/orders/${order.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-5 hover:bg-card transition-colors group gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                    <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.05rem", letterSpacing: "0.06em" }}
                      className="text-foreground uppercase">{order.order_number}</p>
                    <span className="px-2 py-0.5 text-[9px] tracking-widest uppercase border font-bold"
                      style={{ fontFamily: "var(--font-oswald)", color: st.color, borderColor: `${st.color}40` }}>
                      {st.label}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[10px]">
                    {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
                    &nbsp;&middot;&nbsp;{itemCount} item{itemCount !== 1 ? "s" : ""}
                  </p>
                  <p className="text-muted-foreground text-[10px] mt-1 truncate">
                    {items.slice(0, 2).map(i => i.products?.name).filter(Boolean).join(", ")}
                    {items.length > 2 ? ` +${items.length - 2} more` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.1rem" }} className="text-foreground">
                    PKR {order.total.toLocaleString()}
                  </p>
                  <ArrowRight size={13} className="text-muted-foreground group-hover:text-muted-foreground transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
