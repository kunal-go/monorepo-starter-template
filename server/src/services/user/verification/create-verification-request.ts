import { hash } from "bcrypt";
import { getValidity } from "../../../common/utils/date";
import { generateOtpCode } from "../../../common/utils/otp";
import { WriteTransaction } from "../../../db";
import { User, verificationRequests } from "../../../db/schema/schema";
import { sentOtpEmail } from "../../email/send-otp-email";

export async function createVerificationRequest(
  tx: WriteTransaction,
  payload: { user: User }
) {
  const otpCode = generateOtpCode();

  const [request] = await tx
    .insert(verificationRequests)
    .values({
      userId: payload.user.id,
      hashedOtp: await hash(otpCode, 10),
      validTill: getValidity(5, "minute"),
    })
    .returning();

  await sentOtpEmail({ email: payload.user.email, otp: otpCode });

  return request;
}
