"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type Integration = {
  provider: string;
  status: string;
  lastSync: string | null;
  metadata?: any;
};

type IntegrationsData = {
  store: {
    name: string;
    shopifyDomain: string;
  };
  integrations: Integration[];
};

function IntegrationsContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<IntegrationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storeId = searchParams.get("store");
    const storeParam = storeId ? `?store=${storeId}` : "";
    
    fetch(`/api/integrations${storeParam}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setData(d.data);
        else setError(d.error);
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/10">
        <div className="text-sm text-red-400">{error}</div>
        <div className="mt-2 text-xs text-zinc-500">
          Tip: Run initialization first at <a href="/" className="underline">home page</a>
        </div>
      </div>
    );
  }

  const shopifyIntegration = data?.integrations.find((i) => i.provider === "shopify");
  const metaIntegration = data?.integrations.find((i) => i.provider === "meta");

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium text-zinc-400">Integrations</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
          Connected Accounts
        </h1>
        <p className="mt-2 text-sm text-zinc-300">
          Shopify + Meta Ads integrations for {data?.store.name}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Shopify Card */}
        <div className="rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Shopify</div>
              <div className="mt-1 text-xs text-zinc-400">
                E-commerce platform
              </div>
            </div>
            {shopifyIntegration && shopifyIntegration.status === "active" ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {shopifyIntegration && shopifyIntegration.status === "active" ? (
            <div className="mt-4 space-y-2">
              <div>
                <div className="text-xs text-zinc-500">Store</div>
                <div className="text-sm font-medium text-white">
                  {data?.store.name}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Shopify Domain</div>
                <div className="text-sm text-zinc-300">{data?.store.shopifyDomain}</div>
              </div>
              {shopifyIntegration.lastSync && (
                <div>
                  <div className="text-xs text-zinc-500">Last Synced</div>
                  <div className="text-sm text-zinc-300">
                    {new Date(shopifyIntegration.lastSync).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 text-sm text-red-400">
              {shopifyIntegration?.status === "error" ? "Connection error" : "Not connected"}
            </div>
          )}
        </div>

        {/* Meta Ads Card */}
        <div className="rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Meta Ads</div>
              <div className="mt-1 text-xs text-zinc-400">
                Facebook & Instagram advertising
              </div>
            </div>
            {metaIntegration && metaIntegration.status === "active" ? (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {metaIntegration && metaIntegration.status === "active" ? (
            <div className="mt-4 space-y-2">
              <div>
                <div className="text-xs text-zinc-500">Ad Account</div>
                <div className="text-sm font-medium text-white">
                  {metaIntegration.metadata?.accountName || "Meta Ads"}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Account ID</div>
                <div className="text-sm text-zinc-300">
                  {metaIntegration.metadata?.accountId || "N/A"}
                </div>
              </div>
              {metaIntegration.lastSync && (
                <div>
                  <div className="text-xs text-zinc-500">Last Synced</div>
                  <div className="text-sm text-zinc-300">
                    {new Date(metaIntegration.lastSync).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 text-sm text-red-400">
              {metaIntegration?.status === "error" ? "Connection error" : "Not connected"}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-zinc-900/40 p-4 ring-1 ring-white/10">
        <div className="text-xs font-medium text-zinc-400">Coming next</div>
        <ul className="mt-2 space-y-1 text-sm text-zinc-300">
          <li>• DermaLuxe store support (multi-store switching)</li>
          <li>• Token expiry monitoring & refresh</li>
          <li>• TikTok Ads integration</li>
          <li>• Google Analytics integration</li>
        </ul>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <IntegrationsContent />
    </Suspense>
  );
}
