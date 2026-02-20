import * as React from 'react';
import classNames from 'classnames';

export interface SettingsSectionProps {
  className?: string;
  title?: string;
}

export function SettingsSection(
  props: React.PropsWithChildren<SettingsSectionProps>
) {
  const sectionClassNames = classNames([
    'mealz-settings-section',
    props.className,
  ]);
  return (
    <div className={sectionClassNames}>
      { props.title &&
        <h3 className='mealz-settings-section-title'>
          { props.title }
        </h3>
      }
      { props.children }
    </div>
  );
}