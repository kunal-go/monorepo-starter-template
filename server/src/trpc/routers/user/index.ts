import { createTRPCRouter } from "../../trpc";
import { loginV1Mutation } from "./mutation/login-v1.mutation";
import { logoutV1Mutation } from "./mutation/logout-v1.mutation";
import { refreshV1Mutation } from "./mutation/refresh-v1.mutation";
import { registerV1Mutation } from "./mutation/register-v1.mutation";
import { verifyV1Mutation } from "./mutation/verify-v1.mutation";
import { getSelfV1Query } from "./queries/get-self-v1.query";

export const userRouter = createTRPCRouter({
  registerV1Mutation,
  verifyV1Mutation,
  loginV1Mutation,
  refreshV1Mutation,
  logoutV1Mutation,
  getSelfV1Query,
});
