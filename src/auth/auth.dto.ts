import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { IsValidPassword } from "../decorators/is-valid-password";

export class SignupDto {
  @IsEmail()
  email!: string;

  @IsValidPassword()
  password!: string;

  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;
}

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsUUID()
  verification_token!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsValidPassword()
  password!: string;

  @IsString()
  device_id!: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsUUID()
  token!: string;

  @IsValidPassword()
  password!: string;

  @IsNotEmpty()
  @IsString()
  username!: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  device_id!: string;
}

export class LogoutDto {
  @IsNotEmpty()
  @IsString()
  device_id!: string;
}

export class GithubAuthCallbackDto {
  @IsNotEmpty()
  @IsString()
  code!: string;

  @IsNotEmpty()
  @IsString()
  device_id!: string;
}

export class CreatePasswordDto {
  @IsValidPassword()
  password!: string;
}
