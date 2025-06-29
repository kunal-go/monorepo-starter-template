import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ForbiddenError } from "../../../../common/errors";
import { db } from "../../../../db";
import { users } from "../../../../db/schema";
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
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email));

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

      const { session } = await db.transaction(async (tx) => {
        return await createUserSession(tx, { userId: user.id });
      });
      return await createAndSetTokens({ session, ctx });
    } catch (err) {
      throw mapToTrpcError(err);
    }
  });
