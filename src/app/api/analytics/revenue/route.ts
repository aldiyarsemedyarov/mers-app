import { NextRequest, NextResponse } from "next/server";
import { getOrCreateDevUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateDevUser();
    const store = user.stores[0];

    if (!store) {
      return NextResponse.json(
        { ok: false, error: "No store found. Run /api/init first." },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "7", 10);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get paid orders from DB
    const orders = await prisma.order.findMany({
      where: {
        storeId: store.id,
        financialStatus: "paid",
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + parseFloat(order.totalPrice.toString());
    }, 0);

    const orderCount = orders.length;
    const aov = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Calculate top products
    const productRevenue = new Map<string, { title: string; revenue: number }>();

    for (const order of orders) {
      const lineItems = (order.lineItems as any[]) || [];
      for (const item of lineItems) {
        const title = item.title || item.name || "Unknown";
        const price = parseFloat(item.price || "0");
        const quantity = parseInt(item.quantity || "1", 10);
        const itemRevenue = price * quantity;

        const existing = productRevenue.get(title) || { title, revenue: 0 };
        existing.revenue += itemRevenue;
        productRevenue.set(title, existing);
      }
    }

    const topProducts = Array.from(productRevenue.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Get last sync time
    const lastSync = await prisma.syncRun.findFirst({
      where: {
        storeId: store.id,
        syncType: "orders",
        status: "completed",
      },
      orderBy: {
        completedAt: "desc",
      },
    });

    return NextResponse.json({
      ok: true,
      data: {
        revenue: totalRevenue,
        orders: orderCount,
        aov: aov,
        topProducts: topProducts,
        lastSync: lastSync?.completedAt || null,
        period: `${days}d`,
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
