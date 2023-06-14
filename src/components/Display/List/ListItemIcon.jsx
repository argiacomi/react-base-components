import React from 'react';
import clsx from 'clsx';
import { styled } from '@styles';
import { useListContext } from '../List/ListContext';

const ListItemIconRoot = styled('div')(({ theme, ownerState }) => ({
  minWidth: theme.spacing(7),
  color: theme.color.selected,
  flexShrink: 0,
  display: 'inline-flex',
  ...(ownerState.alignItems === 'flex-start' && {
    marginTop: theme.spacing(1)
  })
}));

const ListItemIcon = React.forwardRef((props, ref) => {
  const { className, ...other } = props;
  const context = useListContext();
  const ownerState = { ...props, alignItems: context.alignItems };

  return (
    <ListItemIconRoot
      className={clsx('ListItemIcon-Root', className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
});

ListItemIcon.displayName = 'ListItemIcon';

export default ListItemIcon;
