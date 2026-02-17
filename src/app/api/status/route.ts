import { NextResponse } from "next/server";
import { getOrCreateDevUser } from "@/lib/auth";

export const runtime = "nodejs";

function safeDbHint() {
  const url = process.env.DATABASE_URL;
  if (!url) return { present: false as const };

  // Don’t leak credentials: only return a minimal, non-sensitive hint.
  try {
    const u = new URL(url);
    return {
      present: true as const,
      protocol: u.protocol,
      host: u.host,
      pathname: u.pathname,
      search: u.search ? "?…" : "",
    };
  } catch {
    return { present: true as const, protocol: "unparseable" as const };
  }
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          ok: false,
          error: "DATABASE_URL is not set",
          hint: safeDbHint(),
        },
        { status: 500 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

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
  } catch (e: unknown) {
    const err = e as { message?: string; code?: string; name?: string };

    return NextResponse.json(
      {
        ok: false,
        error: err?.message || String(e),
        name: err?.name,
        code: err?.code,
        hint: safeDbHint(),
      },
      { status: 500 }
    );
  }
}
