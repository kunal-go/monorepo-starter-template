import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/router";

const app = new Hono();

app.use("/trpc/*", trpcServer({ router: appRouter, createContext }));

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
  console.log("TRPC Server is running on http://localhost:3000/trpc");
});
