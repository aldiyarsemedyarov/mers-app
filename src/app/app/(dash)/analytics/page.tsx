"use client";

import { useEffect, useMemo, useState } from "react";

type Shop = {
  name: string;
  domain: string;
  myshopify_domain: string;
  currency: string;
  iana_timezone: string;
};

type Order = {
  id: number;
  created_at: string;
  total_price: string;
  currency: string;
  financial_status?: string;
  line_items?: Array<{ title: string; quantity: number; price: string }>;
};

function usd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<7 | 30>(7);
  const [shop, setShop] = useState<Shop | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const [shopRes, ordersRes] = await Promise.all([
          fetch("/api/shopify/shop", { cache: "no-store" }),
          fetch(`/api/shopify/orders?since=${encodeURIComponent(isoDaysAgo(period))}&limit=250`, {
            cache: "no-store",
          }),
        ]);

        const shopJson = await shopRes.json();
        const ordersJson = await ordersRes.json();

        if (!shopJson.ok) throw new Error(shopJson.error || "Failed to load shop");
        if (!ordersJson.ok) throw new Error(ordersJson.error || "Failed to load orders");

        if (!cancelled) {
          setShop(shopJson.data.shop);
          setOrders(ordersJson.data.orders || []);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [period]);

  const metrics = useMemo(() => {
    const paid = orders.filter((o) => (o.financial_status || "").toLowerCase() === "paid");
    const revenue = paid.reduce((sum, o) => sum + Number(o.total_price || 0), 0);
    const orderCount = paid.length;
    const aov = orderCount ? revenue / orderCount : 0;

    const productAgg = new Map<string, number>();
    for (const o of paid) {
      for (const li of o.line_items || []) {
        const lineRev = Number(li.price || 0) * Number(li.quantity || 0);
        productAgg.set(li.title, (productAgg.get(li.title) || 0) + lineRev);
      }
    }
    const topProducts = [...productAgg.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, rev]) => ({ title, revenue: rev }));

    return { revenue, orderCount, aov, topProducts };
  }, [orders]);

  return (
    <div>
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="text-xs font-medium text-zinc-400">Analytics</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">Real Shopify Data</h1>
          <div className="mt-2 text-sm text-zinc-300">
            {shop ? (
              <>
                {shop.name} • {shop.domain} • {shop.currency} • {shop.iana_timezone}
              </>
            ) : (
              "Connecting…"
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-zinc-900/60 p-1 ring-1 ring-white/10">
          <button
            className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
              period === 7 ? "bg-white text-zinc-950" : "text-zinc-200 hover:bg-white/10"
            }`}
            onClick={() => setPeriod(7)}
          >
            Last 7d
          </button>
          <button
            className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
              period === 30 ? "bg-white text-zinc-950" : "text-zinc-200 hover:bg-white/10"
            }`}
            onClick={() => setPeriod(30)}
          >
            Last 30d
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          <div className="font-semibold">Error</div>
          <div className="mt-1 whitespace-pre-wrap break-words">{error}</div>
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-zinc-900/50 p-5 ring-1 ring-white/10">
          <div className="text-xs font-medium text-zinc-400">Revenue (paid)</div>
          <div className="mt-2 text-2xl font-semibold text-white">{loading ? "…" : usd(metrics.revenue)}</div>
        </div>
        <div className="rounded-2xl bg-zinc-900/50 p-5 ring-1 ring-white/10">
          <div className="text-xs font-medium text-zinc-400">Orders (paid)</div>
          <div className="mt-2 text-2xl font-semibold text-white">{loading ? "…" : metrics.orderCount}</div>
        </div>
        <div className="rounded-2xl bg-zinc-900/50 p-5 ring-1 ring-white/10">
          <div className="text-xs font-medium text-zinc-400">AOV (paid)</div>
          <div className="mt-2 text-2xl font-semibold text-white">{loading ? "…" : usd(metrics.aov)}</div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-zinc-900/50 p-5 ring-1 ring-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Top products (by revenue)</div>
            <div className="text-xs text-zinc-400">Based on paid orders in the selected period</div>
          </div>
          <a className="text-xs font-medium text-zinc-200 hover:text-white" href="/api/shopify/orders?limit=5" target="_blank" rel="noreferrer">
            View orders JSON →
          </a>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="text-sm text-zinc-400">Loading…</div>
          ) : metrics.topProducts.length ? (
            metrics.topProducts.map((p) => (
              <div key={p.title} className="flex items-center justify-between gap-4">
                <div className="text-sm font-medium text-zinc-100 line-clamp-1">{p.title}</div>
                <div className="text-sm font-semibold text-white tabular-nums">{usd(p.revenue)}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-zinc-400">No paid orders found in this period.</div>
          )}
        </div>
      </div>
    </div>
  );
}
