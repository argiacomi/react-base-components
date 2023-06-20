import * as React from 'react';
import { CompoundComponentContext } from '@components/lib';

export const ListContext = React.createContext(null);
if (!import.meta.env.PROD) {
  ListContext.displayName = 'ListContext';
}

export function useListContext() {
  const context = React.useContext(ListContext);
  if (context == null) {
    throw new Error('No ListContext provided');
  }

  return context;
}

export default function ListProvider(props) {
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
