import { CustomError } from "../utils/customError";
import type { DeployDto, GetProjectsDto, GetTeamsDto, ProjectDto } from "./deployment.dto";
import type { DeployStrategy } from "./strategies/strategy.deployment.interface";
import { VercelDeployStrategy } from "./strategies/vercel.deployment.strategy";

export class deploymentService {
  private strategies: Record<string, DeployStrategy> = {
    vercel: new VercelDeployStrategy(),
  };

  async deploy(data: DeployDto) {
    const strategy = this.strategies[data.provider];
    if (!strategy) {
      throw new Error(`No strategy found for provider: ${data.provider}`);
    }
    return strategy?.deploy(data);
  }

  async createProject(data: ProjectDto) {
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
    return strategy?.getTeams();
  }

  async getProjects(data: GetProjectsDto) {
    const strategy = this.strategies[data.provider];
    if (!strategy) {
      throw new CustomError(`No strategy found for provider: ${data.provider}`, 400);
    }
    return strategy?.getProjects(data);
  }
}
