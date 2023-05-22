import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@components/../../tailwind.config.js';

export const THEME_BREAKPOINTS = resolveConfig(tailwindConfig).theme.screens;

export const traverseBreakpoints = (breakpoints, layoutConfig, iterator) => {
  const smallestBreakpoint = breakpoints.keys[0];

  if (Array.isArray(layoutConfig)) {
    layoutConfig.forEach((breakpointValue, index) => {
      iterator((responsiveStyles, style) => {
        if (index <= breakpoints.keys.length - 1) {
          if (index === 0) {
            Object.assign(responsiveStyles, style);
          } else {
            responsiveStyles[breakpoints.up(breakpoints.keys[index])] = style;
          }
        }
      }, breakpointValue);
    });
  } else if (layoutConfig && typeof layoutConfig === 'object') {
    const keys =
      Object.keys(layoutConfig).length > breakpoints.keys.length
        ? breakpoints.keys
        : breakpoints.keys.filter((key) =>
            Object.keys(layoutConfig).includes(key)
          );

    keys.forEach((key) => {
      if (breakpoints.keys.indexOf(key) !== -1) {
        const breakpointValue = layoutConfig[key];
        if (breakpointValue !== undefined) {
          iterator((responsiveStyles, style) => {
            if (smallestBreakpoint === key) {
              Object.assign(responsiveStyles, style);
            } else {
              responsiveStyles[breakpoints.up(key)] = style;
            }
          }, breakpointValue);
        }
      }
    });
  } else if (
    typeof layoutConfig === 'number' ||
    typeof layoutConfig === 'string'
  ) {
    iterator((responsiveStyles, style) => {
      Object.assign(responsiveStyles, style);
    }, layoutConfig);
  }
};

export const createBreakpoints = (breakpoints = THEME_BREAKPOINTS) => {
  const entries = Object.entries(breakpoints);

  entries.sort((a, b) => parseInt(a[1]) - parseInt(b[1]));

  const keys = entries.map((entry) => entry[0]);

  const breakpointsObject = {
    keys: keys,
    values: breakpoints,
    default: { [entries[0][0]]: entries[0][1] },
    up: (key) => {
      const value = breakpointsObject.values[key];
      return `@media (min-width:${value})`;
    },
    down: (key) => {
      const value = breakpointsObject.values[key];
      return `@media (max-width:${value})`;
    },
    between: (start, end) => {
      const startIndex = breakpointsObject.keys.indexOf(start);
      const endIndex = breakpointsObject.keys.indexOf(end);
      return (
        breakpointsObject.up(start) + ' and ' + breakpointsObject.down(end)
      );
    },
    only: (key) => {
      if (
        breakpointsObject.keys.indexOf(key) + 1 <
        breakpointsObject.keys.length
      ) {
        return breakpointsObject.between(
          key,
          breakpointsObject.keys[breakpointsObject.keys.indexOf(key) + 1]
        );
      }

      return breakpointsObject.up(key);
    },
    not: (key) => {
      const keyIndex = breakpointsObject.keys.indexOf(key);
      if (keyIndex === 0) {
        return breakpointsObject.up(keys[1]);
      }
      if (keyIndex === breakpointsObject.keys.length - 1) {
        return breakpointsObject.down(breakpointsObject.keys[keyIndex]);
      }

      return breakpointsObject
        .between(
          key,
          breakpointsObject.keys[breakpointsObject.keys.indexOf(key) + 1]
        )
        .replace('@media', '@media not all and');
    }
  };

  return breakpointsObject;
};
