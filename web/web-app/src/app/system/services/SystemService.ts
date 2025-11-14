import { OnBootstrap, Service } from '@andcreations/common';
import { Log } from '../../log';

@Service()
export class SystemService implements OnBootstrap {
  public async onBootstrap(): Promise<void> {
    Log.info(`Time zone is ${this.getTimeZone()}`);
  }

  public getTimeZone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}