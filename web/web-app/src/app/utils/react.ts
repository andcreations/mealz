import * as React from 'react';

export interface RefFocusOptions {
  select?: boolean;
}

export function focusRef(
  ref: React.RefObject<HTMLInputElement>,
  options?: RefFocusOptions,
): void {
  if (ref && ref.current) {
    ref.current.focus();
    if (options?.select) {
      ref.current.select();
    }
  }
}

export function blurRef(ref: React.RefObject<HTMLInputElement>): void {
  if (ref && ref.current) {
    ref.current.blur();
  }
}