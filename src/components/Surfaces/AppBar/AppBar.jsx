import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import Paper from '../paper';

export const appBarClasses = {
  root: 'AppBar-Root'
};

const AppBarRoot = styled(Paper)(({ theme, ownerState }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  boxSizing: 'border-box',
  flexShrink: 0,
  borderRadius: 0,
  ...{
    fixed: {
      position: 'fixed',
      zIndex: theme.zIndex.appBar,
      top: 0,
      left: 'auto',
      right: 0,
      '@media print': {
        position: 'absolute'
      }
    },
    absolute: {
      position: 'absolute',
      zIndex: theme.zIndex.appBar,
      top: 0,
      left: 'auto',
      right: 0
    },
    sticky: {
      position: 'sticky',
      zIndex: theme.zIndex.appBar,
      top: 0,
      left: 'auto',
      right: 0
    },
    static: {
      position: 'static'
    },
    relative: {
      position: 'relative'
    }
  }[ownerState.position],
  color: theme.color[ownerState.color]?.text || theme.color.text.primary,
  backgroundColor: theme.color[ownerState.color]?.body || theme.color.gray[500],
  ...(ownerState.color === 'inherit' && {
    color: 'inherit',
    backgroundColor: 'inherit'
  }),
  ...(ownerState.color === 'transparent' && {
    backgroundImage: 'none',
    backgroundColor: 'transparent',
    color: 'inherit'
  }),
  ...(ownerState.color === 'monochrome' && {
    border: `1px solid ${theme.color.black}`,
    '@media (prefers-color-scheme: dark)': {
      border: `1px solid ${theme.color.white}`
    }
  }),
  ...ownerState.cssStyles
}));

const AppBar = React.forwardRef((props, ref) => {
  const {
    color = 'primary',
    elevation = 4,
    component = 'header',
    position = 'fixed',
    slots = {},
    slotProps = {},
    square = true,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    component,
    cssStyles,
    color,
    position
  };

  const AppBarComponent = slots.root || AppBarRoot;
  const appBarRootProps = useSlotProps({
    elementType: AppBarComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      square,
      component: component || 'header',
      elevation,
      ref: ref
    },
    ownerState,
    className: appBarClasses.root
  });

  return <AppBarComponent {...appBarRootProps} />;
});
AppBar.displayName = 'AppBar';

export default AppBar;
