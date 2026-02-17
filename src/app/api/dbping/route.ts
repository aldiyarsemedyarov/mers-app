import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

function safeDbHint() {
  const url = process.env.DATABASE_URL;
  if (!url) return { present: false as const };
  try {
    const u = new URL(url);
    return { present: true as const, protocol: u.protocol, host: u.host, pathname: u.pathname, search: u.search ? "?…" : "" };
  } catch {
    return { present: true as const, protocol: "unparseable" as const };
  }
}

export async function GET() {
  const hint = safeDbHint();

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not set", hint }, { status: 500 });
  }

  try {
    const raw = process.env.DATABASE_URL;
    // Same normalization as src/lib/prisma.ts (keep dbping independent of Prisma)
    const connectionString = (() => {
      try {
        const u = new URL(raw);
        if (u.host === "db.prisma.io:5432" && u.pathname === "/postgres") u.pathname = "/";
        return u.toString();
      } catch {
        return raw;
      }
    })();

    const pool = new Pool({ connectionString });
    const r = await pool.query("select 1 as ok");
    await pool.end();

    return NextResponse.json({ ok: true, data: r.rows?.[0] ?? null, hint });
  } catch (e: unknown) {
    const err = e as { message?: string; code?: string; name?: string; stack?: string };
    // Log full error server-side for Vercel logs (no secrets should be present here)
    console.error("DBPING_ERROR", { name: err?.name, code: err?.code, message: err?.message, stack: err?.stack, hint });

    return NextResponse.json(
      {
        ok: false,
        error: err?.message || String(e),
        name: err?.name,
        code: err?.code,
        // Include a short stack snippet to identify whether this is coming from pg vs prisma
        stack: err?.stack ? String(err.stack).split("\n").slice(0, 8).join("\n") : undefined,
        hint,
      },
      { status: 500 }
    );
  }
}
