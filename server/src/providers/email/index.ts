import { getEnv } from "../../env.config";
import { MailCatcherProvider } from "./mailcatcher-provider";
import { EmailProvider } from "./types";

export * from "./types";

export function getEmailProvider(): EmailProvider {
  const name = getEnv("FROM_EMAIL_NAME");
  const address = getEnv("FROM_EMAIL");
  const sender = { name, address };

  const isProdEnv = getEnv("NODE_ENV") === "production";
  if (!isProdEnv) {
    return new MailCatcherProvider({ sender });
  }

  /**
   * Nodemailer provider
   */
  // const host = getEnv("SMTP_HOST");
  // const port = getEnv("SMTP_PORT");
  // const secure = getEnv("SMTP_SECURE");
  // const user = getEnv("SMTP_USER");
  // const pass = getEnv("SMTP_PASS");
  // return new NodemailerProvider({
  //   sender,
  //   host,
  //   port,
  //   secure,
  //   auth: { user, pass },
  // });

  /**
   * Brevo provider
   */
  // const apiKey = getEnv("BREVO_API_KEY");
  // return new BrevoProvider({ apiKey, sender });

  throw new Error("Email provider not implemented for production use");
}
