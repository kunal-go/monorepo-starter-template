import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
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
