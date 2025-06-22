import { IoC } from '@andcreations/common';

import { I18nService } from '../services';
import { Translations } from '../types';

export type TranslateFunc = (key: string, ...values: string[]) => string;

export function useTranslations(translations: Translations): TranslateFunc {
  const i18nService = IoC.resolve(I18nService);
  return (key: string, ...values: string[]) => {
    return i18nService.translate(translations, key, ...values);
  };
}