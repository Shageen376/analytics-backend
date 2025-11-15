import { ApiProperty } from '@nestjs/swagger';

// POST /api/auth/register 
export class RegisterResponseData {
  @ApiProperty({ example: 'd2f1a3c1-94b0-4c30-9ac4-223934aa83e5' })
  userId: string;

  @ApiProperty({ example: '6b091ed9-9db0-4fbc-8f89-dde62eac2fb4' })
  appId: string;

  @ApiProperty({ example: 'dfe0190e9182e3a0d0b3c682fbd0c781' })
  apiKey: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: 'App registered successfully' })
  message: string;

  @ApiProperty({ type: RegisterResponseData })
  data: RegisterResponseData;
}

// GET /api/auth/api-key
export class AppsMap {
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' }, // tells Swagger each key is string
    example: {
      crm: 'b31ee221-d2e4-4fb1-a992',
      analytics: 'c12aa221-d2e4-4fb1-a381',
    },
    description: 'A map of app names to their IDs',
  })
  apps!: Record<string, string>; // <-- use a concrete property
}

export class GetApiKeyResponseData {
  @ApiProperty({ example: 'a41e21c3-dffa-4f2d-8789' })
  userId: string;

  @ApiProperty({ example: 'abcdef-123456' })
  apiKey: string;

  @ApiProperty({ type: AppsMap })
  apps: AppsMap;
}

export class GetApiKeyResponseDto {
  @ApiProperty({ example: 'API key retrieved successfully' })
  message: string;

  @ApiProperty({ type: GetApiKeyResponseData })
  data: GetApiKeyResponseData;
}

// POST /api/auth/revoke
export class RevokeApiKeyResponseData {
  @ApiProperty({ example: 'a41e21c3-dffa-4f2d-8789' })
  userId: string;

  @ApiProperty({ example: 'new-api-key-abcdef123456' })
  newApiKey: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'string' },
    example: {
      crm: 'b31ee221-d2e4-4fb1-a992',
      analytics: 'c12aa221-d2e4-4fb1-a381',
    },
    description: 'Map of app names to their IDs',
  })
  apps: Record<string, string>;
}

export class RevokeApiKeyResponseDto {
  @ApiProperty({ example: 'API key revoked successfully and new key generated' })
  message: string;

  @ApiProperty({ type: RevokeApiKeyResponseData })
  data: RevokeApiKeyResponseData;
}

//  Google Auth for onboarding apps/websites into the analytics platform.
export class GoogleUserResponseDto {
  @ApiProperty({ example: 'user-id-1234' })
  userId: string;

  @ApiProperty({ example: 'app-id-5678' })
  appId: string;

  @ApiProperty({ example: 'api-key-abcdef' })
  apiKey: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  profilePicture: string;
}

export class GoogleLoginResponseDto {
  @ApiProperty({ example: 'Google login successful' })
  message: string;

  @ApiProperty({ type: GoogleUserResponseDto })
  user: GoogleUserResponseDto;
}