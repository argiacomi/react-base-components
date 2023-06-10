import React from 'react';
import SnackbarContext from './SnackbarContext';
import SnackbarContainer from './SnackbarContainer';

const SnackbarProvider = ({ children }) => {
  const [snackbarQueue, setSnackbarQueue] = React.useState([]);

  const addSnackbar = (snackbar) => {
    setSnackbarQueue((oldQueue) => [...oldQueue, snackbar]);
  };

  const removeSnackbar = () => {
    setSnackbarQueue((oldQueue) => oldQueue.slice(1));
  };

  return (
    <SnackbarContext.Provider value={{ addSnackbar, removeSnackbar }}>
      {children}
      <SnackbarContainer snackbarQueue={snackbarQueue} />
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
