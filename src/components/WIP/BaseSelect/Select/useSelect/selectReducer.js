import { baseListActions, baseListReducer as listReducer, moveHighlight } from '@BaseList';

export const SelectActionTypes = {
  buttonClick: 'buttonClick'
};

export default function selectReducer(state, action) {
  const { open } = state;
  const {
    context: { selectionMode }
  } = action;

  if (action.type === SelectActionTypes.buttonClick) {
    const itemToHighlight = state.selectedValues[0] ?? moveHighlight(null, 'start', action.context);

    return {
      ...state,
      open: !open,
      highlightedValue: !open ? itemToHighlight : null
    };
  }

  const newState = listReducer(state, action);

  switch (action.type) {
    case baseListActions.keyDown:
      if (state.open) {
        if (action.event.key === 'Escape') {
          return {
            ...newState,
            open: false
          };
        }

        if (
          selectionMode === 'single' &&
          (action.event.key === 'Enter' || action.event.key === ' ')
        ) {
          return {
            ...newState,
            open: false
          };
        }
      } else {
        if (
          action.event.key === 'Enter' ||
          action.event.key === ' ' ||
          action.event.key === 'ArrowDown'
        ) {
          return {
            ...state,
            open: true,
            highlightedValue:
              state.selectedValues[0] ?? moveHighlight(null, 'start', action.context)
          };
        }

        if (action.event.key === 'ArrowUp') {
          return {
            ...state,
            open: true,
            highlightedValue: state.selectedValues[0] ?? moveHighlight(null, 'end', action.context)
          };
        }
      }

      break;

    case baseListActions.itemClick:
      if (selectionMode === 'single') {
        return {
          ...newState,
          open: false
        };
      }

      break;

    case baseListActions.blur:
      return {
        ...newState,
        open: false
      };

    default:
      return newState;
  }

  return newState;
}
