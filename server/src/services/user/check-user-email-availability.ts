import { TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { ReadTransaction } from "../../db";
import { users } from "../../db/schema";

export async function checkUserEmailAvailability(
  tx: ReadTransaction,
  payload: { email: string }
) {
  const userCount = await tx
    .select({ count: count() })
    .from(users)
    .where(eq(users.email, payload.email.toLowerCase()));

  if (userCount[0].count > 0) {
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: "Email already in use",
    });
  }
}
