import * as React from 'react';
import { createBreakpoints, traverseBreakpoints } from '@components/lib';
import OverflowContext from './GridContext';

const SPACING_CONSTANT = 8;
const DEFAULT_COLUMNS = 12;

const appendLevel = (level) => (level <= 0 ? '' : `Level${level}`);

const getSpacing = (level, direction) => {
  return `var(--Grid-${direction}Spacing${appendLevel(level)})`;
};

const getColumns = (level) => {
  return `var(--Grid-columns${appendLevel(level)})`;
};

const generateColumnsStyles = (styleConfig, breakpoints) => {
  if (!styleConfig.container) {
    return {};
  }

  const styles =
    styleConfig.level > 0 && styleConfig.container
      ? {
          [`--Grid-columns${appendLevel(styleConfig.level)}`]: getColumns(
            styleConfig.level - 1
          )
        }
      : { '--Grid-columns': 12 };

  traverseBreakpoints(
    breakpoints,
    styleConfig.columns,
    (appendStyle, value) => {
      appendStyle(styles, {
        [`--Grid-columns${appendLevel(styleConfig.level)}`]: value
      });
    }
  );

  return styles;
};

const generateSpacingStyles = (styleConfig, breakpoints, direction) => {
  if (!styleConfig.container) {
    return {};
  }

  const styles =
    styleConfig.level > 0 && styleConfig.container
      ? {
          [`--Grid-${direction}Spacing${appendLevel(styleConfig.level)}`]:
            getSpacing(styleConfig.level - 1, `${direction}`)
        }
      : {};
  traverseBreakpoints(
    breakpoints,
    direction === 'row' ? styleConfig.rowSpacing : styleConfig.columnSpacing,
    (appendStyle, value) => {
      appendStyle(styles, {
        [`--Grid-${direction}Spacing${appendLevel(styleConfig.level)}`]:
          typeof value === 'string' ? value : `${value * SPACING_CONSTANT}px`
      });
    }
  );
  return styles;
};

const generateSizeStyles = (styleConfig, breakpoints) => {
  const styles = {};
  traverseBreakpoints(
    breakpoints,
    styleConfig.gridSize,
    (appendStyle, value) => {
      let style = {};
      if (value === true) {
        style = {
          flexBasis: 0,
          flexGrow: 1,
          maxWidth: '100%'
        };
      }
      if (value === 'auto') {
        style = {
          flexBasis: 'auto',
          flexGrow: 0,
          flexShrink: 0,
          maxWidth: 'none',
          width: 'auto'
        };
      }
      if (typeof value === 'number') {
        style = {
          flexGrow: 0,
          flexBasis: 'auto',
          width: `calc(100% * ${value} / ${getColumns(styleConfig.level - 1)}${
            styleConfig.level > 0 && styleConfig.container
              ? ` + ${getSpacing(styleConfig.level - 1, 'column')}`
              : ''
          })`
        };
      }
      appendStyle(styles, style);
    }
  );
  return styles;
};

const generateDirectionStyles = (styleConfig, breakpoints) => {
  if (!styleConfig.container) {
    return {};
  }
  const styles = {};
  traverseBreakpoints(
    breakpoints,
    styleConfig.direction,
    (appendStyle, value) => {
      appendStyle(styles, { flexDirection: value });
    }
  );
  return styles;
};

