import type { NextFunction, Request, Response } from "express";
import type { CreateProjectDto, DeployDto, GetProjectsDto, GetTeamsDto, ProviderWebhookDTO } from "../deployment.dto";

export interface DeploymentServiceStrategy {
  deploy(data: DeployDto): Promise<unknown>;
  createProject(data: CreateProjectDto): Promise<unknown>;
  getTeams(data: GetTeamsDto): Promise<unknown>;
  getProjects(data: GetProjectsDto): Promise<unknown>;
  webhook(data: ProviderWebhookDTO): Promise<unknown>;
}

export interface DeploymentControllerStrategy {
  deploy: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  createProject: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getTeams: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  getProjects: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  webhook: (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
}
