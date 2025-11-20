import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/globalException.filter';
import * as dotenv from 'dotenv';
// config the env vars
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // create a global pipe that validates Dtos in every http request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that do not have any decorators
      forbidNonWhitelisted: true, // throws an error if non-whitelisted properties are present
      transform: true, // transforms payloads to be objects typed according to their DTO classes
    }),
  );

  // create a global catch for exceptions
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(process.env.SERVER_PORT ?? 3002);
  Logger.log(
    `Application listening on port ${process.env.SERVER_PORT ?? 3000}`,
  );
}
bootstrap();
