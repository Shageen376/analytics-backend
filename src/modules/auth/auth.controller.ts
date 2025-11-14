// auth/auth.controller.ts
import { Controller, Post, Get, Req, Body, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto, GetApiKeyDto, RevokeApiKeyDto } from '../../dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @Throttle({ default: { limit: 3, ttl: 60 } })
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Get('api-key')
    @Throttle({ default: { limit: 20, ttl: 60 } })
    async getApiKey(@Query() query: GetApiKeyDto) {
        return this.authService.getApiKey(query);
    }

    @Post('revoke')
    @Throttle({ default: { limit: 10, ttl: 60 } })
    async revokeApiKey(@Body() dto: RevokeApiKeyDto) {
        return this.authService.revokeApiKey(dto);
    }

    @Get('google')
    @Throttle({ default: { limit: 5, ttl: 60 } })
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Initiates Google OAuth login
    }

    @Get('google/callback')
    @Throttle({ default: { limit: 5, ttl: 60 } })
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req) {
        return { message: 'Google login successful', user: req.user };
    }
}
