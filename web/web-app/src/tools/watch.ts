import { WatchOptions, Watch } from '@andcreations/web-builder';

import { Dirs } from './Dirs';
import { getAssetsBuilderOptions } from './build-assets';
import { getStyleBuilderOptions } from './build-styles';
import { getHTMLBuilderOptions } from './build-html';
import { getWebpackAppBuilderOptions } from './build-app';

function watch(): void {
  const options: WatchOptions = {
    assetsBuilderOptions: getAssetsBuilderOptions(),
    styleDirs: [
      Dirs.srcStyles(), 
      Dirs.srcInlineImages(),
      Dirs.srcComponentsStyles(),
      Dirs.srcThemes(),
    ],
    styleBuilderOptions: getStyleBuilderOptions(),
    htmlBuilderOptions: getHTMLBuilderOptions(),
    appDirs: [
      Dirs.srcApp(),
      Dirs.srcComponents(),
    ],
    webpackBuilderOptions: getWebpackAppBuilderOptions(),
  }

  const watch = new Watch(options);
  watch.watch();
}

watch();