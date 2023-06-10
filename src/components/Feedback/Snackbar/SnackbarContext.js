import React from 'react';

export const SnackbarContext = React.createContext();

if (!import.meta.env.PROD) {
  SnackbarContext.displayName = 'SnackbarContext';
}

export const useSnackbarQueue = () => {
  const context = React.useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbarQueue must be used within a SnackbarProvider');
  }
  return context;
};
