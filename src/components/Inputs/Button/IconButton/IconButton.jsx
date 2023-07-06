import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { Icon, iconClasses } from '@components/display';
import ButtonBase from '../ButtonBase/ButtonBase';

export const iconButtonClasses = {
  root: 'IconButton-Root',
  disabled: 'Disabled'
};

const IconButtonRoot = styled(ButtonBase)(
  ({ theme, ownerState }) => ({
    textAlign: 'center',
    flex: '0 0 auto',
    fontSize: theme.pxToRem(
      {
        mini: 14,
        small: 18,
        medium: 24,
        large: 28,
        jumbo: 32
      }[ownerState.size]
    ),
    padding: theme.spacing(1),
    borderRadius: '50%',
    overflow: 'visible', // Explicitly set the default value to solve a bug on IE11.
    color: theme.color.active,
    transition: theme.transition.create('background-color', {
      duration: theme.transition.duration.shortest
    }),
    ...(!ownerState.disableRipple && {
      '&:hover': {
        backgroundColor: theme.alpha.add(theme.color.active, theme.color.hoverOpacity),
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      }
    }),
    ...(ownerState.edge === 'start' && {
      marginLeft: ownerState.size === 'small' ? theme.spacing(-3 / 16) : theme.spacing(-12 / 16)
    }),
    ...(ownerState.edge === 'end' && {
      marginRight: ownerState.size === 'small' ? theme.spacing(-3 / 16) : theme.spacing(-12 / 16)
    })
  }),
  ({ theme, ownerState }) => {
    const color = theme.color?.[ownerState.color];
    return {
      ...(ownerState.color === 'inherit' && {
        color: 'inherit'
      }),
      ...(ownerState.color !== 'inherit' &&
        ownerState.color !== 'default' && {
          color: color?.body,
          ...(!ownerState.disableRipple && {
            '&:hover': {
              ...(color && {
                backgroundColor: theme.alpha.add(color.body, theme.color.hoverOpacity)
              }),
              '@media (hover: none)': {
                backgroundColor: 'transparent'
              }
            }
          })
        }),
      padding: theme.pxToRem(
        {
          mini: 6,
          small: 6,
          medium: 8,
          large: 12,
          jumbo: 12
        }[ownerState.size]
      ),
      [`& .${iconClasses.root}`]: {},
      ...(ownerState.disabled && {
        color: theme.color.disabled.text,
        fill: theme.color.disabled.text,
        pointerEvents: 'none'
      })
    };
  },
  ({ ownerState }) => ownerState.cssStyles
);

const IconButton = React.forwardRef((props, ref) => {
  const {
    edge = false,
    children,
    color = 'inherit',
    component = 'button',
    disabled = false,
    disableRipple = false,
    disableFocusRipple = false,
    icon,
    size = 'medium',
    slots = {},
    slotProps = {},
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const iconArray = Array.isArray(icon) ? icon : [icon];
  const icons = iconArray.length;

  const ownerState = {
    ...props,
    cssStyles,
    color,
    disabled,
    disableFocusRipple,
    edge,
    icons,
    size
  };

  const classes = {
    root: [iconButtonClasses.root, ownerState.disabled && iconButtonClasses.disabled]
  };

  const IconButtonComponent = slots.root || IconButtonRoot;

  const buttonRootProps = useSlotProps({
    elementType: IconButtonComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      centerRipple: true,
      disabled,
      disableRipple,
      disableFocusRipple,
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <IconButtonComponent component={component} {...buttonRootProps}>
      {props.icon
        ? iconArray.map((icon, index) => (
            <Icon key={index} icon={icon} transition='none' {...slotProps.icon} />
          ))
        : children}
    </IconButtonComponent>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
