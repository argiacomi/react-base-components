import { forwardRef, useContext } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';
import ButtonBase from './ButtonBase/ButtonBase';
import { ButtonGroupContext } from './ButtonGroup';

const buttonVariants = cva(
  'inline-flex min-w-[64px] active:scale-95 rounded-md transition-colors items-center justify-center relative box-border font-medium w-auto bg-transparent outline-0 border-none border m-0 p-0 cursor-pointer select-none align-middle no-underline overflow-hidden',
  {
    variants: {
      color: {
        inherit: 'bg-gray-600 hover:bg-gray-700',
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
        xs: 'px-2 py-1 leading-4 text-xs',
        sm: 'px-3 py-1 leading-4 text-sm',
        md: 'px-3 py-1 leading-6 text-base',
        lg: 'px-5 py-1 leading-7 text-lg',
        xl: 'px-7 py-2 leading-8 text-xl'
      }
    },
    compoundVariants: [
      {
        variant: 'outline',
        color: 'inherit',
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
        className: 'text-monochrome'
      },
      {
        variant: ['text', 'outline'],
        color: 'inherit',
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
    ],
    defaultVariants: {
      color: 'primary',
      variant: 'contain',
      size: 'md'
    }
  }
);

const Button = forwardRef((props, ref) => {
  const contextProps = useContext(ButtonGroupContext);
  const {
    children,
    className,
    classes,
    color,
    component = 'button',
    disabled = false,
    disableElevation = false,
    disableFocusRipple = false,
    focusVisibleClassName,
    fullWidth = false,
    size,
    variant,
    ...other
  } = { ...props, ...contextProps };

  const buttonClasses = cn(
    buttonVariants({ color, variant, size }),
    classes,
    disabled
      ? 'dark:shadown-none pointer-events-none border-none bg-disabledLight text-gray-800 shadow-none drop-shadow-none dark:border-none dark:bg-disabledDark dark:text-gray-800 dark:drop-shadow-none'
      : '',
    disableElevation ? 'shadow-none drop-shadow-none' : '',
    fullWidth ? 'w-full' : '',
    className
  );

  return (
    <ButtonBase
      className={buttonClasses}
      focusRipple={!disableFocusRipple}
      focusVisibleClassName={cn(
        variant === 'contained' ? 'shadow-lg' : '',
        focusVisibleClassName
      )}
      ref={ref}
      type={component}
      {...other}
    >
      {children}
    </ButtonBase>
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
