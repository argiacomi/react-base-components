import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const paperVariants = cva(' w-fit transition-colors', {
  variants: {
    variant: {
      'elevation-0': 'shadow-none',
      'elevation-1': 'shadow-paper1',
      'elevation-2': 'shadow-paper2',
      'elevation-3': 'shadow-paper3'
    },
    square: {
      true: 'rounded-none',
      false: 'rounded-md'
    },
    outline: {
      true: 'border-2 border-solid shadow-none border-gray-100 dark:border-gray-500'
    }
  },
  defaultVariants: {
    variant: 'elevation-1',
    square: false,
    outline: false
  }
});

const Paper = ({
  className,
  Component = 'div',
  variant,
  square,
  outline,
  ...otherProps
}) => {
  return (
    <Component
      className={cn(
        paperVariants({
          variant,
          square,
          outline
        }),
        className
      )}
      {...otherProps}
    />
  );
};

Paper.displayName = 'Paper';

export { Paper, paperVariants };
