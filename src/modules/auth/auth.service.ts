// auth/auth.service.ts
import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { App } from '../../entities/app.entity';
import { Key } from '../../entities/key.entity';
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
        @InjectRepository(Key)
        private readonly keyRepository: Repository<Key>,
    ) { }

    async register(dto: RegisterDto) {
        const { email, password, appName } = dto;
        let user = await this.userRepository.findOne({ where: { email }, relations: ['key'] });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = this.userRepository.create({ email, password: hashedPassword });
            await this.userRepository.save(user);
            const secretKey = crypto.randomBytes(32).toString('hex');
            const key = this.keyRepository.create({ secret_key: secretKey, user });
            await this.keyRepository.save(key);
            user.key = key;
        }
        const existingApp = await this.appRepository.findOne({ where: { name: appName, user: { id: user.id } } });
        if (existingApp)
            throw new BadRequestException('This app is already registered for this user');
        const app = this.appRepository.create({ name: appName, user });
        await this.appRepository.save(app);
        console.log(user)
        return { message: 'App registered successfully', userId: user.id, appId: app.id, apiKey: user.key.secret_key };
    }

    async getApiKey(dto: GetApiKeyDto) {
        const { email, password, appName } = dto;
        const user = await this.userRepository.findOne({ where: { email }, relations: ['key', 'apps'] });
        if (!user) throw new NotFoundException('User not found');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
        const app = user.apps.find(a => a.name === appName);
        if (!app) throw new NotFoundException('App not found for this user');
        return { userId: user.id, appId: app.id, apiKey: user.key.secret_key };
    }

    async revokeApiKey(dto: RevokeApiKeyDto) {
        const { email, password } = dto;
        const user = await this.userRepository.findOne({ where: { email }, relations: ['key'] });
        if (!user) throw new NotFoundException('User not found');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
        const newSecretKey = crypto.randomBytes(32).toString('hex');
        if (!user.key) {
            const key = this.keyRepository.create({ secret_key: newSecretKey, user });
            await this.keyRepository.save(key);
        } else {
            user.key.secret_key = newSecretKey;
            await this.keyRepository.save(user.key);
        }
        return { message: 'API key revoked successfully', userId: user.id, newApiKey: newSecretKey, };
    }

}
