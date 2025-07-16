import * as React from 'react';

export interface RefFocusOptions {
  select?: boolean;
}

export function setRefFocus(
  ref: React.RefObject<HTMLInputElement>,
  options?: RefFocusOptions,
) {
  if (ref && ref.current) {
    ref.current.focus();
    if (options?.select) {
      ref.current.select();
    }
  }
}