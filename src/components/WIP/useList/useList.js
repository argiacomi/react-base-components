import * as React from 'react';
import {
  areArraysEqual,
  useControllableReducer,
  useForkRef,
  useLatest,
  useTextNavigation
} from '@components/lib';
import { ListActionTypes } from './listActions';
import defaultReducer from './listReducer';
import useListChangeNotifiers from './useListChangeNotifiers';

const EMPTY_OBJECT = {};
const NOOP = () => {};

const defaultItemComparer = (optionA, optionB) => optionA === optionB;

const defaultIsItemDisabled = () => false;

const defaultItemStringifier = (item) => (typeof item === 'string' ? item : String(item));

const defaultGetInitialState = () => ({
  highlightedValue: null,
  selectedValues: []
});

function useList(params) {
  const {
    controlledProps = EMPTY_OBJECT,
    disabledItemsFocusable = false,
    disableListWrap = false,
    focusManagement = 'activeDescendant',
    getInitialState = defaultGetInitialState,
    getItemDomElement,
    getItemId,
    isItemDisabled = defaultIsItemDisabled,
    rootRef: externalListRef,
    onStateChange = NOOP,
    items,
    itemComparer = defaultItemComparer,
    getItemAsString = defaultItemStringifier,
    onChange,
    onHighlightChange,
    onItemsChange,
    orientation = 'vertical',
    pageSize = 5,
    reducerActionContext = EMPTY_OBJECT,
    selectionMode = 'single',
    stateReducer: externalReducer
  } = params;

  if (!import.meta.env.PROD) {
    if (focusManagement === 'DOM' && getItemDomElement == null) {
      throw new Error(
        'useList: The `getItemDomElement` prop is required when using the `DOM` focus management.'
      );
    }

    if (focusManagement === 'activeDescendant' && getItemId == null) {
      throw new Error(
        'useList: The `getItemId` prop is required when using the `activeDescendant` focus management.'
      );
    }
  }

  const listRef = React.useRef(null);
  const handleRef = useForkRef(externalListRef, listRef);

  const handleHighlightChange = React.useCallback(
    (event, value, reason) => {
      onHighlightChange?.(event, value, reason);

      if (
        focusManagement === 'DOM' &&
        value != null &&
        (reason === ListActionTypes.itemClick ||
          reason === ListActionTypes.keyDown ||
          reason === ListActionTypes.textNavigation)
      ) {
        getItemDomElement?.(value)?.focus();
      }
    },
    [getItemDomElement, onHighlightChange, focusManagement]
  );

  const stateComparers = React.useMemo(
    () => ({
      highlightedValue: itemComparer,
      selectedValues: (valuesArray1, valuesArray2) =>
        areArraysEqual(valuesArray1, valuesArray2, itemComparer)
    }),
    [itemComparer]
  );

  // This gets called whenever a reducer changes the state.
  const handleStateChange = React.useCallback(
    (event, field, value, reason, state) => {
      onStateChange?.(event, field, value, reason, state);

      switch (field) {
        case 'highlightedValue':
          handleHighlightChange(event, value, reason);
          break;
        case 'selectedValues':
          onChange?.(event, value, reason);
          break;
        default:
          break;
      }
    },
    [handleHighlightChange, onChange, onStateChange]
  );

  // The following object is added to each action when it's dispatched.
  // It's accessible in the reducer via the `action.context` field.
  const listActionContext = React.useMemo(() => {
    return {
      disabledItemsFocusable,
      disableListWrap,
      focusManagement,
      isItemDisabled,
      itemComparer,
      items,
      getItemAsString,
      onHighlightChange: handleHighlightChange,
      orientation,
      pageSize,
      selectionMode,
      stateComparers
    };
  }, [
    disabledItemsFocusable,
    disableListWrap,
    focusManagement,
    isItemDisabled,
    itemComparer,
    items,
    getItemAsString,
    handleHighlightChange,
    orientation,
    pageSize,
    selectionMode,
    stateComparers
  ]);

  const initialState = getInitialState();
  const reducer = externalReducer ?? defaultReducer;

  const actionContext = React.useMemo(
    () => ({ ...reducerActionContext, ...listActionContext }),
    [reducerActionContext, listActionContext]
  );

  const [state, dispatch] = useControllableReducer({
    reducer,
    actionContext,
    initialState: initialState,
    controlledProps,
    stateComparers,
    onStateChange: handleStateChange
  });

  const { highlightedValue, selectedValues } = state;

  const handleTextNavigation = useTextNavigation((searchString, event) =>
    dispatch({
      type: ListActionTypes.textNavigation,
      event,
      searchString
    })
  );

  const latestSelectedValues = useLatest(selectedValues);
  const latestHighlightedValue = useLatest(highlightedValue);
  const previousItems = React.useRef([]);

  React.useEffect(() => {
    if (areArraysEqual(previousItems.current, items, itemComparer)) {
      return;
    }

    dispatch({
      type: ListActionTypes.itemsChange,
      event: null,
      items,
      previousItems: previousItems.current
    });

    previousItems.current = items;
    onItemsChange?.(items);
  }, [items, itemComparer, dispatch, onItemsChange]);

  const {
    notifySelectionChanged,
    notifyHighlightChanged,
    registerHighlightChangeHandler,
    registerSelectionChangeHandler
  } = useListChangeNotifiers();

  React.useEffect(() => {
    notifySelectionChanged(selectedValues);
  }, [selectedValues, notifySelectionChanged]);

  React.useEffect(() => {
    notifyHighlightChanged(highlightedValue);
  }, [highlightedValue, notifyHighlightChanged]);

  const createHandleKeyDown = (other) => (event) => {
    other.onKeyDown?.(event);

    if (event.defaultMuiPrevented) {
      return;
    }

    const keysToPreventDefault = ['Home', 'End', 'PageUp', 'PageDown'];

    if (orientation === 'vertical') {
      keysToPreventDefault.push('ArrowUp', 'ArrowDown');
    } else {
      keysToPreventDefault.push('ArrowLeft', 'ArrowRight');
    }

    if (focusManagement === 'activeDescendant') {
      keysToPreventDefault.push(' ', 'Enter');
    }

    if (keysToPreventDefault.includes(event.key)) {
      event.preventDefault();
    }

    dispatch({
      type: ListActionTypes.keyDown,
      key: event.key,
      event
    });

    handleTextNavigation(event);
  };

  const createHandleBlur = (other) => (event) => {
    other.onBlur?.(event);

    if (event.defaultMuiPrevented) {
      return;
    }

    if (listRef.current?.contains(event.relatedTarget)) {
      // focus remains within the list
      return;
    }

    dispatch({
      type: ListActionTypes.blur,
      event
    });
  };

  const getRootProps = (otherHandlers) => {
    return {
      ...otherHandlers,
      'aria-activedescendant':
        focusManagement === 'activeDescendant' && highlightedValue != null
          ? getItemId(highlightedValue)
          : undefined,
      onBlur: createHandleBlur(otherHandlers),
      onKeyDown: createHandleKeyDown(otherHandlers),
      tabIndex: focusManagement === 'DOM' ? -1 : 0,
      ref: handleRef
    };
  };

  const getItemState = React.useCallback(
    (item) => {
      const index = items.findIndex((i) => itemComparer(i, item));
      const selected = (latestSelectedValues.current ?? []).some(
        (value) => value != null && itemComparer(item, value)
      );

      const disabled = isItemDisabled(item, index);
      const highlighted =
        latestHighlightedValue.current != null &&
        itemComparer(item, latestHighlightedValue.current);
      const focusable = focusManagement === 'DOM';

      return {
        disabled,
        focusable,
        highlighted,
        index,
        selected
      };
    },
    [
      items,
      isItemDisabled,
      itemComparer,
      latestSelectedValues,
      latestHighlightedValue,
      focusManagement
    ]
  );

  const contextValue = React.useMemo(
    () => ({
      dispatch,
      getItemState,
      registerHighlightChangeHandler,
      registerSelectionChangeHandler
    }),
    [dispatch, getItemState, registerHighlightChangeHandler, registerSelectionChangeHandler]
  );

  React.useDebugValue({
    state
  });

  return {
    contextValue,
    dispatch,
    getRootProps,
    rootRef: handleRef,
    state
  };
}

export default useList;
