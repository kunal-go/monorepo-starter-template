import { getEnv } from "../../env.config";
import { MailCatcherProvider } from "./mailcatcher-provider";
import { NodemailerProvider } from "./nodemailer-provider";
import { EmailProvider } from "./types";

export * from "./types";

export function getEmailProvider(): EmailProvider {
  const isProdEnv = getEnv("NODE_ENV") === "production";
  if (isProdEnv) {
    return new NodemailerProvider();
  }
  return new MailCatcherProvider();
}
