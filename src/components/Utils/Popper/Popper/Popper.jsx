import React from 'react';
import clsx from 'clsx';
import { BasePopper } from '../BasePopper';

const Popper = React.forwardRef((props, ref) => {
  const { className, placement, popperOptions, ...other } = props;

  const defaultPopperOptions = {
    arrow: { width: 16, padding: 8 },
    autoPlace: false,
    autoUpdate: true,
    avoidCollisions: true,
    flip: true,
    hide: true,
    inline: false,
    offset: 5,
    placement: placement || 'botom-center', //'top' | 'right' | 'bottom' | 'left' || 'start' | 'center' | 'end'
    position: 'absolute',
    shift: false, //{ padding: 5 }
    size: true
  };

  const mergedPopperOptions = {
    ...defaultPopperOptions,
    ...popperOptions
  };

  return (
    <BasePopper
      className={clsx('Popper-Root', className)}
      popperOptions={mergedPopperOptions}
      {...other}
      ref={ref}
    />
  );
});
Popper.displayName = 'Popper';

export default Popper;
