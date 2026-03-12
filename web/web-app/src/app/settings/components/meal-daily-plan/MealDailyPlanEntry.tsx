import * as React from 'react';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { truncateNumber } from '@mealz/backend-shared';

import { ifEnterKey, parsePositiveInteger } from '../../../utils';
import { usePatchState } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { MealEntry } from '../../types';
import { MaterialIcon } from '../../../components';
import { HourAndMinuteSettings } from './HourAndMinuteSettings';
import { AmountAndMarginSetting } from './AmountAndMarginSetting';
import { MealDailyPlanEntryActionBar } from './MealDailyPlanEntryActionBar';
import { MealDailyPlanEntrySummary } from './MealDailyPlanEntrySummary';
import {
  MealDailyPlanEntryTranslations,
} from './MealDailyPlanEntry.translations';

export interface MealDailyPlanEntryProps {
  meal: Omit<MealEntry<string>, 'id' | 'hasErrors'>;
  caloriesPercent?: number; // of all the meals
  isTimeEditable: boolean;
  invalidTime: boolean;
  invalidName: boolean;
  invalidCaloriesAmount: boolean;
  invalidCaloriesMargin: boolean;
  invalidCarbsAmount: boolean;
  invalidCarbsMargin: boolean;
  invalidProteinAmount: boolean;
  invalidProteinMargin: boolean;
  invalidFatAmount: boolean;
  invalidFatMargin: boolean;
  caloriesError?: string;
  carbsError?: string;
  proteinError?: string;
  fatError?: string;
  collapsed: boolean;
  autoCalculateMacrosEnabled: boolean;
  onChangeName: (name: string) => void;
  onChangeTime: (hour: number, minute: number) => void;
  onCaloriesAmountChange: (amount: string) => void;
  onCaloriesMarginChange: (margin: string) => void;
  onCarbsAmountChange: (amount: string) => void;
  onCarbsMarginChange: (margin: string) => void;
  onProteinAmountChange: (amount: string) => void;
  onProteinMarginChange: (margin: string) => void;
  onFatAmountChange: (amount: string) => void;
  onFatMarginChange: (margin: string) => void;
  onAutoCalculate: () => void;
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
  isNameEditing: boolean;
  collapsed: boolean;
}

