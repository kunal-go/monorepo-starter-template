import { drizzle } from "drizzle-orm/node-postgres";
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
