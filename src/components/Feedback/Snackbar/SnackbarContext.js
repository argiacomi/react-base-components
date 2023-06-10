import React from 'react';

const SnackbarContext = React.createContext();

if (!import.meta.env.PROD) {
  SnackbarContext.displayName = 'SnackbarContext';
}

export default SnackbarContext;

export const useSnackbarQueue = () => React.useContext(SnackbarContext);
