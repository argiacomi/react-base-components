import { useMemo } from 'react';
import { setRef } from '@component/utils';

export function useForkRef(...refs) {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    return (instance) => {
      refs.forEach((ref) => {
        setRef(ref, instance);
      });
    };
  }, [refs]);
}
