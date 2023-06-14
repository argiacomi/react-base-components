import React from 'react';
import clsx from 'clsx';

const Box = React.forwardRef(({ className, component, ...other }, ref) => {
  const BoxRoot = component || 'div';
  return <BoxRoot ref={ref} className={clsx('Box-root', className)} {...other} />;
});
Box.displayName = 'Box';

export default Box;
