import React from 'react';
import { styled } from '@styles';
import clsx from 'clsx';

export const toggleButtonGroupClasses = {
  root: 'ToggleButtonGroup-Root',
  grouped: 'ToggleButtonGroup-Button',
  selected: 'ToggleButtonGroup-selected',
  disabled: 'ToggleButtonGroup-disabled'
};

const ToggleButtonGroupRoot = styled('div')(({ ownerState, theme }) => ({
  display: 'inline-flex',
  borderRadius: theme.rounded.base,
  flexDirection: ownerState.orientation === 'vertical' ? 'column' : 'row',
  ...(ownerState.fullWidth && {
    width: '100%'
  }),
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    ...(ownerState.orientation === 'horizontal'
      ? {
          '&:not(:first-of-type)': {
            marginLeft: -1,
            borderLeft: '1px solid transparent',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          },
          '&:not(:last-of-type)': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          },
          [`&.${toggleButtonGroupClasses.selected} + .${toggleButtonGroupClasses.grouped}.${toggleButtonGroupClasses.selected}`]:
            {
              borderLeft: 0,
              marginLeft: 0
            }
        }
      : {
          '&:not(:first-of-type)': {
            marginTop: -1,
            borderTop: '1px solid transparent',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0
          },
          '&:not(:last-of-type)': {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          },
          [`&.${toggleButtonGroupClasses.selected} + .${toggleButtonGroupClasses.grouped}}.${toggleButtonGroupClasses.selected}`]:
            {
              borderTop: 0,
              marginTop: 0
            }
        })
  }
}));

function isValueSelected(value, candidate) {
  if (candidate === undefined || value === undefined) {
    return false;
  }

  if (Array.isArray(candidate)) {
    return candidate.indexOf(value) >= 0;
  }

  return value === candidate;
}

const ToggleButtonGroup = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    color = 'default',
    disabled = false,
    disableElevation = false,
    exclusive = false,
    fullWidth = false,
    onChange,
    orientation = 'horizontal',
    size = 'medium',
    value,
    ...other
  } = props;

  const ownerState = { ...props, disabled, fullWidth, orientation, size, toggleButtonGroupClasses };

  const classes = {
    root: [toggleButtonGroupClasses.root],
    grouped: [toggleButtonGroupClasses.grouped, disabled && toggleButtonGroupClasses.disabled]
  };

  const handleChange = (event, buttonValue) => {
    if (!onChange) {
      return;
    }
    const index = value && value.indexOf(buttonValue);
    let newValue;

    if (value && index >= 0) {
      newValue = value.slice();
      newValue.splice(index, 1);
    } else {
      newValue = value ? value.concat(buttonValue) : [buttonValue];
    }
    onChange(event, newValue);
  };

  const handleExclusiveChange = (event, buttonValue) => {
    if (!onChange) {
      return;
    }

    onChange(event, value === buttonValue ? null : buttonValue);
  };

  return (
    <ToggleButtonGroupRoot
      role='group'
      className={clsx(classes.root, className)}
      ref={ref}
      ownerState={ownerState}
      {...other}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        return React.cloneElement(child, {
          className: clsx(classes.grouped, child.props.className),
          onChange: exclusive ? handleExclusiveChange : handleChange,
          selected:
            child.props.selected === undefined
              ? isValueSelected(child.props.value, value)
              : child.props.selected,
          size: child.props.size || size,
          fullWidth,
          color: child.props.color || color,
          disabled: child.props.disabled || disabled,
          disableElevation: child.props.disableElevation || disableElevation
        });
      })}
    </ToggleButtonGroupRoot>
  );
});
ToggleButtonGroup.displayName = 'ToggleButtonGroup';

export default ToggleButtonGroup;
