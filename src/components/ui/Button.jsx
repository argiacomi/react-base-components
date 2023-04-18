import { forwardRef, useRef, useCallback, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import ButtonBase from './ButtonBase/ButtonBase';

const buttonVariants = cva(
  'relative border-none inline-flex items-center justify-center rounded-md overflow-hidden transition-colors focus:outline-none cursor-pointer font-medium drop-shadow-md  w-auto min-w-[64px] active:scale-95',
  {
    variants: {
      color: {
        default: 'bg-gray-600 hover:bg-gray-700',
        primary: 'bg-primary-500 hover:bg-primary-600',
        secondary: 'bg-secondary-500 hover:bg-secondary-600',
        success: 'bg-success-500 hover:bg-success-600',
        warning: 'bg-warning-500 hover:bg-warning-600',
        danger: 'bg-danger-500 hover:bg-danger-600',
        monochrome: 'bg-black hover:bg-gray-900'
      },
      variant: {
        contain: 'bg-opacity-100 text-white',
        text: 'bg-opacity-0 text-black dark:text-white ',
        outline: 'bg-opacity-0 border border-solid border-current'
      },
      size: {
        xs: 'px-2 py-1 leading-4 text-xs',
        sm: 'px-3 py-1 leading-4 text-sm',
        md: 'px-3 py-1 leading-6 text-base',
        lg: 'px-5 py-1 leading-7 text-lg',
        xl: 'px-7 py-2 leading-8 text-xl'
      },
      disabled: {
        true: 'pointer-events-none bg-gray-100 text-gray-400 dark:bg-gray-300 dark:text-gray-600'
      }
    },
    compoundVariants: [
      {
        variant: 'outline',
        color: 'default',
        className: 'text-gray-600'
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
        color: 'default',
        className:
          'hover:text-gray-700 dark:hover:text-gray-700 hover:bg-gray-700/20'
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
          'hover:text-secondary-500dark:hover:text-secondary-500 hover:bg-secondary-500/20'
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
      color: 'default',
      variant: 'text',
      size: 'md'
    }
  }
);

const DrewButton = forwardRef(
  (
    { className, color, variant, size, fullWidth, disabled, onClick, ...props },
    ref
  ) => {
    return (
      <ButtonBase
        className={cn(
          buttonVariants({
            color,
            variant,
            size,
            fullWidth,
            disabled,
            className
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
DrewButton.displayName = 'DrewButton';

export { DrewButton, buttonVariants };
