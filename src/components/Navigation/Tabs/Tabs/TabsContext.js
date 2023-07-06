import React from 'react';

const TabsContext = React.createContext(null);

if (!import.meta.env.PROD) {
  TabsContext.displayName = 'TabsContext';
}

export function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (context == null) {
    throw new Error('No TabsContext provided');
  }

  return context;
}

export default TabsContext;
