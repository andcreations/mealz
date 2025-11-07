import * as React from 'react';

export interface PageHeaderProps {
  title: string;
}

export function PageHeader(props: PageHeaderProps) {
  return (
    <div className='mealz-page-header'>
      <div className='mealz-page-header-title'>
        { props.title }
      </div>
    </div>
  );
}