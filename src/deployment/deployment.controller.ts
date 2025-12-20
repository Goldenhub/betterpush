import type { Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { handleTryCatch } from "../utils/handleTryCatch";
import { responseHandler } from "../utils/responseHandler";
import type { DeployDto, GetProjectsDto, GetTeamsDto, ProjectDto } from "./deployment.dto";
import { deploymentService } from "./deployment.service";

export const deploy = handleTryCatch(async (req: Request, res: Response) => {
  const { name, gitHost, repo, branch, org, provider, framework, teamId, project }: DeployDto = req.body;

  const deployment = new deploymentService();
  const response = await deployment.deploy({ name, gitHost, repo, branch, org, provider, framework, teamId, project });

  if (!response) {
    return responseHandler.error(res, new CustomError("Something went wrong", 500));
  }

  return responseHandler.success(res, 201, "Deployed", response);
});

export const createProject = handleTryCatch(async (req: Request, res: Response) => {
  const { projectName, framework, repo, teamId, type, provider }: ProjectDto = req.body;

  const deployment = new deploymentService();
  const response = await deployment.createProject({ projectName, framework, repo, teamId, type, provider });

  if (!response) {
    return responseHandler.error(res, new CustomError("Something went wrong", 500));
  }

  return responseHandler.success(res, 201, "Project created", response);
});

export const getTeams = handleTryCatch(async (req: Request, res: Response) => {
  const { provider }: GetTeamsDto = req.body;

  const deployment = new deploymentService();
  const response = await deployment.getTeams({ provider });

  if (!response) {
    return responseHandler.error(res, new CustomError("Something went wrong", 500));
  }

  return responseHandler.success(res, 201, "Teams fetched", response);
});

export const getProjects = handleTryCatch(async (req: Request, res: Response) => {
  const { provider, teamId }: GetProjectsDto = req.body;

  const deployment = new deploymentService();
  const response = await deployment.getProjects({ provider, teamId });

  if (!response) {
    return responseHandler.error(res, new CustomError("Something went wrong", 500));
  }

  return responseHandler.success(res, 201, "Projects fetched", response);
});
