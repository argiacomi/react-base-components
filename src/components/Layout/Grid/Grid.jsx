import * as React from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '@components/../../tailwind.config.js';
import GridContext from './GridContext';
import { css } from '@emotion/react';
import tw from 'twin.macro';

const SPACING_CONSTANT = 8;
const DEFAULT_COLUMNS = 12;
const DEFAULT_BREAKPOINTS = resolveConfig(tailwindConfig).theme.screens;
const [key, value] = Object.entries(DEFAULT_BREAKPOINTS)[0];
const DEFAULT_BREAKPOINT = { [key]: value };

function resolveBreakpointValues(styleInput, breakpoints) {
  if (Object.keys(breakpoints).length === 0) {
    return { xs: styleInput };
  }

  let previous;

  return Object.keys(breakpoints).reduce((acc, breakpoint, i) => {
    if (Array.isArray(styleInput)) {
      acc[breakpoint] =
        styleInput[i] != null ? styleInput[i] : styleInput[previous];
      previous = i;
    } else if (typeof styleInput === 'object') {
      acc[breakpoint] =
        styleInput[breakpoint] != null
          ? styleInput[breakpoint]
          : styleInput[previous];
      previous = breakpoint;
    } else {
      acc[breakpoint] = styleInput;
    }
    return acc;
  }, {});
}

const generateStyleConfig = (styleInput, breakpoints = DEFAULT_BREAKPOINTS) => {
  const styleConfig = {};

  for (const styleKey in styleInput) {
    styleConfig[styleKey] = resolveBreakpointValues(
      styleInput[styleKey],
      breakpoints
    );
  }

  return styleConfig;
};

const spacingStyles = (container, item, value, type) => {
  const spacing = {};

  if (container && value !== 0) {
    if (type === 'columnMargin') {
      spacing['width'] = `calc(100% + ${value * SPACING_CONSTANT}px)`;
      spacing['marginLeft'] = `-${value * SPACING_CONSTANT}px`;
    } else if (type === 'rowMargin') {
      spacing['marginTop'] = `-${value * SPACING_CONSTANT}px`;
    }
  }
  if (item && value !== 0) {
    if (type === 'columnPadding') {
      spacing['paddingLeft'] = `${value * SPACING_CONSTANT}px`;
    } else if (type === 'rowPadding') {
      spacing['paddingTop'] = `${value * SPACING_CONSTANT}px`;
    }
  }

  return spacing;
};

const sizeStyles = (container, item, size, columns, spacing) => {
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
};

const styleClassMapping = {
  columnSpacing: (container, item, value) =>
    spacingStyles(container, item, value, 'columnMargin'),
  rowSpacing: (container, item, value) =>
    spacingStyles(container, item, value, 'rowMargin'),
  columnPadding: (container, item, value) =>
    spacingStyles(container, item, value, 'columnPadding'),
  rowPadding: (container, item, value) =>
    spacingStyles(container, item, value, 'rowPadding'),
  columns: () => {},
  size: sizeStyles,
  direction: (direction) => {
    return { flexDirection: direction };
  }
};

const generateStyles = (container, item, breakpoints, styleConfig) => {
  const styleResult = {};

  Object.keys(styleConfig).forEach((key) => {
    styleResult[key] = styleConfig[key];
  });

  for (const styleKey in styleConfig) {
    for (const breakpoint in styleConfig[styleKey]) {
      const currentValue = styleConfig[styleKey][breakpoint];

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
      } else if (
        ['columnSpacing', 'rowSpacing', 'columnPadding', 'rowPadding'].includes(
          styleKey
        )
      ) {
        styleResult[styleKey][breakpoint] = styleClassMapping[styleKey](
          container,
          item,
          currentValue,
          styleKey
        );
      } else {
        styleResult[styleKey][breakpoint] =
          styleClassMapping[styleKey](currentValue);
      }
    }
  }

  delete styleResult['columns'];

  return styleResult;
};

const generateMediaQueries = (breakpoints, styleConfig) => {
  let mediaQueries;

  mediaQueries = {};
  for (const styleKey in styleConfig) {
    for (const breakpoint in breakpoints) {
      const mediaQuery = `@media (min-width: ${breakpoints[breakpoint]})`;
      if (styleConfig[styleKey][breakpoint]) {
        if (!mediaQueries[mediaQuery]) {
          mediaQueries[mediaQuery] = {};
        }
        Object.assign(
          mediaQueries[mediaQuery],
          styleConfig[styleKey][breakpoint]
        );
      }
    }
  }

  if (Object.keys(mediaQueries).length !== 1) return mediaQueries;

  if (
    Object.keys(mediaQueries)[0] ===
    `@media (min-width: ${Object.values(DEFAULT_BREAKPOINT)})`
  ) {
    return Object.values(mediaQueries)[0];
  }

  return mediaQueries;
};

const useGridStyles = (container, item, styleInput, breakpoints) => {
  const styleConfig = React.useMemo(
    () => generateStyleConfig(styleInput, breakpoints),
    [styleInput, breakpoints]
  );

  const resolvedStyles = React.useMemo(
    () => generateStyles(container, item, breakpoints, styleConfig),
    [container, item, breakpoints, styleConfig]
  );

  const styles = React.useMemo(
    () => generateMediaQueries(breakpoints, resolvedStyles),
    [breakpoints, resolvedStyles]
  );

  return styles;
};

const Grid = React.forwardRef(
  (
    {
      className,
      columns: columnsProp = DEFAULT_COLUMNS, //{ xs: 2, md: 3, lg: 4, xl: 5, max: 6 },
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

    const columns = container
      ? columnsProp || DEFAULT_COLUMNS
      : columnsContext.columns;
    const rowSpacing = container
      ? rowSpacingProp || spacing
      : columnsContext.rowSpacing;
    const columnSpacing = container
      ? columnSpacingProp || spacing
      : columnsContext.columnSpacing;
    const rowPadding =
      container && item ? columnsContext.rowSpacing : rowSpacing;
    const columnPadding =
      container && item ? columnsContext.columnSpacing : columnSpacing;

    const styleInput = {
      size,
      columns,
      columnSpacing,
      rowSpacing,
      columnPadding,
      rowPadding,
      direction
    };

    let breakpoints = DEFAULT_BREAKPOINT;

    for (const key in styleInput) {
      if (typeof styleInput[key] === 'object' && styleInput[key] !== null) {
        for (const breakpoint in styleInput[key]) {
          if (DEFAULT_BREAKPOINTS[breakpoint]) {
            breakpoints[breakpoint] = DEFAULT_BREAKPOINTS[breakpoint];
          }
        }
      }
    }

    const gridStyles = useGridStyles(container, item, styleInput, breakpoints);

    const mergedStyles = [
      tw`box-border`,
      container && tw`flex flex-wrap`,
      item && tw`m-0`,
      zeroMinWidth && tw`min-w-0`,
      container && wrap === 'nowrap'
        ? tw`flex-nowrap`
        : wrap === 'wrap-reverse'
        ? tw`flex-wrap-reverse`
        : tw`flex-wrap`,
      gridStyles
    ].filter(Boolean);

    const contextValue = React.useMemo(
      () => ({ columns, rowSpacing, columnSpacing }),
      [columns, rowSpacing, columnSpacing]
    );

    const GridRoot = component ?? 'div';

    return (
      <GridContext.Provider value={contextValue}>
        <GridRoot
          className={className}
          css={mergedStyles}
          ref={ref}
          {...other}
        />
      </GridContext.Provider>
    );
  }
);
Grid.displayName = 'Grid';

export default Grid;
