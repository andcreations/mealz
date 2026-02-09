import { Injectable } from '@nestjs/common';
import { requireStrEnv } from '@mealz/backend-common';
import { AccessForbiddenError } from '@mealz/backend-gateway-common';

@Injectable()
export class MetricsAuthService {
  private readonly metricsAuthToken: string;

  public constructor() {
    this.metricsAuthToken = requireStrEnv('MEALZ_METRICS_AUTH_TOKEN');
  }

  public isAuthorizedByToken(metricsAuthToken: string): boolean {
    return metricsAuthToken === this.metricsAuthToken;
  }
}