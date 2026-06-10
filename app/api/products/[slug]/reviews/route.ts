import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { sanitizeText } from "@/lib/validations/checkout";

const reviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be between 1 and 5.").max(5, "Rating must be between 1 and 5."),
  title: z.string().max(120).optional(),
  body: z.string().max(2000).optional(),
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = createAdminClient();

  // Get product id by slug
  const { data: product } = await db.from("products").select("id").eq("slug", slug).single();
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const { data, error } = await db
    .from("reviews")
    .select("id, rating, title, body, is_verified_purchase, created_at, user_id")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fetch display names for each reviewer
  const userIds = [...new Set((data ?? []).map(r => r.user_id))];
  const nameMap: Record<string, string> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await db.from("profiles").select("id, full_name").in("id", userIds);
    for (const p of profiles ?? []) {
      nameMap[p.id] = p.full_name ?? "Member";
    }
  }

  const reviews = (data ?? []).map(r => ({
    ...r,
    reviewer_name: nameMap[r.user_id] ?? "Member",
  }));

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return NextResponse.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, total: reviews.length });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to leave a review." }, { status: 401 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid review.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  const { rating } = parsed.data;
  // Strip control chars / angle brackets before the text is stored.
  const title = sanitizeText(parsed.data.title) || null;
  const body = sanitizeText(parsed.data.body) || null;

  const db = createAdminClient();
  const { data: product } = await db.from("products").select("id").eq("slug", slug).single();
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  // Check if user already reviewed this product
  const { data: existing } = await db
    .from("reviews")
    .select("id")
    .eq("product_id", product.id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 });
  }

  // Check if verified purchase (bought this product)
  const { data: orderItems } = await db
    .from("order_items")
    .select("id, order_id")
    .eq("product_id", product.id)
    .limit(50);

  let isVerified = false;
  if (orderItems && orderItems.length > 0) {
    const orderIds = orderItems.map(i => i.order_id);
    const { data: orders } = await db
      .from("orders")
      .select("id")
      .in("id", orderIds)
      .eq("user_id", user.id)
      .neq("status", "cancelled")
      .limit(1);
    isVerified = !!(orders && orders.length > 0);
  }

  const { data, error } = await db.from("reviews").insert({
    product_id: product.id,
    user_id: user.id,
    rating,
    title,
    body,
    is_verified_purchase: isVerified,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
