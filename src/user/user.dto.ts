import { IsEmail, IsNotEmpty, IsString, IsUrl, IsUUID } from "class-validator";

export class GetUserDto {
  @IsUUID()
  id!: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsUrl()
  avatar_url?: string;
}
