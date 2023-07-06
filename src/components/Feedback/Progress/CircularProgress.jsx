import React from 'react';
import { keyframes, css } from 'styled-components/macro';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';

export const circularProgressClasses = {
  root: 'CircularProgress-Root',
  svg: 'CircularProgress-SVG',
  circle: 'CircularProgress-Circle',
  circleDisableShrink: 'CircleDisableShrink'
};

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
      color: theme.color[ownerState.color].body
    })
  }),
  ({ ownerState }) =>
    ownerState.variant === 'indeterminate' &&
    css`
      animation: ${circularRotateKeyframe} 1.4s linear infinite;
    `,
  ({ ownerState }) => ownerState.cssStyles
);

const CircularProgressSVG = styled('svg')({
  display: 'block'
});

const CircularProgressCircle = styled('circle')(
  ({ ownerState, theme }) => ({
    stroke: 'currentColor',
    ...(ownerState.variant === 'determinate' && {
      transition: theme.transition.create('stroke-dashoffset')
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
    color = 'primary',
    component: componentProp = 'span',
    disableShrink = false,
    size = 40,
    slots = {},
    slotProps = {},
    style,
    thickness = 3.6,
    value = 0,
    variant = 'indeterminate',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
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

  const classes = {
    root: circularProgressClasses.root,
    svg: circularProgressClasses.svg,
    circle: [
      circularProgressClasses.circle,
      ownerState.disableShrink && circularProgressClasses.circleDisableShrink
    ]
  };

  const component = componentProp || 'span';
  const CircularProgressComponent = slots.root || CircularProgressRoot;
  const circularProgresstRootProps = useSlotProps({
    elementType: CircularProgressComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref,
      role: 'progressbar',
      style: { width: size, height: size, ...rootStyle, ...style },
      ...rootProps
    },
    ownerState,
    className: classes.root
  });

  const CircularProgressSVGComponent = slots.svg || CircularProgressSVG;
  const circularProgressSVGProps = useSlotProps({
    elementType: CircularProgressComponent,
    externalSlotProps: slotProps.svg,
    additionalProps: {
      viewBox: `${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`
    },
    ownerState,
    className: classes.svg
  });

  const CircularProgressCircleComponent = slots.circle || CircularProgressCircle;
  const circularProgressCircleProps = useSlotProps({
    elementType: CircularProgressComponent,
    externalSlotProps: slotProps.circle,
    additionalProps: {
      style: circleStyle,
      cx: SIZE,
      cy: SIZE,
      r: (SIZE - thickness) / 2,
      fill: 'none',
      strokeWidth: thickness
    },
    ownerState,
    className: classes.circle
  });

  return (
    <CircularProgressComponent as={component} {...circularProgresstRootProps}>
      <CircularProgressSVGComponent {...circularProgressSVGProps}>
        <CircularProgressCircleComponent {...circularProgressCircleProps} />
      </CircularProgressSVGComponent>
    </CircularProgressComponent>
  );
});

CircularProgress.displayName = 'CircularProgress';

export default CircularProgress;
