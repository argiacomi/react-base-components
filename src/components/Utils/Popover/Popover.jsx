import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { debounce, ownerDocument, ownerWindow, useForkRef, useSlotProps } from '@components/lib';
import Grow from '../Transitions/Grow';
import { Modal } from '../Modal';
import { Paper } from '@components/surfaces';

const popoverClasses = {
  root: 'Popover-Root',
  paper: 'Popover-Paper'
};

export function getOffsetTop(rect, vertical) {
  let offset = 0;

  if (typeof vertical === 'number') {
    offset = vertical;
  } else if (vertical === 'center') {
    offset = rect.height / 2;
  } else if (vertical === 'bottom') {
    offset = rect.height;
  }

  return offset;
}

export function getOffsetLeft(rect, horizontal) {
  let offset = 0;

  if (typeof horizontal === 'number') {
    offset = horizontal;
  } else if (horizontal === 'center') {
    offset = rect.width / 2;
  } else if (horizontal === 'right') {
    offset = rect.width;
  }

  return offset;
}

function getTransformOriginValue(transformOrigin) {
  return [transformOrigin.horizontal, transformOrigin.vertical]
    .map((n) => (typeof n === 'number' ? `${n}px` : n))
    .join(' ');
}

function resolveAnchorEl(anchorEl) {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl;
}

export const PopoverRoot = styled(Modal)({});

export const PopoverPaper = styled(Paper)(({ theme, css }) => ({
  position: 'absolute',
  overflowY: 'auto',
  overflowX: 'hidden',
  minWidth: theme.spacing(2),
  minHeight: theme.spacing(2),
  maxWidth: `calc(100% - ${theme.spacing(4)})`,
  maxHeight: `calc(100% - ${theme.spacing(4)})`,
  outline: 0,
  ...css
}));

