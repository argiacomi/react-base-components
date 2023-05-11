import { forwardRef, useContext } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@utils';
import { ButtonBase } from '@components';
import { ButtonGroupContext } from './ButtonGroup';

const buttonVariants = cva(
  'inline-flex min-w-[64px] active:scale-95 rounded-md transition-colors items-center justify-center relative box-border font-medium w-auto bg-transparent outline-0 border-none border m-0 p-0 cursor-pointer select-none align-middle no-underline overflow-hidden',
  {
    variants: {
      color: {
        default: 'bg-gray-600 hover:bg-gray-700',
        primary: 'bg-primary-500 hover:bg-primary-600',
        secondary: 'bg-secondary-500 hover:bg-secondary-600',
        success: 'bg-success-500 hover:bg-success-600',
        warning: 'bg-warning-500 hover:bg-warning-600',
        danger: 'bg-danger-500 hover:bg-danger-600',
        monochrome:
          'bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-500 dark:text-black'
      },
      variant: {
        contain: 'bg-opacity-100 text-white shadow-md',
        text: 'bg-opacity-0 text-black dark:text-white drop-shadow-md',
        outline: 'bg-opacity-0 border border-solid border-current shadow-md'
      },
      size: {
        xs: 'px-3 py-1 leading-4 text-xs',
        sm: 'px-4 py-1 leading-4 text-sm',
        md: 'px-4 py-1 leading-6 text-base',
        lg: 'px-5 py-1 leading-7 text-lg',
        xl: 'px-6 py-2 leading-8 text-xl'
      }
    },
    compoundVariants: [
      {
        variant: 'outline',
        color: 'default',
        className: 'text-gray-700 dark:text-gray-600'
      },
      {
        variant: 'outline',
        color: 'primary',
        className: 'text-primary-500'
      },
      {
        variant: 'outline',
        color: 'secondary',
        className: 'text-secondary-500'
      },
      {
        variant: 'outline',
        color: 'success',
        className: 'text-success-500'
      },
      {
        variant: 'outline',
        color: 'warning',
        className: 'text-warning-500'
      },
      {
        variant: 'outline',
        color: 'danger',
        className: 'text-danger-500'
      },
      {
        variant: 'outline',
        color: 'monochrome',
        className: 'text-black'
      },
      {
        variant: ['text', 'outline'],
        color: 'default',
        className:
          'hover:text-gray-500 dark:hover:text-gray-500 hover:bg-gray-800/20'
      },
      {
        variant: ['text', 'outline'],
        color: 'primary',
        className:
          'hover:text-primary-500 dark:hover:text-primary-500 hover:bg-primary-500/20'
      },
      {
        variant: ['text', 'outline'],
        color: 'secondary',
        className:
          'hover:text-secondary-500 dark:hover:text-secondary-500 hover:bg-secondary-500/20'
      },
      {
        variant: ['text', 'outline'],
        color: 'success',
        className:
          'hover:text-success-500 dark:hover:text-success-500 hover:bg-success-500/20'
      },
      {
        variant: ['text', 'outline'],
        color: 'warning',
        className:
          'hover:text-warning-500 dark:hover:text-warning-500 hover:bg-warning-500/20'
      },
      {
        variant: ['text', 'outline'],
        color: 'danger',
        className:
          'hover:text-danger-500 dark:hover:text-danger-500 hover:bg-danger-500/20'
      },
      {
        variant: ['text', 'outline'],
        color: 'monochrome',
        className:
          'dark:text-white hover:text-black dark:hover:text-white hover:bg-gray-900/20'
      }
    ]
  }
);

const iconVariants = cva(
  'inline-flex items-center justify-center font-medium my-1',
  {
    variants: {
      edge: {
        start: 'mr-[10px]',
        end: 'ml-[10px]'
      },
      size: {
        xs: 'leading-4 h-[14px] w-[14px]',
        sm: 'leading-4 h-4 w-4',
        md: 'leading-6 h-[18px] w-[18px]',
        lg: 'leading-7 h-5 w-5',
        xl: 'leading-8 h-[22px] w-[22px]'
      }
    },
    compoundVariants: [
      {
        edge: 'start',
        size: ['xs', 'sm'],
        className: 'mr-2'
      },
      {
        edge: 'end',
        size: ['xs', 'sm'],
        className: 'ml-2'
      },
      {
        edge: 'start',
        size: ['lg', 'xl'],
        className: 'mr-3'
      },
      {
        edge: 'end',
        size: ['lg', 'xl'],
        className: 'ml-3'
      }
    ]
  }
);

const Button = forwardRef((props, ref) => {
  const contextProps = useContext(ButtonGroupContext);
  const {
    children,
    className,
    classes,
    color = 'primary',
    component = 'button',
    disabled = false,
    disableElevation = false,
    disableFocusRipple = false,
    endIcon: endIconProp,
    focusVisibleClassName,
    fullWidth = false,
    size = 'md',
    startIcon: startIconProp,
    variant = 'contain',
    ...other
  } = { ...props, ...contextProps };

  const buttonClasses = cn(
    buttonVariants({ color, variant, size }),
    classes,
    disabled &&
      'dark:shadown-none pointer-events-none border-none bg-disabledLight text-disabledText shadow-none drop-shadow-none dark:border-none dark:bg-disabledDark dark:text-disabledText dark:drop-shadow-none',
    disableElevation && 'shadow-none drop-shadow-none',
    fullWidth && 'w-full',
    className
  );

  const startIcon = startIconProp && (
    <span className={iconVariants({ edge: 'start', size })}>
      {startIconProp}
    </span>
  );

  const endIcon = endIconProp && (
    <span className={iconVariants({ edge: 'end', size })}>{endIconProp}</span>
  );

  return (
    <ButtonBase
      className={buttonClasses}
      focusRipple={!disableFocusRipple}
      focusVisibleClassName={cn(
        variant === 'contained' && 'shadow-lg',
        focusVisibleClassName
      )}
      ref={ref}
      type={component}
      {...other}
    >
      {startIcon}
      {children}
      {endIcon}
    </ButtonBase>
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
