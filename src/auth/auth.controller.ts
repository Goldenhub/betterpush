import type { Request, Response } from "express";
import config from "../config";
import { SECONDS_IN_A_DAY } from "../constants";
import type { User } from "../generated/prisma";
import { CustomError } from "../utils/customError";
import { handleTryCatch } from "../utils/handleTryCatch";
import { responseHandler } from "../utils/responseHandler";
import type { ForgotPasswordDto, LoginDto, LogoutDto, RefreshTokenDto, ResetPasswordDto, SignupDto, VerifyEmailDto } from "./auth.dto";
import { authService } from "./auth.service";

export const signup = handleTryCatch(async (req: Request, res: Response) => {
  const { email, password, username }: SignupDto = req.body;

  const response = await authService.signup({ email, password, username });

  if (!response) {
    return responseHandler.error(res, new CustomError("Something went wrong", 500));
  }

  return responseHandler.success(res, 201, "User created successfully");
});

export const verifyEmailOnSignup = handleTryCatch(async (req: Request, res: Response) => {
  const { username, verification_token }: VerifyEmailDto = req.body;

  const response = await authService.verifyEmailOnSignup({ username, verification_token });

  if (!response) {
    return responseHandler.error(res, new CustomError("Something went wrong", 500));
  }

  return responseHandler.success(res, 200, "Email verified successfully");
});

export const login = handleTryCatch(async (req: Request, res: Response) => {
  const { REFRESH_TOKEN_EXPIRATION } = config;
  const refresh_token_expiresIn = Number(REFRESH_TOKEN_EXPIRATION) * SECONDS_IN_A_DAY * 1000;
  const access_token_expiresIn = 15 * 60 * 1000; // 15 minutes

  const { email, password, device_id }: LoginDto = req.body;
  const user_agent = req.headers["user-agent"] ?? "unknown";
  const ip = req.ip ?? "0.0.0.0";

  const { accessToken, refreshToken } = await authService.login({ email, password, device_id, user_agent, ip });

  // send the refresh token via http-only cookie
  res.cookie("refresh-token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: refresh_token_expiresIn,
  });

  // send the access token via http-only cookie
  res.cookie("access-token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: access_token_expiresIn,
  });

  return responseHandler.success(res, 200, "Successful login");
});

export const forgotPassword = handleTryCatch(async (req: Request, res: Response) => {
  const { email }: ForgotPasswordDto = req.body;

  const response = await authService.forgotPassword({ email });

  if (!response) {
    return responseHandler.error(res, new CustomError("Something went wrong", 500));
  }

  return responseHandler.success(res, 200, "Password reset link sent to your email");
});

export const resetPassword = handleTryCatch(async (req: Request, res: Response) => {
  const { password, token, username }: ResetPasswordDto = req.body;

  const response = await authService.resetPassword({ password, token, username });

  if (!response) {
    return responseHandler.error(res, new CustomError("Something went wrong", 500));
  }

  return responseHandler.success(res, 200, "Your password has been reset");
});

export const refreshToken = handleTryCatch(async (req: Request, res: Response) => {
  const { "refresh-token": refreshToken } = req.cookies;
  const user: User | undefined = req.user;
  const userAgent = req.headers["user-agent"] ?? "unknown";
  const ip = req.ip ?? "0.0.0.0";
  const { device_id: deviceId }: RefreshTokenDto = req.body;

  if (!refreshToken) {
    return responseHandler.error(res, new CustomError("No refresh token provided", 401));
  }

  const { newAccessToken, newRefreshToken } = await authService.refreshToken({ user, refreshToken, ip, userAgent, deviceId });

  const { REFRESH_TOKEN_EXPIRATION } = config;
  const refresh_token_expiresIn = Number(REFRESH_TOKEN_EXPIRATION) * SECONDS_IN_A_DAY * 1000;
  const access_token_expiresIn = 15 * 60 * 1000; // 15 minutes

  // send the refresh token via http-only cookie
  res.cookie("refresh-token", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: refresh_token_expiresIn,
  });

  // send the access token via http-only cookie
  res.cookie("access-token", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: access_token_expiresIn,
  });

  return responseHandler.success(res, 200, "Tokens have been refreshed");
});

export const logout = handleTryCatch(async (req: Request, res: Response) => {
  const user: User | undefined = req.user;
  const { "refresh-token": refreshToken } = req.cookies;
  const { device_id: deviceId }: LogoutDto = req.body;
  const userAgent = req.headers["user-agent"] ?? "unknown";

  const response = await authService.logout({ user, refreshToken, deviceId, userAgent });

  if (!response) {
    return responseHandler.error(res, new CustomError("Error encountered", 401));
  }

  res.clearCookie("refresh-token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  res.clearCookie("access-token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  return responseHandler.success(res, 200, "Logged out successfully");
});
