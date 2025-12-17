import type { DeployDto, GetProjectsDto, GetTeamsDto, ProjectDto } from "./deployment.dto";
import type { DeployStrategy } from "./strategies/strategy.interface";
import { VercelDeployStrategy } from "./strategies/vercel.strategy";

export class deploymentService {
  private strategies: Record<string, DeployStrategy> = {
    vercel: new VercelDeployStrategy(),
  };

  async deploy(data: DeployDto) {
    const strategy = this.strategies[data.provider];

    return strategy?.deploy(data);
  }

  async createProject(data: ProjectDto) {
    const strategy = this.strategies[data.provider];

    return strategy?.createProject(data);
  }

  async getTeams(data: GetTeamsDto) {
    const strategy = this.strategies[data.provider];

    return strategy?.getTeams();
  }

  async getProjects(data: GetProjectsDto) {
    const strategy = this.strategies[data.provider];

    return strategy?.getProjects(data);
  }
}
