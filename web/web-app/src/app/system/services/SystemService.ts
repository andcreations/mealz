import { OnBootstrap, Service } from '@andcreations/common';

import { logInfoEvent } from '../../event-log';
import { eventType } from '../event-log';

@Service()
export class SystemService implements OnBootstrap {
  public async onBootstrap(): Promise<void> {
    logInfoEvent(eventType('time-zone'), {
      timeZone: this.getTimeZone(),
    });
  }

  public getTimeZone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  public isMobile(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUserAgent =
      /android|iphone|ipad|ipod|windows phone/i.test(userAgent);

    const isTouchDevice = (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
    const isSmallScreen = window.innerWidth < 768;
  
    return isMobileUserAgent || (isTouchDevice && isSmallScreen);
  }
}