import { relations } from "drizzle-orm";
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

export type User = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ one }) => ({
  verificationRequest: one(verificationRequests),
}));

export const verificationRequests = pgTable("verification_request", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  hashedOtp: text("hashed_otp").notNull(),
  validTill: timestamp("valid_till").notNull(),
});

export type VerificationRequest = typeof verificationRequests.$inferSelect;

export const verificationRequestsRelations = relations(
  verificationRequests,
  ({ one }) => ({
    user: one(users, {
      fields: [verificationRequests.userId],
      references: [users.id],
    }),
  })
);
