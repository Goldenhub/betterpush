import type { Request, Response } from "express";
import type { User } from "../generated/prisma";
import { CustomError } from "../utils/customError";
import { handleTryCatch } from "../utils/handleTryCatch";
import { responseHandler } from "../utils/responseHandler";
import type { GetUserDto, UpdateUserDto } from "./user.dto";
import { userService } from "./user.service";

export const getCurrentUser = handleTryCatch(async (req: Request, res: Response) => {
  const user: User = req.user;

  const response = await userService.getCurrentUser(user.id);

  if (!response) {
    return responseHandler.error(res, new CustomError("Something went wrong", 500));
  }

  return responseHandler.success(res, 200, "Success", response);
});

export const getUser = handleTryCatch(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as GetUserDto;

  const response = await userService.getUser(id);

  if (!response) {
    return responseHandler.error(res, new CustomError("Something went wrong", 500));
  }

  return responseHandler.success(res, 200, "Success", response);
});

export const updateUser = handleTryCatch(async (req: Request, res: Response) => {
  const user: User = req.user;
  const { name, username, email, avatar_url }: UpdateUserDto = req.body;

  const response = await userService.updateUser({ name, username, email, avatar_url }, user.id);

  if (!response) {
    return responseHandler.error(res, new CustomError("Something went wrong", 500));
  }

  return responseHandler.success(res, 200, "User profile updated", response);
});
