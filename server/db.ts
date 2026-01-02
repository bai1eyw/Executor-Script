import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import pg from "pg";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

const { Pool } = pg;

export const db = process.env.DATABASE_URL 
  ? drizzlePg(new Pool({ connectionString: process.env.DATABASE_URL }), { schema })
  : drizzleSqlite(new Database("sqlite.db"), { schema });
