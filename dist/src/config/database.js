import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { env } from "./env.ts";
// Create PostgreSQL connection pool
const pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
});
// Create Prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool);
export const prisma = global.prisma || new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
if (env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
// Graceful shutdown
process.on("beforeExit", async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=database.js.map