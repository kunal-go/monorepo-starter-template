import { createTRPCRouter } from "../../trpc";
import { registerV1Mutation } from "./mutation/register-v1.mutation";

export const userRouter = createTRPCRouter({
  registerV1Mutation,
});
