import { StyleFile } from '@andcreations/web-builder';
import { Dirs } from './Dirs';

export const THEMES = ['dark'];

export function getStyleFiles(): StyleFile[] {
  return THEMES.map(theme => {
    return {
      input: Dirs.srcStyles('themes', theme, `index.scss`),
      output: Dirs.buildApp(`${theme}-theme.$\{hash\}.css`),
    };
  });
}