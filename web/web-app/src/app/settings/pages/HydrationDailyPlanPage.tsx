import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { PageWrapper } from '../../page';
import { useTranslations } from '../../i18n';
import { PathTo } from '../../routing';
import { HydrationDailyPlan } from '../components';
import {
  HydrationDailyPlanPageTranslations,
} from './HydrationDailyPlanPage.translations';

export function HydrationDailyPlanPage() {
  const translate = useTranslations(HydrationDailyPlanPageTranslations);
  const navigate = useNavigate();

  return (
    <PageWrapper
      title={translate('title')}
      onGoBack={() => navigate(PathTo.settings())}
    >
      <HydrationDailyPlan/>
    </PageWrapper>
  );
}