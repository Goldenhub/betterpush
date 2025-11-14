import type { Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { handleTryCatch } from "../utils/handleTryCatch";
import { responseHandler } from "../utils/responseHandler";
import { repoService } from "./repo.service";

export const getRepos = handleTryCatch(async (req: Request, res: Response) => {
  const { id } = req.user;
  const response = await repoService.getRepos(id);

  if (!response) {
    return responseHandler.error(res, new CustomError("Something went wrong", 500));
  }

  return responseHandler.success(res, 200, "Repos fetched successfully", response);
});
