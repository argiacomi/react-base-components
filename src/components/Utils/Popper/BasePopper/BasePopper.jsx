import React from 'react';
import clsx from 'clsx';
import { Portal, PopperTooltip } from '@components';

const resolveAnchorEl = (anchorEl) => (typeof anchorEl === 'function' ? anchorEl() : anchorEl);

const isHTMLElement = (element) => element.nodeType !== undefined;

const isDescendant = (parent, child) => {
  let node = child;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

const BasePopper = React.forwardRef((props, ref) => {
  const {
    anchorEl,
    children,
    className,
    component = 'div',
    disableArrow = false,
    slots = {},
    slotProps = {},
    container: containerProp,
    disablePortal = false,
    keepMounted = false,
    open = false,
    popperOptions = {},
    popperRef,
    style,
    transition,
    TransitionProps,
    ...other
  } = props;

  const [exited, setExited] = React.useState(true);

  const handleEnter = () => {
    setExited(false);
  };

  const handleExited = () => {
    setExited(true);
  };

  if (!keepMounted && !open && (!transition || exited)) {
    return null;
  }

  let container;
  if (containerProp) {
    container = containerProp;
  } else if (anchorEl) {
    const resolvedAnchorEl = resolveAnchorEl(anchorEl);

    container =
      resolvedAnchorEl &&
      isHTMLElement(resolvedAnchorEl) &&
      isDescendant(document.getElementById('root'), resolvedAnchorEl) &&
      document.getElementById('root');
  }
  const display = !open && keepMounted && (!transition || exited) ? 'none' : undefined;
  const transitionProps = transition
    ? {
        ...TransitionProps,
        timeout: TransitionProps.timeout || 350,
        in: open,
        onEnter: handleEnter,
        onExited: handleExited
      }
    : undefined;

  return (
    <Portal disablePortal={disablePortal} container={container}>
      <PopperTooltip
        anchorEl={anchorEl}
        className={clsx('BasePopper-Root', className)}
        component={component}
        disableArrow={disableArrow}
        slots={slots}
        slotProps={slotProps}
        open={transition ? !exited : open}
        popperOptions={popperOptions}
        popperRef={popperRef}
        ref={ref}
        {...other}
        style={{
          width: 'max-content',
          position: popperOptions.position,
          top: 0,
          left: 0,
          display,
          ...style
        }}
        transition={transition}
        TransitionProps={transitionProps}
      >
        {children}
      </PopperTooltip>
    </Portal>
  );
});
BasePopper.displayName = 'BasePopper';

export default BasePopper;
