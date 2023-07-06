import React from 'react';

const ListItemContext = React.createContext(null);
if (!import.meta.env.PROD) {
  ListItemContext.displayName = 'ListItemContext';
}

export function useListItemContext() {
  if (React.useContext(ListItemContext) == null) {
    throw new Error('No ListItemContext provided');
  }

  return React.useContext(ListItemContext);
}

export default ListItemContext;
