import { sign, verify } from "hono/jwt";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import { ACCESS_TOKEN_VALIDITY_IN_HOURS } from "../../common/constant";
import { UnauthorisedError } from "../../common/errors";
import { getValidity } from "../../common/utils/date";
import { getEnv } from "../../env.config";

export type AccessTokenPayload = {
  sessionId: string;
};

export async function createAccessToken(payload: AccessTokenPayload) {
  const validTill = getValidity(ACCESS_TOKEN_VALIDITY_IN_HOURS, "hour");
  const token = await sign(
    { ...payload, exp: Math.floor(validTill.getTime() / 1000) },
    getEnv("JWT_SECRET")
  );

  return { accessToken: token, validTill };
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
