import * as React from 'react';
import { useState } from 'react';
import classNames from 'classnames';
import { truncateNumber } from '@mealz/backend-shared';
import { GWMacros } from '@mealz/backend-meals-log-gateway-api';
import { 
  GWMealDailyPlanGoals,
} from '@mealz/backend-meals-daily-plan-gateway-api';

import { usePatchState, useService } from '../../../hooks';
import { useTranslations } from '../../../i18n';
import { SystemService } from '../../../system';
import { 
  htmlToReact,
  MacrosSummary,
  MacrosSummaryDetails,
  MaterialIcon,
} from '../../../components';
import { PathTo } from '../../../routing';
import { macrosToSummaryDetails } from '../../../utils';
import {
  MealDailyPlanSummaryTranslations,
} from './MealDailyPlanSummary.translations';

export interface MealDailyPlanSummaryProps {
  macrosSummary?: GWMacros;
  goals?: GWMacros;
  error?: boolean;
  forNotification?: boolean;
}

interface MealDailyPlanSummaryState {
  isOpen: boolean;
}

export function MealDailyPlanSummary(props: MealDailyPlanSummaryProps) {
  const translate = useTranslations(MealDailyPlanSummaryTranslations);
  const systemService = useService(SystemService);
  const isMobile = systemService.isMobile();

  const [state, setState] = useState<MealDailyPlanSummaryState>({
    isOpen: true,
  });
  const patchState = usePatchState(setState);

  const summaryClassName = classNames(
    'mealz-meal-daily-plan-summary',
    {
      'mealz-meal-daily-plan-summary-mobile': isMobile,
      'mealz-meal-daily-plan-summary-desktop': !isMobile,
      'mealz-meal-daily-plan-summary-for-notification': props.forNotification,
    }
  );

  const topBar = {
    icon: () => {
      return state.isOpen ? 'keyboard_arrow_down' : 'keyboard_arrow_right';
    },

    onClick: () => {
      patchState({
        isOpen: !state.isOpen,
      });
    },
  }

  const goals = {
    has: () => {
      return props.goals !== undefined;
    },

    forSummary: (): GWMealDailyPlanGoals | undefined => {
      if (!goals.has()) {
        return undefined;
      }
      return {
        caloriesFrom: props.goals.calories,
        caloriesTo: props.goals.calories,
        proteinFrom: props.goals.protein,
        proteinTo: props.goals.protein,
        carbsFrom: props.goals.carbs,
        carbsTo: props.goals.carbs,
        fatFrom: props.goals.fat,
        fatTo: props.goals.fat,
      };
    },
  }

  const details = {
    forSummary: (): MacrosSummaryDetails => {
      if (!goals.has()) {
        return {};
      }

      const caloriesDiff =
        truncateNumber(props.goals.calories) -
        truncateNumber(props.macrosSummary.calories);
      let calories: string | undefined;
      if (Math.abs(caloriesDiff) > 0) {
        calories = '';
        if (caloriesDiff > 0) {
          calories += `+`;
        }
        calories += `${caloriesDiff} kcal`;
      }

      return {
        calories,
        ...macrosToSummaryDetails(
          {
            carbs: props.goals.carbs,
            protein: props.goals.protein,
            fat: props.goals.fat,
          }
        ),
      };
    }
  }

  return (
    <div className={summaryClassName}>
      <div
        className='mealz-meal-daily-plan-summary-top-bar'
        onClick={topBar.onClick}
      >
        <div>{ translate('title') }</div>
        <MaterialIcon
          className='mealz-meal-daily-plan-summary-top-bar-icon'
          icon={topBar.icon()}
        />
      </div>
      { (state.isOpen && !props.error) &&
        <>
          <div className='mealz-meal-daily-plan-summary-content'>
            <MacrosSummary
              macrosSummary={props.macrosSummary}
              goals={goals.forSummary()}
              details={details.forSummary()}
            />
          </div>
          { !goals.has() &&
            <div className='mealz-meal-daily-plan-summary-no-goals'>
              { htmlToReact(
                  translate(
                    'no-goals',
                    PathTo.href(PathTo.calculatorSettings())
                  )
                )
              }
            </div>
          }
        </>
      }
      { (state.isOpen && props.error) &&
        <div className='mealz-meal-daily-plan-summary-error'>
          { translate('fix-errors') }
        </div>
      }
    </div>
  );
}