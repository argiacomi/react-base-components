import * as React from 'react';

const FormControlContext = React.createContext(undefined);

if (process.env.NODE_ENV !== 'production') {
  FormControlContext.displayName = 'FormControlContext';
}

function useFormControl() {
  return React.useContext(FormControlContext);
}

function formControlState({ props, states, muiFormControl }) {
  return states.reduce((acc, state) => {
    acc[state] = props[state];

    if (muiFormControl) {
      if (typeof props[state] === 'undefined') {
        acc[state] = muiFormControl[state];
      }
    }

    return acc;
  }, {});
}

export { formControlState, FormControlContext, useFormControl };
