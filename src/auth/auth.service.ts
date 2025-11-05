import { addMinutes, format } from "date-fns";
import { enqueueMail } from "../email/email.queue";
import { emailHTML } from "../email/templates";
import prisma from "../prisma/client";
import { tokenService } from "../token/token.service";
import { CustomError } from "../utils/customError";
import { comparePassword } from "../utils/passwordHashing";
import type { ForgotPasswordDto, LoginDto, ResetPasswordDto, SignupDto, VerifyEmailDto } from "./auth.dto";
import type { User } from "../generated/prisma";

export const authService = {
  async signup({ email, password, username }: SignupDto) {
    const verificationToken = crypto.randomUUID();
    const user = await prisma.user.create({
      data: {
        email,
        password,
        username,
        verification_token: verificationToken,
        verification_token_expires_at: addMinutes(new Date(), 30),
      },
    });

    const emailData = {
      username: user.username,
      email: user.email,
      subject: "Email Verification",
      verificationToken,
    };

    // queue mail
    const html = await emailHTML.verifyEmail({ username, verificationToken });
    enqueueMail(emailData, html);

    return user;
  },

  async verifyEmailOnSignup({ username, verification_token }: VerifyEmailDto) {
    const user = await prisma.user.findUnique({
      where: {
        username,
        verification_token: verification_token,
        verification_token_expires_at: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new CustomError("Invalid or expired verification link", 400);
    }

    const response = await prisma.user.update({
      where: { id: user.id },
      data: {
        email_verified: true,
        verification_token: null,
        verification_token_expires_at: null,
      },
    });

    const emailData = {
      username: user.username,
      email: user.email,
      subject: "Successful Registration",
    };

    // queue mail
    const html = await emailHTML.successfulRegistration({ username });
    enqueueMail(emailData, html);

    return response;
  },

  async login({ email, password, device_id, user_agent, ip }: LoginDto & { device_id: string; user_agent: string; ip: string }) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new CustomError("Invalid credentials", 400);
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
      throw new CustomError("Invalid credentials", 400);
    }

    const accessToken = await tokenService.generateAccessToken({ sub: user.id });
    const refreshToken = await tokenService.generateRefreshToken();
    await tokenService.storeRefreshToken(refreshToken, user.id, user_agent, device_id, ip);

    return {
      accessToken,
      refreshToken,
    };
  },

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const resetPasswordToken = crypto.randomUUID();
    const resetPasswordTokenExpiresAt = addMinutes(new Date(), 30); // 30mins

    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_password_token: resetPasswordToken,
        reset_password_token_expires_at: resetPasswordTokenExpiresAt,
      },
    });

    const emailData = {
      username: user.username,
      email: user.email,
      subject: "Password Reset Request",
      resetPasswordToken,
    };

    // queue mail
    const html = await emailHTML.resetPassword({ username: user.username, resetPasswordToken });
    enqueueMail(emailData, html);

    return user;
  },

  async resetPassword({ password, token, username }: ResetPasswordDto) {
    const user = await prisma.user.findUnique({
      where: {
        username,
        reset_password_token: token,
        reset_password_token_expires_at: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new CustomError("Invalid or expired password reset link", 400);
    }

    const response = await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_password_token: null,
        reset_password_token_expires_at: null,
        password,
      },
    });

    await prisma.refreshToken.deleteMany({
      where: {
        user_id: user.id,
      },
    });

    const emailData = {
      username: user.username,
      email: user.email,
      subject: "Successful Password Reset",
    };

    // queue mail
    const now = new Date().toISOString();
    const formatted = format(now, "MMM d, yyyy, h:mm:ss a");
    const html = await emailHTML.successfulPasswordReset({ username: user.username, updatedDate: formatted });
    enqueueMail(emailData, html);

    return response;
  },

  async refreshToken({ user, refreshToken, userAgent, deviceId, ip }: { user: User | undefined; refreshToken: string; userAgent: string; deviceId: string; ip: string }) {
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const newAccessToken = await tokenService.generateAccessToken({ sub: user.id });
    const newRefreshToken = await tokenService.rotateRefreshToken(refreshToken, user.id, userAgent, deviceId, ip);

    return {
      newAccessToken,
      newRefreshToken,
    };
  },

  async logout({ user, refreshToken, deviceId, userAgent }: { user: User | undefined; refreshToken: string; deviceId: string; userAgent: string }) {
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return tokenService.deleteRefreshToken(refreshToken, user.id, deviceId, userAgent);
  },
};
