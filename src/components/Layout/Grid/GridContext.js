import { createContext } from 'react';

const GridContext = createContext();

if (!import.meta.env.PROD) {
  GridContext.displayName = 'GridContext';
}

export default GridContext;
