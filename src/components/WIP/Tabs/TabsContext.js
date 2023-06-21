import * as React from 'react';

const Context = React.createContext(null);

if (!import.meta.env.PROD) {
  Context.displayName = 'TabsContext';
}

export function useTabsContext() {
  const context = React.useContext(Context);
  if (context == null) {
    throw new Error('No TabsContext provided');
  }

  return context;
}

export default Context;
