import { Service } from '@andcreations/common';
import { Translations } from '../types';

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

  public translate(translations: Translations, key: string, ...values: string[]): string {
    return this.format(translations[key] ?? key, values || []);
  }
}