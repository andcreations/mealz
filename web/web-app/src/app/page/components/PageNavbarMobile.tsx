import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { MaterialIcon } from '../../components';
import { PathTo } from '../../routing';
import { useService } from '../../hooks';
import { AuthService } from '../../auth';

export function PageNavbarMobile() {
  const authService = useService(AuthService);
  const navigate = useNavigate();

  const onSignOut = () => {
    authService.signOutOrLogError();
    navigate(PathTo.signIn());
  };

  return (
    <div className='mealz-navbar-mobile-container'>
      <div className='mealz-navbar-mobile'>
          <MaterialIcon 
            icon='home'
            className='mealz-navbar-mobile-item'
            onClick={() => navigate(PathTo.dashboard())}
          />      
          <MaterialIcon 
            icon='lunch_dining'
            className='mealz-navbar-mobile-item'
            onClick={() => navigate(PathTo.chef())}
          />      
          <MaterialIcon 
            icon='settings'
            className='mealz-navbar-mobile-item'
            onClick={() => navigate(PathTo.settings())}
          />      
      </div>
    </div>
  );
}