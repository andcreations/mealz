import { OnBootstrap, Service } from '@andcreations/common';
import { LocationService } from '@andcreations/web-common';

import { PathTo } from '../path';

@Service()
export class RoutingService implements OnBootstrap {
  constructor(private readonly locationService: LocationService) {
  }

  async onBootstrap(): Promise<void> {
    const hash = this.locationService.getHash();
    if (!hash.startsWith('#/') || hash === '#/') {
      this.locationService.setHash(`#${PathTo.home()}`);
      return;
    }
  }

  getHash(): string {
    const hash = this.locationService.getHash();
    if (hash.startsWith('#')) {
      return hash.substring(1);
    }
    return '/';
  }
}