import { z } from "zod";
import { getDb } from "../../../../db";
import { createUser } from "../../../../services/user/create-user";
import { publicProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";

const inputSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(100),
});

export const registerV1Mutation = publicProcedure
  .input(inputSchema)
  .mutation(async ({ input }) => {
    try {
      const { request } = await getDb().writeTx((tx) => createUser(tx, input));

      return {
        requestId: request.id,
        validTill: request.validTill.toISOString(),
      };
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
