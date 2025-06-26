import { hash } from "bcrypt";
import { getValidity } from "../../../common/utils/date";
import { generateOtpCode } from "../../../common/utils/otp";
import { WriteTransaction } from "../../../db";
import { verificationRequests } from "../../../db/schema";

export async function createVerificationRequest(
  tx: WriteTransaction,
  payload: { userId: string }
) {
  const otpCode = generateOtpCode();

  const [request] = await tx
    .insert(verificationRequests)
    .values({
      userId: payload.userId,
      hashedOtp: await hash(otpCode, 10),
      validTill: getValidity(5, "minute"),
    })
    .returning();

  // TODO: Send email with otp code
  // TODO: Remove this after email integration
  console.log("OTP Code: ", otpCode);

  return request;
}
