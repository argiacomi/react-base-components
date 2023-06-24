import React from 'react';
import clsx from 'clsx';
import styled from '@styles';
import { Text } from '@components/layout';

const AlertTitleRoot = styled(Text).withConfig({
  shouldForwardProp: (prop) => !['ownerState'].includes(prop)
})(({ theme }) => {
  return {
    fontWeight: theme.text.weight.medium,
    marginTop: -2
  };
});

const AlertTitle = React.forwardRef((props, ref) => {
  const { className, ...other } = props;

  const ownerState = props;

  return (
    <AlertTitleRoot
      gutterBottom
      component='div'
      ownerState={ownerState}
      ref={ref}
      className={clsx('AlertTitle-Root', className)}
      {...other}
    />
  );
});
AlertTitle.displayName = 'AlertTitle';

export default AlertTitle;
