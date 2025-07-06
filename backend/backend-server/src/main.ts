import * as fs from 'fs';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import * as cookieParser from 'cookie-parser';
import { BOOTSTRAP_CONTEXT } from '#mealz/backend-core';
import {
  getIntEnv,
  InternalError,
  isExpress,
  isFastify,
} from '#mealz/backend-common';
import { getLogger } from '#mealz/backend-logger';
import { GatewayBootstrap } from '#mealz/backend-gateway-common';

import { AppModule } from './AppModule';
import { INestApplication } from '@nestjs/common';

interface CertificateAndKey {
  cert: Buffer;
  key: Buffer;
}

function readCertificateAndKey(): CertificateAndKey | undefined {
  const certFile = process.env.MEALZ_HTTPS_CERT_FILE;
  const keyFile = process.env.MEALZ_HTTPS_KEY_FILE;

  if (certFile && keyFile) {
    if (!fs.existsSync(certFile)) {
      throw new InternalError(`HTTPS certificate file ${certFile} not found`);
    }
    if (!fs.existsSync(keyFile)) {
      throw new InternalError(`HTTPS key file ${keyFile} not found`);
    }
    getLogger().info(`Reading HTTPS certificate & key`, {
      ...BOOTSTRAP_CONTEXT,
      certFile: path.resolve(certFile),
      keyFile: path.resolve(keyFile),
    });

    return {
      cert: fs.readFileSync(certFile),
      key: fs.readFileSync(keyFile),
    }
  }
}

/** */
async function bootstrap() {
  let app: INestApplication;

// create
  if (isFastify()) {
    getLogger().info('Creating fastify application', BOOTSTRAP_CONTEXT);
    const fastifyApp = await NestFactory
      .create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({ https: readCertificateAndKey() })
      );
    await fastifyApp.register(fastifyCookie, {});      
    app = fastifyApp;
  }

  if (isExpress()) {
    getLogger().info('Creating express application', BOOTSTRAP_CONTEXT);
    app = await NestFactory
    .create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter(),
      { httpsOptions: readCertificateAndKey() },
    );  
    app.use(cookieParser());
  }

  if (!app) {
    throw new InternalError('Invalid web application type');
  }

// configure
  app.enableShutdownHooks();

// gateway
  const gatewayBootstrap = new GatewayBootstrap();
  gatewayBootstrap.bootstrap(app);

// listen
  const port = getIntEnv('MEALZ_PORT', 8080);
  getLogger().info(`Starting server`, {
    ...BOOTSTRAP_CONTEXT,
    port,
  });
  await app.listen(port, '0.0.0.0');
}

bootstrap()
  .catch((error) => {
    console.error('Failed to bootstrap', error);
    process.exit(1);
  });
