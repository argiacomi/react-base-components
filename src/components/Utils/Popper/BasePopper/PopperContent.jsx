import React from 'react';
import clsx from 'clsx';
import styled from 'styled-components/macro';

const PopperContentRoot = styled('div')(({ theme, ownerState }) => ({
  position: ownerState.position,
  display: 'inline-block',
  backgroundColor: theme.color.background,
  ['--popper-arrow-bg']: theme.color.background,
  color: theme.color.text.primary,
  boxShadow: theme.boxShadow[ownerState.elevation],
  border: ownerState.outlined ? `1px solid ${theme.color.divider}` : 'transparent',
  ['--popper-arrow-border-color']: ownerState.outlined ? `${theme.color.divider}` : 'transparent',
  backgroundClip: 'padding-box',
  ...(!ownerState.square && {
    borderRadius: theme.rounded.md
  })
}));

const PopperContent = React.forwardRef((props, ref) => {
  const { className, component, elevation = 5, square = false, outlined = false, ...other } = props;

  const ownerState = { ...props, elevation, square, outlined };

  return (
    <PopperContentRoot
      as={component}
      className={clsx('PpperContent-Root', className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
});

PopperContent.displayName = 'PopperContent';

export default PopperContent;
