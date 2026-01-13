import * as React from 'react';

import { useTranslations } from '../../i18n';
import { useService } from '../../hooks';
import { PageWrapper } from '../../page';
import { DateService } from '../../system';
import { 
  DashboardSection,
  DashboardSectionSeparator,
  DashboardSectionTitle,
} from '../components';
import { 
  DailyHydration,
  DailyMealsLog,
  DailySummary,
  WeeklySummary,
} from '../sections';
import { DashboardPageTranslations } from './DashboardPage.translations';

export function DashboardPage() {
  const dateService = useService(DateService);
  const translate = useTranslations(DashboardPageTranslations);

  const { fromDate, toDate } = dateService.getTodayFromToDate();

  return (
    <PageWrapper title={translate('title')}>
      <DashboardSection>
        <DashboardSectionTitle
          title={translate('today-summary-title')}
        />
        <DailySummary
          fromDate={fromDate}
          toDate={toDate}
        />
      </DashboardSection>

      <DashboardSectionSeparator/>
      <DashboardSection>
        <DashboardSectionTitle
          title={translate('today-hydration-title')}
        />
        <DailyHydration
          fromDate={fromDate}
          toDate={toDate}
        />
      </DashboardSection>      

      <DashboardSectionSeparator/>
      <DashboardSection>
        <DashboardSectionTitle
          title={translate('today-meals-log-title')}
        />
        <DailyMealsLog
          fromDate={fromDate}
          toDate={toDate}
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