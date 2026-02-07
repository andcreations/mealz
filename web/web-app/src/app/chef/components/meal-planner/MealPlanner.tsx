import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import { GWUserMeal } from '@mealz/backend-meals-user-gateway-api';
import { 
  GWMealDailyPlan,
  GWMealDailyPlanEntry,
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { LoadStatus } from '../../../common';
import { Log } from '../../../log';
import { usePatchState, useService } from '../../../hooks';
import { 
  AIMealScanIngredient,
  AIMealScanResult, 
  CalculateAmountsResult,
  MealPlannerIngredient,
} from '../../types';
import { ifEnterKey, ifValueDefined, focusRef, blurRef, nameToKey, truncateNumber } from '../../../utils';
import { 
  LoaderType,
  ModalMenuItem,
  ModalMenu,
  YesNoModal,
  htmlToReact,
} from '../../../components';
import { PageLoader } from '../../../page';
import { NotificationsService, NotificationType } from '../../../notifications';
import {
  MealsUserService,
  MealsLogService,
  MealsDailyPlanService,
  MealsNamedService,
  NamedMeal,
} from '../../../meals';
import { useTranslations } from '../../../i18n';
import { DateService } from '../../../system';
import { MealCalculator, MealMapper } from '../../services';
import { MealPlannerActionBar } from './MealPlannerActionBar';
import { IngredientsEditor } from './IngredientsEditor';
import { MealSummary } from './MealSummary';
import { MealPlannerTranslations } from './MealPlanner.translations';
import { NamedMealPicker } from './NamedMealPicker';
import { MealPortion } from './MealPortion';
import { AIMealScannerModal } from '../ai-meal-scanner';
import { MealNameMenuItem } from './MealNameMenuItem';

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

  // calories from the daily plan or from the draft meal (picked by the user)
  targetMealCalories: string;

  // name of the meal (picked by the user)
  mealName?: string;

  // goals for the current meal
  goals?: GWMealDailyPlanGoals;
    
  showMealNamePicker: boolean;
  showSaveMealPicker: boolean;
  showLoadMealPicker: boolean;
  showDeleteMealPicker: boolean;
  showMealPortion: boolean;
  showAIMealScannerModal: boolean;
  showMealLogConfirmationModal: boolean;
}

