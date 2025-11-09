import * as React from 'react';

import { useTranslations } from '../../i18n';
import { useService } from '../../hooks';
import { PageWrapper } from '../../page';
import { MealsLogService } from '../../meals';
import { 
  DashboardSection,
  DashboardSectionSeparator,
  DashboardSectionTitle,
} from '../components';
import { DailySummary, WeeklySummary } from '../sections';
import { DashboardPageTranslations } from './DashboardPage.translations';

export function DashboardPage() {
  const mealsLogService = useService(MealsLogService);
  const translate = useTranslations(DashboardPageTranslations);

  return (
    <PageWrapper title={translate('title')}>
      <DashboardSection>
        <DashboardSectionTitle
          title={translate('today-summary-title')}
        />
        <DailySummary
          readSummaryFunc={() => mealsLogService.fetchTodaySummary()}
        />
      </DashboardSection>
      <DashboardSectionSeparator/>
      <DashboardSection>
        <DashboardSectionTitle
          title={translate('weekly-summary-title')}
        />
        <WeeklySummary/>
      </DashboardSection>
    </PageWrapper>
  );
}