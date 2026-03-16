import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { v7 } from 'uuid';
import { truncateNumber } from '@mealz/backend-shared';
import { Goal } from '@mealz/backend-calculators';
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
import { parsePositiveInteger } from '../../../utils';
import {
  FullScreenLoader,
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
import { 
  CalculatorService, 
  CalculatorSettingsService,
} from '../../../calculator';
import { cloneMealEntry, MealEntry, mealEntryMinute, mealEntryToNumbers } from '../../types';
import { HourAndMinuteSettings } from './HourAndMinuteSettings';
import { SettingsButtons } from '../SettingsButtons';
import { MealDailyPlanEntry } from './MealDailyPlanEntry';
import { MealDailyPlanSummary } from './MealDailyPlanSummary';
import { SettingsSeparator } from '../SettingsSeparator';
import { 
  MealDailyPlanSettingsTranslations,
} from './MealDailyPlanSettings.translations';
import { MealEntryCalculator } from '../../utils';

export interface MealDailyPlanSettingsProps {
  onDirtyChanged: (isDirty: boolean) => void;
}

interface MealDailyPlanSettingsState {
  loadStatus: LoadStatus;
  meals: MealEntry<string>[];
  goal?: Goal;
  goals?: GWMacros;
  deleteUndo?: {
    meals: MealEntry<string>[];
  };
  summaryForNotification: boolean;
  applying: boolean;
  isDirty: boolean;
}

export function MealDailyPlanSettings(props: MealDailyPlanSettingsProps) {
  const translate = useTranslations(MealDailyPlanSettingsTranslations);
  const notificationsService = useService(NotificationsService);
  const calculatorService = useService(CalculatorService);
  const calculatorSettingsService = useService(CalculatorSettingsService);
  const mealsDailyPlanService = useService(MealsDailyPlanService);

  const [state, setState] = useState<MealDailyPlanSettingsState>({
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
      Promise.all([
        Log.logAndRethrow(
          () => mealsDailyPlanService.readCurrentDailyPlan(),
          'meal-daily-plan-read-in-meal-daily-plan-settings',
        ),
        Log.logAndRethrow(
          () => calculatorSettingsService.read(),
          'calculator-settings-read-in-meal-daily-plan-settings',
        ),
      ]).then(([dailyPlan, calculatorSettings]) => {
        const amount = (from: number, to: number) => {
          return from + Math.round((to - from) / 2);
        }
        const amountStr = (from: number, to: number) => {
          return amount(from, to).toString();
        }
        const marginStr = (from: number, to: number) => {
          return (amount(from, to) - from).toString();
        }

        // convert
        const meals = (dailyPlan?.entries ?? []).map<MealEntry<string>>((entry) => {
          return {
            id: v7(),
            startHour: entry.startHour,
            startMinute: entry.startMinute,
            mealName: entry.mealName,
            goals: {
              calories: amountStr(
                entry.goals.caloriesFrom,
                entry.goals.caloriesTo,
              ),
              caloriesMargin: marginStr(
                entry.goals.caloriesFrom,
                entry.goals.caloriesTo,
              ),
              protein: amountStr(
                entry.goals.proteinFrom,
                entry.goals.proteinTo,
              ),
              proteinMargin: marginStr(
                entry.goals.proteinFrom,
                entry.goals.proteinTo,
              ),
              carbs: amountStr(
                entry.goals.carbsFrom,
                entry.goals.carbsTo,
              ),
              carbsMargin: marginStr(
                entry.goals.carbsFrom,
                entry.goals.carbsTo),
              fat: amountStr(
                entry.goals.fatFrom,
                entry.goals.fatTo,
              ),
              fatMargin: marginStr(
                entry.goals.fatFrom,
                entry.goals.fatTo,
              ),
            },
            collapsed: true,
          };
        });
        let goals: GWMacros | undefined;
        if (calculatorSettings) {
          const { macros } = calculatorService.calculate(calculatorSettings);
          goals = {
            calories: macros.calories,
            protein: macros.protein,
            carbs: macros.carbs,
            fat: macros.fat,
          };
        }
        patchState({
          loadStatus: LoadStatus.Loaded,
          meals,
          goal: calculatorSettings?.goal,
          goals,
        });
      })
      .catch(error => {
        Log.error('Failed to read meal daily plan settings', error);
        patchState({ loadStatus: LoadStatus.FailedToLoad });
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

  const isValidValue = (valueStr: string): boolean => {
    const value = parsePositiveInteger(valueStr);
    if (isNaN(value) || value < 0) {
      return false;
    }
    return true;
  }
  
  const time = {
    isValid: (index: number): boolean => {
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

    onChange: (index: number, hour: number, minute: number) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          startHour: hour,
          startMinute: minute,
        };
      }); 
    },
  }

  const name = {
    isValid: (name: string): boolean => {
      return name.length > 0;
    },

    onName: (index: number, name: string) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          mealName: name,
        };
      });
    },
  }

  const calories = {
    onAmountChange: (index: number, amount: string) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            calories: amount,
          },
        };
      });
    },
    
    onMarginChange: (index: number, margin: string) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            caloriesMargin: margin,
          },
        };
      });
    },

    isValid: (entry: MealEntry<string>): boolean => {
      return isValidValue(entry.goals.calories);
    },

    error: (entry: MealEntry<string>): string | undefined => {
      return;
    }
  }

  const carbs = {
    onAmountChange: (index: number, amount: string) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            carbs: amount,
          },
        };
      });
    },

    onMarginChange: (index: number, margin: string) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            carbsMargin: margin,
          },
        };
      });
    },

    isValid: (entry: MealEntry<string>): boolean => {
      return (
        isValidValue(entry.goals.carbs) &&
        isValidValue(entry.goals.carbsMargin)
      );
    },
    
    error: (entry: MealEntry<string>): string | undefined => {
      return;
    }
  }

  const protein = {
    onAmountChange: (index: number, amount: string) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            protein: amount,
          },
        };
      });
    },

    onMarginChange: (index: number, margin: string) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            proteinMargin: margin,
          },
        };
      });
    },

    isValid: (entry: MealEntry<string>): boolean => {
      return (
        isValidValue(entry.goals.protein) &&
        isValidValue(entry.goals.proteinMargin)
      );
    },

    error: (entry: MealEntry<string>): string | undefined => {
      return;
    }
  }

  const fat = {
    onAmountChange: (index: number, amount: string) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            fat: amount,
          },
        };
      });
    },

    onMarginChange: (index: number, margin: string) => {
      meal.replace(index, (previousMeal) => {
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            fatMargin: margin,
          },
        };
      });
    },

    isValid: (entry: MealEntry<string>): boolean => {
      return (
        isValidValue(entry.goals.fat) &&
        isValidValue(entry.goals.fatMargin)
      );
    },

    error: (entry: MealEntry<string>): string | undefined => {
      return;
    }
  }

  const meal = {
    onAdd: () => {
      const lastEntry = state.meals[state.meals.length - 1];
      const lastGoals = lastEntry?.goals;
      const newMeal: MealEntry<string> = {
        id: v7(),
        startHour: lastEntry?.startHour ?? 0,
        startMinute: lastEntry?.startMinute ?? 0,
        mealName: translate('default-meal-name'),
        goals: {
          calories: lastGoals?.calories ?? '500',
          caloriesMargin: lastGoals?.caloriesMargin ?? '20',
          protein: lastGoals?.protein ?? '40',
          proteinMargin: lastGoals?.proteinMargin ?? '5',
          carbs: lastGoals?.carbs ?? '50',
          carbsMargin: lastGoals?.carbsMargin ?? '5',
          fat: lastGoals?.fat ?? '20',
          fatMargin: lastGoals?.fatMargin ?? '5',
        },
      };
      patchState({
        meals: [...state.meals, newMeal],
        isDirty: true,
      });
    },

    replace: (
      index: number,
      buildMeal: (previousMeal: MealEntry<string>) => MealEntry<string>,
    ) => {
      setState(prevState => {
        const meals = [...(prevState.meals as MealEntry<string>[])];
        meals[index] = buildMeal(meals[index]);
        return {
          ...prevState,
          meals,
          isDirty: true,
        };
      });
    },

    canAutoCalculate: (index: number): boolean => {
      return !!state.goal && !meal.hasMealErrors(index);
    },

    onAutoCalculate: (index: number) => {
      const mealEntry = state.meals[index];
      const mealEntryNumbers = mealEntryToNumbers(mealEntry);

      // calculate the macros
      const macros = MealEntryCalculator.calculateMacrosByGoal(
        mealEntryNumbers,
        state.goal,
      );

      // if the difference between the total and the goal is small,
      // then adjust the macros to the goal
      if (state.goals) {
        const totals: Pick<GWMacros, 'carbs' | 'protein' | 'fat'> = {
          carbs: macros.carbs,
          protein: macros.protein,
          fat: macros.fat,
        };
        for (let itrIndex = 0; itrIndex < state.meals.length; itrIndex++) {
          if (itrIndex === index) {
            continue;
          }
          const mealEntryNumbers = mealEntryToNumbers(state.meals[itrIndex]);
          totals.carbs += truncateNumber(mealEntryNumbers.goals.carbs);
          totals.protein += truncateNumber(mealEntryNumbers.goals.protein);
          totals.fat += truncateNumber(mealEntryNumbers.goals.fat);
        }

        // goal 10, total 9, diff -1
        const carbsDiff = totals.carbs - truncateNumber(state.goals.carbs);
        const proteinDiff = totals.protein - truncateNumber(state.goals.protein);
        const fatDiff = totals.fat - truncateNumber(state.goals.fat);

        const MAX_DIFF = 5;
        if (Math.abs(carbsDiff) <= MAX_DIFF) {
          macros.carbs -= carbsDiff;
        }
        if (Math.abs(proteinDiff) <= MAX_DIFF) {
          macros.protein -= proteinDiff;
        }
        if (Math.abs(fatDiff) <= MAX_DIFF) {
          macros.fat -= fatDiff;
        }
      }

      // calculate the margins and update the meal entry
      meal.replace(index, (previousMeal) => {
        const margins = MealEntryCalculator.calculateMargins({
          calories: parsePositiveInteger(previousMeal.goals.calories),
          ...macros,
        });
        return {
          ...previousMeal,
          goals: {
            ...previousMeal.goals,
            carbs: macros.carbs.toString(),
            protein: macros.protein.toString(),
            fat: macros.fat.toString(),
            caloriesMargin: margins.caloriesMargin.toString(),
            carbsMargin: margins.carbsMargin.toString(),
            proteinMargin: margins.proteinMargin.toString(),
            fatMargin: margins.fatMargin.toString(),
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

    hasMealGoalErrors: (mealEntry: MealEntry<string>): boolean => {
      return (
        !calories.isValid(mealEntry) ||
        !carbs.isValid(mealEntry) ||
        !protein.isValid(mealEntry) ||
        !fat.isValid(mealEntry)
      );
    },

    hasMealErrors: (index: number) => {
      const mealEntry = state.meals[index];
      return (
        !name.isValid(mealEntry.mealName) ||
        !time.isValid(index) ||
        meal.hasMealGoalErrors(mealEntry)
      );
    },

    hasGoalErrors: () => {
      return state.meals.some(mealEntry => {
        return meal.hasMealGoalErrors(mealEntry);
      });
    },

    hasErrors: () => {
      const nameErrors = state.meals.some(meal => {
        return !name.isValid(meal.mealName);
      });
      const timeErrors = state.meals.some((_meal, index) => {
        return !time.isValid(index);
      });
      return nameErrors || timeErrors || meal.hasGoalErrors();
    },
  }

  const summary = {
    calculate: (): GWMacros | undefined => {
      if (meal.hasGoalErrors()) {
        return undefined;
      }

      const macros = {
        calories: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
      };
      state.meals.forEach(meal => {
        macros.calories += parsePositiveInteger(meal.goals.calories);
        macros.carbs += parsePositiveInteger(meal.goals.carbs);
        macros.protein += parsePositiveInteger(meal.goals.protein);
        macros.fat += parsePositiveInteger(meal.goals.fat);
      });
      return macros;
    },
  }

  const settings = {
    isApplyDisabled: () => {
      return state.applying || !state.isDirty || meal.hasErrors();
    },

    onApply: () => {
      const dailyPlan: GWMealDailyPlanForCreation = {
        entries: state.meals.map((meal, index) => {
          const goals = meal.goals;
          const isLast = index === state.meals.length - 1;
          const next = state.meals[index + 1];

          const endHour = isLast ? 0 : next.startHour;
          const endMinute = isLast ? 0 : next.startMinute;
          
          const from = (amount: string, margin: string) => {
            return parsePositiveInteger(amount) - parsePositiveInteger(margin);
          }
          const to = (amount: string, margin: string) => {
            return parsePositiveInteger(amount) + parsePositiveInteger(margin);
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
            message: translate('daily-plan-applied'),
            type: NotificationType.Info,
          });
          patchState({
            applying: false,
            isDirty: false,
          });
        })
        .catch((error) => {
          Log.error('Failed to apply daily plan', error);
          notificationsService.pushNotification({
            message: translate('failed-to-apply-daily-plan'),
            type: NotificationType.Error,
          });
          patchState({ applying: false });
        });
    },
  }

  const renderEntries = () => {
    const totalCalories = !meal.hasGoalErrors()
      ? truncateNumber(summary.calculate().calories)
      : 0;
    let remainingCaloriesPercent = 100;

    // for each meal
    return state.meals.map((mealEntry, index) => {
      const isLast = index === state.meals.length - 1;

      // use the remaining calories percent for last meal so that total is 100%
      let caloriesPercent: number | undefined;
      if (!meal.hasGoalErrors()) {
        const calories = parsePositiveInteger(mealEntry.goals.calories);
        caloriesPercent = !isLast
          ? truncateNumber(calories / totalCalories * 100)
          : remainingCaloriesPercent;
        remainingCaloriesPercent -= caloriesPercent;
      }

      // render the meal entry
      return <MealDailyPlanEntry
        key={mealEntry.id}
        meal={{...mealEntry}}
        caloriesPercent={caloriesPercent}
        isTimeEditable={index > 0}
        invalidTime={!time.isValid(index)}
        invalidName={!name.isValid(mealEntry.mealName)}
        invalidCaloriesAmount={!calories.isValid(mealEntry)}
        invalidCaloriesMargin={!calories.isValid(mealEntry)}
        invalidCarbsAmount={!carbs.isValid(mealEntry)}
        invalidCarbsMargin={!carbs.isValid(mealEntry)}
        invalidProteinAmount={!protein.isValid(mealEntry)}
        invalidProteinMargin={!protein.isValid(mealEntry)}
        invalidFatAmount={!fat.isValid(mealEntry)}
        invalidFatMargin={!fat.isValid(mealEntry)}
        caloriesError={calories.error(mealEntry)}
        carbsError={carbs.error(mealEntry)}
        proteinError={protein.error(mealEntry)}
        fatError={fat.error(mealEntry)}
        collapsed={true}
        autoCalculateMacrosEnabled={meal.canAutoCalculate(index)}
        onChangeName={(newName: string) => {
          name.onName(index, newName)
        }}
        onChangeTime={(hour: number, minute: number) => {
          time.onChange(index, hour, minute)
        }}
        onCaloriesAmountChange={(amount: string) => {
          calories.onAmountChange(index, amount);
        }}
        onCaloriesMarginChange={(margin: string) => {
          calories.onMarginChange(index, margin);
        }}
        onCarbsAmountChange={(amount: string) => {
          carbs.onAmountChange(index, amount);
        }}
        onCarbsMarginChange={(margin: string) => {
          carbs.onMarginChange(index, margin);
        }}
        onProteinAmountChange={(amount: string) => {
          protein.onAmountChange(index, amount);
        }}
        onProteinMarginChange={(margin: string) => {
          protein.onMarginChange(index, margin);
        }}
        onFatAmountChange={(amount: string) => {
          fat.onAmountChange(index, amount);
        }}
        onFatMarginChange={(margin: string) => {
          fat.onMarginChange(index, margin);
        }}
        onAutoCalculate={() => {
          meal.onAutoCalculate(index);
        }}
        onDelete={() => meal.onDelete(index)}
      />;
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

  return (
    <div>
      <LoaderByStatus
        loadStatus={state.loadStatus}
        size={LoaderSize.Small}
        type={loader.type()}
        subTitle={loader.subTitle()}
      />
      { state.loadStatus === LoadStatus.Loaded &&
        <>
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
              className='mealz-meal-daily-plan-settings-add-button'
              onClick={meal.onAdd}
            >
              <MaterialIcon
                className='mealz-color-active'
                icon='add_circle'
                onClick={meal.onAdd}
              />
              <div className='mealz-meal-daily-plan-settings-add-button-label'>
                { translate('add-meal') }
              </div>
            </div>
          </SettingsButtons>
          <HourAndMinuteSettings
            hour={23}
            minute={59}
          />
          <SettingsButtons
            className='mealz-meal-daily-plan-settings-buttons'
          >
            <Button
              className='mealz-meal-daily-plan-settings-apply-button'
              disabled={settings.isApplyDisabled()}
              size='sm'
              onClick={settings.onApply}
            >
              { translate('apply') }
            </Button>
          </SettingsButtons>
          <div className='mealz-meal-daily-plan-settings-summary-spacer'>
          </div>
          <MealDailyPlanSummary
            macrosSummary={summary.calculate()}
            goals={state.goals}
            error={meal.hasGoalErrors()}
            forNotification={state.summaryForNotification}
          />
        </>
      }
    </div>
  );
}