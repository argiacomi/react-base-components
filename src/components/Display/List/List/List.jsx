import React from 'react';
import styled, { extractStyling } from '@styles';
import { useSlotProps } from '@components/lib';
import useList from './useList';
import ListProvider from './useList/ListProvider';

export const listClasses = {
  root: 'List-Root',
  padding: 'Padding',
  dense: 'Dense',
  subheader: 'Subheader',
  horizontal: 'Horizontal',
  vertical: 'Vertical'
};

const ListRoot = styled('ul')(({ ownerState }) => ({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  position: 'relative',
  ...(!ownerState.disablePadding && {
    paddingTop: 8,
    paddingBottom: 8
  }),
  ...(ownerState.subheader && {
    paddingTop: 0
  }),
  ...ownerState.cssStyles
}));

const List = React.forwardRef(function List(props, ref) {
  const {
    children,
    component = 'ul',
    defaultValue,
    dense = false,
    direction = 'ltr',
    disablePadding = false,
    disableListWrap,
    onChange,
    orientation = 'horizontal',
    selectionFollowsFocus,
    selectionMode = 'none',
    slotProps = {},
    slots = {},
    subheader,
    value: valueProp,
    ...otherProps
  } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const { isRtl, getRootProps, contextValue } = useList({
    ...props,
    rootRef: ref
  });

  const ownerState = {
    ...props,
    component,
    cssStyles,
    dense,
    direction,
    disablePadding,
    isRtl,
    orientation
  };

  const classes = {
    root: [
      listClasses.root,
      !ownerState.disablePadding && listClasses.padding,
      ownerState.dense && listClasses.dense,
      ownerState.subheader && listClasses.subheader
    ]
  };

  const ListRootComponent = slots.root ?? ListRoot;

  const listRootProps = useSlotProps({
    elementType: ListRootComponent,
    getSlotProps: getRootProps,
    externalSlotProps: slotProps.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: ref
    },
    ownerState,
    className: classes.root
  });

  return (
    <ListProvider value={contextValue}>
      <ListRoot as={component} {...listRootProps}>
        {subheader}
        {children}
      </ListRoot>
    </ListProvider>
  );
});

export default List;
