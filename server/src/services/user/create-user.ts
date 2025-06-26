import { hash } from "bcrypt";
import { Transaction } from "../../db";
import { users } from "../../db/schema";
import { getEnv } from "../../env.config";
import { checkUserEmailAvailability } from "./check-user-email-availability";
import { createVerificationRequest } from "./create-verification-request";
import { deleteUnverifiedUsers } from "./delete-unverified-users";

export async function createUser(
  tx: Transaction,
  payload: { email: string; password: string }
) {
  await deleteUnverifiedUsers();
  await checkUserEmailAvailability(tx, { email: payload.email });

  const isInsider = getEnv("SEED_INSIDER_EMAIL") === payload.email;

  const [user] = await tx
    .insert(users)
    .values({
      email: payload.email,
      hashedPassword: await hash(payload.password, 10),
      isInsider,
    })
    .returning();

  const request = await createVerificationRequest(tx, { userId: user.id });

  return { user, request };
}
