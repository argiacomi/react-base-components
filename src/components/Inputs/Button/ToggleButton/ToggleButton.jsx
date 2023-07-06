import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { Icon } from '@components/display';
import ButtonBase from '../ButtonBase/ButtonBase';
import { toggleButtonGroupClasses } from './ToggleButtonGroup';

export const toggleButtonClasses = {
  root: 'ToggleButton-Root',
  selected: 'Selected',
  disabled: 'Disabled'
};

const ToggleButtonRoot = styled(ButtonBase)(({ theme, ownerState }) => ({
  appearance: 'none',
  fontWeight: theme.text.weight.medium,
  letterSpacing: '0.025em',
  borderRadius: theme.rounded.base,
  border: `1px solid ${theme.color.divider}`,
  colord: theme.color.text.primary,
  ...{
    mini: { padding: '0.25rem', ...theme.text.size.xs },
    small: { padding: '0.5rem', ...theme.text.size.sm },
    medium: { padding: '0.75rem', ...theme.text.size.base },
    large: { padding: '1rem', ...theme.text.size.lg },
    jumbo: { padding: '1.25rem', ...theme.text.size.xl }
  }[ownerState.size],
  [`&.${toggleButtonGroupClasses.selected}`]: {
    ...(ownerState.color === 'default' && {
      backgroundColor: theme.alpha.add(theme.color.monochrome[200], 0.2),
      '&:hover': {
        backgroundColor: theme.alpha.add(theme.color.monochrome[200], 0.3)
      }
    }),
    ...(ownerState.color !== 'default' && {
      color: theme.color[ownerState.color][500],
      backgroundColor:
        theme.color.mode === 'dark'
          ? theme.alpha.add(theme.color[ownerState.color][500], 0.3)
          : theme.alpha.add(theme.color[ownerState.color][500], 0.2),
      '&:hover': {
        backgroundColor:
          theme.color.mode === 'dark'
            ? theme.alpha.add(theme.color[ownerState.color][500], 0.25)
            : theme.alpha.add(theme.color[ownerState.color][500], 0.4)
      }
    })
  },
  ...(ownerState.disabled && {
    boxShadow: 'none',
    filter: 'none',
    pointerEvents: 'none',
    color: ownerState.selected ? theme.color.disabled.text : theme.color.disabled.body
  }),
  ...(ownerState.disableElevation && {
    boxShadow: 'none',
    filter: 'none'
  }),
  ...(ownerState.fullWidth && {
    width: '100%'
  }),
  ...ownerState.cssStyles
}));

const ToggleButton = React.forwardRef((props, ref) => {
  const {
    children,
    color = 'default',
    component: componentProp = 'button',
    disabled = false,
    disableRipple = false,
    disableFocusRipple = false,
    focusVisibleClassName,
    fullWidth = false,
    onChange,
    onClick,
    selected,
    size = 'medium',
    slots = {},
    slotProps = {},
    value,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    color,
    cssStyles,
    disabled,
    disableFocusRipple,
    fullWidth,
    size
  };

  const classes = {
    root: [
      toggleButtonClasses.root,
      ownerState.selected && toggleButtonClasses.selected,
      ownerState.disabled && toggleButtonClasses.disabled
    ]
  };

  const handleChange = (event) => {
    if (onClick) {
      onClick(event, value);
      if (event.defaultPrevented) {
        return;
      }
    }

    if (onChange) {
      onChange(event, value);
    }
  };

  let iconArray;
  if (props.icon) iconArray = Array.isArray(props.icon) ? props.icon : [props.icon];

  const component = componentProp || 'button';
  const ToggleButtonComponent = slots.root || ToggleButtonRoot;

  const toggleButtonRootProps = useSlotProps({
    elementType: ToggleButtonComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      disabled: disabled,
      disableRipple,
      disableFocusRipple,
      focusVisibleClassName: clsx(slotProps?.focusVisible, focusVisibleClassName),
      onClick: handleChange,
      onChange,
      value,
      'aria-pressed': selected,
      ref: ref,
      slotProps: slotProps
    },
    ownerState,
    className: classes.root
  });

  return (
    <ToggleButtonComponent component={component} {...toggleButtonRootProps}>
      {iconArray
        ? iconArray.map((icon, index) => <Icon key={index} icon={icon} transition='none' />)
        : null}
      {children}
    </ToggleButtonComponent>
  );
});

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;
