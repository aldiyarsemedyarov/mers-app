import { NextRequest, NextResponse } from "next/server";
import { getOrCreateDevUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateDevUser();
    
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get("store");
    
    // Find the requested store or use first active store
    const store = storeId 
      ? user.stores.find((s) => s.id === storeId)
      : user.stores.find((s) => s.active) || user.stores[0];

    if (!store) {
      return NextResponse.json(
        { ok: false, error: "No store found. Run /api/init first." },
        { status: 400 }
      );
    }

    const integrations = store.integrations.map((i) => ({
      provider: i.provider,
      status: i.status,
      lastSync: i.lastSyncAt,
      metadata: i.metadata,
    }));

    return NextResponse.json({
      ok: true,
      data: {
        store: {
          name: store.name,
          shopifyDomain: store.shopifyDomain,
        },
        integrations,
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
