"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type StatusData = {
  initialized: boolean;
  store?: {
    name: string;
    slug: string;
  };
  database?: {
    orders: number;
    products: number;
  };
  lastSync?: {
    orders: string | null;
    products: string | null;
  };
};

export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = () => {
    setLoading(true);
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setStatus(d.data);
      })
      .finally(() => setLoading(false));
  };

  const handleInit = async () => {
    setInitializing(true);
    try {
      const res = await fetch("/api/init", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        loadStatus();
      } else {
        alert(`Init failed: ${data.error}`);
      }
    } catch (e) {
      alert(`Init failed: ${e}`);
    } finally {
      setInitializing(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/sync/shopify", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        alert(`Synced ${data.data.orders} orders and ${data.data.products} products`);
        loadStatus();
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch (e) {
      alert(`Sync failed: ${e}`);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!status?.initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Welcome to Mers</h1>
            <p className="mt-2 text-zinc-400">
              Autonomous e-commerce COO powered by AI
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold text-white">Setup Required</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Click below to initialize your store and connect Shopify + Meta Ads
              integrations.
            </p>

            <button
              onClick={handleInit}
              disabled={initializing}
              className="mt-4 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {initializing ? "Initializing..." : "Initialize Store"}
            </button>
          </div>

          <div className="text-center text-xs text-zinc-500">
            Make sure SHOPIFY_SHOP_DOMAIN and SHOPIFY_ADMIN_TOKEN are set in your
            environment variables.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Mers</h1>
          <p className="mt-2 text-zinc-400">{status.store?.name || "Store"}</p>
        </div>

        <div className="rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/10 space-y-4">
          <div>
            <div className="text-sm font-semibold text-white">Database</div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-zinc-900/50 px-3 py-2">
                <div className="text-xs text-zinc-500">Orders</div>
                <div className="text-lg font-semibold text-white">
                  {status.database?.orders || 0}
                </div>
              </div>
              <div className="rounded-lg bg-zinc-900/50 px-3 py-2">
                <div className="text-xs text-zinc-500">Products</div>
                <div className="text-lg font-semibold text-white">
                  {status.database?.products || 0}
                </div>
              </div>
            </div>
          </div>

          {status.lastSync?.orders && (
            <div className="text-xs text-zinc-400">
              Last synced:{" "}
              {new Date(status.lastSync.orders).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}

          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {syncing ? "Syncing..." : "Sync Shopify Data"}
          </button>

          <button
            onClick={() => router.push("/app/analytics")}
            className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-100 transition-colors"
          >
            Open Dashboard →
          </button>
        </div>

        <div className="text-center">
          <a
            href="https://aldiyarsemedyarov.github.io/mers/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-400 underline"
          >
            View YC Demo
          </a>
        </div>
      </div>
    </div>
  );
}
