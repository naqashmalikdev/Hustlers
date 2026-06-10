import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package } from "@/components/ui/animated-icons";

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "Pending",    color: "var(--muted-foreground)",    bg: "var(--border)" },
  confirmed:  { label: "Confirmed",  color: "#3b82f6", bg: "var(--secondary)" },
  processing: { label: "Processing", color: "var(--warning)", bg: "var(--secondary)" },
  shipped:    { label: "Shipped",    color: "#8b5cf6", bg: "var(--secondary)" },
  delivered:  { label: "Delivered",  color: "var(--success)", bg: "var(--accent)" },
  cancelled:  { label: "Cancelled",  color: "var(--primary)", bg: "var(--secondary)" },
  refunded:   { label: "Refunded",   color: "var(--muted-foreground)",    bg: "var(--border)" },
};

interface Props { params: Promise<{ id: string }> }

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, images, brand))")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!order) notFound();

  const st = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;
  const addr = order.shipping_address as Record<string, string>;
  const items = order.order_items as unknown as {
    id: string; quantity: number; unit_price: number; flavor: string | null; subtotal: number;
    products: { name: string; images: string[]; brand: string } | null;
  }[];

  const STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];
  const currentStep = STEPS.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-5">
        <Link href="/account/orders"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-muted-foreground text-[10px] tracking-widest uppercase mb-4 transition-colors"
          style={{ fontFamily: "var(--font-oswald)" }}>
          <ArrowLeft size={12} /> Back to Orders
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "var(--font-oswald)" }}>Order Details</p>
            <h1 style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "2rem", letterSpacing: "0.04em" }} className="text-foreground uppercase">
              {order.order_number}
            </h1>
            <p className="text-muted-foreground text-[11px] mt-1">
              Placed {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <span className="px-3 py-1.5 text-[10px] tracking-widest uppercase border font-bold mt-1"
            style={{ fontFamily: "var(--font-oswald)", color: st.color, borderColor: `${st.color}40`, background: st.bg }}>
            {st.label}
          </span>
        </div>
      </div>

      {/* Progress tracker */}
      {!["cancelled", "refunded"].includes(order.status) && (
        <div className="bg-card border border-border p-5">
          <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-5" style={{ fontFamily: "var(--font-oswald)" }}>
            Order Progress
          </p>
          <div className="flex items-center gap-0">
            {STEPS.map((step, idx) => {
              const done = idx <= currentStep;
              const isLast = idx === STEPS.length - 1;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-7 h-7 flex items-center justify-center border-2 transition-colors ${done ? "border-primary bg-primary" : "border-muted-foreground bg-transparent"}`}>
                      <Package size={11} className={done ? "text-primary-foreground" : "text-muted-foreground"} />
                    </div>
                    <p className={`text-[8px] tracking-widest uppercase whitespace-nowrap ${done ? "text-primary" : "text-muted-foreground"}`}
                      style={{ fontFamily: "var(--font-oswald)" }}>
                      {step}
                    </p>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-[2px] mx-1 -mt-4 ${idx < currentStep ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-card border border-border">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-foreground text-[11px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-oswald)" }}>
              Items ({items.length})
            </p>
          </div>
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 p-5">
                <div className="relative w-16 h-16 shrink-0 bg-border overflow-hidden">
                  {item.products?.images?.[0] && (
                    <Image src={item.products.images[0]} alt={item.products.name} fill sizes="64px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-muted-foreground text-[9px] tracking-widest uppercase mb-0.5" style={{ fontFamily: "var(--font-oswald)" }}>
                    {item.products?.brand}
                  </p>
                  <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1rem", letterSpacing: "0.03em" }} className="text-foreground truncate">
                    {item.products?.name}
                  </p>
                  {item.flavor && <p className="text-muted-foreground text-[10px]">{item.flavor}</p>}
                  <p className="text-muted-foreground text-[10px] mt-1">
                    PKR {item.unit_price.toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <p style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1rem" }} className="text-foreground shrink-0">
                  PKR {item.subtotal.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary + Address */}
        <div className="space-y-4">
          <div className="bg-card border border-border p-5">
            <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
              Order Summary
            </p>
            {[
              { label: "Subtotal",  value: `PKR ${order.subtotal.toLocaleString()}` },
              { label: "Shipping",  value: `PKR ${order.shipping_amount.toLocaleString()}` },
              ...(order.discount_amount > 0 ? [{ label: "Discount", value: `-PKR ${order.discount_amount.toLocaleString()}`, red: true }] : []),
            ].map(({ label, value, red }) => (
              <div key={label} className="flex justify-between py-1.5">
                <span className="text-muted-foreground text-xs">{label}</span>
                <span className={`text-xs ${red ? "text-primary" : "text-muted-foreground"}`}>{value}</span>
              </div>
            ))}
            <div className="border-t border-border mt-3 pt-3 flex justify-between">
              <span className="text-foreground text-sm font-bold" style={{ fontFamily: "var(--font-oswald)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-bebas-neue)", fontSize: "1.3rem" }} className="text-foreground">
                PKR {order.total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-card border border-border p-5">
            <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-oswald)" }}>
              Shipping Address
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {addr.full_name}<br />
              {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ""}<br />
              {addr.city}, {addr.province}<br />
              {addr.phone}
            </p>
          </div>

          <div className="bg-card border border-border p-5">
            <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "var(--font-oswald)" }}>Payment</p>
            <p className="text-muted-foreground text-sm">Cash on Delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
}
