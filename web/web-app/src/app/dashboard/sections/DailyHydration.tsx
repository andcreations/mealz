import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

import { LoadStatus } from '../../common';
import { Log } from '../../log';
import { useTranslations } from '../../i18n';
import { usePatchState, useService } from '../../hooks';
import { LoaderByStatus, LoaderSize, LoaderType } from '../../components';
import { NotificationsService } from '../../notifications';
import { 
  HydrationDailyPlanService,
  HydrationLogService,
} from '../../hydration';
import { ProgressBar } from '../components';
import { DailyHydrationTranslations } from './DailyHydration.translations';

export interface DailyHydrationProps {
  fromDate: number;
  toDate: number;
}

interface DailyHydrationState {
  loadStatus: LoadStatus;
  glassesGoal?: number;
  glasses?: number;
  buttonDisabled: boolean;
}

export function DailyHydration(props: DailyHydrationProps) {
  const hydrationLogService = useService(HydrationLogService);
  const hydrationDailyPlanService = useService(HydrationDailyPlanService);
  const notificationsService = useService(NotificationsService);
  const translate = useTranslations(DailyHydrationTranslations);

  const [state, setState] = useState<DailyHydrationState>({
    loadStatus: LoadStatus.Loading,
    buttonDisabled: false,
  });
  const patchState = usePatchState(setState);

  // initial read
  useEffect(
    () => {
      Promise.all([
        Log.logAndRethrow(
          () => hydrationDailyPlanService.readCurrentDailyPlan(),
          'Failed to read current daily hydration plan',
        ),
        Log.logAndRethrow(
          () => hydrationLogService.readByDateRange(
            props.fromDate,
            props.toDate,
          ),
          'Failed to read hydration logs',
        ),
      ])
      .then(([dailyPlan, logs]) => {
        patchState({
          loadStatus: LoadStatus.Loaded,
          glassesGoal: dailyPlan?.goals.glasses,
          glasses: hydrationLogService.sumGlassesFromLogs(logs),
        });
      })
      .catch(error => {
        Log.error('Failed to read hydration summary', error);
        patchState({ loadStatus: LoadStatus.FailedToLoad });
      });
    },
    [],
  );

  const logFullGlass = () => {
    patchState({
      buttonDisabled: true,
    });
    hydrationLogService.logFullGlass()
      .then(() => {
        notificationsService.info(translate('log-full-glass-logged'));
        patchState({
          glasses: state.glasses + 1,
        });

        setTimeout(() => {
          patchState({
            buttonDisabled: false,
          });
        }, 1024);
      })
      .catch(error => {
        Log.error('Failed to log full glass', error);
        notificationsService.error(translate('failed-to-log-full-glass'));
      });
  }

  const loader = {
    type: () => {
      return state.loadStatus === LoadStatus.FailedToLoad
        ? LoaderType.Error
        : LoaderType.Info;
    },
    subTitle: () => {
      return state.loadStatus === LoadStatus.FailedToLoad
        ? translate('failed-to-load')
        : undefined;
    },
  }

  const hasData = () => {
    return state.glassesGoal != null && state.glasses != null;
  }

  return (
    <div className='mealz-daily-hydration'>
      <LoaderByStatus
        loadStatus={state.loadStatus}
        size={LoaderSize.Small}
        type={loader.type()}
        subTitle={loader.subTitle()}
      />
      { state.loadStatus === LoadStatus.Loaded && hasData() &&
        <div className='mealz-daily-hydration-progress-container'>
          <div className='mealz-daily-hydration-progress-info'>
              <span className='mealz-daily-hydration-progress-info-glasses'>
                { state.glasses }
              </span>
              <span className='mealz-daily-hydration-progress-info-label'>
                { translate('out-of') }
              </span>
              <span className='mealz-daily-hydration-progress-info-goal'>
                { state.glassesGoal }
              </span>
              <span className='mealz-daily-hydration-progress-info-label'>
                { translate('glasses') }
              </span>
          </div>
          <ProgressBar
            value={state.glasses}
            max={state.glassesGoal}
            backgroundClassName='mealz-daily-hydration-progress-bar'
            fillClassName='mealz-daily-hydration-progress-bar-fill'
          />
          <Button
            className='mealz-daily-hydration-log-glass-button'
            size='sm'
            variant='primary'
            disabled={state.buttonDisabled}
            onClick={logFullGlass}
          >
            { translate('log-full-glass') }
          </Button>
        </div>
      }
      { state.loadStatus === LoadStatus.Loaded && !hasData() &&
        <div className='mealz-daily-hydration-empty'>
          { translate('no-hydration-plan') }
        </div>
      }
    </div>
  );
}