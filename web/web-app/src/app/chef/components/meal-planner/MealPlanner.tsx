import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import { truncateNumber } from '@mealz/backend-shared';
import { GWUserMeal } from '@mealz/backend-meals-user-gateway-api';
import { GWNamedMeal } from '@mealz/backend-meals-named-gateway-api';
import { 
  GWMealDailyPlan,
  GWMealDailyPlanEntry,
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { LoadStatus } from '../../../common';
import {
  logDebugEvent,
  logErrorEvent,
  logEventAndRethrow,
} from '../../../event-log';
import { usePatchState, useService } from '../../../hooks';
import { 
  AIMealScanIngredient,
  AIMealScanResult, 
  CalculateAmountsResult,
  MealPlannerIngredient,
} from '../../types';
import {
  ifEnterKey,
  ifValueDefined,
  focusRef,
  blurRef,
  nameToKey,
} from '../../../utils';
import { 
  LoaderType,
  ModalMenuItem,
  ModalMenu,
  YesNoModal,
  DatePickerModal,
  htmlToReact,
  FullScreenLoader,
} from '../../../components';
import { PageLoader } from '../../../page';
import {
  NotificationsService,
  NotificationType,
} from '../../../notifications';
import {
  MealsUserService,
  MealsLogService,
  MealsDailyPlanService,
  MealsNamedService,
  MealsNamedShareService,
} from '../../../meals';
import { useTranslations } from '../../../i18n';
import { DateService } from '../../../system';
import { MealCalculator, MealMapper } from '../../services';
import { eventType } from '../../event-log';
import { LocalStorage } from '../../../storage';
import { MEAL_NAME_STORAGE_ITEM, MealNameStorageItem } from '../../storage';
import { AIMealScannerModal } from '../ai-meal-scanner';
import { MealPlannerActionBar } from './MealPlannerActionBar';
import { IngredientsEditor } from './IngredientsEditor';
import { MealSummary } from './MealSummary';
import { MealPlannerTranslations } from './MealPlanner.translations';
import { NamedMealPicker } from './NamedMealPicker';
import { ShareNamedMealPicker } from './ShareNamedMealPicker';
import { MealPortion } from './MealPortion';
import { MealNameMenuItem } from './MealNameMenuItem';
import { MEAL_NAME_MAX_AGE } from '../../const';

enum Focus { Calories };

interface MealPlannerState {
  loadStatus: LoadStatus;
  fullScreenLoadStatus: LoadStatus | null;
  focus: Focus,
  ingredients: MealPlannerIngredient[];
  calories: string;
  calculateAmountsError: string | null;
  clearUndo?: {
    ingredients: MealPlannerIngredient[];
    calories: string;
  },

  // name of the meal (picked by the user)
  mealName?: string;

  // goals for the current meal
  goals?: GWMealDailyPlanGoals;

  showMealNamePicker: boolean;
  showSaveMealPicker: boolean;
  showLoadMealPicker: boolean;
  showDeleteMealPicker: boolean;
  showShareMealPicker: boolean;
  showMealPortion: boolean;
  showAIMealScannerModal: boolean;
  showMealLogConfirmationModal: boolean;
  showDatePickerModal: boolean;
  dayFingerprint: string;
}

export function MealPlanner() {
  const dateService = useService(DateService);
  const localStorage = useService(LocalStorage);
  const notificationsService = useService(NotificationsService);
  const mealsUserService = useService(MealsUserService);
  const mealsLogService = useService(MealsLogService);
  const mealsDailyPlanService = useService(MealsDailyPlanService);
  const mealsNamedService = useService(MealsNamedService);
  const mealsNamedShareService = useService(MealsNamedShareService);
  const mealMapper = useService(MealMapper);
  const mealCalculator = useService(MealCalculator);

  const [state, setState] = useState<MealPlannerState>({
    loadStatus: LoadStatus.Loading,
    fullScreenLoadStatus: null,
    focus: Focus.Calories,
    ingredients: [],
    calories: '',
    calculateAmountsError: null,
    showMealNamePicker: false,
    showSaveMealPicker: false,
    showLoadMealPicker: false,
    showDeleteMealPicker: false,
    showShareMealPicker: false,
    showMealPortion: false,
    showAIMealScannerModal: false,
    showMealLogConfirmationModal: false,
    showDatePickerModal: false,
    dayFingerprint: dateService.getTodayFingerprint(),
  });
  const patchState = usePatchState(setState);
  const translate = useTranslations(MealPlannerTranslations);

  const dailyMealPlan = useRef<GWMealDailyPlan | undefined>(undefined);
  const namedMeals = useRef<GWNamedMeal[]>([]);

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
      let resolvedMealName: string | undefined;
      let dailyPlanEntry: GWMealDailyPlanEntry | undefined;
      Promise.all([
        logEventAndRethrow(
          () => mealsDailyPlanService.readCurrentDailyPlan(),
          eventType('daily-plan-read'),
        ),
        logEventAndRethrow(
          () => mealsNamedService.loadAll(),
          eventType('named-meals-read'),
        ),
        logEventAndRethrow(
          () => localStorage.getItemAsync<MealNameStorageItem>(
            MEAL_NAME_STORAGE_ITEM,
          ),
          eventType('meal-name-read'),
        ),
      ])
      .then(([currentDailyMealPlan, loadedNamedMeals, mealNameItem]) => {
        dailyMealPlan.current = currentDailyMealPlan;
        namedMeals.current = loadedNamedMeals;

        // resolve meal name
        resolvedMealName = mealName.resolveInitialMealName(
          mealNameItem,
          currentDailyMealPlan,
        );
        dailyPlanEntry = mealsDailyPlanService.getEntryByMealName(
          currentDailyMealPlan,
          resolvedMealName,
        );
        
        // read meal
        return userMealDraft.read(resolvedMealName);
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
            mealName: resolvedMealName,
            goals: dailyPlanEntry?.goals,
          }
        );
      })
      .catch((error) => {
        logErrorEvent(
          eventType('failed-to-initialize-meal-planner'),
          {},
          error,
        );
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
    read: (mealName: string, dayFingerprint?: string) => {
      const mealNameKey = nameToKey(mealName);
      return mealsUserService.readUserDraftMeal(
        mealNameKey,
        dayFingerprint ?? state.dayFingerprint,
      );
    },

    readAndRecalculate: (
      mealName: string,
      dayFingerprint?: string,
      onSuccess?: () => void,
    ) => {
      userMealDraft.read(mealName, dayFingerprint)
        .then((userMeal) => {
          const ingredients = mealMapper.toMealPlannerIngredients(
            userMeal?.meal.ingredients ?? [],
          );
          const dailyPlanEntry = mealsDailyPlanService.getEntryByMealName(
            dailyMealPlan.current,
            mealName,
          );    
          meal.recalculate(
            calories.resolve(dailyPlanEntry?.goals, userMeal),
            ingredients,
            {
              mealName,
              goals: dailyPlanEntry?.goals,  
            }
          );
          onSuccess?.();
        })
        .catch((error) => {
          logErrorEvent(eventType('failed-to-read-meal'), {}, error);
          notificationsService.error(
            translate('failed-to-read-user-draft-meal')
          );
        })
        .finally(() => {
          patchState({ fullScreenLoadStatus: null });
        });
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
      const gwMeal = mealMapper.toGWMeal(calories, ingredients);
      mealsUserService.upsertUserDraftMeal(
        mealNameKey,
        state.dayFingerprint,
        gwMeal
      )
      .then(() => {
        clearDirty();
      })
      .catch(error => {
        notificationsService.error(
          translate('failed-to-upsert-user-draft-meal')
        );
        logErrorEvent(eventType('failed-to-save-user-draft-meal'), {}, error);
      });
    },
  };

  const onIngredientsChange = (
    ingredients: MealPlannerIngredient[],
  ) => {
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
    resolveInitialMealName: (
      mealNameStorageItem: MealNameStorageItem | undefined,
      mealDailyPlan: GWMealDailyPlan | undefined,
    ) => {
      const now = Date.now();
      if (mealNameStorageItem) {
        const timestampDiff = now - mealNameStorageItem.timestamp;
        if (timestampDiff < MEAL_NAME_MAX_AGE) {
          return mealNameStorageItem.mealName;
        }
      }
      if (mealDailyPlan) {
        const mealDailyPlanEntry = mealsDailyPlanService.getEntryByTime(
          mealDailyPlan,
          now,
        );
        return mealDailyPlanEntry.mealName;
      }
      return translate('default-meal-name');
    },

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
      const menuItems: ModalMenuItem[] = [];
      const addMenuItem = (name: string, group: string) => {
        const dailyPlanEntry = mealsDailyPlanService.getEntryByMealName(
          dailyMealPlan.current,
          name,
        );
        menuItems.push({
          key: name,
          group,
          content: <MealNameMenuItem
            name={name}
            goals={dailyPlanEntry?.goals}
          />,
          onClick: (item: ModalMenuItem) => mealName.onPick(item.key),
        });
      };

      // daily plan meals
      const planNames = mealsDailyPlanService.getMealNames(
        dailyMealPlan.current,
      );
      planNames.forEach(name => addMenuItem(name, 'daily-plan'));

      const addMealsFromTranslation = (translation: string, group: string) => {
        const mealNames = translate(translation).split(',');
        mealNames.forEach(name => addMenuItem(name, group));
      };

      addMealsFromTranslation('ad-hoc-meal-names', 'ad-hoc');
      addMealsFromTranslation('after-training-meal-names', 'after-training');
      addMealsFromTranslation('draft-meal-names', 'draft');

      return menuItems;
    },

    onPick: (mealName: string) => {
      if (mealName === state.mealName) {
        return;
      }
      patchState({ fullScreenLoadStatus: LoadStatus.Loading });
      userMealDraft.readAndRecalculate(
        mealName,
        undefined,
        () => {
          localStorage.setItem<MealNameStorageItem>(
            MEAL_NAME_STORAGE_ITEM,
            {
              mealName,
              timestamp: Date.now(),
            },
          );
        },
      );
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

    isLogEnabled: (): boolean => {
      return day.isToday() && !mealsUserService.isDraftMeal(state.mealName);
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
      patchState({ fullScreenLoadStatus: LoadStatus.Loading });
      mealsLogService.logMeal(gwMeal, meal.name())
        .then((response) => {
          logDebugEvent(eventType('meal-logged'), {
            id: response.id,
          });
          notificationsService.info(
            translate(`meal-logged-${response.status}`)
          );
        })
        .catch(error => {
          notificationsService.error(
            translate('failed-to-log-meal')
          );
          logErrorEvent(eventType('failed-to-log-meal'), {}, error);
        })
        .finally(() => {
          patchState({ fullScreenLoadStatus: null });
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
      let newCalories = state.calories;
      if (state.goals) {
        newCalories = calories.fromGoals(state.goals);
      }

    // clear
      markDirty();
      setState(prevState => ({
        ...prevState,
        ingredients: [],
        calories: newCalories,
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
    withoutSharedBy: (meal: GWNamedMeal): boolean => {
      return !meal.sharedBy;
    },

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

    onShowShare: () => {
      patchState({ showShareMealPicker: true });
    },

    onCloseShare: () => {
      patchState({ showShareMealPicker: false });
    },

    onShare: (sharedMeal: GWNamedMeal, sharedUser: { id: string }) => {
      mealsNamedShareService.shareNamedMeal(sharedMeal.id, sharedUser.id)
        .then(() => {
          notificationsService.info(translate('meal-shared'));
        })
        .catch(error => {
          notificationsService.error(translate('failed-to-share-meal'));
          logErrorEvent(eventType('failed-to-share-meal'), {}, error);
        });
      patchState({ showShareMealPicker: false });
    },

    onLoad: (name: string, id?: string, switchChecked?: boolean) => {
      mealsNamedService.loadById(id)
        .then(({ meal: loadedMeal }) => {
          markDirty();
          let ingredients = mealMapper.toMealPlannerIngredients(
            loadedMeal.ingredients,
          );
          if (switchChecked === true) {
            const collapsed = mealCalculator.collapseToOneIngredient(
              loadedMeal.calories,
              ingredients,
              name,
            );
            if (collapsed.collapsed) {
              ingredients = collapsed.ingredients;
            }
          }
          meal.recalculate(
            state.calories,
            [...state.ingredients, ...ingredients],
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
          logErrorEvent(eventType('failed-to-load-meal'), {}, error);
        });
    },

    onSave: (name: string, id?: string) => {
      const gwMeal = mealMapper.toGWMeal(
        calories.get(),
        state.ingredients,
      );
      mealsNamedService.save(id, name, gwMeal)
        .then(() => {
          notificationsService.info(translate('meal-saved'));
          namedMeals.current = mealsNamedService.getAll();
        })
        .catch(error => {
          notificationsService.error(
            translate('failed-to-save-meal')
          );
          logErrorEvent(eventType('failed-to-save-meal'), {}, error);
        });
      patchState({ showSaveMealPicker: false });
    },

    onDelete: (_name: string, id?: string) => {
      mealsNamedService.deleteById(id)
        .then(() => {
          notificationsService.info(translate('meal-deleted'));
        })
        .catch(error => {
          notificationsService.error(
            translate('failed-to-delete-meal')
          );
          logErrorEvent(eventType('failed-to-delete-meal'), {}, error);
        });
      patchState({ showDeleteMealPicker: false });
    },
  };

  const day = {
    onShow: () => {
      patchState({ showDatePickerModal: true });
    },

    onClose: () => {
      patchState({ showDatePickerModal: false });
    },

    onEnter: (day: number, month: number, year: number) => {
      const dayFingerprint = dateService.toFingerprint(day, month, year);
      patchState({
        showDatePickerModal: false,
        dayFingerprint,
        fullScreenLoadStatus: LoadStatus.Loading,
      });
      userMealDraft.readAndRecalculate(state.mealName, dayFingerprint);
    },

    isToday: (): boolean => {
      return state.dayFingerprint === dateService.getTodayFingerprint();
    },

    date: () => {
      return dateService.fingerprintToDate(state.dayFingerprint);
    },

    valueForLabel: () => {
      const date = dateService.fingerprintToDate(state.dayFingerprint);
      const dayOfWeek = date.toFormat('EEEE');
      const differenceInDays = dateService.differenceInDaysFromNow(date);

      let relative = '';
      if (differenceInDays === 0) {
        return translate('today');
      }
      else if (differenceInDays === 1) {
        return translate('tomorrow');
      }
      else {
        if (differenceInDays > 1) {
          relative = translate('in-days', differenceInDays.toString());
        }
        else if (differenceInDays < 0) {
          const daysAgo = -differenceInDays;
          if (daysAgo === 1) {
            return translate('yesterday');
          }
          relative = translate('days-ago', daysAgo.toString());
        }
      }
      return translate('summary', dayOfWeek, relative);
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
      { state.fullScreenLoadStatus === LoadStatus.Loading &&
        <FullScreenLoader title={translate('taking-longer')}/>
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
                  type='text'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  placeholder=''
                  ref={calories.ref}
                  value={state.calories}
                  onChange={calories.onChange}
                  onKeyDown={ifEnterKey(calories.onEnter)}
                  onBlur={calories.onBlur}
                  enterKeyHint='done'
                />
              </div>
            </div>
            <MealPlannerActionBar
              logDisabled={!meal.isLogEnabled()}
              onLogMeal={() => meal.onLog()}
              onTakePhoto={meal.onTakePhoto}
              onClearMeal={meal.onClear}
              onSaveMeal={namedMeal.onShowSave}
              onLoadMeal={namedMeal.onShowLoad}
              onDeleteMeal={namedMeal.onShowDelete}
              onShareMeal={namedMeal.onShowShare}
              onPortionMeal={meal.onShowPortion}
              onPickADay={day.onShow}
            />
          </div>
          { !day.isToday() &&
            <div className='mealz-meal-planner-day-label'>
              <div className='mealz-meal-planner-day-label-label'>
                { translate('planning-meal-for') }
              </div>
              &nbsp;
              <div className='mealz-meal-planner-day-label-value'>
                { day.valueForLabel() }
              </div>
            </div>
          }
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
          mealFilter={namedMeal.withoutSharedBy}
          onPick={namedMeal.onSave}
          onClose={namedMeal.onCloseSave}
        />
      }
      { state.showLoadMealPicker &&
        <NamedMealPicker
          show={state.showLoadMealPicker}
          switchLabel={translate('load-switch-label')}
          switchChecked={false}
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
      { state.showShareMealPicker &&
        <ShareNamedMealPicker
          show={state.showShareMealPicker}
          onShare={namedMeal.onShare}
          onClose={namedMeal.onCloseShare}
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
      { state.showDatePickerModal &&
        <DatePickerModal
          show={state.showDatePickerModal}
          day={day.date().day}
          month={day.date().month}
          year={day.date().year}
          onEnter={day.onEnter}
          onClose={day.onClose}
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