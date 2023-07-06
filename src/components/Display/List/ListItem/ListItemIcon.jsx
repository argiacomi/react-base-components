import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { useListItemContext } from './ListItemContext';

export const listItemIconClasses = {
  root: 'ListItemIcon-Root',
  flexStart: 'AlignItemsFlexStart'
};

const ListItemIconRoot = styled('div')(({ theme, ownerState }) => ({
  minWidth: theme.spacing(7),
  color: theme.color.active,
  flexShrink: 0,
  display: 'inline-flex',
  ...(ownerState.alignItems === 'flex-start' && {
    marginTop: theme.spacing(1)
  }),
  ...ownerState.cssStyles
}));

const ListItemIcon = React.forwardRef((props, ref) => {
  const { component: componentProp = 'div', slots = {}, slotProps = {}, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const context = useListItemContext();
  const ownerState = { ...props, cssStyles, alignItems: context.alignItems };

  const classes = {
    root: [
      listItemIconClasses.root,
      ownerState.alignItems === 'flex-start' && listItemIconClasses.flexStart
    ]
  };

  const component = componentProp || 'div';
  const ListItemIconRootComponent = slots.root || ListItemIconRoot;
  const listItemIconRootProps = useSlotProps({
    elementType: ListItemIconRootComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return <ListItemIconRootComponent as={component} {...listItemIconRootProps} />;
});

ListItemIcon.displayName = 'ListItemIcon';

export default ListItemIcon;
