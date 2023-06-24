//--- Breakpoint Creation and Management Utilities ---//
export function getOverlappingBreakpoints(props) {
  const breakpoints = props.breakpoints;
  const breakpointKeys = Object.keys(breakpoints);

  function normalize(input) {
    if (typeof input === 'string' || typeof input === 'number') {
      return { xs: input };
    }
    if (Array.isArray(input)) {
      const keys = breakpointKeys.slice(0, input.length);
      return keys.reduce((obj, key, index) => ({ ...obj, [key]: input[index] }), {});
    }
    if (typeof input === 'object') {
      return breakpointKeys.reduce((obj, key, index) => {
        return {
          ...obj,
          [key]: input[key] !== undefined ? input[key] : obj[breakpointKeys[index - 1]] || input.xs
        };
      }, {});
    }
  }

  const normalizedEntries = Object.entries(props).reduce((acc, [key, value]) => {
    if (key !== 'breakpoints') {
      return { ...acc, [key]: normalize(value) };
    }
    return acc;
  }, {});

  let lastItem = {};
  const overlappingBreakpoints = breakpointKeys.reduce((acc, key) => {
    const item = { ...lastItem };
    let isChanged = false;
    for (let prop in normalizedEntries) {
      if (
        normalizedEntries[prop][key] !== undefined &&
        normalizedEntries[prop][key] !== lastItem[prop]
      ) {
        item[prop] = normalizedEntries[prop][key];
        isChanged = true;
      }
    }
    lastItem = item;
    if (isChanged) {
      return { ...acc, [key]: item };
    }
    return acc;
  }, {});

  return overlappingBreakpoints;
}

export function traverseBreakpoints(breakpointBase, layoutConfig, iterator) {
  const breakpointKeys =
    typeof breakpointBase.keys === 'function' ? breakpointBase.keys() : breakpointBase.keys;

  const smallestBreakpoint = breakpointKeys[0];

  if (Array.isArray(layoutConfig)) {
    layoutConfig.forEach((breakpointValue, index) => {
      iterator((responsiveStyles, style) => {
        if (index <= breakpointKeys.length - 1) {
          if (index === 0) {
            Object.assign(responsiveStyles, style);
          } else {
            responsiveStyles[breakpointBase.up(breakpointKeys[index])] = style;
          }
        }
      }, breakpointValue);
    });
  } else if (layoutConfig && typeof layoutConfig === 'object') {
    const keys =
      Object.keys(layoutConfig).length > breakpointKeys.length
        ? breakpointKeys
        : breakpointKeys.filter((key) => Object.keys(layoutConfig).includes(key));
    keys.forEach((key) => {
      if (breakpointKeys.indexOf(key) !== -1) {
        const breakpointValue = layoutConfig[key];
        if (breakpointValue !== undefined) {
          iterator((responsiveStyles, style) => {
            if (smallestBreakpoint === key) {
              Object.assign(responsiveStyles, style);
            } else {
              responsiveStyles[breakpointBase.up(key)] = style;
            }
          }, breakpointValue);
        }
      }
    });
  } else if (typeof layoutConfig === 'number' || typeof layoutConfig === 'string') {
    iterator((responsiveStyles, style) => {
      Object.assign(responsiveStyles, style);
    }, layoutConfig);
  }
}

let cachedBreakpoints;

export function createBreakpoints(breakpoints) {
  if (cachedBreakpoints === breakpoints) {
    return cachedBreakpoints;
  }

  const {
    values = {
      xs: '0px',
      sm: '480px',
      md: '768px',
      lg: '1280px',
      xl: '1536px',
      '2xl': '1920px'
    },
    step = 5,
    unit = Object.values(values)[0].match(/[a-zA-Z]+/)[0] || 'px',
    ...other
  } = breakpoints;

  const entries = Object.entries(values);

  entries.sort((a, b) => parseInt(a[1]) - parseInt(b[1]));

  const keys = entries.map((entry) => entry[0]);

  const breakpointsObject = {
    keys: keys,
    values: values,
    default: { [entries[0][0]]: entries[0][1] },
    step: step,
    unit: unit,
    create: (breakpoints = breakpointsObject) => createBreakpoints(breakpoints),
    traverse: (breakpointBase, layoutConfig, iterator) =>
      traverseBreakpoints(breakpointBase, layoutConfig, iterator),
    overlap: (props) => getOverlappingBreakpoints(props),
    up: (key) => {
      const value = breakpointsObject.values[key];
      return `@media (min-width:${value})`;
    },
    down: (key) => {
      const value = breakpointsObject.values[key];
      return `@media (max-width:${Number.parseInt(value) - step / 100}${unit})`;
    },
    between: (start, end) => {
      const breakpointKeys =
        typeof breakpointsObject.keys === 'function'
          ? breakpointsObject.keys()
          : breakpointsObject.keys;
      const endIndex = breakpointKeys.indexOf(end);
      return (
        breakpointsObject.up(start) + ' and ' + `${endIndex !== -1 && breakpointsObject.down(end)}`
      );
    },
    only: (key) => {
      const breakpointKeys =
        typeof breakpointsObject.keys === 'function'
          ? breakpointsObject.keys()
          : breakpointsObject.keys;
      if (breakpointKeys.indexOf(key) + 1 < breakpointKeys.length) {
        return breakpointsObject.between(key, breakpointKeys[breakpointKeys.indexOf(key) + 1]);
      }
      return breakpointsObject.up(key);
    },
    not: (key) => {
      const breakpointKeys =
        typeof breakpointsObject.keys === 'function'
          ? breakpointsObject.keys()
          : breakpointsObject.keys;
      const keyIndex = breakpointKeys.indexOf(key);
      if (keyIndex === 0) {
        return breakpointsObject.up(keys[1]);
      }
      if (keyIndex === breakpointKeys.length - 1) {
        return breakpointsObject.down(breakpointKeys[keyIndex]);
      }

      return breakpointsObject
        .between(key, breakpointKeys[breakpointKeys.indexOf(key) + 1])
        .replace('@media', '@media not all and');
    }
  };

  cachedBreakpoints = { ...breakpointsObject, ...other };

  return cachedBreakpoints;
}
