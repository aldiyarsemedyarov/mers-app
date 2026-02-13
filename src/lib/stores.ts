// Multi-store configuration support
// Allows switching between Slim&Fit and DermaLuxe

export type StoreConfig = {
  id: string;
  name: string;
  shopifyDomain: string;
  shopifyToken: string;
  metaAdAccountId: string;
  metaAccessToken: string;
};

export function getStoreConfig(storeId?: string): StoreConfig {
  const activeStore = storeId || process.env.ACTIVE_STORE || "slimnfit";

  if (activeStore === "slimnfit") {
    return {
      id: "slimnfit",
      name: "Slim&Fit",
      shopifyDomain: requiredEnv("SLIMNFIT_SHOPIFY_DOMAIN"),
      shopifyToken: requiredEnv("SLIMNFIT_SHOPIFY_TOKEN"),
      metaAdAccountId: requiredEnv("SLIMNFIT_META_AD_ACCOUNT_ID"),
      metaAccessToken: requiredEnv("SLIMNFIT_META_ACCESS_TOKEN"),
    };
  }

  if (activeStore === "dermaluxe") {
    return {
      id: "dermaluxe",
      name: "DermaLuxe",
      shopifyDomain: requiredEnv("DERMALUXE_SHOPIFY_DOMAIN"),
      shopifyToken: requiredEnv("DERMALUXE_SHOPIFY_TOKEN"),
      metaAdAccountId: requiredEnv("DERMALUXE_META_AD_ACCOUNT_ID"),
      metaAccessToken: requiredEnv("DERMALUXE_META_ACCESS_TOKEN"),
    };
  }

  throw new Error(`Unknown store: ${activeStore}`);
}

export function getAllStoreConfigs(): StoreConfig[] {
  const stores: StoreConfig[] = [];

  // Try Slim&Fit
  if (process.env.SLIMNFIT_SHOPIFY_DOMAIN) {
    try {
      stores.push(getStoreConfig("slimnfit"));
    } catch {
      // Skip if incomplete config
    }
  }

  // Try DermaLuxe
  if (process.env.DERMALUXE_SHOPIFY_DOMAIN) {
    try {
      stores.push(getStoreConfig("dermaluxe"));
    } catch {
      // Skip if incomplete config
    }
  }

  return stores;
}

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}
