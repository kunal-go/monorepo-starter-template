import { getEmailProvider } from "../../providers/email";

export async function sentOtpEmail(payload: { email: string; otp: string }) {
  try {
    const emailProvider = getEmailProvider();
    await emailProvider.send({
      to: payload.email,
      subject: "OTP Code",
      text: `Your OTP code is ${payload.otp}`,
    });
  } catch (error) {
    console.log(
      "Error sending OTP email:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
