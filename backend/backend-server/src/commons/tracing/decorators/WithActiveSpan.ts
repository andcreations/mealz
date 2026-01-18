import { AttributeValue, trace } from '@opentelemetry/api';
import { withActiveSpan } from '../utils';

export interface WithActiveSpanOptions {
  attributes?: Record<string, AttributeValue>;
}

const tracer = trace.getTracer(WithActiveSpan.name);

export function WithActiveSpan(
  spanName: string,
  options?: WithActiveSpanOptions,
): MethodDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      return withActiveSpan(tracer, spanName, async (span) => {
        // default attributes
        const key = typeof propertyKey === 'string' ? propertyKey : 'unknown';
        span.setAttribute('class', target.constructor.name);
        span.setAttribute('method', key);

        // custom attributes
        const attributes = options?.attributes ?? {};
        Object.entries(attributes).forEach(([key, value]) => {
          span.setAttribute(key, value);
        });

        // execute method
        try {
          const result = await originalMethod.apply(this, args);
          span.ok();
          return result;
        } catch (error) {
          span.error(error);
          throw error;
        } finally {
          span.end();
        }
      });

    };

    return descriptor;
  }
}