import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import { GWUserMeal } from '@mealz/backend-meals-user-gateway-api';
import { 
  GWMealDailyPlan,
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { LoadStatus } from '../../../common';
import { Log } from '../../../log';
import { usePatchState, useService } from '../../../hooks';
import { CalculateAmountsResult, MealPlannerIngredient } from '../../types';
import { ifEnterKey, ifValueDefined, focusRef, blurRef } from '../../../utils';
import { LoaderType, ModalMenuItem, ModalMenu } from '../../../components';
import { PageLoader } from '../../../page';
import { NotificationsService, NotificationType } from '../../../notifications';
import {
  MealsUserService,
  MealsLogService,
  MealsDailyPlanService,
  UserDraftMealMetadata,
  MealsNamedService,
  NamedMeal,
} from '../../../meals';
import { useTranslations } from '../../../i18n';
import { MealCalculator, MealMapper } from '../../services';
import { MealPlannerActionBar } from './MealPlannerActionBar';
import { IngredientsEditor } from './IngredientsEditor';
import { MealSummary } from './MealSummary';
import { MealPlannerTranslations } from './MealPlanner.translations';
import { NamedMealPicker } from './NamedMealPicker';
import { MealPortion } from './MealPortion';

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
  dailyMealPlan?: GWMealDailyPlan;
  dailyPlanMealCalories: string;
  dailyPlanMealName?: string;
  fixedMealName: boolean;
  showMealNamePicker: boolean;
  showSaveMealPicker: boolean;
  showLoadMealPicker: boolean;
  showDeleteMealPicker: boolean;
  showMealPortion: boolean;
}

