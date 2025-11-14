import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import { GWUserMeal } from '@mealz/backend-meals-user-gateway-api';
import { GWMealDailyPlan } from '@mealz/backend-meals-daily-plan-gateway-api';

import { LoadStatus } from '../../../common';
import { Log } from '../../../log';
import { usePatchState, useService } from '../../../hooks';
import { CalculateAmountsResult, MealPlannerIngredient } from '../../types';
import { ifEnterKey, ifValueDefined, focusRef, blurRef } from '../../../utils';
import { LoaderType } from '../../../components';
import { PageLoader } from '../../../page';
import { NotificationsService, NotificationType } from '../../../notifications';
import {
  MealsUserService,
  MealsLogService,
  MealsDailyPlanService,
  UserDraftMealMetadata,
} from '../../../meals';
import { useTranslations } from '../../../i18n';
import { MealCalculator, MealMapper } from '../../services';
import { MealPlannerActionBar } from './MealPlannerActionBar';
import { IngredientsEditor } from './IngredientsEditor';
import { MealSummary } from './MealSummary';
import { MealPlannerTranslations } from './MealPlanner.translations';

enum Focus { Calories };

interface MealPlannerState {
  loadStatus: LoadStatus;
  focus: Focus,
  ingredients: MealPlannerIngredient[];
  calories: string;
  calculateAmountsError: string | null;
  clearUndo?: {
    ingredients: MealPlannerIngredient[];
    calories: string;
  },
  dailyPlanMealName?: string;
}

