import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { getEnv } from "@/env.config";
import { emailOTP } from "better-auth/plugins";
import * as schema from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log("verification otp", { email, otp, type });
        // Implement the sendVerificationOTP method to send the OTP to the user's email address
      },
    }),
  ],
  session: {
    updateAge: 60 * 60 * 12, // 12 hours
  },
  trustedOrigins: [getEnv("CORS_ORIGIN")],
});
