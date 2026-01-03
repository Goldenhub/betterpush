import crypto from "node:crypto";
import axios from "axios";
import { addMinutes, format } from "date-fns";
import config from "../config";
import { enqueueMail } from "../email/email.queue";
import { emailHTML } from "../email/templates";
import type { User } from "../generated/prisma";
import prisma from "../prisma/client";
import { tokenService } from "../token/token.service";
import { CustomError } from "../utils/customError";
import { encrypt } from "../utils/helpers";
import { comparePassword } from "../utils/passwordHashing";
import type { ForgotPasswordDto, LoginDto, ResetPasswordDto, SignupDto, VerifyEmailDto } from "./auth.dto";

const { GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET, FRONTEND_URL, APP_URL } = config;

export const authService = {
  async signup({ email, password, username, name }: SignupDto) {
    const verificationToken = crypto.randomUUID();
    const user = await prisma.user.create({
      data: {
        name,
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

  async login({ email, password, device_id, user_agent, ip }: LoginDto & { user_agent: string; ip: string }) {
    const user = await prisma.user.findUnique({
      where: {
        email,
        password: {
          not: null,
        },
      },
    });

    if (!user) {
      throw new CustomError("Invalid credentials", 400);
    }

    const passwordMatch = await comparePassword(password, user.password as string);

    if (!passwordMatch) {
      throw new CustomError("Invalid credentials", 400);
    }

    if (!user.email_verified) {
      const verificationToken = crypto.randomUUID();
      const user = await prisma.user.update({
        where: { email: email },
        data: {
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
      const html = await emailHTML.verifyEmail({ username: emailData.username, verificationToken });
      enqueueMail(emailData, html);

      throw new CustomError("Email not verified. A verification link has been sent to your email.", 403);
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

  async createPassword({ password, id }: { password: string; id: string }) {
    const user = await prisma.user.update({
      where: {
        id,
        password: null,
      },
      data: {
        password,
      },
    });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return user;
  },

  async logout({ user, refreshToken, deviceId, userAgent }: { user: User | undefined; refreshToken: string; deviceId: string; userAgent: string }) {
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return tokenService.deleteRefreshToken(refreshToken, user.id, deviceId, userAgent);
  },

  async githubAuth(deviceId: string) {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_OAUTH_CLIENT_ID}&scope=user:email&redirect_uri=${APP_URL}/auth/github/callback?device_id=${deviceId}`;
    return redirectUrl;
  },
  async githubRepo() {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_OAUTH_CLIENT_ID}&scope=repo&redirect_uri=${APP_URL}/auth/github/callback/repos`;
    return redirectUrl;
  },

  async githubOAuthLoginCallback({ device_id, code, user_agent, ip }: { device_id: string; code: string; user_agent: string; ip: string }) {
    // get access token
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: GITHUB_OAUTH_CLIENT_ID,
        client_secret: GITHUB_OAUTH_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const response = tokenRes.data;

    const { access_token, scope } = response;
    const encryptedAccessToken = encrypt(access_token);
    // Get github user profile
    const profile = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { id, login, name, avatar_url, email }: Record<string, string> = profile.data;

    // const device_id = String(id);

    // Some users hide their email — fetch separately if needed
    let userEmail = email;
    if (!userEmail) {
      const emailsRes = await axios.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      userEmail = emailsRes.data.find((e: Record<string, unknown>) => e.primary)?.email;
    }

    // Check if user exists in DB
    const emailExists = await prisma.user.findFirst({
      where: {
        email: userEmail as string,
        git_credentials: {
          some: {
            provider_user_id: {
              not: String(id),
            },
          },
        },
      },
    });

    if (emailExists) {
      throw new CustomError("Email has been used on another auth method", 400);
    }

    let user = await prisma.user.findFirst({
      where: {
        git_credentials: {
          some: {
            provider_user_id: String(id),
          },
        },
      },
    });

    if (!user) {
      console.log("ee");
      // Signup
      user = await prisma.user.create({
        data: {
          name: name as string,
          username: login as string,
          email: userEmail as string,
          avatar_url: avatar_url as string,
          email_verified: true,
          git_credentials: {
            create: {
              provider_user_id: String(id),
              provider: "github",
              scope: scope,
              provider_url: `https://github.com/${login}`,
              accessToken: encryptedAccessToken,
            },
          },
        },
      });
    }

    // Generate your app’s auth token
    const accessToken = await tokenService.generateAccessToken({ sub: user.id });
    const refreshToken = await tokenService.generateRefreshToken();
    await tokenService.storeRefreshToken(refreshToken, user.id, user_agent, device_id, ip);

    // Redirect to frontend with token (or set cookie)
    const responseUrl = `${FRONTEND_URL}/dashboard`;
    return {
      responseUrl,
      accessToken,
      refreshToken,
    };
  },

  async githubOAuthRepoCallback({ code, user }: { code: string; user: User }) {
    // get access token
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: GITHUB_OAUTH_CLIENT_ID,
        client_secret: GITHUB_OAUTH_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const response = tokenRes.data;

    const { access_token, scope } = response;

    const encryptedAccessToken = encrypt(access_token);
    // Get github user profile
    const profile = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { id, login }: Record<string, string> = profile.data;

    // const device_id = String(id);

    //Get repositories
    // const repos = await axios.get("https://api.github.com/user/repos", {
    //   headers: { Authorization: `Bearer ${access_token}` },
    // });

    // // console.log(repos.data);

    const provider = await prisma.gitCredential.findFirst({
      where: {
        provider: "github",
        provider_user_id: String(id),
      },
    });

    // if (provider?.scope?.includes(scope)) {
    //   return `${FRONTEND_URL}/dashboard`;
    // }

    if (provider) {
      console.log("yes");
      await prisma.gitCredential.update({
        where: {
          id: provider.id,
        },
        data: {
          accessToken: encryptedAccessToken,
          scope: `${scope},${provider.scope}`,
        },
      });
    } else if (!provider) {
      console.log("no");
      await prisma.gitCredential.create({
        data: {
          provider: "github",
          provider_user_id: String(id),
          provider_url: `https://github.com/${login}`,
          scope: scope,
          accessToken: encryptedAccessToken,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }
    const responseUrl = `${FRONTEND_URL}/dashboard`;
    return responseUrl;
  },

  // async githubInstallCallback({ installation_id, setup_action }: { installation_id: string; setup_action: string }) {
  //   const response = await axios.post(
  //     `https://api.github.com/app/installations/${installation_id}/access_tokens`,
  //     {},
  //     {
  //       headers: {
  //         Accept: "application/vnd.github+json",
  //         Authorization: `Bearer ${GITHUB_OAUTH_CLIENT_SECRET}`,
  //         "X-GitHub-Api-Version": "2022-11-28",
  //       },
  //     }
  //   );

  //   const access_token = response.data.token;

  //   const profile = await axios.get("https://api.github.com/user", {
  //     headers: {
  //       Authorization: `Bearer ${access_token}`,
  //     },
  //   });
  //   console.log(profile);
  // },
};
