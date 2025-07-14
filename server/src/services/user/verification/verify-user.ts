import {
  BadRequestError,
  UnprocessableEntityError,
} from "../../../common/errors";
import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import { getDb, WriteTransaction } from "../../../db";
import { users, verificationRequests } from "../../../db/schema/schema";
import { deleteUnverifiedUsers } from "../delete-unverified-users";

export async function verifyUser(
  tx: WriteTransaction,
  payload: { requestId: string; otp: string }
) {
  await getDb().writeTx(deleteUnverifiedUsers);

  const [request] = await tx
    .select()
    .from(verificationRequests)
    .where(eq(verificationRequests.id, payload.requestId));

  if (!request) {
    throw new UnprocessableEntityError(
      "Verification request expired or invalid"
    );
  }

  const isExpired = new Date(request.validTill) < new Date();
  if (isExpired) {
    throw new BadRequestError("Verification request has expired");
  }

  const isOtpValid = await compare(payload.otp, request.hashedOtp);
  if (!isOtpValid) {
    throw new BadRequestError("Invalid OTP");
  }

  const [user] = await tx
    .update(users)
    .set({ isVerified: true })
    .where(eq(users.id, request.userId))
    .returning();

  await tx
    .delete(verificationRequests)
    .where(eq(verificationRequests.id, payload.requestId));

  return { user };
}
