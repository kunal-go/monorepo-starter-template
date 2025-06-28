import axios, { AxiosInstance } from "axios";
import { getEnv } from "../../env.config";
import { EmailData, EmailProvider, EmailResult } from "./types";

export class BrevoProvider implements EmailProvider {
  async send(emailData: EmailData): Promise<EmailResult> {
    const client = this.getAxiosClient();

    try {
      const payload = {
        sender: { email: getEnv("FROM_EMAIL") },
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

  private getAxiosClient(): AxiosInstance {
    const apiKey = ""; // getEnv("BREVO_API_KEY")

    return axios.create({
      baseURL: "https://api.brevo.com/v3",
      headers: {
        "api-key": apiKey,
      },
    });
  }
}
