import * as React from 'react';
import ListContext from '../../BaseList/ListContext';
import { CompoundComponentContext } from '@components/lib';

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

  const tabsContextValue = React.useMemo(
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
      <ListContext.Provider value={tabsContextValue}>{children}</ListContext.Provider>
    </CompoundComponentContext.Provider>
  );
}
