import * as React from 'react';

export interface DashboardSectionTitleProps {
  title: string;
}

export function DashboardSectionTitle(
  props: DashboardSectionTitleProps
) {
  return (
    <div className='mealz-dashboard-section-title'>
      { props.title }
    </div>
  );
}