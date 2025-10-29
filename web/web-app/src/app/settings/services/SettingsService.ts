import { Service } from '@andcreations/common';

@Service()
export class SettingsService {
  public getIngredientsSecondaryLanguage(): string | undefined {
    // TODO Make it configurable.
    return 'pl';
  }

  public showSecondaryLanguage(): boolean {
    // TODO Make it configurable.
    return false;
  }
}