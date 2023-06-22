/* eslint-disable no-unused-vars */
import * as React from 'react';
import { styled } from '@styles';
import { useSlotProps } from '@components/lib';
import useList from './useList';
import ListProvider from './useList/ListProvider';

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
  })
}));

const List = React.forwardRef(function List(props, ref) {
  const {
    children,
    component = 'ul',
    defaultValue,
    dense = false,
    direction = 'ltr',
    disablePadding = false,
    onChange,
    orientation = 'horizontal',
    selectionFollowsFocus,
    selectionMode = 'none',
    slotProps = {},
    slots = {},
    subheader,
    value: valueProp,
    ...other
  } = props;

  const { isRtl, getRootProps, contextValue } = useList({
    defaultValue,
    dense,
    direction,
    disablePadding,
    orientation,
    rootRef: ref,
    selectionMode,
    value: valueProp
  });

  const ownerState = {
    ...props,
    component,
    dense,
    direction,
    disablePadding,
    isRtl,
    orientation
  };

  const classes = {
    root: ['List-root', `List-${ownerState.orientation}`]
  };

  const RootComponent = slots.root ?? ListRoot;

  const listRootProps = useSlotProps({
    elementType: RootComponent,
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
