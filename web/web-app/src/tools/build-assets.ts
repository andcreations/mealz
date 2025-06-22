import { AssetsBuilderOptions, AssetsBuilder } from '@andcreations/web-builder';
import { Dirs } from './Dirs';

export function getAssetsBuilderOptions(): AssetsBuilderOptions {
  return {
    srcDir: Dirs.srcAssets(),
    dstDir: Dirs.buildApp(),
    suffixes: ['.png'],
  }
}

export async function buildAssets(): Promise<void> {
  const builder = new AssetsBuilder(getAssetsBuilderOptions());
  builder.run();
}
