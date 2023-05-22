import React, { forwardRef } from 'react';
import tw from 'twin.macro';
import { cn } from '@utils';

const paginationItemVariants = {
  root: tw`inline-flex items-center justify-center cursor-pointer`,
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
  selected: 'font-bold',
  disabled: 'pointer-events-none opacity-50'
};

const PaginationItem = forwardRef(
  (
    {
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
    },
    ref
  ) => {
    const paginationStyles = [
      paginationItemVariants.root,
      paginationItemVariants.color[color],
      paginationItemVariants.shape[shape],
      paginationItemVariants.size[size],
      selected && paginationItemVariants.variant,
      disabled && paginationItemVariants.selected
    ].filter(Boolean);

    return (
      <Component
        className={className}
        css={paginationStyles}
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
  }
);

PaginationItem.displayName = 'PaginationItem';

export default PaginationItem;
