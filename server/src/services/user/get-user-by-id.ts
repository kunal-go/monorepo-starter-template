import { eq } from "drizzle-orm";
import { ReadTransaction } from "../../db";
import { users } from "../../db/schema";

export async function getUserById(tx: ReadTransaction, userId: string) {
  const [user] = await tx.select().from(users).where(eq(users.id, userId));
  return user ?? null;
}
