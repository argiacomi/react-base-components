import baseListActions from './baseListActions';

function findValidItemToHighlight(
  currentIndex,
  lookupDirection,
  items,
  includeDisabledItems,
  isItemDisabled,
  wrapAround
) {
  if (
    items.length === 0 ||
    (!includeDisabledItems && items.every((item, itemIndex) => isItemDisabled(item, itemIndex)))
  ) {
    return -1;
  }

  let nextFocus = currentIndex;

  for (;;) {
    // No valid items found
    if (
      (!wrapAround && lookupDirection === 'next' && nextFocus === items.length) ||
      (!wrapAround && lookupDirection === 'previous' && nextFocus === -1)
    ) {
      return -1;
    }

    const nextFocusDisabled = includeDisabledItems
      ? false
      : isItemDisabled(items[nextFocus], nextFocus);
    if (nextFocusDisabled) {
      nextFocus += lookupDirection === 'next' ? 1 : -1;
      if (wrapAround) {
        nextFocus = (nextFocus + items.length) % items.length;
      }
    } else {
      return nextFocus;
    }
  }
}

export function moveHighlight(previouslyHighlightedValue, offset, context) {
  const {
    items,
    isItemDisabled,
    disableListWrap,
    disabledItemsFocusable,
    itemComparer,
    focusManagement
  } = context;

  const defaultHighlightedIndex = focusManagement === 'DOM' ? 0 : -1;
  const maxIndex = items.length - 1;

  const previouslyHighlightedIndex =
    previouslyHighlightedValue == null
      ? -1
      : items.findIndex((item) => itemComparer(item, previouslyHighlightedValue));

  let nextIndexCandidate;
  let lookupDirection;
  let wrapAround = !disableListWrap;

  switch (offset) {
    case 'reset':
      if (defaultHighlightedIndex === -1) {
        return null;
      }

      nextIndexCandidate = 0;
      lookupDirection = 'next';
      wrapAround = false;
      break;

    case 'start':
      nextIndexCandidate = 0;
      lookupDirection = 'next';
      wrapAround = false;
      break;

    case 'end':
      nextIndexCandidate = maxIndex;
      lookupDirection = 'previous';
      wrapAround = false;
      break;

    default: {
      const newIndex = previouslyHighlightedIndex + offset;

      if (newIndex < 0) {
        if ((!wrapAround && previouslyHighlightedIndex !== -1) || Math.abs(offset) > 1) {
          nextIndexCandidate = 0;
          lookupDirection = 'next';
        } else {
          nextIndexCandidate = maxIndex;
          lookupDirection = 'previous';
        }
      } else if (newIndex > maxIndex) {
        if (!wrapAround || Math.abs(offset) > 1) {
          nextIndexCandidate = maxIndex;
          lookupDirection = 'previous';
        } else {
          nextIndexCandidate = 0;
          lookupDirection = 'next';
        }
      } else {
        nextIndexCandidate = newIndex;
        lookupDirection = offset >= 0 ? 'next' : 'previous';
      }
    }
  }

  const nextIndex = findValidItemToHighlight(
    nextIndexCandidate,
    lookupDirection,
    items,
    disabledItemsFocusable,
    isItemDisabled,
    wrapAround
  );

  if (
    nextIndex === -1 &&
    previouslyHighlightedValue !== null &&
    !isItemDisabled(previouslyHighlightedValue, previouslyHighlightedIndex)
  ) {
    return previouslyHighlightedValue;
  }

  return items[nextIndex] ?? null;
}

export function toggleSelection(item, selectedValues, selectionMode, itemComparer) {
  if (selectionMode === 'none') {
    return [];
  }

  if (selectionMode === 'single') {
    if (itemComparer(selectedValues[0], item)) {
      return selectedValues;
    }

    return [item];
  }

  if (selectedValues.some((sv) => itemComparer(sv, item))) {
    return selectedValues.filter((sv) => !itemComparer(sv, item));
  }

  return [...selectedValues, item];
}

function handleItemSelection(item, state, context) {
  const { itemComparer, isItemDisabled, selectionMode, items } = context;
  const { selectedValues } = state;

  const itemIndex = items.findIndex((i) => itemComparer(item, i));

  if (isItemDisabled(item, itemIndex)) {
    return state;
  }

  const newSelectedValues = toggleSelection(item, selectedValues, selectionMode, itemComparer);

  return {
    ...state,
    selectedValues: newSelectedValues,
    highlightedValue: item
  };
}

