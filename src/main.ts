import * as dotenv from 'dotenv'; // Load environment variables
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as os from 'os';
import * as pk from 'pkginfo';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Read package.json and add it to module.exports
pk(module);

const serverProtocol = process.env.SERVER_PROTOCOL || 'http';
const httpInterface = process.env.SERVER_LISTEN_ON || '0.0.0.0';
const accessServer = process.env.URI_SERVER || os.hostname();
const port = process.env.SERVER_PORT || 3000;

// Swagger configuration path
const apiName = process.env.API_NAME || 'api';

// Read metadata from package.json
const name = module.exports.name;
const version = module.exports.version;
const description = module.exports.description;
const authorInfo = module.exports.author.split('|'); // Split author information
const licenseInfo = module.exports.license.split('|'); // Split license information

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule, { cors: true });

  // Swagger configuration
  const swaggerOptions = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .setContact(authorInfo[0], authorInfo[1], authorInfo[2]) // Corrected to setContact
    .setLicense(licenseInfo[0], licenseInfo[1])
    .addBearerAuth() // Add JWT Bearer Authentication
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(apiName, app, document);

  // Serve OpenAPI documentation as JSON at /api-json
  app.use(`/${apiName}-json`, (req, res) => res.json(document));

  // Start the server
  await app.listen(port, httpInterface);

  logger.debug(`Server is running at: ${serverProtocol}://${accessServer}:${port}`);
  logger.debug(
    `API documentation available at: ${serverProtocol}://${accessServer}:${port}/${apiName}`,
  );
}

bootstrap().finally();
