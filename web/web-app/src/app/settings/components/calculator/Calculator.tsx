import * as React from 'react';
import classNames from 'classnames';
import { truncateNumber } from '@mealz/backend-shared';
import { GWMacros } from '@mealz/backend-meals-log-gateway-api';
import { 
  Sex, 
  ActivityLevel, 
  Goal, 
  MifflinStJeor, 
  TotalDailyEnergyExpenditure,
  Macros,
} from '@mealz/backend-calculators';

import { useTranslations } from '../../../i18n';
import { parsePositiveInteger } from '../../../utils';
import { usePatchState } from '../../../hooks';
import { MacrosSummary, ModalMenu, ModalMenuItem } from '../../../components';
import { SettingsSection } from '../SettingsSection';
import { InputSetting } from '../InputSetting';
import { LabelSetting } from '../LabelSetting';
import { SettingsSeparator } from '../SettingsSeparator';
import { CalculatorTranslations } from './Calculator.translations';

const VALID_MIN_AGE = 16; 
const VALID_MAX_AGE = 110;

const VALID_MIN_HEIGHT = 130;
const VALID_MAX_HEIGHT = 230;

const VALID_MIN_WEIGHT = 40;
const VALID_MAX_WEIGHT = 250;

interface CalculatorState {
  sex: Sex | null;
  age: string;
  ageError?: boolean;
  height: string;
  heightError?: boolean;
  weight: string;
  weightError?: boolean;
  activityLevel: ActivityLevel | null;
  goal: Goal | null;
  showSexPicker: boolean;
  showActivityLevelPicker: boolean;
  showGoalPicker: boolean;
}

