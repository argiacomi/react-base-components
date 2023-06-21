import * as React from 'react';

export const ListContext = React.createContext(null);
if (!import.meta.env.PROD) {
  ListContext.displayName = 'ListContext';
}
