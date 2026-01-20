import { InternalError, MealzError } from '@mealz/backend-common';
import { getLogger } from '@mealz/backend-logger';

import { MetricDef, MetricType, SingleValueMetric } from '../types';
import { BOOTSTRAP_CONTEXT } from '@mealz/backend-core';

const SINGLE_VALUE_METRIC_TYPES: MetricType[] = ['counter',  'gauge'];
const SINGLE_VALUE_CLEAR_METRIC_TYPES: MetricType[] = ['counter'];
const singleValueMetrics: Record<string, SingleValueMetric> = {};

export function registerMetric(def: MetricDef) {
  if (SINGLE_VALUE_METRIC_TYPES.includes(def.type)) {
    getLogger().debug('Registering single value metric', {
      ...BOOTSTRAP_CONTEXT,
      name: def.name,
      type: def.type,
    });
    singleValueMetrics[def.name] = {
      def,
      buckets: [],
    };
    return;
  }
  throw new InternalError(
    `Unsupported metric type ${MealzError.quote(def.type)}`,
  );
}

function matchTags(
  a: Record<string, string>,
  b: Record<string, string>,
): boolean {
  return Object.keys(a).every((key) => a[key] === b[key]);
}

export function incMetric(
  name: string,
  tags: Record<string, string>,
  value: number,
): void {
  if (value == 0) {
    return;
  }
  if (value < 0) {
    throw new InternalError(`Negative metric ${MealzError.quote(name)} value`);
  }

  const metric = singleValueMetrics[name];
  if (!metric) {
    throw new InternalError(`Metric ${MealzError.quote(name)} not found`);
  }

  let bucket = metric.buckets.find(metricBucket => {
    return matchTags(metricBucket.tags, tags);
  });
  if (!bucket) {
    bucket = { tags, value: 0 };
    metric.buckets.push(bucket);
  }
  bucket.value += value;
}

export function setMetric(
  name: string,
  tags: Record<string, string>,
  value: number,
): void {
  const metric = singleValueMetrics[name];
  if (!metric) {
    throw new InternalError(`Metric ${MealzError.quote(name)} not found`);
  }

  let bucket = metric.buckets.find(metricBucket => {
    return matchTags(metricBucket.tags, tags);
  });
  if (!bucket) {
    bucket = { tags, value };
    metric.buckets.push(bucket);
  }
  bucket.value = value;
}

export function getSingleValueMetrics(): SingleValueMetric[] {
  return Object.values(singleValueMetrics);
}

export function resetMetrics(): void {
  Object.values(singleValueMetrics)
    .filter(metric => {
      return SINGLE_VALUE_CLEAR_METRIC_TYPES.includes(metric.def.type);
    })
    .forEach((metric) => {
      metric.buckets = [];
    });
}