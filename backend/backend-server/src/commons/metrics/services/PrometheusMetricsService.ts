import { Injectable } from '@nestjs/common';
import { getSingleValueMetrics, resetMetrics } from '../metrics';

@Injectable()
export class PrometheusMetricsService {
  public async getPrometheusMetrics(): Promise<string> {
    let str = '';

    const writeTags = (tags: Record<string, string>) => {
      if (Object.keys(tags).length === 0) {
        return '';
      }

      const tagsStr = Object.entries(tags)
        .map(([key, value]) => `${key}="${value}"`)
        .join(',');
      return `{${tagsStr}}`;
    };

    // single-value metrics
    const singleValueMetrics = getSingleValueMetrics();
    singleValueMetrics.forEach((metric) => {
      if (str.length > 0) {
        str += '\n';
      }

      str += `# HELP ${metric.def.name} ${metric.def.description}\n`;
      str += `# TYPE ${metric.def.name} ${metric.def.type}\n`;
      metric.buckets.forEach((bucket) => {
        const tags = writeTags(bucket.tags);
        str += `${metric.def.name}${tags} ${bucket.value.toFixed(4)}\n`;
      });
    });

    resetMetrics();
    return str;
  }
}