export function MealPlanner() {
  const dateService = useService(DateService);
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
    targetMealCalories: '',
    showMealNamePicker: false,
    showSaveMealPicker: false,
    showLoadMealPicker: false,
    showDeleteMealPicker: false,
    showMealPortion: false,
    showAIMealScannerModal: false,
    showMealLogConfirmationModal: false,
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(MealPlannerTranslations);

  const dailyMealPlan = useRef<GWMealDailyPlan | undefined>(undefined);
  const namedMeals = useRef<NamedMeal[]>([]);

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
      let mealName: string | undefined;
      let dailyPlanEntry: GWMealDailyPlanEntry | undefined;
      Promise.all([
        Log.logAndRethrow(
          () => mealsDailyPlanService.readCurrentDailyPlan(),
          'Failed to read current daily plan',
        ),
        Log.logAndRethrow(
          () => mealsNamedService.loadAll(),
          'Failed to load named meals',
        ),
      ])
      .then(([currentDailyMealPlan, loadedNamedMeals]) => {
        dailyMealPlan.current = currentDailyMealPlan;
        namedMeals.current = loadedNamedMeals;

        // resolve meal name
        dailyPlanEntry = mealsDailyPlanService.getEntryByTime(
          currentDailyMealPlan,
          Date.now(),
        );
        mealName = dailyPlanEntry?.mealName ?? translate('default-meal-name');
        
        // read meal
        return userMealDraft.read(mealName);
      })
      .then((userMeal) => {
        const ingredients = mealMapper.toMealPlannerIngredients(
          userMeal?.meal.ingredients ?? [],
        );
        meal.recalculate(
          calories.resolve(dailyPlanEntry?.goals, userMeal),
          ingredients,
          {
            loadStatus: LoadStatus.Loaded,
            mealName,
            goals: dailyPlanEntry?.goals,  
          }
        );
      })
      .catch((error) => {
        Log.error('Failed to load meal planner', error);
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
      state.mealName,
      state.calculateAmountsError,
    ],
  )

  const userMealDraft = {
    read: (mealName: string) => {
      const dateFingerprint = dateService.getTodayFingerprint();
      const mealNameKey = nameToKey(mealName);
      return mealsUserService.readUserDraftMeal(mealNameKey, dateFingerprint);
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
      const mealNameKey = nameToKey(state.mealName);
      const dateFingerprint = dateService.getTodayFingerprint();
      const gwMeal = mealMapper.toGWMeal(calories, ingredients);
      mealsUserService.upsertUserDraftMeal(
        mealNameKey,
        dateFingerprint,
        gwMeal
      )
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
  };

  const onIngredientsChange = (ingredients: MealPlannerIngredient[]) => {
    markDirty();
    meal.recalculate(state.calories, ingredients);
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
      meal.recalculate(caloriesStr, state.ingredients);
    },

    onEnter: () => {
      blurRef(calories.ref);
    },

    onBlur: () => {
      userMealDraft.tryUpsert();
    },

    fromGoals: (goals?: GWMealDailyPlanGoals) => {
      if (!goals) {
        return '';
      }
      const avg = (goals.caloriesFrom + goals.caloriesTo) / 2;
      return truncateNumber(avg).toString();
    },

    fromUserMeal: (userMeal?: GWUserMeal<void>) => {
      if (!userMeal) {
        return '';
      }
      return userMeal.meal.calories?.toString() ?? '';
    },

    resolve: (goals?: GWMealDailyPlanGoals, userMeal?: GWUserMeal<void>) => {
      const fromGoals = calories.fromGoals(goals);
      if (fromGoals) {
        return fromGoals;
      }

      const fromUserMeal = calories.fromUserMeal(userMeal);
      if (fromUserMeal) {
        return fromUserMeal;
      }

      return '';
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
      const adHocMealNames = translate('ad-hoc-meal-names').split(',');
      if (!dailyMealPlan.current) {
        return [
          translate('default-meal-name'),
          ...adHocMealNames,
        ];
      }
      return [
        ...mealsDailyPlanService.getMealNames(dailyMealPlan.current),
        ...adHocMealNames,
      ];
    },

    getMenuItems: (): ModalMenuItem[] => {
      return mealName.getMealNames().map(name => {
        const dailyPlanEntry = mealsDailyPlanService.getEntryByMealName(
          dailyMealPlan.current,
          name,
        );
        return {
          key: name,
          content: <MealNameMenuItem
            name={name}
            goals={dailyPlanEntry?.goals}
          />,
          onClick: (item: ModalMenuItem) => mealName.onPick(item.key),
        }
      });
    },

    onPick: (mealName: string) => {
      if (mealName === state.mealName) {
        return;
      }
      const dailyPlanEntry = mealsDailyPlanService.getEntryByMealName(
        dailyMealPlan.current,
        mealName,
      );
      userMealDraft.read(mealName)
        .then((userMeal) => {
          const ingredients = mealMapper.toMealPlannerIngredients(
            userMeal?.meal.ingredients ?? [],
          );
          const caloriesStr = calories.resolve(dailyPlanEntry?.goals, userMeal);
          meal.recalculate(
            calories.resolve(dailyPlanEntry?.goals, userMeal),
            ingredients,
            {
              mealName,
              goals: dailyPlanEntry?.goals,  
            }
          );          
        })
        .catch((error) => {
          Log.error('Failed to read meal', error);
          notificationsService.error(
            translate('failed-to-read-user-draft-meal')
          );
        });
    },
  };

  const meal = {
    name: (): string | undefined => {
      return state.mealName;
    },

    weightInGrams: (): number => {
      return state.ingredients.reduce((acc, ingredient) => {
        return acc + (ingredient.calculatedAmount ?? 0);
      }, 0);
    },

    recalculate: (
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
    },

    read: (mealName: string) => {
      userMealDraft.read(mealName)
        .then((userMeal) => {
        })
        .catch((error) => {
          Log.error('Failed to read meal', error);
        });
    },

    onLog: (force?: boolean) => {
      if (state.calculateAmountsError) {
        notificationsService.error(
          translate('cannot-log-meal-with-errors')
        );
        return;
      }

      const dailyPlanMealName = mealsDailyPlanService.getMealName(
        dailyMealPlan.current,
        Date.now(),
      );
      if (
        dailyPlanMealName &&
        dailyPlanMealName !== state.mealName &&
        !force
      ) {
        patchState({ showMealLogConfirmationModal: true });
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

    mealLogConfirmationMessage: (): string => {
      const dailyPlanMealName = mealsDailyPlanService.getMealName(
        dailyMealPlan.current,
        Date.now(),
      );
      return translate(
        'meal-log-confirmation-message',
        state.mealName,
        dailyPlanMealName,
      );
    },

    onConfirmMealLog: () => {
      meal.onLog(true);
      patchState({ showMealLogConfirmationModal: false });
    },

    onCloseMealLogConfirmation: () => {
      patchState({ showMealLogConfirmationModal: false });
    },

    onTakePhoto: () => {
      patchState({ showAIMealScannerModal: true });
    },

    onAcceptAIMealScan: (result: AIMealScanResult) => {
      const mapIngredient = (
        ingredient: AIMealScanIngredient,
      ): MealPlannerIngredient => {
        const per100 = (value: number) => {
          return value * 100 / ingredient.weightInGrams;
        };
        return {
          adHocIngredient: {
            name: ingredient.name,
            caloriesPer100: per100(ingredient.macros.calories),
            carbsPer100: per100(ingredient.macros.carbs),
            proteinPer100: per100(ingredient.macros.protein),
            fatPer100: per100(ingredient.macros.fat),
          },
          enteredAmount: ingredient.weightInGrams.toString(),
        };
      };
      const ingredients = result.ingredients
        .filter(ingredient => {
          return (
            ingredient.weightInGrams > 0 &&
            ingredient.name !== '' &&
            ingredient.macros.calories > 0
          );
        })
        .map(ingredient => {
         return mapIngredient(ingredient);
        });
      markDirty();
      meal.recalculate(
        state.calories,
        ingredients,
        { showAIMealScannerModal: false },
      );
    },

    onCloseAIMealScanner: () => {
      patchState({ showAIMealScannerModal: false });
    },

    onClear: () => {
    // clear
      markDirty();
      setState(prevState => ({
        ...prevState,
        ingredients: [],
        calories: prevState.targetMealCalories,
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
        .then((loadedMeal) => {
          markDirty();
          meal.recalculate(
            loadedMeal.calories?.toString() ?? '',
            mealMapper.toMealPlannerIngredients(loadedMeal.ingredients),
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
              onLogMeal={() => meal.onLog()}
              onTakePhoto={meal.onTakePhoto}
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
              goals={state.goals}
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
      { state.showAIMealScannerModal &&
        <AIMealScannerModal
          show={state.showAIMealScannerModal}
          onAccept={meal.onAcceptAIMealScan}
          onClose={meal.onCloseAIMealScanner}
        />
      }
      { state.showMealLogConfirmationModal &&
        <YesNoModal
          show={state.showMealLogConfirmationModal}
          onYes={meal.onConfirmMealLog}
          onNo={meal.onCloseMealLogConfirmation}
          onClose={meal.onCloseMealLogConfirmation}
        >
          { htmlToReact(meal.mealLogConfirmationMessage()) }
        </YesNoModal>
      }
    </>
  );
}