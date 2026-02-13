import { NextRequest, NextResponse } from "next/server";
import { getOrCreateDevUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateDevUser();
    const store = user.stores[0];

    if (!store) {
      return NextResponse.json({
        ok: true,
        data: {
          initialized: false,
          message: "Store not initialized. Call POST /api/init to set up.",
        },
      });
    }

    // Get sync status
    const lastSyncs = await prisma.syncRun.findMany({
      where: {
        storeId: store.id,
        status: "completed",
      },
      orderBy: {
        completedAt: "desc",
      },
      take: 10,
    });

    const orderCount = await prisma.order.count({
      where: { storeId: store.id },
    });

    const productCount = await prisma.product.count({
      where: { storeId: store.id },
    });

    const lastOrderSync = lastSyncs.find((s) => s.syncType === "orders");
    const lastProductSync = lastSyncs.find((s) => s.syncType === "products");

    return NextResponse.json({
      ok: true,
      data: {
        initialized: true,
        store: {
          id: store.id,
          name: store.name,
          slug: store.slug,
        },
        database: {
          orders: orderCount,
          products: productCount,
        },
        lastSync: {
          orders: lastOrderSync?.completedAt || null,
          products: lastProductSync?.completedAt || null,
        },
        integrations: store.integrations.map((i) => ({
          provider: i.provider,
          status: i.status,
          lastSync: i.lastSyncAt,
        })),
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
