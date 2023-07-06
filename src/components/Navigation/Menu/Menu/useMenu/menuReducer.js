import { baseListActions, baseListReducer } from '@BaseList';

export default function menuReducer(state, action) {
  if (action.type === baseListActions.itemHover) {
    return state;
  }

  const newState = baseListReducer(state, action);

  // make sure an item is always highlighted
  if (newState.highlightedValue === null && action.context.items.length > 0) {
    return {
      ...newState,
      highlightedValue: action.context.items[0]
    };
  }

  if (action.type === baseListActions.keyDown) {
    if (action.event.key === 'Escape') {
      return {
        ...newState,
        open: false
      };
    }
  }

  if (action.type === baseListActions.blur) {
    if (!action.context.listRef.current?.contains(action.event.relatedTarget)) {
      const listId = action.context.listRef.current?.getAttribute('id');
      const controlledBy = action.event.relatedTarget?.getAttribute('aria-controls');
      if (listId && controlledBy && listId === controlledBy) {
        return newState;
      }

      return {
        ...newState,
        open: false,
        highlightedValue: action.context.items[0]
      };
    }
  }

  return newState;
}
