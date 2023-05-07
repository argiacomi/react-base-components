import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useEnhancedEffect } from '@component-hooks';

const useEventCallback = (fn) => {
  const ref = useRef(fn);
  useEnhancedEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args) => (0, ref.current)(...args), []);
};

export { useEventCallback };
