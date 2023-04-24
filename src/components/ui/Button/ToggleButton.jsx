import { forwardRef, useContext } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';
import ButtonBase from './ButtonBase/ButtonBase';

const drewToggleButtonVariants = cva(
  'appearance-none font-medium tracking-wide rounded-md px-3 py-2 border-[1px] border-solid border-separatorLight dark:border-separatorDark text-gray-700 hover:bg-gray-700/10 dark:text-gray-300 dark:hover:bg-gray-300/10',
  {
    variants: {
      selected: {
        true: ''
      },
      color: {
        standard: '',
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        danger: ''
      },
      size: {
        xs: 'p-1 text-xs',
        sm: 'p-2 text-sm',
        md: 'p-3 text-base',
        lg: 'p-4 text-lg',
        xl: 'p-5 text-xl'
      }
    },
    compoundVariants: [
      {
        selected: true,
        color: 'standard',
        className:
          'bg-gray-700/20 dark:bg-gray-300/20 hover:bg-gray-700/30 dark:bg-gray-300/20 dark:hover:bg-gray-300/30'
      },
      {
        selected: true,
        color: 'primary',
        className:
          'text-primary-500 bg-primary-500/20 hover:bg-primary-500/25 dark:bg-primary-500/30 dark:hover:bg-primary-500/40'
      },
      {
        selected: true,
        color: 'secondary',
        className:
          'text-secondary-500 bg-secondary-500/20 hover:bg-secondary-500/25 dark:bg-secondary-500/30 hover:bg-secondary-500/40'
      },
      {
        selected: true,
        color: 'success',
        className:
          'text-success-500 bg-success-500/20 hover:bg-success-500/25 dark:bg-success-500/30 hover:bg-success-500/40'
      },
      {
        selected: true,
        color: 'warning',
        className:
          'text-warning-500 bg-warning-500/20 hover:bg-warning-500/25 dark:bg-warning-500/30 hover:bg-warning-500/40'
      },
      {
        selected: true,
        color: 'danger',
        className:
          'text-danger-500 bg-danger-500/20 hover:bg-danger-500/25 dark:bg-danger-500/30 hover:bg-danger-500/40'
      }
    ],
    defaultVariants: {
      selected: false,
      color: 'primary',
      size: 'md'
    }
  }
);

const DrewToggleButton = forwardRef((props, ref) => {
  const {
    children,
    className,
    color,
    disabled = false,
    disableElevation = false,
    disableFocusRipple = false,
    fullWidth = false,
    onChange,
    onClick,
    selected,
    size,
    value,
    ...other
  } = props;

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

  return (
    <ButtonBase
      className={cn(
        drewToggleButtonVariants({
          selected,
          color,
          size
        }),
        disabled
          ? 'dark:shadown-none pointer-events-none text-disabledLight shadow-none drop-shadow-none dark:text-disabledDark dark:drop-shadow-none'
          : '',
        disableElevation ? 'shadow-none drop-shadow-none' : '',
        fullWidth ? 'w-full' : '',
        className
      )}
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
});

DrewToggleButton.displayName = 'DrewToggleButton';

export { DrewToggleButton, drewToggleButtonVariants };
