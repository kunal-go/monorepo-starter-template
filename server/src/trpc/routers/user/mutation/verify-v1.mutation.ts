import { z } from "zod";
import { getDb } from "../../../../db";
import { createUserSession } from "../../../../services/user/session/create-user-session";
import { verifyUser } from "../../../../services/user/verification/verify-user";
import { createAndSetTokens } from "../../../helpers/";
import { publicProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";

const inputSchema = z.object({
  requestId: z.string().uuid(),
  otp: z.string().length(6),
});

export const verifyV1Mutation = publicProcedure
  .input(inputSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const { writeTx } = getDb();
      const { user } = await writeTx((tx) => verifyUser(tx, input));
      const { session } = await writeTx((tx) =>
        createUserSession(tx, { userId: user.id })
      );

      return await createAndSetTokens({ session, ctx });
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
