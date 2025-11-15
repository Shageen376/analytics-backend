import './polyfill';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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
	const config = new DocumentBuilder()
		.setTitle('Analytics-backend')
		.setDescription('API documentation for the Analytics App')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document);
	const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
	await app.listen(port, '0.0.0.0');
}
bootstrap();
