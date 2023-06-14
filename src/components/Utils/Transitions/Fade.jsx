import React from 'react';
import { Transition } from 'react-transition-group';
import { reflow, getTransitionProps } from '@component/utils';
import { useForkRef } from '@component/hooks';
import { useTheme } from 'styled-components/macro';

const styles = {
  entering: {
    opacity: 1
  },
  entered: {
    opacity: 1
  }
};

const handleTransition = (
  node,
  style,
  timeout,
  easing,
  mode,
  theme,
  transition,
  isAppearing = undefined
) => {
  reflow(node);

  const transitionProps = getTransitionProps({ style, timeout, easing }, { mode: mode });

  node.style.webkitTransition = theme.transition.create('opacity', transitionProps);
  node.style.transition = theme.transition.create('opacity', transitionProps);

  if (transition) {
    transition(node, isAppearing);
  }
};

const Fade = React.forwardRef((props, ref) => {
  const theme = useTheme();
  const defaultTimeout = {
    enter: theme.transition.duration.enteringScreen,
    exit: theme.transition.duration.leavingScreen
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
    TransitionComponent = Transition,
    ...other
  } = props;

  const enableStrictModeCompat = true;
  const nodeRef = React.useRef(null);
  const handleRef = useForkRef(nodeRef, children.ref, ref);

  const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
    if (callback) {
      callback(nodeRef.current, maybeIsAppearing);
    }
  };

  const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
    handleTransition(node, style, timeout, easing, 'enter', theme, onEnter, isAppearing);
  });

  const handleEntering = normalizedTransitionCallback(onEntering);
  const handleEntered = normalizedTransitionCallback(onEntered);

  const handleExit = normalizedTransitionCallback((node) => {
    handleTransition(node, style, timeout, easing, 'exit', theme, onExit);
  });

  const handleExiting = normalizedTransitionCallback(onExiting);
  const handleExited = normalizedTransitionCallback(onExited);

  return (
    <TransitionComponent
      appear={appear}
      in={inProp}
      nodeRef={enableStrictModeCompat ? nodeRef : undefined}
      onEnter={handleEnter}
      onEntering={handleEntering}
      onEntered={handleEntered}
      onExit={handleExit}
      onExiting={handleExiting}
      onExited={handleExited}
      addEndListener={addEndListener}
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
