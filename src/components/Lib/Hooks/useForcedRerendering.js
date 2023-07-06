import React from 'react';

export function useForcedRerendering() {
  const [, setState] = React.useState({});

  return React.useCallback(() => {
    setState({});
  }, []);
}
