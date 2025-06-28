import axios from "axios";
import { EmailData, EmailProvider, EmailResult } from "./types";

type Sender = string | { name: string; address: string };

export class BrevoProvider implements EmailProvider {
  private sender: Sender;
  private apiKey: string;

  constructor(config: { apiKey: string; sender: Sender }) {
    this.apiKey = config.apiKey;
    this.sender = config.sender;
  }

  async send(emailData: EmailData): Promise<EmailResult> {
    const client = axios.create({
      baseURL: "https://api.brevo.com/v3",
      headers: {
        "api-key": this.apiKey,
      },
    });

    try {
      const payload = {
        sender: this.sender,
        to: Array.isArray(emailData.to)
          ? emailData.to.map((email) => ({ email }))
          : [{ email: emailData.to }],
        cc: emailData.cc
          ? Array.isArray(emailData.cc)
            ? emailData.cc.map((email) => ({ email }))
            : [{ email: emailData.cc }]
          : undefined,
        bcc: emailData.bcc
          ? Array.isArray(emailData.bcc)
            ? emailData.bcc.map((email) => ({ email }))
            : [{ email: emailData.bcc }]
          : undefined,
        subject: emailData.subject,
        textContent: emailData.text,
        htmlContent: emailData.html,
      };

      const response = await client.post("/smtp/email", payload);

      return {
        success: true,
        messageId: response.data.messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Unknown error",
      };
    }
  }
}
