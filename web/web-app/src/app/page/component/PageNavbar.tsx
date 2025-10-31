import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTranslations } from '../../i18n';
import { usePatchState, useService } from '../../hooks';
import { MaterialIcon } from '../../components';
import { PathTo } from '../../routing';
import { AuthService } from '../../auth';
import { PageNavbarTranslations } from './PageNavbar.translations';
import { PageNavbarMenu, PageNavbarMenuItem } from './PageNavbarMenu';

interface PageNavbarState {
  menuHidden: boolean;
}

export function PageNavbar() {
  const [state, setState] = useState<PageNavbarState>({
    menuHidden: true,
  });
  const patchState = usePatchState(setState);  
  const translate = useTranslations(PageNavbarTranslations);
  const navigate = useNavigate();
  const authService = useService(AuthService);

  const onShowMenu = () => {
    patchState({ menuHidden: false });
  };
  const onHideMenu = () => {
    patchState({ menuHidden: true });
  };
  const onMenuItemClick = () => {
    patchState({ menuHidden: true });
  }

  const signOut = () => {
    authService.signOut()
      .then(() => {
        navigate(PathTo.signIn());
      })
      .catch(error => {
        // TODO Notify about the error.
      });
  };

  const menuItems: PageNavbarMenuItem[] = [
    {
      label: translate('chef'),
      onClick: () => {
        navigate(PathTo.chef());
      },
    },
    {
      label: translate('sign-out'),
      onClick: signOut,
    },
  ];

  return (
    <div className='mealz-navbar'>
      <div className='mealz-navbar-content'>
        <div className='mealz-navbar-left-side-content'>
          <div className='mealz-navbar-logo'>
            { translate('mealz') }
          </div>
        </div>
        <div className='mealz-navbar-right-side-content'>
          <MaterialIcon 
            icon='more_horiz'
            className='mealz-navbar-menu'
            onClick={onShowMenu}
          />
          <PageNavbarMenu
            hidden={state.menuHidden}
            items={menuItems}
            onItemClick={onMenuItemClick}
            onCancel={onHideMenu}
          />
        </div>
      </div>
    </div>
  );
}