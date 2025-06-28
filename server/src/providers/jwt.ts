import { UnauthorisedError } from "../common/errors";
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
      throw new UnauthorisedError("Access token expired");
    }

    throw new UnauthorisedError("Invalid access token");
  }
}
