import React from 'react';
import clsx from 'clsx';
import { styled, useTheme } from '@styles';
import OverflowContext from './GridContext';

/*
All variables must be lower case + kebab-case + single hyphen when declared vs double hyphen when used
to account for how styled-components handles CSS Variables
*/
const DEFAULT_COLUMNS = 12;

const appendLevel = (level) => (level <= 0 ? '' : `evel${level}`);

const getSpacing = (level, direction) => {
  return `var(--grid-${direction}-spacing${appendLevel(level)})`;
};

const getColumns = (level) => {
  return `var(--grid-columns${appendLevel(level)})`;
};

const generateColumnsStyles = (ownerState, theme) => {
  if (!ownerState.container) {
    return {};
  }

  const styles =
    ownerState.level > 0 && ownerState.container
      ? {
          [`-Grid-columns${appendLevel(ownerState.level)}`]: `${getColumns(ownerState.level - 1)} `
        }
      : { '-Grid-columns': `${DEFAULT_COLUMNS} ` };

  theme.breakpoints.traverse(ownerState.breakpoints, ownerState.columns, (appendStyle, value) => {
    appendStyle(styles, {
      [`-Grid-columns${appendLevel(ownerState.level)}`]: `${value} `
    });
  });
  return styles;
};

const generateSpacingStyles = (ownerState, theme, direction) => {
  if (!ownerState.container) {
    return {};
  }

  const styles =
    ownerState.level > 0 && ownerState.container
      ? {
          [`-Grid-${direction}Spacing${appendLevel(ownerState.level)}`]: getSpacing(
            ownerState.level - 1,
            `${direction}`
          )
        }
      : {};
  theme.breakpoints.traverse(
    ownerState.breakpoints,
    direction === 'row' ? ownerState.rowSpacing : ownerState.columnSpacing,
    (appendStyle, value) => {
      appendStyle(styles, {
        [`-Grid-${direction}Spacing${appendLevel(ownerState.level)}`]:
          typeof value === 'string' ? value : `${theme.spacing(value)}`
      });
    }
  );

  return styles;
};

const generateSizeStyles = (ownerState, theme) => {
  const styles = {};
  theme.breakpoints.traverse(ownerState.breakpoints, ownerState.gridSize, (appendStyle, value) => {
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
        width: `calc(100% * ${value} / ${getColumns(ownerState.level - 1)}${
          ownerState.level > 0 && ownerState.container
            ? ` + ${getSpacing(ownerState.level - 1, 'column')}`
            : ''
        })`
      };
    }
    appendStyle(styles, style);
  });
  return styles;
};

const generateDirectionStyles = (ownerState, theme) => {
  if (!ownerState.container) {
    return {};
  }
  const styles = {};
  theme.breakpoints.traverse(ownerState.breakpoints, ownerState.direction, (appendStyle, value) => {
    appendStyle(styles, { flexDirection: value });
  });
  return styles;
};

const generateGridStyles = (ownerState) => {
  return {
    minWidth: 0,
    boxSizing: 'border-box',
    ...(ownerState.container && {
      display: 'flex',
      flexWrap: 'wrap',
      ...(ownerState.wrap &&
        ownerState.wrap !== 'wrap' && {
          flexWrap: ownerState.wrap
        }),
      margin: `calc(${getSpacing(ownerState.level, 'row')} / -2) calc(${getSpacing(
        ownerState.level,
        'column'
      )} / -2)`,
      ...(ownerState.disableEqualOverflow && {
        margin: `calc(${getSpacing(ownerState.level, 'row')} * -1) 0px 0px calc(${getSpacing(
          ownerState.level,
          'column'
        )} * -1)`
      })
    }),
    ...((!ownerState.container || (ownerState.level > 0 && ownerState.container)) && {
      padding: `calc(${getSpacing(ownerState.level - 1, 'row')} / 2) calc(${getSpacing(
        ownerState.level - 1,
        'column'
      )} / 2)`,
      ...((ownerState.disableEqualOverflow || ownerState.parentDisableEqualOverflow) && {
        padding: `${getSpacing(ownerState.level - 1, 'row')} 0px 0px ${getSpacing(
          ownerState.level - 1,
          'column'
        )}`
      })
    })
  };
};

const generateOffsetStyles = (ownerState, theme) => {
  const styles = {};
  theme.breakpoints.traverse(
    ownerState.breakpoints,
    ownerState.gridOffset,
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
            value === 0 ? '0px' : `calc(100% * ${value} / ${getColumns(ownerState.level - 1)})`
        };
      }
      appendStyle(styles, style);
    }
  );
  return styles;
};

const GridRoot = styled('div')(
  ({ ownerState, theme }) => generateColumnsStyles(ownerState, theme),
  ({ ownerState, theme }) => generateSpacingStyles(ownerState, theme, 'column'),
  ({ ownerState, theme }) => generateSpacingStyles(ownerState, theme, 'row'),
  ({ ownerState, theme }) => generateSizeStyles(ownerState, theme),
  ({ ownerState, theme }) => generateDirectionStyles(ownerState, theme),
  ({ ownerState }) => generateGridStyles(ownerState),
  ({ ownerState, theme }) => generateOffsetStyles(ownerState, theme)
);

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

  const theme = useTheme();
  const breakpoints = theme.breakpoints.create(props.breakpoints || theme.breakpoints);

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
  const rowSpacing = props.rowSpacing ?? props.spacing ?? (levelZero ? rowSpacingProp : undefined);
  const columnSpacing =
    props.columnSpacing ?? props.spacing ?? (levelZero ? columnSpacingProp : undefined);

  const ownerState = {
    ...props,
    breakpoints,
    container,
    level,
    columns,
    direction,
    wrap,
    spacing,
    rowSpacing,
    columnSpacing,
    gridSize,
    gridOffset,
    disableEqualOverflow: disableEqualOverflow ?? overflow ?? false,
    parentDisableEqualOverflow: overflow
  };

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
      <GridRoot
        as={component}
        ref={ref}
        className={clsx('Grid-Root', className)}
        ownerState={ownerState}
        {...other}
      >
        {childrenWithLevels}
      </GridRoot>
    </OverflowContext.Provider>
  );
});
Grid.displayName = 'Grid';

export default Grid;
