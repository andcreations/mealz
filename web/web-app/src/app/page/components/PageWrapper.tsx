import * as React from 'react';

import { Notifications } from '../../notifications';
import { PageNavbar } from './PageNavbar';
import { PageHeader } from './PageHeader';

export interface PageWrapperProps {
  title?: string;
}

export function PageWrapper(props: React.PropsWithChildren<PageWrapperProps>) {
  return (
    <div className='mealz-page-wrapper'>
      <Notifications/>
      <PageNavbar/>
      <div className='mealz-page-wrapper-content'>
        { !!props.title &&
          <PageHeader title={props.title}/>
        }
        {props.children}
      </div>
    </div>
  );
}