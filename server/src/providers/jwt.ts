import { TRPCError } from "@trpc/server";
import { sign, verify } from "hono/jwt";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import { getEnv } from "../env.config";

export type AccessTokenPayload = {
  sessionId: string;
};

export async function createAccessToken(payload: AccessTokenPayload) {
  return await sign(payload, getEnv("JWT_SECRET"));
}

export async function verifyAccessToken(token: string) {
  try {
    return (await verify(token, getEnv("JWT_SECRET"))) as AccessTokenPayload;
  } catch (err) {
    if (err instanceof JwtTokenExpired) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Access token expired",
      });
    }

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid access token",
    });
  }
}
