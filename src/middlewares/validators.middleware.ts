import type { NextFunction, Request, Response } from "express";
import { ForgotPasswordDto, LoginDto, LogoutDto, RefreshTokenDto, ResetPasswordDto, SignupDto, VerifyEmailDto } from "../auth/auth.dto";
import { validator } from "../utils/validator";

export const validate = {
  // Auth
  signup: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, SignupDto);
  },
  verifyEmailOnSignup: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, VerifyEmailDto);
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, LoginDto);
  },
  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, ForgotPasswordDto);
  },
  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, ResetPasswordDto);
  },
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, RefreshTokenDto);
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, LogoutDto);
  },
};
