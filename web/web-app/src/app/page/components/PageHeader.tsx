import * as React from 'react';
import { MaterialIcon } from '../../components';

export interface PageHeaderProps {
  title: string;
  onGoBack?: () => void;
}

export function PageHeader(props: PageHeaderProps) {
  return (
    <div className='mealz-page-header'>
      <div className='mealz-page-header-title'>
        { props.title }
        { !!props.onGoBack &&
          <MaterialIcon
            className='mealz-page-header-back-button'
            icon='arrow_back_ios'
            onClick={props.onGoBack}
          />
        }
      </div>
    </div>
  );
}