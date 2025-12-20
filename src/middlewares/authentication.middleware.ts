import type { NextFunction, Request, Response } from "express";
import prisma from "../prisma/client";
import type { tokenPayload } from "../token/token.interface";
import { tokenService } from "../token/token.service";
import { CustomError } from "../utils/customError";
import { handleTryCatch } from "../utils/handleTryCatch";

const { verifyAccessToken, verifyRefreshToken } = tokenService;

export const authenticate = handleTryCatch(async (req: Request, _res: Response, next: NextFunction) => {
  let data: tokenPayload | null = null;
  if (req.path === "/refresh") {
    const { "refresh-token": refreshToken } = req.cookies as { "refresh-token": string };

    if (!refreshToken) {
      throw new CustomError("Unauthorized to refresh token", 401);
    }
    data = await verifyRefreshToken(refreshToken);
  } else {
    const { "access-token": token } = req.cookies as { "access-token": string };

    if (!token) {
      throw new CustomError("Unauthorized", 401);
    }
    data = await verifyAccessToken<tokenPayload>(token);
  }

  if (!data) {
    throw new CustomError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: data.sub },
  });

  req.user = user ?? undefined;

  next();
});
