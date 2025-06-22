import * as React from 'react';

export function setRefFocus(ref: React.RefObject<HTMLInputElement>) {
  if (ref && ref.current) {
    ref.current.focus();
  }
}