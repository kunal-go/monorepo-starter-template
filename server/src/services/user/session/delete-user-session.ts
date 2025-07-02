import { eq } from "drizzle-orm";
import { WriteTransaction } from "../../../db";
import { userSessions } from "../../../db/schema";

export async function deleteUserSession(
  tx: WriteTransaction,
  sessionId: string
) {
  await tx.delete(userSessions).where(eq(userSessions.id, sessionId));
}
