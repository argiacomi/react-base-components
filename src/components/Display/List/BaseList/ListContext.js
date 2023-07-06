import React from 'react';

const ListContext = React.createContext(null);
if (!import.meta.env.PROD) {
  ListContext.displayName = 'ListContext';
}

export function useListContext() {
  if (React.useContext(ListContext) == null) {
    throw new Error('No ListContext provided');
  }

  return React.useContext(ListContext);
}

export default ListContext;
