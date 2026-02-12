import * as React from 'react';

import { Notifications } from '../../notifications';
import { PageNavbar } from './PageNavbar';
import { PageHeader } from './PageHeader';

export interface PageWrapperProps {
  title?: string;
  onGoBack?: () => void;
}

export function PageWrapper(props: React.PropsWithChildren<PageWrapperProps>) {
  return (
    <div className='mealz-page-wrapper'>
      <PageNavbar/>
      <Notifications/>
      <div className='mealz-page-wrapper-content'>
        { !!props.title &&
          <PageHeader
            title={props.title}
            onGoBack={props.onGoBack}
          />
        }
        {props.children}
      </div>
    </div>
  );
}