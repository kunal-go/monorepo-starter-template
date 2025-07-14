import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import { BadRequestError, UnprocessableEntityError } from "../../common/errors";
import { getDb, WriteTransaction } from "../../db";
import { resetPasswordRequests, users } from "../../db/schema/schema";
import { deleteExpiredResetPasswordRequests } from "./delete-expired-reset-password-requests";

export async function verifyResetPasswordRequest(
  tx: WriteTransaction,
  payload: { requestId: string; otp: string }
) {
  await getDb().writeTx(deleteExpiredResetPasswordRequests);

  const [request] = await tx
    .select()
    .from(resetPasswordRequests)
    .where(eq(resetPasswordRequests.id, payload.requestId));

  if (!request) {
    throw new UnprocessableEntityError(
      "Reset password request expired or invalid"
    );
  }

  const isExpired = new Date(request.validTill) < new Date();
  if (isExpired) {
    throw new UnprocessableEntityError(
      "Reset password request expired or invalid"
    );
  }

  const isOtpValid = await compare(payload.otp, request.otpHash);
  if (!isOtpValid) {
    throw new BadRequestError("Invalid OTP");
  }

  await tx
    .update(users)
    .set({
      hashedPassword: request.newPasswordHash,
      passwordUpdatedAt: new Date(),
    })
    .where(eq(users.id, request.userId));

  await tx
    .delete(resetPasswordRequests)
    .where(eq(resetPasswordRequests.id, payload.requestId));

  return request;
}
