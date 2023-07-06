import { css } from 'styled-components/macro';
import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';

export const skeletonClasses = {
  root: 'Skeleton-Root'
};

const SkeletonRoot = styled('span')(
  ({ theme, ownerState }) => ({
    display: 'block',
    backgroundColor: theme.alpha.add(
      theme.color.text.primary,
      theme.color.mode === 'light' ? 0.11 : 0.13
    ),
    height: '1.2rem',
    ...(ownerState.variant === 'text' && {
      marginTop: 0,
      marginBottom: 0,
      height: 'auto',
      transformOrigin: '0 55%',
      transform: 'scale(1, 0.60)',
      '&:empty:before': {
        content: '"\\00a0"'
      }
    }),
    ...(ownerState.variant === 'circular' && {
      borderRadius: theme.rounded.full
    }),
    ...(ownerState.variant === 'rounded' && {
      borderRadius: 'inherit'
    }),
    ...(ownerState.hasChildren && {
      '& > *': {
        visibility: 'hidden'
      }
    }),
    ...(ownerState.hasChildren &&
      !ownerState.width && {
        maxWidth: 'fit-content'
      }),
    ...(ownerState.hasChildren &&
      !ownerState.height && {
        height: 'auto'
      })
  }),
  ({ theme, ownerState }) =>
    ownerState.animation === 'pulse' &&
    css`
      animation: ${theme.keyframe.pulseKeyframe} 2s ${theme.transition.easing.easeInOut} 0.5s
        infinite;
    `,
  ({ ownerState, theme }) =>
    ownerState.animation === 'wave' &&
    css`
      position: relative;
      overflow: hidden;
      -webkit-mask-image: -webkit-radial-gradient(white, black);
      &::after {
        animation: ${theme.keyframe.waveKeyframe} 1.6s ${theme.transition.easing.linear} 0.5s
          infinite;
        background: linear-gradient(90deg, transparent, ${theme.color.hover}, transparent);
        content: '';
        position: absolute;
        transform: translateX(-100%);
        inset: 0;
      }
    `,
  ({ ownerState }) => ownerState.cssStyles
);

const Skeleton = React.forwardRef((props, ref) => {
  const {
    animation = 'pulse',
    children,
    component: componentProp = 'span',
    height,
    slots = {},
    slotProps = {},
    style,
    variant = 'text',
    width,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    animation,
    cssStyles,
    height,
    variant,
    width,
    ...other,
    hasChildren: Boolean(children)
  };

  const component = componentProp || 'span';
  const SkeletonComponent = slots.root || SkeletonRoot;
  const skeletonRootProps = useSlotProps({
    elementType: SkeletonComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref,
      style: {
        width,
        height,
        ...style
      }
    },
    ownerState,
    className: skeletonClasses.root
  });

  return (
    <SkeletonComponent as={component} {...skeletonRootProps}>
      {children}
    </SkeletonComponent>
  );
});
Skeleton.displayName = 'Skeleton';

export default Skeleton;
