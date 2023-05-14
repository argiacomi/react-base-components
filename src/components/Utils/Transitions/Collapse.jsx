import { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@utils';
import { Transition } from 'react-transition-group';
import { createTransitions, reflow, getTransitionProps } from '@components/lib';
import { useForkRef } from '@component-hooks';
import tw from 'twin.macro';

const getClasses = (orientation, state) => ({
  root: [
    tw`h-0 overflow-hidden duration-300 ease-in-out delay-0`,
    orientation === 'horizontal'
      ? tw`h-auto w-0 transition-[width]`
      : tw`transition-[height]`
  ],
  wrapper: [tw`flex w-full`, orientation === 'horizontal' && tw`w-auto h-full`],
  wrapperInner: [tw`w-full`, orientation === 'horizontal' && tw`w-auto h-full`]
});

const calculateTransitionDuration = (timeout, wrapperSize) => {
  if (timeout !== 'auto' || !wrapperSize) {
    return 0;
  }
  return Math.round(
    (4 + 15 * (wrapperSize / 36) ** 0.25 + wrapperSize / 36 / 5) * 10
  );
};

const Collapse = forwardRef((props, ref) => {
  const {
    addEndListener,
    children,
    className,
    collapsedSize: collapsedSizeProp = '0px',
    Component = 'div',
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

  const timer = useRef();
  const wrapperRef = useRef(null);
  const autoTransitionDuration = useRef();
  const collapsedSize =
    typeof collapsedSizeProp === 'number'
      ? `${collapsedSizeProp}px`
      : collapsedSizeProp;
  const isHorizontal = orientation === 'horizontal';
  const size = isHorizontal ? 'width' : 'height';

  const nodeRef = useRef(null);
  const handleRef = useForkRef(ref, nodeRef);

  const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
    if (callback) {
      const node = nodeRef.current;
      callback(node, maybeIsAppearing);
    }
  };

  const getWrapperSize = () =>
    wrapperRef.current
      ? wrapperRef.current[isHorizontal ? 'clientWidth' : 'clientHeight']
      : 0;

  const handleTransition = (node, mode) => {
    const wrapperSize = getWrapperSize();
    const { duration: transitionDuration, easing: transitionTimingFunction } =
      getTransitionProps({ style, timeout, easing }, { mode });

    const duration2 = calculateTransitionDuration(timeout, wrapperSize);
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

  const handleEntering = normalizedTransitionCallback((node, isAppearing) => {
    handleTransition(node, 'enter');
    if (wrapperRef.current && isHorizontal) {
      wrapperRef.current.style.position = '';
    }
    onEntering?.(node, isAppearing);
  });

  const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
    if (wrapperRef.current && isHorizontal) {
      wrapperRef.current.style.position = 'absolute';
    }
    node.style[size] = collapsedSize;

    onEnter?.(node, isAppearing);
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

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const classes = getClasses(orientation);

  return (
    <TransitionComponent
      in={inProp}
      onEnter={handleEnter}
      onEntered={handleEntered}
      onEntering={handleEntering}
      onExit={handleExit}
      onExited={handleExited}
      onExiting={handleExiting}
      addEndListener={handleAddEndListener}
      nodeRef={nodeRef}
      timeout={timeout === 'auto' ? null : timeout}
      {...other}
    >
      {(state, childProps) => (
        <Component
          css={[
            classes.root,
            state !== 'entered'
              ? ''
              : orientation === 'horizontal'
              ? tw`h-auto w-auto overflow-auto`
              : tw`h-auto overflow-auto`,
            state === 'exited' && !inProp && collapsedSize === '0px',
            className
          ]}
          style={{
            [isHorizontal ? 'minWidth' : 'minHeight']: collapsedSize,
            ...style
          }}
          ref={handleRef}
          {...childProps}
        >
          <div className={classes.wrapper} ref={wrapperRef}>
            <div className={classes.wrapperInner}>{children}</div>
          </div>
        </Component>
      )}
    </TransitionComponent>
  );
});
Collapse.displayName = 'Collapse';

export default Collapse;
