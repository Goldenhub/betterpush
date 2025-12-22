import type { CreateDeploymentResponseBody } from "@vercel/sdk/models/createdeploymentop.js";
import type { CreateProjectResponseBody } from "@vercel/sdk/models/createprojectop.js";
import type { GetProjectsResponseBody } from "@vercel/sdk/models/getprojectsop.js";
import type { GetTeamsResponseBody } from "@vercel/sdk/models/getteamsop.js";
import type { DeployDto, GetProjectsDto, ProjectDto } from "../deployment.dto";

export interface DeployStrategy {
  deploy(data: DeployDto): Promise<CreateDeploymentResponseBody>;
  createProject(data: ProjectDto): Promise<CreateProjectResponseBody>;
  getTeams(): Promise<GetTeamsResponseBody>;
  getProjects(data: GetProjectsDto): Promise<GetProjectsResponseBody>;
}
