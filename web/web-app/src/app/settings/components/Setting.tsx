import * as React from 'react';

export interface SettingProps {
  label: string;
  labelSuffix?: string;
  details?: string;
}

export function Setting(
  props: React.PropsWithChildren<SettingProps>,
) {
  return (
    <div className='mealz-setting'>
      <div className='mealz-setting-label-and-value'>
        <div className='mealz-setting-label'>
          { props.label }
          { !!props.labelSuffix &&
            <span className='mealz-setting-label-suffix'>
              { props.labelSuffix }
            </span>
          }
        </div>
        <div className='mealz-setting-value'>
          { props.children }
        </div>
      </div>
      { props.details &&
        <div className='mealz-setting-info-details'>
          { props.details }
        </div>}
    </div>
  );
}