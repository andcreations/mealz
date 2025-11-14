import * as React from 'react';
import { useState, useEffect } from 'react';
import { GWMacrosSummary } from '@mealz/backend-meals-log-gateway-api';

import { LoadStatus } from '../../common';
import { Log } from '../../log';
import { usePatchState, useService } from '../../hooks';
import { LoaderByStatus, LoaderSize } from '../../components';
import { NotificationsService } from '../../notifications';
import { useTranslations } from '../../i18n';
import { MacrosSummary } from '../components';
import { DailySummaryTranslations } from './DailySummary.translations';

export interface DailySummaryProps {
  readSummaryFunc: () => Promise<GWMacrosSummary>;
  fromDate: number;
  toDate: number;
}

interface DailySummaryState {
  summary?: GWMacrosSummary;
  loadStatus: LoadStatus;
}

export function DailySummary(props: DailySummaryProps) {
  const notificationsService = useService(NotificationsService);
  const translate = useTranslations(DailySummaryTranslations);

  const [state, setState] = useState<DailySummaryState>({
    loadStatus: LoadStatus.Loading,
  });
  const patchState = usePatchState(setState);
  
  useEffect(
    () => {
      props.readSummaryFunc()
        .then((summary) => {
          patchState({
            summary,
            loadStatus: LoadStatus.Loaded,
          });
        })
        .catch(error => {
          Log.error('Failed to summarize daily meal log', error);
          notificationsService.error(
            translate('failed-to-load-meal-log-summary')
          );
          patchState({
            loadStatus: LoadStatus.FailedToLoad,
          });
        });
    },
    [],
  );

  return (
    <div className='mealz-daily-summary'>
      <LoaderByStatus
        loadStatus={state.loadStatus}
        size={LoaderSize.Small}
      />
      { state.loadStatus === LoadStatus.Loaded &&
        <MacrosSummary macrosSummary={state.summary}/>
      }
    </div>
  );
}