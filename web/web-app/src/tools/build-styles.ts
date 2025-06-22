import {
  StyleBuilderOptions,
  StyleBuilder,
} from '@andcreations/web-builder';
import { getStyleFiles } from './styles';
import { Dirs } from './Dirs';

export function getStyleBuilderOptions(): StyleBuilderOptions {
  return {
    dstDir: Dirs.buildApp(),
    styleFiles: getStyleFiles(),
    inlineImagesDir: Dirs.srcInlineImages(),
  }
}

export async function buildStyles(): Promise<void> {
  const builder = new StyleBuilder(getStyleBuilderOptions());
  builder.run();
}