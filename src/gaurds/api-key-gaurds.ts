import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Key } from '../entities/key.entity';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(Key)
    private readonly keyRepository: Repository<Key>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if (!apiKey) 
      throw new UnauthorizedException('API key missing in headers');
    const key = await this.keyRepository.findOne({
      where: { secret_key: apiKey },
      relations: ['user'],
    });
    if (!key || !key.user) 
      throw new UnauthorizedException('Invalid API key');
    request.apiKey = apiKey;
    request.user = key.user;
    return true;
  }
}
