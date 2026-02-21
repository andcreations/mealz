import * as React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import { NotFoundPage } from '../../404/pages';
import { SignInPage } from '../../auth/pages';
import { DashboardPage } from '../../dashboard/pages';
import { ChefPage } from '../../chef/pages';
import { 
  SettingsPage,
  HydrationDailyPlanPage,
  DailyMealPlanPage,
  TelegramSettingsPage,
  CalculatorPage,
} from '../../settings/pages';
import { Private } from './Private';
import { ScrollToTop } from './ScrollToTop';

export function AppRouter() {
  return (
    <HashRouter>
      <ScrollToTop/>
      <Routes>
        <Route path='/' element={<Private><DashboardPage/></Private>}/>
        <Route path='/sign-in' element={<SignInPage/>}/>
        <Route path='/chef' element={<Private><ChefPage/></Private>}/>
        <Route path='/settings' element={<Private><SettingsPage/></Private>}/>
        <Route
          path='/settings/hydration-plan'
          element={<Private><HydrationDailyPlanPage/></Private>}
        />
        <Route
          path='/settings/daily-meal-plan'
          element={<Private><DailyMealPlanPage/></Private>}
        />
        <Route
          path='/settings/telegram'
          element={<Private><TelegramSettingsPage/></Private>}
        />
        <Route
          path='/settings/calculator'
          element={<Private><CalculatorPage/></Private>}
        />
        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </HashRouter>
  );
}