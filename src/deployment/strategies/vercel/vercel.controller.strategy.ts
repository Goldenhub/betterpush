import type { BinaryLike } from "node:crypto";
import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import config from "../../../config";
import { CustomError } from "../../../utils/customError";
import { responseHandler } from "../../../utils/responseHandler";
import type { CreateProjectDto, DeployDto, GetProjectsDto, GetTeamsDto, ProviderWebhookDTO } from "../../deployment.dto";
import { DeploymentService } from "../../deployment.service";
import type { DeploymentControllerStrategy } from "../strategy.deployment.interface";

export class VercelDeploymentControllerStrategy implements DeploymentControllerStrategy {
  constructor(private readonly deploymentService = new DeploymentService()) {}

  async deploy(req: Request, res: Response, _next: NextFunction) {
    // const payload = this.adapter.deployPayload(req.body as DeployDto);
    const { name, branch, framework, gitHost, org, project, provider, repo, teamId }: Omit<DeployDto, "id"> = req.body;
    const { id } = req.user;

    const response = await this.deploymentService.deploy({
      name,
      branch,
      framework,
      gitHost,
      org,
      project,
      provider,
      repo,
      teamId,
      id,
    });

    return responseHandler.success(res, 201, "Deployed", response);
  }

  async createProject(req: Request, res: Response, _next: NextFunction) {
    const { projectName, framework, repo, teamId, type, provider }: Omit<CreateProjectDto, "id"> = req.body;
    const { id } = req.user;
    const response = await this.deploymentService.createProject({ projectName, framework, repo, teamId, type, provider, id });

    return responseHandler.success(res, 201, "Project created", response);
  }

  async getTeams(req: Request, res: Response, _next: NextFunction) {
    const { provider }: Pick<GetTeamsDto, "provider"> = req.body;
    const { id } = req.user;

    const response = await this.deploymentService.getTeams({ provider, id });

    return responseHandler.success(res, 200, "Teams fetched", response);
  }

  async getProjects(req: Request, res: Response, _next: NextFunction) {
    const { provider, teamId }: Omit<GetProjectsDto, "id"> = req.body;
    const { id } = req.user;

    const response = await this.deploymentService.getProjects({ provider, teamId, id });

    return responseHandler.success(res, 200, "Projects fetched", response);
  }

  async webhook(req: Request, res: Response, _next: NextFunction) {
    const { provider } = req.params as Pick<ProviderWebhookDTO, "provider">;
    const { payload }: Pick<ProviderWebhookDTO, "payload"> = req.body;
    const signature = req.headers["x-vercel-signature"] as string;

    console.log(req.params);
    console.log("signature:", signature);

    // const { CLIENT_SECRET_VERCEL } = config;

    // const expected = crypto
    //   .createHmac("sha256", CLIENT_SECRET_VERCEL as string)
    //   .update(JSON.stringify(payload))
    //   .digest("hex");

    // if (signature !== expected) {
    //   throw new CustomError("Invalid webhook signature", 400);
    // }

    await this.deploymentService.webhook({ provider, payload });
    return responseHandler.success(res, 200, "Webhook received");
  }
}
