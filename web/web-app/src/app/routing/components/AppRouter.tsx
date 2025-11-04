import * as React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import { NotFoundPage } from '../../404';
import { SignInPage } from '../../auth';
import { DashboardPage } from '../../dashboard';
import { ChefPage } from '../../chef';
import { Private } from './Private';

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Private><DashboardPage/></Private>}/>
        <Route path='/sign-in' element={<SignInPage/>}/>
        <Route path='/chef' element={<Private><ChefPage/></Private>}/>
        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </HashRouter>
  );
}