// auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Valid email is required' })
  email!: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/, {
    message: 'Password must be at least 8 characters, include uppercase, number, and special character',
  })
  password: string;

  @IsNotEmpty({ message: 'Valid App is required' })
  appName!: string;
}

export class GetApiKeyDto {
  @IsEmail({}, { message: 'Valid email is required' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}

export class RevokeApiKeyDto {
  @IsEmail({}, { message: 'Valid email is required' })
  email!: string;

  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}