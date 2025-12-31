import { type ClassConstructor, plainToClass } from "class-transformer";
import { type ValidationError, validate } from "class-validator";
import type { NextFunction, Request, Response } from "express";
import { CustomError } from "./customError";
import { responseHandler } from "./responseHandler";

export const validator = async (req: Request, res: Response, next: NextFunction, dto: ClassConstructor<object> | ClassConstructor<object>[]) => {
  let reqObj = req.body;
  reqObj = {
    ...reqObj,
    ...req.params,
    ...req.query,
    ...req.user,
  };
  if (!reqObj) {
    return responseHandler.error(res, new CustomError("Payload required", 400));
  }
  // if (req.path === "/refresh" && req.method === "POST") {
  //   const { refreshToken } = req.cookies;
  //   Object.assign(reqObj, { refreshToken });
  // }
  const errors: ValidationError[] = [];
  if (Array.isArray(dto)) {
    for (const o of dto) {
      const objectToValidate = plainToClass(o, reqObj);
      const error = await validate(objectToValidate, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      errors.push(...error);
    }
  } else {
    const objectToValidate = plainToClass(dto, reqObj);
    const error: ValidationError[] = await validate(objectToValidate, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    errors.push(...error);
  }
  if (errors.length) {
    const constraints = errors[0]?.constraints as Record<string, string>;
    const message = Object.values(constraints)[0] as string;
    return responseHandler.error(res, new CustomError(message, 400));
  }
  next();
};
