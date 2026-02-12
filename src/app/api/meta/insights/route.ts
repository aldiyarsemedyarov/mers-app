import { NextResponse } from "next/server";
import { getMetaAdAccountId, metaFetch, type MetaInsightsResponse } from "@/lib/meta";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const since = url.searchParams.get("since"); // ISO or YYYY-MM-DD
    const until = url.searchParams.get("until");

    const act = getMetaAdAccountId();

    // time_range expects YYYY-MM-DD
    const toYMD = (s: string) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
      const d = new Date(s);
      if (isNaN(d.getTime())) throw new Error(`Invalid date: ${s}`);
      return d.toISOString().slice(0, 10);
    };

    const params: Record<string, string> = {
      level: "account",
      time_increment: "1",
      fields: [
        "date_start",
        "date_stop",
        "spend",
        "impressions",
        "clicks",
        "cpc",
        "cpm",
        // Conversions are account-dependent; start broad.
        "actions",
        "action_values",
        "purchase_roas",
      ].join(","),
    };

    if (since && until) {
      params.time_range = JSON.stringify({ since: toYMD(since), until: toYMD(until) });
    }

    const data = await metaFetch<MetaInsightsResponse>(`/${act}/insights`, params);
    return NextResponse.json({ ok: true, data });
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
