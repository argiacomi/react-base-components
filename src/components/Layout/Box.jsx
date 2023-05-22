import * as React from 'react';

const Box = React.forwardRef(({ className, component, ...other }, ref) => {
  const Component = component || 'div';
  return <Component ref={ref} className={className} {...other} />;
});
Box.displayName = 'Box';

export default Box;
