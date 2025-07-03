import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

export async function migrateDb() {
  await migrate(db, { migrationsFolder: "./drizzle" });
}
