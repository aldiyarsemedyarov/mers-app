import { NextResponse } from "next/server";
import { shopifyAdminFetch, type ShopifyShopResponse } from "@/lib/shopify";

export async function GET() {
  try {
    const data = await shopifyAdminFetch<ShopifyShopResponse>("/shop.json");
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
