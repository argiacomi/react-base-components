import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@utils';

const paperVariants = cva('bg-white dark:bg-black transition-shadow', {
  variants: {
    elevation: {
      'elevation-0': 'shadow-none',
      'elevation-1': 'drop-shadow-md',
      'elevation-2': 'drop-shadow-lg',
      'elevation-3': 'drop-shadow-xl',
      'elevation-4': 'drop-shadow-2xl'
    }
  }
});

const Paper = forwardRef(
  (
    {
      className,
      Component = 'div',
      elevation = 'elevation-1',
      square = false,
      outline = false,
      ...otherProps
    },
    ref
  ) => {
    const paperClasses = cn(
      paperVariants({ elevation }),
      square ? 'rounded-none' : 'rounded-md',
      outline &&
        'border-[1px] border-solid shadow-none border-separatorLight dark:border-separatorDark',
      className
    );

    return <Component className={paperClasses} ref={ref} {...otherProps} />;
  }
);

Paper.displayName = 'Paper';

export { Paper, paperVariants };
