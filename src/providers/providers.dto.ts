import { IsString } from "class-validator";

export class ConnectProviderDto {
  @IsString()
  provider!: string;
}

export class ConnectProviderCallbackDto {
  @IsString()
  code!: string;

  @IsString()
  state!: string;

  @IsString()
  provider!: string;
}
