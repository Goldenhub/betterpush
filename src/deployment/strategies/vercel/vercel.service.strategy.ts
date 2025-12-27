import type { CreateDeploymentResponseBody } from "@vercel/sdk/models/createdeploymentop.js";
import type { CreateProjectResponseBody } from "@vercel/sdk/models/createprojectop.js";
import { VercelDeploymentAdapter } from "../../adapters/vercel.deployment.adapter";
import type { CreateProjectDto, DeployDto, GetProjectsDto, GetTeamsDto, ProviderWebhookDTO } from "../../deployment.dto";
import type { ITokenProvider } from "../../deployment.interface";
import type { DeploymentServiceStrategy } from "../strategy.deployment.interface";

export class VercelDeploymentStrategy implements DeploymentServiceStrategy {
  constructor(private tokenProvider: ITokenProvider) {}

  async deploy(data: DeployDto): Promise<CreateDeploymentResponseBody> {
    const token = await this.tokenProvider.getToken({
      provider: data.provider,
      user_id: data.id,
    });
    const adapter = new VercelDeploymentAdapter(token);
    return adapter.deploy(data);
  }

  async createProject(data: CreateProjectDto): Promise<CreateProjectResponseBody> {
    const token = await this.tokenProvider.getToken({
      provider: data.provider,
      user_id: data.id,
    });
    const adapter = new VercelDeploymentAdapter(token);
    return adapter.createProject(data);
  }

  async getTeams(data: GetTeamsDto) {
    const token = await this.tokenProvider.getToken({
      provider: data.provider,
      user_id: data.id,
    });
    const adapter = new VercelDeploymentAdapter(token);
    return adapter.getTeams();
  }

  async getProjects(data: GetProjectsDto) {
    const token = await this.tokenProvider.getToken({
      provider: data.provider,
      user_id: data.id,
    });
    const adapter = new VercelDeploymentAdapter(token);
    return adapter.getProjects(data.teamId);
  }

  async webhook(data: Pick<ProviderWebhookDTO, "payload">) {
    const adapter = new VercelDeploymentAdapter();
    const response = await adapter.webhook(data.payload);
    console.log(response);
  }
}
