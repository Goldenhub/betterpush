import crypto from "node:crypto";
import readline from "node:readline";
import type { Readable } from "node:stream";
import type { NextFunction, Request, Response } from "express";
import config from "../../../config";
import { CustomError } from "../../../utils/customError";
import { responseHandler } from "../../../utils/responseHandler";
import type { CreateProjectDto, DeployDto, GetProjectsDto, GetTeamsDto, ProviderWebhookDTO, StreamDeploymentDto } from "../../deployment.dto";
import { DeploymentService } from "../../deployment.service";
import type { DeploymentControllerStrategy } from "../strategy.deployment.interface";

export class VercelDeploymentControllerStrategy implements DeploymentControllerStrategy {
  constructor(private readonly deploymentService = new DeploymentService()) {}

  async deploy(req: Request, res: Response, _next: NextFunction) {
    // const payload = this.adapter.deployPayload(req.body as DeployDto);
    const { name, branch, framework, gitHost, org, project, provider, repo, teamId, deploymentId, alias }: Omit<DeployDto, "id"> = req.body;
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
      deploymentId,
      alias,
    });

    return responseHandler.success(res, 201, "Deployed", response);
  }

  async streamDeployment(req: Request, res: Response, _next: NextFunction) {
    const { deployment_id, provider } = req.params as unknown as StreamDeploymentDto;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const controller = new AbortController();

    req.on("close", () => {
      controller.abort();
      res.end();
      return;
    });

    const response = await this.deploymentService.streamDeployment({ provider, deployment_id });

    if (!response) {
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({ message: "Failed to connect to Vercel" })}\n\n`);
      res.end();
      return;
    }

    const stream = response as Readable;

    const rl = readline.createInterface({
      input: stream, // this is a Readable stream
      crlfDelay: Infinity,
    });

    // Pipe raw chunks to browser SSE
    for await (const line of rl) {
      if (res.writableEnded) break;
      if (!line.trim()) continue;
      const event = JSON.parse(line);

      res.write(`event: ${event.type || "message"}\n`);
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  }

  async createProject(req: Request, res: Response, _next: NextFunction) {
    const { projectName, framework, repo, teamId, type, provider, envVars }: Omit<CreateProjectDto, "id"> = req.body;
    const { id } = req.user;
    const response = await this.deploymentService.createProject({ projectName, framework, repo, teamId, type, provider, id, envVars });

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
    const { payload, type }: Omit<ProviderWebhookDTO, "provider"> = req.body;
    const signature = req.headers["x-vercel-signature"] as string;
    const rawBody = JSON.stringify(req.body);

    const { CLIENT_SECRET_VERCEL } = config;

    const expected = crypto
      .createHmac("sha1", CLIENT_SECRET_VERCEL as string)
      .update(Buffer.from(rawBody, "utf-8"))
      .digest("hex");

    console.log("signature:", signature);
    console.log("expected:", expected);

    if (signature !== expected) {
      throw new CustomError("Invalid webhook signature", 400);
    }

    await this.deploymentService.webhook({ provider, payload, type });
    return responseHandler.success(res, 200, "Webhook received");
  }
}
