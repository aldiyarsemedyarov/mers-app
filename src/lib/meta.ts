type Json = Record<string, any>;

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const META_API_VERSION = process.env.META_API_VERSION || "v19.0";

export function getMetaAccessToken() {
  // Strip optional surrounding quotes (people paste into .env with quotes sometimes)
  return requiredEnv("META_ACCESS_TOKEN").replace(/^"|"$/g, "").trim();
}

export function getMetaAdAccountId() {
  const raw = requiredEnv("META_AD_ACCOUNT_ID").replace(/^"|"$/g, "").trim();
  return raw.startsWith("act_") ? raw : `act_${raw}`;
}

export async function metaFetch<T = Json>(path: string, params?: Record<string, string>) {
  const token = getMetaAccessToken();
  const url = new URL(`https://graph.facebook.com/${META_API_VERSION}${path}`);
  url.searchParams.set("access_token", token);
  for (const [k, v] of Object.entries(params || {})) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { cache: "no-store" });
  const text = await res.text();
  if (!res.ok) throw new Error(`Meta Graph error ${res.status}: ${text.slice(0, 500)}`);
  return JSON.parse(text) as T;
}

export type MetaAccountResponse = {
  id: string;
  name: string;
  currency?: string;
};

export type MetaInsightsRow = {
  date_start: string;
  date_stop: string;
  spend?: string;
  impressions?: string;
  clicks?: string;
  cpc?: string;
  cpm?: string;
  actions?: Array<{ action_type: string; value: string }>;
  action_values?: Array<{ action_type: string; value: string }>;
  purchases?: string;
  purchase_roas?: Array<{ action_type: string; value: string }>;
};

export type MetaInsightsResponse = {
  data: MetaInsightsRow[];
};
