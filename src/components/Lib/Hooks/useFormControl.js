import * as React from 'react';

export const FormControlContext = React.createContext(undefined);

if (!import.meta.env.PROD) {
  FormControlContext.displayName = 'FormControlContext';
}

export function useFormControl() {
  return React.useContext(FormControlContext);
}

export function formControlState({ props, states, formControl }) {
  return states.reduce((acc, state) => {
    acc[state] = props[state];

    if (formControl) {
      if (typeof props[state] === 'undefined') {
        acc[state] = formControl[state];
      }
    }

    return acc;
  }, {});
}
