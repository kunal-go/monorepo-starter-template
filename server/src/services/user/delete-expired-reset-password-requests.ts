import { lt } from "drizzle-orm";
import { WriteTransaction } from "../../db";
import { resetPasswordRequests } from "../../db/schema";

export async function deleteExpiredResetPasswordRequests(tx: WriteTransaction) {
  await tx
    .delete(resetPasswordRequests)
    .where(lt(resetPasswordRequests.validTill, new Date()));
}
