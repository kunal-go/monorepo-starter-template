import { getEmailProvider } from "../../providers/email";

export async function sendPasswordChangeAlert(email: string) {
  try {
    const emailProvider = getEmailProvider();
    await emailProvider.send({
      to: email,
      subject: "Your password was changed",
      text: `Your account password was recently changed. If you did not perform this action, please contact support immediately.`,
    });
  } catch (error) {
    console.log(
      "Error sending password change alert email:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
