import dayjs from "dayjs";
import { SESSION_VALIDITY_IN_DAYS } from "../../common/constant";
import { UserSession } from "../../db/schema";
import { getEnv } from "../../env.config";
import { createAccessToken, createRefreshToken } from "../../providers/jwt";

export async function createAndSetTokens({
  session,
  ctx,
}: {
  session: UserSession;
  ctx: any;
}) {
  const [{ accessToken, validTill }, refreshToken] = await Promise.all([
    createAccessToken({ sessionId: session.id }),
    createRefreshToken({
      sessionId: session.id,
      refreshKey: session.refreshKey!,
    }),
  ]);

  const isProd = getEnv("NODE_ENV") === "production";
  const maxAge = 1000 * 60 * 60 * 24 * SESSION_VALIDITY_IN_DAYS;

  const cookieOptions: string[] = [
    `refreshToken=${refreshToken}`,
    "HttpOnly",
    "SameSite=None",
    "Path=/",
    `Max-Age=${maxAge}`,
  ];
  if (isProd) {
    cookieOptions.push("Secure");
  }

  // Set the refresh token cookie
  ctx.ctx.res.headers.set("Set-Cookie", cookieOptions.join("; "));

  return {
    accessToken,
    refreshAfter: dayjs(validTill).subtract(5, "minute").toDate(),
  };
}
