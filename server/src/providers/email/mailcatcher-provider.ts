import { createTransport, Transporter } from "nodemailer";
import { getEnv } from "../../env.config";
import { EmailData, EmailProvider, EmailResult } from "./types";

export class MailCatcherProvider implements EmailProvider {
  async send(emailData: EmailData): Promise<EmailResult> {
    const transporter = this.getTransporter();

    const name = getEnv("FROM_EMAIL_NAME");
    const address = getEnv("FROM_EMAIL");

    try {
      const info = await transporter.sendMail({
        from: name
          ? {
              name: getEnv("FROM_EMAIL_NAME"),
              address: getEnv("FROM_EMAIL"),
            }
          : address,
        to: Array.isArray(emailData.to)
          ? emailData.to.join(", ")
          : emailData.to,
        cc: emailData.cc
          ? Array.isArray(emailData.cc)
            ? emailData.cc.join(", ")
            : emailData.cc
          : undefined,
        bcc: emailData.bcc
          ? Array.isArray(emailData.bcc)
            ? emailData.bcc.join(", ")
            : emailData.bcc
          : undefined,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private getTransporter(): Transporter {
    const mailCatcherServerPort = getEnv("MAIL_CATCHER_SERVER_PORT");
    if (!mailCatcherServerPort) {
      throw new Error("Mail catcher server port not configured in env");
    }

    return createTransport({
      host: "localhost",
      port: mailCatcherServerPort,
      ignoreTLS: true,
    });
  }
}