const generateStyles = (styleConfig, breakpoints) => {
  return {
    minWidth: 0,
    boxSizing: 'border-box',
    ...(styleConfig.container && {
      display: 'flex',
      flexWrap: 'wrap',
      ...(styleConfig.wrap &&
        styleConfig.wrap !== 'wrap' && {
          flexWrap: styleConfig.wrap
        }),
      margin: `calc(${getSpacing(
        styleConfig.level,
        'row'
      )} / -2) calc(${getSpacing(styleConfig.level, 'column')} / -2)`,
      ...(styleConfig.disableEqualOverflow && {
        margin: `calc(${getSpacing(
          styleConfig.level,
          'row'
        )} * -1) 0px 0px calc(${getSpacing(styleConfig.level, 'column')} * -1)`
      })
    }),
    ...((!styleConfig.container ||
      (styleConfig.level > 0 && styleConfig.container)) && {
      padding: `calc(${getSpacing(
        styleConfig.level - 1,
        'row'
      )} / 2) calc(${getSpacing(styleConfig.level - 1, 'column')} / 2)`,
      ...((styleConfig.disableEqualOverflow ||
        styleConfig.parentDisableEqualOverflow) && {
        padding: `${getSpacing(
          styleConfig.level - 1,
          'row'
        )} 0px 0px ${getSpacing(styleConfig.level - 1, 'column')}`
      })
    })
  };
};

const generateOffsetStyles = (styleConfig, breakpoints) => {
  const styles = {};
  traverseBreakpoints(
    breakpoints,
    styleConfig.gridOffset,
    (appendStyle, value) => {
      let style = {};
      if (value === 'auto') {
        style = {
          marginLeft: 'auto'
        };
      }
      if (typeof value === 'number') {
        style = {
          marginLeft:
            value === 0
              ? '0px'
              : `calc(100% * ${value} / ${getColumns(styleConfig.level - 1)})`
        };
      }
      appendStyle(styles, style);
    }
  );
  return styles;
};

const Grid = React.forwardRef((props, ref) => {
  const overflow = React.useContext(OverflowContext);
  const {
    className,
    children,
    columns: columnsProp = 12,
    container = false,
    component = 'div',
    direction = 'row',
    wrap = 'wrap',
    spacing: spacingProp = 0,
    rowSpacing: rowSpacingProp = spacingProp,
    columnSpacing: columnSpacingProp = spacingProp,
    disableEqualOverflow = false,
    level = 0,
    ...rest
  } = props;

  const breakpoints = createBreakpoints(props.breakpoints);

  const gridSize = {};
  const gridOffset = {};
  const other = {};

  Object.entries(rest).forEach(([key, val]) => {
    if (breakpoints.values[key] !== undefined) {
      gridSize[key] = val;
    } else if (breakpoints.values[key.replace('Offset', '')] !== undefined) {
      gridOffset[key.replace('Offset', '')] = val;
    } else {
      other[key] = val;
    }
  });

  const levelZero = level === 0;
  const columns = props.columns ?? (levelZero ? columnsProp : undefined);
  const spacing = props.spacing ?? (levelZero ? spacingProp : undefined);
  const rowSpacing =
    props.rowSpacing ??
    props.spacing ??
    (levelZero ? rowSpacingProp : undefined);
  const columnSpacing =
    props.columnSpacing ??
    props.spacing ??
    (levelZero ? columnSpacingProp : undefined);

  const styleConfig = {
    container,
    level,
    columns,
    columnSpacing,
    rowSpacing,
    direction,
    gridSize,
    wrap,
    gridOffset,
    disableEqualOverflow: disableEqualOverflow ?? overflow ?? false,
    parentDisableEqualOverflow: overflow
  };

  const mergedStyles = [
    generateColumnsStyles(styleConfig, breakpoints),
    generateSpacingStyles(styleConfig, breakpoints, 'column'),
    generateSpacingStyles(styleConfig, breakpoints, 'row'),
    generateSizeStyles(styleConfig, breakpoints),
    generateDirectionStyles(styleConfig, breakpoints),
    generateStyles(styleConfig, breakpoints),
    generateOffsetStyles(styleConfig, breakpoints)
  ].filter(Boolean);

  const childrenWithLevels = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        level: child.props.level ?? level + 1
      });
    }
    return child;
  });

  return (
    <OverflowContext.Provider value={disableEqualOverflow ?? overflow}>
      <div ref={ref} className={className} css={mergedStyles} {...other}>
        {childrenWithLevels}
      </div>
    </OverflowContext.Provider>
  );
});
Grid.displayName = 'Grid';

export default Grid;
