import { InternalError, MealzError } from '@mealz/backend-common';
import {
  buildNotificationChunks,
  BuildNotificationChunksOutput,
} from './build-notification-chunks';

type Tags = 'b' | 'code';
const TAG_REGEX = /<(b|code)>([\s\S]*?)<\/\1>/g;
const INVALID_TAG_REGEX = /<\/?(?!b>|code>)([a-zA-Z][a-zA-Z0-9]*)[^>]*>/;

export function htmlToNotificationChunks(
  html: string,
): BuildNotificationChunksOutput {
  const invalidMatch = INVALID_TAG_REGEX.exec(html);
  if (invalidMatch) {
    throw new InternalError(
      `Invalid tag ${MealzError.quote(invalidMatch[1])}`,
    );
  }

  const result = buildNotificationChunks();
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TAG_REGEX.exec(html)) !== null) {
    if (match.index > lastIndex) {
      result.normal(html.slice(lastIndex, match.index));
    }

    const tag = match[1] as Tags;
    const content = match[2];

    if (tag === 'b') {
      result.bold(content);
    }
    else if (tag === 'code') {
      result.code(content);
    }

    lastIndex = TAG_REGEX.lastIndex;
  }

  if (lastIndex < html.length) {
    result.normal(html.slice(lastIndex));
  }

  TAG_REGEX.lastIndex = 0;
  return result;
}
