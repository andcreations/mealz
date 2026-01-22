export interface RetryOptions {
  maxAttempts: number;
  delay?: number;
  backoffFactor?: number;
  onRetry?: (error: any, attempt: number) => void;
}

const DEFAULT_DELAY = 1000;
const DEFAULT_BACKOFF_FACTOR = 2;

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const backoffFactor = options.backoffFactor ?? DEFAULT_BACKOFF_FACTOR;

  let lastError: any;
  let delay = options.delay ?? DEFAULT_DELAY;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // callback
      if (options.onRetry) {
        options.onRetry(error, attempt);
      }

      // wait
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = options.delay * Math.pow(backoffFactor, attempt);
    }
  }
  throw lastError;
}
