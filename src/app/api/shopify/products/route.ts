import { NextResponse } from "next/server";
import { shopifyAdminFetch } from "@/lib/shopify";

type Product = {
  id: number;
  title: string;
  handle: string;
  status?: string;
  vendor?: string;
  product_type?: string;
  created_at: string;
  updated_at: string;
  variants: Array<{
    id: number;
    title: string;
    sku?: string;
    price: string;
    compare_at_price?: string | null;
    inventory_quantity?: number;
  }>;
};

type ShopifyProductsResponse = { products: Product[] };

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 250);

    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set(
      "fields",
      [
        "id",
        "title",
        "handle",
        "status",
        "vendor",
        "product_type",
        "created_at",
        "updated_at",
        "variants",
      ].join(",")
    );

    const data = await shopifyAdminFetch<ShopifyProductsResponse>(`/products.json?${params.toString()}`);
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e?.message || String(e),
      },
      { status: 500 }
    );
  }
}
