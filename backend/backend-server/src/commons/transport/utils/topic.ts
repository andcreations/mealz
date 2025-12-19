import { HttpStatus } from '@nestjs/common';
import { MealzError } from '@mealz/backend-common';

export interface TopicParams {
  domain: string;
  service: string;
  method: string;
  version: string;
}

export interface LocalTopicParams {
  module: string;
  method: string;
  version: string;
}

function validateParam(value: string): void {
  const regex = /[a-zA-Z0-9]+/;
  if (!value.match(regex)) {
    throw new MealzError(
      `Invalid topic parameter ${MealzError.quote(value)}`,
      'InvalidTopicParam',
      HttpStatus.BAD_REQUEST,
    )
  }
}

export function buildRequestTopic(params: TopicParams): string {
  Object.values(params).forEach(validateParam);
  return (
    `${params.domain}_${params.service}_` +
    `${params.method}$request_${params.version}`
  );
}

export function buildEventTopic(params: TopicParams): string {
  Object.values(params).forEach(validateParam);
  return (
    `${params.domain}_${params.service}_` +
    `${params.method}$event_${params.version}`
  );
}

// Local topics are sent within the same server/microservice.
export function buildLocalEventTopic(params: LocalTopicParams): string {
  Object.values(params).forEach(validateParam);
  return `${params.module}_${params.method}$event_${params.version}`;
}