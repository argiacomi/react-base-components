import * as Transitions from '@transitions';
import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import { ownerDocument, ownerWindow, useForkRef, useSlotProps } from '@components/lib';
import Modal from '../modal';
import Popper from '../popper';

export const popoverClasses = {
  root: 'Popover-Root',
  popper: 'Popover-Popper'
};

const getOffsetStyling = (anchorOrigin, transformOrigin) => {
  const transformOriginMapping = {
    vertical: { top: 0, center: 0.5, bottom: 1 },
    horizontal: { left: -0.5, center: 0, right: 0.5 }
  };

  const anchorOriginMapping = {
    vertical: { top: 1, center: 0.5, bottom: 0 },
    horizontal: { left: 0.5, center: 0, right: -0.5 }
  };

  const getMappedValue = (input, mapping) => ({
    vertical: mapping.vertical[input.vertical],
    horizontal: mapping.horizontal[input.horizontal]
  });

  return {
    referenceOffset: getMappedValue(anchorOrigin, anchorOriginMapping),
    floatingOffset: getMappedValue(transformOrigin, transformOriginMapping)
  };
};

function resolveAnchorEl(anchorEl) {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl;
}

export const PopoverRoot = styled(Modal)(({ ownerState }) => ({
  ...ownerState.cssStyles
}));

export const PopoverPopper = styled(Popper)(({ ownerState }) => ({
  position: ownerState.anchorReference === 'none' ? 'fixed' : 'absolute',
  overflowY: 'auto',
  overflowX: 'hidden',
  minWidth: 16,
  minHeight: 16,
  maxWidth: 'calc(100% - 32px)',
  maxHeight: 'calc(100% - 32px)',
  outline: 0,
  ...ownerState.cssStyles
}));

const Popover = React.forwardRef((props, ref) => {
  const {
    anchorEl,
    anchorOrigin = {
      vertical: 'top',
      horizontal: 'left'
    },
    anchorPosition,
    anchorReference = 'anchorEl',
    arrow = false,
    arrowWidth = 20,
    children,
    container: containerProp,
    elevation = 8,
    marginThreshold = 16,
    disableScrollLock = false,
    open,
    slots = {},
    slotProps = {},
    transformOrigin = {
      vertical: 'top',
      horizontal: 'left'
    },
    transition = 'Grow',
    transitionDuration: transitionDurationProp = 'auto',
    TransitionProps: { onEntering, ...TransitionProps } = {},
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const popperRef = React.useRef();
  const handlePopperRef = useForkRef(popperRef, slotProps.popper?.ref);

  const ownerState = {
    ...props,
    anchorOrigin,
    anchorReference,
    arrow,
    cssStyles,
    elevation,
    marginThreshold,
    transformOrigin,
    transition,
    transitionDuration: transitionDurationProp,
    TransitionProps
  };

  const offset = React.useCallback(
    ({ rects }) => {
      const { referenceOffset, floatingOffset } = getOffsetStyling(anchorOrigin, transformOrigin);

      return {
        mainAxis:
          -rects.reference.height * referenceOffset.vertical -
          rects.floating.height * floatingOffset.vertical +
          (arrow && arrowWidth / 2),
        crossAxis:
          -rects.reference.width * referenceOffset.horizontal -
          rects.floating.width * floatingOffset.horizontal
      };
    },
    [anchorOrigin, arrow, arrowWidth, transformOrigin]
  );

  const getAnchorEl = React.useCallback(() => {
    if (anchorReference === 'anchorPosition') {
      if (!import.meta.env.PROD && (!anchorPosition || typeof anchorPosition !== 'object')) {
        console.error(
          `You need to provide a valid 'anchorPosition' prop (in the form { left: number, top: number }) when using
        <Popover anchorReference="anchorPosition" />.`
        );
      }
      const { left = 0, top = 0 } = anchorPosition || {};
      return {
        getBoundingClientRect: () => ({
          left,
          top,
          right: left,
          bottom: top,
          width: 0,
          height: 0
        })
      };
    }

    if (anchorReference === 'none') {
      return null;
    }

    const resolvedAnchorEl = resolveAnchorEl(anchorEl);
    const anchorElement =
      resolvedAnchorEl && resolvedAnchorEl.nodeType === 1
        ? resolvedAnchorEl
        : ownerDocument(popperRef.current).body;

    if (!import.meta.env.PROD) {
      const box = anchorElement.getBoundingClientRect();
      if (
        !import.meta.env.TEST &&
        box.top === 0 &&
        box.left === 0 &&
        box.right === 0 &&
        box.bottom === 0
      ) {
        console.warn(
          `The 'anchorEl' prop provided to the component is invalid. The anchor element should be part of the document layout. Make sure the element is present in the document or that it's not display none.`
        );
      }
    }

    return anchorElement;
  }, [anchorEl, anchorPosition, anchorReference]);

  const handleEntering = (element, isAppearing) => {
    if (onEntering) {
      onEntering(element, isAppearing);
    }

    const containerWindow = ownerWindow(resolveAnchorEl(getAnchorEl()));
    const heightThreshold = containerWindow.innerHeight - marginThreshold;
    const elemRect = {
      width: element.offsetWidth,
      height: element.offsetHeight
    };

    if (!import.meta.env.PROD) {
      if (elemRect.height > heightThreshold && elemRect.height && heightThreshold) {
        console.error(
          `The popover component is too tall. Some part of it can not be seen on the screen (${
            elemRect.height - heightThreshold
          }px). Please consider adding a 'max-height' to improve the user-experience.`
        );
      }
    }
  };

  let transitionDuration = transitionDurationProp;

  if (transitionDurationProp === 'auto' && !Transitions[transition].supportAuto) {
    transitionDuration = undefined;
  }

  const container =
    containerProp || (anchorEl ? ownerDocument(resolveAnchorEl(anchorEl)).body : undefined);

  const RootSlot = slots.root || PopoverRoot;
  const PopperSlot = slots.popper || PopoverPopper;

  const popperProps = useSlotProps({
    elementType: PopperSlot,
    externalSlotProps: slotProps.popper,
    externalForwardedProps: other,
    additionalProps: {
      anchorEl: resolveAnchorEl(getAnchorEl()),
      disableArrow: !arrow,
      elevation,
      open,
      popperOptions: {
        arrow: { width: arrowWidth, padding: 8 },
        flip: false,
        ...(anchorReference !== 'none' ? { offset: offset } : {}),
        shift: { padding: marginThreshold },
        size: false,
        position: anchorReference === 'none' ? 'fixed' : 'absolute'
      },
      ref: handlePopperRef,
      transition: transition,
      TransitionProps: {
        appear: true,
        in: open,
        onEntering: handleEntering,
        timeout: transitionDuration,
        ...TransitionProps
      }
    },
    ownerState,
    className: clsx(popoverClasses.popper, slotProps.popper?.className)
  });

  const { slotProps: rootSlotPropsProp, ...rootProps } = useSlotProps({
    elementType: RootSlot,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref,
      slotProps: { backdrop: { invisible: true } },
      container,
      disableScrollLock,
      open
    },
    ownerState,
    className: clsx(popoverClasses.root)
  });

  return (
    <RootSlot
      {...rootProps}
      {...(!(typeof RootSlot === 'string') && { slotProps: rootSlotPropsProp })}
    >
      <PopperSlot disablePortal {...popperProps} ownerState={ownerState}>
        {children}
      </PopperSlot>
    </RootSlot>
  );
});

Popover.displayName = 'Popover';

export default Popover;
