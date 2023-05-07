import React, { forwardRef } from 'react';
import { cn } from '@utils';

function isValueSelected(value, candidate) {
  if (candidate === undefined || value === undefined) {
    return false;
  }

  if (Array.isArray(candidate)) {
    return candidate.indexOf(value) >= 0;
  }

  return value === candidate;
}

const ToggleButtonGroup = forwardRef(
  (
    {
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
    },
    ref
  ) => {
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

    const groupClasses = cn(
      'group inline-flex rounded-md shadow-md',
      orientation === 'horizontal' ? 'flex-row' : 'flex-col',
      disabled &&
        'dark:text-disabledDark text-disabledLight shadow-none drop-shadow-none',
      disableElevation && 'shadow-none drop-shadow-none',
      fullWidth && 'w-full',
      className
    );

    return (
      <Component className={groupClasses} ref={ref} {...other}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) {
            return null;
          }
          return React.cloneElement(child, {
            className: cn(child.props.className),
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
  }
);
ToggleButtonGroup.displayName = 'ToggleButtonGroup';

export default ToggleButtonGroup;
