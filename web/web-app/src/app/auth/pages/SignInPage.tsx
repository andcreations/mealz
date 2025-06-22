import * as React from 'react';

import { FullScreen, MealzLogo } from '../../components';
import { SignInForm } from '../components';

export function SignInPage() {
  return (
    <FullScreen
      className='mealz-sign-in-page'
      center
    >
      <div className='mealz-sign-in-page-wrapper'>
        <MealzLogo className='mealz-sign-in-page-logo'/>
        <SignInForm/>
      </div>
    </FullScreen>
  );
}