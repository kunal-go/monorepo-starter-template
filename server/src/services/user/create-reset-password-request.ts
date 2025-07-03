import { hash } from "bcrypt";
import { eq } from "drizzle-orm";
import { RESET_PASSWORD_REQUEST_VALIDITY_IN_MINUTES } from "../../common/constant";
import { UnprocessableEntityError } from "../../common/errors";
import { getValidity } from "../../common/utils/date";
import { generateOtpCode } from "../../common/utils/otp";
import { WriteTransaction } from "../../db";
import { ResetPasswordRequest, resetPasswordRequests } from "../../db/schema";
import { sendResetPasswordOtpEmail } from "../email/send-reset-password-email";
import { getUserByEmail } from "./get-user-by-email";

interface CreateResetPasswordRequestInput {
  email: string;
  newPassword: string;
}

export async function createResetPasswordRequest(
  tx: WriteTransaction,
  { email, newPassword }: CreateResetPasswordRequestInput
) {
  // Fetch user to get email
  const user = await getUserByEmail(tx, email);
  if (!user) {
    throw new UnprocessableEntityError("User not found");
  }

  const otpCode = generateOtpCode();
  const otpHash = await hash(otpCode, 10);
  const newPasswordHash = await hash(newPassword, 10);
  const validTill = getValidity(
    RESET_PASSWORD_REQUEST_VALIDITY_IN_MINUTES,
    "minute"
  );

  // Upsert: if a request for this user exists, update it; otherwise, insert new
  const [existing] = await tx
    .select()
    .from(resetPasswordRequests)
    .where(eq(resetPasswordRequests.userId, user.id));

  let request: ResetPasswordRequest;

  if (existing) {
    const [updatedRequest] = await tx
      .update(resetPasswordRequests)
      .set({
        newPasswordHash,
        otpHash,
        validTill,
        createdAt: new Date(),
      })
      .where(eq(resetPasswordRequests.userId, user.id))
      .returning();

    request = updatedRequest;
  } else {
    const [newRequest] = await tx
      .insert(resetPasswordRequests)
      .values({
        userId: user.id,
        newPasswordHash,
        otpHash,
        validTill,
      })
      .returning();

    request = newRequest;
  }

  // Send OTP email
  await sendResetPasswordOtpEmail({ email: user.email, otp: otpCode });

  return request;
}
