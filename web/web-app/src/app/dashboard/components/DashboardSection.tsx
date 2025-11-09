import * as React from 'react';

export interface DashboardSectionProps {
}

export function DashboardSection(
  props: React.PropsWithChildren<DashboardSectionProps>
) {
  return (
    <div className='mealz-dashboard-section'>
      { props.children }
    </div>
  );
}