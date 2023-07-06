import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling, shouldForwardProp } from '@styles';
import { mergeProps, useSlotProps } from '@components/lib';
import { Icon } from '@components/display';
import ButtonBase from '../ButtonBase/ButtonBase';
import ButtonGroupContext from './ButtonGroupContext';

export const buttonClasses = {
  root: 'Button-Root',
  startIcon: 'Button-StartIcon',
  endIcon: 'Button-EndIcon',
  active: 'Active',
  disabled: 'Disabled',
  disableElevation: 'DisableElevation',
  focusVisible: 'FocusVisible',
  fullWidth: 'FullWidth'
};

const variantStyles = (theme, ownerState) =>
  ({
    colorText: {
      color: theme.color[ownerState.color]?.body,
      backgroundColor: 'transparent',
      filter: theme.dropShadow[4],
      padding: theme.pxToRem(
        ...{
          mini: [3, 5],
          small: [4, 5],
          medium: [6, 8],
          large: [8, 11],
          jumbo: [10, 14],
          auto: [6, 8]
        }[ownerState.size]
      ),
      '&:hover': {
        backgroundColor: theme.alpha.add(theme.color[ownerState.color]?.body, 0.2)
      },
      [`&.${buttonClasses.disabled}`]: { color: theme.alpha.add(theme.color.disabled.text, 0.6) }
    },
    text: {
      color: theme.color.mode === 'dark' ? theme.color.white : theme.color.black,
      backgroundColor: 'transparent',
      filter: theme.dropShadow[4],
      padding: theme.pxToRem(
        ...{
          mini: [2, 10],
          small: [4, 10],
          medium: [6, 16],
          large: [8, 22],
          jumbo: [10, 28],
          auto: [6, 16]
        }[ownerState.size]
      ),
      '&:hover': {
        color: theme.color[ownerState.color]?.body,
        backgroundColor: theme.alpha.add(theme.color[ownerState.color]?.body, 0.2)
      },
      [`&.${buttonClasses.disabled}`]: { color: theme.alpha.add(theme.color.disabled.text, 0.6) }
    },
    outlined: {
      color: theme.color[ownerState.color]?.body,
      backgroundColor: 'transparent',
      boxShadow: theme.boxShadow[4],
      border: `1px solid ${theme.alpha.add(theme.color[ownerState.color]?.body, 1)}`,
      padding: theme.pxToRem(
        ...{
          mini: [1, 10],
          small: [3, 10],
          medium: [5, 16],
          large: [7, 22],
          jumbo: [9, 28],
          auto: [5, 16]
        }[ownerState.size]
      ),
      '&:hover': { backgroundColor: theme.alpha.add(theme.color[ownerState.color]?.body, 0.2) },
      [`&.${buttonClasses.disabled}`]: {
        color: theme.alpha.add(theme.color.disabled.text, 0.6),
        borderColor: theme.color.disabled.body
      }
    },
    filled: {
      color: theme.color[ownerState.color]?.text,
      backgroundColor: theme.color[ownerState.color]?.body,
      boxShadow: theme.boxShadow[4],
      padding: theme.pxToRem(
        ...{
          mini: [2, 10],
          small: [4, 10],
          medium: [6, 16],
          large: [8, 22],
          jumbo: [10, 28],
          auto: [6, 16]
        }[ownerState.size]
      ),
      '&:hover': { backgroundColor: theme.color[ownerState.color]?.[600] },
      [`&.${buttonClasses.disabled}`]: {
        color: theme.color.disabled.text,
        backgroundColor: theme.color.disabled.body
      }
    }
  }[ownerState.variant]);

