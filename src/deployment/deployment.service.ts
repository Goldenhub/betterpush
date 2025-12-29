import { CustomError } from "../utils/customError";
import { AccessTokenProvider } from "./access-token.provider";
import type { CreateProjectDto, DeployDto, GetProjectsDto, GetTeamsDto, ProviderWebhookDTO, StreamDeploymentDto } from "./deployment.dto";
import type { DeploymentServiceStrategy } from "./strategies/strategy.deployment.interface";
import { VercelDeploymentStrategy } from "./strategies/vercel/vercel.service.strategy";

export class DeploymentService {
  private strategies: Record<string, DeploymentServiceStrategy> = {
    vercel: new VercelDeploymentStrategy(new AccessTokenProvider()),
  };

  async deploy(data: DeployDto) {
    const strategy = this.strategies[data.provider];
    if (!strategy) {
      throw new Error(`No strategy found for provider: ${data.provider}`);
    }
    return strategy?.deploy(data);
  }

  async streamDeployment(data: StreamDeploymentDto): Promise<unknown> {
    const strategy = this.strategies[data.provider];
    if (!strategy) {
      throw new Error(`No strategy found for provider: ${data.provider}`);
    }
    return strategy?.streamDeployment(data);
  }

  async createProject(data: CreateProjectDto) {
    const strategy = this.strategies[data.provider];
    if (!strategy) {
      throw new CustomError(`No strategy found for provider: ${data.provider}`, 400);
    }
    return strategy?.createProject(data);
  }

  async getTeams(data: GetTeamsDto) {
    const strategy = this.strategies[data.provider];
    if (!strategy) {
      throw new CustomError(`No strategy found for provider: ${data.provider}`, 400);
    }
    return strategy?.getTeams(data);
  }

  async getProjects(data: GetProjectsDto) {
    const strategy = this.strategies[data.provider];
    if (!strategy) {
      throw new CustomError(`No strategy found for provider: ${data.provider}`, 400);
    }
    return strategy?.getProjects(data);
  }

  async webhook(data: ProviderWebhookDTO) {
    const strategy = this.strategies[data.provider];
    if (!strategy) {
      throw new CustomError(`No strategy found for provider: ${data.provider}`, 400);
    }
    return strategy?.webhook(data);
  }
}
