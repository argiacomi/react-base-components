import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { useListItemContext } from './ListItemContext';

export const listItemAvatarClasses = {
  root: 'ListItemAvatar-Root',
  flexStart: 'AlignItemsFlexStart'
};

const ListItemAvatarRoot = styled('div')(({ theme, ownerState }) => ({
  minWidth: theme.spacing(7),
  flexShrink: 0,
  ...(ownerState.alignItems === 'flex-start' && {
    marginTop: theme.spacing(1)
  }),
  ...ownerState.cssStyles
}));

const ListItemAvatar = React.forwardRef((props, ref) => {
  const { component: componentProp = 'div', slots = {}, slotProps = {}, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const context = useListItemContext();
  const ownerState = { ...props, alignItems: context.alignItems, cssStyles };

  const classes = {
    root: [
      listItemAvatarClasses.root,
      ownerState.alignItems === 'flex-start' && listItemAvatarClasses.flexStart
    ]
  };

  const component = componentProp || 'div';
  const ListItemAvatarRootComponent = slots.root || ListItemAvatarRoot;
  const listItemAvatarRootProps = useSlotProps({
    elementType: ListItemAvatarRootComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return <ListItemAvatarRoot as={component} {...listItemAvatarRootProps} />;
});

ListItemAvatar.displayName = 'ListItemAvatar';

export default ListItemAvatar;
