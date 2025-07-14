import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
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

export const usersRelations = relations(users, ({ one, many }) => ({
  verificationRequest: one(verificationRequests),
  userSessions: many(userSessions),
  resetPasswordRequests: many(resetPasswordRequests),
}));

export const verificationRequests = pgTable("verification_requests", {
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

export const userSessions = pgTable("user_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  validTill: timestamp("valid_till").notNull(),
  refreshKey: text("refresh_key"),
  refreshedAt: timestamp("refreshed_at"),
});

export type UserSession = typeof userSessions.$inferSelect;

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

export const resetPasswordRequests = pgTable("reset_password_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  newPasswordHash: text("new_password_hash").notNull(),
  otpHash: text("otp_hash").notNull(),
  validTill: timestamp("valid_till").notNull(),
});

export type ResetPasswordRequest = typeof resetPasswordRequests.$inferSelect;

export const resetPasswordRequestsRelations = relations(
  resetPasswordRequests,
  ({ one }) => ({
    user: one(users, {
      fields: [resetPasswordRequests.userId],
      references: [users.id],
    }),
  })
);
