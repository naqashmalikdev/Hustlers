import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getResend, FROM } from "@/lib/email/resend";
import { orderConfirmationHtml, adminNewOrderHtml } from "@/lib/email/templates/orderConfirmation";
import { orderRequestSchema, sanitizeText, PROVINCES } from "@/lib/validations/checkout";
import type { Order, Coupon } from "@/lib/supabase/types";

const SHIPPING = 250;

export async function POST(request: NextRequest) {
  // Parse + validate the payload server-side. Client-side zod can be bypassed
  // by posting straight to this endpoint, so we never trust the raw body.
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = orderRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order data." }, { status: 400 });
  }
  const { form, items, coupon_id } = parsed.data;

  // Province must be one of the allowed values (defence against tampering).
  if (!(PROVINCES as readonly string[]).includes(form.province)) {
    return NextResponse.json({ error: "Invalid province." }, { status: 400 });
  }

  // Sanitize all free-text so a payload like `<script>` can't be stored or
  // injected into the HTML order emails.
  const safeForm = {
    full_name:     sanitizeText(form.full_name),
    email:         form.email.trim(),
    phone:         sanitizeText(form.phone),
    address_line1: sanitizeText(form.address_line1),
    address_line2: form.address_line2 ? sanitizeText(form.address_line2) : null,
    city:          sanitizeText(form.city),
    province:      form.province,
    notes:         form.notes ? sanitizeText(form.notes) : null,
  };

  // Check if user is logged in (optional — guest checkout supported)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminDb = createAdminClient();

  // ── Recompute every monetary value from the DB. Never trust client prices. ──
  const productIds = [...new Set(items.map((i) => i.product_id))];
  const { data: dbProducts, error: productsError } = await adminDb
    .from("products")
    .select("id, name, price, is_active, stock_quantity")
    .in("id", productIds);

  if (productsError || !dbProducts) {
    return NextResponse.json({ error: "Could not verify products." }, { status: 500 });
  }

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  // Build trusted line items priced from the database.
  const trustedItems: { product_id: string; quantity: number; unit_price: number; flavor: string | null; size: string | null }[] = [];
  for (const item of items) {
    const product = productMap.get(item.product_id);
    if (!product || !product.is_active) {
      return NextResponse.json({ error: "One or more products are unavailable." }, { status: 400 });
    }
    if (product.stock_quantity <= 0) {
      return NextResponse.json({ error: `${product.name} is out of stock.` }, { status: 400 });
    }
    trustedItems.push({
      product_id: product.id,
      quantity: item.quantity,
      unit_price: product.price,
      flavor: item.flavor ? sanitizeText(item.flavor) : null,
      size: item.size ? sanitizeText(item.size) : null,
    });
  }

  const subtotal = trustedItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

  // ── Re-validate the coupon server-side and recompute the discount. ──
  let discount_amount = 0;
  let appliedCouponId: string | null = null;
  if (coupon_id) {
    const { data: couponRow } = await adminDb
      .from("coupons")
      .select("*")
      .eq("id", coupon_id)
      .eq("is_active", true)
      .single();
    const coupon = couponRow as Coupon | null;

    const expired = coupon?.expires_at ? new Date(coupon.expires_at) < new Date() : false;
    const usedUp = coupon?.max_uses != null && coupon.uses_count >= coupon.max_uses;
    const meetsMin = coupon ? subtotal >= coupon.min_order_amount : false;

    if (coupon && !expired && !usedUp && meetsMin) {
      discount_amount =
        coupon.type === "percentage"
          ? Math.round((subtotal * coupon.value) / 100)
          : Math.min(coupon.value, subtotal);
      appliedCouponId = coupon.id;
    }
  }

  const shipping_amount = SHIPPING;
  const total = subtotal + shipping_amount - discount_amount;

  const shipping_address = {
    full_name: safeForm.full_name,
    phone: safeForm.phone,
    address_line1: safeForm.address_line1,
    address_line2: safeForm.address_line2,
    city: safeForm.city,
    province: safeForm.province,
  };

  // Create the order (use admin client to bypass RLS for guest orders)
  const { data: rawOrder, error: orderError } = await adminDb
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      guest_email: user ? null : safeForm.email,
      guest_name: user ? null : safeForm.full_name,
      guest_phone: user ? null : safeForm.phone,
      status: "pending" as const,
      subtotal,
      discount_amount,
      shipping_amount,
      total,
      coupon_id: appliedCouponId,
      shipping_address,
      payment_method: "cash_on_delivery",
      payment_status: "pending" as const,
      notes: safeForm.notes,
    })
    .select("id, order_number")
    .single();

  const order = rawOrder as Pick<Order, "id" | "order_number"> | null;

  if (orderError || !order) {
    console.error("Order insert error:", orderError);
    return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
  }

  // Insert order items
  const orderItems = trustedItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    flavor: item.flavor,
    size: item.size,
  }));

  const { error: itemsError } = await adminDb.from("order_items").insert(orderItems);

  if (itemsError) {
    console.error("Order items insert error:", itemsError);
    // Rollback order
    await adminDb.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Failed to save order items." }, { status: 500 });
  }

  // Build email line items from the already-fetched product data.
  const emailItems = trustedItems.map((item) => ({
    name: productMap.get(item.product_id)?.name ?? "Product",
    flavor: item.flavor,
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.quantity * item.unit_price,
  }));

  // Look up the applied coupon's code for the email (if any).
  let couponCode: string | null = null;
  if (appliedCouponId) {
    const { data: coupon } = await adminDb.from("coupons").select("code").eq("id", appliedCouponId).single();
    couponCode = coupon?.code ?? null;
  }

  const emailData = {
    order_number: order.order_number,
    customer_name: safeForm.full_name,
    customer_email: safeForm.email,
    items: emailItems,
    subtotal,
    discount_amount,
    shipping_amount,
    total,
    shipping_address,
    coupon_code: couponCode,
  };

  // Send emails (non-blocking — don't fail order if email fails)
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.RESEND_FROM_EMAIL!;

  await Promise.allSettled([
    getResend().emails.send({
      from: FROM,
      to: safeForm.email,
      subject: `Order Confirmed — ${order.order_number} | HUSTLERS`,
      html: orderConfirmationHtml(emailData),
    }),
    getResend().emails.send({
      from: FROM,
      to: adminEmail,
      subject: `New Order ${order.order_number} — PKR ${total.toLocaleString()}`,
      html: adminNewOrderHtml(emailData),
    }),
  ]);

  return NextResponse.json({ order_number: order.order_number }, { status: 201 });
}

export async function GET(request: NextRequest) {
  // Admin-only: list all orders
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const adminDb = createAdminClient();
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const status = url.searchParams.get("status");
  const limit = 20;
  const from = (page - 1) * limit;

  let query = adminDb
    .from("orders")
    .select("*, order_items(*, products(name))", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (status) query = query.eq("status", status as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded");

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ orders: data, total: count, page, limit });
}
