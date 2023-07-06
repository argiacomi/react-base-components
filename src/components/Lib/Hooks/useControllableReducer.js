import React from 'react';

function areEqual(a, b) {
  return a === b;
}

const EMPTY_OBJECT = {};
const NOOP = () => {};

function getControlledState(internalState, controlledProps) {
  const augmentedState = { ...internalState };
  Object.keys(controlledProps).forEach((key) => {
    if (controlledProps[key] !== undefined) {
      augmentedState[key] = controlledProps[key];
    }
  });
  return augmentedState;
}

function useStateChangeDetection(parameters) {
  const { nextState, initialState, stateComparers, onStateChange, controlledProps, lastActionRef } =
    parameters;

  const internalPreviousStateRef = React.useRef(initialState);

  React.useEffect(() => {
    if (lastActionRef.current === null) {
      return;
    }

    const previousState = getControlledState(internalPreviousStateRef.current, controlledProps);

    Object.keys(nextState).forEach((key) => {
      const stateComparer = stateComparers[key] ?? areEqual;

      const nextStateItem = nextState[key];
      const previousStateItem = previousState[key];

      if (
        (previousStateItem == null && nextStateItem != null) ||
        (previousStateItem != null && nextStateItem == null) ||
        (previousStateItem != null &&
          nextStateItem != null &&
          !stateComparer(nextStateItem, previousStateItem))
      ) {
        onStateChange?.(
          lastActionRef.current.event ?? null,
          key,
          nextStateItem,
          lastActionRef.current.type ?? '',
          nextState
        );
      }
    });

    internalPreviousStateRef.current = nextState;
    lastActionRef.current = null;
  }, [
    internalPreviousStateRef,
    nextState,
    lastActionRef,
    onStateChange,
    stateComparers,
    controlledProps
  ]);
}

export function useControllableReducer(parameters) {
  const lastActionRef = React.useRef(null);

  const {
    reducer,
    initialState,
    controlledProps = EMPTY_OBJECT,
    stateComparers = EMPTY_OBJECT,
    onStateChange = NOOP,
    actionContext
  } = parameters;

  const reducerWithControlledState = React.useCallback(
    (state, action) => {
      lastActionRef.current = action;

      const controlledState = getControlledState(state, controlledProps);
      const newState = reducer(controlledState, action);
      return newState;
    },
    [controlledProps, reducer]
  );

  const [nextState, dispatch] = React.useReducer(reducerWithControlledState, initialState);

  const dispatchWithContext = React.useCallback(
    (action) => {
      dispatch({
        ...action,
        context: actionContext
      });
    },
    [actionContext]
  );

  useStateChangeDetection({
    nextState,
    initialState,
    stateComparers: stateComparers ?? EMPTY_OBJECT,
    onStateChange: onStateChange ?? NOOP,
    controlledProps,
    lastActionRef
  });

  return [getControlledState(nextState, controlledProps), dispatchWithContext];
}
