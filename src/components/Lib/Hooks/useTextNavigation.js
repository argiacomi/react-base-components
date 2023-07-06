import React from 'react';

const TEXT_NAVIGATION_RESET_TIMEOUT = 500; // milliseconds

export function useTextNavigation(callback) {
  const textCriteriaRef = React.useRef({
    searchString: '',
    lastTime: null
  });

  return React.useCallback(
    (event) => {
      if (event.key.length === 1 && event.key !== ' ') {
        const textCriteria = textCriteriaRef.current;
        const lowerKey = event.key.toLowerCase();
        const currentTime = performance.now();
        if (
          textCriteria.searchString.length > 0 &&
          textCriteria.lastTime &&
          currentTime - textCriteria.lastTime > TEXT_NAVIGATION_RESET_TIMEOUT
        ) {
          textCriteria.searchString = lowerKey;
        } else if (
          textCriteria.searchString.length !== 1 ||
          lowerKey !== textCriteria.searchString
        ) {
          textCriteria.searchString += lowerKey;
        }

        textCriteria.lastTime = currentTime;

        callback(textCriteria.searchString, event);
      }
    },
    [callback]
  );
}
