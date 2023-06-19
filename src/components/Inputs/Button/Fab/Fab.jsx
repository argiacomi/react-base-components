import React from 'react';
import clsx from 'clsx';
import ButtonBase from '../ButtonBase/ButtonBase';
import { styled } from '@styles';

const fabClasses = {
  root: 'Fab-Root',
  focusVisible: 'Fab-FocusVisible',
  disabled: 'Fab-Disabled'
};

const FabRoot = styled(ButtonBase)(
  ({ theme, ownerState }) => ({
    ...theme.text.typography.button,
    minHeight: 36,
    transition: theme.transition.create(['background-color', 'box-shadow', 'border-color'], {
      duration: theme.transition.duration.short
    }),
    borderRadius: '50%',
    padding: 0,
    minWidth: 0,
    width: 56,
    height: 56,
    zIndex: theme.zIndex.fab,
    boxShadow: theme.boxShadow.fab,
    '&:active': {
      boxShadow: theme.boxShadow.fabActive
    },
    color: theme.alpha.contrastText(theme.color.gray[300]),
    backgroundColor: theme.color.gray[300],
    '&:hover': {
      backgroundColor: theme.color.gray[500],
      '@media (hover: none)': {
        backgroundColor: theme.color.gray[300]
      },
      textDecoration: 'none'
    },
    [`&.${fabClasses.focusVisible}`]: {
      boxShadow: theme.boxShadow.fab
    },
    ...(ownerState.size === 'small' && {
      width: 40,
      height: 40
    }),
    ...(ownerState.size === 'medium' && {
      width: 48,
      height: 48
    }),
    ...(ownerState.variant === 'extended' &&
      {
        large: {
          borderRadius: 48 / 2,
          padding: '0 16px',
          width: 'auto',
          minHeight: 'auto',
          minWidth: 48,
          height: 48
        },
        small: {
          width: 'auto',
          padding: '0 8px',
          borderRadius: 34 / 2,
          minWidth: 34,
          height: 34
        },
        medium: {
          width: 'auto',
          padding: '0 16px',
          borderRadius: 40 / 2,
          minWidth: 40,
          height: 40
        }
      }[ownerState.size]),
    ...(ownerState.color === 'inherit' && {
      color: 'inherit'
    })
  }),
  ({ theme, ownerState }) => ({
    ...(ownerState.color !== 'inherit' &&
      ownerState.color !== 'default' &&
      theme.color[ownerState.color] != null && {
        color: theme.color[ownerState.color].text,
        backgroundColor: theme.color[ownerState.color].body,
        '&:hover': {
          backgroundColor: theme.color[ownerState.color][600],
          '@media (hover: none)': {
            backgroundColor: theme.color[ownerState.color].body
          }
        }
      })
  }),
  ({ theme }) => ({
    [`&.${fabClasses.disabled}`]: {
      color: theme.color.disabled.text,
      boxShadow: theme.boxShadow[0],
      backgroundColor: theme.color.disabled.body
    }
  })
);

const Fab = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    color = 'default',
    component = 'button',
    disabled = false,
    disableFocusRipple = false,
    focusVisibleClassName,
    size = 'large',
    variant = 'circular',
    ...other
  } = props;

  const ownerState = {
    ...props,
    color,
    component,
    disabled,
    disableFocusRipple,
    size,
    variant
  };

  const classes = {
    root: [fabClasses.root, ownerState.disabled && fabClasses.disabled],
    focusVisible: fabClasses.focusVisible
  };

  return (
    <FabRoot
      className={clsx(classes.root, className)}
      component={component}
      disabled={disabled}
      disableRipple={disableFocusRipple}
      focusVisibleClassName={clsx(classes.focusVisible, focusVisibleClassName)}
      ownerState={ownerState}
      ref={ref}
      {...other}
      classes={classes}
    >
      {children}
    </FabRoot>
  );
});

Fab.displayName = 'Fab';

export default Fab;
