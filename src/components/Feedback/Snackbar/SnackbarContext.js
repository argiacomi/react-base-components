import React from 'react';

export const SnackbarContext = React.createContext({});

if (!import.meta.env.PROD) {
  SnackbarContext.displayName = 'SnackbarContext';
}

SnackbarContext;

export const useSnackbarQueue = () => React.useContext(SnackbarContext);
