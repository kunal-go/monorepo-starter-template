import { NodemailerProvider } from "./nodemailer-provider";
import { EmailProvider } from "./types";

export * from "./types";

export function getEmailProvider(): EmailProvider {
  return new NodemailerProvider();
}
