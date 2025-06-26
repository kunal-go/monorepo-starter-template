import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres"),
  DB_NAME: z.string().default("starter-template"),
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
