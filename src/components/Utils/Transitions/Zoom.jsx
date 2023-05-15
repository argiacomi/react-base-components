import * as React from 'react';
import { Transition } from 'react-transition-group';
import { createTransitions, reflow, getTransitionProps } from '@components/lib';
import { useForkRef } from '@component-hooks';

const styles = {
  entering: {
    transform: 'none'
  },
  entered: {
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
  node.style.webkitTransition = createTransitions('transform', transitionProps);
  node.style.transition = createTransitions('transform', transitionProps);

  onTransition?.(node, isAppearing);
};

const Zoom = React.forwardRef((props, ref) => {
  const defaultTimeout = {
    enter: 225,
    exit: 195
  };

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
    timeout = defaultTimeout,
    // eslint-disable-next-line react/prop-types
    TransitionComponent = Transition,
    ...other
  } = props;

  const nodeRef = React.useRef(null);
  const handleRef = useForkRef(nodeRef, children.ref, ref);

  const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
    if (callback) {
      const node = nodeRef.current;
      callback(node, maybeIsAppearing);
    }
  };

  const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
    setTransitionStyle(node, { style, timeout, easing }, 'enter', onEnter);
  });

  const handleEntering = normalizedTransitionCallback(onEntering);

  const handleEntered = normalizedTransitionCallback(onEntered);

  const handleExit = normalizedTransitionCallback((node) => {
    setTransitionStyle(node, { style, timeout, easing }, 'exit', onExit);
  });

  const handleExiting = normalizedTransitionCallback(onExiting);

  const handleExited = normalizedTransitionCallback(onExited);

  const handleAddEndListener = (next) => {
    if (addEndListener) {
      addEndListener(nodeRef.current, next);
    }
  };

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
      timeout={timeout}
      {...other}
    >
      {(state, childProps) => {
        return React.cloneElement(children, {
          style: {
            transform: 'scale(0)',
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
Zoom.displayName = 'Zoom';

export default Zoom;
