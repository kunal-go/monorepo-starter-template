import { getValidity } from "../../../common/utils/date";
import { Transaction } from "../../../db";
import { userSessions } from "../../../db/schema";
import { deleteExpiredUserSessions } from "./delete-expired-user-sessions";
import { eq, desc, inArray } from "drizzle-orm";

export async function createUserSession(
  tx: Transaction,
  payload: { userId: string }
) {
  await deleteExpiredUserSessions();

  // Limit user to 3 sessions: keep only the 2 most recent if more than 2 exist
  const sessions = await tx
    .select()
    .from(userSessions)
    .where(eq(userSessions.userId, payload.userId))
    .orderBy(desc(userSessions.createdAt));
  if (sessions.length > 2) {
    const sessionsToDelete = sessions.slice(2).map((s) => s.id);
    if (sessionsToDelete.length > 0) {
      await tx
        .delete(userSessions)
        .where(inArray(userSessions.id, sessionsToDelete));
    }
  }

  const [session] = await tx
    .insert(userSessions)
    .values({
      userId: payload.userId,
      validTill: getValidity(12, "hour"),
    })
    .returning();

  return { session };
}
