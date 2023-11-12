import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.static('public'));
  app.use('/public', express.static('public'));
  await app.listen(1000);
}
bootstrap();
