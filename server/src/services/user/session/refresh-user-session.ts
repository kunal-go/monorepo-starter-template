import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { SESSION_VALIDITY_IN_DAYS } from "../../../common/constant";
import { getValidity } from "../../../common/utils/date";
import { WriteTransaction } from "../../../db";
import { userSessions } from "../../../db/schema/schema";

export async function refreshUserSession(
  tx: WriteTransaction,
  payload: { sessionId: string }
) {
  const [session] = await tx
    .update(userSessions)
    .set({
      validTill: getValidity(SESSION_VALIDITY_IN_DAYS, "day"),
      refreshedAt: new Date(),
      refreshKey: randomUUID(),
    })
    .where(eq(userSessions.id, payload.sessionId))
    .returning();

  return { session };
}
