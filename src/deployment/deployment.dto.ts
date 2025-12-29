import type { Framework } from "@vercel/sdk/models/createdeploymentop.js";
import type { CreateProjectFramework, CreateProjectProjectsType } from "@vercel/sdk/models/createprojectop.js";
import { IsObject, IsString, IsUUID } from "class-validator";

export class DeployDto {
  @IsString()
  name!: string;

  @IsString()
  teamId!: string;

  @IsString()
  project!: string;

  @IsString()
  gitHost!: string;

  @IsString()
  repo!: string;

  @IsString()
  branch!: string;

  @IsString()
  org!: string;

  @IsString()
  provider!: string;

  @IsString()
  framework!: Framework;

  // user id
  @IsUUID()
  id!: string;
}

export class StreamDeploymentDto {
  @IsString()
  provider!: string;

  @IsString()
  deployment_id!: string;
}

export class CreateProjectDto {
  @IsString()
  teamId!: string;

  @IsString()
  projectName!: string;

  @IsString()
  repo!: string;

  @IsString()
  type!: CreateProjectProjectsType;

  @IsString()
  framework!: CreateProjectFramework;

  @IsString()
  provider!: string;
  // user id
  @IsUUID()
  id!: string;
}

export class GetTeamsDto {
  @IsString()
  provider!: string;

  // user id
  @IsUUID()
  id!: string;
}

export class GetProjectsDto {
  @IsString()
  teamId!: string;

  @IsString()
  provider!: string;

  // user id
  @IsUUID()
  id!: string;
}

export class ProviderWebhookDTO {
  @IsString()
  provider!: string;

  @IsObject()
  payload!: Record<string, unknown>;

  @IsString()
  type!: string;
}
