import * as path from 'path';
import {
  WebpackAppBuilderOptions,
  WebpackAppBuilder,
} from '@andcreations/web-builder';
import { Dirs } from './Dirs';

export function getWebpackAppBuilderOptions(): WebpackAppBuilderOptions {
  return {
    dstDir: Dirs.buildApp(),
    dstFiles: [/app.*js/],
    webpackFile: path.join(__dirname, '../../webpack.config.js'),
  }
}

export async function buildApp(): Promise<void> {
  const builder = new WebpackAppBuilder(getWebpackAppBuilderOptions());
  await builder.run();
}