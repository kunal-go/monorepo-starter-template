import { ExtractTablesWithRelations } from "drizzle-orm";
import { drizzle, NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { PgTransaction } from "drizzle-orm/pg-core";
import { getEnv } from "../env.config";

export const db = drizzle({
  connection: {
    host: getEnv("DB_HOST"),
    port: getEnv("DB_PORT"),
    user: getEnv("DB_USERNAME"),
    password: getEnv("DB_PASSWORD"),
    database: getEnv("DB_NAME"),
    ssl: false,
  },
});

export async function migrateDb() {
  await migrate(db, { migrationsFolder: "./drizzle" });
}

export type WriteTransaction = PgTransaction<
  NodePgQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;

export type ReadTransaction = WriteTransaction | typeof db;
