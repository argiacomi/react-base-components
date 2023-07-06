import React from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '@styles';
import {
  getTransitionProps,
  ownerDocument,
  ownerWindow,
  useEnhancedEffect,
  useEventCallback,
  useForkRef
} from '@components/lib';
import { NoSsr } from '@components/utils';
import Drawer, { getAnchor, isHorizontal } from '../Drawer';
import SwipeArea from './SwipeArea';

const UNCERTAINTY_THRESHOLD = 3;

const DRAG_STARTED_SIGNAL = 20;

let claimedSwipeInstance = null;

// Exported for test purposes.
export function reset() {
  claimedSwipeInstance = null;
}

function calculateCurrentX(anchor, touches, doc) {
  return anchor === 'right' ? doc.body.offsetWidth - touches[0].pageX : touches[0].pageX;
}

function calculateCurrentY(anchor, touches, containerWindow) {
  return anchor === 'bottom'
    ? containerWindow.innerHeight - touches[0].clientY
    : touches[0].clientY;
}

function getMaxTranslate(horizontalSwipe, paperInstance) {
  return horizontalSwipe ? paperInstance.clientWidth : paperInstance.clientHeight;
}

function getTranslate(currentTranslate, startLocation, open, maxTranslate) {
  return Math.min(
    Math.max(
      open ? startLocation - currentTranslate : maxTranslate + startLocation - currentTranslate,
      0
    ),
    maxTranslate
  );
}

function getDomTreeShapes(element, rootNode) {
  const domTreeShapes = [];

  while (element && element !== rootNode.parentElement) {
    const style = ownerWindow(rootNode).getComputedStyle(element);

    if (
      style.getPropertyValue('position') === 'absolute' ||
      style.getPropertyValue('overflow-x') === 'hidden'
    ) {
      // Ignore the scroll children under certain conditions
    } else if (
      (element.clientWidth > 0 && element.scrollWidth > element.clientWidth) ||
      (element.clientHeight > 0 && element.scrollHeight > element.clientHeight)
    ) {
      domTreeShapes.push(element);
    }

    element = element.parentElement;
  }

  return domTreeShapes;
}

function computeHasNativeHandler({ domTreeShapes, start, current, anchor }) {
  const axisProperties = {
    scrollPosition: {
      x: 'scrollLeft',
      y: 'scrollTop'
    },
    scrollLength: {
      x: 'scrollWidth',
      y: 'scrollHeight'
    },
    clientLength: {
      x: 'clientWidth',
      y: 'clientHeight'
    }
  };

  return domTreeShapes.some((shape) => {
    let goingForward = current >= start;
    if (anchor === 'top' || anchor === 'left') {
      goingForward = !goingForward;
    }
    const axis = anchor === 'left' || anchor === 'right' ? 'x' : 'y';
    const scrollPosition = Math.round(shape[axisProperties.scrollPosition[axis]]);

    const areNotAtStart = scrollPosition > 0;
    const areNotAtEnd =
      scrollPosition + shape[axisProperties.clientLength[axis]] <
      shape[axisProperties.scrollLength[axis]];

    if ((goingForward && areNotAtEnd) || (!goingForward && areNotAtStart)) {
      return true;
    }

    return false;
  });
}

const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

