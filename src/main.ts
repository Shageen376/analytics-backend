import './polyfill';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api', { exclude: ['/'], });
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);
	const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
	await app.listen(port, '0.0.0.0');
}
bootstrap();
