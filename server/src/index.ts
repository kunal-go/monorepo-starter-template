import { auth } from "@/lib/auth";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { migrateDb } from "./db";
import { getEnv } from "./env.config";
import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/routers";

const app = new Hono();

app.on(
  ["POST", "GET", "OPTIONS"],
  "/api/auth/**",
  cors({ credentials: true, origin: getEnv("CORS_ORIGIN") }),
  (c) => auth.handler(c.req.raw)
);

app.use(
  "/trpc/*",
  cors({ credentials: true, origin: getEnv("CORS_ORIGIN") }),
  trpcServer({ router: appRouter, createContext })
);

await migrateDb();

serve({ fetch: app.fetch, port: getEnv("PORT") }, (info) => {
  console.log("--------------------------------");
  console.log(
    `[${new Date().toLocaleString()}] TRPC Server is running on http://localhost:${
      info.port
    }/trpc`
  );
  if (getEnv("NODE_ENV") !== "production") {
    console.log(
      `[${new Date().toLocaleString()}] Mail catcher UI is running on http://localhost:${getEnv(
        "MAIL_CATCHER_VIEW_PORT"
      )}`
    );
  }
});
