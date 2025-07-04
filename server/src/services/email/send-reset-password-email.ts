import { getEmailProvider } from "../../providers/email";

export async function sendResetPasswordOtpEmail(payload: {
  email: string;
  otp: string;
}) {
  try {
    const emailProvider = getEmailProvider();
    await emailProvider.send({
      to: payload.email,
      subject: "Reset Password Code",
      text: `Your reset password code is ${payload.otp}`,
    });
  } catch (error) {
    console.log(
      "Error sending reset password email:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
