import React from 'react';

export function usePreviousProps(value) {
  const ref = React.useRef({});
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
