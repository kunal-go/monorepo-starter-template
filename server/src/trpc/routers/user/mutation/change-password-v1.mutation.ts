import { z } from "zod";
import { getDb } from "../../../../db";
import { changeUserPassword } from "../../../../services/user/change-user-password";
import { privateProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";

const inputSchema = z.object({
  currentPassword: z.string().min(8).max(100),
  newPassword: z.string().min(8).max(100),
});

export const changePasswordV1Mutation = privateProcedure
  .input(inputSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      await getDb().writeTx((tx) =>
        changeUserPassword(tx, {
          userId: ctx.session.userId,
          currentPassword: input.currentPassword,
          newPassword: input.newPassword,
        })
      );
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
