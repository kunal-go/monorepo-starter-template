import { publicProcedure } from "../../../trpc";

export const check = publicProcedure.query(() => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "tRPC server is running",
  };
});
