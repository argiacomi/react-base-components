import { forwardRef } from 'react';
import { cn } from '@utils';

const elevationClass = [
  'shadow-none',
  'drop-shadow-md',
  'drop-shadow-lg',
  'drop-shadow-xl',
  'drop-shadow-2xl'
];

const Paper = forwardRef(
  (
    {
      className,
      Component = 'div',
      elevation = 1,
      square = false,
      outline = false,
      ...otherProps
    },
    ref
  ) => {
    const paperClasses = cn(
      elevationClass[elevation],
      square ? 'rounded-none' : 'rounded-md',
      outline &&
        'border-[1px] border-solid shadow-none border-separatorLight dark:border-separatorDark',
      className
    );

    return <Component className={paperClasses} ref={ref} {...otherProps} />;
  }
);

Paper.displayName = 'Paper';

export { Paper };
