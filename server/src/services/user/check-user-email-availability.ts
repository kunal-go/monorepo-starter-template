import { UnprocessableEntityError } from "../../common/errors";
import { count, eq } from "drizzle-orm";
import { ReadTransaction } from "../../db";
import { users } from "../../db/schema/schema";

export async function checkUserEmailAvailability(
  tx: ReadTransaction,
  payload: { email: string }
) {
  const userCount = await tx
    .select({ count: count() })
    .from(users)
    .where(eq(users.email, payload.email.toLowerCase()));

  if (userCount[0].count > 0) {
    throw new UnprocessableEntityError("Email already in use");
  }
}
