import Database from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { dirname } from "node:path";
import { existsSync, mkdirSync } from "node:fs";

const dbUrl = process.env.DB_URL || "./data/billing.db";
const isMemory = dbUrl === ":memory:" || dbUrl === "memory";

if (!isMemory) {
  const folder = dirname(dbUrl);
  if (folder && folder !== "." && !existsSync(folder)) {
    mkdirSync(folder, { recursive: true });
  }
}

const sqlite = new Database(dbUrl);
export const db = drizzle(sqlite);
