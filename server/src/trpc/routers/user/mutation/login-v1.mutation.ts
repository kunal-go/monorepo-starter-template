import { TRPCError } from "@trpc/server";
import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../../db";
import { users } from "../../../../db/schema";
import { createAccessToken } from "../../../../providers/jwt";
import { createUserSession } from "../../../../services/user/session/create-user-session";
import { procedure } from "../../../trpc";

const inputSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(100),
});

export const loginV1Mutation = procedure
  .input(inputSchema)
  .mutation(async ({ input }) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email));

    if (!user) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await compare(input.password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Invalid email or password",
      });
    }

    const { session } = await db.transaction(async (tx) => {
      return await createUserSession(tx, { userId: user.id });
    });

    const accessToken = await createAccessToken({
      sessionId: session.id,
    });
    return { accessToken };
  });
