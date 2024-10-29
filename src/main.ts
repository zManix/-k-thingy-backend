import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as packageJson from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .setContact(
      packageJson.author.split('|')[0].trim(),
      packageJson.author.split('|')[1].trim(),
      packageJson.author.split('|')[2].trim(),
    )
    .setLicense(packageJson.license, 'https://opensource.org/licenses')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // JSON endpoint
  app.use('/api-json', (req, res) => {
    res.json(document);
  });

  await app.listen(3000);
}
bootstrap();
