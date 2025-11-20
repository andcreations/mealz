import * as React from 'react';

import { useService } from '../../hooks';
import { SystemService } from '../../system';
import { PageNavbarMobile } from './PageNavbarMobile';
import { PageNavbarDesktop } from './PageNavbarDesktop';

export function PageNavbar() {
  const systemService = useService(SystemService);
  const isMobile = systemService.isMobile();

  return (
    <div className='mealz-navbar'>
      { isMobile ? <PageNavbarMobile/> : <PageNavbarDesktop/> }
    </div>
  );
}