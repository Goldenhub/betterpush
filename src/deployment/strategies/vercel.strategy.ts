import { Vercel } from "@vercel/sdk";
import type { CreateDeploymentResponseBody } from "@vercel/sdk/models/createdeploymentop.js";
import type { CreateProjectResponseBody } from "@vercel/sdk/models/createprojectop.js";
import config from "../../config";
import { VercelAdapter } from "../adapters/vercel.adapter";
import type { DeployDto, GetProjectsDto, ProjectDto } from "../deployment.dto";
import type { DeployStrategy } from "./strategy.interface";

export class VercelDeployStrategy implements DeployStrategy {
  private adapter = new VercelAdapter();

  protected vercel = new Vercel({
    bearerToken: config.VERCEL_TOKEN,
  });

  async deploy(data: DeployDto): Promise<CreateDeploymentResponseBody> {
    const payload = this.adapter.payload(data);

    const response = await this.vercel.deployments.createDeployment({
      teamId: data.teamId,
      requestBody: {
        ...payload,
      },
    });

    return response;
  }

  async createProject(data: ProjectDto): Promise<CreateProjectResponseBody> {
    const payload = this.adapter.projectPayload(data);

    const response = await this.vercel.projects.createProject({
      teamId: data.teamId,
      requestBody: {
        ...payload,
      },
    });

    return response;
  }

  async getTeams() {
    const response = await this.vercel.teams.getTeams({
      limit: 20,
    });
    return response;
  }

  async getProjects(data: GetProjectsDto) {
    const response = await this.vercel.projects.getProjects({
      teamId: data.teamId,
    });
    return response;
  }
}
