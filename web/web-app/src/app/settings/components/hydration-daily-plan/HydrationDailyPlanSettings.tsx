import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import {
  GWHydrationDailyPlanForCreation,
} from '@mealz/backend-hydration-daily-plan-gateway-api';

import { Log } from '../../../log';
import { LoadStatus } from '../../../common';
import { parsePositiveInteger } from '../../../utils';
import { useTranslations } from '../../../i18n';
import { usePatchState, useService } from '../../../hooks';
import { NotificationsService, NotificationType } from '../../../notifications';
import { 
  LoaderByStatus, 
  LoaderSize, 
  LoaderType, 
  HourAndMinutePickerModal,
  FullScreenLoader, 
} from '../../../components';
import { HydrationDailyPlanService } from '../../../hydration';
import { SettingsSection } from '../SettingsSection';
import { SettingsSeparator } from '../SettingsSeparator';
import { InputSetting } from '../InputSetting';
import { SwitchSetting } from '../SwitchSetting';
import { LabelSetting } from '../LabelSetting';
import { SettingsButtons } from '../SettingsButtons';
import { 
  HydrationDailyPlanSettingsTranslations,
} from './HydrationDailyPlanSettings.translations';

const MIN_MINUTES_SINCE_LAST_WATER_INTAKE = 5;
const MIN_PERIOD_IN_MINUTES = 5;

export interface HydrationDailyPlanSettingsProps {
  onDirtyChanged: (isDirty: boolean) => void;
}

interface HydrationDailyPlanSettingsState {
  loadStatus: LoadStatus;
  isDirty: boolean;
  glasses: string;
  glassesError: boolean;
  remindersEnabled: boolean;
  startHour: number;
  startMinute: number;
  startTimeError?: string;
  endHour: number;
  endMinute: number;
  endTimeError?: string;
  minutesSinceLastWaterIntake: string;
  periodInMinutes: string;
  showStartTimePicker: boolean;
  showEndTimePicker: boolean;
  applying: boolean;
}

