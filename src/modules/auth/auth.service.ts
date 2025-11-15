// auth/auth.service.ts
import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiResponse } from '../../common/response';
import { User } from '../../entities/user.entity';
import { App } from '../../entities/app.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../../dto/auth.dto';
import { GetApiKeyDto, RevokeApiKeyDto } from '../../dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(App)
        private readonly appRepository: Repository<App>,
    ) { }

    private generateApiKey(): string {
        return 'ak_' + crypto.randomBytes(32).toString('hex');
    }

    async register(dto: RegisterDto) {
        const { email, password, appName } = dto;
        let user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid)
                return ApiResponse.error('Email already registered with a different password');
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const secretKey = this.generateApiKey();
            user = this.userRepository.create({ email, password: hashedPassword, api_key: secretKey });
            await this.userRepository.save(user);
        }
        const existingApp = await this.appRepository.findOne({ where: { name: appName, user: { id: user.id } } });
        if (existingApp)
            return ApiResponse.error('This app is already registered for this user')
        const app = this.appRepository.create({ name: appName, user });
        await this.appRepository.save(app);
        return ApiResponse.success('App registered successfully', { userId: user.id, appId: app.id, apiKey: user.api_key });
    }

    async getApiKey(dto: GetApiKeyDto) {
        const { email, password } = dto;
        const user = await this.userRepository.findOne({ where: { email }, relations: ['apps'] });
        if (!user) return ApiResponse.error('User not found');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return ApiResponse.error('Invalid credentials');
        const appsObj = user.apps.reduce((acc, curr) => { acc[curr.name] = curr.id; return acc }, {} as Record<string, string>);
        return ApiResponse.success('API key retrieved successfully', { userId: user.id, apiKey: user.api_key ,apps: appsObj});
    }

    async revokeApiKey(dto: RevokeApiKeyDto) {
        const { email, password } = dto;
        const user = await this.userRepository.findOne({ where: { email }, relations: ['apps'] });
        if (!user) return ApiResponse.error('User not found');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return ApiResponse.error('Invalid credentials');
        user.api_key = this.generateApiKey();
        await this.userRepository.save(user);
        const appsObj = user.apps.reduce((acc, curr) => { acc[curr.name] = curr.id; return acc }, {} as Record<string, string>);
        return ApiResponse.success('API key revoked successfully and new key generated', { userId: user.id, newApiKey: user.api_key ,apps: appsObj});
    }
}
