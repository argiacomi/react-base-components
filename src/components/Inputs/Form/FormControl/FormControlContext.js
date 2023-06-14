import React from 'react';

export const FormControlContext = React.createContext();

if (!import.meta.env.PROD) {
  FormControlContext.displayName = 'FormControlContext';
}

export const useFormControl = () => React.useContext(FormControlContext);

export const formControlState = ({ props, states, formControl }) => {
  return states.reduce((acc, state) => {
    acc[state] = props[state];

    if (formControl) {
      if (typeof props[state] === 'undefined') {
        acc[state] = formControl[state];
      }
    }

    return acc;
  }, {});
};
