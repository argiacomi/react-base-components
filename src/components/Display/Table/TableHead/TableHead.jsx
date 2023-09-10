import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import Tablelvl2Context from '../table/Tablelvl2Context';

export const tableHeadClasses = {
  root: 'TableHead-Root'
};

const TableHeadRoot = styled('thead', {
  name: 'TableHead',
  slot: 'Root'
})(({ ownerState }) => ({
  display: 'table-header-group',
  ...ownerState.cssStyles
}));

const tablelvl2 = {
  variant: 'head'
};

const defaultComponent = 'thead';

const TableHead = React.forwardRef((props, ref) => {
  const { className, component = defaultComponent, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    component,
    cssStyles
  };

  const classes = {
    root: [tableHeadClasses.root]
  };

  return (
    <Tablelvl2Context.Provider value={tablelvl2}>
      <TableHeadRoot
        as={component}
        className={clsx(classes.root, className)}
        ref={ref}
        role={component === defaultComponent ? null : 'rowgroup'}
        ownerState={ownerState}
        {...other}
      />
    </Tablelvl2Context.Provider>
  );
});

TableHead.displayName = 'TableHead';

export default TableHead;
