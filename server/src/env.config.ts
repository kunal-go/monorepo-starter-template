import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.coerce.number(),
  TZ: z.string(),

  CORS_ORIGIN: z.string(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  SEED_INSIDER_EMAIL: z.string().email().toLowerCase().optional(),

  MAIL_CATCHER_VIEW_PORT: z.coerce.number().optional(),
  MAIL_CATCHER_SERVER_PORT: z.coerce.number().optional(),

  FROM_EMAIL: z.string().email(),
  FROM_EMAIL_NAME: z.string(),

  JWT_SECRET: z.string(),
});

type EnvVar = z.infer<typeof envSchema>;

let envVar: EnvVar | null;

function getOrSetEnvVars() {
  if (envVar) {
    return envVar;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());
    throw new Error("Invalid environment variables");
  }
  envVar = parsed.data;
  return envVar;
}

export function getEnv<T extends keyof EnvVar>(key: T): EnvVar[T] {
  const envVars = getOrSetEnvVars();
  return envVars[key];
}
