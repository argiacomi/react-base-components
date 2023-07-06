import React from 'react';

const DialogContext = React.createContext({});

if (!import.meta.env.PROD) {
  DialogContext.displayName = 'DialogContext';
}

export default DialogContext;

export function useDialogContext() {
  return React.useContext(DialogContext);
}
