import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";

export async function getUserById(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  if (!user) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }
  return user;
}
