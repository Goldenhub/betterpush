import type { CreateDeploymentRequestBody, GitSource, ProjectSettings } from "@vercel/sdk/models/createdeploymentop.js";
import type { CreateProjectRequestBody, GitRepository } from "@vercel/sdk/models/createprojectop.js";
import type { DeployDto, ProjectDto } from "../deployment.dto";

export class VercelAdapter {
  payload(data: DeployDto): CreateDeploymentRequestBody {
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
    };
  }
  projectPayload(data: ProjectDto): CreateProjectRequestBody {
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
