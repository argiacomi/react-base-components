import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { useListContext } from '../List/ListContext';

const ListItemSecondaryActionRoot = styled('div')(({ theme, ownerState }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: '50%',
  transform: 'translateY(-50%)',
  ...(ownerState.disableGutters && {
    right: 0
  })
}));

const ListItemSecondaryAction = React.forwardRef((props, ref) => {
  const { className, ...other } = props;
  const context = useListContext();
  const ownerState = { ...props, disableGutters: context.disableGutters };

  return (
    <ListItemSecondaryActionRoot
      className={clsx('ListItemSecondaryAction-Root', className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
});

ListItemSecondaryAction.displayName = 'ListItemSecondaryAction';

export default ListItemSecondaryAction;
