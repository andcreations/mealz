import { MetricType } from './MetricType';

export interface MetricDef {
  name: string;
  type: MetricType;
  description: string;
  labels: string[];
}