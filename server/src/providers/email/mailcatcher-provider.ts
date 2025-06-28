import { createTransport, Transporter } from "nodemailer";
import { getEnv } from "../../env.config";
import { EmailData, EmailProvider, EmailResult } from "./types";

type Sender = string | { name: string; address: string };

export class MailCatcherProvider implements EmailProvider {
  private transporter: Transporter;
  private sender: Sender;

  constructor(config: { sender: Sender }) {
    this.sender = config.sender;

    const mailCatcherServerPort = getEnv("MAIL_CATCHER_SERVER_PORT");
    if (!mailCatcherServerPort) {
      throw new Error("Mail catcher server port not configured in env");
    }

    this.transporter = createTransport({
      host: "localhost",
      port: mailCatcherServerPort,
      ignoreTLS: true,
    });
  }

  async send(emailData: EmailData): Promise<EmailResult> {
    try {
      const info = await this.transporter.sendMail({
        from: this.sender,
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
}
