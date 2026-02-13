"use client";

import { useEffect, useState } from "react";

type ShopifyShop = {
  id: number;
  name: string;
  domain: string;
  email?: string;
  currency: string;
  timezone: string;
  myshopify_domain: string;
};

type MetaAccount = {
  id: string;
  name: string;
  currency: string;
};

export default function IntegrationsPage() {
  const [shopify, setShopify] = useState<ShopifyShop | null>(null);
  const [meta, setMeta] = useState<MetaAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ shopify?: string; meta?: string }>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/shopify/shop")
        .then((r) => r.json())
        .then((d) => {
          if (d.ok) setShopify(d.data.shop);
          else setErrors((e) => ({ ...e, shopify: d.error }));
        })
        .catch(() => setErrors((e) => ({ ...e, shopify: "Network error" }))),

      fetch("/api/meta/account")
        .then((r) => r.json())
        .then((d) => {
          if (d.ok) setMeta(d.data);
          else setErrors((e) => ({ ...e, meta: d.error }));
        })
        .catch(() => setErrors((e) => ({ ...e, meta: "Network error" }))),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/10">
        <div className="text-sm text-zinc-400">Loading integrations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium text-zinc-400">Integrations</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">
          Connected Accounts
        </h1>
        <p className="mt-2 text-sm text-zinc-300">
          Shopify + Meta Ads integrations for Slim&Fit
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
            {shopify ? (
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

          {shopify ? (
            <div className="mt-4 space-y-2">
              <div>
                <div className="text-xs text-zinc-500">Store</div>
                <div className="text-sm font-medium text-white">
                  {shopify.name}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Domain</div>
                <div className="text-sm text-zinc-300">{shopify.domain}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Myshopify Domain</div>
                <div className="text-sm text-zinc-300">
                  {shopify.myshopify_domain}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Currency</div>
                <div className="text-sm text-zinc-300">{shopify.currency}</div>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-red-400">
              {errors.shopify || "Connection failed"}
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
            {meta ? (
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

          {meta ? (
            <div className="mt-4 space-y-2">
              <div>
                <div className="text-xs text-zinc-500">Ad Account</div>
                <div className="text-sm font-medium text-white">{meta.name}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Account ID</div>
                <div className="text-sm text-zinc-300">{meta.id}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Currency</div>
                <div className="text-sm text-zinc-300">{meta.currency}</div>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-red-400">
              {errors.meta || "Connection failed"}
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
