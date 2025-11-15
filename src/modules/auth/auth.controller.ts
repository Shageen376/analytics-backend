// auth/auth.controller.ts
import { Controller, Post, Get, Req, Body, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterResponseDto, GetApiKeyResponseDto, RevokeApiKeyResponseDto, GoogleLoginResponseDto } from '../../swagger dto/auth-response.dto';
import { RegisterDto, GetApiKeyDto, RevokeApiKeyDto } from '../../dto/auth.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('register')
    @Throttle({ default: { limit: 3, ttl: 60 } })
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Register user & create app', description: 'Registers a user (or validates password if existing) and creates a new app under that user.', })
    @ApiResponse({ status: 201, description: 'App registered successfully.', type: RegisterResponseDto, })
    @ApiResponse({ status: 400, description: 'Validation error / App already exists / Wrong password', })
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Get('api-key')
    @Throttle({ default: { limit: 20, ttl: 60 } })
    @ApiOperation({ summary: 'Retrieve API key for user' })
    @ApiQuery({ name: 'email', type: String, required: true })
    @ApiQuery({ name: 'password', type: String, required: true })
    @ApiOkResponse({ type: GetApiKeyResponseDto, description: 'API key retrieved successfully' })
    @ApiBadRequestResponse({ description: 'Invalid credentials or user not found' })
    async getApiKey(@Query() query: GetApiKeyDto) {
        return this.authService.getApiKey(query);
    }

    @Post('revoke')
    @Throttle({ default: { limit: 10, ttl: 60 } })
    @ApiOperation({ summary: 'Revoke and regenerate user API key' })
    @ApiResponse({ status: 200, description: 'API key revoked successfully and new key generated', type: RevokeApiKeyResponseDto, })
    async revokeApiKey(@Body() dto: RevokeApiKeyDto) {
        return this.authService.revokeApiKey(dto);
    }

    @Get('google')
    @Throttle({ default: { limit: 5, ttl: 60 } })
    @UseGuards(AuthGuard('google'))
    @ApiOperation({
        summary: 'Redirect user to Google login',
        description: 'Use this link in your browser to login via Google OAuth',
        externalDocs: {
            description: 'Login with Google',
            url: 'https://analytics-backend.up.railway.app/api/auth/google',
        },
    })
    @ApiResponse({ status: 302, description: 'Redirects to Google login page' })
    async googleAuth() {
        // Initiates Google OAuth login
    }

    @Get('google/callback')
    @Throttle({ default: { limit: 5, ttl: 60 } })
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Google OAuth callback' })
    @ApiResponse({ status: 200, type: GoogleLoginResponseDto })
    googleAuthRedirect(@Req() req) {
        return { message: 'Google login successful', user: req.user };
    }
}