export function MealDailyPlanEntry(props: MealDailyPlanEntryProps) {
  const translate = useTranslations(MealDailyPlanEntryTranslations);

  const [state, setState] = useState<MealDailyPlanEntryState>({
    isNameEditing: false,
    collapsed: props.collapsed,
  });
  const patchState = usePatchState(setState);

  const hasInvalidAmount = () => {
    return (
      props.invalidCaloriesAmount ||
      props.invalidCarbsAmount ||
      props.invalidProteinAmount ||
      props.invalidFatAmount
    );
  }

  const time = {
    onChange: (hour: number, minute: number) => {
      props.onChangeTime(hour, minute);
    },
  };

  const name = {
    onEdit: () => {
      patchState({ isNameEditing: true });
    },

    onChange: (value: string) => {
      props.onChangeName(value);
    },

    stopEditing: () => {
      if (props.invalidName) {
        return;
      }
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
      if (hasInvalidAmount()) {
        return;
      }
      const goals = props.meal.goals;

      // convert to numbers
      const carbs = parsePositiveInteger(goals.carbs);
      const protein = parsePositiveInteger(goals.protein);
      const fat = parsePositiveInteger(goals.fat);
      
      // calculate the percentages
      const total = carbs + protein + fat;
      const carbsPercent = truncateNumber(carbs / total * 100);
      const proteinPercent = truncateNumber(protein / total * 100);

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
      if (!props.caloriesPercent) {
        return '-';
      }
      return `kcal (${props.caloriesPercent.toString()}%)`;
    },

    summaryDetails: () => {
      if (!props.caloriesPercent) {
        return '-';
      }
      return `${props.caloriesPercent.toString()}%`;
    },

    onAmountChange: (amount: string) => {
      props.onCaloriesAmountChange(amount);
    },

    onMarginChange: (margin: string) => {
      props.onCaloriesMarginChange(margin);
    },
  };

  const carbs = {
    details: () => {
      const macros = summary.macros();
      if (!macros) {
        return '-';
      }
      const carbsPercent = macros.carbsPercent;
      return `g (${carbsPercent}%)`;
    },

    summaryDetails: () => {
      const carbsPercent = summary.macros().carbsPercent;
      return `${carbsPercent.toString()}%`;
    },

    onAmountChange: (amount: string) => {
      props.onCarbsAmountChange(amount);
    },

    onMarginChange: (margin: string) => {
      props.onCarbsMarginChange(margin);
    },
  };

  const protein = {
    details: () => {
      const macros = summary.macros();
      if (!macros) {
        return '-';
      }
      const proteinPercent = macros.proteinPercent;
      return `g (${proteinPercent}%)`;
    },

    summaryDetails: () => {
      const proteinPercent = summary.macros().proteinPercent;
      return `${proteinPercent.toString()}%`;
    },

    onAmountChange: (amount: string) => {
      props.onProteinAmountChange(amount);
    },

    onMarginChange: (margin: string) => {
      props.onProteinMarginChange(margin);
    },


  };

  const fat = {
    details: () => {
      const macros = summary.macros();
      if (!macros) {
        return '-';
      }
      const fatPercent = macros.fatPercent;
      return `g (${fatPercent}%)`;
    },

    summaryDetails: () => {
      const fatPercent = summary.macros().fatPercent;
      return `${fatPercent.toString()}%`;
    },

    onAmountChange: (amount: string) => {
      props.onFatAmountChange(amount);
    },

    onMarginChange: (margin: string) => {
      props.onFatMarginChange(margin);
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

  const { meal } = props;
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
            value={props.meal.mealName}
            onChange={(event) => name.onChange(event.target.value)}
            onBlur={name.onBlur}
            onKeyDown={ifEnterKey(name.onEnter)}
            autoFocus={true}
            isInvalid={props.invalidName}
          />
        }
      </div>
      { (state.collapsed && !hasInvalidAmount()) &&
        <MealDailyPlanEntrySummary
          calories={parsePositiveInteger(meal.goals.calories)}
          caloriesDetails={calories.summaryDetails()}
          carbs={parsePositiveInteger(meal.goals.carbs)}
          carbsDetails={carbs.summaryDetails()}
          protein={parsePositiveInteger(meal.goals.protein)}
          proteinDetails={protein.summaryDetails()}
          fat={parsePositiveInteger(meal.goals.fat)}
          fatDetails={fat.summaryDetails()}
          onClick={() => patchState({ collapsed: false })}
        />
      }
      { (state.collapsed && hasInvalidAmount()) &&
        <div className='mealz-meal-daily-plan-entry-summary-error'>
          { translate('fix-errors') }
        </div>
      }
      { !state.collapsed &&
        <>
          <AmountAndMarginSetting
            label={translate('calories')}
            labelClassName='mealz-color-calories'
            details={calories.details()}
            amount={meal.goals.calories}
            invalidAmount={props.invalidCaloriesAmount}
            margin={meal.goals.caloriesMargin}
            invalidMargin={props.invalidCaloriesMargin}
            error={props.caloriesError}
            onAmountChange={calories.onAmountChange}
            onMarginChange={calories.onMarginChange}
          />
          <AmountAndMarginSetting
            label={translate('carbs')}
            labelClassName='mealz-color-carbs'
            details={carbs.details()}
            amount={meal.goals.carbs}
            invalidAmount={props.invalidCarbsAmount}
            margin={meal.goals.carbsMargin}
            invalidMargin={props.invalidCarbsMargin}
            error={props.carbsError}
            onAmountChange={carbs.onAmountChange}
            onMarginChange={carbs.onMarginChange}
          />
          <AmountAndMarginSetting
            label={translate('protein')}
            labelClassName='mealz-color-protein'
            details={protein.details()}
            amount={meal.goals.protein}
            invalidAmount={props.invalidProteinAmount}
            margin={meal.goals.proteinMargin}
            invalidMargin={props.invalidProteinMargin}
            error={props.proteinError}
            onAmountChange={protein.onAmountChange}
            onMarginChange={protein.onMarginChange}
          />
          <AmountAndMarginSetting
            label={translate('fat')}
            labelClassName='mealz-color-fat'
            details={fat.details()}
            amount={meal.goals.fat}
            invalidAmount={props.invalidFatAmount}
            margin={meal.goals.fatMargin}
            invalidMargin={props.invalidFatMargin}
            error={props.fatError}
            onAmountChange={fat.onAmountChange}
            onMarginChange={fat.onMarginChange}
          />
          <MealDailyPlanEntryActionBar
            autoCalculateMacrosEnabled={props.autoCalculateMacrosEnabled}
            onEdit={name.onEdit}
            onAutoCalculate={props.onAutoCalculate}
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
