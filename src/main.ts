import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

const options = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true,
  allowedHeaders: 'Content-Type, Accept',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(options);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Booking clone api')
    .setDescription('Booking clone api is an api for booking clone project')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