export function Calculator() {
  const translate = useTranslations(CalculatorTranslations);

  const [state, setState] = React.useState<CalculatorState>({
    sex: null,
    age: '',
    height: '',
    weight: '',
    activityLevel: null,
    goal: null,
    showSexPicker: false,
    showActivityLevelPicker: false,
    showGoalPicker: false,
  });
  const patchState = usePatchState(setState);

  const sex = {
    onClick: () => {
      patchState({ showSexPicker: true });
    },

    label: () => {
      if (state.sex === null) {
        return translate('sex-pick');
      }
      return state.sex === 'male'
        ? translate('male')
        : translate('female');
    },

    valueClassName: () => {
      if (state.sex === null) {
        return 'mealz-color-fg-dark';
      }
    },

    onMenuItemClick: (sex: Sex) => {
      patchState({
        sex,
        showSexPicker: false,
      });
    },

    getMenuItems: (): ModalMenuItem[] => {
      return [
        {
          key: Sex.Male,
          content: translate('male'),
          onClick: () => {
            sex.onMenuItemClick(Sex.Male);
          },
        },
        {
          key: Sex.Female,
          content: translate('female'),
          onClick: () => {
            sex.onMenuItemClick(Sex.Female);
          },
        },
      ];
    },
  };

  const age = {
    onChange: (value: string) => {
      patchState({
        age: value,
        ageError: age.hasError(value),
      });
    },

    onBlur: () => {
      patchState({
        ageError: age.hasError(state.age),
      });
    },

    hasError: (valueStr: string) => {
      const value = parsePositiveInteger(valueStr);
      if (isNaN(value)) {
        return true;
      }
      return value < VALID_MIN_AGE || value > VALID_MAX_AGE;
    },
  };

  const height = {
    onChange: (value: string) => {
      patchState({
        height: value,
        heightError: height.hasError(value),
      });
    },

    hasError: (valueStr: string) => {
      const value = parsePositiveInteger(valueStr);
      if (isNaN(value)) {
        return true;
      }
      return value < VALID_MIN_HEIGHT || value > VALID_MAX_HEIGHT;
    },
  };

  const weight = {
    onChange: (value: string) => {
      patchState({
        weight: value,
        weightError: weight.hasError(value),
      });
    },

    hasError: (valueStr: string) => {
      const value = parsePositiveInteger(valueStr);
      if (isNaN(value)) {
        return true;
      }
      return value < VALID_MIN_WEIGHT || value > VALID_MAX_WEIGHT;
    },
  };

  const activityLevel = {
    value: () => {
      if (state.activityLevel === null) {
        return translate('activity-level-value-not-picked');
      }
      return activityLevel.name(state.activityLevel);
    },

    valueClassName: () => {
      if (state.activityLevel === null) {
        return 'mealz-calculator-activity-level-value-not-picked';
      }
    },

    name: (activityLevel: ActivityLevel) => {
      const nameKey = `activity-level-${activityLevel.toLowerCase()}-name`;
      return translate(nameKey);
    },

    details: (activityLevel: ActivityLevel) => {
      const detailsKey = `activity-level-${activityLevel.toLowerCase()}-details`;
      return translate(detailsKey);
    },

    onClick: () => {
      patchState({ showActivityLevelPicker: true });
    },

    onMenuItemClick: (activityLevel: ActivityLevel) => {
      patchState({
        activityLevel,
        showActivityLevelPicker: false,
      });
    },

    menuItemContent: (level: ActivityLevel) => {
      return (
        <div className='mealz-calculator-activity-level-menu-item'>
          <div>{ activityLevel.name(level) }</div>
          <div className='mealz-calculator-activity-level-menu-item-details'>
            { activityLevel.details(level) }
          </div>
        </div>
      );
    }, 

    getMenuItems: (): ModalMenuItem[] => {
      const item = (level: ActivityLevel) => {
        return {
          key: level,
          content: activityLevel.menuItemContent(level),
          onClick: () => {
            activityLevel.onMenuItemClick(level);
          },
        };
      };
      return [
        item(ActivityLevel.Sedentary),
        item(ActivityLevel.LightlyActive),
        item(ActivityLevel.ModeratelyActive),
        item(ActivityLevel.VeryActive),
        item(ActivityLevel.SuperActive),
      ];
    },
  };

  const goal = {
    value: () => {
      if (state.goal === null) {
        return translate('goal-value-not-picked');
      }
      return goal.name(state.goal);
    },

    valueClassName: () => {
      if (state.goal === null) {
        return 'mealz-calculator-goal-value-not-picked';
      }
    },
    
    name: (goal: Goal) => {
      const nameKey = `goal-${goal.toLowerCase()}-name`;
      return translate(nameKey);
    },

    onClick: () => {
      patchState({ showGoalPicker: true });
    },

    onMenuItemClick: (goal: Goal) => {
      patchState({ goal, showGoalPicker: false });
    },

    menuItemContent: (goalItem: Goal) => {
      return (
        <div className='mealz-calculator-goal-menu-item'>
          <div>{ goal.name(goalItem) }</div>
        </div>
      );
    },

    getMenuItems: (): ModalMenuItem[] => {
      const item = (goalItem: Goal) => {
        return {
          key: goalItem,
          content: goal.menuItemContent(goalItem),
          onClick: () => {
            goal.onMenuItemClick(goalItem);
          },
        };
      };
      return [
        item(Goal.LoseWeight),
        item(Goal.StayFit),
        item(Goal.BuildBody),
      ];
    }
  }

  const calculator = {
    hasEmptyFields: () => {
      return (
        state.sex === null ||
        state.age === '' ||
        state.height === '' ||
        state.weight === '' ||
        state.activityLevel === null ||
        state.goal === null
      );
    },

    hasErrors: () => {
      return (
        state.ageError ||
        state.heightError ||
        state.weightError
      );
    },

    hasIssues: () => {
      return calculator.hasEmptyFields() || calculator.hasErrors();
    },

    issues: () => {
      if (calculator.hasEmptyFields() && calculator.hasErrors()) {
        return translate('summary-issues-errors-and-empty-fields');
      }
      if (calculator.hasEmptyFields()) {
        return translate('summary-issues-empty-fields');
      }
      if (calculator.hasErrors()) {
        return translate('summary-issues-errors');
      }
    },

    calculate: (): { bmr: number, macros: GWMacros } => {
      const bmr = MifflinStJeor.calculateBMR(
        state.sex,
        parseInt(state.age),
        parseInt(state.height),
        parseInt(state.weight),
      );
      const tdee = TotalDailyEnergyExpenditure.calculateTDEE(
        bmr,
        state.activityLevel,
      );
      const macros = Macros.calculate(
        tdee,
        state.goal,
      );
      return {
        bmr,
        macros: {
          calories: macros.calories,
          carbs: macros.carbsInGrams,
          protein: macros.proteinInGrams,
          fat: macros.fatInGrams,
        },
      };
    }
  }

  const activityLevelClassName = classNames(
    'mealz-calculator-activity-level-value',
    { 'mealz-color-fg-dark': state.activityLevel === null },
  );
  const goalClassName = classNames(
    'mealz-calculator-goal-value',
    { 'mealz-color-fg-dark': state.goal === null },
  );

  return (
    <>
      <SettingsSection
        title={translate('personal-and-body-data-title')}
      >
        <LabelSetting
          label={translate('sex-label')}
          value={sex.label()}
          valueClassName={sex.valueClassName()}
          onValueClick={sex.onClick}
        />
        <InputSetting
          type='number'
          label={translate('age-label')}
          labelSuffix={translate('age-label-suffix')}
          value={state.age}
          error={state.ageError}
          onChange={age.onChange}
          onBlur={age.onBlur}
        />
        <InputSetting
          type='number'
          label={translate('height-label')}
          labelSuffix={translate('height-label-suffix')}
          value={state.height}
          error={state.heightError}
          onChange={height.onChange}
        />
        <InputSetting
          type='number'
          label={translate('weight-label')}
          labelSuffix={translate('weight-label-suffix')}
          value={state.weight}
          error={state.weightError}
          onChange={weight.onChange}
        />
        <SettingsSeparator/>
      </SettingsSection>

      <SettingsSection
        title={translate('activity-level-title')}
      >
        <div
          className={activityLevelClassName}
          onClick={activityLevel.onClick}
        >
          { activityLevel.value() }
        </div>
        <SettingsSeparator/>
      </SettingsSection>

      <SettingsSection
        title={translate('goal-title')}
      >
        <div
          className={goalClassName}
          onClick={goal.onClick}
        >
          { goal.value() }
        </div>
        <SettingsSeparator/>
      </SettingsSection>

      <SettingsSection
        className='mealz-calculator-summary-section'
        title={translate('summary-title')}
      >
        { calculator.hasIssues() &&
          <div className='mealz-calculator-summary-issues'>
            { calculator.issues() }
          </div>
        }
        { !calculator.hasIssues() &&
          <>
            <div className='mealz-calculator-summary-bmr'>
              <span>{ translate('summary-bmr-info') }</span>
              <span className='mealz-calculator-summary-bmr-value'>
                { truncateNumber(calculator.calculate().bmr) }
              </span>
              <span className='mealz-calculator-summary-bmr-unit'>
                { translate('kcal') }
              </span>
            </div>
            <MacrosSummary
              macrosSummary={calculator.calculate().macros}
            />
          </>
        }
      </SettingsSection>

      { state.showSexPicker &&
        <ModalMenu
          show={state.showSexPicker}
          items={sex.getMenuItems()}
          onClose={() => {
            patchState({ showSexPicker: false });
          }}
        />
      }
      { state.showActivityLevelPicker &&
        <ModalMenu
          show={state.showActivityLevelPicker}
          items={activityLevel.getMenuItems()}
          onClose={() => {
            patchState({ showActivityLevelPicker: false });
          }}
        />
      }
      { state.showGoalPicker &&
        <ModalMenu
          show={state.showGoalPicker}
          items={goal.getMenuItems()}
          onClose={() => {
            patchState({ showGoalPicker: false });
          }}
        />
      }
    </>
    );
}