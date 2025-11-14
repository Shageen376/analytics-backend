// auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  appName!: string;

  @IsNotEmpty()
  domain!: string;
}

export class GetApiKeyDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  appName!: string;
}

export class RevokeApiKeyDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}