const ButtonRoot = styled(ButtonBase, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes',
  name: 'Button',
  slot: 'Root'
})(
  ({ theme, ownerState }) => ({
    fontFamily: 'inherit',
    ...theme.text.typography.button,
    borderRadius: theme.rounded.md,
    minWidth: { mini: 64, small: 64, medium: 80, large: 96, jumbo: 128 }[ownerState.size],
    overflow: 'hidden',
    transition: theme.transition.create(
      ['background-color', 'box-shadow', 'border-color', 'color'],
      { duration: theme.transition.duration.shortest }
    ),
    '&:active': { transform: 'scale(0.95)' },
    [`&.${buttonClasses.focusVisible}`]: { transform: 'scale(0.95)' },
    ...(ownerState.fullWidth && {
      width: '100%'
    }),
    [`&.${buttonClasses.disabled}`]: {
      boxShadow: 'none',
      filter: 'none',
      pointerEvents: 'none'
    },
    '&:hover': {
      textDecoration: 'none',
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    },
    ...variantStyles(theme, ownerState),
    ...(ownerState.color === 'inherit' && {
      color: 'inherit',
      backgroundColor: 'transparent'
    })
  }),
  ({ ownerState }) => ({
    ...(ownerState.disableElevation && {
      boxShadow: 'none',
      filter: 'none',
      '&:hover': {
        boxShadow: 'none',
        filter: 'none'
      },
      [`&.${buttonClasses.focusVisible}`]: {
        boxShadow: 'none',
        filter: 'none'
      },
      '&:active': {
        boxShadow: 'none',
        filter: 'none'
      },
      [`&.${buttonClasses.disabled}`]: {
        boxShadow: 'none',
        filter: 'none'
      }
    })
  }),
  ({ ownerState }) => ownerState.cssStyles
);

const ButtonIcon = styled('span')(({ ownerState }) => ({
  display: 'inherit',
  alignItems: 'inherit',
  justifyContent: 'inherit',
  fontSize: 'inherit',
  marginTop: 4,
  marginBottom: 4,
  marginLeft: ownerState.position === 'start' ? 0 : 10,
  marginRight: ownerState.position === 'start' ? 10 : 0,
  lineHeight: 'inherit',
  height: {
    mini: '0.75rem',
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem',
    jumbo: '1.25rem',
    auto: '1rem'
  }[ownerState.size],
  width: {
    mini: '0.75rem',
    small: '0.875rem',
    medium: '1rem',
    large: '1.125rem',
    jumbo: '1.25rem',
    auto: '1rem'
  }[ownerState.size]
}));

const Button = React.forwardRef((inProps, ref) => {
  const contextProps = React.useContext(ButtonGroupContext);
  const props = mergeProps(contextProps, inProps);

  const {
    children,
    color = 'primary',
    component: componentProp = 'button',
    disabled = false,
    disableElevation = false,
    disableFocusRipple = false,
    endIcon: endIconProp,
    focusVisibleClassName,
    fullWidth = false,
    size = 'medium',
    slots = {},
    slotProps = {},
    startIcon: startIconProp,
    variant = 'text',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    color,
    cssStyles,
    disabled,
    disableElevation,
    disableFocusRipple,
    fullWidth,
    size,
    variant
  };

  const classes = {
    root: [
      buttonClasses.root,
      ownerState.disableElevation && buttonClasses.disableElevation,
      ownerState.fullWidth && buttonClasses.fullWidth
    ],
    startIcon: buttonClasses.startIcon,
    endIcon: buttonClasses.endIcon
  };

  const StartIconComponent = slots.startIcon || ButtonIcon;
  const startIconProps = useSlotProps({
    elementType: StartIconComponent,
    externalSlotProps: slotProps.startIcon,
    additionalProps: {
      size: ownerState.size
    },
    ownerState: { ...ownerState, position: 'start' },
    className: classes.startIcon
  });

  const startIcon = startIconProp && (
    <StartIconComponent {...startIconProps}>
      <Icon icon={startIconProp} transition='none' />
    </StartIconComponent>
  );

  const EndIconComponent = slots.endIcon || ButtonIcon;
  const endIconProps = useSlotProps({
    elementType: StartIconComponent,
    externalSlotProps: slotProps.endIcon,
    additionalProps: {
      size: ownerState.size
    },
    ownerState: { ...ownerState, position: 'end' },
    className: classes.endIcon
  });

  const endIcon = endIconProp && (
    <EndIconComponent {...endIconProps}>
      <Icon icon={endIconProp} transition='none' />
    </EndIconComponent>
  );

  const component = componentProp || 'button';
  const ButtonComponent = slots.root || ButtonRoot;

  const buttonRootProps = useSlotProps({
    elementType: ButtonComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      disabled: disabled,
      disableFocusRipple: disableFocusRipple,
      focusVisibleClassName: clsx(slotProps?.focusVisible, focusVisibleClassName),
      ref: ref,
      slotProps: slotProps
    },
    ownerState,
    className: classes.root
  });

  return (
    <ButtonComponent component={component} {...buttonRootProps}>
      {startIcon}
      {children}
      {endIcon}
    </ButtonComponent>
  );
});
Button.displayName = 'Button';

export default Button;
