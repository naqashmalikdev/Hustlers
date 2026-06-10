import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    { count: totalOrders },
    { count: todayOrders },
    { data: revenueData },
    { data: monthRevenueData },
    { data: lowStock },
    { data: recentOrders },
    { data: statusBreakdown },
  ] = await Promise.all([
    db.from("orders").select("*", { count: "exact", head: true }),
    db.from("orders").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
    db.from("orders").select("total").not("status", "in", '("cancelled","refunded")'),
    db.from("orders").select("total").gte("created_at", monthStart).not("status", "in", '("cancelled","refunded")'),
    db.from("products").select("id, name, stock_quantity, category").lt("stock_quantity", 10).eq("is_active", true).order("stock_quantity").limit(8),
    db.from("orders").select("id, order_number, status, total, created_at, guest_email, user_id").order("created_at", { ascending: false }).limit(8),
    db.from("orders").select("status"),
  ]);

  const totalRevenue = revenueData?.reduce((s, o) => s + o.total, 0) ?? 0;
  const monthRevenue = monthRevenueData?.reduce((s, o) => s + o.total, 0) ?? 0;

  const statusCounts: Record<string, number> = {};
  (statusBreakdown ?? []).forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  });

  return NextResponse.json({
    totalOrders,
    todayOrders,
    totalRevenue,
    monthRevenue,
    lowStock: lowStock ?? [],
    recentOrders: recentOrders ?? [],
    statusCounts,
  });
}
