import * as React from 'react';
import { Transition } from 'react-transition-group';
import { createTransitions, reflow, getTransitionProps } from '@components/lib';
import { useForkRef } from '@component-hooks';

const getScale = (value) => {
  return `scale(${value}, ${value ** 2})`;
};

const styles = {
  entering: {
    opacity: 1,
    transform: getScale(1)
  },
  entered: {
    opacity: 1,
    transform: 'none'
  }
};

const setTransitionStyle = (
  node,
  { style, timeout, easing },
  mode,
  onTransition
) => {
  reflow(node);

  const transitionProps = getTransitionProps(
    { style, timeout, easing },
    { mode }
  );

  let duration;
  if (timeout === 'auto') {
    duration = !node.clientHeight
      ? 0
      : Math.round(
          (4 +
            15 * (node.clientHeight / 36) ** 0.25 +
            node.clientHeight / 36 / 5) *
            10
        );
  } else {
    duration = transitionProps.duration;
  }

  const opacityTransition = createTransitions('opacity', {
    duration,
    delay: transitionProps.delay
  });

  const transformTransition = createTransitions('transform', {
    duration: duration * 0.666,
    delay: transitionProps.delay,
    easing: transitionProps.easing
  });

  node.style.webkitTransition = [opacityTransition, transformTransition].join(
    ','
  );
  node.style.transition = [opacityTransition, transformTransition].join(',');

  if (onTransition) {
    onTransition(node);
  }

  return duration;
};

const Grow = React.forwardRef(
  (
    {
      addEndListener,
      appear = true,
      children,
      easing,
      in: inProp,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      style,
      timeout = 'auto',
      TransitionComponent = Transition,
      ...other
    },
    ref
  ) => {
    const timer = React.useRef();
    const autoTimeout = React.useRef();

    const nodeRef = React.useRef(null);
    const handleRef = useForkRef(nodeRef, children.ref, ref);

    const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
      if (callback) {
        const node = nodeRef.current;
        callback(node, maybeIsAppearing);
      }
    };

    const handleEnter = React.useCallback(
      normalizedTransitionCallback((node, isAppearing) => {
        autoTimeout.current = setTransitionStyle(
          node,
          { style, timeout, easing },
          'enter',
          onEnter
        );

        node.style.opacity = 0;
        node.style.transform = getScale(0.75);
      }),
      [style, timeout, easing, onEnter]
    );

    const handleEntering = React.useCallback(
      normalizedTransitionCallback(onEntering),
      [onEntering]
    );

    const handleEntered = React.useCallback(
      normalizedTransitionCallback(onEntered),
      [onEntered]
    );

    const handleExit = React.useCallback(
      normalizedTransitionCallback((node) => {
        autoTimeout.current = setTransitionStyle(
          node,
          { style, timeout, easing },
          'exit',
          onExit
        );

        node.style.opacity = 0;
        node.style.transform = getScale(0.75);
      }),
      [style, timeout, easing, onExit]
    );

    const handleExiting = React.useCallback(
      normalizedTransitionCallback(onExiting),
      [onExiting]
    );

    const handleExited = React.useCallback(
      normalizedTransitionCallback(onExited),
      [onExited]
    );

    const handleAddEndListener = (next) => {
      if (timeout === 'auto') {
        timer.current = setTimeout(next, autoTimeout.current || 0);
      }
      if (addEndListener) {
        addEndListener(nodeRef.current, next);
      }
    };

    React.useEffect(() => {
      return () => {
        clearTimeout(timer.current);
      };
    }, []);

    return (
      <TransitionComponent
        appear={appear}
        in={inProp}
        nodeRef={nodeRef}
        onEnter={handleEnter}
        onEntered={handleEntered}
        onEntering={handleEntering}
        onExit={handleExit}
        onExited={handleExited}
        onExiting={handleExiting}
        addEndListener={handleAddEndListener}
        timeout={timeout === 'auto' ? null : timeout}
        {...other}
      >
        {(state, childProps) => {
          return React.cloneElement(children, {
            style: {
              opacity: 0,
              transform: getScale(0.75),
              visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
              ...styles[state],
              ...style,
              ...children.props.style
            },
            ref: handleRef,
            ...childProps
          });
        }}
      </TransitionComponent>
    );
  }
);
Grow.displayName = 'Grow';

export default Grow;
