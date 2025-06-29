import { z } from "zod";
import { db } from "../../../../db";
import { verifyUser } from "../../../../services/user/verification/verify-user";
import { createAndSetTokens } from "../../../helpers/";
import { publicProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";
import { createUserSession } from "../../../../services/user/session/create-user-session";

const inputSchema = z.object({
  requestId: z.string().uuid(),
  otp: z.string().length(6),
});

export const verifyV1Mutation = publicProcedure
  .input(inputSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const { user } = await db.transaction(async (tx) => {
        return await verifyUser(tx, input);
      });

      const { session } = await db.transaction(async (tx) => {
        return await createUserSession(tx, { userId: user.id });
      });
      return await createAndSetTokens({ session, ctx });
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
