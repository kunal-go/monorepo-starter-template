import { TRPCError } from "@trpc/server";
import { ErrorCode, isCoreError } from "../../common/errors";
import { getEnv } from "../../env.config";

const trpcErrorCodeMap: Record<ErrorCode, TRPCError["code"]> = {
  [ErrorCode.BAD_REQUEST]: "BAD_REQUEST",
  [ErrorCode.UNAUTHORIZED]: "UNAUTHORIZED",
  [ErrorCode.FORBIDDEN]: "FORBIDDEN",
  [ErrorCode.NOT_FOUND]: "NOT_FOUND",
  [ErrorCode.CONFLICT]: "CONFLICT",
  [ErrorCode.UNPROCESSABLE_ENTITY]: "UNPROCESSABLE_CONTENT",
  [ErrorCode.INTERNAL_SERVER_ERROR]: "INTERNAL_SERVER_ERROR",
};

export function mapToTrpcError(err: unknown): TRPCError {
  if (isCoreError(err)) {
    return new TRPCError({
      code: trpcErrorCodeMap[err.code],
      message: err.message,
    });
  }

  if (err instanceof Error) {
    const isProd = getEnv("NODE_ENV") === "production";
    return new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: isProd ? "Internal server error" : err.message,
    });
  }

  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
}
