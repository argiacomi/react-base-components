import React from 'react';

export function useCallbackRef(callback) {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  return React.useMemo(
    () =>
      (...args) =>
        callbackRef.current?.(...args),
    []
  );
}
