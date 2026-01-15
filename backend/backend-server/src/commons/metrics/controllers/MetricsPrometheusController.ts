import { Controller, Get, Header, Req } from '@nestjs/common';
import { getHeaderFromRequest } from '@mealz/backend-gateway-common';

import { METRICS_API_URL } from '../consts';
import { MetricsAuthService, PrometheusMetricsService } from '../services';

const AUTH_TOKEN_HEADER = 'x-mealz-metrics-auth-token';

@Controller(METRICS_API_URL)
export class MetricsPrometheusController {
  public constructor(
    private readonly metricsAuthService: MetricsAuthService,
    private readonly prometheusMetricsService: PrometheusMetricsService,
  ) {}

  @Get()
  @Header('Content-Type', 'text/plain; charset=utf-8')
  public async getPrometheusMetrics(
    @Req() request: any,
  ): Promise<string> {
    const token = getHeaderFromRequest(request, AUTH_TOKEN_HEADER);
    this.metricsAuthService.authorizeByToken(token);
    return this.prometheusMetricsService.getPrometheusMetrics();
  }
}