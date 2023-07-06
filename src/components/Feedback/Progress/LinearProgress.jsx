import { css, keyframes } from 'styled-components/macro';
import React from 'react';
import styled, { extractStyling, useTheme } from '@styles';
import { useSlotProps } from '@components/lib';

const linearProgressClasses = {
  root: 'LinearProgress-Root',
  dashed: 'LinearProgress-Dashed',
  bar: 'LinearProgress-Bar',
  bar1Indeterminate: 'Bar1Indeterminate',
  bar1Determinate: 'Bar1Determinate',
  bar1Buffer: 'Bar1Buffer',
  bar2Indeterminate: 'Bar2Indeterminate',
  bar2Determinate: 'Bar2Determinate',
  bar2Buffer: 'Bar2Buffer'
};

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
    ? theme.alpha.lighten(theme.color[color].body, 0.62)
    : theme.alpha.darken(theme.color[color].body, 0.5);
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
  ...(ownerState.variant === 'query' && { transform: 'rotate(180deg)' }),
  ...ownerState.cssStyles
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
  `,
  ({ ownerState }) => ownerState.cssStyles
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
    color = 'primary',
    component: componentProp = 'span',
    slots = {},
    slotProps = {},
    value,
    valueBuffer,
    variant = 'indeterminate',
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
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

  const classes = {
    root: linearProgressClasses.root,
    dashed: linearProgressClasses.dashed,
    bar1: [
      linearProgressClasses.bar,
      (variant === 'indeterminate' || variant === 'query') &&
        linearProgressClasses.bar1Indeterminate,
      variant === 'determinate' && linearProgressClasses.bar1Determinate,
      variant === 'buffer' && linearProgressClasses.bar1Buffer
    ],
    bar2: [
      linearProgressClasses.bar,
      (variant === 'indeterminate' || variant === 'query') && linearProgressClasses.bar2Determinate,
      variant === 'buffer' && linearProgressClasses.bar2Buffer
    ]
  };

  const component = componentProp || 'span';
  const LinearProgressComponent = slots.root || LinearProgressRoot;
  const linearProgresstRootProps = useSlotProps({
    elementType: LinearProgressComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref,
      role: 'progressbar',
      ...rootProps
    },
    ownerState,
    className: classes.root
  });

  const LinearProgressDashedComponent = slots.root || LinearProgressDashed;
  const linearProgressDashedProps = useSlotProps({
    elementType: LinearProgressDashedComponent,
    externalSlotProps: slotProps.dashed,
    ownerState,
    className: classes.dashed
  });

  const LinearProgressBar1Component = slots.root || LinearProgressBar1;
  const linearProgressBar1Props = useSlotProps({
    elementType: LinearProgressBar1Component,
    externalSlotProps: slotProps.bar1,
    additionalProps: { style: inlineStyles.bar1 },
    ownerState,
    className: classes.bar
  });

  const LinearProgressBar2Component = slots.root || LinearProgressBar2;
  const linearProgressBar2Props = useSlotProps({
    elementType: LinearProgressBar2Component,
    externalSlotProps: slotProps.bar2,
    additionalProps: { style: inlineStyles.bar2 },
    ownerState,
    className: classes.bar
  });

  return (
    <LinearProgressRoot as={component} {...linearProgresstRootProps}>
      {variant === 'buffer' ? (
        <LinearProgressDashedComponent {...linearProgressDashedProps} />
      ) : null}
      <LinearProgressBar1Component {...linearProgressBar1Props} />
      {variant === 'determinate' ? null : (
        <LinearProgressBar2Component {...linearProgressBar2Props} />
      )}
    </LinearProgressRoot>
  );
});

LinearProgress.displayName = 'LinearProgress';

export default LinearProgress;
