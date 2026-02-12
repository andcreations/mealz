import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { PageWrapper } from '../../page';
import { useTranslations } from '../../i18n';
import { PathTo } from '../../routing';
import {
  DailyMealPlanPageTranslations,
} from './DailyMealPlanPage.translations';

export function DailyMealPlanPage() {
  const translate = useTranslations(DailyMealPlanPageTranslations);
  const navigate = useNavigate();

  return (
    <PageWrapper
      title={translate('title')}
      onGoBack={() => navigate(PathTo.settings())}
    >
      <div>
      </div>
    </PageWrapper>
  );
}