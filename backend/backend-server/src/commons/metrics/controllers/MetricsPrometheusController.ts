import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { v7 } from 'uuid';
import { Context } from '@mealz/backend-core';
import { getHeaderFromRequest } from '@mealz/backend-gateway-common';
import { Logger } from '@mealz/backend-logger';

import { METRICS_API_URL } from '../consts';
import { MetricsAuthService, PrometheusMetricsService } from '../services';

const AUTH_TOKEN_HEADER = 'x-mealz-metrics-auth-token';

@Controller(METRICS_API_URL)
export class MetricsPrometheusController {
  public constructor(
    private readonly logger: Logger,
    private readonly metricsAuthService: MetricsAuthService,
    private readonly prometheusMetricsService: PrometheusMetricsService,
  ) {}

  @Get()
  public async getPrometheusMetrics(
    @Req() request: any,
    @Res() response: Response,
  ): Promise<string> {
    // we can't use GWContext here due to package circular dependency
    const context: Context = {
      correlationId: v7(),
    };

    try {
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      const token = getHeaderFromRequest(request, AUTH_TOKEN_HEADER);
      if (!this.metricsAuthService.isAuthorizedByToken(token)) {
        response
          .status(HttpStatus.FORBIDDEN)
          .send('Forbidden');
        return;
      }
      const metrics = await this.prometheusMetricsService.getPrometheusMetrics();
      response
        .status(HttpStatus.OK)
        .send(metrics);
    } catch (error) {
      this.logger.error('Error getting Prometheus metrics', context, error);
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal server error');
      return;
    }
  }
}