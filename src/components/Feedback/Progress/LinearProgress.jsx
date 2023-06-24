import React from 'react';
import clsx from 'clsx';
import styled, { useTheme } from '@styles';
import { keyframes, css } from 'styled-components/macro';

const TRANSITION_DURATION = 4; // seconds
const indeterminate1Keyframe = keyframes`
  0% {
    left: -35%;
    right: 100%;
  }

  60% {
    left: 100%;
    right: -90%;
  }

  100% {
    left: 100%;
    right: -90%;
  }
`;

const indeterminate2Keyframe = keyframes`
  0% {
    left: -200%;
    right: 100%;
  }

  60% {
    left: 107%;
    right: -8%;
  }

  100% {
    left: 107%;
    right: -8%;
  }
`;

const bufferKeyframe = keyframes`
  0% {
    opacity: 1;
    background-position: 0 -23px;
  }

  60% {
    opacity: 0;
    background-position: 0 -23px;
  }

  100% {
    opacity: 1;
    background-position: -200px -23px;
  }
`;

const getColorShade = (theme, color) => {
  if (color === 'inherit') {
    return 'currentColor';
  }
  return theme.color.mode === 'light'
    ? theme.alpha.lighten(theme.color[color].main, 0.62)
    : theme.alpha.darken(theme.color[color].main, 0.5);
};

const LinearProgressRoot = styled('span')(({ ownerState, theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  display: 'block',
  height: 4,
  zIndex: 0, // Fix Safari's bug during composition of different paint.
  '@media print': {
    colorAdjust: 'exact'
  },
  backgroundColor: getColorShade(theme, ownerState.color),
  ...(ownerState.color === 'inherit' &&
    ownerState.variant !== 'buffer' && {
      backgroundColor: 'none',
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'currentColor',
        opacity: 0.3
      }
    }),
  ...(ownerState.variant === 'buffer' && { backgroundColor: 'transparent' }),
  ...(ownerState.variant === 'query' && { transform: 'rotate(180deg)' })
}));

const LinearProgressDashed = styled('span')(
  ({ ownerState, theme }) => {
    const backgroundColor = getColorShade(theme, ownerState.color);

    return {
      position: 'absolute',
      marginTop: 0,
      height: '100%',
      width: '100%',
      ...(ownerState.color === 'inherit' && {
        opacity: 0.3
      }),
      backgroundImage: `radial-gradient(${backgroundColor} 0%, ${backgroundColor} 16%, transparent 42%)`,
      backgroundSize: '10px 10px',
      backgroundPosition: '0 -23px'
    };
  },
  css`
    animation: ${bufferKeyframe} 3s infinite linear;
  `
);

const LinearProgressBar1 = styled('span')(
  ({ ownerState, theme }) => ({
    width: '100%',
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    transition: 'transform 0.2s linear',
    transformOrigin: 'left',
    backgroundColor:
      ownerState.color === 'inherit' ? 'currentColor' : theme.color[ownerState.color].body,
    ...(ownerState.variant === 'determinate' && {
      transition: `transform .${TRANSITION_DURATION}s linear`
    }),
    ...(ownerState.variant === 'buffer' && {
      zIndex: 1,
      transition: `transform .${TRANSITION_DURATION}s linear`
    })
  }),
  ({ ownerState }) =>
    (ownerState.variant === 'indeterminate' || ownerState.variant === 'query') &&
    css`
      width: auto;
      animation: ${indeterminate1Keyframe} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    `
);

const LinearProgressBar2 = styled('span')(
  ({ ownerState, theme }) => ({
    width: '100%',
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    transition: 'transform 0.2s linear',
    transformOrigin: 'left',
    ...(ownerState.variant !== 'buffer' && {
      backgroundColor:
        ownerState.color === 'inherit' ? 'currentColor' : theme.color[ownerState.color].body
    }),
    ...(ownerState.color === 'inherit' && {
      opacity: 0.3
    }),
    ...(ownerState.variant === 'buffer' && {
      backgroundColor: getColorShade(theme, ownerState.color),
      transition: `transform .${TRANSITION_DURATION}s linear`
    })
  }),
  ({ ownerState }) =>
    (ownerState.variant === 'indeterminate' || ownerState.variant === 'query') &&
    css`
      width: auto;
      animation: ${indeterminate2Keyframe} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite;
    `
);

const LinearProgress = React.forwardRef((props, ref) => {
  const {
    className,
    color = 'primary',
    value,
    valueBuffer,
    variant = 'indeterminate',
    ...other
  } = props;

  const ownerState = {
    ...props,
    color,
    variant
  };

  const theme = useTheme();

  const rootProps = {};
  const inlineStyles = { bar1: {}, bar2: {} };

  if (variant === 'determinate' || variant === 'buffer') {
    if (value !== undefined) {
      rootProps['aria-valuenow'] = Math.round(value);
      rootProps['aria-valuemin'] = 0;
      rootProps['aria-valuemax'] = 100;
      let transform = value - 100;
      if (theme.direction === 'rtl') {
        transform = -transform;
      }
      inlineStyles.bar1.transform = `translateX(${transform}%)`;
    } else if (!import.meta.env.PROD) {
      console.error(
        `You need to provide a value prop when using the determinate or buffer variant of LinearProgress.`
      );
    }
  }
  if (variant === 'buffer') {
    if (valueBuffer !== undefined) {
      let transform = (valueBuffer || 0) - 100;
      if (theme.direction === 'rtl') {
        transform = -transform;
      }
      inlineStyles.bar2.transform = `translateX(${transform}%)`;
    } else if (!import.meta.env.PROD) {
      console.error(
        `You need to provide a valueBuffer prop when using the buffer variant of LinearProgress.`
      );
    }
  }

  return (
    <LinearProgressRoot
      className={clsx('LinearProgress-Root', className)}
      ownerState={ownerState}
      role='progressbar'
      {...rootProps}
      ref={ref}
      {...other}
    >
      {variant === 'buffer' ? (
        <LinearProgressDashed className={'LinearProgress-Dashed'} ownerState={ownerState} />
      ) : null}
      <LinearProgressBar1
        className={'LinearProgress-Bar1'}
        ownerState={ownerState}
        style={inlineStyles.bar1}
      />
      {variant === 'determinate' ? null : (
        <LinearProgressBar2
          className={'LinearProgress-Bar2'}
          ownerState={ownerState}
          style={inlineStyles.bar2}
        />
      )}
    </LinearProgressRoot>
  );
});

LinearProgress.displayName = 'LinearProgress';

export default LinearProgress;
