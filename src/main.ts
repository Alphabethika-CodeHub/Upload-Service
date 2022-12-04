import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const port = 2015;
  const app = await NestFactory.create(AppModule);
  await app.listen(port, () => {
    console.log(`Port Listening to http://localhost:${port}`);
  });
}
bootstrap();
