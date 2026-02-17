import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function normalizeConnectionString(raw: string) {
  try {
    const u = new URL(raw);

    // Prisma Postgres (db.prisma.io) does not use a conventional database name.
    // Using `/postgres` can trigger "Failed to identify your database" from the gateway.
    if (u.host === "db.prisma.io:5432" && u.pathname === "/postgres") {
      u.pathname = "/";
    }

    return u.toString();
  } catch {
    return raw;
  }
}

function createPrismaClient() {
  // Prisma + pg adapters require Node.js runtime (not Next.js Edge).
  if (process.env.NEXT_RUNTIME === "edge") {
    throw new Error(
      "Prisma database client cannot run in the Edge runtime. Set `export const runtime = 'nodejs'` in any route importing prisma."
    );
  }

  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const connectionString = normalizeConnectionString(raw);

  // Prisma Postgres requires TLS. `pg` does not reliably honor libpq's `sslmode=require`.
  // Force SSL when sslmode=require is present.
  const needsSsl = connectionString.includes("sslmode=require");
  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString,
      ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.pool = pool;

  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
