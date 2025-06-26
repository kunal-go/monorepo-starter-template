import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { getEnv } from "./env.config";
import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/router";
import { migrateDb } from "./db";

const app = new Hono();

app.use("/trpc/*", trpcServer({ router: appRouter, createContext }));

await migrateDb();

serve({ fetch: app.fetch, port: getEnv("PORT") }, (info) => {
  console.log(
    `Server is running on http://localhost:${info.port} in ${getEnv(
      "NODE_ENV"
    )} mode`
  );
  console.log(`TRPC Server is running on http://localhost:${info.port}/trpc`);
});
