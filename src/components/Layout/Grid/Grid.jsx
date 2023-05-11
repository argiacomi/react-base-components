import * as React from 'react';
import { cn } from '@utils';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@components/../../tailwind.config.js';
import GridContext from './GridContext';
import { css } from '@emotion/react';
import tw from 'twin.macro';

const defaultBreakpoints = resolveConfig(tailwindConfig).theme.screens;

const processStyleValue = (styleValue, breakpoints) => {
  const config = {};

  if (typeof styleValue === 'number' || typeof styleValue === 'string') {
    const value = parseInt(styleValue);
    for (const breakpoint in breakpoints) {
      config[breakpoint] = value;
    }
  } else if (Array.isArray(styleValue)) {
    styleValue.forEach((value, index) => {
      const breakpoint = Object.keys(breakpoints)[index];
      if (breakpoint) config[breakpoint] = value;
    });
  } else if (typeof styleValue === 'object') {
    let previousValue;
    for (const breakpoint in breakpoints) {
      if (styleValue.hasOwnProperty(breakpoint)) {
        config[breakpoint] = styleValue[breakpoint];
        previousValue = styleValue[breakpoint];
      } else if (previousValue) {
        config[breakpoint] = previousValue;
      }
    }
  }

  return config;
};

const processDirection = (direction, breakpoints) => {
  const config = {};

  const processValue = (value, breakpoint) => {
    if (typeof value === 'string') {
      if (value === 'column' || value === 'column-reverse') {
        return value === 'column' ? 'column' : 'column-reverse';
      } else {
        return value;
      }
    } else if (Array.isArray(value)) {
      const index = Object.keys(breakpoints).indexOf(breakpoint);
      if (index < value.length) {
        return processValue(value[index], breakpoint);
      } else {
        throw new Error('Invalid direction value in array');
      }
    } else if (typeof value === 'object') {
      if (value.hasOwnProperty(breakpoint)) {
        return processValue(value[breakpoint], breakpoint);
      } else {
        throw new Error('Invalid direction value in object');
      }
    } else {
      throw new Error('Invalid direction value');
    }
  };

  for (const breakpoint in breakpoints) {
    try {
      config[breakpoint] = processValue(direction, breakpoint);
    } catch (error) {
      console.error(error);
    }
  }

  return config;
};

const generateStyleConfig = (styleInput, breakpoints = defaultBreakpoints) => {
  const styleConfig = {};

  for (const styleKey in styleInput) {
    styleConfig[styleKey] =
      styleKey !== 'direction'
        ? processStyleValue(styleInput[styleKey], breakpoints)
        : processDirection(styleInput[styleKey], breakpoints);
  }

  return styleConfig;
};

const spacingClass = (container, item, value, type) => {
  const spacing = {};

  if (container && value !== 0) {
    spacing[type === 'column' ? 'marginLeft' : 'marginTop'] = `-${value * 4}px`;
  }
  if (item && value !== 0) {
    spacing[type === 'column' ? 'paddingLeft' : 'paddingTop'] = `${
      value * 4
    }px`;
  }
  return spacing;
};

const columnsClass = (columns, direction) => ({
  gridTemplateColumns: direction.includes('col')
    ? `repeat(${columns}, 1fr)`
    : `repeat(${columns}, auto)`
});

const sizeClass = (container, item, size, columns, spacing) => {
  if (!size) {
    return {};
  }

  if (size === true) {
    return { flexBasis: 0, flexGrow: 1, maxWidth: '100%' };
  } else if (size === 'auto') {
    return {
      flexBasis: 'auto',
      flexGrow: 0,
      flexShrink: 0,
      maxWidth: 'none',
      width: 'auto'
    };
  } else {
    const fullWidth =
      container && item
        ? `calc(${Math.round((size / columns) * 10e7) / 10e5}% + ${spacing}px)`
        : `${Math.round((size / columns) * 10e7) / 10e5}%`;
    return {
      flexBasis: fullWidth,
      flexGrow: 0,
      maxWidth: fullWidth
    };
  }

  return {};
};

const styleClassMapping = {
  columnSpacing: (container, item, value) =>
    spacingClass(container, item, value, 'column'),
  rowSpacing: (container, item, value) =>
    spacingClass(container, item, value, 'row'),
  columns: columnsClass,
  size: sizeClass,
  direction: (direction) => ({ flexDirection: direction })
};

