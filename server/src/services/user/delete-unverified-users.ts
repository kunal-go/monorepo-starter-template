import { and, eq, lt, notInArray } from "drizzle-orm";
import { WriteTransaction } from "../../db";
import { users, verificationRequests } from "../../db/schema/schema";

export async function deleteUnverifiedUsers(tx: WriteTransaction) {
  await tx
    .delete(verificationRequests)
    .where(lt(verificationRequests.validTill, new Date()));

  const pendingRequests = await tx
    .select({ userId: verificationRequests.userId })
    .from(verificationRequests);
  const pendingRequestsUserIds = pendingRequests.map((el) => el.userId);

  await tx
    .delete(users)
    .where(
      and(
        eq(users.isVerified, false),
        notInArray(users.id, pendingRequestsUserIds)
      )
    );
}