function handleKeyDown(key, state, context) {
  const previouslySelectedValue = state.highlightedValue;
  const { orientation, pageSize } = context;

  switch (key) {
    case 'Home':
      return {
        ...state,
        highlightedValue: moveHighlight(previouslySelectedValue, 'start', context)
      };

    case 'End':
      return {
        ...state,
        highlightedValue: moveHighlight(previouslySelectedValue, 'end', context)
      };

    case 'PageUp':
      return {
        ...state,
        highlightedValue: moveHighlight(previouslySelectedValue, -pageSize, context)
      };

    case 'PageDown':
      return {
        ...state,
        highlightedValue: moveHighlight(previouslySelectedValue, pageSize, context)
      };

    case 'ArrowUp':
      if (orientation !== 'vertical') {
        break;
      }

      return {
        ...state,
        highlightedValue: moveHighlight(previouslySelectedValue, -1, context)
      };

    case 'ArrowDown':
      if (orientation !== 'vertical') {
        break;
      }

      return {
        ...state,
        highlightedValue: moveHighlight(previouslySelectedValue, 1, context)
      };

    case 'ArrowLeft': {
      if (orientation === 'vertical') {
        break;
      }

      const offset = orientation === 'horizontal-ltr' ? -1 : 1;

      return {
        ...state,
        highlightedValue: moveHighlight(previouslySelectedValue, offset, context)
      };
    }

    case 'ArrowRight': {
      if (orientation === 'vertical') {
        break;
      }

      const offset = orientation === 'horizontal-ltr' ? 1 : -1;

      return {
        ...state,
        highlightedValue: moveHighlight(previouslySelectedValue, offset, context)
      };
    }

    case 'Enter':
    case ' ':
      if (state.highlightedValue === null) {
        return state;
      }

      return handleItemSelection(state.highlightedValue, state, context);

    default:
      break;
  }

  return state;
}

function handleBlur(state, context) {
  if (context.focusManagement === 'DOM') {
    return state;
  }

  return {
    ...state,
    highlightedValue: null
  };
}

function textCriteriaMatches(nextFocus, searchString, stringifyItem) {
  const text = stringifyItem(nextFocus)?.trim().toLowerCase();

  if (!text || text.length === 0) {
    return false;
  }

  return text.indexOf(searchString) === 0;
}

function handleTextNavigation(state, searchString, context) {
  const { items, isItemDisabled, disabledItemsFocusable, getItemAsString } = context;

  const startWithCurrentItem = searchString.length > 1;

  let nextItem = startWithCurrentItem
    ? state.highlightedValue
    : moveHighlight(state.highlightedValue, 1, context);

  for (let index = 0; index < items.length; index += 1) {
    // Return un-mutated state if looped back to the currently highlighted value
    if (!nextItem || (!startWithCurrentItem && state.highlightedValue === nextItem)) {
      return state;
    }

    if (
      textCriteriaMatches(nextItem, searchString, getItemAsString) &&
      (!isItemDisabled(nextItem, items.indexOf(nextItem)) || disabledItemsFocusable)
    ) {
      // The nextItem is the element to be highlighted
      return {
        ...state,
        highlightedValue: nextItem
      };
    }
    // Move to the next element.
    nextItem = moveHighlight(nextItem, 1, context);
  }

  // No item matches the text search criteria
  return state;
}

function handleItemsChange(items, previousItems, state, context) {
  const { itemComparer, focusManagement } = context;

  let newHighlightedValue;

  if (state.highlightedValue != null) {
    newHighlightedValue = items.find((item) => itemComparer(item, state.highlightedValue)) ?? null;
  } else if (focusManagement === 'DOM' && previousItems.length === 0) {
    newHighlightedValue = moveHighlight(null, 'reset', context);
  }

  const selectedValues = state.selectedValues ?? [];
  const newSelectedValues = selectedValues.filter((selectedValue) =>
    items.some((item) => itemComparer(item, selectedValue))
  );

  return {
    ...state,
    highlightedValue: newHighlightedValue,
    selectedValues: newSelectedValues
  };
}

function handleResetHighlight(state, context) {
  return {
    ...state,
    highlightedValue: moveHighlight(null, 'reset', context)
  };
}

export default function baseListReducer(state, action) {
  const { type, context } = action;

  switch (type) {
    case baseListActions.keyDown:
      return handleKeyDown(action.key, state, context);
    case baseListActions.itemClick:
      return handleItemSelection(action.item, state, context);
    case baseListActions.blur:
      return handleBlur(state, context);
    case baseListActions.textNavigation:
      return handleTextNavigation(state, action.searchString, context);
    case baseListActions.itemsChange:
      return handleItemsChange(action.items, action.previousItems, state, context);
    case baseListActions.resetHighlight:
      return handleResetHighlight(state, context);
    default:
      return state;
  }
}
