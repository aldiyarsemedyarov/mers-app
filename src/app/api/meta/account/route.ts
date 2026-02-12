import { NextResponse } from "next/server";
import { getMetaAdAccountId, metaFetch, type MetaAccountResponse } from "@/lib/meta";

export async function GET() {
  try {
    const act = getMetaAdAccountId();
    const data = await metaFetch<MetaAccountResponse>(`/${act}`, {
      fields: "id,name,currency",
    });
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
