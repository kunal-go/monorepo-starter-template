import { Context } from "../../../context";

export function setTokenInCookie({ ctx }: Context, token: string) {
  ctx.res.headers.set(
    "Set-Cookie",
    `refreshToken=${token}; Path=/trpc; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
  );
}

export function getTokenFromCookie({ ctx }: Context) {
  return ctx.req
    .header("Cookie")
    ?.split(";")
    .find((cookie) => cookie.trim().startsWith("refreshToken="))
    ?.split("=")[1];
}
