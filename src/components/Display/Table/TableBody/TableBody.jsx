import React from 'react';
import clsx from 'clsx';
import styled, { extractStyling } from '@styles';
import Tablelvl2Context from '../table/Tablelvl2Context';

export const tableBodyClasses = {
  root: 'TableBody-Root'
};

const TableBodyRoot = styled('tbody', {
  name: 'TableBody',
  slot: 'Root'
})(({ ownerState }) => ({
  display: 'table-row-group',
  ...ownerState.cssStyles
}));

const tablelvl2 = {
  variant: 'body'
};

const defaultComponent = 'tbody';

const TableBody = React.forwardRef((props, ref) => {
  const { className, component = defaultComponent, ...otherProps } = props;

  const { cssStyles, other } = extractStyling(otherProps);

  const ownerState = {
    ...props,
    component,
    cssStyles
  };

  const classes = {
    root: [tableBodyClasses.root]
  };

  return (
    <Tablelvl2Context.Provider value={tablelvl2}>
      <TableBodyRoot
        className={clsx(classes.root, className)}
        as={component}
        ref={ref}
        role={component === defaultComponent ? null : 'rowgroup'}
        ownerState={ownerState}
        {...other}
      />
    </Tablelvl2Context.Provider>
  );
});

TableBody.displayName = 'TableBody';

export default TableBody;
