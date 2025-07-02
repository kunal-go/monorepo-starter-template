import { z } from "zod";
import { getDb } from "../../../../db";
import { verifyRefreshToken } from "../../../../providers/jwt/refresh-token";
import { deleteUserSession } from "../../../../services/user/session/delete-user-session";
import { publicProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";
import { getTokenFromCookie, setTokenInCookie } from "../helpers/token-cookie";

const inputSchema = z.object({});

export const logoutV1Mutation = publicProcedure
  .input(inputSchema)
  .mutation(async ({ ctx }) => {
    try {
      const refreshToken = getTokenFromCookie(ctx);

      // If refresh token is found, verify it and delete the session
      if (refreshToken) {
        try {
          const { sessionId } = await verifyRefreshToken(refreshToken);

          await getDb().writeTx(async (tx) => {
            await deleteUserSession(tx, sessionId);
          });
        } catch (error) {
          console.log("Invalid refresh token during logout:", error);
        }
      }

      // Always remove the refresh token cookie
      setTokenInCookie(ctx, "");
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
