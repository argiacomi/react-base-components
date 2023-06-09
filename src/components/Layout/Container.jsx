import * as React from 'react';
import clsx from 'clsx';
import styled, { useTheme } from 'styled-components/macro';

const ContainerRoot = styled('div')(
  ({ theme, ownerState }) => ({
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxSizing: 'border-box',
    display: 'block',
    ...(!ownerState.disableGutters && {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3)
      }
    })
  }),
  ({ theme, ownerState }) => {
    const breakpointKeys =
      typeof theme.breakpoints.keys === 'function'
        ? theme.breakpoints.keys()
        : theme.breakpoints.keys;
    return (
      ownerState.fixed &&
      breakpointKeys.keys().reduce((output, key) => {
        const value = theme.breakpoints.values[key];
        if (value !== '0px') {
          output[theme.breakpoints.up(key)] = {
            maxWidth: value
          };
        }
        return output;
      }, {})
    );
  },
  ({ theme, ownerState }) => ({
    ...(ownerState.maxWidth && {
      ...(theme.breakpoints.values[ownerState.maxWidth] !== 0 && {
        [theme.breakpoints.up(ownerState.maxWidth)]: {
          maxWidth: theme.breakpoints.values[ownerState.maxWidth]
        }
      })
    })
  })
);

const Container = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const breakpointKeys =
    typeof theme.breakpoints.keys === 'function'
      ? theme.breakpoints.keys()
      : theme.breakpoints.keys;
  const maxBreakpoint = breakpointKeys[breakpointKeys.length - 1];

  const {
    className,
    component = 'div',
    disableGutters = false,
    fixed = false,
    maxWidth = fixed ? maxBreakpoint : 'lg',
    classes: classesProp,
    ...other
  } = props;

  const ownerState = {
    ...props,
    component,
    disableGutters,
    fixed,
    maxWidth
  };

  return (
    <ContainerRoot
      as={component}
      ownerState={ownerState}
      className={clsx('Container-Root', classesProp?.root, className)}
      ref={ref}
      {...other}
    />
  );
});
Container.displayName = 'Container';

export default Container;
