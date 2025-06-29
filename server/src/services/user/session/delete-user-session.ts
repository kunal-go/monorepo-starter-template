import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { userSessions } from "../../../db/schema";

export async function deleteUserSession(sessionId: string) {
  await db.delete(userSessions).where(eq(userSessions.id, sessionId));
}
