import { Injectable } from '@nestjs/common';

import { MetricDef } from '../types';
import { incMetric, registerMetric } from '../metrics';

@Injectable()
export class MetricsService {
  public registerMetric(metric: MetricDef): void {
    registerMetric(metric);
  }

  public incMetric(
    name: string,
    tags: Record<string, string>,
    value: number,
  ): void {
    incMetric(name, tags, value);
  }
}