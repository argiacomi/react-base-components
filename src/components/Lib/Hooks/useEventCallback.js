import { useCallback, useRef } from 'react';
import { useEnhancedEffect } from '@component/hooks';

export function useEventCallback(fn) {
  // Create a ref using the function passed as an argument
  const ref = useRef(fn);

  // Use the useEnhancedEffect hook to update the ref.current value whenever the fn changes
  useEnhancedEffect(() => {
    ref.current = fn;
  });

  // Return a memoized version of the function that invokes the current value of ref (which is the fn function)
  return useCallback((...args) => (0, ref.current)(...args), []);
}
