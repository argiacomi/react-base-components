import * as React from 'react';
import { useCompoundParent, useControlled } from '@components/lib';

function useTabs(parameters) {
  const {
    value: valueProp,
    defaultValue,
    onChange,
    orientation,
    direction,
    selectionFollowsFocus
  } = parameters;

  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'Tabs',
    state: 'value'
  });

  const onSelected = React.useCallback(
    (event, newValue) => {
      setValue(newValue);
      onChange?.(event, newValue);
    },
    [onChange, setValue]
  );

  const { subitems: tabPanels, contextValue: compoundComponentContextValue } = useCompoundParent();

  const tabIdLookup = React.useRef(() => undefined);

  const getTabPanelId = React.useCallback(
    (tabValue) => {
      return tabPanels.get(tabValue)?.id;
    },
    [tabPanels]
  );

  const getTabId = React.useCallback((tabPanelId) => {
    return tabIdLookup.current(tabPanelId);
  }, []);

  const registerTabIdLookup = React.useCallback((lookupFunction) => {
    tabIdLookup.current = lookupFunction;
  }, []);

  return {
    contextValue: {
      direction,
      getTabId,
      getTabPanelId,
      onSelected,
      orientation,
      registerTabIdLookup,
      selectionFollowsFocus,
      value,
      ...compoundComponentContextValue
    }
  };
}

export default useTabs;
