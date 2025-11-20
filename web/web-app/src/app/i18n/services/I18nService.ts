import { Service } from '@andcreations/common';
import { TranslateFunc, Translations } from '../types';

@Service()
export class I18nService {
  private format(translation: string, values: string[]): string {
    let str = translation;
    values.forEach((value, index) => {
      const re = new RegExp(`\\{${index}\\}`, 'g');
      str = str.replace(re, value);
    });
    return str;
  }

  public translate(
    translations: Translations,
    key: string,
    ...values: string[]
  ): string {
    return this.format(translations[key] ?? key, values || []);
  }

  public translateFunc(translations: Translations): TranslateFunc {
    return (key: string, ...values: string[]) => {
      return this.translate(translations, key, ...values);
    };
  }
}