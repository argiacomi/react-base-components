import React from 'react';
import { CompoundComponentContext } from '@components/lib';
import TabsContext from '../TabsContext';

export default function TabsProvider(props) {
  const { value: valueProp, children } = props;
  const {
    direction,
    getItemIndex,
    onSelected,
    orientation,
    registerItem,
    registerTabIdLookup,
    selectionFollowsFocus,
    totalSubitemCount,
    value,
    getTabId,
    getTabPanelId
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
      direction,
      getTabId,
      getTabPanelId,
      onSelected,
      orientation,
      registerTabIdLookup,
      selectionFollowsFocus,
      value
    }),
    [
      direction,
      getTabId,
      getTabPanelId,
      onSelected,
      orientation,
      registerTabIdLookup,
      selectionFollowsFocus,
      value
    ]
  );

  return (
    <CompoundComponentContext.Provider value={compoundComponentContextValue}>
      <TabsContext.Provider value={tabsContextValue}>{children}</TabsContext.Provider>
    </CompoundComponentContext.Provider>
  );
}
