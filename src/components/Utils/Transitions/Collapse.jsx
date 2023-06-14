import React from 'react';
import clsx from 'clsx';
import { Transition } from 'react-transition-group';
import { getTransitionProps, getAutoHeightDuration } from '@component/utils';
import { useForkRef } from '@component/hooks';
import { styled } from '@styles';

const CollapseRoot = styled('div')(({ theme, ownerState }) => ({
  height: 0,
  overflow: 'hidden',
  transition: theme.transition.create('height'),
  ...(ownerState.orientation === 'horizontal' && {
    height: 'auto',
    width: 0,
    transition: theme.transition.create('width')
  }),
  ...(ownerState.state === 'entered' && {
    height: 'auto',
    overflow: 'visible',
    ...(ownerState.orientation === 'horizontal' && {
      width: 'auto'
    })
  }),
  ...(ownerState.state === 'exited' &&
    !ownerState.in &&
    ownerState.collapsedSize === '0px' && {
      visibility: 'hidden'
    })
}));

const CollapseWrapper = styled('div')(({ ownerState }) => ({
  display: 'flex',
  width: '100%',
  ...(ownerState.orientation === 'horizontal' && {
    width: 'auto',
    height: '100%'
  })
}));

const CollapseWrapperInner = styled('div')(({ ownerState }) => ({
  width: '100%',
  ...(ownerState.orientation === 'horizontal' && {
    width: 'auto',
    height: '100%'
  })
}));

const Collapse = React.forwardRef((props, ref) => {
  const {
    addEndListener,
    children,
    className,
    collapsedSize: collapsedSizeProp = '0px',
    component = 'div',
    easing,
    in: inProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    orientation = 'vertical',
    style,
    timeout = 300,
    TransitionComponent = Transition,
    ...other
  } = props;

  const ownerState = {
    ...props,
    orientation,
    collapsedSize: collapsedSizeProp
  };

  const timer = React.useRef();
  const wrapperRef = React.useRef(null);
  const autoTransitionDuration = React.useRef();
  const collapsedSize =
    typeof collapsedSizeProp === 'number' ? `${collapsedSizeProp}px` : collapsedSizeProp;
  const isHorizontal = orientation === 'horizontal';
  const size = isHorizontal ? 'width' : 'height';

  const nodeRef = React.useRef(null);
  const handleRef = useForkRef(ref, nodeRef);

  const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
    if (callback) {
      const node = nodeRef.current;
      callback(node, maybeIsAppearing);
    }
  };

  const getWrapperSize = () =>
    wrapperRef.current ? wrapperRef.current[isHorizontal ? 'clientWidth' : 'clientHeight'] : 0;

  const handleTransition = (node, mode) => {
    const wrapperSize = getWrapperSize();
    const { duration: transitionDuration, easing: transitionTimingFunction } = getTransitionProps(
      { style, timeout, easing },
      { mode }
    );

    const duration2 = getAutoHeightDuration(timeout, wrapperSize);
    node.style.transitionDuration =
      timeout === 'auto'
        ? `${duration2}ms`
        : typeof transitionDuration === 'string'
        ? transitionDuration
        : `${transitionDuration}ms`;
    node.style[size] = mode === 'enter' ? `${wrapperSize}px` : collapsedSize;
    node.style.transitionTimingFunction = transitionTimingFunction;

    if (timeout === 'auto') {
      autoTransitionDuration.current = duration2;
    }
  };

  const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
    if (wrapperRef.current && isHorizontal) {
      wrapperRef.current.style.position = 'absolute';
    }
    node.style[size] = collapsedSize;

    onEnter?.(node, isAppearing);
  });

  const handleEntering = normalizedTransitionCallback((node, isAppearing) => {
    handleTransition(node, 'enter');
    if (wrapperRef.current && isHorizontal) {
      wrapperRef.current.style.position = '';
    }
    onEntering?.(node, isAppearing);
  });

  const handleEntered = normalizedTransitionCallback((node, isAppearing) => {
    node.style[size] = 'auto';
    onEntered?.(node, isAppearing);
  });

  const handleExit = normalizedTransitionCallback((node) => {
    node.style[size] = `${getWrapperSize()}px`;
    onExit?.(node);
  });

  const handleExiting = normalizedTransitionCallback((node) => {
    handleTransition(node, 'exit');
    onExiting?.(node);
  });

  const handleExited = normalizedTransitionCallback(onExited);

  const handleAddEndListener = (next) => {
    if (timeout === 'auto') {
      timer.current = setTimeout(next, autoTransitionDuration.current || 0);
    }
    addEndListener?.(nodeRef.current, next);
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <TransitionComponent
      in={inProp}
      onEnter={handleEnter}
      onEntering={handleEntering}
      onEntered={handleEntered}
      onExit={handleExit}
      onExiting={handleExiting}
      onExited={handleExited}
      addEndListener={handleAddEndListener}
      nodeRef={nodeRef}
      timeout={timeout === 'auto' ? null : timeout}
      {...other}
    >
      {(state, childProps) => (
        <CollapseRoot
          as={component}
          className={clsx(
            'Collapse-Root',
            {
              entered: state === 'entered',
              hidden: state === 'exited' && !inProp && collapsedSize === '0px'
            },
            className
          )}
          style={{
            [isHorizontal ? 'minWidth' : 'minHeight']: collapsedSize,
            ...style
          }}
          ownerState={{ ...ownerState, state }}
          ref={handleRef}
          {...childProps}
        >
          <CollapseWrapper
            ownerState={{ ...ownerState, state }}
            className={'Collapse-Wrapper'}
            ref={wrapperRef}
          >
            <CollapseWrapperInner
              ownerState={{ ...ownerState, state }}
              className={'Collapse-WrapperInner'}
            >
              {children}
            </CollapseWrapperInner>
          </CollapseWrapper>
        </CollapseRoot>
      )}
    </TransitionComponent>
  );
});
Collapse.displayName = 'Collapse';
Collapse.supportAuto = true;

export default Collapse;
