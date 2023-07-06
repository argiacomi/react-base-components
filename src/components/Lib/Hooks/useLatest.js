import React from 'react';

export function useLatest(value, deps) {
  const ref = React.useRef(value);

  React.useEffect(() => {
    ref.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps ?? [value]);

  return ref;
}
