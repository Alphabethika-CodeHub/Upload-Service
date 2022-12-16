import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log']
  });

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>("PORT")

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(port, () => {
    console.log(`Port Listening to http://localhost:${port}`);
  });
}
bootstrap();
