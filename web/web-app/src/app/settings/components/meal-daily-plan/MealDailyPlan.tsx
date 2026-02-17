import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { v7 } from 'uuid';
import { truncateNumber } from '@mealz/backend-shared';
import { GWMacros } from '@mealz/backend-meals-log-gateway-api';
import {
  GWMealDailyPlanForCreation,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { Log } from '../../../log';
import { LoadStatus } from '../../../common';
import { useTranslations } from '../../../i18n';
import { useBusEventListener } from '../../../bus';
import { MealsDailyPlanService } from '../../../meals';
import { usePatchState, useService } from '../../../hooks';
import {
  FullScreenLoader,
  InlineLoader,
  LoaderByStatus,
  LoaderSize,
  LoaderType,
  MaterialIcon,
} from '../../../components';
import { 
  NotificationsService,
  NotificationsTopics,
  NotificationType,
} from '../../../notifications';
import { HourAndMinuteSettings } from './HourAndMinuteSettings';
import { SettingsButtons } from '../SettingsButtons';
import { cloneMealEntry, MealEntry, mealEntryMinute } from './MealEntry';
import { MealDailyPlanEntry } from './MealDailyPlanEntry';
import { MealDailyPlanSummary } from './MealDailyPlanSummary';
import { SettingsSeparator } from '../SettingsSeparator';
import { MealDailyPlanTranslations } from './MealDailyPlan.translations';

export interface MealDailyPlanProps {
  onDirtyChanged: (isDirty: boolean) => void;
}

interface MealDailyPlanState {
  loadStatus: LoadStatus;
  meals: MealEntry[];
  deleteUndo?: {
    meals: MealEntry[];
  };
  summaryForNotification: boolean;
  applying: boolean;
  isDirty: boolean;
}

export function MealDailyPlan(props: MealDailyPlanProps) {
  const translate = useTranslations(MealDailyPlanTranslations);
  const notificationsService = useService(NotificationsService);
  const mealsDailyPlanService = useService(MealsDailyPlanService);

  const [state, setState] = useState<MealDailyPlanState>({
    loadStatus: LoadStatus.Loading,
    meals: [],
    summaryForNotification: false,
    applying: false,
    isDirty: false,
  });
  const patchState = usePatchState(setState);

  // initial read
  useEffect(
    () => {
      Log.logAndRethrow(
        () => mealsDailyPlanService.readCurrentDailyPlan(),
        'Failed to read current daily plan',
      ).then((dailyPlan) => {
        const amount = (from: number, to: number) => {
          return from + Math.round((to - from) / 2);
        }
        const margin = (from: number, to: number) => {
          return amount(from, to) - from;
        }

        // convert
        const meals = dailyPlan?.entries.map<MealEntry>((entry) => {
          return {
            id: v7(),
            startHour: entry.startHour,
            startMinute: entry.startMinute,
            mealName: entry.mealName,
            goals: {
              calories: amount(
                entry.goals.caloriesFrom,
                entry.goals.caloriesTo,
              ),
              caloriesMargin: margin(
                entry.goals.caloriesFrom,
                entry.goals.caloriesTo,
              ),
              protein: amount(
                entry.goals.proteinFrom,
                entry.goals.proteinTo,
              ),
              proteinMargin: margin(
                entry.goals.proteinFrom,
                entry.goals.proteinTo,
              ),
              carbs: amount(
                entry.goals.carbsFrom,
                entry.goals.carbsTo,
              ),
              carbsMargin: margin(
                entry.goals.carbsFrom,
                entry.goals.carbsTo),
              fat: amount(
                entry.goals.fatFrom,
                entry.goals.fatTo,
              ),
              fatMargin: margin(
                entry.goals.fatFrom,
                entry.goals.fatTo,
              ),
            },
          };
        });
        patchState({
          loadStatus: LoadStatus.Loaded,
          meals,
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

  // notification events
  useBusEventListener(
    NotificationsTopics.NotificationAdded,
    () => {
      patchState({ summaryForNotification: true });
    }
  );
  useBusEventListener(
    NotificationsTopics.NotificationRemoved,
    () => {
      patchState({ summaryForNotification: false });
    }
  );

  const meal = {
    isTimeValid: (index: number): boolean => {
      const previousMeal = state.meals[index - 1];
      const nextMeal = state.meals[index + 1];

      const meal = state.meals[index];
      const mealMinute = mealEntryMinute(meal);

      // invalid if not between previous and next meal time
      if (previousMeal && mealMinute <= mealEntryMinute(previousMeal)) {
        return false;
      }
      if (nextMeal && mealMinute >= mealEntryMinute(nextMeal)) {
        return false;
      }

      return true;
    },

    onAdd: () => {
      const lastEntry = state.meals[state.meals.length - 1];
      const lastGoals = lastEntry?.goals;
      const newMeal: MealEntry = {
        id: v7(),
        startHour: lastEntry?.startHour ?? 0,
        startMinute: lastEntry?.startMinute ?? 0,
        mealName: translate('default-meal-name'),
        goals: {
          calories: lastGoals?.calories ?? 500,
          caloriesMargin: lastGoals?.caloriesMargin ?? 20,
          protein: lastGoals?.protein ?? 40,
          proteinMargin: lastGoals?.proteinMargin ?? 5,
          carbs: lastGoals?.carbs ?? 50,
          carbsMargin: lastGoals?.carbsMargin ?? 5,
          fat: lastGoals?.fat ?? 20,
          fatMargin: lastGoals?.fatMargin ?? 5,
        },
      };
      patchState({
        meals: [...state.meals, newMeal],
        isDirty: true,
      });
    },

    replace: (
      index: number,
      buildMeal: (previousMeal: MealEntry) => MealEntry,
    ) => {
      setState(prevState => {
        const meals = [...prevState.meals];
        meals[index] = buildMeal(meals[index]);
        return {
          ...prevState,
          meals,
          isDirty: true,
        };
      });
    },

    onChangeName: (index: number, name: string) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          mealName: name,
        };
      });
    },

    onChangeTime: (index: number, hour: number, minute: number) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          startHour: hour,
          startMinute: minute,
        };
      }); 
    },

    onCaloriesChange: (index: number, amount: number, margin: number) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            calories: amount,
            caloriesMargin: margin,
          },
        };
      });
    },
    

    onCarbsChange: (index: number, amount: number, margin: number) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            carbs: amount,
            carbsMargin: margin,
          },
        };
      });
    },

    onProteinChange: (index: number, amount: number, margin: number) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            protein: amount,
            proteinMargin: margin,
          },
        };
      });
    },

    onFatChange: (index: number, amount: number, margin: number) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            fat: amount,
            fatMargin: margin,
          },
        };
      });
    },

    onDelete: (index: number) => {
      setState(prevState => {
        // need to clone not to mutate the undo state
        const undoMeals = prevState.meals.map(cloneMealEntry);

        const meals = [...prevState.meals];
        meals.splice(index, 1);

        // the first meal must always start at midnight
        if (meals.length > 0) {
          meals[0].startHour = 0;
          meals[0].startMinute = 0;
        }

        return {
          ...prevState,
          meals,
          deleteUndo: {
            meals: undoMeals,
          },
          isDirty: true,
        };
      });

      // show notification
      notificationsService.pushNotification({
        message: translate('meal-deleted'),
        type: NotificationType.Info,
        undo: () => {
          setState(prevState => {
            const deleteUndo = prevState.deleteUndo;
            if (!deleteUndo) {
              return prevState;
            }

            return {
              ...prevState,
              meals: deleteUndo.meals,
              deleteUndo: undefined,
              isDirty: true,
            };
          });
        },
      });
    },
  }

  const summary = {
    calculate: (): GWMacros => {
      const macros = {
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
      };
      state.meals.forEach(meal => {
        macros.calories += meal.goals.calories;
        macros.carbs += meal.goals.carbs;
        macros.protein += meal.goals.protein;
        macros.fat += meal.goals.fat;
      });
      return macros;
    },
  }

  const settings = {
    onApply: () => {
      const dailyPlan: GWMealDailyPlanForCreation = {
        entries: state.meals.map((meal, index) => {
          const goals = meal.goals;
          const isLast = index === state.meals.length - 1;
          const next = state.meals[index + 1];

          const endHour = isLast ? 0 : next.startHour;
          const endMinute = isLast ? 0 : next.startMinute;
          
          const from = (amount: number, margin: number) => {
            return amount - margin;
          }
          const to = (amount: number, margin: number) => {
            return amount + margin;
          }

          return {
            startHour: meal.startHour,
            startMinute: meal.startMinute,
            endHour,
            endMinute,
            mealName: meal.mealName,
            goals: {
              caloriesFrom: from(goals.calories, goals.caloriesMargin),
              caloriesTo: to(goals.calories, goals.caloriesMargin),
              proteinFrom: from(goals.protein, goals.proteinMargin),
              proteinTo: to(goals.protein, goals.proteinMargin),
              carbsFrom: from(goals.carbs, goals.carbsMargin),
              carbsTo: to(goals.carbs, goals.carbsMargin),
              fatFrom: from(goals.fat, goals.fatMargin),
              fatTo: to(goals.fat, goals.fatMargin),
            },
          };
        }),
      };
      
      patchState({ applying: true });
      mealsDailyPlanService.createDailyPlan(dailyPlan)
        .then(() => {
          notificationsService.pushNotification({
            message: translate('daily-plan-created'),
            type: NotificationType.Info,
          });
          patchState({
            applying: false,
            isDirty: false,
          });
        })
        .catch((error) => {
          Log.error('Failed to create daily plan', error);
          notificationsService.pushNotification({
            message: translate('failed-to-create-daily-plan'),
            type: NotificationType.Error,
          });
          patchState({ applying: false });
        });
    },
  }

  const renderEntries = () => {
    const totalCalories = truncateNumber(summary.calculate().calories);
    let remainingCaloriesPercent = 100;

    // for each meal
    return state.meals.map((mealEntry, index) => {
      const isLast = index === state.meals.length - 1;

      // use the remaining calories percent for last meal so that total is 100%
      const caloriesPercent = !isLast
        ? truncateNumber(mealEntry.goals.calories / totalCalories * 100)
        : remainingCaloriesPercent;
      remainingCaloriesPercent -= caloriesPercent;

      // render the meal entry
      return <MealDailyPlanEntry
        key={mealEntry.id}
        meal={{...mealEntry}}
        caloriesPercent={caloriesPercent.toString()}
        isTimeEditable={index > 0}
        invalidTime={!meal.isTimeValid(index)}
        onChangeName={(name: string) => {
          meal.onChangeName(index, name)
        }}
        onChangeTime={(hour: number, minute: number) => {
          meal.onChangeTime(index, hour, minute)
        }}
        onCaloriesChange={(amount: number, margin: number) => {
          meal.onCaloriesChange(index, amount, margin);
        }}
        onCarbsChange={(amount: number, margin: number) => {
          meal.onCarbsChange(index, amount, margin);
        }}
        onProteinChange={(amount: number, margin: number) => {
          meal.onProteinChange(index, amount, margin);
        }}
        onFatChange={(amount: number, margin: number) => {
          meal.onFatChange(index, amount, margin);
        }}
        onDelete={() => meal.onDelete(index)}
      />;
    });
  }

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
      { state.meals.length === 0 &&
        <HourAndMinuteSettings
          hour={0}
          minute={0}
        />
      }
      { renderEntries() }
      <SettingsSeparator size='small'/>
      <SettingsButtons>
        <div
          className='mealz-meal-daily-plan-add-button'
          onClick={meal.onAdd}
        >
          <MaterialIcon
            className='mealz-color-active'
            icon='add_circle'
            onClick={meal.onAdd}
          />
          <div className='mealz-meal-daily-plan-add-button-label'>
            { translate('add-meal') }
          </div>
        </div>
      </SettingsButtons>
      <HourAndMinuteSettings
        hour={23}
        minute={59}
      />
      <SettingsButtons
        className='mealz-meal-daily-plan-buttons'
      >
        <Button
          className='mealz-meal-daily-plan-apply-button'
          disabled={state.applying || !state.isDirty}
          size='sm'
          onClick={settings.onApply}
        >
          { translate('apply') }
        </Button>
      </SettingsButtons>
      <div className='mealz-meal-daily-plan-summary-spacer'>
      </div>
      <MealDailyPlanSummary
        macrosSummary={summary.calculate()}
        forNotification={state.summaryForNotification}
      />
    </div>
  );
}