import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';

export const listSubheaderClasses = {
  root: 'ListSubheader-Root',
  gutter: 'Gutters',
  inset: 'Inset',
  sticky: 'Sticky'
};

const ListSubheaderRoot = styled('li')(({ theme, ownerState }) => ({
  boxSizing: 'border-box',
  lineHeight: theme.spacing(6),
  listStyle: 'none',
  color: theme.color.text.secondary,
  fontFamily: 'inherit',
  fontWeight: theme.text.weight.medium,
  fontSize: theme.spacing(14 / 8),
  ...(ownerState.color === 'primary' && {
    color: theme.color.primary.body
  }),
  ...(ownerState.color === 'inherit' && {
    color: 'inherit'
  }),
  ...(!ownerState.disableGutters && {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }),
  ...(ownerState.inset && {
    paddingLeft: theme.spacing(9)
  }),
  ...(!ownerState.disableSticky && {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: theme.color.background
  }),
  ...ownerState.cssStyles
}));

const ListSubheader = React.forwardRef((props, ref) => {
  const {
    color = 'default',
    component: componentProp = 'li',
    disableGutters = false,
    disableSticky = false,
    inset = false,
    slots = {},
    slotProps = {},
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    cssStyles,
    color,
    disableGutters,
    disableSticky,
    inset
  };

  const classes = {
    root: [
      listSubheaderClasses.root,
      !disableGutters && listSubheaderClasses.gutters,
      inset && listSubheaderClasses.inset,
      !disableSticky && listSubheaderClasses.sticky
    ]
  };

  const component = componentProp || 'li';
  const ListSubheaderComponent = slots.root || ListSubheaderRoot;
  const listSubheaderRootProps = useSlotProps({
    elementType: ListSubheaderComponent,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return <ListSubheaderComponent as={component} {...listSubheaderRootProps} />;
});

ListSubheader.displayName = 'ListSubheader';

export default ListSubheader;
