import { z } from "zod";
import { verifyRefreshToken } from "../../../../providers/jwt/refresh-token";
import { deleteUserSession } from "../../../../services/user/session/delete-user-session";
import { publicProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";

const inputSchema = z.object({});

export const logoutV1Mutation = publicProcedure
  .input(inputSchema)
  .mutation(async ({ ctx }) => {
    try {
      const refreshToken = ctx.ctx.req
        .header("Cookie")
        ?.split(";")
        .find((cookie) => cookie.trim().startsWith("refreshToken="))
        ?.split("=")[1];

      // If refresh token is found, verify it and delete the session
      if (refreshToken) {
        try {
          const payload = await verifyRefreshToken(refreshToken);
          await deleteUserSession(payload.sessionId);
        } catch (error) {
          // If token verification fails, we still want to remove the cookie
          // but we don't need to delete any session since the token is invalid
          console.log("Invalid refresh token during logout:", error);
        }
      }

      // Always remove the refresh token cookie
      ctx.ctx.res.headers.set(
        "Set-Cookie",
        "refreshToken=; Path=/trpc; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
      );
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
