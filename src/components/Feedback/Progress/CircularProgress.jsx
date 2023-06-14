import React from 'react';
import clsx from 'clsx';
import { keyframes, css } from 'styled-components/macro';
import { styled } from '@styles';

const SIZE = 44;

const circularRotateKeyframe = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

const circularDashKeyframe = keyframes`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`;

const CircularProgressRoot = styled('span')(
  ({ ownerState, theme }) => ({
    display: 'inline-block',
    ...(ownerState.variant === 'determinate' && {
      transition: theme.transition.create('transform')
    }),
    ...(ownerState.color !== 'inherit' && {
      color: (theme.vars || theme).palette[ownerState.color].main
    })
  }),
  ({ ownerState }) =>
    ownerState.variant === 'indeterminate' &&
    css`
      animation: ${circularRotateKeyframe} 1.4s linear infinite;
    `
);

const CircularProgressSVG = styled('svg')({
  display: 'block'
});

const CircularProgressCircle = styled('circle')(
  ({ ownerState, theme }) => ({
    stroke: 'currentColor',
    ...(ownerState.variant === 'determinate' && {
      transition: theme.transitions.create('stroke-dashoffset')
    }),
    ...(ownerState.variant === 'indeterminate' && {
      strokeDasharray: '80px, 200px',
      strokeDashoffset: 0
    })
  }),
  ({ ownerState }) =>
    ownerState.variant === 'indeterminate' &&
    !ownerState.disableShrink &&
    css`
      animation: ${circularDashKeyframe} 1.4s ease-in-out infinite;
    `
);

const CircularProgress = React.forwardRef((props, ref) => {
  const {
    className,
    color = 'primary',
    disableShrink = false,
    size = 40,
    style,
    thickness = 3.6,
    value = 0,
    variant = 'indeterminate',
    ...other
  } = props;

  const ownerState = {
    ...props,
    color,
    disableShrink,
    size,
    thickness,
    value,
    variant
  };

  const circleStyle = {};
  const rootStyle = {};
  const rootProps = {};

  if (variant === 'determinate') {
    const circumference = 2 * Math.PI * ((SIZE - thickness) / 2);
    circleStyle.strokeDasharray = circumference.toFixed(3);
    rootProps['aria-valuenow'] = Math.round(value);
    circleStyle.strokeDashoffset = `${(((100 - value) / 100) * circumference).toFixed(3)}px`;
    rootStyle.transform = 'rotate(-90deg)';
  }

  return (
    <CircularProgressRoot
      className={clsx('CircularProgress-Root', className)}
      style={{ width: size, height: size, ...rootStyle, ...style }}
      ownerState={ownerState}
      ref={ref}
      role='progressbar'
      {...rootProps}
      {...other}
    >
      <CircularProgressSVG
        className={'CircularProgress-Svg'}
        ownerState={ownerState}
        viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}
      >
        <CircularProgressCircle
          className={'CircularProgress-Circle'}
          style={circleStyle}
          ownerState={ownerState}
          cx={SIZE}
          cy={SIZE}
          r={(SIZE - thickness) / 2}
          fill='none'
          strokeWidth={thickness}
        />
      </CircularProgressSVG>
    </CircularProgressRoot>
  );
});

CircularProgress.displayName = 'CircularProgress';

export default CircularProgress;
