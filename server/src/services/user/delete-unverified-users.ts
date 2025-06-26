import { and, eq, gt, notInArray } from "drizzle-orm";
import { db } from "../../db";
import { users, verificationRequests } from "../../db/schema";

export async function deleteUnverifiedUsers() {
  await db
    .delete(verificationRequests)
    .where(gt(verificationRequests.validTill, new Date()));

  const pendingRequests = await db
    .select({ userId: verificationRequests.userId })
    .from(verificationRequests);
  const pendingRequestsUserIds = pendingRequests.map((el) => el.userId);

  await db
    .delete(users)
    .where(
      and(
        eq(users.isVerified, false),
        notInArray(users.id, pendingRequestsUserIds)
      )
    );
}
