import React from 'react';
import clsx from 'clsx';
import { useListContext } from './ListContext';
import { styled } from '@styles';

const ListItemAvatarRoot = styled('div')(({ theme, ownerState }) => ({
  minWidth: theme.spacing(7),
  flexShrink: 0,
  ...(ownerState.alignItems === 'flex-start' && {
    marginTop: theme.spacing(1)
  })
}));

const ListItemAvatar = React.forwardRef((props, ref) => {
  const { className, ...other } = props;
  const context = useListContext();
  const ownerState = { ...props, alignItems: context.alignItems };

  return (
    <ListItemAvatarRoot
      className={clsx('ListItemAvatar-Root', className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
});

ListItemAvatar.displayName = 'ListItemAvatar';
export default ListItemAvatar;