const generateClasses = (container, item, styleConfig) => {
  const styleResult = {};
  const mediaQueries = {};

  Object.keys(styleConfig).forEach((key) => {
    styleResult[key] = styleConfig[key];
  });

  for (const styleKey in styleConfig) {
    let previousValue = null;
    let classString = '';

    for (const breakpoint in styleConfig[styleKey]) {
      const currentValue = styleConfig[styleKey][breakpoint];

      if (currentValue !== previousValue) {
        if (styleKey === 'size') {
          const columns = styleConfig.columns[breakpoint];
          const spacing = styleConfig.columnSpacing[breakpoint];
          styleResult[styleKey][breakpoint] = styleClassMapping[styleKey](
            container,
            item,
            currentValue,
            columns,
            spacing
          );
        } else if (styleKey === 'columns') {
          const direction = styleConfig.direction[breakpoint];
          styleResult[styleKey][breakpoint] = styleClassMapping[styleKey](
            currentValue,
            direction
          );
        } else if (styleKey === 'columnSpacing' || styleKey === 'rowSpacing') {
          styleResult[styleKey][breakpoint] = styleClassMapping[styleKey](
            container,
            item,
            currentValue
          );
        } else {
          styleResult[styleKey][breakpoint] =
            styleClassMapping[styleKey](currentValue);
        }
        previousValue = currentValue;
      } else {
        delete styleResult[styleKey][breakpoint];
      }
    }
  }

  for (const styleKey in styleResult) {
    let prevoiousSize = '0px';
    for (const breakpoint in defaultBreakpoints) {
      const mediaQuery = `@media (min-width: ${prevoiousSize})`;

      if (styleResult[styleKey][breakpoint]) {
        if (!mediaQueries[mediaQuery]) {
          mediaQueries[mediaQuery] = {};
        }
        Object.assign(
          mediaQueries[mediaQuery],
          styleResult[styleKey][breakpoint]
        );
      }
      prevoiousSize = defaultBreakpoints[breakpoint];
    }
  }

  return mediaQueries;
};

const useGridStyles = (container, item, styleInput) => {
  const styleConfigInput = {};

  const styleConfig = React.useMemo(
    () => generateStyleConfig(styleInput),
    [styleInput]
  );

  const styles = React.useMemo(
    () => generateClasses(container, item, styleConfig),
    [container, item, styleConfig]
  );

  return styles;
};

const Grid = React.forwardRef(
  (
    {
      className,
      columns: columnsProp = 12, //{ xs: 2, md: 3, lg: 4, xl: 5, max: 6 },
      columnSpacing: columnSpacingProp,
      component = 'div',
      container = false,
      direction = 'row',
      item = false,
      rowSpacing: rowSpacingProp,
      spacing = 0, //{ xs: 2, sm: 3, md: '3px', lg: '4px', xl: 5, max: 6 },
      size, //{ xs: 1, md: 1, lg: 1, xl: 1, max: 1 },
      wrap = 'wrap',
      zeroMinWidth = false,
      ...other
    },
    ref
  ) => {
    const columnsContext = React.useContext(GridContext);

    const columns = container ? columnsProp || 12 : columnsContext.columns;
    const rowSpacing = container
      ? rowSpacingProp || spacing
      : columnsContext.rowSpacing;
    const columnSpacing = container
      ? columnSpacingProp || spacing
      : columnsContext.columnSpacing;

    const styleInput = {
      size,
      columns,
      columnSpacing,
      rowSpacing,
      direction
    };

    const styles = useGridStyles(container, item, styleInput);

    const composedClasses = cn(className);

    const contextValue = React.useMemo(
      () => ({ columns, rowSpacing, columnSpacing }),
      [columns, rowSpacing, columnSpacing]
    );

    const GridRoot = component ?? 'div';

    return (
      <GridContext.Provider value={contextValue}>
        <GridRoot
          className={composedClasses}
          css={[
            tw`box-border`,
            container && tw`flex flex-wrap`,
            item && tw`m-0`,
            zeroMinWidth && tw`min-w-0`,
            container && wrap === 'nowrap'
              ? tw`flex-nowrap`
              : wrap === 'wrap-reverse'
              ? tw`flex-wrap-reverse`
              : tw`flex-wrap`,
            styles
          ]}
          ref={ref}
          {...other}
        />
      </GridContext.Provider>
    );
  }
);
Grid.displayName = 'Grid';

export default Grid;
