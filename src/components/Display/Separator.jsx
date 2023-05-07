import { forwardRef } from 'react';
import { cn } from '@utils';

const getClasses = ({ absolute, className, flexItem, orientation, variant }) =>
  cn(
    'm-0 flex-shrink-0 border-0 border-solid border-separatorLight dark:border-separatorDark',
    absolute && 'absolute bottom-0 left-0 w-full',
    flexItem && 'self-stretch h-fit',
    orientation === 'vertical'
      ? 'h-auto border-r-[thin]'
      : 'border-b-[thin] w-auto',
    variant === 'middle' ? (orientation === 'vertical' ? 'mx-4' : 'my-4') : '',
    variant === 'inset' ? (orientation === 'vertical' ? 'ml-16' : 'mt-16') : '',
    className
  );

const Separator = forwardRef(
  (
    {
      absolute = false,
      children,
      className,
      Component = children ? 'div' : 'hr',
      flexItem = false,
      light = false,
      orientation = 'horizontal',
      role = Component !== 'hr' ? 'separator' : undefined,
      variant = 'fullWidth',
      ...other
    },
    ref
  ) => {
    const classes = getClasses({
      absolute,
      className,
      flexItem,
      orientation,
      variant
    });

    return (
      <Component className={classes} role={role} ref={ref} {...other}>
        {children && <span>{children}</span>}
      </Component>
    );
  }
);

Separator.displayName = 'Separator';

export default Separator;
