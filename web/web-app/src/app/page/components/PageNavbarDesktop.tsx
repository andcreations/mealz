import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTranslations } from '../../i18n';
import { usePatchState, useService } from '../../hooks';
import { PathTo } from '../../routing';
import { AuthService } from '../../auth';
import { MaterialIcon } from '../../components';
import { PageNavbarMenu, PageNavbarMenuItem } from './PageNavbarMenu';
import {
  PageNavbarDesktopTranslations,
} from './PageNavbarDesktop.translations';

interface PageNavbarDesktopState {
  menuHidden: boolean;
}

export function PageNavbarDesktop() {
  const authService = useService(AuthService);

  const [state, setState] = useState<PageNavbarDesktopState>({
    menuHidden: true,
  });
  const patchState = usePatchState(setState);  
  const translate = useTranslations(PageNavbarDesktopTranslations);
  const navigate = useNavigate();

  const onShowMenu = () => {
    patchState({ menuHidden: false });
  };
  const onHideMenu = () => {
    patchState({ menuHidden: true });
  };
  const onMenuItemClick = () => {
    patchState({ menuHidden: true });
  }

  const menuItems: PageNavbarMenuItem[] = [
    {
      label: translate('dashboard'),
      onClick: () => {
        navigate(PathTo.dashboard());
      },
    },
    {
      label: translate('chef'),
      onClick: () => {
        navigate(PathTo.chef());
      },
    },
    {
      label: translate('settings'),
      onClick: () => {
        navigate(PathTo.settings());
      },
    },
  ];

  return (
    <div className='mealz-navbar-desktop-container'>
      <div className='mealz-navbar-desktop'>
        <div className='mealz-navbar-desktop-left-side-content'>
          <div className='mealz-navbar-desktop-logo'>
            { translate('mealz') }
          </div>
        </div>
        <div className='mealz-navbar-desktop-right-side-content'>
          <MaterialIcon 
            icon='more_horiz'
            className='mealz-navbar-desktop-menu'
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