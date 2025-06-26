import { TRPCError } from "@trpc/server";
import { compare } from "bcrypt";
import { eq } from "drizzle-orm";
import { Transaction } from "../../../db";
import { users, verificationRequests } from "../../../db/schema";
import { deleteUnverifiedUsers } from "../delete-unverified-users";

export async function verifyUser(
  tx: Transaction,
  payload: { requestId: string; otp: string }
) {
  await deleteUnverifiedUsers();

  const [request] = await tx
    .select()
    .from(verificationRequests)
    .where(eq(verificationRequests.id, payload.requestId));

  if (!request) {
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: "Verification request expired or invalid",
    });
  }

  const isExpired = new Date(request.validTill) < new Date();
  if (isExpired) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Verification request has expired",
    });
  }

  const isOtpValid = await compare(payload.otp, request.hashedOtp);
  if (!isOtpValid) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid OTP",
    });
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
