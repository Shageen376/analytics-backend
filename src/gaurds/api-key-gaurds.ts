import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class ApiKeyGuard implements CanActivate {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const apiKey = request.headers['x-api-key'];
		if (!apiKey)
			throw new UnauthorizedException('API key missing in headers');
		const user = await this.userRepository.findOne({
			where: { api_key: apiKey }, relations: ['apps'],
		});
		if (!user)
			throw new UnauthorizedException('Invalid API key');
		request.user = user;
		request.userApps = user.apps.map(app => app.id);
		return true;
	}
}
