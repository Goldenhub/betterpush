import { IsString, IsUUID } from "class-validator";

export class ConnectProviderDto {
  @IsString()
  provider!: string;

  // user id
  @IsUUID()
  id!: string;
}

export class ConnectProviderCallbackDto {
  @IsString()
  code!: string;

  @IsString()
  state!: string;

  @IsString()
  provider!: string;
}
