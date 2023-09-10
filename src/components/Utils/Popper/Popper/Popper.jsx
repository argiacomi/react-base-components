import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { BasePopper } from '../basePopper';

export const popperClasses = {
  root: 'Popper-Root'
};

const PopperRoot = styled(BasePopper)(({ ownerState }) => ({
  ...ownerState.cssStyles
}));

const Popper = React.forwardRef((props, ref) => {
  const {
    className,
    elevation = 3,
    outlined = false,
    square = false,
    placement,
    popperOptions,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = { ...props, cssStyles };

  const defaultPopperOptions = {
    arrow: { width: 20, padding: 8 },
    autoPlace: false,
    autoUpdate: true,
    avoidCollisions: true,
    flip: true,
    hide: true,
    inline: false,
    offset: 5,
    placement: placement || 'bottom-center', //'top' | 'right' | 'bottom' | 'left' || 'start' | 'center' | 'end'
    position: 'absolute',
    shift: false, //{ padding: 5 }
    size: true
  };

  const mergedPopperOptions = {
    ...defaultPopperOptions,
    ...popperOptions
  };

  return (
    <PopperRoot
      className={clsx(popperClasses.root, className)}
      popperOptions={mergedPopperOptions}
      elevation={elevation}
      outlined={outlined}
      square={square}
      transition={cssStyles.transition}
      {...other}
      ref={ref}
      ownerState={ownerState}
    />
  );
});
Popper.displayName = 'Popper';

export default Popper;
