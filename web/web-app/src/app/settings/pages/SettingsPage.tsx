import * as React from 'react';

import { PageWrapper } from '../../page';
import { useTranslations } from '../../i18n';
import { SettingsOverview } from '../components';
import { SettingsPageTranslations } from './SettingsPage.translations';

export function SettingsPage() {
  const translate = useTranslations(SettingsPageTranslations);

  return (
    <PageWrapper title={translate('title')}>
      <SettingsOverview/>
    </PageWrapper>
  );
}