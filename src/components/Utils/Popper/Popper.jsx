import BasePopper from './BasePopper';
import { forwardRef } from 'react';

const Popper = forwardRef(
  (
    {
      anchorEl,
      component,
      components,
      componentsProps,
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
    const defaultPopperOptions = {
      arrow: true,
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

    return (
      <BasePopper
        arrow={mergedPopperOptions?.arrow}
        autoPlace={mergedPopperOptions?.autoPlace}
        autoUpdate={mergedPopperOptions?.autoUpdate}
        avoidCollisions={mergedPopperOptions?.avoidCollisions}
        componentsProps={componentsProps}
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
