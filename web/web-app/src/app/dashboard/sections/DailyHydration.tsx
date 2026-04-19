import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { format } from 'timeago.js';
import {
  glassFractionToNumber,
  HYDRATION_LOGGED_SOCKET_MESSAGE_TOPIC_V1,
  HydrationLoggedSocketMessageV1Payload,
} from '@mealz/backend-hydration-log-gateway-api';

import { LoadStatus } from '../../common';
import { logEventAndRethrow, logErrorEvent } from '../../event-log';
import { useTranslations } from '../../i18n';
import { usePatchState, useService } from '../../hooks';
import { 
  htmlToReact,
  LoaderByStatus,
  LoaderSize,
  LoaderType,
} from '../../components';
import { NotificationsService } from '../../notifications';
import { 
  HydrationDailyPlanService,
  HydrationLogService,
} from '../../hydration';
import { PathTo } from '../../routing';
import { useSocketMessage } from '../../socket';
import { eventType } from '../event-log';
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
  lastLoggedAt?: number;
  lastLoggedAtStr?: string;
  buttonDisabled: boolean;
}

const UPDATE_LAST_LOGGED_AT_INTERVAL = 60_000;
const LOG_FULL_GLASS_TIMEOUT = 1024;

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

  const lastLoggedAtToStr = (lastLoggedAt?: number): string | undefined=> {
    return lastLoggedAt ? format(lastLoggedAt) : undefined;
  }
  const lastLoggedAtState = (lastLoggedAt?: number) => {
    return {
      lastLoggedAt,
      lastLoggedAtStr: lastLoggedAtToStr(lastLoggedAt),
    };
  }

  // initial read
  useEffect(
    () => {
      Promise.all([
        logEventAndRethrow(
          () => hydrationDailyPlanService.readCurrentDailyPlan(),
          eventType('daily-plan-read'),
        ),
        logEventAndRethrow(
          () => hydrationLogService.readByDateRange(
            props.fromDate,
            props.toDate,
          ),
          eventType('hydration-log-read'),
        ),
      ])
      .then(([dailyPlan, logs]) => {
        patchState({
          loadStatus: LoadStatus.Loaded,
          glassesGoal: dailyPlan?.goals.glasses,
          glasses: hydrationLogService.sumGlassesFromLogs(logs),
          ...lastLoggedAtState(logs[logs.length - 1]?.loggedAt),
        });
      })
      .catch(error => {
        logErrorEvent(
          eventType('failed-to-initialize-daily-hydration'),
          {},
          error,
        );
        patchState({ loadStatus: LoadStatus.FailedToLoad });
      });
    },
    [],
  );

  useEffect(
    () => {
      const interval = setInterval(() => {
        patchState({
          lastLoggedAtStr: lastLoggedAtToStr(Date.now()),
        });
      }, UPDATE_LAST_LOGGED_AT_INTERVAL);
      return () => {
        clearInterval(interval);
      };
    },
  );

  useSocketMessage<HydrationLoggedSocketMessageV1Payload>(
    HYDRATION_LOGGED_SOCKET_MESSAGE_TOPIC_V1,
    (payload) => {
      const glasses = glassFractionToNumber(payload.glassFraction);
      setState(prevState => ({
        ...prevState,
        glasses: prevState.glasses + glasses,
        ...lastLoggedAtState(payload.loggedAt),
      }));
    },
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
          ...lastLoggedAtState(Date.now()),
        });

        setTimeout(() => {
          patchState({ buttonDisabled: false });
        }, LOG_FULL_GLASS_TIMEOUT);
      })
      .catch(error => {
        logErrorEvent(eventType('failed-to-log-full-glass'), {}, error);
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
          { state.lastLoggedAtStr &&
            <div className='mealz-daily-hydration-last-log'>
              { translate('last-log', state.lastLoggedAtStr) }
            </div>
          }
        </div>
      }
      { state.loadStatus === LoadStatus.Loaded && !hasData() &&
        <div className='mealz-daily-hydration-empty'>
          { htmlToReact(
              translate(
                'no-hydration-plan',
                PathTo.href(PathTo.hydrationDailyPlan())
              )
            )
          }
        </div>
      }
    </div>
  );
}