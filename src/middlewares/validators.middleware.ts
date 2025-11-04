import type { NextFunction, Request, Response } from "express";
import { ForgotPasswordDto, LoginDto, LogoutDto, RefreshTokenDto, ResetPasswordDto, SignupAuthDto, SignupDto, VerifyOtpDto } from "../dtos/auth.dto";
import { CreateLoadDto, DeleteLoadDto, GetLoadDto, LoadAssignmentDto, SearchLoadDto, UploadLoadDto } from "../dtos/load.dto";
import { GetUserLoadDto, GetUserProfileDto, UpdateBrokerProfileDto, UpdateCarrierProfileDto, UpdateDriverProfileDto, UpdateUserProfileDto } from "../dtos/user.dto";
import { validator } from "../utils/validator";

export const validate = {
  // Auth
  login: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, LoginDto);
  },
  signup: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, SignupDto);
  },
  signupAuth: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, SignupAuthDto);
  },
  verifySignupOTP: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, VerifyOtpDto);
  },
  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, ForgotPasswordDto);
  },
  verifyForgotPasswordOTP: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, VerifyOtpDto);
  },
  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, ResetPasswordDto);
  },
  refresh: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, RefreshTokenDto);
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, LogoutDto);
  },

  // User
  getUserProfile: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, GetUserProfileDto);
  },
  updateUserProfile: async (req: Request, res: Response, next: NextFunction) => {
    switch (req.body.role) {
      case "carrier":
        return validator(req, res, next, [UpdateUserProfileDto, UpdateCarrierProfileDto]);
      case "broker":
        return validator(req, res, next, [UpdateUserProfileDto, UpdateBrokerProfileDto]);
      case "driver":
        return validator(req, res, next, [UpdateUserProfileDto, UpdateDriverProfileDto]);
      default:
        return next();
    }
  },
  getLoadsCreatedByUser: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, GetUserLoadDto);
  },
  getLoadsAssignedToUser: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, GetUserLoadDto);
  },

  // Load
  getLoad: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, GetLoadDto);
  },
  createLoad: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, CreateLoadDto);
  },
  updateLoad: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, UploadLoadDto);
  },
  searchLoad: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, SearchLoadDto);
  },
  deleteLoad: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, DeleteLoadDto);
  },
  loadAssignmentRequest: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, LoadAssignmentDto);
  },
  acceptLoadAssignmentRequest: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, LoadAssignmentDto);
  },
  declineLoadAssignmentRequest: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, LoadAssignmentDto);
  },
};
