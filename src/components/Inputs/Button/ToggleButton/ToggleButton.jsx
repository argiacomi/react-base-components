import { forwardRef } from 'react';
import tw, { css } from 'twin.macro';
import { ButtonBase } from '@components';

const toggleButtonVariants = {
  root: tw`appearance-none font-medium tracking-wide rounded-md px-3 py-2 border-[1px] border-solid border-dividerLight dark:border-dividerDark text-gray-700 hover:bg-gray-700/10 dark:text-gray-300 dark:hover:bg-gray-300/10`,
  size: {
    xs: tw`p-1 text-xs`,
    small: tw`p-2 text-sm`,
    medium: tw`p-3 text-base`,
    large: tw`p-4 text-lg`,
    xl: tw`p-5 text-xl`
  },
  compoundVariants: {
    default: tw`bg-gray-700/20 hover:bg-gray-700/30 dark:bg-gray-300/20 dark:hover:bg-gray-300/30`,
    primary: tw`text-primary-500 bg-primary-500/20 hover:bg-primary-500/25 dark:bg-primary-500/30 dark:hover:bg-primary-500/40`,
    secondary: tw`text-secondary-500 bg-secondary-500/20 hover:bg-secondary-500/25 dark:bg-secondary-500/30 dark:hover:bg-secondary-500/40`,
    success: tw`text-success-500 bg-success-500/20 hover:bg-success-500/25 dark:bg-success-500/30 dark:hover:bg-success-500/40`,
    warning: tw`text-warning-500 bg-warning-500/20 hover:bg-warning-500/25 dark:bg-warning-500/30 dark:hover:bg-warning-500/40`,
    danger: tw`text-danger-500 bg-danger-500/20 hover:bg-danger-500/25 dark:bg-danger-500/30 dark:hover:bg-danger-500/40`
  }
};

const ToggleButton = forwardRef(
  (
    {
      children,
      className,
      color = 'default',
      disabled = false,
      disableElevation = false,
      disableFocusRipple = false,
      fullWidth = false,
      onChange,
      onClick,
      selected = 'false',
      size = 'medium',
      value,
      ...other
    },
    ref
  ) => {
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

    const buttonStyles = [
      toggleButtonVariants.root,
      toggleButtonVariants.size[size],
      selected && toggleButtonVariants.compoundVariants[color],
      disabled &&
        tw`dark:shadow-none pointer-events-none text-disabledLight shadow-none drop-shadow-none dark:text-disabledDark dark:drop-shadow-none`,
      disableElevation && tw`shadow-none drop-shadow-none`,
      fullWidth && tw`w-full`
    ].filter(Boolean);

    return (
      <ButtonBase
        className={className}
        css={buttonStyles}
        focusRipple={!disableFocusRipple}
        ref={ref}
        onClick={handleChange}
        onChange={onChange}
        value={value}
        aria-pressed={selected}
        {...other}
      >
        {children}
      </ButtonBase>
    );
  }
);

ToggleButton.displayName = 'ToggleButton';

export { ToggleButton };
