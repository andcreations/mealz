import { MetricDef } from './MetricDef';

export interface SingleValueMetricBucket {
  tags: Record<string, string>;
  value: number;
}

export interface SingleValueMetric {
  def: MetricDef;
  buckets: SingleValueMetricBucket[];
}