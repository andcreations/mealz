import { TranslateFunc, Translations } from '../types';

function format(translation: string, values: string[]): string {
  let str = translation;
  values.forEach((value, index) => {
    const re = new RegExp(`\\{${index}\\}`, 'g');
    str = str.replace(re, value);
  });
  return str;
}

export function createTranslation(translations: Translations): TranslateFunc {
  return (key: string, ...values: string[]) => {
    return format(translations[key] ?? key, values || []);
  };
}