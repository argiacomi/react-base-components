import { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@utils';
import { Transition } from 'react-transition-group';
import { useForkRef } from '@component-hooks';

const getClasses = (orientation, state) => ({
  root: cn(
    'h-0 overflow-hidden',
    orientation === 'horizontal'
      ? 'h-auto w-0 transition-[width] duration-300 ease-in-out delay-0'
      : 'transition-[height] duration-300 ease-in-out delay-0'
  ),
  wrapper: cn('flex w-full', orientation === 'horizontal' && 'w-auto h-full'),
  wrapperInner: cn('w-full', orientation === 'horizontal' && 'w-auto h-full')
});

const getTransitionProps = (props, options) => {
  const { timeout, easing, style = {} } = props;

  return {
    duration:
      style.transitionDuration ??
      (typeof timeout === 'number' ? timeout : timeout[options.mode] || 0),
    easing:
      style.transitionTimingFunction ??
      (typeof easing === 'object' ? easing[options.mode] : easing),
    delay: style.transitionDelay
  };
};

const Collapse = forwardRef(
  (
    {
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
      timeout = duration.standard,
      TransitionComponent = Transition,
      ...other
    },
    ref
  ) => {
    const timer = useRef();
    const wrapperRef = useRef(null);
    const autoTransitionDuration = useRef();
    const collapsedSize =
      typeof collapsedSizeProp === 'number'
        ? `${collapsedSizeProp}px`
        : collapsedSizeProp;
    const isHorizontal = orientation === 'horizontal';
    const size = isHorizontal ? 'width' : 'height';

    useEffect(() => {
      return () => {
        clearTimeout(timer.current);
      };
    }, []);

    const nodeRef = useRef(null);
    const handleRef = useForkRef(ref, nodeRef);

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

    const getWrapperSize = () =>
      wrapperRef.current
        ? wrapperRef.current[isHorizontal ? 'clientWidth' : 'clientHeight']
        : 0;

    const handleEnter = normalizedTransitionCallback((node, isAppearing) => {
      if (wrapperRef.current && isHorizontal) {
        wrapperRef.current.style.position = 'absolute';
      }
      node.style[size] = collapsedSize;

      if (onEnter) {
        onEnter(node, isAppearing);
      }
    });

    const handleEntering = normalizedTransitionCallback((node, isAppearing) => {
      const wrapperSize = getWrapperSize();

      if (wrapperRef.current && isHorizontal) {
        wrapperRef.current.style.position = '';
      }

      const { duration: transitionDuration, easing: transitionTimingFunction } =
        getTransitionProps(
          { style, timeout, easing },
          {
            mode: 'enter'
          }
        );

      if (timeout === 'auto') {
        const duration2 = !wrapperSize
          ? 0
          : Math.round(
              (4 + 15 * (wrapperSize / 36) ** 0.25 + wrapperSize / 36 / 5) * 10
            );

        node.style.transitionDuration = `${duration2}ms`;
        autoTransitionDuration.current = duration2;
      } else {
        node.style.transitionDuration =
          typeof transitionDuration === 'string'
            ? transitionDuration
            : `${transitionDuration}ms`;
      }

      node.style[size] = `${wrapperSize}px`;
      node.style.transitionTimingFunction = transitionTimingFunction;

      if (onEntering) {
        onEntering(node, isAppearing);
      }
    });

    const handleEntered = normalizedTransitionCallback((node, isAppearing) => {
      node.style[size] = 'auto';

      if (onEntered) {
        onEntered(node, isAppearing);
      }
    });

    const handleExit = normalizedTransitionCallback((node) => {
      node.style[size] = `${getWrapperSize()}px`;

      if (onExit) {
        onExit(node);
      }
    });

    const handleExited = normalizedTransitionCallback(onExited);

    const handleExiting = normalizedTransitionCallback((node) => {
      const wrapperSize = getWrapperSize();
      const { duration: transitionDuration, easing: transitionTimingFunction } =
        getTransitionProps(
          { style, timeout, easing },
          {
            mode: 'exit'
          }
        );

      if (timeout === 'auto') {
        const duration2 = !wrapperSize
          ? 0
          : Math.round(
              (4 + 15 * (wrapperSize / 36) ** 0.25 + wrapperSize / 36 / 5) * 10
            );
        node.style.transitionDuration = `${duration2}ms`;
        autoTransitionDuration.current = duration2;
      } else {
        node.style.transitionDuration =
          typeof transitionDuration === 'string'
            ? transitionDuration
            : `${transitionDuration}ms`;
      }

      node.style[size] = collapsedSize;
      node.style.transitionTimingFunction = transitionTimingFunction;

      if (onExiting) {
        onExiting(node);
      }
    });

    const handleAddEndListener = (next) => {
      if (timeout === 'auto') {
        timer.current = setTimeout(next, autoTransitionDuration.current || 0);
      }
      if (addEndListener) {
        addEndListener(nodeRef.current, next);
      }
    };

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
            className={cn(
              classes.root,
              state !== 'entered'
                ? ''
                : orientation === 'horizontal'
                ? 'h-auto w-auto overflow-auto'
                : 'h-auto overflow-auto',
              state === 'exited' && !inProp && collapsedSize === '0px',
              className
            )}
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
  }
);
Collapse.displayName = 'Collapse';

export default Collapse;
