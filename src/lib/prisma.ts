import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  // Prisma + pg adapters require Node.js runtime (not Next.js Edge).
  if (process.env.NEXT_RUNTIME === "edge") {
    throw new Error(
      "Prisma database client cannot run in the Edge runtime. Set `export const runtime = 'nodejs'` in any route importing prisma."
    );
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Create connection pool (reuse in non-production for hot reload)
  const pool = globalForPrisma.pool ?? new Pool({ connectionString });
  if (process.env.NODE_ENV !== "production") globalForPrisma.pool = pool;

  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
