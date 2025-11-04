import type { NextFunction, Request, Response } from "express";
import type { ForgotPasswordPayload, tokenPayload } from "../interfaces";
import { verifyAccessToken, verifyRefreshToken, verifyResetPasswordToken } from "../services/jwt.service";
import { CustomError } from "../utils/customError";
import { handleTryCatch } from "../utils/handleTryCatch";

export const authenticate = handleTryCatch(async (req: Request, _res: Response, next: NextFunction) => {
  let data: tokenPayload;
  if (req.path === "/refresh") {
    const { refreshToken } = req.cookies as { refreshToken: string };

    if (!refreshToken) {
      throw new CustomError("Unauthorized to refresh token", 401);
    }
    data = await verifyRefreshToken<tokenPayload>(refreshToken);
  } else {
    const token = req.headers.authorization?.split(" ")[1] as string;

    if (!token) {
      throw new CustomError("Unauthorized", 401);
    }
    data = await verifyAccessToken<tokenPayload>(token);
  }

  if (req.body === undefined) {
    req.body = {};
  }
  req.body.id = data.sub;
  req.body.email = data.email;
  req.body.name = data.name;
  req.body.role = data.role;
  req.body.emailVerified = data.emailVerified;

  next();
});

export const authenticateResetPassword = handleTryCatch(async (req: Request, _res: Response, next: NextFunction) => {
  const { token } = req.body;

  if (!token) {
    throw new CustomError("Unauthorized", 401);
  }

  const data = await verifyResetPasswordToken<ForgotPasswordPayload>(token);

  if (!data.email) {
    throw new CustomError("Unauthorized", 401);
  }

  next();
});
