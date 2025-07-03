import { z } from "zod";
import { getDb } from "../../../../db";
import { createResetPasswordRequest } from "../../../../services/user/create-reset-password-request";
import { publicProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";

const inputSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  newPassword: z.string().min(8).max(100),
});

export const createResetPasswordRequestV1Mutation = publicProcedure
  .input(inputSchema)
  .mutation(async ({ input }) => {
    try {
      const request = await getDb().writeTx((tx) =>
        createResetPasswordRequest(tx, {
          email: input.email,
          newPassword: input.newPassword,
        })
      );

      return {
        requestId: request.id,
        validTill: request.validTill.toISOString(),
      };
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
