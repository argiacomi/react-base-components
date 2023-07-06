import React from 'react';
import styled, { extractStyling, useTheme } from '@styles';
import { useSlotProps } from '@components/lib';

export const containerClasses = {
  root: 'Container-Root',
  fixed: 'Fixed',
  disableGutters: 'DisableGutters'
};

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
    }),
    ...ownerState.cssStyles
  }),
  ({ theme, ownerState }) => {
    const breakpointKeys = theme.breakpoints.keys;
    return (
      ownerState.fixed &&
      breakpointKeys.reduce((output, key) => {
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
  const maxBreakpoint = theme.breakpoints.keys[theme.breakpoints.keys.length - 1];

  const {
    component: componentProp = 'div',
    disableGutters = false,
    fixed = false,
    maxWidth = fixed ? maxBreakpoint : 'lg',
    slots = {},
    slotProps = {},
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
    disableGutters,
    fixed,
    maxWidth
  };

  const classes = {
    root: [
      containerClasses.root,
      ownerState.fixed && containerClasses.fixed,
      ownerState.disableGutters && containerClasses.disableGutters
    ]
  };

  const component = componentProp || 'div';
  const ContainerComponent = slots.root || ContainerRoot;

  const containerRootProps = useSlotProps({
    elementType: ContainerComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return <ContainerComponent as={component} {...containerRootProps} />;
});
Container.displayName = 'Container';

export default Container;
