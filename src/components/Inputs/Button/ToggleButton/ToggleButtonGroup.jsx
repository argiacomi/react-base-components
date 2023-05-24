import React, { forwardRef } from 'react';
import { cn } from '@utils';
import tw, { css } from 'twin.macro';

const groupVariants = {
  root: tw`inline-flex rounded-md shadow-md`,
  horizontal: tw`flex-row [&>*:not(:first-of-type)]:ml-[-1px] [&>*:not(:first-of-type)]:border-l [&>*:not(:first-of-type)]:border-solid [&>*:not(:first-of-type)]:border-l-transparent [&>*:not(:first-of-type)]:rounded-l-none  [&>*:not(:last-of-type)]:rounded-r-none`,
  vertical: tw`flex-col [&>*:not(:first-of-type)]:mt-[-1px] [&>*:not(:first-of-type)]:border-t [&>*:not(:first-of-type)]:border-solid [&>*:not(:first-of-type)]:border-t-transparent [&>*:not(:first-of-type)]:rounded-t-none  [&>*:not(:last-of-type)]:rounded-b-none`,
  fullWidth: tw`w-full`,
  disabled: tw`dark:text-disabled-dark text-disabled-light shadow-none drop-shadow-none`,
  disableElevation: tw`shadow-none drop-shadow-none`
};

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

    const groupStyles = [
      groupVariants.root,
      groupVariants[orientation],
      fullWidth && groupVariants.fullWidth,
      disabled && groupVariants.disabled,
      disableElevation && groupVariants.disableElevation
    ].filter(Boolean);

    return (
      <Component
        className={cn('group', className)}
        css={groupStyles}
        ref={ref}
        {...other}
      >
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
