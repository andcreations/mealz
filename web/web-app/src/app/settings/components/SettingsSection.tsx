import * as React from 'react';

export interface SettingsSectionProps {
  title?: string;
}

export function SettingsSection(
  props: React.PropsWithChildren<SettingsSectionProps>
) {
  return (
    <div className='mealz-settings-section'>
      { props.children }
    </div>
  );
}