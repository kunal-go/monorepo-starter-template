import { sign, verify } from "hono/jwt";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import { UnauthorisedError } from "../../common/errors";
import { getEnv } from "../../env.config";

export type RefreshTokenPayload = {
  sessionId: string;
  refreshKey: string;
};

export async function createRefreshToken(payload: RefreshTokenPayload) {
  return await sign(payload, getEnv("JWT_SECRET") + "refresh");
}

export async function verifyRefreshToken(token: string) {
  try {
    return (await verify(
      token,
      getEnv("JWT_SECRET") + "refresh"
    )) as RefreshTokenPayload;
  } catch (err) {
    if (err instanceof JwtTokenExpired) {
      throw new UnauthorisedError("Invalid or expired refresh token");
    }

    throw new UnauthorisedError("Invalid or expired refresh token");
  }
}
