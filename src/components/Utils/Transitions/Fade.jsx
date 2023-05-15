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
  node.style.webkitTransition = createTransitions('opacity', transitionProps);
  node.style.transition = createTransitions('opacity', transitionProps);

  if (onTransition) {
    onTransition(node);
  }
};

const Fade = React.forwardRef(
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
      timeout = {
        enter: 225,
        exit: 195
      },
      TransitionComponent = Transition,
      ...other
    },
    ref
  ) => {
    const enableStrictModeCompat = true;
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
        setTransitionStyle(node, { style, timeout, easing }, 'enter', onEnter);
      }),
      [setTransitionStyle, onEnter]
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
        setTransitionStyle(node, { style, timeout, easing }, 'exit', onEnter);
      }),
      [setTransitionStyle, onExit]
    );

    const handleExiting = React.useCallback(
      normalizedTransitionCallback(onExiting),
      [onExiting]
    );

    const handleExited = React.useCallback(
      normalizedTransitionCallback(onExited),
      [onExited]
    );

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
  }
);

Fade.displayName = 'Fade';

export default Fade;
