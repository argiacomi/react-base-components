import React from 'react';

const ListContext = React.createContext({});

if (!import.meta.env.PROD) {
  ListContext.displayName = 'ListContext';
}

export default ListContext;

export const useListContext = () => React.useContext(ListContext);
