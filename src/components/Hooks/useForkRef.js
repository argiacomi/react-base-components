import { useMemo } from 'react';

const setRef = (ref, value) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
};

const useForkRef = (...refs) => {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }

    return (instance) => {
      refs.forEach((ref) => {
        setRef(ref, instance);
      });
    };
  }, refs);
};

export default useForkRef;
