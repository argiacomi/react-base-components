import React from 'react';
import clsx from 'clsx';
import styled from 'styled-components/macro';

const PaperRoot = styled('div')(({ theme, ownerState }) => {
  return {
    backgroundColor: theme.color.background,
    color: theme.color.text.primary,
    transition: theme.transition.create('filter'),
    ...(!ownerState.square && {
      borderRadius: theme.rounded.md
    }),
    ...(ownerState.outlined && {
      border: `1px solid ${theme.color.divider}`,
      filter: theme.dropShadow.none
    }),
    ...(!ownerState.outlined && {
      filter: theme.dropShadow[ownerState.elevation] || theme.dropShadow[3],
      ...(theme.color.mode === 'dark' && {
        backgroundImage: `linear-gradient(${theme.alpha.add(
          theme.color.white,
          theme.alpha[ownerState.elevation]
        )},${theme.alpha.add(theme.color.white, theme.alpha.overlay(ownerState.elevation))})`
      })
    })
  };
});

const Paper = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    component = 'div',
    elevation = 3,
    square = false,
    outlined = false,
    ...other
  } = props;

  const ownerState = { ...props, component, elevation, square, outlined };

  return (
    <PaperRoot
      as={component}
      className={clsx('Paper-Root', className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    >
      {children}
    </PaperRoot>
  );
});

Paper.displayName = 'Paper';

export default Paper;
