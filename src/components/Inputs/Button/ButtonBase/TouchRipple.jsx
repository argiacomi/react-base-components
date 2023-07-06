import { keyframes } from 'styled-components/macro';
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import clsx from 'clsx';
import styled, { shouldForwardProp, useTheme } from '@styles';
import Ripple from './Ripple';

const touchRippleClasses = {
  root: 'TouchRipple-Root',
  ripple: 'TouchRipple-Ripple',
  rippleVisible: 'RippleVisible',
  ripplePulsate: 'RipplePulsate',
  child: 'TouchRipple-Child',
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

const pulsateKeyframe = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.75);
  }

  100% {
    transform: scale(1);
  }
`;

export const TouchRippleRoot = styled('span', {
  name: 'PrivateTouchRipple',
  slot: 'Root'
})({
  overflow: 'hidden',
  pointerEvents: 'none',
  position: 'absolute',
  zIndex: 0,
  inset: 0,
  borderRadius: 'inherit'
});

export const TouchRippleRipple = styled(Ripple, {
  shouldForwardProp: (prop) => shouldForwardProp(prop) || prop === 'classes',
  name: 'PrivateTouchRipple',
  slot: 'Ripple'
})`
  opacity: 0;
  position: absolute;
  &.${touchRippleClasses.rippleVisible} {
    opacity: 0.12;
    transform: scale(1);
    animation-name: ${enterKeyframe};
    animation-duration: ${({ theme }) => theme.transition.duration.ripple}ms;
    animation-timing-function: ${({ theme }) => theme.transition.easing.easeInOut};
  }
  &.${touchRippleClasses.ripplePulsate} {
    animation-duration: ${({ theme }) => theme.transition.duration.shorter}ms;
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
  & .${touchRippleClasses.childPulsate} {
    position: absolute;
    left: 0px;
    top: 0;
    animation-name: ${pulsateKeyframe};
    animation-duration: 2500ms;
    animation-timing-function: ${({ theme }) => theme.transition.easing.easeInOut};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`;

const TouchRipple = React.forwardRef((props, ref) => {
  const { center: centerProp = false, classes = {}, ...other } = props;
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
      const { pulsate, rippleX, rippleY, rippleSize, cb } = params;

      setRipples((oldRipples) => [
        ...oldRipples,
        <TouchRippleRipple
          key={nextKey.current}
          classes={{
            ripple: clsx(classes.ripple, touchRippleClasses.ripple),
            rippleVisible: clsx(classes.rippleVisible, touchRippleClasses.rippleVisible),
            ripplePulsate: clsx(classes.ripplePulsate, touchRippleClasses.ripplePulsate),
            child: clsx(classes.child, touchRippleClasses.child),
            childLeaving: clsx(classes.childLeaving, touchRippleClasses.childLeaving),
            childPulsate: clsx(classes.childPulsate, touchRippleClasses.childPulsate)
          }}
          timeout={theme.transition.duration.ripple}
          pulsate={pulsate}
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
      const {
        pulsate = false,
        center = centerProp || options.pulsate,
        fakeElement = false // For test purposes
      } = options;

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
            startCommit({ pulsate, rippleX, rippleY, rippleSize, cb });
          };
          startTimer.current = setTimeout(() => {
            if (startTimerCommit.current) {
              startTimerCommit.current();
              startTimerCommit.current = null;
            }
          }, theme.transition.duration.duration75);
        }
      } else {
        startCommit({ pulsate, rippleX, rippleY, rippleSize, cb });
      }
    },
    [centerProp, startCommit, theme.transition.duration.duration75]
  );

  const pulsate = React.useCallback(() => {
    start({}, { pulsate: true });
  }, [start]);

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
      pulsate,
      start,
      stop
    }),
    [pulsate, start, stop]
  );

  return (
    <TouchRippleRoot
      className={clsx(classes.root, touchRippleClasses.root)}
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
