import React from 'react';
import clsx from 'clsx';
import styled from '@styles';
import { css } from 'styled-components/macro';

const SkeletonRoot = styled('span')(
  ({ theme, ownerState }) => ({
    display: 'block',
    backgroundColor: theme.color.background,
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
        background: linear-gradient(
          90deg,
          transparent,
          ${theme.alpha.add(
            theme.color.mode === 'light' ? theme.color.black : theme.color.white,
            0.05
          )},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        inset: 0;
      }
    `
);

const Skeleton = React.forwardRef(
  (
    {
      animation = 'pulse',
      children,
      className,
      component = 'span',
      height,
      style,
      variant = 'text',
      width,
      ...other
    },
    ref
  ) => {
    const ownerState = {
      animation,
      className,
      component,
      height,
      style,
      variant,
      width,
      ...other,
      hasChildren: Boolean(children)
    };

    return (
      <SkeletonRoot
        as={component}
        className={clsx('Skeleton-Root', className)}
        ownerState={ownerState}
        ref={ref}
        {...other}
        style={{
          width,
          height,
          ...style
        }}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

export default Skeleton;
