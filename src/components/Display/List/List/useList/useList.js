import * as React from 'react';
import { useCompoundParent, useControlled } from '@components/lib';
import { useBaseList, BaseListActionTypes } from '../../BaseList';
import listReducer from './listReducer';

function useList(parameters) {
  const {
    defaultValue,
    dense,
    direction,
    onChange,
    orientation,
    rootRef: externalRef,
    selectionFollowsFocus,
    selectionMode = 'single',
    value: valueProp
  } = parameters;

  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: 'List',
    state: 'value'
  });

  const onSelected = React.useCallback(
    (event, newValue) => {
      setValue(newValue);
      onChange?.(event, newValue);
    },
    [onChange, setValue]
  );

  const { subitems, contextValue: compoundComponentContextValue } = useCompoundParent();

  const listItemIdLookup = React.useRef();

  const registerListItemIdLookup = React.useCallback((lookupFunction) => {
    listItemIdLookup.current = lookupFunction;
  }, []);

  registerListItemIdLookup(
    React.useCallback(
      (listItemValue) => {
        return subitems.get(listItemValue)?.id;
      },
      [subitems]
    )
  );

  const subitemKeys = React.useMemo(() => Array.from(subitems.keys()), [subitems]);

  const getListItemElement = React.useCallback(
    (listItemValue) => {
      if (listItemValue == null) {
        return null;
      }

      return subitems.get(listItemValue)?.ref.current ?? null;
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
    getRootProps: getListProps,
    state: { highlightedValue, selectedValues },
    rootRef: mergedRootRef
  } = useBaseList({
    controlledProps,
    disabledItemsFocusable: !selectionFollowsFocus,
    focusManagement: 'DOM',
    getItemDomElement: getListItemElement,
    isItemDisabled,
    items: subitemKeys,
    rootRef: externalRef,
    onChange: handleChange,
    orientation: listOrientation,
    reducerActionContext: React.useMemo(
      () => ({ selectionFollowsFocus: selectionFollowsFocus || false }),
      [selectionFollowsFocus]
    ),
    selectionMode: selectionMode,
    stateReducer: listReducer
  });

  React.useEffect(() => {
    if (value === undefined) {
      return;
    }

    if (value != null) {
      dispatch({
        type: BaseListActionTypes.valueChange,
        value
      });
    }
  }, [dispatch, value]);

  const getRootProps = (otherHandlers) => {
    return {
      ...otherHandlers,
      ...getListProps(otherHandlers),
      'aria-orientation': orientation === 'vertical' ? 'vertical' : undefined,
      role: 'List'
    };
  };

  return {
    contextValue: {
      dense,
      direction,
      onSelected,
      orientation,
      registerListItemIdLookup,
      selectionFollowsFocus,
      value,
      ...compoundComponentContextValue,
      ...listContextValue
    },
    dispatch,
    getRootProps,
    highlightedValue,
    isRtl,
    orientation,
    rootRef: mergedRootRef,
    selectedValue: selectedValues[0] ?? null
  };
}

export default useList;
