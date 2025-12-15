import * as path from 'path';
import * as fs from 'fs';
import { DynamicModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  requireStrEnv,
  isFastify,
  isExpress,
  InternalError,
} from '@mealz/backend-common';
import { BOOTSTRAP_CONTEXT } from '@mealz/backend-core';
import { getLogger } from '@mealz/backend-logger';

const CACHED_URL_PATTERNS: RegExp[] = [/.*css/, /.*js/];
let staticFilesDir: string; 

function getStaticFilesDir(): string {
  if (!staticFilesDir) {
    staticFilesDir = path.normalize(requireStrEnv('MEALZ_WEB_APP_DIR'));
    if (!fs.existsSync(staticFilesDir)) {
      throw new InternalError(
        `Web application directory ${staticFilesDir} not found`,
      );
    }
    getLogger().info('Web application directory', {
      ...BOOTSTRAP_CONTEXT,
      dir: staticFilesDir,
    });
  }
  return staticFilesDir;
}

function setHeaders(
  response: any,
  resourcePath: string,
  _stat: any,
): any {
  if (!response.setHeader) {
    return;
  }

  const dir = getStaticFilesDir();
  const relativePath = resourcePath.substring(dir.length);
  const cached = CACHED_URL_PATTERNS.some(pattern => {
    return relativePath.match(pattern);
  });

  response.setHeader('Cache-Control', cached ? 'private' : 'no-store');
}

export function getServeStaticModule(): DynamicModule {
  if (isFastify()) {
    return ServeStaticModule.forRoot({
      rootPath: getStaticFilesDir(),
      renderPath: '/(?!api).*',
      serveStaticOptions: {
        setHeaders,
      },
    });
  }
  if (isExpress()) {
    return ServeStaticModule.forRoot({
      rootPath: getStaticFilesDir(),
      serveRoot: '/',
      exclude: ['/api'],
      serveStaticOptions: {
        setHeaders,
      },
    });  
  }
}