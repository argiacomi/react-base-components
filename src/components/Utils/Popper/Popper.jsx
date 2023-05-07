import BasePopper from './BasePopper';
import { forwardRef } from 'react';

const Popper = forwardRef(
  (
    {
      anchorEl,
      component,
      components,
      componentsProps = {
        arrow: {
          transform: 'rotate(45deg);'
        }
      },
      container,
      disablePortal,
      keepMounted,
      open,
      popperOptions,
      popperRef,
      transition,
      ...other
    },
    ref
  ) => {
    const otherProps = {
      anchorEl,
      container,
      component,
      components,
      componentsProps,
      disablePortal,
      keepMounted,
      open,
      popperRef,
      transition,
      ...other
    };

    const defaultPopperOptions = {
      arrow: false,
      autoPlace: false,
      autoUpdate: true,
      avoidCollisions: true,
      flip: true,
      hide: true,
      inline: false,
      offset: 5,
      placement: 'botom-center', //'top' | 'right' | 'bottom' | 'left' || 'start' | 'center' | 'end'
      position: 'absolute',
      shift: true, //{ padding: 5 }
      size: true
    };

    const mergedPopperOptions = {
      ...defaultPopperOptions,
      ...popperOptions
    };

    return (
      <BasePopper
        arrow={mergedPopperOptions?.arrow}
        autoPlace={mergedPopperOptions?.autoPlace}
        autoUpdate={mergedPopperOptions?.autoUpdate}
        avoidCollisions={mergedPopperOptions?.avoidCollisions}
        flip={mergedPopperOptions?.flip}
        hide={mergedPopperOptions?.hide}
        inline={mergedPopperOptions?.inline}
        offset={mergedPopperOptions?.offset}
        placement={mergedPopperOptions?.placement}
        position={mergedPopperOptions?.position}
        shift={mergedPopperOptions?.shift}
        size={mergedPopperOptions?.size}
        {...otherProps}
        ref={ref}
      />
    );
  }
);
Popper.displayName = 'Popper';

export default Popper;
