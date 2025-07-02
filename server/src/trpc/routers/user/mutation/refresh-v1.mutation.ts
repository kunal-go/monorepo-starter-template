import { z } from "zod";
import { UnauthorisedError } from "../../../../common/errors";
import { getDb } from "../../../../db";
import { verifyRefreshToken } from "../../../../providers/jwt/refresh-token";
import { authorizeSession } from "../../../../services/user/session/authorize-session";
import { deleteExpiredUserSessions } from "../../../../services/user/session/delete-expired-user-sessions";
import { refreshUserSession } from "../../../../services/user/session/refresh-user-session";
import { createAndSetTokens } from "../../../helpers/create-tokens";
import { publicProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";
import { getTokenFromCookie } from "../helpers/token-cookie";

const inputSchema = z.object({});

export const refreshV1Mutation = publicProcedure
  .input(inputSchema)
  .mutation(async ({ ctx }) => {
    try {
      const { readTx, writeTx } = getDb();

      const refreshToken = getTokenFromCookie(ctx);
      if (!refreshToken) {
        await writeTx(deleteExpiredUserSessions);
        throw new UnauthorisedError("Refresh token not found");
      }

      const payload = await verifyRefreshToken(refreshToken);
      const session = await authorizeSession(readTx, payload.sessionId);

      if (session.refreshKey !== payload.refreshKey) {
        throw new UnauthorisedError("Invalid refresh token");
      }

      const { session: refreshedSession } = await writeTx((tx) =>
        refreshUserSession(tx, { sessionId: session.id })
      );

      return await createAndSetTokens({ session: refreshedSession, ctx });
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
