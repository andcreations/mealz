import { Service } from '@andcreations/common';

import { CALCULATOR_SETTINGS_PROPERTY_ID } from '../consts';
import { CalculatorSettings } from '../types';
import { UserPropertiesService } from '../../user';

@Service()
export class CalculatorSettingsService {
  public constructor(
    private readonly userPropertiesService: UserPropertiesService,
  ) {}

  public async read(): Promise<CalculatorSettings | undefined> {
    const userProperties = await this.userPropertiesService.readByPropertyId(
      CALCULATOR_SETTINGS_PROPERTY_ID,
    );
    return userProperties?.data as CalculatorSettings;
  }

  public async upsert(
    id: string | undefined,
    settings: CalculatorSettings,
  ): Promise<void> {
    await this.userPropertiesService.upsertByPropertyId(
      id,
      CALCULATOR_SETTINGS_PROPERTY_ID,
      settings,
    );
  }
}