import { compare } from "bcrypt";
import { z } from "zod";
import { ForbiddenError } from "../../../../common/errors";
import { getDb } from "../../../../db";
import { getUserByEmail } from "../../../../services/user/get-user-by-email";
import { createUserSession } from "../../../../services/user/session/create-user-session";
import { createAndSetTokens } from "../../../helpers/create-tokens";
import { publicProcedure } from "../../../trpc";
import { mapToTrpcError } from "../../../utils";

const inputSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(100),
});

export const loginV1Mutation = publicProcedure
  .input(inputSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const { readTx, writeTx } = getDb();

      const user = await getUserByEmail(readTx, input.email);
      if (!user) {
        throw new ForbiddenError("Invalid email or password");
      }
      if (!user.isVerified) {
        throw new ForbiddenError("Invalid email or password");
      }

      const isPasswordValid = await compare(
        input.password,
        user.hashedPassword
      );
      if (!isPasswordValid) {
        throw new ForbiddenError("Invalid email or password");
      }

      const { session } = await writeTx(async (tx) => {
        return await createUserSession(tx, { userId: user.id });
      });

      return await createAndSetTokens({ session, ctx });
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
