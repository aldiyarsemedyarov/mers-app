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

export class ShopifyAPIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public retryAfter?: number
  ) {
    super(message);
    this.name = "ShopifyAPIError";
  }
}

export async function shopifyAdminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getShopifyAdminBaseUrl();
  const token = requiredEnv("SHOPIFY_ADMIN_TOKEN");

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
    // Parse retry-after header for rate limits
    const retryAfter = res.headers.get("retry-after");
    const retrySeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;

    // Categorize errors
    let errorMessage = `Shopify API error ${res.status}`;
    
    if (res.status === 401) {
      errorMessage = "Shopify authentication failed. Token may be invalid or expired.";
    } else if (res.status === 429) {
      errorMessage = `Shopify rate limit exceeded. Retry after ${retrySeconds || "unknown"} seconds.`;
    } else if (res.status >= 500) {
      errorMessage = "Shopify server error. Please try again later.";
    } else {
      // Include first 400 chars of response for other errors
      errorMessage += `: ${text.slice(0, 400)}`;
    }

    throw new ShopifyAPIError(res.status, res.statusText, errorMessage, retrySeconds);
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
