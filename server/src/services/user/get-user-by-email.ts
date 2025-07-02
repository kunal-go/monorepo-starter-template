import { eq } from "drizzle-orm";
import { ReadTransaction } from "../../db";
import { users } from "../../db/schema";

export async function getUserByEmail(tx: ReadTransaction, email: string) {
  const [user] = await tx.select().from(users).where(eq(users.email, email));
  return user ?? null;
}
