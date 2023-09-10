import React from 'react';

const Tablelvl2Context = React.createContext();

if (!import.meta.env.PROD) {
  Tablelvl2Context.displayName = 'Tablelvl2Context';
}

export default Tablelvl2Context;

export const useTablelvl2Context = () => {
  return React.useContext(Tablelvl2Context);
};
