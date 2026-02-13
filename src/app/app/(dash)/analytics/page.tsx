"use client";

import { useEffect, useState } from "react";

type AnalyticsData = {
  revenue: number;
  orders: number;
  aov: number;
  topProducts: Array<{ title: string; revenue: number }>;
  lastSync: string | null;
  period: string;
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const days = period === "7d" ? 7 : 30;

    fetch(`/api/analytics/revenue?days=${days}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setData(d.data);
        } else {
          setError(d.error || "Failed to load analytics");
        }
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [period]);

  if (loading && !data) {
    return (
      <div className="rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/10">
        <div className="text-sm text-zinc-400">Loading analytics...</div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/10">
        <div className="text-sm text-red-400">{error}</div>
        <div className="mt-2 text-xs text-zinc-500">
          Tip: Run initialization first at{" "}
          <a href="/api/init" className="underline">
            /api/init
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="text-xs font-medium text-zinc-400">Analytics</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
            Real Shopify Data (DB)
          </h1>
          {data?.lastSync && (
            <div className="mt-2 text-xs text-zinc-400">
              Last synced:{" "}
              {new Date(data.lastSync).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-zinc-900/60 p-1 ring-1 ring-white/10">
          <button
            onClick={() => setPeriod("7d")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              period === "7d"
                ? "bg-white text-zinc-950"
                : "text-zinc-200 hover:bg-white/10"
            }`}
          >
            Last 7d
          </button>
          <button
            onClick={() => setPeriod("30d")}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              period === "30d"
                ? "bg-white text-zinc-950"
                : "text-zinc-200 hover:bg-white/10"
            }`}
          >
            Last 30d
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl bg-blue-500/10 px-4 py-2 text-sm text-blue-400 ring-1 ring-blue-500/20">
          Updating...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-zinc-900/50 p-5 ring-1 ring-white/10">
          <div className="text-xs font-medium text-zinc-400">Revenue (paid)</div>
          <div className="mt-2 text-2xl font-semibold text-white">
            ${data?.revenue.toFixed(2) || "0.00"}
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-900/50 p-5 ring-1 ring-white/10">
          <div className="text-xs font-medium text-zinc-400">Orders (paid)</div>
          <div className="mt-2 text-2xl font-semibold text-white">
            {data?.orders || 0}
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-900/50 p-5 ring-1 ring-white/10">
          <div className="text-xs font-medium text-zinc-400">AOV (paid)</div>
          <div className="mt-2 text-2xl font-semibold text-white">
            ${data?.aov.toFixed(2) || "0.00"}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-900/50 p-5 ring-1 ring-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">
              Top products (by revenue)
            </div>
            <div className="text-xs text-zinc-400">
              Based on paid orders in the selected period
            </div>
          </div>
          <button
            onClick={() => {
              fetch("/api/sync/shopify", { method: "POST" })
                .then((r) => r.json())
                .then(() => window.location.reload());
            }}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
          >
            Sync Now
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {data?.topProducts && data.topProducts.length > 0 ? (
            data.topProducts.map((product, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-zinc-900/50 px-3 py-2"
              >
                <div className="text-sm text-zinc-300">{product.title}</div>
                <div className="text-sm font-semibold text-white">
                  ${product.revenue.toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-zinc-400">
              No paid orders found in this period.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
