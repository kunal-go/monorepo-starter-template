import { lt } from "drizzle-orm";
import { WriteTransaction } from "../../../db";
import { userSessions } from "../../../db/schema/schema";

export async function deleteExpiredUserSessions(tx: WriteTransaction) {
  await tx.delete(userSessions).where(lt(userSessions.validTill, new Date()));
}
