import React from 'react';

const TableContext = React.createContext();

if (!import.meta.env.PROD) {
  TableContext.displayName = 'TableContext';
}

export default TableContext;

export const useTableContext = () => {
  return React.useContext(TableContext);
};
