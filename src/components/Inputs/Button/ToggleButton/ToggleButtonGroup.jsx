import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';

export const toggleButtonGroupClasses = {
  root: 'ToggleButtonGroup-Root',
  grouped: 'ToggleButtonGroup-Button',
  selected: 'Selected',
  disabled: 'Disabled'
};

const ToggleButtonGroupRoot = styled('div')(({ ownerState, theme }) => ({
  display: 'inline-flex',
  width: 'fit-content',
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
  },
  ...ownerState.cssStyles
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
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
    disabled,
    fullWidth,
    orientation,
    size,
    toggleButtonGroupClasses
  };

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
