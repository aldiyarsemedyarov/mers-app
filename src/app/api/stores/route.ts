import { NextRequest, NextResponse } from "next/server";
import { getOrCreateDevUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateDevUser();

    const stores = user.stores.map((store) => ({
      id: store.id,
      name: store.name,
      slug: store.slug,
      shopifyDomain: store.shopifyDomain,
      currency: store.currency,
      active: store.active,
      integrations: store.integrations.map((i) => ({
        provider: i.provider,
        status: i.status,
      })),
    }));

    return NextResponse.json({
      ok: true,
      data: { stores },
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
