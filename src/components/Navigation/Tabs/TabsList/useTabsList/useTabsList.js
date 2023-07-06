import React from 'react';
import { useCompoundParent } from '@components/lib';
import useBaseList from '@components/display/list/baselist';
import { useTabsContext } from '../../Tabs';
import tabsListReducer from './tabsListReducer';

export const tabsListActionTypes = {
  valueChange: 'valueChange'
};

function useTabsList(parameters) {
  const { rootRef: externalRef } = parameters;

  const {
    direction = 'ltr',
    onSelected,
    orientation = 'horizontal',
    value,
    registerTabIdLookup,
    selectionFollowsFocus
  } = useTabsContext();

  const { subitems, contextValue: compoundComponentContextValue } = useCompoundParent();

  const tabIdLookup = React.useCallback(
    (tabValue) => {
      return subitems.get(tabValue)?.id;
    },
    [subitems]
  );

  registerTabIdLookup(tabIdLookup);

  const subitemKeys = React.useMemo(() => Array.from(subitems.keys()), [subitems]);

  const getTabElement = React.useCallback(
    (tabValue) => {
      if (tabValue == null) {
        return null;
      }

      return subitems.get(tabValue)?.ref.current ?? null;
    },
    [subitems]
  );

  const isRtl = direction === 'rtl';

  let listOrientation;
  if (orientation === 'vertical') {
    listOrientation = 'vertical';
  } else {
    listOrientation = isRtl ? 'horizontal-rtl' : 'horizontal-ltr';
  }

  const handleChange = React.useCallback(
    (event, newValue) => {
      onSelected(event, newValue[0] ?? null);
    },
    [onSelected]
  );

  const controlledProps = React.useMemo(() => {
    if (value === undefined) {
      return {};
    }

    return value != null ? { selectedValues: [value] } : { selectedValues: [] };
  }, [value]);

  const isItemDisabled = React.useCallback(
    (item) => subitems.get(item)?.disabled ?? false,
    [subitems]
  );

  const {
    contextValue: listContextValue,
    dispatch,
    getRootProps: getListboxRootProps,
    state: { highlightedValue, selectedValues },
    rootRef: mergedRootRef
  } = useBaseList({
    controlledProps,
    disabledItemsFocusable: !selectionFollowsFocus,
    focusManagement: 'DOM',
    getItemDomElement: getTabElement,
    isItemDisabled,
    items: subitemKeys,
    rootRef: externalRef,
    onChange: handleChange,
    orientation: listOrientation,
    reducerActionContext: React.useMemo(
      () => ({ selectionFollowsFocus: selectionFollowsFocus || false }),
      [selectionFollowsFocus]
    ),
    selectionMode: 'single',
    stateReducer: tabsListReducer
  });

  React.useEffect(() => {
    if (value === undefined) {
      return;
    }

    if (value != null) {
      dispatch({
        type: tabsListActionTypes.valueChange,
        value
      });
    }
  }, [dispatch, value]);

  const getRootProps = (otherHandlers) => {
    return {
      ...otherHandlers,
      ...getListboxRootProps(otherHandlers),
      'aria-orientation': orientation === 'vertical' ? 'vertical' : undefined,
      role: 'tablist'
    };
  };

  return {
    contextValue: { ...compoundComponentContextValue, ...listContextValue },
    dispatch,
    getRootProps,
    highlightedValue,
    isRtl,
    orientation,
    rootRef: mergedRootRef,
    selectedValue: selectedValues[0] ?? null,
    subitemKeys
  };
}

export default useTabsList;
