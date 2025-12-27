import type { NextFunction, Request, Response } from "express";
import { CreatePasswordDto, ForgotPasswordDto, LoginDto, LogoutDto, RefreshTokenDto, ResetPasswordDto, SignupDto, VerifyEmailDto } from "../auth/auth.dto";
import { CreateProjectDto, DeployDto, GetProjectsDto, GetTeamsDto, ProviderWebhookDTO } from "../deployment/deployment.dto";
import { ConnectProviderCallbackDto, ConnectProviderDto } from "../providers/providers.dto";
import { GetUserDto, UpdateUserDto } from "../user/user.dto";
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
  createPassword: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, CreatePasswordDto);
  },
  logout: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, LogoutDto);
  },

  // user
  getUser: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, GetUserDto);
  },
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, UpdateUserDto);
  },

  // deployment
  deploy: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, DeployDto);
  },
  createProject: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, CreateProjectDto);
  },
  getTeams: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, GetTeamsDto);
  },
  getProjects: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, GetProjectsDto);
  },
  providerWebhook: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, ProviderWebhookDTO);
  },

  // providers
  connectProvider: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, ConnectProviderDto);
  },
  connectProviderCallback: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, ConnectProviderCallbackDto);
  },
};
