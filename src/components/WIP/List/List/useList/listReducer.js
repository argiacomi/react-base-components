import { baseListReducer, BaseListActionTypes, moveHighlight } from '../../BaseList';

export default function listReducer(state, action) {
  if (action.type === BaseListActionTypes.valueChange) {
    return {
      ...state,
      highlightedValue: action.value
    };
  }

  const newState = baseListReducer(state, action);

  const {
    context: { selectionFollowsFocus }
  } = action;

  if (action.type === BaseListActionTypes.itemsChange) {
    if (newState.selectedValues.length > 0) {
      return {
        ...newState,
        highlightedValue: newState.selectedValues[0]
      };
    }

    moveHighlight(null, 'reset', action.context);
  }

  if (selectionFollowsFocus && newState.highlightedValue != null) {
    return {
      ...newState,
      selectedValues: [newState.highlightedValue]
    };
  }

  return newState;
}
