import { Vercel } from "@vercel/sdk";
import type { GitSource, ProjectSettings } from "@vercel/sdk/models/createdeploymentop.js";
import type { CreateProjectRequestBody, EnvironmentVariables, GitRepository } from "@vercel/sdk/models/createprojectop.js";
import axios from "axios";
import prisma from "../../prisma/client";
import type { CreateProjectDto, DeployDto, EnvVarDto, ProviderWebhookDTO } from "../deployment.dto";
import { encrypt } from "../../utils/helpers";
// import axios from "axios";

export class VercelDeploymentAdapter {
  private client: Vercel;
  private token: string;
  constructor(accessToken?: string) {
    this.token = accessToken as string;
    this.client = new Vercel({
      bearerToken: accessToken,
    });
  }

  async deploy(data: DeployDto) {
    const deployment = await this.client.deployments.createDeployment({
      teamId: data.teamId,
      requestBody: this.deployPayload(data),
    });

    console.log("deployment:", deployment);

    const response = await prisma.deployment.create({
      data: {
        deployment_id: deployment.id,
        user_id: data.id,
        provider: data.provider,
        build_id: deployment.lambdas?.[0]?.id as string,
        url: data?.alias,
      },
    });

    return response;
  }

  async streamDeployment(id: string, build_id: string) {
    const result = await axios.get(`https://api.vercel.com/v3/deployments/${id}/events`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      params: {
        direction: "backward",
        follow: 1,
        delimiter: 1,
        builds: 1,
        limit: -1,
        name: build_id,
      },
      responseType: "stream",
    });
    // const result = await this.client.deployments.getDeploymentEvents({
    //   idOrUrl: id,
    //   direction: "backward",
    //   follow: 1,
    //   delimiter: 1,
    //   builds: 1,
    //   limit: -1,
    //   name: build_id,
    // });

    return result.data;
  }

  async getDeploymentDetailsFromDB(deployment_id: string) {
    return prisma.deployment.findFirst({
      where: {
        deployment_id,
      },
    });
  }

  async createProject(data: CreateProjectDto) {
    const response = await this.client.projects.createProject({
      teamId: data.teamId,
      requestBody: this.projectPayload(data),
    });

    if (data.envVars?.length) {
      const envVars = data.envVars.map((envVar: EnvVarDto) => ({
        project_id: envVar.project_id,
        type: envVar.type,
        key: envVar.key,
        encrypted_value: encrypt(envVar.value),
        environment: envVar.environment ?? "production",
      }));
      await prisma.envVar.createMany({
        data: [...envVars],
      });
    }

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
    switch (type) {
      case "deployment.succeeded": {
        const updatedDeployment = await prisma.deployment.update({
          where: {
            id: (payload.deployment as Record<string, unknown>).id as string,
          },
          data: {
            status: "DEPLOYED",
          },
        });
        if (!updatedDeployment.url) {
          break;
        }
        await this.client.aliases.assignAlias({
          id: (payload.deployment as Record<string, unknown>).id as string,
          requestBody: {
            alias: updatedDeployment.url as string,
            redirect: null,
          },
        });
        break;
      }
      case "project.created":
        console.log("project created");
        break;
      default:
        console.log({
          message: "unhandled event type",
          type,
          payload,
        });
    }
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
      deploymentId: data.deploymentId,
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
      environmentVariables: data.envVars?.map((envVar) => ({
        key: envVar.key,
        target: (envVar.environment as EnvironmentVariables["target"]) ?? "production", // "production" | "preview" | "development" or Array<"production" | "preview" | "development">
        type: envVar?.type as EnvironmentVariables["type"], //"system" | "secret" | "encrypted" | "plain" | "sensitive"
        value: envVar.value,
      })),
    };
  }
}
