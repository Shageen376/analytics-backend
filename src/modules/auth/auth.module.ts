// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { User } from '../../entities/user.entity';
import { App } from '../../entities/app.entity';
import { Key } from '../../entities/key.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.stratedy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, App, Key]),
    PassportModule.register({ session: false }), 
    ConfigModule, 
  ],
  providers: [AuthService, GoogleStrategy], 
  controllers: [AuthController],
})
export class AuthModule {}
