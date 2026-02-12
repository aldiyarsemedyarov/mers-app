import { NextResponse } from "next/server";
import { shopifyAdminFetch } from "@/lib/shopify";

type Order = {
  id: number;
  created_at: string;
  total_price: string;
  currency: string;
  financial_status?: string;
  fulfillment_status?: string;
  cancel_reason?: string;
  cancelled_at?: string;
  total_discounts?: string;
  total_tax?: string;
  total_shipping_price_set?: any;
  line_items?: Array<{
    product_id: number | null;
    variant_id: number | null;
    title: string;
    quantity: number;
    price: string;
    sku?: string;
  }>;
};

type ShopifyOrdersResponse = { orders: Order[] };

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const since = url.searchParams.get("since"); // ISO timestamp
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10) || 50, 250);

    const params = new URLSearchParams();
    params.set("status", "any");
    params.set("limit", String(limit));
    // Keep payload light. Expand later as needed.
    params.set(
      "fields",
      [
        "id",
        "created_at",
        "total_price",
        "currency",
        "financial_status",
        "fulfillment_status",
        "cancel_reason",
        "cancelled_at",
        "total_discounts",
        "total_tax",
        "line_items",
      ].join(",")
    );
    if (since) params.set("created_at_min", since);

    const data = await shopifyAdminFetch<ShopifyOrdersResponse>(`/orders.json?${params.toString()}`);
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
