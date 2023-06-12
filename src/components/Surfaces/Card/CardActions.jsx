import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';

const CardActionsRoot = styled('div')(({ theme, ownerState }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  ...(!ownerState.disableSpacing && {
    '& > :not(:first-of-type)': {
      marginLeft: theme.spacing(1)
    }
  })
}));

const CardActions = React.forwardRef((props, ref) => {
  const { disableSpacing = false, className, ...other } = props;

  const ownerState = { ...props, disableSpacing };

  return (
    <CardActionsRoot
      className={clsx('CardActions-Root', className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
});

CardActions.displayName = 'CardActions';

export default CardActions;
