import { publicProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";

export const check = publicProcedure.query(() => {
  try {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "tRPC server is running",
    };
  } catch (err) {
    throw mapToTrpcError(err);
  }
});
