import { forwardRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@utils';

const Toolbar = forwardRef(function Toolbar(props, ref) {
  const {
    className,
    Component = 'div',
    disableGutters = false,
    variant = 'regular',
    ...other
  } = props;

  const classes = cn(
    'z-1 relative flex items-center mx-auto box-border h-full w-full max-w-[2520px] scroll-mx-0 items-center min-h-[48px]',
    disableGutters ? 'px-0' : 'px-6 xl:px-10 2xl:px-20',
    variant === 'dense' ? '' : 'md:min-h-[64px]',
    className
  );

  return <Component className={classes} ref={ref} {...other} />;
});
Toolbar.displayName = 'Toolbar';

export default Toolbar;
