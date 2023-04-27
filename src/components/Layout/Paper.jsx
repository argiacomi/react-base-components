import { cva } from 'class-variance-authority';
import { cn } from '@utils';

const paperVariants = cva('bg-white dark:bg-black transition-shadow', {
  variants: {
    elevation: {
      'elevation-0': 'shadow-none',
      'elevation-1': 'shadow-paper1',
      'elevation-2': 'shadow-paper2',
      'elevation-3': 'shadow-paper3',
      'elevation-4': 'shadow-paper4'
    }
  }
});

const Paper = ({
  className,
  Component = 'div',
  elevation = 'elevation-1',
  square = false,
  outline = false,
  ...otherProps
}) => {
  const paperClasses = cn(
    paperVariants({ elevation }),
    square ? 'rounded-none' : 'rounded-md',
    outline &&
      'border-[1px] border-solid shadow-none border-separatorLight dark:border-separatorDark',
    className
  );

  return <Component className={paperClasses} {...otherProps} />;
};

Paper.displayName = 'Paper';

export { Paper, paperVariants };
