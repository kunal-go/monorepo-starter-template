import { NotFoundError } from "../../common/errors";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export async function getUserById(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}
