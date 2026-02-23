import type { PrismaConfig } from "prisma";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

export default {
  schema: "./prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
} satisfies PrismaConfig;
