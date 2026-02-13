import { NextRequest, NextResponse } from "next/server";
import { getOrCreateDevUser } from "@/lib/auth";
import { syncShopifyStore } from "@/lib/sync/shopify";

export async function POST(request: NextRequest) {
  try {
    const user = await getOrCreateDevUser();
    const store = user.stores[0];

    if (!store) {
      return NextResponse.json(
        { ok: false, error: "No store found. Initialize first." },
        { status: 400 }
      );
    }

    const result = await syncShopifyStore(store.id);

    return NextResponse.json({
      ok: true,
      data: {
        orders: result.orders,
        products: result.products,
      },
    });
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
