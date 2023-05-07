import React, { forwardRef } from 'react';
import Tablelvl2Context from './Tablelvl2Context';

const TableFooter = forwardRef(
  ({ className, component: Component = 'tfoot', ...other }, ref) => {
    const contextValue = { variant: 'footer' };

    return (
      <Tablelvl2Context.Provider value={contextValue}>
        <Component ref={ref} className={className} {...other} />
      </Tablelvl2Context.Provider>
    );
  }
);

TableFooter.displayName = 'TableFooter';

export default TableFooter;
