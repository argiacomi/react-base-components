import React from 'react';
import { CompoundComponentContext } from '@components/lib';
import ListContext from '../../BaseList/ListContext';

export default function ListProvider(props) {
  const { value: valueProp, children } = props;
  const {
    dense,
    direction,
    disablePadding,
    dispatch,
    getItemIndex,
    getItemState,
    onSelected,
    orientation,
    registerItem,
    registerHighlightChangeHandler,
    registerListItemIdLookup,
    registerSelectionChangeHandler,
    selectionFollowsFocus,
    totalSubitemCount,
    value
  } = valueProp;

  const compoundComponentContextValue = React.useMemo(
    () => ({
      getItemIndex,
      registerItem,
      totalSubitemCount
    }),
    [registerItem, getItemIndex, totalSubitemCount]
  );

  const ListContextValue = React.useMemo(
    () => ({
      dense,
      direction,
      disablePadding,
      dispatch,
      getItemIndex,
      getItemState,
      onSelected,
      orientation,
      registerHighlightChangeHandler,
      registerListItemIdLookup,
      registerSelectionChangeHandler,
      selectionFollowsFocus,
      value
    }),
    [
      dense,
      direction,
      disablePadding,
      dispatch,
      getItemIndex,
      getItemState,
      onSelected,
      orientation,
      registerHighlightChangeHandler,
      registerListItemIdLookup,
      registerSelectionChangeHandler,
      selectionFollowsFocus,
      value
    ]
  );

  return (
    <CompoundComponentContext.Provider value={compoundComponentContextValue}>
      <ListContext.Provider value={ListContextValue}>{children}</ListContext.Provider>
    </CompoundComponentContext.Provider>
  );
}
