import { Vercel } from "@vercel/sdk";
import type { GitSource, ProjectSettings } from "@vercel/sdk/models/createdeploymentop.js";
import type { CreateProjectRequestBody, GitRepository } from "@vercel/sdk/models/createprojectop.js";
import type { CreateProjectDto, DeployDto, ProviderWebhookDTO } from "../deployment.dto";

export class VercelDeploymentAdapter {
  private client: Vercel;

  constructor(accessToken?: string) {
    this.client = new Vercel({
      bearerToken: accessToken,
    });
  }

  async deploy(data: DeployDto) {
    const response = await this.client.deployments.createDeployment({
      teamId: data.teamId,
      requestBody: this.deployPayload(data),
    });

    return response;
  }

  async createProject(data: CreateProjectDto) {
    const response = await this.client.projects.createProject({
      teamId: data.teamId,
      requestBody: this.projectPayload(data),
    });

    return response;
  }

  async getTeams() {
    const response = await this.client.teams.getTeams({
      limit: 20,
    });
    return response;
  }

  async getProjects(teamId: string) {
    const response = await this.client.projects.getProjects({
      teamId,
    });
    return response;
  }

  async webhook({ payload, type }: Pick<ProviderWebhookDTO, "payload" | "type">) {
    console.log(payload);
    console.log(type);
    return payload;
  }

  deployPayload(data: DeployDto) {
    return {
      name: data.name,
      project: data.project,
      target: "production",
      gitSource: {
        type: data.gitHost,
        repo: data.repo,
        ref: data.branch,
        org: data.org,
      } as GitSource,
      projectSettings: {
        framework: data.framework,
      } as ProjectSettings,
      provider: data.provider,
      teamId: data.teamId,
    };
  }
  projectPayload(data: CreateProjectDto): CreateProjectRequestBody {
    return {
      name: data.projectName,
      gitRepository: {
        repo: data.repo,
        type: data.type,
      } as GitRepository,
      framework: data.framework,
    };
  }
}
