import type { NextFunction, Request, Response } from "express";
import { CreatePasswordDto, ForgotPasswordDto, LoginDto, LogoutDto, RefreshTokenDto, ResetPasswordDto, SignupDto, VerifyEmailDto } from "../auth/auth.dto";
import { DeployDto, GetProjectsDto, GetTeamsDto, ProjectDto } from "../deployment/deployment.dto";
import { GetUserDto, UpdateUserDto } from "../user/user.dto";
import { validator } from "../utils/validator";
import { ConnectProviderCallbackDto, ConnectProviderDto } from "../providers/providers.dto";

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
    return validator(req, res, next, ProjectDto);
  },
  getTeams: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, GetTeamsDto);
  },
  getProjects: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, GetProjectsDto);
  },

  // providers
  connectProvider: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, ConnectProviderDto);
  },
  connectProviderCallback: async (req: Request, res: Response, next: NextFunction) => {
    return validator(req, res, next, ConnectProviderCallbackDto);
  },
};
