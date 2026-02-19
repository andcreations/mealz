import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { PageWrapper } from '../../page';
import { useTranslations } from '../../i18n';
import { PathTo } from '../../routing';
import { TelegramSettings } from '../components';
import {
  TelegramSettingsPageTranslations,
} from './TelegramSettingsPage.translations';

export function TelegramSettingsPage() {
  const translate = useTranslations(TelegramSettingsPageTranslations);
  const navigate = useNavigate();

  return (
    <PageWrapper
      title={translate('title')}
      onGoBack={() => navigate(PathTo.settings())}
    >
      <TelegramSettings/>
    </PageWrapper>
  );
}