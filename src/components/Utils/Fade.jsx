import * as React from 'react';
import { Transition } from 'react-transition-group';
import { createTransitions, reflow, getTransitionProps } from '@components/lib';
import { useForkRef } from '@component-hooks';

const styles = {
  entering: {
    opacity: 1
  },
  entered: {
    opacity: 1
  }
};

const Fade = React.forwardRef((props, ref) => {
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
    timeout = {
      enter: 225,
      exit: 195
    },
    TransitionComponent = Transition,
    ...other
  } = props;

  const enableStrictModeCompat = true;
  const nodeRef = React.useRef(null);
  const handleRef = useForkRef(nodeRef, children.ref, ref);

  const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
    if (callback) {
      const node = nodeRef.current;

      if (maybeIsAppearing === undefined) {
        callback(node);
      } else {
        callback(node, maybeIsAppearing);
      }
    }
  };

  const handleEntering = normalizedTransitionCallback(onEntering);

  const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
    reflow(node);

    const transitionProps = getTransitionProps(
      { style, timeout, easing },
      { mode: 'enter' }
    );

    node.style.webkitTransition = createTransitions('opacity', transitionProps);
    node.style.transition = createTransitions('opacity', transitionProps);

    if (onEnter) {
      onEnter(node, isAppearing);
    }
  });

  const handleEntered = normalizedTransitionCallback(onEntered);

  const handleExiting = normalizedTransitionCallback(onExiting);

  const handleExit = normalizedTransitionCallback((node) => {
    const transitionProps = getTransitionProps(
      { style, timeout, easing },
      { mode: 'exit' }
    );

    node.style.webkitTransition = createTransitions('opacity', transitionProps);
    node.style.transition = createTransitions('opacity', transitionProps);

    if (onExit) {
      onExit(node);
    }
  });

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
      nodeRef={enableStrictModeCompat ? nodeRef : undefined}
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
            opacity: 0,
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

Fade.displayName = 'Fade';

export default Fade;
