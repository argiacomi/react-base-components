import React from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { ButtonBase, Icon } from '@components';

const IconButtonRoot = styled(ButtonBase)(({ theme, ownerState }) => ({
  textAlign: 'center',
  flex: '0 0 auto',
  ...theme.text.size['2xl'],
  height: `${1.5 * ownerState.icons}rem`,
  width: `${1.5 * ownerState.icons}rem`,
  borderRadius: theme.rounded.full,
  overflow: 'visible',
  transition: theme.transition.create('background-color', {
    duration: theme.transition.duration.shortest
  }),
  boxSizing: 'content-box',
  ...{
    start: { marginLeft: '-.75rem' },
    end: { marginRight: '-.75rem' }
  }[ownerState.edge],
  ...(ownerState.color === 'inherit' && {
    color: 'inherit'
  }),
  ...(ownerState.color !== 'inherit' && {
    ...(ownerState.color === 'default' && {
      color: theme.color.text.secondary,
      fill: 'inherit',
      '&:hover': {
        backgroundColor: theme.alpha.add(theme.color.black, 0.05)
      }
    }),
    ...(ownerState.color !== 'default' && {
      color: theme.color[ownerState.color][500],
      fill: theme.color[ownerState.color][500],
      '&:hover': {
        backgroundColor: theme.alpha.add(theme.color[ownerState.color][500], 0.2)
      }
    })
  }),
  padding: {
    xs: '0.25rem',
    small: '0.375rem',
    medium: '0.5rem',
    large: '0.75rem',
    xl: '.875rem'
  }[ownerState.size],
  ...(ownerState.edge === 'start' &&
    (ownerState.size === 'xs' || ownerState.size === 'sm') && { marginLeft: '-.25rem' }),
  ...(ownerState.disabled && {
    color: theme.color.disabled.text,
    fill: theme.color.disabled.text,
    pointerEvents: 'none'
  })
}));

const IconButton = React.forwardRef((props, ref) => {
  const {
    edge = false,
    children,
    className,
    color = 'inherit',
    disabled = false,
    disableFocusRipple = false,
    size = 'medium',
    ...other
  } = props;

  const iconArray = Array.isArray(props.icon) ? props.icon : [props.icon];
  const icons = iconArray.length;

  const ownerState = {
    ...props,
    edge,
    color,
    disabled,
    disableFocusRipple,
    icons,
    size
  };

  return (
    <IconButtonRoot
      className={clsx('IconButton-Root', className)}
      centerRipple
      focusRipple={!disableFocusRipple}
      disabled={disabled}
      ref={ref}
      ownerState={ownerState}
      {...other}
    >
      {props.icon
        ? iconArray.map((icon, index) => (
            <Icon
              key={index}
              icon={icon}
              size={
                {
                  mini: '1.125rem',
                  small: '1.25rem',
                  medium: '1.375rem',
                  large: '1.5rem',
                  jumbo: '1.675rem',
                  auto: 'auto'
                }[ownerState.size]
              }
              css={{ transition: 'none' }}
            />
          ))
        : children}
    </IconButtonRoot>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
