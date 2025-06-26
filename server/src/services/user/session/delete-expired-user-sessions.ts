import { lt } from "drizzle-orm";
import { db } from "../../../db";
import { userSessions } from "../../../db/schema";

export async function deleteExpiredUserSessions() {
  await db.delete(userSessions).where(lt(userSessions.validTill, new Date()));
}
