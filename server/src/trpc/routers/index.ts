import { createTRPCRouter } from "../trpc";
import { healthRouter } from "./health";
import { userRouter } from "./user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
