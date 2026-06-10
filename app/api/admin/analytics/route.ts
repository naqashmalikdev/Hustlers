import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export async function GET(_: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = createAdminClient();

  // Last 30 days daily revenue
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: recentOrders } = await db
    .from("orders")
    .select("created_at, total, status")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .neq("status", "cancelled")
    .neq("status", "refunded")
    .order("created_at", { ascending: true });

  // Group by day
  const dailyMap: Record<string, { revenue: number; orders: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailyMap[key] = { revenue: 0, orders: 0 };
  }
  for (const order of recentOrders ?? []) {
    const key = order.created_at.split("T")[0];
    if (dailyMap[key]) {
      dailyMap[key].revenue += order.total;
      dailyMap[key].orders += 1;
    }
  }
  const dailyRevenue = Object.entries(dailyMap).map(([date, v]) => ({
    date,
    label: new Date(date).toLocaleDateString("en-PK", { day: "numeric", month: "short" }),
    revenue: v.revenue,
    orders: v.orders,
  }));

  // Status breakdown (all time)
  const { data: allOrders } = await db.from("orders").select("status");
  const statusCounts: Record<string, number> = {};
  for (const o of allOrders ?? []) {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  }
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

  // Top products by revenue
  const { data: topItems } = await db
    .from("order_items")
    .select("product_id, quantity, unit_price, products(name, brand)")
    .limit(200);

  const productRevMap: Record<string, { name: string; brand: string; revenue: number; units: number }> = {};
  for (const item of topItems ?? []) {
    const pid = item.product_id;
    const prod = item.products as unknown as { name: string; brand: string } | null;
    if (!productRevMap[pid]) {
      productRevMap[pid] = { name: prod?.name ?? "Unknown", brand: prod?.brand ?? "", revenue: 0, units: 0 };
    }
    productRevMap[pid].revenue += item.quantity * item.unit_price;
    productRevMap[pid].units += item.quantity;
  }
  const topProducts = Object.values(productRevMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  // Category breakdown
  const { data: allProducts } = await db.from("products").select("category, stock_quantity, price").eq("is_active", true);
  const categoryMap: Record<string, { count: number; totalValue: number }> = {};
  for (const p of allProducts ?? []) {
    if (!categoryMap[p.category]) categoryMap[p.category] = { count: 0, totalValue: 0 };
    categoryMap[p.category].count += 1;
    categoryMap[p.category].totalValue += p.stock_quantity * p.price;
  }
  const categoryData = Object.entries(categoryMap).map(([category, v]) => ({
    category,
    count: v.count,
    totalValue: v.totalValue,
  }));

  return NextResponse.json({ dailyRevenue, statusData, topProducts, categoryData });
}
