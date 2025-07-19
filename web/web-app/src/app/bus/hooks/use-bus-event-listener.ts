import { useEffect } from 'react';
import {
  BusEventListener,
  addBusEventListener,
  removeBusEventListener,
} from '@andcreations/common';

export function useBusEventListener<T>(
  topic: string,
  listener: (event?: T) => void,
): void {
  const busEventListener: BusEventListener = {
    handleEvent: async <T>(eventTopic: string, event?: any): Promise<void> => {
      if (topic === eventTopic) {
        listener(event);
      }
    },
  };
  useEffect(
    () => {
      addBusEventListener(busEventListener);
      return () => removeBusEventListener(busEventListener);
    },
    [],
  );
}