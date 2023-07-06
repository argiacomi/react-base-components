import React from 'react';

const FormControlContext = React.createContext();

export default FormControlContext;

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
