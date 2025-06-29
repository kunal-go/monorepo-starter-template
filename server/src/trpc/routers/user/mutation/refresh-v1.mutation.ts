import { z } from "zod";
import { UnauthorisedError } from "../../../../common/errors";
import { db } from "../../../../db";
import { verifyRefreshToken } from "../../../../providers/jwt/refresh-token";
import { authorizeSession } from "../../../../services/user/session/authorize-session";
import { deleteExpiredUserSessions } from "../../../../services/user/session/delete-expired-user-sessions";
import { refreshUserSession } from "../../../../services/user/session/refresh-user-session";
import { createAndSetTokens } from "../../../helpers/create-tokens";
import { publicProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";

const inputSchema = z.object({});

export const refreshV1Mutation = publicProcedure
  .input(inputSchema)
  .mutation(async ({ ctx }) => {
    try {
      const refreshToken = ctx.ctx.req
        .header("Cookie")
        ?.split(";")
        .find((cookie) => cookie.trim().startsWith("refreshToken="))
        ?.split("=")[1];

      if (!refreshToken) {
        await deleteExpiredUserSessions();
        throw new UnauthorisedError("Refresh token not found");
      }

      const payload = await verifyRefreshToken(refreshToken);
      const session = await authorizeSession(payload.sessionId);

      if (session.refreshKey !== payload.refreshKey) {
        throw new UnauthorisedError("Invalid refresh token");
      }

      const { session: refreshedSession } = await db.transaction(async (tx) => {
        return await refreshUserSession(tx, { sessionId: session.id });
      });
      return await createAndSetTokens({ session: refreshedSession, ctx });
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
