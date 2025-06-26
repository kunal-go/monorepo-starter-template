import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  email: text("email").unique().notNull(),
  hashedPassword: text("hashed_password").notNull(),
  passwordUpdatedAt: timestamp("password_updated_at"),
  isVerified: boolean("is_verified").notNull().default(false),
  isInsider: boolean("is_insider").notNull().default(false),
});
