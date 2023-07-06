import useList from '@BaseList';
import React from 'react';
import { useCompoundParent, useForkRef } from '@components/lib';
import menuReducer from './menuReducer';

export default function useMenu(parameters) {
  const {
    defaultOpen,
    listRef: listRefProp,
    open: openProp,
    onItemsChange,
    onOpenChange
  } = parameters;

  const listRef = React.useRef(null);
  const handleRef = useForkRef(listRef, listRefProp);

  const { subitems, contextValue: compoundComponentContextValue } = useCompoundParent();

  const subitemKeys = React.useMemo(() => Array.from(subitems.keys()), [subitems]);

  const getItemDomElement = React.useCallback(
    (itemId) => {
      if (itemId == null) {
        return null;
      }

      return subitems.get(itemId)?.ref.current ?? null;
    },
    [subitems]
  );

  const controlledProps = React.useMemo(() => ({ open: openProp }), [openProp]);

  const stateChangeHandler = React.useCallback(
    (event, field, fieldValue, reason, state) => {
      if (field === 'open') {
        onOpenChange?.(fieldValue);

        if (fieldValue === true && state.highlightedValue !== null) {
          subitems.get(state.highlightedValue)?.ref.current?.focus();
        }
      }
    },
    [onOpenChange, subitems]
  );

  const {
    dispatch,
    getRootProps,
    contextValue: listContextValue,
    state: { open, highlightedValue },
    rootRef: mergedListRef
  } = useList({
    controlledProps,
    disabledItemsFocusable: true,
    focusManagement: 'DOM',
    getItemDomElement,
    getInitialState: () => ({
      selectedValues: [],
      highlightedValue: null,
      open: defaultOpen ?? false
    }),
    isItemDisabled: (id) => subitems?.get(id)?.disabled || false,
    items: subitemKeys,
    getItemAsString: (id) => subitems.get(id)?.label || subitems.get(id)?.ref.current?.innerText,
    rootRef: handleRef,
    onItemsChange,
    onStateChange: stateChangeHandler,
    reducerActionContext: { listRef },
    selectionMode: 'none',
    stateReducer: menuReducer
  });

  React.useEffect(() => {
    if (open && highlightedValue === subitemKeys[0]) {
      subitems.get(subitemKeys[0])?.ref?.current?.focus();
    }
  }, [open, highlightedValue, subitems, subitemKeys]);

  React.useEffect(() => {
    if (listRef.current?.contains(document.activeElement) && highlightedValue !== null) {
      subitems?.get(highlightedValue)?.ref.current?.focus();
    }
  }, [highlightedValue, subitems]);

  const getListProps = (otherHandlers) => {
    const rootProps = getRootProps(otherHandlers);
    return {
      ...otherHandlers,
      ...rootProps,
      role: 'menu'
    };
  };

  React.useDebugValue({ subitems, highlightedValue });

  return {
    contextValue: {
      ...compoundComponentContextValue,
      ...listContextValue
    },
    dispatch,
    getListProps,
    highlightedValue,
    listRef: mergedListRef,
    menuItems: subitems,
    open
  };
}
