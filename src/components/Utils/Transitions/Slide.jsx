import * as React from 'react';
import { Transition } from 'react-transition-group';
import { useForkRef } from '@component-hooks';
import {
  createTransitions,
  reflow,
  getTransitionProps,
  debounce
} from '@components/lib';
import { ownerWindow } from '@utils';

// Translate the node so it can't be seen on the screen.
// Later, we're going to translate the node back to its original location with `none`.
const getTranslateValue = (direction, node, resolvedContainer) => {
  const rect = node.getBoundingClientRect();
  const containerRect = resolvedContainer?.getBoundingClientRect();
  const containerWindow = ownerWindow(node);

  // Get the transform from the node or the computedStyle of the node
  const transform =
    node.fakeTransform ||
    containerWindow
      .getComputedStyle(node)
      .getPropertyValue('-webkit-transform') ||
    containerWindow.getComputedStyle(node).getPropertyValue('transform');

  // Extract the offsetX and offsetY if a transform string exists
  let [offsetX = 0, offsetY = 0] =
    transform && transform !== 'none'
      ? transform
          .match(/\(([^)]+)\)/)[1]
          .split(',')
          .slice(4, 6)
          .map(Number)
      : [0, 0];

  switch (direction) {
    case 'left':
      return containerRect
        ? `translateX(${containerRect.right + offsetX - rect.left}px)`
        : `translateX(${containerWindow.innerWidth + offsetX - rect.left}px)`;
    case 'right':
      return containerRect
        ? `translateX(-${rect.right - containerRect.left - offsetX}px)`
        : `translateX(-${rect.left + rect.width - offsetX}px)`;
    case 'up':
      return containerRect
        ? `translateY(${containerRect.bottom + offsetY - rect.top}px)`
        : `translateY(${containerWindow.innerHeight + offsetY - rect.top}px)`;
    case 'down':
      return containerRect
        ? `translateY(-${
            rect.top - containerRect.top + rect.height - offsetY
          }px)`
        : `translateY(-${rect.top + rect.height - offsetY}px)`;
  }
};

const resolveContainer = (containerPropProp) => {
  return typeof containerPropProp === 'function'
    ? containerPropProp()
    : containerPropProp;
};

const setTranslateValue = (direction, node, containerProp) => {
  const resolvedContainer = resolveContainer(containerProp);
  const transform = getTranslateValue(direction, node, resolvedContainer);

  if (transform) {
    node.style.webkitTransform = transform;
    node.style.transform = transform;
  }
};

const setTransitionProperties = (node, transitionProps, prop) => {
  node.style.webkitTransition = createTransitions(
    `-webkit-${prop}`,
    transitionProps
  );
  node.style.transition = createTransitions(prop, transitionProps);
};

const Slide = React.forwardRef((props, ref) => {
  const defaultEasing = {
    enter: 'cubic-bezier(0.0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 0.6, 1)'
  };

  const defaultTimeout = {
    enter: 225,
    exit: 195
  };

  const {
    addEndListener,
    appear = true,
    children,
    container: containerProp,
    direction = 'down',
    easing: easingProp = defaultEasing,
    in: inProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    style,
    timeout = defaultTimeout,
    TransitionComponent = Transition,
    ...other
  } = props;

  const childrenRef = React.useRef(null);
  const handleRef = useForkRef(children.ref, childrenRef, ref);

  const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
    const node = childrenRef.current;
    callback?.(node, maybeIsAppearing ?? node);
  };

  const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
    setTranslateValue(direction, node, containerProp);
    reflow(node);
    onEnter?.(node, isAppearing);
  });

  const handleEntering = normalizedTransitionCallback((node, isAppearing) => {
    const transitionProps = getTransitionProps(
      { timeout, style, easing: easingProp },
      {
        mode: 'enter'
      }
    );

    node.style.webkitTransition = createTransitions('-webkit-transform', {
      ...transitionProps
    });

    node.style.transition = createTransitions('transform', {
      ...transitionProps
    });

    node.style.webkitTransform = 'none';
    node.style.transform = 'none';
    onEntering?.(node, isAppearing);
  });

  const handleEntered = normalizedTransitionCallback(onEntered);

  const handleExit = normalizedTransitionCallback((node) => {
    const transitionProps = getTransitionProps(
      { timeout, style, easing: easingProp },
      { mode: 'exit' }
    );
    setTransitionProperties(node, transitionProps, 'transform');
    setTranslateValue(direction, node, containerProp);
    onExit?.(node);
  });

  const handleExiting = normalizedTransitionCallback(onExiting);

  const handleExited = normalizedTransitionCallback((node) => {
    // No need for transitions when the component is hidden
    node.style.webkitTransition = '';
    node.style.transition = '';

    onExited?.(node);
  });

  const handleAddEndListener = (next) => {
    if (addEndListener) {
      // Old call signature before `react-transition-group` implemented `nodeRef`
      addEndListener(childrenRef.current, next);
    }
  };

  const updatePosition = React.useCallback(() => {
    if (childrenRef.current) {
      setTranslateValue(direction, childrenRef.current, containerProp);
    }
  }, [direction, containerProp]);

  const handleResize = React.useCallback(
    debounce(() => {
      if (childrenRef.current) {
        setTranslateValue(direction, childrenRef.current, containerProp);
      }
    }),
    [direction, containerProp]
  );

  React.useEffect(() => {
    // Skip configuration where the position is screen size invariant.
    if (inProp || direction === 'down' || direction === 'right') {
      return undefined;
    }

    const containerWindow = ownerWindow(childrenRef.current);
    containerWindow?.addEventListener('resize', handleResize);
    return () => {
      handleResize.clear();
      containerWindow?.removeEventListener('resize', handleResize);
    };
  }, [direction, inProp, containerProp, handleResize]);

  React.useEffect(() => {
    if (!inProp) {
      // We need to update the position of the drawer when the direction change and
      // when it's hidden.
      updatePosition();
    }
  }, [inProp, updatePosition]);

  return (
    <TransitionComponent
      nodeRef={childrenRef}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={handleExited}
      onExiting={handleExiting}
      addEndListener={handleAddEndListener}
      appear={appear}
      in={inProp}
      timeout={timeout}
      {...other}
    >
      {(state, childProps) => {
        return React.cloneElement(children, {
          ref: handleRef,
          style: {
            visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
            ...style,
            ...children.props.style
          },
          ...childProps
        });
      }}
    </TransitionComponent>
  );
});
Slide.displayName = 'Slide';

export default Slide;
