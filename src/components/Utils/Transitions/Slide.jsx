import React from 'react';
import { Transition } from 'react-transition-group';
import { useTheme } from '@styles';
import { debounce, getTransitionProps, ownerWindow, reflow } from '@components/lib';
import { useForkRef } from '@components/lib';

const getTranslateValue = (direction, node, resolvedContainer) => {
  const rect = node.getBoundingClientRect();
  const containerRect = resolvedContainer?.getBoundingClientRect();
  const containerWindow = ownerWindow(node);

  const transform =
    node.fakeTransform ||
    containerWindow.getComputedStyle(node).getPropertyValue('-webkit-transform') ||
    containerWindow.getComputedStyle(node).getPropertyValue('transform');

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
        ? `translateY(-${rect.top - containerRect.top + rect.height - offsetY}px)`
        : `translateY(-${rect.top + rect.height - offsetY}px)`;
  }
};

const resolveContainer = (containerPropProp) => {
  return typeof containerPropProp === 'function' ? containerPropProp() : containerPropProp;
};

const setTranslateValue = (direction, node, containerProp) => {
  const resolvedContainer = resolveContainer(containerProp);
  const transform = getTranslateValue(direction, node, resolvedContainer);

  if (transform) {
    node.style.webkitTransform = transform;
    node.style.transform = transform;
  }
};

const Slide = React.forwardRef((props, ref) => {
  const theme = useTheme();

  const defaultEasing = {
    enter: theme.transition.easing.easeInOut,
    exit: theme.transition.easing.sharp
  };

  const defaultTimeout = {
    enter: theme.transition.duration.enteringScreen,
    exit: theme.transition.duration.leavingScreen
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

    node.style.webkitTransition = theme.transition.create('-webkit-transform', {
      ...transitionProps
    });

    node.style.transition = theme.transition.create('transform', {
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
    node.style.webkitTransition = theme.transition.create(`-webkit-transform`, transitionProps);
    node.style.transition = theme.transition.create('transform', transitionProps);
    setTranslateValue(direction, node, containerProp);
    onExit?.(node);
  });

  const handleExiting = normalizedTransitionCallback(onExiting);

  const handleExited = normalizedTransitionCallback((node) => {
    node.style.webkitTransition = '';
    node.style.transition = '';

    onExited?.(node);
  });

  const handleAddEndListener = (next) => {
    if (addEndListener) {
      addEndListener(childrenRef.current, next);
    }
  };

  const handleResize = debounce(() => {
    if (childrenRef.current) {
      setTranslateValue(direction, childrenRef.current, containerProp);
    }
  });

  React.useEffect(() => {
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
    if (!inProp && childrenRef.current) {
      setTranslateValue(direction, childrenRef.current, containerProp);
    }
  }, [inProp, direction, containerProp]);

  return (
    <TransitionComponent
      nodeRef={childrenRef}
      onEnter={handleEnter}
      onEntering={handleEntering}
      onEntered={handleEntered}
      onExit={handleExit}
      onExiting={handleExiting}
      onExited={handleExited}
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
