import { pretty, render } from "@react-email/components";
import WelcomeEmail, { type WelcomeEmailProps } from "./betterpush-welcome";
import LoginEmail, { type LoginEmailProps } from "./new-login";
import SuccessfulPasswordResetEmail, { type SuccessfulPasswordResetEmailProps } from "./password-reset-success";
import ResetPassword, { type ResetPasswordProps } from "./reset-password";
import VerifyEmail, { type VerifyEmailProps } from "./signup-verification";

export const emailHTML = {
  async verifyEmail(props: VerifyEmailProps) {
    return pretty(await render(<VerifyEmail {...props} />));
  },
  async successfulRegistration(props: WelcomeEmailProps) {
    return pretty(await render(<WelcomeEmail {...props} />));
  },
  async resetPassword(props: ResetPasswordProps) {
    return pretty(await render(<ResetPassword {...props} />));
  },
  async successfulPasswordReset(props: SuccessfulPasswordResetEmailProps) {
    return pretty(await render(<SuccessfulPasswordResetEmail {...props} />));
  },
  async newLogin(props: LoginEmailProps) {
    return pretty(await render(<LoginEmail {...props} />));
  },
};
