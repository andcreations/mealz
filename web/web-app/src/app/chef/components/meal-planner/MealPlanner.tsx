import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';

import { usePatchState, useService } from '../../../hooks';
import { useBusEventListener } from '../../../bus';
import { CalculateAmountsResult, MealPlannerIngredient } from '../../types';
import { ifEnterKey, ifValueDefined, focusRef, blurRef } from '../../../utils';
import { Log } from '../../../log';
import { NotificationsService, NotificationType } from '../../../notifications';
import { 
  IngredientsTopics,
  IngredientsCrudService,
  IngredientsLoadStatusChangedEvent,
} from '../../../ingredients';
import { MealsLogService, MealsUserService } from '../../../meals';
import { useTranslations } from '../../../i18n';
import { MealCalculator, MealMapper } from '../../services';
import { MealPlannerActionBar } from './MealPlannerActionBar';
import { IngredientsEditor } from './IngredientsEditor';
import { MealSummary } from './MealSummary';
import { MealPlannerTranslations } from './MealPlanner.translations';

enum Focus { Calories };

interface MealPlannerState {
  ingredients: MealPlannerIngredient[];
  ingredientsRead: boolean;
  focus: Focus,
  calories: string;
  calculateAmountsError: string | null;
  clearUndo?: {
    ingredients: MealPlannerIngredient[];
    calories: string;
  }
}

export function MealPlanner() {
  const notificationsService = useService(NotificationsService);
  const ingredientsCrudService = useService(IngredientsCrudService);
  const mealsUserService = useService(MealsUserService);
  const mealsLogService = useService(MealsLogService);
  const mealMapper = useService(MealMapper);
  const mealCalculator = useService(MealCalculator);

  const [state, setState] = useState<MealPlannerState>({
    ingredients: [],
    ingredientsRead: ingredientsCrudService.loaded(),
    focus: Focus.Calories,
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

  // read draft meal
  useEffect(
    () => {
      if (!state.ingredientsRead) {
        return;
      }
      userMealDraft.read()
        .then(({ ingredients, caloriesStr }) => {
          recalculate(caloriesStr, ingredients);
        })
        .catch(error => {
          notificationsService.error(
            translate('failed-to-read-user-draft-meal')
          );
          Log.error('Failed to read user draft meal', error);
        });
    },
    [state.ingredientsRead],
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

  useBusEventListener(
    IngredientsTopics.IngredientsLoadStatusChanged,
    (_event: IngredientsLoadStatusChangedEvent) => {
      patchState({ ingredientsRead: true })
    },
  );

  const recalculate = (
    caloriesStr: string,
    ingredients: MealPlannerIngredient[],
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
    });
    return result;
  };

  const userMealDraft = {
    read: () => {
      return new Promise<{
        ingredients: MealPlannerIngredient[];
        caloriesStr: string;
      }>((resolve, reject) => {
        mealsUserService.readUserDraftMeal()
          .then(userMeal => {
            if (!userMeal) {
              resolve({ ingredients: [], caloriesStr: '' });
              return;
            }
            const ingredients = mealMapper.toMealPlannerIngredients(
              userMeal.meal.ingredients
            );     
            const caloriesStr = userMeal.meal.calories?.toString() ?? '';
            resolve({ ingredients, caloriesStr });
          })
          .catch(error => {
            reject(error);
          });
      });
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
      mealsUserService.upsertUserDraftMeal(gwMeal)
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
      mealsLogService.logMeal(gwMeal)
        .then(() => {
          Log.debug('Meal logged');
          notificationsService.info(translate('meal-logged'));
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
    <div className='mealz-meal-planner'>
      <div className='mealz-meal-planner-top-bar'>
        <div className='mealz-meal-planner-calories'>
          <div>
            { translate('calories') }
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
  );
}