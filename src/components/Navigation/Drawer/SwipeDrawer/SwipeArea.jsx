import React from 'react';
import clsx from 'clsx';
import styled from '@styles';
import { isHorizontal } from '../Drawer';

const SwipeAreaRoot = styled('div')(({ theme, ownerState }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: theme.zIndex.drawer - 1,
  ...{
    left: { right: 'auto' },
    right: {
      left: 'auto',
      right: 0
    },
    top: {
      bottom: 'auto',
      right: 0
    },
    bottom: {
      top: 'auto',
      bottom: 0,
      right: 0
    }
  }[ownerState.anchor]
}));

const SwipeArea = React.forwardRef((props, ref) => {
  const { anchor, classes = {}, className, width, style, ...other } = props;

  const ownerState = props;

  return (
    <SwipeAreaRoot
      className={clsx('SwipeArea-Root', classes.root, className)}
      ref={ref}
      style={{
        [isHorizontal(anchor) ? 'width' : 'height']: width,
        ...style
      }}
      ownerState={ownerState}
      {...other}
    />
  );
});

SwipeArea.displayName = 'SwipeArea';

export default SwipeArea;
