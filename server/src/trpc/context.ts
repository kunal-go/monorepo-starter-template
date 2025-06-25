import type { Context as HonoContext } from "hono";

export const createContext = (_opts: unknown, ctx: HonoContext) => ({ ctx });

export type Context = ReturnType<typeof createContext>;
