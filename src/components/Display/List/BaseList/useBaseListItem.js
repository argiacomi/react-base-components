import React from 'react';
import { useForkRef, useEnhancedEffect, useForcedRerendering } from '@components/lib';
import baseListActions from './baseListActions';
import ListContext from './ListContext';

export default function useBaseListItem(parameters) {
  const { handlePointerOverEvents = false, item, rootRef: externalRef } = parameters;

  const itemRef = React.useRef(null);
  const handleRef = useForkRef(itemRef, externalRef);

  const listContext = React.useContext(ListContext);
  if (!listContext) {
    throw new Error('useBaseListItem must be used within a ListProvider');
  }

  const { dispatch, getItemState, registerHighlightChangeHandler, registerSelectionChangeHandler } =
    listContext;

  const { highlighted, selected, focusable } = getItemState(item);

  const rerender = useForcedRerendering();

  useEnhancedEffect(() => {
    function updateHighlightedState(highlightedItem) {
      if (highlightedItem === item && !highlighted) {
        rerender();
      } else if (highlightedItem !== item && highlighted) {
        rerender();
      }
    }

    return registerHighlightChangeHandler(updateHighlightedState);
  });

  useEnhancedEffect(() => {
    function updateSelectedState(selectedItems) {
      if (!selected) {
        if (selectedItems.includes(item)) {
          rerender();
        }
      } else if (!selectedItems.includes(item)) {
        rerender();
      }
    }

    return registerSelectionChangeHandler(updateSelectedState);
  });

  const createHandleClick = React.useCallback(
    (other) => (event) => {
      other.onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }

      dispatch({
        type: baseListActions.itemClick,
        item,
        event
      });
    },
    [dispatch, item]
  );

  const createHandlePointerOver = React.useCallback(
    (other) => (event) => {
      other.onMouseOver?.(event);
      if (event.defaultPrevented) {
        return;
      }

      dispatch({
        type: baseListActions.itemHover,
        item,
        event
      });
    },
    [dispatch, item]
  );

  let tabIndex;
  if (focusable) {
    tabIndex = highlighted ? 0 : -1;
  }

  const getRootProps = (otherHandlers) => ({
    ...otherHandlers,
    onClick: createHandleClick(otherHandlers),
    onPointerOver: handlePointerOverEvents ? createHandlePointerOver(otherHandlers) : undefined,
    ref: handleRef,
    tabIndex
  });

  return {
    getRootProps,
    highlighted,
    rootRef: handleRef,
    selected
  };
}
