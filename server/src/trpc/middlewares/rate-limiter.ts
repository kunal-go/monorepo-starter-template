import { TRPCError } from "@trpc/server";
import type { Context } from "../context";

// Simple in-memory store
const ipStore = new Map<string, { count: number; firstRequest: number }>();

// Configurable options
const WINDOW_MS = 1 * 60 * 1000; // 1 minute
const MAX_REQUESTS = 15; // 15 requests per window

export const rateLimiterMiddleware = async (opts: {
  ctx: Context;
  next: any;
}) => {
  const req = opts.ctx.ctx.req;
  const ip =
    req.header("x-forwarded-for") ||
    req.header("x-real-ip") ||
    req.header("cf-connecting-ip") ||
    req.header("fastly-client-ip") ||
    req.header("x-appengine-user-ip") ||
    req.header("x-client-ip") ||
    req.header("x-forwarded") ||
    req.header("forwarded-for") ||
    req.header("forwarded") ||
    req.header("via") ||
    req.header("remote-addr") ||
    "unknown";

  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now - entry.firstRequest > WINDOW_MS) {
    // New window
    ipStore.set(ip, { count: 1, firstRequest: now });
  } else {
    // Existing window
    if (entry.count >= MAX_REQUESTS) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests, please try again later.",
      });
    }
    entry.count++;
    ipStore.set(ip, entry);
  }

  return opts.next();
};
