import {
  matchFile,
  CSSFile,
  HTMLBuilderOptions,
  HTMLBuilder,
} from '@andcreations/web-builder';
import { THEMES } from './styles';
import { Dirs } from './Dirs';

function getCSSFiles(): CSSFile[] {
  return THEMES.map(theme => {
    const file = matchFile(Dirs.buildApp(), new RegExp(`${theme}-theme.*css`));
    return {
      file,
      title: theme,
    }
  });
}

export function getHTMLBuilderOptions(): HTMLBuilderOptions {
  return {
    templateFile: Dirs.src('html', 'index.ejs.html'),
    dstDir: Dirs.buildApp(),
    cssFiles: getCSSFiles(),
  };
}

export async function buildHTML(): Promise<void> {
  const builder = new HTMLBuilder(getHTMLBuilderOptions());
  builder.run();
}