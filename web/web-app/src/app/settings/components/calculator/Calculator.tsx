import * as React from 'react';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import { truncateNumber } from '@mealz/backend-shared';
import { 
  Sex, 
  ActivityLevel, 
  Goal, 
} from '@mealz/backend-calculators';

import { Log } from '../../../log';
import { LoadStatus } from '../../../common';
import { useTranslations } from '../../../i18n';
import { parsePositiveInteger } from '../../../utils';
import { usePatchState, useService } from '../../../hooks';
import { 
  FullScreenLoader,
  LoaderByStatus, 
  LoaderSize, 
  LoaderType, 
  MacrosSummary, 
  ModalMenu, 
  ModalMenuItem,
} from '../../../components';
import { 
  CalculatorSettings, 
  CalculatorSettingsService,
  CalculatorService,
  CalculatorResult,
} from '../../../calculator';
import { NotificationsService } from '../../../notifications';
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

export interface CalculatorProps {
  onDirtyChanged: (isDirty: boolean) => void;
}

interface CalculatorState {
  loadStatus: LoadStatus;
  isDirty: boolean;
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
  saving: boolean;
}

export function Calculator(props: CalculatorProps) {
  const translate = useTranslations(CalculatorTranslations);
  const notificationsService = useService(NotificationsService);
  const calculatorService = useService(CalculatorService);
  const calculatorSettingsService = useService(CalculatorSettingsService);

  const [state, setState] = React.useState<CalculatorState>({
    loadStatus: LoadStatus.Loading,
    isDirty: false,
    sex: null,
    age: '',
    height: '',
    weight: '',
    activityLevel: null,
    goal: null,
    showSexPicker: false,
    showActivityLevelPicker: false,
    showGoalPicker: false,
    saving: false,
  });
  const patchState = usePatchState(setState);

  // initial read
  useEffect(
    () => {
      Log.logAndRethrow(
        () => calculatorSettingsService.read(),
        'Failed to read calculator settings',
      ).then(settings => {
        if (!settings) {
          patchState({ loadStatus: LoadStatus.Loaded });
          return;
        }
        patchState({
          loadStatus: LoadStatus.Loaded,
          sex: settings.sex,
          age: settings.age.toString(),
          height: settings.height.toString(),
          weight: settings.weight.toString(),
          activityLevel: settings.activityLevel,
          goal: settings.goal,
        });
      })
      .catch(error => {
        Log.error('Failed to read calculator settings', error);
        patchState({
          loadStatus: LoadStatus.FailedToLoad,
        });
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
        isDirty: true,
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
        isDirty: true,
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
        isDirty: true,
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
        isDirty: true,
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
        isDirty: true,
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
      patchState({
        isDirty: true,
        goal,
        showGoalPicker: false,
      });
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

    calculate: (): CalculatorResult => {
      return calculatorService.calculate({
        sex: state.sex,
        age: parseInt(state.age),
        height: parseInt(state.height),
        weight: parseInt(state.weight),
        activityLevel: state.activityLevel,
        goal: state.goal,
      });
    },

    saveEnabled: () => {
      return !state.saving && !calculator.hasIssues() && state.isDirty;
    },

    save: () => {
      const settings: CalculatorSettings = {
        sex: state.sex,
        age: parseInt(state.age),
        height: parseInt(state.height),
        weight: parseInt(state.weight),
        activityLevel: state.activityLevel,
        goal: state.goal,
      }
      Log.logAndRethrow(
        () => calculatorSettingsService.upsert(
          undefined,
          settings,
        ),
        'Failed to save calculator settings',
      )
      .then(() => {
        notificationsService.info(translate('saved'));
        patchState({
          isDirty: false,
          saving: false,
        });
      })
      .catch(error => {
        Log.error('Failed to save calculator settings', error);
        notificationsService.error(translate('failed-to-save'));
        patchState({ saving: false });
      });
    },
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
      <LoaderByStatus
        loadStatus={state.loadStatus}
        size={LoaderSize.Small}
        type={loader.type()}
        subTitle={loader.subTitle()}
      />
      { state.saving &&
        <FullScreenLoader title={translate('taking-longer')}/>
      } 
      { state.loadStatus === LoadStatus.Loaded &&
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

        <SettingsSection title={translate('summary-title')}>
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
          <SettingsSeparator/>
        </SettingsSection>

        <div className='mealz-calculator-save-container'>
          <div className='mealz-calculator-save-label'>
            { translate('save-label') }
          </div>
          <Button
            size='sm'
            disabled={!calculator.saveEnabled()}
            onClick={() => calculator.save()}
          >
            { translate('save') }
          </Button>
        </div>

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
      }
    </>
  );
}