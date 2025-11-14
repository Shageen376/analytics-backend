import { Injectable, BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { App } from '../../entities/app.entity';
import { Key } from '../../entities/key.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(App)
        private readonly appRepository: Repository<App>,
        @InjectRepository(Key)
        private readonly keyRepository: Repository<Key>,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL')!,
            scope: ['email', 'profile'],
        } as any);
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ) {
        const email = profile.emails?.[0]?.value;
        const firstName = profile.name?.givenName || '';
        const lastName = profile.name?.familyName || '';
        const profilePicture = profile.photos?.[0]?.value || '';
        if (!email) return done(new Error('No email found from Google account'));
        let user = await this.userRepository.findOne({
            where: { email },
            relations: ['key', 'apps'],
        });

        if (!user) {
            user = this.userRepository.create({ email, firstName, lastName } as Partial<User>);
            await this.userRepository.save(user);
            const secretKey = crypto.randomBytes(32).toString('hex');
            const key = this.keyRepository.create({ secret_key: secretKey, user });
            await this.keyRepository.save(key);
        }
        const appName = 'Default App';
        let app = await this.appRepository.findOne({
            where: { name: appName, user: { id: user.id } },
        });
        if (!app) {
            app = this.appRepository.create({ name: appName, user });
            await this.appRepository.save(app);
        }
        const result = { userId: user.id, appId: app.id, apiKey: user.key?.secret_key, email, firstName, lastName, profilePicture };
        done(null, result);
    }
}
