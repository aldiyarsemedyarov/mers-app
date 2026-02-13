export const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-01";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function getShopifyAdminBaseUrl() {
  const shop = requiredEnv("SHOPIFY_SHOP_DOMAIN");
  return `https://${shop}/admin/api/${SHOPIFY_API_VERSION}`;
}

export async function shopifyAdminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getShopifyAdminBaseUrl();
  const token = requiredEnv("SHOPIFY_ACCESS_TOKEN");

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    // Do NOT leak token. Return status + first chars of body.
    throw new Error(`Shopify Admin API error ${res.status}: ${text.slice(0, 400)}`);
  }

  return JSON.parse(text) as T;
}

export type ShopifyShopResponse = {
  shop: {
    id: number;
    name: string;
    myshopify_domain: string;
    email?: string;
    currency: string;
    timezone: string;
    plan_name?: string;
  };
};
