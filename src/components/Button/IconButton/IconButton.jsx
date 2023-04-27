import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@utils';
import { ButtonBase } from '@component/button';

const IconButtonVariants = cva(
  'text-center flex-[0_0_auto] rounded-full overflow-visible transition-colors box-content',
  {
    variants: {
      edge: {
        start: 'ml-[-12px]',
        end: 'mr-[-12px]'
      },
      color: {
        inherit: 'text-inherit fill-inherit hover:bg-black/5',
        primary: 'text-primary-500 fill-primary-500 hover:bg-primary-500/20',
        secondary:
          'text-secondary-500 fill-secondary-500 hover:bg-secondary-500/20',
        success: 'text-success-500 fill-success-500 hover:bg-success-500/20',
        warning: 'text-warning-500 fill-warning-500 hover:bg-warning-500/20',
        danger: 'text-danger-500 fill-danger-500 hover:bg-danger-500/20'
      },
      size: {
        xs: 'p-1 h-6 w-6',
        sm: 'p-[6px] h-6 w-6',
        md: 'p-2 h-6 w-6',
        lg: 'p-3 h-6 w-6',
        xl: 'p-[14px] h-6 w-6'
      }
    },
    compoundVariants: [
      {
        edge: 'start',
        size: ['xs', 'sm'],
        className: 'ml-[-3px]'
      }
    ]
  }
);

const IconButton = forwardRef(
  (
    {
      edge = false,
      children,
      className,
      color = 'inherit',
      disabled = false,
      disableFocusRipple = false,
      disableRipple = false,
      size = 'md',
      ...other
    },
    ref
  ) => {
    const buttonClasses = cn(
      IconButtonVariants({ edge, color, size }),
      disabled &&
        'pointer-events-none text-disabledLight dark:text-disabledDark',
      className
    );

    return (
      <ButtonBase
        className={buttonClasses}
        centerRipple
        disabled={disabled}
        focusRipple={!disableFocusRipple}
        disableRipple={disableRipple}
        ref={ref}
        {...other}
      >
        {children}
      </ButtonBase>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton, IconButtonVariants };
