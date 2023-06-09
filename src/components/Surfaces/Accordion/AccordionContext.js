import React from 'react';

const AccordionContext = React.createContext({});

if (!import.meta.env.PROD) {
  AccordionContext.displayName = 'AccordionContext';
}

export default AccordionContext;
