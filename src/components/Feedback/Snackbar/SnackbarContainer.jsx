import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';

const componentClasses = {
  root: 'SnackbarContainer-Root',
  Snackbar: 'SnackbarContainer-Snackbar',
  CollapseWrapper: 'SnackbarContainer-CollapseWrapper',
  Content: 'SnackbarContainer-SnackbarContent'
};

const SnackbarContainerRoot = styled('div')(({ theme, ownerState }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  maxHeight: '100%',
  position: 'fixed',
  zIndex: theme.zIndex.snackbar,
  height: 'auto',
  width: 'auto',
  transition: theme.transition.create(['top', 'right', 'bottom', 'left', 'max-width'], {
    duration: 300,
    easing: 'ease'
  }),
  pointerEvents: 'none',
  [`& .${componentClasses.CollapseWrapper}`]: {
    padding: `${theme.spacing(0.75)} 0rem`,
    transition: 'padding 300ms ease 0ms'
  },
  maxWidth: `calc(100% - ${theme.spacing(5)})`,
  [theme.breakpoints.down('xs')]: {
    width: '100%',
    maxWidth: `calc(100% - ${theme.spacing(4)})`
  },
  ...(ownerState.dense && {
    [`& .${componentClasses.CollapseWrapper}`]: {
      padding: `${theme.spacing(0.25)} 0rem`
    }
  }),
  ...{
    top: {
      top: `${theme.spacing(2.5) - theme.spacing(0.75)}`,
      flexDirection: 'column'
    },
    bottom: {
      bottom: `${theme.spacing(2.5) - theme.spacing(0.75)}`,
      flexDirection: 'column-reverse'
    }
  }[ownerState.anchorOrigin?.vertical],
  ...{
    left: {
      left: `${theme.spacing(2.5)}px`,
      [theme.breakpoints.up('sm')]: {
        alignItems: 'flex-start'
      },
      [theme.breakpoints.down('xs')]: {
        left: theme.spacing(2)
      }
    },
    right: {
      right: `${theme.spacing(2.5)}px`,
      [theme.breakpoints.up('sm')]: {
        alignItems: 'flex-end'
      },
      [theme.breakpoints.down('xs')]: {
        right: theme.spacing(2)
      }
    },
    center: {
      left: '50%',
      transform: 'translateX(-50%)',
      [theme.breakpoints.up('sm')]: {
        alignItems: 'center'
      }
    }
  }[ownerState.anchorOrigin?.horizontal]
}));

const SnackbarContainer = React.forwardRef((props, ref) => {
  const {
    classes = {},
    className,
    anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
    dense = false,
    children
  } = props;

  const ownerState = {
    ...props,
    anchorOrigin,
    dense
  };

  console.log('SnackbarContainer', ownerState);

  return (
    <SnackbarContainerRoot
      className={clsx(componentClasses.root, classes.root, className)}
      ownerState={ownerState}
      ref={ref}
    >
      {children}
    </SnackbarContainerRoot>
  );
});

SnackbarContainer.displayName = 'SnackbarContainer';

export default SnackbarContainer;
