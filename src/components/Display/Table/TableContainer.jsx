import React from 'react';
import { Paper } from '@components';
import { cn } from '@utils';

const TableContainer = ({
  children,
  className,
  Component = Paper,
  ...otherProps
}) => {
  return (
    <Component
      className={cn('w-fit', 'overflow-x-auto', className)}
      {...otherProps}
    >
      {children}
    </Component>
  );
};

TableContainer.displayName = 'TableContainer';

export default TableContainer;
