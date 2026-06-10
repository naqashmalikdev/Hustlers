import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetailClient } from "./ProductDetailClient";
import type { Product } from "@/lib/supabase/types";


interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data ?? null;
}

async function getRelated(category: string, excludeId: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category", category as "protein" | "pre-workout" | "recovery" | "vitamins" | "apparel" | "equipment")
    .eq("is_active", true)
    .neq("id", excludeId)
    .limit(4);
  return data ?? [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found — HUSTLERS" };
  return {
    title: `${product.name} — HUSTLERS`,
    description: product.description ?? `Buy ${product.name} from HUSTLERS Nutrition.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const related = await getRelated(product.category, product.id);

  return <ProductDetailClient product={product} related={related} slug={slug} isLoggedIn={!!user} />;
}
