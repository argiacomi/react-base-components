import React from 'react';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { ButtonBase, Icon } from '@components';

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
  [`&.${ownerState.toggleButtonClasses.selected}`]: {
    ...(ownerState.color === 'default' && {
      backgroundColor: theme.alpha.add(theme.color.monochrome[200], 0.2),
      '&:hover': {
        backgroundColor: theme.alpha.add(theme.color.monochrome[200], 0.3)
      }
    }),
    ...(ownerState.color !== 'default' && {
      color: theme.color[ownerState.color][500],
      backgroundColor:
        theme.coloe.mode === 'dark'
          ? theme.alpha.add(theme.color[ownerState.color][500], 0.3)
          : theme.alpha.add(theme.color[ownerState.color][500], 0.2),
      '&:hover': {
        backgroundColor:
          theme.coloe.mode === 'dark'
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
  })
}));

const ToggleButton = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    classes = {},
    color = 'standard',
    disabled = false,
    disableFocusRipple = false,
    fullWidth = false,
    onChange,
    onClick,
    selected,
    size = 'medium',
    value,
    ...other
  } = props;

  const toggleButtonClasses = {
    grouped: classes.grouped,
    selected: selected && classes.selected,
    disabled: classes.disabled
  };

  const ownerState = {
    ...props,
    color,
    disabled,
    disableFocusRipple,
    fullWidth,
    size,
    toggleButtonClasses
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

  const iconArray = Array.isArray(props.icon) ? props.icon : [props.icon];

  return (
    <ToggleButtonRoot
      className={clsx('ToggleButton-Root', Object.values(toggleButtonClasses), className)}
      disabled={disabled}
      focusRipple={!disableFocusRipple}
      ref={ref}
      onClick={handleChange}
      onChange={onChange}
      value={value}
      ownerState={ownerState}
      aria-pressed={selected}
      {...other}
    >
      {iconArray.map((icon, index) => (
        <Icon key={index} icon={icon} css={{ transition: 'none' }} />
      ))}
      {children}
    </ToggleButtonRoot>
  );
});

ToggleButton.displayName = 'ToggleButton';

export default ToggleButton;
