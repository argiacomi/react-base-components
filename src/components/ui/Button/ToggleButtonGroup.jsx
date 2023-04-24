import React, { createContext, forwardRef, useMemo, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

function isValueSelected(value, candidate) {
  if (candidate === undefined || value === undefined) {
    return false;
  }

  if (Array.isArray(candidate)) {
    return candidate.indexOf(value) >= 0;
  }

  return value === candidate;
}

const DrewToggleButtonGroup = forwardRef(function DrewToggleButtonGroup(
  props,
  ref
) {
  const {
    children,
    className,
    color = 'standard',
    Component = 'div',
    disabled = false,
    disableElevation = false,
    exclusive = false,
    fullWidth = false,
    onChange,
    orientation = 'horizontal',
    size = 'md',
    value,
    ...other
  } = props;

  const classes = `min-w-[40px] rounded-none active:scale-100 ${
    orientation === 'horizontal'
      ? 'ml-[-1px] first-of-type:ml-0 first-of-type:rounded-l-sm last-of-type:rounded-r-sm'
      : 'mt-[-1px] first-of-type:mt-0 first-of-type:rounded-t-sm last-of-type:rounded-b-sm'
  }`;

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
    <Component
      className={cn(
        'group inline-flex rounded-md shadow-md',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        disabled
          ? 'dark:tex-disabledDark text-disabledLight shadow-none drop-shadow-none'
          : '',
        disableElevation ? 'shadow-none drop-shadow-none' : '',
        fullWidth ? 'w-full' : ''
      )}
      ref={ref}
      {...other}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }
        return React.cloneElement(child, {
          className: cn(classes, child.props.className),
          onChange: exclusive ? handleExclusiveChange : handleChange,
          selected:
            child.props.selected === undefined
              ? isValueSelected(child.props.value, value)
              : child.props.selected,
          size: child.props.size || size,
          fullWidth: fullWidth,
          color: child.props.color || color,
          disabled: child.props.disabled || disabled,
          disableElevation: disableElevation
        });
      })}
    </Component>
  );
});

export { DrewToggleButtonGroup };
