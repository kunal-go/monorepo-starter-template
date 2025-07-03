import { createTRPCRouter } from "../../trpc";
import { loginV1Mutation } from "./mutation/login-v1.mutation";
import { logoutV1Mutation } from "./mutation/logout-v1.mutation";
import { refreshV1Mutation } from "./mutation/refresh-v1.mutation";
import { registerV1Mutation } from "./mutation/register-v1.mutation";
import { verifyV1Mutation } from "./mutation/verify-v1.mutation";
import { getSelfV1Query } from "./queries/get-self-v1.query";
import { changePasswordV1Mutation } from "./mutation/change-password-v1.mutation";
import { createResetPasswordRequestV1Mutation } from "./mutation/create-reset-password-request-v1.mutation";
import { verifyPasswordResetRequestV1Mutation } from "./mutation/verify-password-reset-request.mutation";

export const userRouter = createTRPCRouter({
  registerV1Mutation,
  verifyV1Mutation,
  loginV1Mutation,
  refreshV1Mutation,
  logoutV1Mutation,
  getSelfV1Query,
  changePasswordV1Mutation,
  createResetPasswordRequestV1Mutation,
  verifyPasswordResetRequest: verifyPasswordResetRequestV1Mutation,
});
