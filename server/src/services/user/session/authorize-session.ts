import { eq } from "drizzle-orm";
import { UnauthorisedError } from "../../../common/errors";
import { ReadTransaction } from "../../../db";
import { userSessions } from "../../../db/schema/schema";

export async function authorizeSession(tx: ReadTransaction, sessionId: string) {
  const [session] = await tx
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
