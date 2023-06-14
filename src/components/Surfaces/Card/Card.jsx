import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import Paper from '../Paper';

const CardRoot = styled(Paper)(() => {
  return {
    overflow: 'hidden'
  };
});

const Card = React.forwardRef((props, ref) => {
  const { className, raised = false, ...other } = props;

  const ownerState = { ...props, raised };

  return (
    <CardRoot
      className={clsx('Card-Root', className)}
      elevation={raised ? 8 : undefined}
      ref={ref}
      ownerState={ownerState}
      {...other}
    />
  );
});

Card.displayName = 'Card';

export default Card;
