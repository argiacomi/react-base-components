import { baseListActions, baseListReducer, moveHighlight } from '@components/display/list/baseList';
import { tabsListActionTypes } from './useTabsList';

export default function tabsListReducer(state, action) {
  if (action.type === tabsListActionTypes.valueChange) {
    return {
      ...state,
      highlightedValue: action.value
    };
  }

  const newState = baseListReducer(state, action);

  const {
    context: { selectionFollowsFocus }
  } = action;

  if (action.type === baseListActions.itemsChange) {
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
