import React from 'react';

const ButtonGroupContext = React.createContext();

if (!import.meta.env.PROD) {
  ButtonGroupContext.displayName = 'ButtonGroupContext';
}

export default ButtonGroupContext;

export const buttonGroupClasses = {
  grouped: 'ButtonGroup-Button',
  disabled: 'ButtonGroup-disabled'
};
