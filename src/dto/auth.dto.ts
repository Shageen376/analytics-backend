// auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email. Must be unique.',
  })
  @IsEmail({}, { message: 'Valid email is required' })
  email!: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'Must contain 8+ chars, uppercase, number & special character',
  })
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/, {
    message:
      'Password must be at least 8 characters, include uppercase, number, and special character',
  })
  password: string;

  @ApiProperty({
    example: 'MyAwesomeApp',
    description: 'Name of the application to register under the user',
  })
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
  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @IsEmail({}, { message: 'Valid email is required' })
  email!: string;

  @ApiProperty({ example: 'Password@123', description: 'User password' })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}