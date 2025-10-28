export type DebounceFunc<T> = (value: T) => void;

export function debounce<T>(
  func: DebounceFunc<T>,
  delay: number,
): DebounceFunc<T> {
  let timer: NodeJS.Timeout;
  let lastValue: T;

  return (value: T) => {
    if (!timer) {
      func(value);
      timer = setTimeout(() => {
        timer = undefined;
        if (lastValue) {
          func(lastValue);
          lastValue = undefined;
        }
      }, delay);
    }
    else {
      lastValue = value;
    }
  };
}