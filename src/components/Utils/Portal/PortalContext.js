import React from 'react';

const PortalContext = React.createContext(null);

if (!import.meta.env.PROD) {
  PortalContext.displayName = 'PortalContext';
}

const usePortalContext = () => React.useContext(PortalContext);

export { PortalContext, usePortalContext };
