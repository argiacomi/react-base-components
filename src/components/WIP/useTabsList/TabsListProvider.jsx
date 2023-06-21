import * as React from 'react';
import { ListContext } from '../useList/ListContext';
import { CompoundComponentContext } from '@components/lib';

export default function TabsListProvider(props) {
  const { value, children } = props;
  const {
    dispatch,
    getItemIndex,
    getItemState,
    registerHighlightChangeHandler,
    registerSelectionChangeHandler,
    registerItem,
    totalSubitemCount
  } = value;

  const listContextValue = React.useMemo(
    () => ({
      dispatch,
      getItemState,
      getItemIndex,
      registerHighlightChangeHandler,
      registerSelectionChangeHandler
    }),
    [
      dispatch,
      getItemIndex,
      getItemState,
      registerHighlightChangeHandler,
      registerSelectionChangeHandler
    ]
  );

  const compoundComponentContextValue = React.useMemo(
    () => ({
      getItemIndex,
      registerItem,
      totalSubitemCount
    }),
    [registerItem, getItemIndex, totalSubitemCount]
  );

  return (
    <CompoundComponentContext.Provider value={compoundComponentContextValue}>
      <ListContext.Provider value={listContextValue}>{children}</ListContext.Provider>
    </CompoundComponentContext.Provider>
  );
}
