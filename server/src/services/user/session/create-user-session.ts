import { getValidity } from "../../../common/utils/date";
import { Transaction } from "../../../db";
import { userSessions } from "../../../db/schema";
import { deleteExpiredUserSessions } from "./delete-expired-user-sessions";

export async function createUserSession(
  tx: Transaction,
  payload: { userId: string }
) {
  await deleteExpiredUserSessions();

  const [session] = await tx
    .insert(userSessions)
    .values({
      userId: payload.userId,
      validTill: getValidity(12, "hour"),
    })
    .returning();

  return { session };
}
