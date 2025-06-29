import { UnauthorisedError } from "../../../common/errors";
import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { userSessions } from "../../../db/schema";

export async function authorizeSession(sessionId: string) {
  const [session] = await db
    .select()
    .from(userSessions)
    .where(eq(userSessions.id, sessionId));

  if (!session) {
    throw new UnauthorisedError("Session not found");
  }
  if (session.validTill.getTime() < new Date().getTime()) {
    throw new UnauthorisedError("Session expired");
  }
  return session;
}
