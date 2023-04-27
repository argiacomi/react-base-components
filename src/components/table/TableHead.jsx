import React, { createContext, forwardRef } from 'react';
import { cn } from '@utils';
import Tablelvl2Context from './Tablelvl2Context';

const TableHead = forwardRef(
  ({ children, className, component: Component = 'thead', ...other }, ref) => {
    return (
      <Tablelvl2Context.Provider value={{ variant: 'head' }}>
        <Component
          className={cn(
            className,
            'text-bold table-header-group text-black dark:text-white'
          )}
          ref={ref}
          {...other}
        >
          {children}
        </Component>
      </Tablelvl2Context.Provider>
    );
  }
);

TableHead.displayName = 'TableHead';

export default TableHead;
