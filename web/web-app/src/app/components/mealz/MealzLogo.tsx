import * as React from 'react';
import classNames from 'classnames';

import { useTranslations } from '../../i18n';
import { MealzLogoTranslations } from './MealzLogo.translations';

export interface MealzLogoProps {
  className?: string;
}

export function MealzLogo(props: MealzLogoProps) {
  const translate = useTranslations(MealzLogoTranslations);
  const logoClassName = classNames('mealz-logo', props.className);

  return (
    <div className={logoClassName}>
      <div className='mealz-logo-title'>
        {translate('mealz')}
      </div>
      <div className='mealz-logo-subtitle'>
        {translate('subtitle')}
      </div>
    </div>
  );
} 