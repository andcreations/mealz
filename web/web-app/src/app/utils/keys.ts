export enum Key {
  Enter = 'Enter',
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp',
  Unknown = 'Unknown',
}

export function isEnterKey(event: React.KeyboardEvent<HTMLDivElement>) {
  return event.key === Key.Enter;
}

export function isArrowDownKey(event: React.KeyboardEvent<HTMLDivElement>) {
  return event.key === Key.ArrowDown;
}

export function isArrowUpKey(event: React.KeyboardEvent<HTMLDivElement>) {
  return event.key === Key.ArrowUp;
}

export function mapKey(event: React.KeyboardEvent<HTMLDivElement>): Key {
  if (isEnterKey(event)) {
    return Key.Enter;
  }
  if (isArrowDownKey(event)) {
    return Key.ArrowDown;
  }
  if (isArrowUpKey(event)) {
    return Key.ArrowUp;
  }
  return Key.Unknown;
}