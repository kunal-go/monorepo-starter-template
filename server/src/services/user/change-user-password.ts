import { compare, hash } from "bcrypt";
import { WriteTransaction } from "../../db";
import { users } from "../../db/schema";
import { getUserById } from "./get-user-by-id";
import { ForbiddenError } from "../../common/errors";
import { eq } from "drizzle-orm";
import { sendPasswordChangeAlert } from "../email/send-password-change-alert";

export async function changeUserPassword(
  tx: WriteTransaction,
  payload: { userId: string; currentPassword: string; newPassword: string }
) {
  const user = await getUserById(tx, payload.userId);
  if (!user) {
    throw new ForbiddenError("User not found");
  }

  const isPasswordValid = await compare(
    payload.currentPassword,
    user.hashedPassword
  );
  if (!isPasswordValid) {
    throw new ForbiddenError("Current password is incorrect");
  }

  const [updatedUser] = await tx
    .update(users)
    .set({ hashedPassword: await hash(payload.newPassword, 10) })
    .where(eq(users.id, payload.userId))
    .returning();

  // Fire and forget, do not block password change on email failure
  sendPasswordChangeAlert(user.email);

  return updatedUser;
}
