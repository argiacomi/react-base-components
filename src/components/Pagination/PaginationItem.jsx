import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

const paginationItemVariants = cva(
  'inline-flex items-center justify-center cursor-pointer',
  {
    variants: {
      color: {
        default: 'text-black dark:text-white',
        primary: 'text-primary',
        secondary: 'text-secondary',
        success: 'text-success',
        warning: 'text-warning',
        danger: 'text-danger'
      },
      shape: {
        circular: 'rounded-full',
        rounded: 'rounded-md'
      },
      size: {
        small: 'text-xs px-2 py-1',
        medium: 'text-base px-3 py-2',
        large: 'text-xl px-4 py-3'
      },
      variant: {
        text: 'bg-transparent',
        outlined: 'border border-current'
      },
      selected: {
        true: 'font-bold'
      },
      disabled: {
        true: 'pointer-events-none opacity-50'
      }
    }
  }
);

const PaginationItem = forwardRef((props, ref) => {
  const {
    className,
    color = 'default',
    component: Component = 'div',
    disabled = false,
    page,
    selected = false,
    shape = 'circular',
    size = 'medium',
    type = 'page',
    variant = 'text',
    onClick
  } = props;

  const itemClass = paginationItemVariants({
    color,
    shape,
    size,
    variant,
    selected,
    disabled
  });

  return (
    <Component
      className={cn(itemClass, className)}
      ref={ref}
      disabled={disabled}
      onClick={onClick}
    >
      {type === 'page'
        ? page
        : type === 'previous'
        ? '<'
        : type === 'next'
        ? '>'
        : '...'}
    </Component>
  );
});

PaginationItem.displayName = 'PaginationItem';

export { PaginationItem, paginationItemVariants };
