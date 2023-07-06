import { useEffect, useState } from 'react';

const isBrowser = typeof window !== 'undefined';

const getInitialState = (query, defaultState) => {
  if (defaultState !== undefined) {
    return defaultState;
  }

  if (isBrowser) {
    return window.matchMedia(query).matches;
  }

  if (!import.meta.env.PROD) {
    console.warn(
      '`useMedia` When server side rendering, defaultState should be defined to prevent a hydration mismatches.'
    );
  }

  return false;
};

export function useMedia(query, defaultState) {
  const [state, setState] = useState(getInitialState(query.replace('@media ', ''), defaultState));

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query.replace('@media ', ''));
    const onChange = () => {
      if (!mounted) {
        return;
      }
      setState(!!mql.matches);
    };

    mql.addListener(onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeListener(onChange);
    };
  }, [query]);

  return state;
}
