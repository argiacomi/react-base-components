import React from 'react';
import { Transition } from 'react-transition-group';
import { useTheme } from '@styles';
import { getTransitionProps, reflow } from '@components/lib';
import { useForkRef } from '@components/lib';

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
  style,
  timeout,
  easing,
  mode,
  theme,
  onTransition,
  isAppearing
) => {
  reflow(node);

  const transitionProps = getTransitionProps({ style, timeout, easing }, { mode });

  let duration;
  if (timeout === 'auto') {
    duration = !node.clientHeight
      ? 0
      : Math.round((4 + 15 * (node.clientHeight / 36) ** 0.25 + node.clientHeight / 36 / 5) * 10);
  } else {
    duration = transitionProps.duration;
  }

  const opacityTransition = theme.transition.create('opacity', {
    duration,
    delay: transitionProps.delay
  });

  const transformTransition = theme.transition.create('transform', {
    duration: duration * 0.666,
    delay: transitionProps.delay,
    easing: transitionProps.easing
  });

  node.style.webkitTransition = [opacityTransition, transformTransition].join(',');
  node.style.transition = [opacityTransition, transformTransition].join(',');

  if (onTransition) {
    onTransition(node, isAppearing);
  }

  return duration;
};

const Grow = React.forwardRef((props, ref) => {
  const theme = useTheme();

  const {
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
  } = props;

  const timer = React.useRef();
  const autoTimeout = React.useRef();

  const nodeRef = React.useRef(null);
  const handleRef = useForkRef(nodeRef, children.ref, ref);

  const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
    if (callback) {
      callback(nodeRef.current, maybeIsAppearing);
    }
  };

  const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
    autoTimeout.current = setTransitionStyle(
      node,
      style,
      timeout,
      easing,
      'enter',
      theme,
      onEnter,
      isAppearing
    );

    node.style.opacity = 0;
    node.style.transform = getScale(0.75);
  });

  const handleEntering = normalizedTransitionCallback(onEntering);

  const handleEntered = normalizedTransitionCallback(onEntered);

  const handleExit = normalizedTransitionCallback((node) => {
    autoTimeout.current = setTransitionStyle(node, style, timeout, easing, 'exit', theme, onExit);

    node.style.opacity = 0;
    node.style.transform = getScale(0.75);
  });

  const handleExiting = normalizedTransitionCallback(onExiting);

  const handleExited = normalizedTransitionCallback(onExited);

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
      onEntering={handleEntering}
      onEntered={handleEntered}
      onExit={handleExit}
      onExiting={handleExiting}
      onExited={handleExited}
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
});
Grow.displayName = 'Grow';
Grow.supportAuto = true;

export default Grow;
