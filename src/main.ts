import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for the API, if desired
  const apiPrefix = process.env.API_NAME || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Retrieve port and host information from environment variables
  const port = parseInt(process.env.SERVER_PORT || '3000', 10);
  const host = process.env.SERVER_LISTEN_ON || '0.0.0.0';

  await app.listen(port, host, () => {
    Logger.log(`Server is running at http://${host}:${port}/${apiPrefix}`);
  });
}

bootstrap();