export function MealPlanner() {
  const notificationsService = useService(NotificationsService);
  const mealsUserService = useService(MealsUserService);
  const mealsLogService = useService(MealsLogService);
  const mealsDailyPlanService = useService(MealsDailyPlanService);
  const mealsNamedService = useService(MealsNamedService);
  const mealMapper = useService(MealMapper);
  const mealCalculator = useService(MealCalculator);

  const [state, setState] = useState<MealPlannerState>({
    loadStatus: LoadStatus.Loading,
    focus: Focus.Calories,
    ingredients: [],
    calories: '',
    calculateAmountsError: null,
    dailyPlanMealCalories: '',
    fixedMealName: false,
    showMealNamePicker: false,
    showSaveMealPicker: false,
    showLoadMealPicker: false,
    showDeleteMealPicker: false,
    showMealPortion: false,
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(MealPlannerTranslations);

  const namedMeals = useRef<NamedMeal[]>([]);

  // dirty flag
  const isDirty = useRef(false);
  const markDirty = () => {
    isDirty.current = true;
  };
  const clearDirty = () => {
    isDirty.current = false;
  };

  const caloriesFromGoals = (goals?: GWMealDailyPlanGoals): string => {
    if (!goals) {
      return '';
    }
    const avg = Math.round((goals.caloriesFrom + goals.caloriesTo) / 2);
    return avg.toString();
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
        Log.logAndRethrow(
          () => mealsNamedService.loadAll(),
          'Failed to load named meals',
        ),
      ])
      .then(([userMeal, dailyMealPlan, loadedNamedMeals]) => {
        const {
          ingredients,
          caloriesStr,
          dailyPlanMealName,
          dailyPlanMealCalories,
        } = userMealDraft.resolve(
          userMeal,
          dailyMealPlan,
        );
        recalculate(
          caloriesStr,
          ingredients,
          {
            loadStatus: LoadStatus.Loaded,
            dailyPlanMealCalories,
            dailyMealPlan,
            dailyPlanMealName,
            fixedMealName: userMeal?.metadata?.fixedMealName ?? false,
          },
        );
        namedMeals.current = loadedNamedMeals;
      })
      .catch(() => {
        patchState({ loadStatus: LoadStatus.FailedToLoad });
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
    [
      state.ingredients,
      state.calories,
      state.dailyPlanMealName,
      state.calculateAmountsError,
    ],
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
      dailyPlanMealName: string;
      dailyPlanMealCalories: string;
    } => {
      const entry = mealsDailyPlanService.getEntryByTime(
        mealDailyPlan,
        Date.now(),
      );
      const caloriesStr = caloriesFromGoals(entry?.goals) ?? '';
      const dailyPlanMealNameByTime = mealsDailyPlanService.getMealName(
        mealDailyPlan,
        Date.now(),
      );

      if (!userMeal) {
        return {
          ingredients: [],
          caloriesStr,
          dailyPlanMealName: dailyPlanMealNameByTime,
          dailyPlanMealCalories: '',
        };
      }

      // If the names are different, but it's not a fixed meal name,
      // then this means that this is another meal.
      // Clear the draft meal in this case.
      if (
        userMeal &&
        userMeal.metadata?.mealName !== entry?.mealName &&
        !userMeal.metadata?.fixedMealName
      ) {
        return {
          ingredients: [],
          caloriesStr,
          dailyPlanMealName: dailyPlanMealNameByTime,
          dailyPlanMealCalories: caloriesStr,
        };
      }

      // go with the draft user meal
      const ingredients = mealMapper.toMealPlannerIngredients(
        userMeal.meal.ingredients
      );     
      return {
        ingredients,
        caloriesStr,
        dailyPlanMealName:
          userMeal.metadata?.mealName ?? dailyPlanMealNameByTime,
        dailyPlanMealCalories: caloriesStr,
      };
    },

    tryUpsert: () => {
      if (state.calculateAmountsError) {
        return;
      }
      userMealDraft.upsert(calories.get(), state.ingredients);
    },
    
    upsert: (
      calories: number | undefined,
      ingredients: MealPlannerIngredient[],
    ) => {
      const gwMeal = mealMapper.toGWMeal(calories, ingredients);
      const metadata: UserDraftMealMetadata = {
        mealName: state.dailyPlanMealName,
        fixedMealName: state.fixedMealName,
      };
      mealsUserService.upsertUserDraftMeal(gwMeal, metadata)
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

  const mealName = {
    onShow: () => {
      const names = mealName.getMealNames();
      if (names.length === 0) {
        return;
      }
      patchState({
        showMealNamePicker: true,
      });
    },

    onClose: () => {
      patchState({
        showMealNamePicker: false,
      });
    },

    getMealNames: (): string[] => {
      if (!state.dailyMealPlan) {
        return [
          translate('default-meal-name'),
          translate('ad-hoc-meal-name'),
        ];
      }
      return [
        ...mealsDailyPlanService.getMealNames(state.dailyMealPlan),
        translate('ad-hoc-meal-name'),
      ];
    },

    getMenuItems: (): ModalMenuItem[] => {
      return mealName.getMealNames().map(name => ({
        name,
        onClick: (item: ModalMenuItem) => mealName.onPick(item.name),
      }));
    },

    onPick: (mealName: string) => {
      if (mealName === state.dailyPlanMealName) {
        return;
      }
      const entryByName = mealsDailyPlanService.getEntryByMealName(
        state.dailyMealPlan,
        mealName,
      );
      const entryByTime = mealsDailyPlanService.getEntryByTime(
        state.dailyMealPlan,
        Date.now(),
      );
      markDirty();
      patchState({
        dailyPlanMealName: mealName,
        showMealNamePicker: false,
        fixedMealName: entryByTime.mealName !== mealName,
        ...ifValueDefined<MealPlannerState>(
          'calories',
          caloriesFromGoals(entryByName?.goals),
        ),
      });
    },
  };

  const meal = {
    name: (): string | undefined => {
      return state.dailyPlanMealName;
    },

    weightInGrams: (): number => {
      return state.ingredients.reduce((acc, ingredient) => {
        return acc + (ingredient.calculatedAmount ?? 0);
      }, 0);
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
        calories: prevState.dailyPlanMealCalories,
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

    onShowPortion: () => {
      if (state.calculateAmountsError) {
        notificationsService.error(
          translate('cannot-portion-meal-with-errors')
        );
        return;
      }
      patchState({ showMealPortion: true });
    },

    onClosePortion: () => {
      patchState({ showMealPortion: false });
    },

    onPortion: (ingredients: MealPlannerIngredient[]) => {
      markDirty();
      patchState({
        ingredients,
        showMealPortion: false,
      });
    },
  };

  const namedMeal = {
    onShowLoad: () => {
      patchState({ showLoadMealPicker: true });
    },

    onCloseLoad: () => {
      patchState({ showLoadMealPicker: false });
    },

    onShowSave: () => {
      if (state.ingredients.length === 0) {
        notificationsService.error(
          translate('cannot-save-meal-with-no-ingredients')
        );
        return;
      }
      if (state.calculateAmountsError) {
        notificationsService.error(
          translate('cannot-save-meal-with-errors')
        );
        return;
      }
      patchState({ showSaveMealPicker: true });
    },

    onCloseSave: () => {
      patchState({ showSaveMealPicker: false });
    },

    onShowDelete: () => {
      patchState({ showDeleteMealPicker: true });
    },

    onCloseDelete: () => {
      patchState({ showDeleteMealPicker: false });
    },

    onLoad: (name: string) => {
      mealsNamedService.loadByName(name)
        .then((meal) => {
          markDirty();
          recalculate(
            meal.calories?.toString() ?? '',
            mealMapper.toMealPlannerIngredients(meal.ingredients),
            {
              showLoadMealPicker: false
            }
          );
        })
        .catch((error) => {
          notificationsService.error(
            translate('failed-to-load-meal')
          );
          patchState({ showLoadMealPicker: false });
          Log.error('Failed to load meal', error);
        });
    },

    onSave: (name: string) => {
      const gwMeal = mealMapper.toGWMeal(
        calories.get(),
        state.ingredients,
      );
      mealsNamedService.save(name, gwMeal)
        .then(() => {
          notificationsService.info(
            translate('meal-saved')
          );
          namedMeals.current = mealsNamedService.getAll();
        })
        .catch(error => {
          notificationsService.error(
            translate('failed-to-save-meal')
          );
          Log.error('Failed to save meal', error);
        });
      patchState({ showSaveMealPicker: false });
    },

    onDelete: (name: string) => {
      mealsNamedService.deleteByName(name)
        .then(() => {
          notificationsService.info(
            translate('meal-deleted')
          );
        })
        .catch(error => {
          notificationsService.error(
            translate('failed-to-delete-meal')
          );
          Log.error('Failed to delete meal', error);
        });
      patchState({ showDeleteMealPicker: false });
    },
  };

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
              <div
                className='mealz-meal-planner-meal-name'
                onClick={mealName.onShow}
              >
                { meal.name() ?? translate('default-meal-name') }
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
              onSaveMeal={namedMeal.onShowSave}
              onLoadMeal={namedMeal.onShowLoad}
              onDeleteMeal={namedMeal.onShowDelete}
              onPortionMeal={meal.onShowPortion}
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
      { state.showMealNamePicker &&
        <ModalMenu
          show={state.showMealNamePicker}
          items={mealName.getMenuItems()}
          onClick={mealName.onClose}
          onClose={mealName.onClose}
        />
      }
      { state.showSaveMealPicker &&
        <NamedMealPicker
          show={state.showSaveMealPicker}
          buttonLabel={translate('save-button-label')}
          placeholder={translate('save-placeholder')}
          info={{
            matching: translate('save-info-matching'),
            nonMatching: translate('save-info-non-matching'),
          }}
          onPick={namedMeal.onSave}
          onClose={namedMeal.onCloseSave}
        />
      }
      { state.showLoadMealPicker &&
        <NamedMealPicker
          show={state.showLoadMealPicker}
          buttonLabel={translate('load-button-label')}
          placeholder={translate('load-placeholder')}
          info={{
            empty: translate('load-info'),
            matching: translate('load-info'),
            nonMatching: translate('load-info'),
          }}
          mustMatchToPick={true}
          onPick={namedMeal.onLoad}
          onClose={namedMeal.onCloseLoad}
        />
      }
      { state.showDeleteMealPicker &&
        <NamedMealPicker
          show={state.showDeleteMealPicker}
          buttonLabel={translate('delete-button-label')}
          placeholder={translate('delete-placeholder')}
          info={{
            empty: translate('delete-info'),
            matching: translate('delete-info'),
            nonMatching: translate('delete-info'),
          }}
          mustMatchToPick={true}
          onPick={namedMeal.onDelete}
          onClose={namedMeal.onCloseDelete}
        />
      }
      { state.showMealPortion &&
        <MealPortion
          ingredients={state.ingredients}
          show={state.showMealPortion}
          onClose={meal.onClosePortion}
          onPortion={meal.onPortion}
        />
      }
    </>
  );
}