import { hash } from "bcrypt";
import { getDb, WriteTransaction } from "../../db";
import { users } from "../../db/schema";
import { getEnv } from "../../env.config";
import { checkUserEmailAvailability } from "./check-user-email-availability";
import { deleteUnverifiedUsers } from "./delete-unverified-users";
import { createVerificationRequest } from "./verification/create-verification-request";

export async function createUser(
  tx: WriteTransaction,
  payload: { email: string; password: string }
) {
  await getDb().writeTx(deleteUnverifiedUsers);
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

  const request = await createVerificationRequest(tx, { user });

  return { user, request };
}
