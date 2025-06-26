import { z } from "zod";
import { db } from "../../../../db";
import { createUser } from "../../../../services/user/create-user";
import { procedure } from "../../../trpc";

const inputSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(100),
});

export const registerV1Mutation = procedure
  .input(inputSchema)
  .mutation(async ({ input }) => {
    const { request } = await db.transaction(async (tx) => {
      return await createUser(tx, input);
    });

    return {
      requestId: request.id,
      validTill: request.validTill.toISOString(),
    };
  });