export function HydrationDailyPlanSettings(
  props: HydrationDailyPlanSettingsProps,
) {
  const translate = useTranslations(HydrationDailyPlanSettingsTranslations);
  const notificationsService = useService(NotificationsService);
  const hydrationDailyPlanService = useService(HydrationDailyPlanService);

  const [state, setState] = useState<HydrationDailyPlanSettingsState>({
    loadStatus: LoadStatus.Loading,
    isDirty: false,
    glasses: '8',
    glassesError: false,
    remindersEnabled: false,
    startHour: 8,
    startMinute: 0,
    endHour: 20,
    endMinute: 0,
    minutesSinceLastWaterIntake: '45',
    periodInMinutes: '20',
    showStartTimePicker: false,
    showEndTimePicker: false,
    applying: false,
  });
  const patchState = usePatchState(setState);

  // initial read
  useEffect(
    () => {
      Log.logAndRethrow(
        () => hydrationDailyPlanService.readCurrentDailyPlan(),
        'Failed to read current daily plan',
      ).then((dailyPlan) => {
        let dailyPlanState:
          undefined | 
          Pick<HydrationDailyPlanSettingsState,
            | 'glasses'
            | 'remindersEnabled'
            | 'startHour'
            | 'startMinute'
            | 'endHour'
            | 'endMinute'
            | 'minutesSinceLastWaterIntake'
            | 'periodInMinutes'
          >;
        // must an plan with an reminder entry...
        if (dailyPlan && dailyPlan.reminders.entries.length > 0) {
          const entry = dailyPlan.reminders.entries[0];
          dailyPlanState = {
            glasses: dailyPlan.goals.glasses.toString(),
            remindersEnabled: dailyPlan.reminders.enabled,
            startHour: entry.startHour,
            startMinute: entry.startMinute,
            endHour: entry.endHour,
            endMinute: entry.endMinute,
            minutesSinceLastWaterIntake:
              entry.minutesSinceLastWaterIntake.toString(),
            periodInMinutes:
              entry.periodInMinutes.toString(),
          };
        }
        else {
          // ...otherwise, take defaults and show notification
          notificationsService.pushNotification({
            message: translate('default-settings-notification'),
            type: NotificationType.Info,
          });
        }
        patchState({
          loadStatus: LoadStatus.Loaded,
          ...(dailyPlanState ?? {}),
        });
      }).catch((error) => {
        Log.error('Failed to read current daily plan', error);
        patchState({
          loadStatus: LoadStatus.FailedToLoad,
        });
      });
    },
    [],
  );

  // notify the parent about the dirty state
  useEffect(
    () => {
      props.onDirtyChanged(state.isDirty);
    },
    [state.isDirty],
  );  

  const glasses = {
    onChange: (value: string) => {
      setState(prevState => {
        return {
          ...prevState,
          isDirty: true,
          glasses: value,
        }
      });
    },

    error: (): boolean => {
      const intValue = parsePositiveInteger(state.glasses);
      if (isNaN(intValue) || intValue < 0) {
        return true;
      }
      return false;
    },
  }

  const reminders = {
    minutes: (hour: number, minute: number) => {
      return hour * 60 + minute;
    },
    
    onRemindersEnabledChange: (enabled: boolean) => {
      setState(prevState => ({
        ...prevState,
        isDirty: true,
        remindersEnabled: enabled,
      }))
    },
  }

  const startTime = {
    onClick: () => {
      patchState({ showStartTimePicker: true });
    },

    onClosePicker: () => {
      patchState({
        startTimeError: undefined,
        showStartTimePicker: false,
      });
    },

    error: (startHour?: number, startMinute?: number) => {
      const startMinutes = reminders.minutes(
        startHour ?? state.startHour,
        startMinute ?? state.startMinute,
      );
      const endMinutes = reminders.minutes(
        state.endHour,
        state.endMinute,
      );

      if (startMinutes >= endMinutes) {
        return translate('start-time-after-end-time');
      }

      return undefined;
    },

    onEnter: (hour: number, minute: number) => {
      // error
      const startTimeError = startTime.error(hour, minute);
      if (startTimeError) {
        patchState({ startTimeError });
        return;
      }

      // no error
      setState(prevState => {
        return {
          ...prevState,
          isDirty: true,
          startHour: hour,
          startMinute: minute,
          startTimeError: undefined,
          showStartTimePicker: false,
        }
      });
    },
  }

  const endTime = {
    onClick: () => {
      patchState({ showEndTimePicker: true });
    },

    onClosePicker: () => {
      patchState({
        endTimeError: undefined,
        showEndTimePicker: false,
      });
    },

    error: (endHour?: number, endMinute?: number) => {
      const startMinutes = reminders.minutes(
        state.startHour,
        state.startMinute,
      );
      const endMinutes = reminders.minutes(
        endHour ?? state.endHour,
        endMinute ?? state.endMinute,
      );

      if (endMinutes <= startMinutes) {
        return translate('end-time-before-start-time');
      }

      return undefined;
    },    

    onEntry: (hour: number, minute: number) => {
      // error
      const endTimeError = endTime.error(hour, minute);
      if (endTimeError) {
        patchState({ endTimeError });
        return;
      }

      // no error
      setState(prevState => {
        return {
          ...prevState,
          isDirty: true,
          endHour: hour,
          endMinute: minute,
          endTimeError: undefined,
          showEndTimePicker: false,
        }
      });
    },
  }

  const minutesSinceLastWaterIntake = {
    onChange: (minutesSinceLastWaterIntake: string) => {
      setState(prevState => ({
        ...prevState,
        isDirty: true,
        minutesSinceLastWaterIntake,
        minutesSinceLastWaterIntakeError: false,
      }));
    },

    error: () => {
      const intValue = parsePositiveInteger(
        state.minutesSinceLastWaterIntake,
      );
      if (isNaN(intValue) || intValue < MIN_MINUTES_SINCE_LAST_WATER_INTAKE) {
        return true;
      }
      return false;
    }
  }

  const periodInMinutes = {
    onChange: (periodInMinutes: string) => {
      // state
      setState(prevState => ({
        ...prevState,
        isDirty: true,
        periodInMinutes,
        periodInMinutesError: false,
      }));
    },

    error: () => {
      const intValue = parsePositiveInteger(state.periodInMinutes);
      if (isNaN(intValue) || intValue < MIN_PERIOD_IN_MINUTES) {
        return true;
      }
      return false;
    }
  }

  const settings = {
    onApply: () => {
      patchState({ applying: true });
      const hydrationDailyPlan: GWHydrationDailyPlanForCreation = {
        goals: {
          glasses: parseInt(state.glasses),
        },
        reminders: {
          enabled: state.remindersEnabled,
          entries: [
            {
              startHour: state.startHour,
              startMinute: state.startMinute,
              endHour: state.endHour,
              endMinute: state.endMinute,
              minutesSinceLastWaterIntake: parseInt(
                state.minutesSinceLastWaterIntake,
              ),
              periodInMinutes: parseInt(state.periodInMinutes),
            },
          ],
        },
      };
      hydrationDailyPlanService.createDailyPlan(hydrationDailyPlan)
        .then(() => {
          notificationsService.pushNotification({
            message: translate('daily-plan-applied'),
            type: NotificationType.Info,
          });
          patchState({
            isDirty: false,
            applying: false,
          });
        })
        .catch((error) => {
          Log.error('Failed to apply daily plan', error);
          notificationsService.pushNotification({
            message: translate('failed-to-apply-daily-plan'),
            type: NotificationType.Error,
          });
          patchState({
            applying: false,
          });
        });
    },
  }

  const timeStr = (hour: number, minute: number) => {
    return (
      `${hour.toString().padStart(2, '0')}:` +
      `${minute.toString().padStart(2, '0')}`
    );
  }
  const hasErrors = (
    glasses.error() ||
    startTime.error()?.length > 0 ||
    state.endTimeError?.length > 0 ||
    minutesSinceLastWaterIntake.error() ||
    periodInMinutes.error()
  );

  return (
    <div>
      <LoaderByStatus
        loadStatus={state.loadStatus}
        size={LoaderSize.Small}
        type={LoaderType.Info}
      />
      { state.applying &&
        <FullScreenLoader title={translate('taking-longer')}/>
      }      
      <SettingsSection>
        <InputSetting
          type='number'
          label={translate('glasses-label')}
          details={translate('glasses-details')}
          value={state.glasses}
          error={glasses.error()}
          onChange={glasses.onChange}
        />
        <SettingsSeparator/>
        <SwitchSetting
          label={translate('reminders-label')}
          details={translate('reminders-details')}
          checked={state.remindersEnabled}
          onChange={reminders.onRemindersEnabledChange}
        />
        <LabelSetting
          label={translate('start-time-label')}
          details={translate('start-time-details')}
          value={timeStr(state.startHour, state.startMinute)}
          valueError={startTime.error()?.length > 0}
          onValueClick={startTime.onClick}
        />
        <LabelSetting
          label={translate('end-time-label')}
          details={translate('end-time-details')}
          value={timeStr(state.endHour, state.endMinute)}
          valueError={endTime.error()?.length > 0}
          onValueClick={endTime.onClick}
        />
        <InputSetting
          type='number'
          label={translate('minutes-since-last-water-intake-label')}
          details={translate('minutes-since-last-water-intake-details')}
          value={state.minutesSinceLastWaterIntake}
          error={minutesSinceLastWaterIntake.error()}
          onChange={minutesSinceLastWaterIntake.onChange}
        />
        <InputSetting
          type='number'
          label={translate('period-in-minutes-label')}
          details={translate('period-in-minutes-details')}
          value={state.periodInMinutes}
          error={periodInMinutes.error()}
          onChange={periodInMinutes.onChange}
        />
        <SettingsSeparator/>
        <SettingsButtons>
          <Button
            size='sm'
            disabled={!state.isDirty || hasErrors || state.applying}
            onClick={settings.onApply}
          >
            { translate('apply') }
          </Button>
        </SettingsButtons>
      </SettingsSection>
      { state.showStartTimePicker &&
        <HourAndMinutePickerModal
          show={state.showStartTimePicker}
          details={translate('start-time-modal-details')}
          error={state.startTimeError}
          hour={state.startHour}
          minute={state.startMinute}
          onEnter={startTime.onEnter}
          onClose={startTime.onClosePicker}
        />
      }
      { state.showEndTimePicker &&
        <HourAndMinutePickerModal
          show={state.showEndTimePicker}
          details={translate('end-time-modal-details')}
          error={state.endTimeError}
          hour={state.endHour}
          minute={state.endMinute}
          onEnter={endTime.onEntry}
          onClose={endTime.onClosePicker}
        />
      }
    </div>
  );
}