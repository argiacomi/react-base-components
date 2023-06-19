import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import clsx from 'clsx';
import { keyframes } from 'styled-components/macro';
import { styled, useTheme } from '@styles';
import Ripple from './Ripple';

const touchRippleClasses = {
  root: 'root',
  ripple: 'ripple',
  rippleVisible: 'rippleVisible',
  ripplePulsate: 'ripplePulsate',
  child: 'child',
  childLeaving: 'childLeaving',
  childPulsate: 'childPulsate'
};

const enterKeyframe = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0.12;
  }
`;

const exitKeyframe = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const TouchRippleRoot = styled('span')({
  overflow: 'hidden',
  pointerEvents: 'none',
  position: 'absolute',
  zIndex: 0,
  inset: 0,
  borderRadius: 'inherit'
});

export const TouchRippleRipple = styled(Ripple)`
  opacity: 0;
  position: absolute;
  &.${touchRippleClasses.rippleVisible} {
    opacity: 0.12;
    transform: scale(1);
    animation-name: ${enterKeyframe};
    animation-duration: ${({ theme }) => theme.transition.duration.ripple}ms;
    animation-timing-function: ${({ theme }) => theme.transition.easing.easeInOut};
  }
  & .${touchRippleClasses.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }
  & .${touchRippleClasses.childLeaving} {
    opacity: 0;
    animation-name: ${exitKeyframe};
    animation-duration: ${({ theme }) => theme.transition.duration.ripple}ms;
    animation-timing-function: ${({ theme }) => theme.transition.easing.easeInOut};
  }
`;

const TouchRipple = React.forwardRef((props, ref) => {
  const { center: centerProp = false, classes = {}, className, ...other } = props;
  const [ripples, setRipples] = React.useState([]);
  const nextKey = React.useRef(0);
  const rippleCallback = React.useRef();
  const theme = useTheme();

  React.useEffect(() => {
    if (rippleCallback.current) {
      rippleCallback.current();
      rippleCallback.current = null;
    }
  }, [ripples]);

  const ignoringMouseDown = React.useRef(false);
  const startTimer = React.useRef();
  const startTimerCommit = React.useRef(null);
  const container = React.useRef(null);

  React.useEffect(() => {
    return () => {
      clearTimeout(startTimer.current);
    };
  }, []);

  const startCommit = React.useCallback(
    (params) => {
      const { rippleX, rippleY, rippleSize, cb } = params;

      setRipples((oldRipples) => [
        ...oldRipples,
        <TouchRippleRipple
          key={nextKey.current}
          className={'TouchRipple-ripple'}
          classes={{
            ripple: clsx(classes.ripple, touchRippleClasses.ripple),
            rippleVisible: clsx(classes.rippleVisible, touchRippleClasses.rippleVisible),
            child: clsx(classes.child, touchRippleClasses.child),
            childLeaving: clsx(classes.childLeaving, touchRippleClasses.childLeaving)
          }}
          timeout={theme.transition.duration.ripple}
          rippleX={rippleX}
          rippleY={rippleY}
          rippleSize={rippleSize}
        />
      ]);
      nextKey.current += 1;
      rippleCallback.current = cb;
    },
    [classes, theme.transition.duration.ripple]
  );

  const start = React.useCallback(
    (event, options = {}, cb = () => {}) => {
      const { center = centerProp, fakeElement = false } = options;

      if (event?.type === 'mousedown' && ignoringMouseDown.current) {
        ignoringMouseDown.current = false;
        return;
      }

      if (event?.type === 'touchstart') {
        ignoringMouseDown.current = true;
      }

      const element = fakeElement ? null : container.current;
      const rect = element
        ? element.getBoundingClientRect()
        : {
            width: 0,
            height: 0,
            left: 0,
            top: 0
          };

      let rippleX;
      let rippleY;
      let rippleSize;

      if (
        center ||
        event === undefined ||
        (event?.clientX === 0 && event?.clientY === 0) ||
        (!event?.clientX && !event?.touches)
      ) {
        rippleX = Math.round(rect.width / 2);
        rippleY = Math.round(rect.height / 2);
      } else {
        const { clientX, clientY } =
          event && event.touches && event.touches.length > 0 ? event.touches[0] : event;
        rippleX = Math.round(clientX - rect.left);
        rippleY = Math.round(clientY - rect.top);
      }

      if (center) {
        rippleSize = Math.max(rect.width, rect.height); //test change

        if (rippleSize % 2 === 0) {
          rippleSize += 1;
        }
      } else {
        const sizeX =
          Math.max(Math.abs((element ? element.clientWidth : 0) - rippleX), rippleX) * 2 + 2;
        const sizeY =
          Math.max(Math.abs((element ? element.clientHeight : 0) - rippleY), rippleY) * 2 + 2;
        rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
      }

      if (event?.touches) {
        if (startTimerCommit.current === null) {
          startTimerCommit.current = () => {
            startCommit({ rippleX, rippleY, rippleSize, cb });
          };
          startTimer.current = setTimeout(() => {
            if (startTimerCommit.current) {
              startTimerCommit.current();
              startTimerCommit.current = null;
            }
          }, theme.transition.duration.duration75);
        }
      } else {
        startCommit({ rippleX, rippleY, rippleSize, cb });
      }
    },
    [centerProp, startCommit, theme.transition.duration.duration75]
  );

  const stop = React.useCallback((event, cb) => {
    clearTimeout(startTimer.current);

    if (event?.type === 'touchend' && startTimerCommit.current) {
      startTimerCommit.current();
      startTimerCommit.current = null;
      startTimer.current = setTimeout(() => {
        stop(event, cb);
      });
      return;
    }

    startTimerCommit.current = null;

    setRipples((oldRipples) => {
      if (oldRipples.length > 0) {
        return oldRipples.slice(1);
      }
      return oldRipples;
    });
    rippleCallback.current = cb;
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      start,
      stop
    }),
    [start, stop]
  );

  return (
    <TouchRippleRoot
      className={clsx('TouchRipple-Root', classes.root, touchRippleClasses.root, className)}
      {...other}
      ref={container}
    >
      <TransitionGroup component={null} exit>
        {ripples}
      </TransitionGroup>
    </TouchRippleRoot>
  );
});
TouchRipple.displayName = 'TouchRipple';

export default TouchRipple;
