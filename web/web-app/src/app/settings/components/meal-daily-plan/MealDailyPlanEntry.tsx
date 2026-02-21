import * as React from 'react';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';

import { ifEnterKey } from '../../../utils';
import { usePatchState } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { MealEntry } from './MealEntry';
import { HourAndMinuteSettings } from './HourAndMinuteSettings';
import { AmountAndMarginSetting } from './AmountAndMarginSetting';
import {
  MealDailyPlanEntryTranslations,
} from './MealDailyPlanEntry.translations';
import { MealDailyPlanEntryActionBar } from './MealDailyPlanEntryActionBar';
import { MealDailyPlanEntrySummary } from './MealDailyPlanEntrySummary';
import { MaterialIcon } from '../../../components';
import { truncateNumber } from '@mealz/backend-shared';

interface MealDailyPlanEntryProps {
  meal: Omit<MealEntry, 'id' | 'hasErrors'>;
  caloriesPercent: string; // of all the meals
  isTimeEditable: boolean;
  invalidTime: boolean;
  collapsed: boolean;
  onChangeName: (name: string) => void;
  onChangeTime: (hour: number, minute: number) => void;
  onCaloriesChange: (amount: number, margin: number) => void;
  onCarbsChange: (amount: number, margin: number) => void;
  onProteinChange: (amount: number, margin: number) => void;
  onFatChange: (amount: number, margin: number) => void;
  onDelete: () => void;
}

enum Focus {
  Calories,
  Carbs,
  Protein,
  Fat,
}

interface MealDailyPlanEntryState {
  focus?: Focus;
  meal: Omit<MealEntry, 'id' | 'hasErrors'>;
  isNameEditing: boolean;
  invalidName: boolean;
  oldName?: string;
  collapsed: boolean;
}