const SwipeDrawer = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const transitionDurationDefault = {
    enter: theme.transition.duration.enteringScreen,
    exit: theme.transition.duration.leavingScreen
  };

  const {
    anchor = 'left',
    disableBackdropTransition = false,
    disableDiscovery = false,
    disableSwipeToOpen = iOS,
    hideBackdrop,
    hysteresis = 0.52,
    allowSwipeInChildren = false,
    minFlingVelocity = 450,
    ModalProps: { BackdropProps, ...ModalPropsProp } = {},
    onClose,
    onOpen,
    open = false,
    slotProps = {},
    SwipeAreaProps,
    swipeAreaWidth = 20,
    transitionDuration = transitionDurationDefault,
    variant = 'temporary',
    ...other
  } = props;

  const [maybeSwiping, setMaybeSwiping] = React.useState(false);
  const swipeInstance = React.useRef({
    isSwiping: null
  });

  const swipeAreaRef = React.useRef();
  const backdropRef = React.useRef();
  const paperRef = React.useRef();

  const handleRef = useForkRef(slotProps.paper?.ref, paperRef);

  const touchDetected = React.useRef(false);

  const calculatedDurationRef = React.useRef();

  useEnhancedEffect(() => {
    calculatedDurationRef.current = null;
  }, [open]);

  const setPosition = React.useCallback(
    (translate, options = {}) => {
      const { mode = null, changeTransition = true } = options;

      const anchorRtl = getAnchor(theme, anchor);
      const rtlTranslateMultiplier = ['right', 'bottom'].indexOf(anchorRtl) !== -1 ? 1 : -1;
      const horizontalSwipe = isHorizontal(anchor);

      const transform = horizontalSwipe
        ? `translate(${rtlTranslateMultiplier * translate}px, 0)`
        : `translate(0, ${rtlTranslateMultiplier * translate}px)`;
      const drawerStyle = paperRef.current.style;
      drawerStyle.webkitTransform = transform;
      drawerStyle.transform = transform;

      let transition = '';

      if (mode) {
        transition = theme.transition.create(
          'all',
          getTransitionProps(
            {
              easing: undefined,
              style: undefined,
              timeout: transitionDuration
            },
            {
              mode
            }
          )
        );
      }

      if (changeTransition) {
        drawerStyle.webkitTransition = transition;
        drawerStyle.transition = transition;
      }

      if (!disableBackdropTransition && !hideBackdrop) {
        const backdropStyle = backdropRef.current.style;
        backdropStyle.opacity = 1 - translate / getMaxTranslate(horizontalSwipe, paperRef.current);

        if (changeTransition) {
          backdropStyle.webkitTransition = transition;
          backdropStyle.transition = transition;
        }
      }
    },
    [anchor, disableBackdropTransition, hideBackdrop, theme, transitionDuration]
  );

  const handleBodyTouchEnd = useEventCallback((nativeEvent) => {
    if (!touchDetected.current) {
      return;
    }
    claimedSwipeInstance = null;
    touchDetected.current = false;
    ReactDOM.flushSync(() => {
      setMaybeSwiping(false);
    });

    if (!swipeInstance.current.isSwiping) {
      swipeInstance.current.isSwiping = null;
      return;
    }

    swipeInstance.current.isSwiping = null;

    const anchorRtl = getAnchor(theme, anchor);
    const horizontal = isHorizontal(anchor);
    let current;
    if (horizontal) {
      current = calculateCurrentX(
        anchorRtl,
        nativeEvent.changedTouches,
        ownerDocument(nativeEvent.currentTarget)
      );
    } else {
      current = calculateCurrentY(
        anchorRtl,
        nativeEvent.changedTouches,
        ownerWindow(nativeEvent.currentTarget)
      );
    }

    const startLocation = horizontal ? swipeInstance.current.startX : swipeInstance.current.startY;
    const maxTranslate = getMaxTranslate(horizontal, paperRef.current);
    const currentTranslate = getTranslate(current, startLocation, open, maxTranslate);
    const translateRatio = currentTranslate / maxTranslate;

    if (Math.abs(swipeInstance.current.velocity) > minFlingVelocity) {
      calculatedDurationRef.current =
        Math.abs((maxTranslate - currentTranslate) / swipeInstance.current.velocity) * 1000;
    }

    if (open) {
      if (swipeInstance.current.velocity > minFlingVelocity || translateRatio > hysteresis) {
        onClose();
      } else {
        setPosition(0, {
          mode: 'exit'
        });
      }

      return;
    }

    if (swipeInstance.current.velocity < -minFlingVelocity || 1 - translateRatio > hysteresis) {
      onOpen();
    } else {
      setPosition(getMaxTranslate(horizontal, paperRef.current), {
        mode: 'enter'
      });
    }
  });

  const startMaybeSwiping = (force = false) => {
    if (!maybeSwiping) {
      if (force || !(disableDiscovery && allowSwipeInChildren)) {
        ReactDOM.flushSync(() => {
          setMaybeSwiping(true);
        });
      }

      const horizontalSwipe = isHorizontal(anchor);

      if (!open && paperRef.current) {
        setPosition(
          getMaxTranslate(horizontalSwipe, paperRef.current) +
            (disableDiscovery ? 15 : -DRAG_STARTED_SIGNAL),
          {
            changeTransition: false
          }
        );
      }

      swipeInstance.current.velocity = 0;
      swipeInstance.current.lastTime = null;
      swipeInstance.current.lastTranslate = null;
      swipeInstance.current.paperHit = false;

      touchDetected.current = true;
    }
  };

  const handleBodyTouchMove = useEventCallback((nativeEvent) => {
    if (!paperRef.current || !touchDetected.current) {
      return;
    }

    if (claimedSwipeInstance !== null && claimedSwipeInstance !== swipeInstance.current) {
      return;
    }

    startMaybeSwiping(true);

    const anchorRtl = getAnchor(theme, anchor);
    const horizontalSwipe = isHorizontal(anchor);

    const currentX = calculateCurrentX(
      anchorRtl,
      nativeEvent.touches,
      ownerDocument(nativeEvent.currentTarget)
    );

    const currentY = calculateCurrentY(
      anchorRtl,
      nativeEvent.touches,
      ownerWindow(nativeEvent.currentTarget)
    );

    if (open && paperRef.current.contains(nativeEvent.target) && claimedSwipeInstance === null) {
      const domTreeShapes = getDomTreeShapes(nativeEvent.target, paperRef.current);
      const hasNativeHandler = computeHasNativeHandler({
        domTreeShapes,
        start: horizontalSwipe ? swipeInstance.current.startX : swipeInstance.current.startY,
        current: horizontalSwipe ? currentX : currentY,
        anchor
      });

      if (hasNativeHandler) {
        claimedSwipeInstance = true;
        return;
      }
      claimedSwipeInstance = swipeInstance.current;
    }

    if (swipeInstance.current.isSwiping == null) {
      const dx = Math.abs(currentX - swipeInstance.current.startX);
      const dy = Math.abs(currentY - swipeInstance.current.startY);

      const definitelySwiping = horizontalSwipe
        ? dx > dy && dx > UNCERTAINTY_THRESHOLD
        : dy > dx && dy > UNCERTAINTY_THRESHOLD;

      if (definitelySwiping && nativeEvent.cancelable) {
        nativeEvent.preventDefault();
      }

      if (
        definitelySwiping === true ||
        (horizontalSwipe ? dy > UNCERTAINTY_THRESHOLD : dx > UNCERTAINTY_THRESHOLD)
      ) {
        swipeInstance.current.isSwiping = definitelySwiping;
        if (!definitelySwiping) {
          handleBodyTouchEnd(nativeEvent);
          return;
        }

        swipeInstance.current.startX = currentX;
        swipeInstance.current.startY = currentY;

        if (!disableDiscovery && !open) {
          if (horizontalSwipe) {
            swipeInstance.current.startX -= DRAG_STARTED_SIGNAL;
          } else {
            swipeInstance.current.startY -= DRAG_STARTED_SIGNAL;
          }
        }
      }
    }

    if (!swipeInstance.current.isSwiping) {
      return;
    }

    const maxTranslate = getMaxTranslate(horizontalSwipe, paperRef.current);
    let startLocation = horizontalSwipe
      ? swipeInstance.current.startX
      : swipeInstance.current.startY;
    if (open && !swipeInstance.current.paperHit) {
      startLocation = Math.min(startLocation, maxTranslate);
    }

    const translate = getTranslate(
      horizontalSwipe ? currentX : currentY,
      startLocation,
      open,
      maxTranslate
    );

    if (open) {
      if (!swipeInstance.current.paperHit) {
        const paperHit = horizontalSwipe ? currentX < maxTranslate : currentY < maxTranslate;
        if (paperHit) {
          swipeInstance.current.paperHit = true;
          swipeInstance.current.startX = currentX;
          swipeInstance.current.startY = currentY;
        } else {
          return;
        }
      } else if (translate === 0) {
        swipeInstance.current.startX = currentX;
        swipeInstance.current.startY = currentY;
      }
    }

    if (swipeInstance.current.lastTranslate === null) {
      swipeInstance.current.lastTranslate = translate;
      swipeInstance.current.lastTime = performance.now() + 1;
    }

    const velocity =
      ((translate - swipeInstance.current.lastTranslate) /
        (performance.now() - swipeInstance.current.lastTime)) *
      1e3;

    swipeInstance.current.velocity = swipeInstance.current.velocity * 0.4 + velocity * 0.6;

    swipeInstance.current.lastTranslate = translate;
    swipeInstance.current.lastTime = performance.now();

    if (nativeEvent.cancelable) {
      nativeEvent.preventDefault();
    }

    setPosition(translate);
  });

  const handleBodyTouchStart = useEventCallback((nativeEvent) => {
    if (nativeEvent.defaultPrevented) {
      return;
    }

    if (nativeEvent.customDefaultPrevented) {
      return;
    }

    if (
      open &&
      (hideBackdrop || !backdropRef.current.contains(nativeEvent.target)) &&
      !paperRef.current.contains(nativeEvent.target)
    ) {
      return;
    }

    const anchorRtl = getAnchor(theme, anchor);
    const horizontalSwipe = isHorizontal(anchor);

    const currentX = calculateCurrentX(
      anchorRtl,
      nativeEvent.touches,
      ownerDocument(nativeEvent.currentTarget)
    );

    const currentY = calculateCurrentY(
      anchorRtl,
      nativeEvent.touches,
      ownerWindow(nativeEvent.currentTarget)
    );

    if (!open) {
      if (
        disableSwipeToOpen ||
        !(
          nativeEvent.target === swipeAreaRef.current ||
          (paperRef.current?.contains(nativeEvent.target) &&
            (typeof allowSwipeInChildren === 'function'
              ? allowSwipeInChildren(nativeEvent, swipeAreaRef.current, paperRef.current)
              : allowSwipeInChildren))
        )
      ) {
        return;
      }
      if (horizontalSwipe) {
        if (currentX > swipeAreaWidth) {
          return;
        }
      } else if (currentY > swipeAreaWidth) {
        return;
      }
    }

    nativeEvent.customDefaultPrevented = true;
    claimedSwipeInstance = null;
    swipeInstance.current.startX = currentX;
    swipeInstance.current.startY = currentY;

    startMaybeSwiping();
  });

  React.useEffect(() => {
    if (variant === 'temporary') {
      const doc = ownerDocument(paperRef.current);
      doc.addEventListener('touchstart', handleBodyTouchStart);
      doc.addEventListener('touchmove', handleBodyTouchMove, { passive: !open });
      doc.addEventListener('touchend', handleBodyTouchEnd);

      return () => {
        doc.removeEventListener('touchstart', handleBodyTouchStart);
        doc.removeEventListener('touchmove', handleBodyTouchMove, { passive: !open });
        doc.removeEventListener('touchend', handleBodyTouchEnd);
      };
    }

    return undefined;
  }, [variant, open, handleBodyTouchStart, handleBodyTouchMove, handleBodyTouchEnd]);

  React.useEffect(
    () => () => {
      if (claimedSwipeInstance === swipeInstance.current) {
        claimedSwipeInstance = null;
      }
    },
    []
  );

  React.useEffect(() => {
    if (!open) {
      setMaybeSwiping(false);
    }
  }, [open]);

  return (
    <React.Fragment>
      <Drawer
        open={variant === 'temporary' && maybeSwiping ? true : open}
        variant={variant}
        ModalProps={{
          BackdropProps: {
            ...BackdropProps,
            ref: backdropRef
          },
          ...(variant === 'temporary' && {
            keepMounted: true
          }),
          ...ModalPropsProp
        }}
        hideBackdrop={hideBackdrop}
        slotProps={{
          paper: {
            ...slotProps.paper,
            style: {
              pointerEvents:
                variant === 'temporary' && !open && !allowSwipeInChildren ? 'none' : '',
              ...slotProps.paper?.style
            },
            ref: handleRef
          }
        }}
        anchor={anchor}
        transitionDuration={calculatedDurationRef.current || transitionDuration}
        onClose={onClose}
        ref={ref}
        {...other}
      />
      {!disableSwipeToOpen && variant === 'temporary' && (
        <NoSsr>
          <SwipeArea
            anchor={anchor}
            ref={swipeAreaRef}
            width={swipeAreaWidth}
            {...SwipeAreaProps}
          />
        </NoSsr>
      )}
    </React.Fragment>
  );
});

SwipeDrawer.displayName = 'SwipeableDrawer';

export default SwipeDrawer;