export function MealPlanner() {
  const notificationsService = useService(NotificationsService);
  const mealsUserService = useService(MealsUserService);
  const mealsLogService = useService(MealsLogService);
  const mealsDailyPlanService = useService(MealsDailyPlanService);
  const mealMapper = useService(MealMapper);
  const mealCalculator = useService(MealCalculator);

  const [state, setState] = useState<MealPlannerState>({
    loadStatus: LoadStatus.Loading,
    focus: Focus.Calories,
    ingredients: [],
    calories: '',
    calculateAmountsError: null,
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(MealPlannerTranslations);

  // dirty flag
  const isDirty = useRef(false);
  const markDirty = () => {
    isDirty.current = true;
  };
  const clearDirty = () => {
    isDirty.current = false;
  };

  // initial read
  useEffect(
    () => {
      Promise.all([
        Log.logAndRethrow(
          () => userMealDraft.read(),
          'Failed to read user draft meal',
        ),
        Log.logAndRethrow(
          () => mealsDailyPlanService.readCurrentDailyPlan(),
          'Failed to read current daily plan',
        ),
      ])
      .then(([userMeal, mealDailyPlan]) => {
        const { ingredients, caloriesStr } = userMealDraft.resolve(
          userMeal,
          mealDailyPlan
        );
        recalculate(
          caloriesStr,
          ingredients,
          {
            loadStatus: LoadStatus.Loaded,
            dailyPlanMealName: mealsDailyPlanService.getMealName(
              mealDailyPlan,
              Date.now(),
            ),
          },
        );
      })
      .catch(() => {
        patchState({
          loadStatus: LoadStatus.FailedToLoad,
        });
      });
    },
    [],
  );

  // set the focus
  useEffect(
    () => {
      switch (state.focus) {
        case Focus.Calories:
          focusRef(calories.ref);
          break;
      }
    },
    [state.focus],
  );
  useEffect(
    () => focusRef(calories.ref),
    [],
  );

  // store the draft meal when the meal changes
  useEffect(
    () => {
      if (!isDirty.current) {
        return;
      }
      if (state.calculateAmountsError) {
        return;
      }
      userMealDraft.tryUpsert();
    },
    [state.ingredients, state.calories, state.calculateAmountsError],
  )

  const recalculate = (
    caloriesStr: string,
    ingredients: MealPlannerIngredient[],
    extraState?: Partial<MealPlannerState>,
  ): CalculateAmountsResult => {
    const result = mealCalculator.calculateAmounts(
      calories.fromStr(caloriesStr),
      ingredients,
    );
    patchState({
      calories: caloriesStr,
      ingredients: result.ingredients,
      ...ifValueDefined<MealPlannerState>(
        'calculateAmountsError',
        result.error,
      ),
      ...extraState,
    });
    return result;
  };

  const userMealDraft = {
    read: () => {
      return mealsUserService.readUserDraftMeal();
    },

    resolve: (
      userMeal: GWUserMeal<UserDraftMealMetadata> | undefined,
      mealDailyPlan: GWMealDailyPlan | undefined,
    ): {
      ingredients: MealPlannerIngredient[];
      caloriesStr: string;
    } => {
      const entry = mealsDailyPlanService.getEntry(mealDailyPlan, Date.now());
      if (!userMeal) {
        return {
          ingredients: [],
          caloriesStr: entry?.goals.calories.toString() ?? '',
        };
      }

      // If the names are different, this means that this is another meal.
      // Clear the draft meal in this case.
      if (userMeal && userMeal.metadata?.mealName !== entry?.mealName) {
        return {
          ingredients: [],
          caloriesStr: entry.goals.calories.toString(),
        };
      }

      const ingredients = mealMapper.toMealPlannerIngredients(
        userMeal.meal.ingredients
      );     
      const caloriesStr = userMeal.meal.calories?.toString() ?? '';
      return {
        ingredients,
        caloriesStr,
      };
    },

    tryUpsert: () => {
      if (state.calculateAmountsError) {
        return;
      }
      const caloriesValue = calories.get();
      if (!caloriesValue) {
        userMealDraft.delete();
        return;
      } 
      userMealDraft.upsert(caloriesValue, state.ingredients);
    },
    
    upsert: (
      calories: number | undefined,
      ingredients: MealPlannerIngredient[],
    ) => {
      const gwMeal = mealMapper.toGWMeal(calories, ingredients);
      mealsUserService.upsertUserDraftMeal(gwMeal, meal.name())
        .then(() => {
          clearDirty();
        })
        .catch(error => {
          notificationsService.error(
            translate('failed-to-upsert-user-draft-meal')
          );
          Log.error('Failed to save your draft meal', error);
        });
    },

    delete: () => {
      mealsUserService.deleteUserDraftMeal()
        .catch(error => {
          notificationsService.error(
            translate('failed-to-delete-user-draft-meal')
          );
          Log.error('Failed to delete user draft meal', error);
        });
    },
  };

  const onIngredientsChange = (ingredients: MealPlannerIngredient[]) => {
    markDirty();
    recalculate(state.calories, ingredients);
  };

  const calories = {
    ref: useRef(null),

    fromStr: (caloriesStr: string): number | undefined => {
      if (!caloriesStr.length) {
        return;
      }
      const value = parseInt(caloriesStr);
      return !isNaN(value) ? value : undefined;
    },

    get: (): number | undefined => {
      return calories.fromStr(state.calories);
    },

    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const caloriesStr = event.target.value;
      recalculate(caloriesStr, state.ingredients);
    },

    onEnter: () => {
      blurRef(calories.ref);
    },

    onBlur: () => {
      userMealDraft.tryUpsert();
    },
  };

  const meal = {
    name: (): string | undefined => {
      return state.dailyPlanMealName;
    },

    onLog: () => {
      if (state.calculateAmountsError) {
        notificationsService.error(
          translate('cannot-log-meal-with-errors')
        );
        return;
      }

      const gwMeal = mealMapper.toGWMeal(
        calories.get(),
        state.ingredients,
      );
      mealsLogService.logMeal(gwMeal, meal.name())
        .then((response) => {
          Log.debug(`Meal logged (${response.id})`);
          notificationsService.info(
            translate(`meal-logged-${response.status}`)
          );
        })
        .catch(error => {
          notificationsService.error(
            translate('failed-to-log-meal')
          );
          Log.error('Failed to log meal', error);
        });
    },

    onClear: () => {
    // clear
      markDirty();
      setState(prevState => ({
        ...prevState,
        ingredients: [],
        calories: '',
        clearUndo: {
          ingredients: prevState.ingredients,
          calories: prevState.calories,
        },
      }));

    // undo
      const undo = () => {
        markDirty();
        setState(prevState => ({
          ...prevState,
          ingredients: prevState.clearUndo?.ingredients ?? [],
          calories: prevState.clearUndo?.calories ?? '',
          clearUndo: undefined,
        }));
      };

    // notify
      notificationsService.pushNotification({
        message: translate('meal-cleared'),
        type: NotificationType.Info,
        undo,
      });
    },
  }

  return (
    <>
      { state.loadStatus === LoadStatus.Loading &&
        <PageLoader
          type={LoaderType.Info}
          title={translate('hang-tight')}
          subTitle={translate('preparing-meal-planner')}
        />
      }
      { state.loadStatus === LoadStatus.FailedToLoad &&
        <PageLoader
          type={LoaderType.Error}
          title={translate('try-again-later')}
          subTitle={translate('failed-to-prepare-meal-planner')}
        />
      }
      { state.loadStatus === LoadStatus.Loaded &&
        <div className='mealz-meal-planner'>
          <div className='mealz-meal-planner-top-bar'>
            <div className='mealz-meal-planner-meal'>
              <div  className='mealz-meal-planner-meal-name'>
                { meal.name() ?? translate('no-meal-name') }
              </div>
              <div className='mealz-meal-planner-calories-unit'>
                { `(${translate('kcal')})` }
              </div>
              <div className='mealz-meal-planner-calories-value'>
                <Form.Control
                  type='number'
                  placeholder=''
                  ref={calories.ref}
                  value={state.calories}
                  onChange={calories.onChange}
                  onKeyDown={ifEnterKey(calories.onEnter)}
                  onBlur={calories.onBlur}
                />
              </div>
            </div>
            <MealPlannerActionBar
              onLogMeal={meal.onLog}
              onClearMeal={meal.onClear}
            />
          </div>
          <div className='mealz-meal-planner-ingredients'>
            <IngredientsEditor
              className='mealz-meal-planner-editor'
              ingredients={state.ingredients}
              onIngredientsChange={onIngredientsChange}
            />
            <MealSummary
              className='mealz-meal-planner-summary'
              status={state.calculateAmountsError}
              calories={calories.get()}
              ingredients={state.ingredients}
            />
          </div>
        </div>
      }
    </>
  );
}