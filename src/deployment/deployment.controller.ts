import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { handleTryCatch } from "../utils/handleTryCatch";
import type { DeploymentControllerStrategy } from "./strategies/strategy.deployment.interface";
import { VercelDeploymentControllerStrategy } from "./strategies/vercel/vercel.controller.strategy";

class DeploymentController {
  private strategies: Record<string, DeploymentControllerStrategy> = {
    vercel: new VercelDeploymentControllerStrategy(),
  };

  deploy = handleTryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const strategy = this.strategies[req.body.provider as string];
    if (!strategy) {
      throw new CustomError(`No strategy found for provider: ${req.body.provider}`, 400);
    }
    return strategy.deploy(req, res, next);
  });

  createProject = handleTryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const strategy = this.strategies[req.body.provider as string];
    if (!strategy) {
      throw new CustomError(`No strategy found for provider: ${req.body.provider}`, 400);
    }
    return await strategy.createProject(req, res, next);
  });

  getTeams = handleTryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const strategy = this.strategies[req.body.provider as string];
    if (!strategy) {
      throw new CustomError(`No strategy found for provider: ${req.body.provider}`, 400);
    }
    return await strategy.getTeams(req, res, next);
  });

  getProjects = handleTryCatch(async (req: Request, res: Response, next: NextFunction) => {
    const strategy = this.strategies[req.body.provider as string];
    if (!strategy) {
      throw new CustomError(`No strategy found for provider: ${req.body.provider}`, 400);
    }
    return await strategy.getProjects(req, res, next);
  });
}

export const { deploy, createProject, getTeams, getProjects } = new DeploymentController();
