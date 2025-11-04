import * as React from 'react';

import { Notifications } from '../../notifications';
import { PageNavbar } from './PageNavbar';

export interface PageWrapperProps {
}

export function PageWrapper(props: React.PropsWithChildren<PageWrapperProps>) {
  return (
    <div className='mealz-page-wrapper'>
      <Notifications/>
      <PageNavbar/>
      <div className='mealz-page-wrapper-content'>
        {props.children}
      </div>
    </div>
  );
}