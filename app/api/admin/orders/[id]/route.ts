import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResend, FROM } from "@/lib/email/resend";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", confirmed: "Confirmed", processing: "Processing",
  shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded",
};

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const db = createAdminClient();
  const { data, error } = await db
    .from("orders")
    .select("*, order_items(*, products(name, images, brand))")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { status } = await request.json() as { status: string };
  const db = createAdminClient();

  const { data: order, error } = await db
    .from("orders")
    .update({ status: status as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" })
    .eq("id", id)
    .select("*, order_items(quantity, unit_price, products(name))")
    .single();

  if (error || !order) return NextResponse.json({ error: "Update failed" }, { status: 500 });

  // Send status update email to customer
  const customerEmail = order.guest_email;
  const customerName  = order.guest_name ?? "Customer";

  // Get user email if not guest
  if (!customerEmail && order.user_id) {
    const { data: authUser } = await db.auth.admin.getUserById(order.user_id);
    const email = authUser?.user?.email;
    if (email) {
      await getResend().emails.send({
        from: FROM,
        to: email,
        subject: `Order ${order.order_number} — Status Updated to ${STATUS_LABELS[status]}`,
        html: `<div style="background:#080808;padding:40px;font-family:Arial,sans-serif;">
          <h2 style="color:#F5F5F5;font-family:Arial;">Order ${order.order_number} Update</h2>
          <p style="color:#888;">Hi ${customerName},</p>
          <p style="color:#888;">Your order status has been updated to: <strong style="color:#ffffff;">${STATUS_LABELS[status]}</strong></p>
          <p style="color:#555;margin-top:24px;font-size:12px;">HUSTLERS · Pakistan's Premier Fitness Destination</p>
        </div>`,
      }).catch(() => {}); // non-blocking
    }
  } else if (customerEmail) {
    await getResend().emails.send({
      from: FROM,
      to: customerEmail,
      subject: `Order ${order.order_number} — Status Updated to ${STATUS_LABELS[status]}`,
      html: `<div style="background:#080808;padding:40px;font-family:Arial,sans-serif;">
        <h2 style="color:#F5F5F5;font-family:Arial;">Order ${order.order_number} Update</h2>
        <p style="color:#888;">Hi ${customerName},</p>
        <p style="color:#888;">Your order status has been updated to: <strong style="color:#ffffff;">${STATUS_LABELS[status]}</strong></p>
        <p style="color:#555;margin-top:24px;font-size:12px;">HUSTLERS · Pakistan's Premier Fitness Destination</p>
      </div>`,
    }).catch(() => {});
  }

  return NextResponse.json(order);
}
