import { createContext } from 'react';

const GridContext = createContext();

if (process.env.NODE_ENV !== 'production') {
  GridContext.displayName = 'GridContext';
}

export default GridContext;
