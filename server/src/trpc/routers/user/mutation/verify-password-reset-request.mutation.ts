import { z } from "zod";
import { getDb } from "../../../../db";
import { verifyResetPasswordRequest } from "../../../../services/user/verify-reset-password-request";
import { publicProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";

const inputSchema = z.object({
  requestId: z.string().uuid(),
  otp: z.string().length(6),
});

export const verifyPasswordResetRequestV1Mutation = publicProcedure
  .input(inputSchema)
  .mutation(async ({ input }) => {
    try {
      await getDb().writeTx((tx) =>
        verifyResetPasswordRequest(tx, {
          requestId: input.requestId,
          otp: input.otp,
        })
      );
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
