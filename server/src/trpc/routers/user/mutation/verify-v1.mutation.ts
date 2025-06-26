import { z } from "zod";
import { db } from "../../../../db";
import { createAccessToken } from "../../../../providers/jwt";
import { createUserSession } from "../../../../services/user/session/create-user-session";
import { verifyUser } from "../../../../services/user/verification/verify-user";
import { publicProcedure } from "../../../trpc";

const inputSchema = z.object({
  requestId: z.string().uuid(),
  otp: z.string().length(6),
});

export const verifyV1Mutation = publicProcedure
  .input(inputSchema)
  .mutation(async ({ input }) => {
    const { session } = await db.transaction(async (tx) => {
      const { user } = await verifyUser(tx, input);
      return await createUserSession(tx, { userId: user.id });
    });

    const accessToken = await createAccessToken({
      sessionId: session.id,
    });
    return { accessToken };
  });
