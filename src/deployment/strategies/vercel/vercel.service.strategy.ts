import type { CreateProjectResponseBody } from "@vercel/sdk/models/createprojectop.js";
import { VercelDeploymentAdapter } from "../../adapters/vercel.deployment.adapter";
import type { CreateProjectDto, DeployDto, GetProjectsDto, GetTeamsDto, ProviderWebhookDTO, StreamDeploymentDto } from "../../deployment.dto";
import type { IDeploymentResponse, ITokenProvider } from "../../deployment.interface";
import type { DeploymentServiceStrategy } from "../strategy.deployment.interface";

export class VercelDeploymentStrategy implements DeploymentServiceStrategy {
  constructor(private tokenProvider: ITokenProvider) {}

  async deploy(data: DeployDto): Promise<IDeploymentResponse> {
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

  async streamDeployment(data: StreamDeploymentDto) {
    const token = await this.tokenProvider.getToken({
      provider: data.provider,
      user_id: data.user_id,
    });
    const adapter = new VercelDeploymentAdapter(token);
    return adapter.streamDeployment(data.deployment_id);
  }

  async webhook(data: ProviderWebhookDTO) {
    const adapter = new VercelDeploymentAdapter();
    return adapter.webhook({ payload: data.payload, type: data.type });
  }
}