export function MealDailyPlanEntry(props: MealDailyPlanEntryProps) {
  const translate = useTranslations(MealDailyPlanEntryTranslations);

  const [state, setState] = useState<MealDailyPlanEntryState>({
    meal: {
      startHour: props.meal.startHour,
      startMinute: props.meal.startMinute,
      mealName: props.meal.mealName,
      goals: {
        calories: props.meal.goals.calories,
        caloriesMargin: props.meal.goals.caloriesMargin,
        protein: props.meal.goals.protein,
        proteinMargin: props.meal.goals.proteinMargin,
        carbs: props.meal.goals.carbs,
        carbsMargin: props.meal.goals.carbsMargin,
        fat: props.meal.goals.fat,
        fatMargin: props.meal.goals.fatMargin,
      }
    },
    isNameEditing: false,
    invalidName: false,
    collapsed: props.collapsed,
  });
  const patchState = usePatchState(setState);

  // update the state when the properties change
  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      meal: props.meal,
    }));
  }, [props.meal]);

  const time = {
    onChange: (hour: number, minute: number) => {
      setState(prevState => ({
        ...prevState,
        meal: {
          ...prevState.meal,
          startHour: hour,
          startMinute: minute,
        }
      }));
      props.onChangeTime(hour, minute);
    },
  };

  const name = {
    onEdit: () => {
      setState(prevState => ({
        ...prevState,
        isNameEditing: true,
        oldName: prevState.meal.mealName,
      }));
    },

    isValid: (value: string): boolean => {
      return value.length > 0;
    },

    onChange: (value: string) => {
      setState(prevState => ({
        ...prevState,
        meal: {
          ...prevState.meal,
          mealName: value,
        },
        invalidName: !name.isValid(value),
      }));
    },

    stopEditing: () => {
      if (state.invalidName) {
        return;
      }

      props.onChangeName(state.meal.mealName);
      patchState({ isNameEditing: false });
    },

    onEnter: () => {
      name.stopEditing();
    },

    onBlur: () => {
      name.stopEditing();
    },
  };

  const summary = {
    macros: () => {
      const goals = state.meal.goals;
      const total = goals.carbs + goals.protein + goals.fat;
      const carbsPercent = truncateNumber(goals.carbs / total * 100);
      const proteinPercent = truncateNumber(goals.protein / total * 100);
      return {
        carbsPercent,
        proteinPercent,
        // the remaining percentage for fat so that total is 100%
        fatPercent: 100 - carbsPercent - proteinPercent,
      };
    },
  }
  
  const calories = {
    details: () => {
      return `kcal (${props.caloriesPercent}%)`;
    },

    onChange: (amount: number, margin: number) => {
      setState(prevState => ({
        ...prevState,
        meal: {
          ...prevState.meal,
          goals: {
            ...prevState.meal.goals,
            calories: amount,
            caloriesMargin: margin,
          }
        }
      }));
      props.onCaloriesChange(amount, margin);
    },
  };

  const carbs = {
    details: () => {
      const carbsPercent = summary.macros().carbsPercent;
      return `g (${carbsPercent}%)`;
    },

    onChange: (amount: number, margin: number) => {
      setState(prevState => ({
        ...prevState,
        meal: {
          ...prevState.meal,
          goals: {
            ...prevState.meal.goals,
            carbs: amount,
            carbsMargin: margin,
          }
        }
      }));
      props.onCarbsChange(amount, margin);
    },
  };

  const protein = {
    details: () => {
      const proteinPercent = summary.macros().proteinPercent;
      return `g (${proteinPercent}%)`;
    },

    onChange: (amount: number, margin: number) => {
      setState(prevState => ({
        ...prevState,
        meal: {
          ...prevState.meal,
          goals: {
            ...prevState.meal.goals,
            protein: amount,
            proteinMargin: margin,
          }
        }
      }));
      props.onProteinChange(amount, margin);
    },
  };

  const fat = {
    details: () => {
      const fatPercent = summary.macros().fatPercent;
      return `g (${fatPercent}%)`;
    },

    onChange: (amount: number, margin: number) => {
      setState(prevState => ({
        ...prevState,
        meal: {
          ...prevState.meal,
          goals: {
            ...prevState.meal.goals,
            fat: amount,
            fatMargin: margin,
          }
        }
      }));
      props.onFatChange(amount, margin);
    },
  };

  const collapse = {
    icon: () => {
      return state.collapsed ? 'keyboard_arrow_right' : 'keyboard_arrow_down';
    },

    onClick: () => {
      setState(prevState => ({
        ...prevState,
        collapsed: !prevState.collapsed,
      }));
    },
  }

  const { meal } = state;
  return (
    <div className='mealz-meal-daily-plan-entry'>
      { !props.isTimeEditable &&
        <HourAndMinuteSettings
          hour={meal.startHour}
          minute={meal.startMinute}
          error={props.invalidTime}
        />
      }
      { props.isTimeEditable &&
        <HourAndMinuteSettings
          hour={meal.startHour}
          minute={meal.startMinute}
          error={props.invalidTime}
          editable={true}
          onChange={time.onChange}
        />
      }
      <div className='mealz-meal-daily-plan-entry-name'>
        { !state.isNameEditing &&
          <>
            <div
              className='mealz-meal-daily-plan-entry-name-label'
              onClick={name.onEdit}
            >
              { meal.mealName }
            </div>
          </>
        }
        { state.isNameEditing &&
          <Form.Control
            className='mealz-meal-daily-plan-entry-name-input'
            type='text'
            value={meal.mealName}
            onChange={(event) => name.onChange(event.target.value)}
            onBlur={name.onBlur}
            onKeyDown={ifEnterKey(name.onEnter)}
            autoFocus={true}
            isInvalid={state.invalidName}
          />
        }
      </div>
      { state.collapsed &&
        <MealDailyPlanEntrySummary
          calories={meal.goals.calories}
          caloriesPercent={props.caloriesPercent}
          carbs={meal.goals.carbs}
          carbsPercent={summary.macros().carbsPercent.toString()}
          protein={meal.goals.protein}
          proteinPercent={summary.macros().proteinPercent.toString()}
          fat={meal.goals.fat}
          fatPercent={summary.macros().fatPercent.toString()}
          onClick={() => patchState({ collapsed: false })}
        />
      }
      { !state.collapsed &&
        <>
          <AmountAndMarginSetting
            label={translate('calories')}
            labelClassName='mealz-color-calories'
            details={calories.details()}
            amount={meal.goals.calories}
            margin={meal.goals.caloriesMargin}
            onChange={calories.onChange}
          />
          <AmountAndMarginSetting
            label={translate('carbs')}
            labelClassName='mealz-color-carbs'
            details={carbs.details()}
            amount={meal.goals.carbs}
            margin={meal.goals.carbsMargin}
            onChange={carbs.onChange}
          />
          <AmountAndMarginSetting
            label={translate('protein')}
            labelClassName='mealz-color-protein'
            details={protein.details()}
            amount={meal.goals.protein}
            margin={meal.goals.proteinMargin}
            onChange={protein.onChange}
          />
          <AmountAndMarginSetting
            label={translate('fat')}
            labelClassName='mealz-color-fat'
            details={fat.details()}
            amount={meal.goals.fat}
            margin={meal.goals.fatMargin}
            onChange={fat.onChange}
          />
          <MealDailyPlanEntryActionBar
            onEdit={name.onEdit}
            onDelete={props.onDelete}
          />
        </>
      }
      <MaterialIcon
        className='mealz-meal-daily-plan-entry-collapse-icon'
        icon={collapse.icon()}
        onClick={collapse.onClick}
      />
    </div>
  );
}
