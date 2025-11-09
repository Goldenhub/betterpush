import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma";
import { CustomError } from "./customError";
import { responseHandler } from "./responseHandler";

export const handleTryCatch = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err: unknown) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          // Prisma's unique constraint violation
          const field = err.meta?.target;
          return responseHandler.error(res, new CustomError(`${field} already exists`, 500));
        }
      }
      console.error({
        message: (err as Error).message,
        endpoint: req.path,
        ip: req.ip,
        host: req.hostname,
        method: req.method,
        name: (err as Error).name,
        cause: (err as Error)?.cause,
        stack: (err as Error).stack,
        date: new Date().toUTCString(),
      });
      const error = err as CustomError;
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return responseHandler.error(res, error);
    }
  };
};
