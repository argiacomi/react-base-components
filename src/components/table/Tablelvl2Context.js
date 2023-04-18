import { createContext } from 'react';

const Tablelvl2Context = createContext();

if (process.env.NODE_ENV !== 'production') {
  Tablelvl2Context.displayName = 'Tablelvl2Context';
}

export default Tablelvl2Context;
