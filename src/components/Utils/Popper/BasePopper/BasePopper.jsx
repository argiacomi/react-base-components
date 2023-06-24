import React from 'react';
import clsx from 'clsx';
import styled from '@styles';
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

const BasePopperTooltip = styled(PopperTooltip)(({ ownerState }) => ({
  width: 'max-content',
  position: ownerState.position,
  top: 0,
  left: 0,
  display: !ownerState.open && 'none'
}));

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

  const transitionProps = transition
    ? {
        ...TransitionProps,
        timeout: TransitionProps?.timeout || 350,
        in: open,
        onEnter: handleEnter,
        onExited: handleExited
      }
    : undefined;

  const ownerState = { ...props, position: popperOptions.position, open, exited, style };

  if (!keepMounted && !open && (!transition || exited)) {
    return null;
  }

  return (
    <Portal disablePortal={disablePortal} container={container}>
      <BasePopperTooltip
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
        transition={transition}
        TransitionProps={transitionProps}
        ownerState={ownerState}
      >
        {children}
      </BasePopperTooltip>
    </Portal>
  );
});
BasePopper.displayName = 'BasePopper';

export default BasePopper;
