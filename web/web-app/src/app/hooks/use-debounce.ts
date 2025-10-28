import { DebounceFunc, debounce } from '../utils';

export function useDebounce<T>(
  func: DebounceFunc<T>,
  delay: number,
): DebounceFunc<T> {
  return debounce(func, delay);
}