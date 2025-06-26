import { procedure } from "../../../trpc";

export const check = procedure.query(() => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "tRPC server is running",
  };
});
