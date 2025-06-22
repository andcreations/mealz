import * as React from 'react';

export type PatchState<T> = (patch: Partial<T>) => void;

export function usePatchState<T>(
  setState: React.Dispatch<React.SetStateAction<T>>,
): PatchState<T> {
  return (patch: Partial<T>) => {
    setState((prevState) => ({
      ...prevState,
      ...patch,
    }));
  };
}