const Popover = React.forwardRef((props, ref) => {
  const {
    action,
    anchorEl,
    anchorOrigin = {
      vertical: 'top',
      horizontal: 'left'
    },
    anchorPosition,
    anchorReference = 'anchorEl',
    children,
    className,
    container: containerProp,
    elevation = 8,
    marginThreshold = 16,
    open,
    PaperProps: PaperPropsProp = {},
    slots,
    slotProps,
    transformOrigin = {
      vertical: 'top',
      horizontal: 'left'
    },
    TransitionComponent = Grow,
    transitionDuration: transitionDurationProp = 'auto',
    TransitionProps: { onEntering, ...TransitionProps } = {},
    ...other
  } = props;

  const {
    css: externalPaperSlotCss,
    classes: externalPaperSlotClasses,
    ...externalPaperSlotProps
  } = slotProps?.paper ?? PaperPropsProp;

  const paperRef = React.useRef();
  const handlePaperRef = useForkRef(paperRef, externalPaperSlotProps.ref);

  const ownerState = {
    ...props,
    anchorOrigin,
    anchorReference,
    elevation,
    marginThreshold,
    externalPaperSlotProps,
    transformOrigin,
    TransitionComponent,
    transitionDuration: transitionDurationProp,
    TransitionProps
  };

  const [isPositioned, setIsPositioned] = React.useState(open);

  const getAnchorOffset = React.useCallback(() => {
    if (anchorReference === 'anchorPosition') {
      if (!import.meta.env.PROD) {
        if (!anchorPosition) {
          console.error(
            `You need to provide a 'anchorPosition' prop when using
            <Popover anchorReference="anchorPosition" />.`
          );
        }
      }
      return anchorPosition;
    }

    const resolvedAnchorEl = resolveAnchorEl(anchorEl);

    // If an anchor element wasn't provided, just use the parent body element of this Popover
    const anchorElement =
      resolvedAnchorEl && resolvedAnchorEl.nodeType === 1
        ? resolvedAnchorEl
        : ownerDocument(paperRef.current).body;
    const anchorRect = anchorElement.getBoundingClientRect();

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
          `The 'anchorEl' prop provided to the component is invalid.
          The anchor element should be part of the document layout.
          Make sure the element is present in the document or that it's not display none.`
        );
      }
    }

    return {
      top: anchorRect.top + getOffsetTop(anchorRect, anchorOrigin.vertical),
      left: anchorRect.left + getOffsetLeft(anchorRect, anchorOrigin.horizontal)
    };
  }, [anchorEl, anchorOrigin.horizontal, anchorOrigin.vertical, anchorPosition, anchorReference]);

  const getTransformOrigin = React.useCallback(
    (elemRect) => {
      return {
        vertical: getOffsetTop(elemRect, transformOrigin.vertical),
        horizontal: getOffsetLeft(elemRect, transformOrigin.horizontal)
      };
    },
    [transformOrigin.horizontal, transformOrigin.vertical]
  );

  const getPositioningStyle = React.useCallback(
    (element) => {
      const elemRect = {
        width: element.offsetWidth,
        height: element.offsetHeight
      };

      const elemTransformOrigin = getTransformOrigin(elemRect);

      if (anchorReference === 'none') {
        return {
          top: null,
          left: null,
          transformOrigin: getTransformOriginValue(elemTransformOrigin)
        };
      }

      const anchorOffset = getAnchorOffset();

      let top = anchorOffset.top - elemTransformOrigin.vertical;
      let left = anchorOffset.left - elemTransformOrigin.horizontal;
      const bottom = top + elemRect.height;
      const right = left + elemRect.width;

      const containerWindow = ownerWindow(resolveAnchorEl(anchorEl));

      const heightThreshold = containerWindow.innerHeight - marginThreshold;
      const widthThreshold = containerWindow.innerWidth - marginThreshold;

      if (top < marginThreshold) {
        const diff = top - marginThreshold;
        top -= diff;
        elemTransformOrigin.vertical += diff;
      } else if (bottom > heightThreshold) {
        const diff = bottom - heightThreshold;
        top -= diff;
        elemTransformOrigin.vertical += diff;
      }

      if (!import.meta.env.PROD) {
        if (elemRect.height > heightThreshold && elemRect.height && heightThreshold) {
          console.error(
            `The popover component is too tall.
              Some part of it can not be seen on the screen (${
                elemRect.height - heightThreshold
              }px).
              Please consider adding a 'max-height' to improve the user-experience.`
          );
        }
      }

      if (left < marginThreshold) {
        const diff = left - marginThreshold;
        left -= diff;
        elemTransformOrigin.horizontal += diff;
      } else if (right > widthThreshold) {
        const diff = right - widthThreshold;
        left -= diff;
        elemTransformOrigin.horizontal += diff;
      }

      return {
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        transformOrigin: getTransformOriginValue(elemTransformOrigin)
      };
    },
    [anchorEl, anchorReference, getAnchorOffset, getTransformOrigin, marginThreshold]
  );

  const setPositioningStyles = React.useCallback(() => {
    const element = paperRef.current;

    if (!element) {
      return;
    }

    const positioning = getPositioningStyle(element);

    if (positioning.top !== null) {
      element.style.top = positioning.top;
    }
    if (positioning.left !== null) {
      element.style.left = positioning.left;
    }
    element.style.transformOrigin = positioning.transformOrigin;
    setIsPositioned(true);
  }, [getPositioningStyle]);

  const handleEntering = (element, isAppearing) => {
    if (onEntering) {
      onEntering(element, isAppearing);
    }

    setPositioningStyles();
  };

  const handleExited = () => {
    setIsPositioned(false);
  };

  React.useEffect(() => {
    if (open) {
      setPositioningStyles();
    }
  });

  React.useImperativeHandle(
    action,
    () =>
      open
        ? {
            updatePosition: () => {
              setPositioningStyles();
            }
          }
        : null,
    [open, setPositioningStyles]
  );

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleResize = debounce(() => {
      setPositioningStyles();
    });

    const containerWindow = ownerWindow(anchorEl);
    containerWindow.addEventListener('resize', handleResize);
    return () => {
      handleResize.clear();
      containerWindow.removeEventListener('resize', handleResize);
    };
  }, [anchorEl, open, setPositioningStyles]);

  let transitionDuration = transitionDurationProp;

  if (transitionDurationProp === 'auto' && !TransitionComponent.supportAuto) {
    transitionDuration = undefined;
  }

  const container =
    containerProp || (anchorEl ? ownerDocument(resolveAnchorEl(anchorEl)).body : undefined);

  const RootSlot = slots?.root ?? PopoverRoot;
  const PaperSlot = slots?.paper ?? PopoverPaper;

  const paperProps = useSlotProps({
    elementType: PaperSlot,
    externalSlotProps: {
      ...externalPaperSlotProps,
      style: isPositioned
        ? externalPaperSlotProps.style
        : { ...externalPaperSlotProps.style, opacity: 0 },
      css: externalPaperSlotCss
    },
    additionalProps: {
      elevation,
      ref: handlePaperRef
    },
    ownerState,
    className: clsx(
      popoverClasses.paper,
      externalPaperSlotClasses?.root,
      externalPaperSlotProps?.className
    )
  });

  const { slotProps: rootSlotPropsProp, ...rootProps } = useSlotProps({
    elementType: RootSlot,
    externalSlotProps: slotProps?.root || {},
    externalForwardedProps: other,
    additionalProps: {
      ref,
      slotProps: { backdrop: { invisible: true } },
      container,
      open
    },
    ownerState,
    className: clsx(popoverClasses.root, className)
  });

  return (
    <RootSlot
      {...rootProps}
      {...(!(typeof RootSlot === 'string') && { slotProps: rootSlotPropsProp })}
    >
      <TransitionComponent
        appear
        in={open}
        onEntering={handleEntering}
        onExited={handleExited}
        timeout={transitionDuration}
        {...TransitionProps}
      >
        <PaperSlot {...paperProps}>{children}</PaperSlot>
      </TransitionComponent>
    </RootSlot>
  );
});

Popover.displayName = 'Popover';

export default Popover;
