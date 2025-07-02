import { desc, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { SESSION_VALIDITY_IN_DAYS } from "../../../common/constant";
import { getValidity } from "../../../common/utils/date";
import { getDb, WriteTransaction } from "../../../db";
import { userSessions } from "../../../db/schema";
import { deleteExpiredUserSessions } from "./delete-expired-user-sessions";

export async function createUserSession(
  tx: WriteTransaction,
  payload: { userId: string }
) {
  await getDb().writeTx(deleteExpiredUserSessions);

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
      validTill: getValidity(SESSION_VALIDITY_IN_DAYS, "day"),
      refreshKey: randomUUID(),
    })
    .returning();

  return { session };
}
