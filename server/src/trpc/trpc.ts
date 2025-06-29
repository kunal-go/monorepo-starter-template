import { initTRPC, TRPCError } from "@trpc/server";
import { verifyAccessToken } from "../providers/jwt";
import { authorizeSession } from "../services/user/authorize-session";
import { Context } from "./context";
import { rateLimiterMiddleware } from "./middlewares/rate-limiter";
import { mapToTrpcError } from "./utils";
import { UnauthorisedError } from "../common/errors";

export const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure.use(rateLimiterMiddleware);

export const privateProcedure = t.procedure.use(async ({ ctx, next }) => {
  try {
    const authHeader =
      ctx.ctx.req.header("authorization") ||
      ctx.ctx.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorisedError("Missing or invalid authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const payload = await verifyAccessToken(token);
    const session = await authorizeSession(payload.sessionId);
    return next({ ctx: { ...ctx, session } });
  } catch (error) {
    throw mapToTrpcError(error);
  }
});
