import type { Framework } from "@vercel/sdk/models/createdeploymentop.js";
import type { CreateProjectFramework, CreateProjectProjectsType } from "@vercel/sdk/models/createprojectop.js";
import { IsString } from "class-validator";

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
}

export class ProjectDto {
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
}

export class GetTeamsDto {
  @IsString()
  provider!: string;
}

export class GetProjectsDto {
  @IsString()
  teamId!: string;

  @IsString()
  provider!: string;
}
