import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import type { Coupon } from "@/lib/supabase/types";

const validateSchema = z.object({
  code: z.string().trim().min(1).max(40),
  subtotal: z.number().nonnegative(),
});

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = validateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { code, subtotal } = parsed.data;

  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  const coupon = data as Coupon | null;

  if (error || !coupon) {
    return NextResponse.json({ error: "Coupon not found or inactive." }, { status: 404 });
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
  }

  if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
    return NextResponse.json({ error: "This coupon has reached its usage limit." }, { status: 400 });
  }

  if (subtotal < coupon.min_order_amount) {
    return NextResponse.json(
      { error: `Minimum order of PKR ${coupon.min_order_amount.toLocaleString()} required.` },
      { status: 400 }
    );
  }

  const discount =
    coupon.type === "percentage"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);

  return NextResponse.json({
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    discount,
  });
}
