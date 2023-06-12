import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';

const CardContentRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(3)
  }
}));

const CardContent = React.forwardRef((props, ref) => {
  const { className, component = 'div', ...other } = props;

  const ownerState = { ...props, component };

  return (
    <CardContentRoot
      as={component}
      className={clsx('CardContent-Root', className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
});

CardContent.displayName = 'CardContent';

export default CardContent;
