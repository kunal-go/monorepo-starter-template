import type { Config } from "drizzle-kit";
import { getEnv } from "./src/env.config";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: getEnv("DB_HOST"),
    port: getEnv("DB_PORT"),
    user: getEnv("DB_USERNAME"),
    password: getEnv("DB_PASSWORD"),
    database: getEnv("DB_NAME"),
    ssl: false,
  },
} satisfies Config;
