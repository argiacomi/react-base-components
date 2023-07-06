import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import { useListItemContext } from './ListItemContext';

const listItemSecondaryActionClasses = {
  root: 'ListItemSecondaryAction-Root',
  disabkeGutters: 'DisableGutters'
};

const ListItemSecondaryActionRoot = styled('div')(({ theme, ownerState }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: '50%',
  transform: 'translateY(-50%)',
  ...(ownerState.disableGutters && {
    right: 0
  }),
  ...ownerState.cssStyles
}));

const ListItemSecondaryAction = React.forwardRef((props, ref) => {
  const { component: componentProp = 'div', slots = {}, slotProps = {}, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);
  const context = useListItemContext();
  const ownerState = { ...props, cssStyles, disableGutters: context.disableGutters };

  const classes = {
    root: [
      listItemSecondaryActionClasses.root,
      ownerState.disableGutters && listItemSecondaryActionClasses.disableGutters
    ]
  };

  const component = componentProp || 'div';
  const ListItemSecondaryActionComponent = slots.root || ListItemSecondaryActionRoot;
  const listItemSecondaryActionRootProps = useSlotProps({
    elementType: ListItemSecondaryActionComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return <ListItemSecondaryActionComponent as={component} {...listItemSecondaryActionRootProps} />;
});

ListItemSecondaryAction.displayName = 'ListItemSecondaryAction';

export default ListItemSecondaryAction;
